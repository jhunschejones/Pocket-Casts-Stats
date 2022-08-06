# Pocket Casts Stats

[![Daily Stats](https://github.com/jhunschejones/Pocket-Casts-Stats/actions/workflows/daily_stats.yml/badge.svg)](https://github.com/jhunschejones/Pocket-Casts-Stats/actions/workflows/daily_stats.yml)

### Overview

This is a WIP script based off of https://github.com/niklas-heer/pocketcasts-stats/blob/master/app.py that makes a web request to the unofficial pocket casts API in order to get listening time in minutes. This is valuable because the in-app tracker eventually rounds up to "days" which is not helpful for daily tracking.

`./bin/run` will generate a new file in `/stats/` with the days date and the total number of seconds listened as of the writing. NOTE: since stats cannot be reset without deleting an account, this number always increases and the previous day's number can be subtracted from today's number to get the total time listened today.
