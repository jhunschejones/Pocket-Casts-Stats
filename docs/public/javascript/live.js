(() => {
  const pocketCastsLive = {
    fireUpdateEvent: () => document.dispatchEvent(new CustomEvent("pocket-casts-live:update")),
    tokenSubmitted: () => {
      const tokenInput = document.querySelector(".submit-token-input");
      pocketCastsLive.token = tokenInput.value;
      tokenInput.value = "";
      pocketCastsLive.fireUpdateEvent();
    },
    hide: (elements) => {
      const elementsArray = Array(elements).flat();
      elementsArray.forEach(element => {
        element.classList.toggle("is-hidden", true);
      });
    },
    show: (elements) => {
      const elementsArray = Array(elements).flat();
      elementsArray.forEach(element => {
        element.classList.toggle("is-hidden", false);
      });
    },
    handleUpdateEvent: async () => {
      pocketCastsLive.hide([
        pocketCastsLive.errorMessageContainer,
        pocketCastsLive.tokenFormcontainer,
        pocketCastsLive.liveStatsContainer
      ]);

      if (!pocketCastsLive.token) {
        pocketCastsLive.show(pocketCastsLive.tokenFormcontainer);
        return;
      } else {
        pocketCastsLive.show(pocketCastsLive.spinnerContainer);
      }

      // simulate long web request
      // await new Promise(r => setTimeout(r, 2000));

      const todayResponse = await fetch("https://api.pocketcasts.com/user/stats/summary", {
        method: "post",
        headers: {
          Origin: "https://play.pocketcasts.com",
          Authorization: `Bearer ${pocketCastsLive.token}`,
          Accept: "*/*",
        },
        body: JSON.stringify({})
      });
      if (!todayResponse.ok) {
        pocketCastsLive.show([
          pocketCastsLive.errorMessageContainer,
          pocketCastsLive.tokenFormcontainer
        ]);
        pocketCastsLive.hide(pocketCastsLive.spinnerContainer);
        return;
      }
      const todayResults = await todayResponse.json();
      const todaysLiveTotal = todayResults["timeListened"];

      const yesterdayResponse = await fetch(pocketCastsLive.statsUrl(1));
      let yesterdayTotal = 0;
      if (yesterdayResponse.ok) {
        yesterdayTotal = await yesterdayResponse.text();
        yesterdayTotal = parseInt(yesterdayTotal);
      }

      let minutes = 0;
      if (todaysLiveTotal > 0) {
        minutes = Math.floor((todaysLiveTotal - yesterdayTotal) / 60);
      }

      pocketCastsLive.hide(pocketCastsLive.spinnerContainer);
      pocketCastsLive.show(pocketCastsLive.liveStatsContainer);
      pocketCastsLive.todaysTotal.textContent = `${minutes} minutes`;
      pocketCastsLive.lastUpdatedAt.textContent = `Last updated on ${pocketCastsLive.dateString()}`;
    },
    dateString: (daysAgo = 0) => {
      const [month, day, year] = (new Date(Date.now() - (daysAgo * 24) * 3600 * 1000))
        .toLocaleString("en-US", {timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" })
        .split("/");
      return `${year}-${month}-${day}`;
    },
    statsUrl: (daysAgo = 0) => `https://raw.githubusercontent.com/jhunschejones/Pocket-Casts-Stats/main/stats/${pocketCastsLive.dateString(daysAgo)}`,
  }

  document.addEventListener("DOMContentLoaded", () => {
    // === Save DOM elements to refrence
    pocketCastsLive.tokenFormcontainer = document.querySelector(".token-form-container");
    pocketCastsLive.spinnerContainer = document.querySelector(".spinner-container");
    pocketCastsLive.liveStatsContainer = document.querySelector(".live-stats-container");
    pocketCastsLive.errorMessageContainer = document.querySelector(".error-message-container");

    pocketCastsLive.todaysTotal = document.querySelector(".todays-total");
    pocketCastsLive.lastUpdatedAt = document.querySelector(".last-updated-at");

    // === Add event listeners
    document.addEventListener("pocket-casts-live:update", () => pocketCastsLive.handleUpdateEvent());

    document.querySelector(".submit-token-button").addEventListener("click", () => pocketCastsLive.tokenSubmitted());
    document.querySelector(".refresh-live-stats").addEventListener("click", () => pocketCastsLive.fireUpdateEvent());

    // === Get the newest data for the page
    pocketCastsLive.fireUpdateEvent();
  });
})();
