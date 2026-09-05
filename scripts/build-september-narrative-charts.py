from __future__ import annotations

import pickle
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle


ROOT = Path(__file__).resolve().parents[1]
CACHE = Path(
    "/Users/ousmane/Desktop/2025 - Documentations/Python/Economics/Genesis Engine/Genesis_/Data_Center/Global Data Center.pkl"
)
STORY = ROOT / "public/charts/Story Line"
EQUITIES = ROOT / "public/charts/Equities"
EXECUTION = ROOT / "public/charts/Trading Execution"

SLATE = "#455a64"
BLUE = "#0b7dcc"
RED = "#c2412d"
GOLD = "#d69e2e"
INK = "#111827"
GRID = "#d7dde3"

plt.rcParams.update(
    {
        "font.family": "DejaVu Sans",
        "font.size": 9,
        "axes.edgecolor": "#111111",
        "axes.linewidth": 1.0,
        "svg.fonttype": "none",
    }
)


def clean(series: pd.Series) -> pd.Series:
    out = pd.to_numeric(series, errors="coerce").dropna().copy()
    out.index = pd.to_datetime(out.index, errors="coerce")
    out = out[~out.index.isna()].sort_index()
    try:
        if out.index.tz is not None:
            out.index = out.index.tz_localize(None)
    except AttributeError:
        pass
    return out[~out.index.duplicated(keep="last")]


def daily_last(series: pd.Series) -> pd.Series:
    out = clean(series)
    return out.groupby(out.index.normalize()).last()


def market_close(ohlc: dict, key: str) -> pd.Series:
    return daily_last(ohlc[key]["close"])


def style_axis(ax, *, zero: float | None = None) -> None:
    ax.spines["top"].set_visible(True)
    ax.spines["right"].set_visible(True)
    ax.tick_params(direction="in", length=5, width=1, colors=INK)
    ax.grid(False)
    if zero is not None:
        ax.axhline(zero, color="#222222", lw=0.8, zorder=0)


def callout(ax, text: str, x: float, y: float, *, color: str = SLATE, align: str = "center") -> None:
    ax.text(
        x,
        y,
        text,
        transform=ax.transAxes,
        ha=align,
        va="center",
        fontsize=8,
        fontweight="semibold",
        color=color,
        bbox={"facecolor": "white", "edgecolor": "none", "alpha": 0.92, "pad": 3.5},
        zorder=20,
    )


def footer(fig, text: str) -> None:
    fig.text(0.08, 0.018, text, ha="left", va="bottom", fontsize=7.2, color=INK)


def save(fig, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, format="svg", transparent=True, bbox_inches="tight", pad_inches=0.12)
    plt.close(fig)


def manufacturing_chart(data: dict) -> None:
    pmi = clean(data["US: ISM MANUFACTURING INDEX (MOM)"]).loc["2019":]
    orders = clean(data["US: ISM MANUFACTURING NEW ORDERS (MOM)"]).loc["2019":]
    employment = clean(data["US: ISM MANUFACTURING EMPLOYMENT (MOM)"]).loc["2019":]
    prices = clean(data["US: ISM MANUFACTURING PRICE (MOM)"]).loc["2019":]
    oil = clean(data["US: OIL"]).loc["2019":]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6.8), sharex=True, gridspec_kw={"hspace": 0.08})
    ax1.plot(pmi.index, pmi, color=SLATE, lw=1.7, label="ISM MANUFACTURING")
    ax1.plot(orders.index, orders, color=BLUE, lw=1.35, label="NEW ORDERS")
    ax1.plot(employment.index, employment, color=GOLD, lw=1.25, label="EMPLOYMENT")
    ax1.axhline(50, color="#333333", lw=0.8)
    ax1.set_ylabel("INDEX")
    ax1.set_ylim(30, 66)
    ax1.legend(loc="upper left", frameon=False, ncol=3, fontsize=8)
    callout(ax1, "ACTIVITY REMAINS\nEXPANSIONARY", 0.70, 0.80)
    style_axis(ax1)

    ax2.plot(prices.index, prices, color=RED, lw=1.6, label="ISM PRICES (LS)")
    ax2.set_ylabel("INDEX")
    ax2.set_ylim(20, 95)
    ax2b = ax2.twinx()
    ax2b.plot(oil.index, oil, color=SLATE, lw=1.35, label="WTI OIL (RS)")
    ax2b.set_ylabel("$/BBL")
    ax2b.set_ylim(20, max(120, float(oil.loc["2020":].max()) * 1.08))
    lines = ax2.lines + ax2b.lines
    ax2.legend(lines, [line.get_label() for line in lines], loc="upper left", frameon=False, ncol=2, fontsize=8)
    callout(ax2, "OIL KEEPS INPUT\nCOSTS HIGH", 0.70, 0.78, color=RED)
    style_axis(ax2)
    style_axis(ax2b)
    ax2.xaxis.set_major_locator(mdates.YearLocator())
    ax2.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    fig.subplots_adjust(left=0.08, right=0.92, top=0.97, bottom=0.09)
    footer(fig, "SOURCES: INSTITUTE FOR SUPPLY MANAGEMENT; GENESIS RESEARCH. DATA THROUGH AUGUST 2026.")
    save(fig, STORY / "oil-shock-keeps-manufacturing-prices-hot_2026-09-01.svg")


def services_chart(data: dict) -> None:
    activity = clean(data["US: ISM NON-MANUFACTURING BUSINESS ACTIVITY INDEX (MOM)"]).loc["2019":]
    orders = clean(data["US: ISM MANUFACTURING NON-MANUFACTURING NEW ORDERS (MOM)"]).loc["2019":]
    employment = clean(data["US: ISM MANUFACTURING NON-MANUFACTURING EMPLOYMENT (MOM)"]).loc["2019":]
    prices = clean(data["US: ISM MANUFACTURING NON-MANUFACTURING PRICES (MOM)"]).loc["2019":]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6.8), sharex=True, gridspec_kw={"hspace": 0.08})
    ax1.plot(activity.index, activity, color=SLATE, lw=1.65, label="BUSINESS ACTIVITY")
    ax1.plot(orders.index, orders, color=BLUE, lw=1.4, label="NEW ORDERS")
    ax1.axhline(50, color="#333333", lw=0.8)
    ax1.set_ylabel("INDEX")
    ax1.set_ylim(25, 70)
    ax1.legend(loc="upper left", frameon=False, ncol=2, fontsize=8)
    callout(ax1, "SERVICES DEMAND\nACCELERATES", 0.70, 0.80)
    style_axis(ax1)

    ax2.plot(prices.index, prices, color=RED, lw=1.6, label="PRICES")
    ax2.plot(employment.index, employment, color=GOLD, lw=1.35, label="EMPLOYMENT")
    ax2.axhline(50, color="#333333", lw=0.8)
    ax2.set_ylabel("INDEX")
    ax2.set_ylim(30, 85)
    ax2.legend(loc="upper left", frameon=False, ncol=2, fontsize=8)
    callout(ax2, "PRICES OUTRUN HIRING", 0.72, 0.76, color=RED)
    style_axis(ax2)
    ax2.xaxis.set_major_locator(mdates.YearLocator())
    ax2.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    fig.subplots_adjust(left=0.08, right=0.94, top=0.97, bottom=0.09)
    footer(fig, "SOURCE: INSTITUTE FOR SUPPLY MANAGEMENT. DATA THROUGH AUGUST 2026.")
    save(fig, STORY / "services-strength-extends-the-hawkish-mix_2026-09-03.svg")


def payroll_chart(data: dict) -> None:
    nfp = clean(data["US: NONFARM PAYROLLS (MoM)"]).loc["2022":] / 1000
    adp = clean(data["US: ADP EMPLOYMENT CHANGE (MoM)"]).loc["2022":] / 1000
    nfp_ma = nfp.rolling(3).mean()

    fig, ax = plt.subplots(figsize=(12, 5.8))
    width = 18
    ax.bar(nfp.index, nfp, width=width, color=SLATE, alpha=0.92, label="NFP")
    ax.bar(adp.index, adp, width=width * 0.55, color=BLUE, alpha=0.90, label="ADP")
    ax.plot(nfp_ma.index, nfp_ma, color=GOLD, lw=1.8, label="NFP 3M MA")
    ax.axhline(0, color="#222222", lw=0.9)
    ax.axhline(200, color="#222222", lw=0.7)
    ax.set_ylabel("THOUSANDS")
    ax.set_ylim(-180, 620)
    ax.legend(loc="upper left", frameon=False, ncol=3, fontsize=8)
    callout(ax, "PAYROLLS REBOUND\nTO 162K", 0.70, 0.78)
    style_axis(ax)
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    fig.subplots_adjust(left=0.08, right=0.96, top=0.96, bottom=0.12)
    footer(fig, "SOURCES: U.S. BUREAU OF LABOR STATISTICS; ADP; GENESIS RESEARCH. DATA THROUGH AUGUST 2026.")
    save(fig, STORY / "payroll-rebound-reopens-hike-risk_2026-09-04.svg")


def equity_chart(ohlc: dict) -> None:
    us30 = market_close(ohlc, "US30 [1D]")
    two = market_close(ohlc, "US: 2-YEAR TREASURY YIELD [1D]")
    ten = market_close(ohlc, "US: 10-YEAR TREASURY YIELD [1D]")
    frame = pd.concat({"US30": us30, "2Y": two, "10Y": ten}, axis=1, join="inner").dropna().loc["2026-05":]
    ret = frame["US30"].pct_change() * 100
    corr2 = ret.rolling(21, min_periods=10).corr(frame["2Y"].diff())
    corr10 = ret.rolling(21, min_periods=10).corr(frame["10Y"].diff())

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6.8), sharex=True, gridspec_kw={"hspace": 0.08})
    ax1.plot(frame.index, frame["US30"], color=SLATE, lw=1.7, label="US30 (LS)")
    ax1.set_ylabel("INDEX")
    ax1b = ax1.twinx()
    ax1b.plot(frame.index, frame["2Y"], color=RED, lw=1.2, label="2Y YIELD (RS)")
    ax1b.plot(frame.index, frame["10Y"], color=GOLD, lw=1.2, label="10Y YIELD (RS)")
    ax1b.set_ylabel("%")
    lines = ax1.lines + ax1b.lines
    ax1.legend(lines, [line.get_label() for line in lines], loc="upper left", frameon=False, ncol=3, fontsize=8)
    callout(ax1, "YIELDS REPRICE\nEQUITIES LOWER", 0.70, 0.78, color=RED)
    style_axis(ax1)
    style_axis(ax1b)

    ax2.plot(corr2.index, corr2, color=BLUE, lw=1.4, label="US30–2Y YIELD CORR 21D")
    ax2.plot(corr10.index, corr10, color=SLATE, lw=1.5, label="US30–10Y YIELD CORR 21D")
    ax2.axhline(0, color="#222222", lw=0.8)
    ax2.set_ylabel("CORRELATION")
    ax2.set_ylim(-1.05, 1.05)
    ax2.legend(loc="upper left", frameon=False, ncol=2, fontsize=8)
    callout(ax2, "GOOD NEWS BECOMES BAD", 0.72, 0.22, color=RED)
    style_axis(ax2)
    ax2.xaxis.set_major_locator(mdates.MonthLocator())
    ax2.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    fig.subplots_adjust(left=0.08, right=0.92, top=0.97, bottom=0.11)
    footer(fig, "SOURCE: GENESIS RESEARCH. CORRELATION = EQUITY RETURN VS. CHANGE IN TREASURY YIELD, 21 DAYS.")
    save(fig, EQUITIES / "good-news-turns-bad-as-yields-reprice_2026-09-04.svg")


def gold_execution_chart(ohlc: dict) -> None:
    gold = ohlc["GOLD [1m]"].copy()
    gold.index = pd.to_datetime(gold.index)
    gold = gold.loc["2026-09-04 08:20":"2026-09-04 10:45"]
    dxy = ohlc["DXY [1m]"]["close"].copy()
    dxy.index = pd.to_datetime(dxy.index)
    dxy = dxy.loc[gold.index.min():gold.index.max()]
    us30 = ohlc["US30 [1m]"]["close"].copy()
    us30.index = pd.to_datetime(us30.index)
    us30 = us30.loc[gold.index.min():gold.index.max()]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7.2), sharex=True, gridspec_kw={"height_ratios": [2.1, 1], "hspace": 0.08})
    x = mdates.date2num(gold.index.to_pydatetime())
    candle_width = 0.00052
    for xpos, (_, row) in zip(x, gold.iterrows()):
        color = BLUE if row["close"] >= row["open"] else RED
        ax1.vlines(xpos, row["low"], row["high"], color=color, lw=0.65, zorder=2)
        low = min(row["open"], row["close"])
        height = max(abs(row["close"] - row["open"]), 0.35)
        ax1.add_patch(Rectangle((xpos - candle_width / 2, low), candle_width, height, facecolor=color, edgecolor=color, lw=0.4))
    ax1.axvspan(pd.Timestamp("2026-09-04 08:30"), pd.Timestamp("2026-09-04 08:35"), color=RED, alpha=0.08)
    ax1.axhspan(4360, 4380, color=BLUE, alpha=0.10)
    ax1.axhline(4365.25, color=BLUE, lw=0.9, ls="--")
    ax1.set_ylabel("$/OZ")
    ax1.set_ylim(float(gold["low"].min()) - 12, float(gold["high"].max()) + 14)
    callout(ax1, "NEAR-$100 NFP FLUSH", 0.26, 0.18, color=RED)
    callout(ax1, "61.8 SUPPORT HOLDS", 0.68, 0.25, color=BLUE)
    style_axis(ax1)

    common = pd.concat({"DXY": clean(dxy), "US30": clean(us30)}, axis=1, join="inner").dropna()
    indexed = common / common.iloc[0] * 100
    ax2.plot(indexed.index, indexed["DXY"], color=BLUE, lw=1.4, label="DXY, INDEXED")
    ax2.plot(indexed.index, indexed["US30"], color=SLATE, lw=1.4, label="US30, INDEXED")
    ax2.axhline(100, color="#222222", lw=0.8)
    ax2.set_ylabel("08:20 = 100")
    ax2.legend(loc="upper left", frameon=False, ncol=2, fontsize=8)
    callout(ax2, "DOLLAR SPIKE FADES", 0.64, 0.74)
    style_axis(ax2)
    ax2.xaxis.set_major_locator(mdates.MinuteLocator(interval=20))
    ax2.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
    fig.subplots_adjust(left=0.08, right=0.96, top=0.97, bottom=0.11)
    footer(fig, "SOURCE: GENESIS RESEARCH, 1-MINUTE DATA. SHADED AREAS: NFP RELEASE AND 61.8 SUPPORT ZONE. 4 SEPTEMBER 2026, ET.")
    save(fig, EXECUTION / "gold-flush-finds-61-8-support_2026-09-04.svg")


def main() -> None:
    with CACHE.open("rb") as handle:
        payload = pickle.load(handle)
    data = payload["data"]
    ohlc = payload["ohlc"]
    manufacturing_chart(data)
    services_chart(data)
    payroll_chart(data)
    equity_chart(ohlc)
    gold_execution_chart(ohlc)
    print("Built five September narrative charts.")


if __name__ == "__main__":
    main()
