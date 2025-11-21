const playerNames = [
  { name: "cIover"}
];

async function checkHiscores(playerNames) {
  const countdownDiv = document.getElementById("countdown");

  // 🕒 Target start date (7 Nov 2025 18:00 GMT)
  // 🕒 Target start date (7 Nov 2025 18:00 GMT)
const targetStart = new Date("2025-11-21T3:27:00Z");

// ⏱ Update timer every second
function updateCountdown() {
  const now = new Date();

  const diff = now - targetStart;

  if (diff < 0) {
    // Event in the future (countdown to that date)
    const remaining = Math.abs(diff);
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((remaining / (1000 * 60)) % 60);
    const secs = Math.floor((remaining / 1000) % 60);

    countdownDiv.textContent =
      `Next update in: ${days}d ${hours}h ${mins}m ${secs}s`;
  } else {
    // Event already started → count UP from that day
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    countdownDiv.textContent =
      `Time since last update: ${days}d ${hours}h ${mins}m ${secs}s`;
  }
}

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();



  // Calculate time difference for TempleOSRS API
  const now = new Date();
  let secondsSince = Math.floor((now - targetStart) / 1000);
  if (secondsSince < 0) secondsSince = 0;

  console.log(`⏱ Fetching TempleOSRS gains since ${targetStart.toISOString()} (${secondsSince} seconds ago)`);

  // We'll gather results here to sort later
  //const results = [];

  for (const player of playerNames) {
    const corsProxy = "https://corsproxy.io/?";
    const templeURL = encodeURIComponent(
      `https://templeosrs.com/api/player_gains.php?player=${player.name}&time=month&bosses=0`
    );
    const playerApi = `${corsProxy}${templeURL}`;

    const response = await fetch(playerApi);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const data = JSON.parse(text);
    const d = data.data || data;


    const infoBox = document.getElementsByClassName("container");

    const row = document.createElement("div");
    row.className = "playerInfo";

      row.innerHTML = `
        <h2>cIover</h2><br>
        <p>${data.data.attack}</p><p></p><p></p>
      `;


    infoBox.appendChild(row);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  checkHiscores(playerNames);
});
