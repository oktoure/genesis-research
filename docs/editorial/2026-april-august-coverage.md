# Genesis editorial coverage: April-August 2026

Updated: 29 August 2026

## Purpose

This is the operating inventory for rebuilding the missing April-August research record without mixing macro interpretation, asset expression, and precision execution.

Every major release can produce two distinct artifacts inside one chronological **Story Line**:

1. **Macro read** — a Genesis research chart frozen to the event's as-of date. It explains the mechanism, reaction function, cross-asset transmission, confirmation, and invalidation.
2. **Trading expression** — a Trading Platform chart only when a defensible setup existed at that time. It records direction, anchors, entry zone, invalidation, targets, and replay outcome. It is posted under **Trading Ideas**, not presented as the original macro chart.

The two artifacts may share a catalyst, but they must never be duplicated as if they answer the same question.

## Story Line contract

**Story Line** replaces the old **Labor Market** website category. It is the ordered macro record, not a subject-matter bucket. Each entry carries a stage so labor, inflation, FOMC, unscheduled shocks, synthesis, positioning, trade updates, and targets can coexist without being confused.

The sequence is:

1. **Fact** — what was known at the release timestamp: Labor, Inflation, FOMC, or Unscheduled.
2. **Interpretation** — how the information changes the Fed reaction function and the balance of risks.
3. **Financial Conditions** — transmission through the 2-year yield, 10-year yield, curve, DXY, real yields, and risk assets.
4. **Positioning** — the prospective asset expression only after the evidence chain is complete.
5. **Trade Update / Target Reached** — execution evidence and outcome, kept separate from the original thesis.

The website retains the legacy `date` field but now accepts `publishedAt` with an exact Eastern timestamp and `storyType` with the stage. If the source does not provide an intraday time, keep a date-only record; do not manufacture precision. Paired positive/negative Trading macro markers should become one website fact article rather than duplicate articles.

## Recurring release structure

| Story type | Required anchor | Core question | Primary confirmations | Typical expressions |
|---|---|---|---|---|
| Labor Market | NFP / Employment Situation | Is labor demand accelerating, cooling, or breaking? | unemployment, participation, hours, earnings, revisions, claims, JOLTS | Gold, DXY, US 10Y, US30 |
| CPI | CPI release | Is disinflation broadening or only coming from energy/base effects? | core, shelter, services ex-housing, energy, breakevens | Gold, DXY, US 10Y, US30 |
| FOMC Decision | statement and press conference | Did the reaction function become more hawkish or dovish? | vote split, guidance, projections, financial conditions | DXY, Gold, US 10Y, US30 |
| FOMC Minutes | minutes released three weeks later | What did the internal distribution of risks reveal? | hike/cut preferences, balance-sheet discussion, inflation and labor risk balance | DXY, Gold, US 10Y |
| Unscheduled | policy, geopolitical, liquidity, or cross-asset shock | Did the shock change the regime or only the tactical path? | duration, dollar, oil, breakevens, credit, equities | asset-specific |

## Official event spine

All times below are Eastern Time unless the chart explicitly applies a server offset.

| Month | Labor | CPI | FOMC decision | FOMC minutes / unscheduled |
|---|---|---|---|---|
| April | Apr 3, 08:30 | Apr 10, 08:30 | Apr 29, 14:00 | Mar minutes: Apr 8, 14:00 |
| May | May 8, 08:30 | May 12, 08:30 | No scheduled decision | Apr minutes: May 20, 14:00 |
| June | Jun 5, 08:30 | Jun 10, 08:30 | Jun 17, 14:00 official release; Genesis trading marker retained at 21:00 | — |
| July | Jul 2, 08:30 | Jul 14, 08:30 | Jul 29, 14:00 | Jun minutes: Jul 8, 14:00 |
| August | Aug 7, 08:30 | Aug 12, 08:30 | No scheduled decision | Jul minutes: Aug 19, 14:00; Treasury long-end buyback announcement: Aug 19 |

The August 19 Treasury notice did not state an intraday publication time. The Trading Platform uses noon as a transparent release-day chart anchor rather than inventing precision.

## Current website inventory

The local website data contains 130 insights. Coverage in the target window is uneven:

| Month | Existing posts | What exists | Priority gaps |
|---|---:|---|---|
| April | 7 | economics, equities, DXY / currencies | release-specific NFP; CPI release read; March minutes; Apr FOMC decision; all precision trading expressions |
| May | 0 | none | complete month: NFP, CPI, Apr minutes, normal asset reads, and defensible trading expressions |
| June | 13 | labor, CPI/inflation, growth, monetary-policy context, Gold and equities | Jun FOMC decision pair; explicit DXY and US 10Y asset reads; precision trading expressions |
| July | 4 | labor softening, CPI/disinflation, long-Gold idea, and initial execution | Jun minutes; explicit Jul FOMC decision; supporting DXY and curve facts before the trade |
| August | 13 | labor, inflation/PCE, dollar, yield curve, term premium, equities, Gold thesis, target reached, and Warsh policy update | release-specific CPI/NFP audit; Jul minutes; Treasury intervention; any missing no-trade decisions |

An SVG existing in `public/charts` does not count as published coverage unless it is referenced by `app/data/insights.json`.

## Backfill queue

### P0 — restore the macro spine

- May: NFP, CPI, April FOMC minutes. This is the largest completely empty month.
- July: add the June FOMC minutes and explicit July FOMC decision around the existing labor, CPI, Gold idea, and execution chain.
- August: audit the release-specific NFP and CPI coverage, then add July FOMC minutes and the August 19 Treasury intervention where they change the view.
- June: add the missing hawkish FOMC decision read and retain the paired negative/positive asset transmission already restored in the Trading Platform calendar.
- April: add a release-specific NFP read and explicit April FOMC decision read; decide whether the existing inflation-pipeline post is sufficient as the CPI anchor or needs a dedicated release article.

### July 27-August trade reconstruction

Rebuild this idea prospectively, in timestamp order:

1. Publish the July labor, June FOMC minutes, July CPI, and July FOMC facts at their actual release times.
2. Summarize the reaction function: tighter labor and higher inflation preserve hawkish flexibility; easier labor and lower inflation do the opposite.
3. Add the three financial-condition charts: 10-year yield 3-month change versus weekly growth, DXY versus weekly growth, and the combined financial-conditions measure.
4. Freeze the market-state charts through July 30: Gold versus inverted DXY, Gold versus the 2-year yield, and Gold versus the 10Y-2Y curve on matching 1-hour data.
5. Only then record the bullish-Gold positioning, its invalidation and targets, the live trade update, and the eventual target-reached evidence.

This chain is the first complete Story Line template. It should be generalized only after the facts, interpretation, market state, and trade outcome read correctly as one sequence.

### P1 — build the asset layer

For each month, audit Gold, DXY, and US 10Y separately. Create a normal research chart only where the macro mechanism materially changed. Do not force three asset posts from the same unchanged signal.

### P2 — add execution evidence

For each P0 catalyst, open the Trading Platform in historical replay, freeze the chart at the decision timestamp, and post a Trading Idea only if the setup had observable structure and valid risk/reward at that time. A no-trade conclusion is acceptable and should remain in the audit rather than be converted into a hindsight trade.

## Required article metadata

Each backfilled article should record:

- **Data through / as of:** exact snapshot timestamp.
- **Published at:** exact release/post timestamp in Eastern Time when known.
- **Story type:** Labor, Inflation, FOMC, Unscheduled, Financial Conditions, Positioning, Trade Update, or Target Reached.
- **Catalyst:** scheduled release, minutes, or unscheduled shock.
- **Mechanism:** data -> Fed reaction function -> rates/real yields -> dollar -> risk assets.
- **Confirmation:** the next data or market series that must agree.
- **Divergence:** what would contradict the primary thesis.
- **Lag:** immediate, several sessions, or medium-term.
- **Expression:** research only, Trading Idea, or no trade.
- **Invalidation:** both macro and price-structure invalidation where relevant.

## Publishing workflow

1. In the Viewer, enter the event date or timestamp in **Historical snapshot / as-of date**. This is a data cutoff and is independent of X-range.
2. Confirm the status line reports the latest included observation and export the SVG. The filename includes the as-of date.
3. In the Trading Platform, enable historical replay, select the timestamp, and export the current vector SVG.
4. Use **Genesis Post** to create the local website entry. Enter the exact ET time and Story Line stage. The publisher validates the SVG, backs up `insights.json`, assigns the next ID when blank, and writes the chart and article atomically.
5. Review the local website before deployment. The publisher does not deploy to Vercel by itself.

## Primary sources

- BLS Employment Situation calendar: https://www.bls.gov/cps/publications/release-calendar.htm
- BLS CPI calendar: https://www.bls.gov/schedule/news_release/cpi.htm
- Federal Reserve FOMC calendar: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
- Treasury August 19 buyback notice: https://home.treasury.gov/news/press-releases/sb0607/
