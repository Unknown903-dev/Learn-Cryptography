import { readFile, writeFile } from "node:fs/promises";

const historyPath =
  process.env.HISTORY_FILE ?? ".github/data/repository-traffic.json";
const chartPath =
  process.env.CHART_FILE ?? ".github/assets/repository-traffic.svg";
const viewsPath = process.env.VIEWS_FILE ?? "/tmp/repository-views.json";
const clonesPath = process.env.CLONES_FILE ?? "/tmp/repository-clones.json";

const [history, viewsResponse, clonesResponse] = await Promise.all(
  [historyPath, viewsPath, clonesPath].map(async (path) =>
    JSON.parse(await readFile(path, "utf8")),
  ),
);

const days = new Map(history.days.map((day) => [day.date, day]));

function getDay(date) {
  const existing = days.get(date);
  if (existing) return existing;

  const day = {
    date,
    views: 0,
    uniqueVisitors: 0,
    clones: 0,
    uniqueCloners: 0,
  };
  days.set(date, day);
  return day;
}

for (const item of viewsResponse.views ?? []) {
  const day = getDay(item.timestamp.slice(0, 10));
  day.views = item.count;
  day.uniqueVisitors = item.uniques;
}

for (const item of clonesResponse.clones ?? []) {
  const day = getDay(item.timestamp.slice(0, 10));
  day.clones = item.count;
  day.uniqueCloners = item.uniques;
}

const sortedDays = [...days.values()]
  .filter((day) => day.date >= history.repositoryStartedAt)
  .sort((first, second) => first.date.localeCompare(second.date));

const updatedHistory = {
  ...history,
  collectionStartedAt:
    history.collectionStartedAt ?? sortedDays[0]?.date ?? null,
  updatedAt: new Date().toISOString(),
  days: sortedDays,
};

await writeFile(historyPath, `${JSON.stringify(updatedHistory, null, 2)}\n`);

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function createChart(historyData) {
  const width = 1000;
  const height = 430;
  const left = 72;
  const right = 32;
  const top = 124;
  const bottom = 62;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const chartDays = historyData.days;

  if (chartDays.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300" viewBox="0 0 1000 300" role="img" aria-labelledby="title description">
  <title id="title">Learn Cryptography repository traffic</title>
  <desc id="description">Traffic collection is configured and awaiting its first run.</desc>
  <rect width="1000" height="300" rx="18" fill="#080b14"/>
  <rect x="1" y="1" width="998" height="298" rx="17" fill="none" stroke="#334155"/>
  <text x="48" y="68" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="28" font-weight="800">Repository traffic</text>
  <text x="48" y="103" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16">Views and full clones from GitHub</text>
  <rect x="48" y="140" width="904" height="104" rx="14" fill="#0f172a" stroke="#334155"/>
  <text x="500" y="184" fill="#7dd3fc" font-family="system-ui, sans-serif" font-size="18" font-weight="700" text-anchor="middle">Traffic collection is ready</text>
  <text x="500" y="216" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="15" text-anchor="middle">Run the Collect repository traffic workflow to populate this graph.</text>
</svg>\n`;
  }

  const largestValue = Math.max(
    1,
    ...chartDays.flatMap((day) => [day.views, day.clones]),
  );
  const maximum = Math.max(4, Math.ceil(largestValue / 4) * 4);
  const totalViews = chartDays.reduce((total, day) => total + day.views, 0);
  const totalClones = chartDays.reduce((total, day) => total + day.clones, 0);
  const xFor = (index) =>
    left +
    (chartDays.length === 1
      ? plotWidth / 2
      : (index / (chartDays.length - 1)) * plotWidth);
  const yFor = (value) => top + plotHeight - (value / maximum) * plotHeight;
  const pointsFor = (key) =>
    chartDays
      .map((day, index) => `${xFor(index).toFixed(1)},${yFor(day[key]).toFixed(1)}`)
      .join(" ");
  const labelStep = Math.max(1, Math.ceil(chartDays.length / 6));

  const grid = [0, 1, 2, 3, 4]
    .map((tick) => {
      const value = (maximum / 4) * tick;
      const y = yFor(value);
      return `  <line x1="${left}" x2="${width - right}" y1="${y}" y2="${y}" stroke="#334155" stroke-opacity="0.55"/>
  <text x="${left - 14}" y="${y + 5}" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="end">${value}</text>`;
    })
    .join("\n");

  const dateLabels = chartDays
    .map((day, index) => {
      const show =
        index === 0 || index === chartDays.length - 1 || index % labelStep === 0;
      if (!show) return "";
      const label = new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${day.date}T00:00:00Z`));
      return `  <text x="${xFor(index)}" y="${height - 24}" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">${escapeXml(label)}</text>`;
    })
    .filter(Boolean)
    .join("\n");

  const pointCircles = chartDays
    .map(
      (day, index) => `  <circle cx="${xFor(index)}" cy="${yFor(day.views)}" r="4" fill="#38bdf8" stroke="#020617" stroke-width="2"><title>${escapeXml(`${formatDate(day.date)}: ${day.views} views`)}</title></circle>
  <circle cx="${xFor(index)}" cy="${yFor(day.clones)}" r="4" fill="#a855f7" stroke="#020617" stroke-width="2"><title>${escapeXml(`${formatDate(day.date)}: ${day.clones} clones`)}</title></circle>`,
    )
    .join("\n");

  const firstDate = formatDate(chartDays[0].date);
  const lastDate = formatDate(chartDays.at(-1).date);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="430" viewBox="0 0 1000 430" role="img" aria-labelledby="title description">
  <title id="title">Learn Cryptography repository views and clones</title>
  <desc id="description">Daily GitHub traffic from ${escapeXml(firstDate)} through ${escapeXml(lastDate)}. ${totalViews} total views and ${totalClones} total clones.</desc>
  <rect width="1000" height="430" rx="18" fill="#080b14"/>
  <rect x="1" y="1" width="998" height="428" rx="17" fill="none" stroke="#334155"/>
  <text x="40" y="48" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="25" font-weight="800">Repository traffic</text>
  <text x="40" y="76" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">${escapeXml(firstDate)} — ${escapeXml(lastDate)} · UTC</text>
  <circle cx="530" cy="46" r="6" fill="#38bdf8"/>
  <text x="544" y="51" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="14">Views: ${totalViews.toLocaleString("en")}</text>
  <circle cx="700" cy="46" r="6" fill="#a855f7"/>
  <text x="714" y="51" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="14">Clones: ${totalClones.toLocaleString("en")}</text>
${grid}
${dateLabels}
  <polyline points="${pointsFor("views")}" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${pointsFor("clones")}" fill="none" stroke="#a855f7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
${pointCircles}
</svg>\n`;
}

await writeFile(chartPath, createChart(updatedHistory));
