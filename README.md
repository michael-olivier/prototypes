# Prototypes hub

Static landing page for GitHub Pages at:

**https://michael-olivier.github.io/prototypes/**

Each card shows an icon, title, description, and **last updated** (latest commit on the linked GitHub repo, fetched at build time).

## Add a prototype

Edit `prototypes.config.json`:

```json
{
  "id": "my-app",
  "title": "My App",
  "description": "One-line summary.",
  "href": "https://michael-olivier.github.io/my-app/",
  "icon": "golf",
  "githubRepo": "michael-olivier/my-app"
}
```

Icons: `golf` (sage accent), `career` (pale blue). Add icons and accent mapping in `site/hub.js`; accents are `sage`, `blue`, or `rose` in CSS.

Push to `main` to redeploy.

## Local preview

```bash
node scripts/build.mjs
npx serve dist
```

## Repository setup

This folder is intended to be the root of the public GitHub repo **`michael-olivier/prototypes`**.

1. Create the repo on GitHub (empty, public).
2. Push this directory as `main`.
3. **Settings → Pages → Build and deployment → GitHub Actions.**

## Refresh dates when another repo pushes

The hub rebuilds on a daily schedule. To refresh immediately after pushing `golf-league-app` (or any listed repo), run **Actions → Deploy prototypes hub → Run workflow** on the `prototypes` repo.

Optional: add a `PROTOTYPES_HUB_PAT` secret to other repos and call `repository_dispatch` on `michael-olivier/prototypes` with event type `refresh`.
