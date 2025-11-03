const playerNames = [
  { name: "cIover" },
  { name: "Sosig" },
  { name: "De us" },
  { name: "azaclover" },
  { name: "RautaMankeli"}
];

async function checkHiscores(playerNames) {
  const countdownDiv = document.getElementById("countdown");

  // 🕒 Target start date (7 Nov 2025 18:00 GMT)
  const targetStart = new Date("2025-11-07T18:00:00Z");

  // ⏱ Update countdown/count-up every second
  function updateCountdown() {
    const now = new Date();
    const diff = targetStart - now;

    if (diff > 0) {
      // Countdown before event start
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      countdownDiv.textContent = `BoTW starts in: ${days}d ${hours}h ${mins}m ${secs}s`;
    } else {
      // Count-up since event start
      const sinceStart = now - targetStart;
      const days = Math.floor(sinceStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((sinceStart / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((sinceStart / (1000 * 60)) % 60);
      const secs = Math.floor((sinceStart / 1000) % 60);

      countdownDiv.textContent = `BoTW ends in: ${days}d ${hours}h ${mins}m ${secs}s`;
    }
  }

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // 🧩 Create main container
  const container = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  const infoRow = document.createElement("p");
  infoRow.className = "infoClass";
  infoRow.innerHTML = `Points since start of the event`;
  container.appendChild(infoRow);

  // Calculate time difference for TempleOSRS API
  const now = new Date();
  let secondsSince = Math.floor((now - targetStart) / 1000);
  if (secondsSince < 0) secondsSince = 0;

  console.log(`⏱ Fetching TempleOSRS gains since ${targetStart.toISOString()} (${secondsSince} seconds ago)`);

  // We'll gather results here to sort later
  const results = [];

  for (const player of playerNames) {
    const corsProxy = "https://corsproxy.io/?";
    const templeURL = encodeURIComponent(
      `https://templeosrs.com/api/player_gains.php?player=${player.name}&time=${secondsSince}&bosses=1`
    );
    const playerApi = `${corsProxy}${templeURL}`;

    try {
      const response = await fetch(playerApi);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      const data = JSON.parse(text);
      const d = data.data || data;

      // ✅ Safely read raid KCs
      const cox = Number(d["Chambers of Xeric"] ?? 0);
      const coxCm = Number(d["Chambers of Xeric Challenge Mode"] ?? 0);
      const toa = Number(d["Tombs of Amascut"] ?? 0);
      const toaExpert = Number(d["Tombs of Amascut Expert"] ?? 0);
      const tob = Number(d["Theatre of Blood"] ?? 0);
      const hmt = Number(d["Theatre of Blood Challenge Mode"] ?? 0);

      const totalRaids = cox + coxCm + toa + toaExpert + tob + hmt;

      // Save player data
      results.push({
        name: player.name,
        total: totalRaids,
        raids: { cox, coxCm, toa, toaExpert, tob, hmt }
      });

    } catch (err) {
      console.error(`Failed to load data for ${player.name}:`, err);
      results.push({
        name: player.name,
        total: 0,
        raids: { cox: 0, coxCm: 0, toa: 0, toaExpert: 0, tob: 0, hmt: 0 },
        error: true
      });
    }
  }

  // 🧮 Sort players by total raid KC (descending)
  results.sort((a, b) => b.total - a.total);

  // 🧱 Display sorted results
  for (const player of results) {
    const row = document.createElement("div");
    row.className = "playerInfo";

    if (player.error) {
      row.innerHTML = `<h2>${player.name} — ⚠️ Error loading data</h2>`;
    } else {
      row.innerHTML = `
        <h2>${player.name}: ${player.total}</h2>
      `;
    }

    container.appendChild(row);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  checkHiscores(playerNames);
});
