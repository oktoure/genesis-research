import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const insights = JSON.parse(fs.readFileSync("app/data/insights.json", "utf8"));
const chartFiles = [...new Set(insights.map((insight) => path.join("public", insight.chartPath ?? "")).filter((file) => fs.existsSync(file)))];
const failures = [];
const auditPath = "docs/editorial/chart-publication-audit.json";
const audits = fs.existsSync(auditPath) ? JSON.parse(fs.readFileSync(auditPath, "utf8")) : [];
const auditedFiles = new Set();
for (const audit of audits) {
  const file = path.join("public", audit.chartPath);
  auditedFiles.add(file);
  if (!fs.existsSync(file)) { failures.push(`${file}: audited SVG is missing`); continue; }
  if (crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") !== audit.sha256) {
    failures.push(`${file}: changed since whitespace/layout review; regenerate the audit`);
  }
  for (const panel of audit.panels) {
    if (!panel.callouts?.length || panel.callouts.some(c => c.overlapping_pixels !== 0 || c.clearance_box_px?.length !== 4)) {
      failures.push(`${file}: missing clear-whitespace evidence`);
    }
  }
  if (audit.panels.length === 2) {
    const [a,b] = audit.panels;
    if (a.width !== b.width || a.margin?.l !== b.margin?.l || a.margin?.r !== b.margin?.r ||
        a.height-a.margin.t-a.margin.b !== b.height-b.margin.t-b.margin.b ||
        JSON.stringify(a.calendar_range) !== JSON.stringify(b.calendar_range)) {
      failures.push(`${file}: publication panels do not share plot geometry and calendar range`);
    }
  }
}
const textPattern = /<((?:[\w]+:)?text)\b([^>]*class="annotation-text"[^>]*)>([\s\S]*?)<\/\1>/g;
const protectedCalloutPattern = /<rect\b([^>]*class="bg"[^>]*)\/>\s*<((?:[\w]+:)?text)\b([^>]*class="annotation-text"[^>]*)>([\s\S]*?)<\/\2>/g;
const excludedPrefix = /^(?:SOURCE|SOURCES|NOTE|NOTES|DATA THROUGH|ANN % CHG|STD DEV|QUARTERLY|MONTHLY|WEEKLY|DAILY|YEARLY|INDEX|RATE|RATIO|LEVEL|BPS|TH|MN|DXY|\$\/OZ|\$\/BRL|%|\*)\b/i;
const legendMarker = /(?:\((?:LS|RS|INV\.?|LHS|RHS)\)|\bMA\s*\d+\b|\bMOVING AVERAGE\b|^US:|^GOLD\*?$)/i;
const pureBlack = /^(?:rgb\(0,\s*0,\s*0\)|#000(?:000)?|black)$/i;

function decodeText(inner) {
  return inner.replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&gt;", ">").replaceAll("&lt;", "<").replace(/\s+/g, " ").trim();
}

function isNarrative(attributes, text) {
  const style = attributes.match(/style="([^"]*)"/)?.[1] ?? "";
  const size = Number(style.match(/font-size:\s*([\d.]+)px/)?.[1] ?? 0);
  const fill = style.match(/fill:\s*([^;]+)/)?.[1]?.trim() ?? "";
  const letters = text.match(/[A-Za-z]/g)?.length ?? 0;
  const uppercase = text.match(/[A-Z]/g)?.length ?? 0;
  if (size < 8 || !fill || pureBlack.test(fill)) return false;
  if (!text || excludedPrefix.test(text) || legendMarker.test(text)) return false;
  return !letters || uppercase / letters >= 0.68;
}

for (const file of chartFiles) {
  const svg = fs.readFileSync(file, "utf8");
  for (const match of svg.matchAll(textPattern)) {
    const attributes = match[2];
    const style = attributes.match(/style="([^"]*)"/)?.[1] ?? "";
    const size = Number(style.match(/font-size:\s*([\d.]+)px/)?.[1] ?? 0);
    const fill = style.match(/fill:\s*([^;]+)/)?.[1]?.trim() ?? "";
    const text = decodeText(match[3]);
    if (!isNarrative(attributes, text)) continue;
    const words = text.split(/\s+/).filter(Boolean).length;
    if (size !== 8) failures.push(`${file}: callout font is ${size}px: ${text}`);
    if (words > 6) failures.push(`${file}: callout has ${words} words: ${text}`);
  }

  for (const match of svg.matchAll(protectedCalloutPattern)) {
    const rectAttributes = match[1];
    const textAttributes = match[3];
    const inner = match[4];
    const text = decodeText(inner);
    if (!isNarrative(textAttributes, text)) continue;

    const words = text.split(/\s+/).filter(Boolean).length;
    const lineCount = [...inner.matchAll(/<tspan\b/g)].length || 1;
    const shouldWrap = words >= 5 || text.length > 28;
    if (shouldWrap && lineCount !== 2) failures.push(`${file}: long callout is not wrapped: ${text}`);
    if (lineCount > 2) failures.push(`${file}: callout uses more than two lines: ${text}`);

    const style = rectAttributes.match(/style="([^"]*)"/)?.[1] ?? "";
    const opacity = Number(style.match(/fill-opacity:\s*([\d.]+)/)?.[1] ?? 0);
    if (auditedFiles.has(file) && opacity > 0) {
      failures.push(`${file}: audited callout must not conceal observations: ${text}`);
    }
  }
}

if (failures.length) {
  console.error("Chart callout validation failed:\n");
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Validated typography in ${chartFiles.length} chart SVGs; ${audits.length} publication charts have hash-bound whitespace/layout audits. Legacy charts are not certified collision-free.`);
