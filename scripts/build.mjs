#!/usr/bin/env node
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const siteSrc = join(root, "site");
const out = join(root, "dist");

async function lastPushDate(githubRepo) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${githubRepo}/commits?per_page=1`,
      { headers },
    );
    if (!res.ok) throw new Error(`${res.status}`);
    const commits = await res.json();
    const date = commits[0]?.commit?.committer?.date;
    if (!date) throw new Error("no commits");
    return date;
  } catch {
    return new Date().toISOString();
  }
}

const config = JSON.parse(
  readFileSync(join(root, "prototypes.config.json"), "utf8"),
);

const items = await Promise.all(
  config.prototypes.map(async (item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    href: item.href,
    icon: item.icon,
    updatedAt: await lastPushDate(item.githubRepo),
  })),
);

const prototypes = {
  siteTitle: config.siteTitle,
  prototypes: items,
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const name of ["index.html", "styles.css", "hub.js"]) {
  cpSync(join(siteSrc, name), join(out, name));
}

writeFileSync(join(out, "prototypes.json"), `${JSON.stringify(prototypes, null, 2)}\n`);
console.log(`Built ${out} (${prototypes.prototypes.length} prototypes)`);
