import fs from "node:fs";
import path from "node:path";

const dataPath = path.resolve("app/data/insights.json");
const insights = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const byId = new Map(insights.map((insight) => [String(insight.id), insight]));
const failures = [];

function publicationTime(insight) {
  if (insight.publishedAt) return new Date(insight.publishedAt);
  const [day, month, year] = String(insight.date).split("-");
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

for (const source of insights) {
  const content = [source.summary, source.fullContent].filter(Boolean).join(" ");
  const targetIds = new Set(
    [...content.matchAll(/\]\(\/i\/([^)]+)\)/g)].map((match) => match[1]),
  );

  for (const targetId of targetIds) {
    const target = byId.get(targetId);
    if (!target) {
      failures.push(`Post ${source.id} links to missing post ${targetId}.`);
      continue;
    }

    if (publicationTime(target) > publicationTime(source)) {
      failures.push(
        `Post ${source.id} (${source.publishedAt ?? source.date}) links forward to ` +
          `${target.id} (${target.publishedAt ?? target.date}).`,
      );
    }
  }
}

if (failures.length) {
  console.error("Insight chronology validation failed:\n");
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${insights.length} insights: all internal links are chronological.`);
