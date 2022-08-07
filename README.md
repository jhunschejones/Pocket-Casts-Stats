# Pocket Casts Stats

[![Daily Stats](https://github.com/jhunschejones/Pocket-Casts-Stats/actions/workflows/daily_stats.yml/badge.svg)](https://github.com/jhunschejones/Pocket-Casts-Stats/actions/workflows/daily_stats.yml)

### Overview

Pocket Casts is one of the only podcast tools that tracks user listening stats. Unfortunately, after a while, the in-app tracker eventually rounds up to "hours" as the smallest level of fidelity, and I track minutes for my language learning study. 

To solve this problem, I built a script _(inspired by https://github.com/niklas-heer/pocketcasts-stats/blob/master/app.py)_ which makes a web request to the unofficial pocket casts API and stores the daily raw listening totals (in seconds) using GitHub Actions. I then built a UI (in `/docs`) that serves an HTML page through GitHub Pages which queries the totals files saved in this repo. The result is I now have a few days of minute-fidelity listening totals that I can add use to update my tracking tools! See the UI in action at https://jhunschejones.github.io/Pocket-Casts-Stats/
