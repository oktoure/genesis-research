import fs from "node:fs";
import path from "node:path";

const insights = JSON.parse(fs.readFileSync("app/data/insights.json", "utf8"));
const chartFiles = [...new Set(insights.map((insight) => path.join("public", insight.chartPath ?? "")).filter((file) => fs.existsSync(file)))];
const failures = [];
const textPattern = /<((?:[\w]+:)?text)\b([^>]*class="annotation-text"[^>]*)>([\s\S]*?)<\/\1>/g;
const excludedPrefix = /^(?:SOURCE|SOURCES|NOTE|NOTES|DATA THROUGH|ANN % CHG|STD DEV|QUARTERLY|MONTHLY|WEEKLY|DAILY|YEARLY|INDEX|RATE|RATIO|LEVEL|BPS|TH|MN|DXY|\$\/OZ|\$\/BRL|%|\*)\b/i;
const legendMarker = /(?:\((?:LS|RS|INV\.?|LHS|RHS)\)|\bMA\s*\d+\b|\bMOVING AVERAGE\b|^US:|^GOLD\*?$)/i;
const pureBlack = /^(?:rgb\(0,\s*0,\s*0\)|#000(?:000)?|black)$/i;

for (const file of chartFiles) {
  const svg = fs.readFileSync(file, "utf8");
  for (const match of svg.matchAll(textPattern)) {
    const attributes = match[2];
    const style = attributes.match(/style="([^"]*)"/)?.[1] ?? "";
    const size = Number(style.match(/font-size:\s*([\d.]+)px/)?.[1] ?? 0);
    const fill = style.match(/fill:\s*([^;]+)/)?.[1]?.trim() ?? "";
    const text = match[3].replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&gt;", ">").replaceAll("&lt;", "<").replace(/\s+/g, " ").trim();
    const letters = text.match(/[A-Za-z]/g)?.length ?? 0;
    const uppercase = text.match(/[A-Z]/g)?.length ?? 0;
    if (size < 8 || !fill || pureBlack.test(fill)) continue;
    if (!text || excludedPrefix.test(text) || legendMarker.test(text)) continue;
    if (letters && uppercase / letters < 0.68) continue;
    const words = text.split(/\s+/).filter(Boolean).length;
    if (size !== 8) failures.push(`${file}: callout font is ${size}px: ${text}`);
    if (words > 6) failures.push(`${file}: callout has ${words} words: ${text}`);
  }
}

if (failures.length) {
  console.error("Chart callout validation failed:\n");
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${chartFiles.length} chart SVGs: narrative callouts are 8px and at most six words.`);
