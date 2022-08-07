(() => {
  const pocketCasts = {
    dateString: (daysAgo = 0) => {
      const [month, day, year] = (new Date(Date.now() - (daysAgo * 24) * 3600 * 1000))
        .toLocaleString("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" })
        .split("/");
      return `${year}-${month}-${day}`;
    },
    statsUrl: (daysAgo = 0) => {
      return `https://raw.githubusercontent.com/jhunschejones/Pocket-Casts-Stats/main/stats/${pocketCasts.dateString(daysAgo)}`;
    },
    updateTotals: async () => {
      const dailyTotalTags = document.querySelectorAll(".daily-total");
      const numberOfDaysToFetch = dailyTotalTags.length + 1;
      const responses = await Promise.all(
        [...Array(numberOfDaysToFetch).keys()].map(async (index) => {
          return fetch(pocketCasts.statsUrl(index));
        })
      );
      const totals = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            return 0;
          }
          const total = await response.text();
          return parseInt(total);
        })
      );
      totals.forEach((total, index) => {
        if (!dailyTotalTags[index]) {
          return;
        }
        let minutes = 0;
        if (total > 0 && totals[index + 1] != undefined) {
          minutes = Math.floor((total - totals[index + 1]) / 60);
        }
        dailyTotalTags[index].textContent = `${pocketCasts.dateString(index)}: ${minutes} minutes`;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => pocketCasts.updateTotals());
})();
