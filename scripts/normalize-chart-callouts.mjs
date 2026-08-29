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
const protectedCalloutPattern = /<rect\b([^>]*class="bg"[^>]*)\/>\s*<((?:[\w]+:)?text)\b([^>]*class="annotation-text"[^>]*)>([\s\S]*?)<\/\2>/g;

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

function balancedLines(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 5 && text.length <= 28) return [text];

  let best = [text];
  let bestScore = Number.POSITIVE_INFINITY;
  for (let split = 1; split < words.length; split += 1) {
    const left = words.slice(0, split).join(" ");
    const right = words.slice(split).join(" ");
    const score = Math.max(left.length, right.length) + Math.abs(left.length - right.length) * 0.35;
    if (score < bestScore) {
      best = [left, right];
      bestScore = score;
    }
  }
  return best;
}

function setAttribute(attributes, name, value) {
  const pattern = new RegExp(`\\b${name}="[^"]*"`);
  if (pattern.test(attributes)) return attributes.replace(pattern, `${name}="${value}"`);
  return `${attributes} ${name}="${value}"`;
}

function protectedRectAttributes(rectAttributes, textAttributes, lines) {
  const textX = Number(textAttributes.match(/\bx="([\d.-]+)"/)?.[1] ?? 0);
  const anchor = textAttributes.match(/\btext-anchor="([^"]+)"/)?.[1] ?? "middle";
  const width = Math.max(48, Math.ceil(Math.max(...lines.map((line) => line.length)) * 4.7 + 12));
  const height = lines.length === 1 ? 18 : 27;
  const x = anchor === "start" ? textX - 5 : anchor === "end" ? textX - width + 5 : textX - width / 2;

  let next = rectAttributes;
  next = setAttribute(next, "x", x.toFixed(1));
  next = setAttribute(next, "y", lines.length === 1 ? "-1.5" : "-2.5");
  next = setAttribute(next, "width", String(width));
  next = setAttribute(next, "height", String(height));
  next = setAttribute(next, "rx", "2.5");
  next = setAttribute(next, "ry", "2.5");

  const protectedStyle = "fill:#ffffff;fill-opacity:0.9;stroke:#ffffff;stroke-width:2px;stroke-opacity:0.94";
  if (/\bstyle="[^"]*"/.test(next)) next = next.replace(/\bstyle="[^"]*"/, `style="${protectedStyle}"`);
  else next += ` style="${protectedStyle}"`;
  return next;
}

function wrappedText(text, textAttributes) {
  const lines = balancedLines(text);
  if (lines.length === 1) return { lines, inner: lines[0] };
  const x = textAttributes.match(/\bx="([^"]+)"/)?.[1] ?? "0";
  return {
    lines,
    inner: `<tspan x="${x}" y="8.5">${lines[0]}</tspan><tspan x="${x}" dy="10">${lines[1]}</tspan>`,
  };
}

const insights = JSON.parse(fs.readFileSync("app/data/insights.json", "utf8"));
const chartFiles = [...new Set(insights.map((insight) => path.join("public", insight.chartPath ?? "")).filter((file) => fs.existsSync(file)))];
let changedFiles = 0;
let changedCallouts = 0;

for (const file of chartFiles) {
  const original = fs.readFileSync(file, "utf8");
  const normalizedText = original.replace(textPattern, (match, tag, attributes, inner) => {
    const plainText = decodeText(inner);
    if (!isNarrativeCallout(attributes, plainText)) return match;
    const replacement = concise(plainText);
    const nextAttributes = attributes.replace(/font-size:\s*[\d.]+px/, "font-size: 8px");
    const escaped = replacement.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const wrapped = wrappedText(escaped, nextAttributes);
    const next = `<${tag}${nextAttributes}>${wrapped.inner}</${tag}>`;
    if (next !== match) changedCallouts += 1;
    return next;
  });
  const updated = normalizedText.replace(protectedCalloutPattern, (match, rectAttributes, tag, textAttributes, inner) => {
    const plainText = decodeText(inner);
    if (!isNarrativeCallout(textAttributes, plainText)) return match;
    const lines = balancedLines(plainText);
    const nextRectAttributes = protectedRectAttributes(rectAttributes, textAttributes, lines);
    const escaped = plainText.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const wrapped = wrappedText(escaped, textAttributes);
    return `<rect${nextRectAttributes}/><${tag}${textAttributes}>${wrapped.inner}</${tag}>`;
  });
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changedFiles += 1;
  }
}

console.log(`Normalized ${changedCallouts} callouts across ${changedFiles} SVG files.`);
