import fs from "node:fs";
import path from "node:path";

const replacements = new Map([
  ["DETERIORATING GROWTH IS DRIVING A BULL STEEPENING AS MARKETS PRICE OUT FURTHER HIKES AND A PROLONGED HIGHER-FOR-LONGER STANCE", "WEAKER GROWTH DRIVES BULL STEEPENING"],
  ["REINFORCING DOWNSIDE PRESSURE ON THE DOLLAR, AND PLAYING AS A HEAD- WIND FOR GOLD IN Q3.", "DOLLAR WEAKNESS SUPPORTS GOLD"],
  ["WHILE THE 10-YEAR DID NOT WEAKEN, THE 2-YEAR DID FALL WITH THE LABOR MARKET SOFTENS, HENCE THE YIELD CURVE WAS MORE POWERFUL TO FORECAST THE GOLD MOUVEMENT THAN GOLD ITSELF", "CURVE STEEPENING LEADS GOLD"],
  ["BULL STEEPENING, AND A LOWER DOLLAR SHOULD PUSH GOLD HIGHER", "STEEPENING AND DOLLAR WEAKNESS SUPPORT GOLD"],
  ["HIGHER INFLATION COUPLED WITH A POSITIVE ECONOMIC MOMENTUM PROMTED A TIGHTER FINANCIAL CONDITION ENVIRONMENT WHICH IS NEGATIVE FOR THE BULLION", "TIGHTER CONDITIONS PRESSURE GOLD"],
  ["AS UNCERTAINTY FROM THE GEOPOLITICAL RISK PREMIUM FADES, THE DOLLAR HAS STARTED TO FADE AFTER ATTEMPTING TO BREAK THE RESISTANCE, HENCE, FALSE BDREAK-OUT", "DOLLAR BREAKOUT FAILS AS RISK FADES"],
  ["INTEREST RATE DIFFERENTIAL IS REFLECTING A HEADWIND FOR THE DOLLAR.", "RATE DIFFERENTIALS PRESSURE THE DOLLAR"],
  ["DETERIORATING GROWTH REDUCES HIKE EXPECTATIONS, DRIVING A BULL STEEPENING.", "WEAKER GROWTH DRIVES BULL STEEPENING"],
  ["RISING TERM PREMIUM KEEPS LONG-END YIELDS ELEVATED", "TERM PREMIUM KEEPS YIELDS ELEVATED"],
  ["FISCAL RISKS AND POLICY UNCERTAINTY LIFT TERM PREMIUM", "FISCAL UNCERTAINTY LIFTS TERM PREMIUM"],
  ["DETERIORATING GROWTH IS PULLING REAL YIELDS LOWER", "WEAKER GROWTH LOWERS REAL YIELDS"],
  ["GOLD BOND YIELD CORRELATION HAD REVERTED IN NEGATIVE TERRITORY WHICH MAY NOT LAST", "GOLD-YIELD CORRELATION TURNS NEGATIVE"],
  ["RETRACEMENT IN PROCESS, SEPTEMBER ROUND OF DATA SHOULD PUSH INVESTORS TO RE- ASSESS CURRENT UNCERTAINTY", "SEPTEMBER DATA WILL REPRICE UNCERTAINTY"],
  ["HEADLINE LEAPS TO 18.7; ORDERS, SHIPMENTS, AND EMPLOYMENT FIRM—REBOUND INTACT.", "FACTORY REBOUND REMAINS INTACT"],
  ["ODDS FADED POST-MEETING TOWARD ~25%, THEN WILLIAMS REVIVED THEM ABOVE 50%—MINUTES SAY “MEASURED,” DATA DECIDE; DECEMBER IS LIVE, NOT LOCKED.", "DECEMBER REMAINS DATA-DEPENDENT"],
  ["SENTIMENT INCHES OFF LOWS WHILE GDP STAYS FIRM — GROWTH LIKELY COOLS NEXT.", "GROWTH HOLDS; MOMENTUM MAY COOL"],
  ["DECEMBER CUT ODDS JUMPED ~40% → ~81% IN A WEEK — POLICY BIAS EASES.TRANSMISSION → FX/SPREADS EASE FIRST; GOLD ↑ ON DIPS, YIELDS FOLLOW LATER.", "CUT ODDS REPRICE SHARPLY HIGHER"],
  ["EXPECTATIONS JUMP TO 55 (FROM 51) — FORWARD RISK EASES.", "EXPECTATIONS REBOUND; FORWARD RISK EASES"],
  ["BACK TO −3.9 FROM 18.7 — REBOUND STALLS AS SHIPMENTS FALL, ORDERS FLAT.", "FACTORY REBOUND STALLS"],
  ["MARKET INFLATION EXPECTATIONS MEASURES POINTS TO A GEOPOLITICAL RISK PREMIUM FULLY PRICED-IN", "GEOPOLITICAL PREMIUM FULLY PRICED"],
  ["FALLING INFLATION EXPECTATIONS GIVES THE FLEXIBILITY TO THE FED TO RE-ANCHOR THEIR GUIDANCE", "LOWER EXPECTATIONS RESTORE FED FLEXIBILITY"],
  ["GOLD CONTINUE TO RISE WHILE YIELD STAYS ELEVATED", "GOLD RISES DESPITE ELEVATED YIELDS"],
  ["GROWTH DRIVES MARKETS: GOOD NEWS IS GOOD NEWS", "GROWTH REGIME REWARDS GOOD NEWS"],
  ["INFLATION DRIVES MARKETS: GOOD NEWS IS BAD NEWS.", "INFLATION REGIME PUNISHES GOOD NEWS"],
  ["INFLATION REMAIN THE FOCUS, AS ELEVATED YIELD PUTS PRESSURE ON EQUITIES.", "ELEVATED YIELDS PRESSURE EQUITIES"],
  ["THE MOVEMENT OF THE YIELD CURVE SUGGEST THAT GOLD MIGHT RETRACE EVEN FURTHER BEFORE TURNING BACK LONG", "BEAR FLATTENING EXTENDS GOLD RETRACEMENT"],
]);

const excludedPrefix = /^(?:SOURCE|SOURCES|NOTE|NOTES|DATA THROUGH|ANN % CHG|STD DEV|QUARTERLY|MONTHLY|WEEKLY|DAILY|YEARLY|INDEX|RATE|RATIO|LEVEL|BPS|TH|MN|DXY|\$\/OZ|\$\/BRL|%|\*)\b/i;
const legendMarker = /(?:\((?:LS|RS|INV\.?|LHS|RHS)\)|\bMA\s*\d+\b|\bMOVING AVERAGE\b|^US:|^GOLD\*?$)/i;
const pureBlack = /^(?:rgb\(0,\s*0,\s*0\)|#000(?:000)?|black)$/i;
const textPattern = /<((?:[\w]+:)?text)\b([^>]*class="annotation-text"[^>]*)>([\s\S]*?)<\/\1>/g;

function decodeText(inner) {
  return inner.replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&gt;", ">").replaceAll("&lt;", "<").replace(/\s+/g, " ").trim();
}

function isNarrativeCallout(attributes, text) {
  const style = attributes.match(/style="([^"]*)"/)?.[1] ?? "";
  const size = Number(style.match(/font-size:\s*([\d.]+)px/)?.[1] ?? 0);
  const fill = style.match(/fill:\s*([^;]+)/)?.[1]?.trim() ?? "";
  const letters = text.match(/[A-Za-z]/g)?.length ?? 0;
  const uppercase = text.match(/[A-Z]/g)?.length ?? 0;
  if (size < 8 || !fill || pureBlack.test(fill)) return false;
  if (!text || excludedPrefix.test(text) || legendMarker.test(text)) return false;
  return !letters || uppercase / letters >= 0.68;
}

function concise(text) {
  const mapped = replacements.get(text);
  if (mapped) return mapped;
  let clause = text.replace(/[“”"]/g, "").replace(/\s*\.\.\.+\s*/g, " ").replace(/\s+/g, " ").trim();
  clause = clause.split(/\s*(?:—|–|;|\.(?:\s|$)|\?(?:\s|$)|!(?:\s|$))\s*/)[0] || clause;
  const commaClause = clause.split(/\s*,\s*/)[0];
  if (commaClause.split(/\s+/).length >= 3) clause = commaClause;
  clause = clause.replace(/^(?:AND|BUT|WHILE|AS|WITH|MEANWHILE|CONSEQUENTLY|HENCE|THEREFORE)\s+/i, "");
  return clause.split(/\s+/).filter(Boolean).slice(0, 6).join(" ").replace(/[,:;.]+$/, "").toUpperCase();
}

const insights = JSON.parse(fs.readFileSync("app/data/insights.json", "utf8"));
const chartFiles = [...new Set(insights.map((insight) => path.join("public", insight.chartPath ?? "")).filter((file) => fs.existsSync(file)))];
let changedFiles = 0;
let changedCallouts = 0;

for (const file of chartFiles) {
  const original = fs.readFileSync(file, "utf8");
  const updated = original.replace(textPattern, (match, tag, attributes, inner) => {
    const plainText = decodeText(inner);
    if (!isNarrativeCallout(attributes, plainText)) return match;
    const replacement = concise(plainText);
    const nextAttributes = attributes.replace(/font-size:\s*[\d.]+px/, "font-size: 8px");
    const escaped = replacement.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const next = `<${tag}${nextAttributes}>${escaped}</${tag}>`;
    if (next !== match) changedCallouts += 1;
    return next;
  });
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changedFiles += 1;
  }
}

console.log(`Normalized ${changedCallouts} callouts across ${changedFiles} SVG files.`);
