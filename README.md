# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/recx82-ship-it/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/recx82-ship-it/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that is the best guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade; a checklist saved in the browser (localStorage) with export and import of progress; filters by kind; a spoiler setting that hides story trophies until earned; a five-stage roadmap to the platinum; the one missable trophy flagged; and a guide to each trophy in this guide's own words, with its source cited beside it.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

It is plain static files under `app/` — no build step, no network requests at run time. Open `app/index.html` in a desktop browser with the network off and it works.

## Files

- `app/index.html` — the guide page: progress, filters, roadmap, checklist
- `app/style.css` — the guide's own look (deep navy, sunset gradient, system fonts only)
- `app/app.js` — boots the app, renders the list, wires search, filters, spoiler mode, export/import
- `app/tracker.js` — progress state: localStorage, export and import of the earned set
- `app/roadmap.js` — the five-stage roadmap to the platinum, built from the official descriptions
- `app/data/trophies.json` — the 55 official trophies with guides and sources
- `screenshots/` — the guide at work, taken with a headless browser
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to the output and writes `dossier.json`
- `serve.ts` — a tiny static server for local testing

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
node cli/makefun.mjs check --kit . --repo <this repository>
```

## Sources

Official trophy names, descriptions and grades: the PlayStation list as published by Exophase and PSNProfiles, who agree on all 55. Guides draw on PowerPyx, Push Square, KeenGamer, GameMapa, Insider Gaming and games.gg — each trophy cites its source, and anything the early guides have not confirmed is marked unconfirmed in its guide instead of guessed. List as of 20 November 2026; Grand Theft Auto VI released 19 November 2026.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
