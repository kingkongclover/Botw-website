const playerNames = [
  { name: "cIover"},
  { name: "azaclover"},
  { name: "TalkToTopsu"},
  { name: "miksukin"}
];

function startTimer(targetDate) {
  const countdownDiv = document.getElementById("countdown");
  const start = new Date(targetDate);

  function update() {
    const now = new Date();
    let diff = now - start;

    if (diff < 0) diff = 0; // Prevent negative timers

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    countdownDiv.textContent =
      `Time since last update: ${days}d ${hours}h ${mins}m ${secs}s`;
  }

  update();
  setInterval(update, 1000);
}

async function checkHiscores(playerNames) {

  const skillOrder = [
    "Attack", "Hitpoints", "Mining", "Strength", "Agility", "Smithing",
    "Defence", "Herblore", "Fishing", "Ranged", "Thieving", "Cooking",
    "Prayer", "Crafting", "Firemaking", "Magic", "Fletching", "Woodcutting",
    "Runecraft", "Slayer", "Farming", "Construction", "Hunter", "Sailing"
  ];

  for (const player of playerNames) {
    const corsProxy = "https://corsproxy.io/?";
    const templeURL = encodeURIComponent(
      `https://templeosrs.com/api/player_stats.php?player=${player.name}&date=0`
    );
    const playerApi = `${corsProxy}${templeURL}`;

    const response = await fetch(playerApi);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const data = JSON.parse(text).data;


    // ----- Build ordered skill list
    const skillEntries = skillOrder.map(skill => {
      const key = `${skill}_level`;
      return { skill, level: data[key] ?? "?" };
    });


    // ----- Build HTML rows (3 per row)
    let skillHTML = "";
    for (let i = 0; i < skillEntries.length; i += 3) {
      const row = skillEntries.slice(i, i + 3);

      skillHTML += `
        <div class="skill-row">
          ${row
            .map(
              (s) => `
              <div class="skill-box">
                <span class="skill-name">${s.skill}</span>
                <span class="skill-level">${s.level}</span>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }


    // ----- Insert into the page
    const container = document.querySelector(".container");

    const playerDiv = document.createElement("div");
    playerDiv.className = "playerInfo";
    playerDiv.id = "pixel-corners2";
    playerDiv.innerHTML = `
      <h2>${player.name}</h2>
      ${skillHTML}
    `;

    container.appendChild(playerDiv);
  }
}



window.addEventListener("DOMContentLoaded", () => {
  const copyright = document.querySelector('.copyright');
    const clickSound = document.getElementById('clickSound');

    if (copyright && clickSound) {
        copyright.addEventListener('click', () => {
            clickSound.currentTime = 0; // start from beginning
            clickSound.play().catch(err => console.log(err));
        });
    }

  checkHiscores(playerNames);
  startTimer("2025-12-05T04:37:00Z");
});
