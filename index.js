// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2503-Antele"; // Make sure to change this!
const API = BASE + COHORT;

// === https://fsa-puppy-bowl.herokuapp.com/api/2503-Antele/players === //

const playersList = document.getElementById("players-list");
const detailsDiv = document.getElementById("player-details");
const message = document.getElementById("message");
const overlay = document.getElementById("overlay");

let players = [];

// === retrieving all players and rendering them === //
const getPlayers = async () => {
  try {
    const res = await fetch(`${API}/players`);
    const data = await res.json();
    players = data.data.players;
    renderPlayers();
  } catch (err) {
    console.error("Error fetching players:", err);
  }
};
// ===  Adding a new player === //
const addPlayerForm = document.getElementById("add-player-form");
addPlayerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const breed = document.getElementById("breed").value.trim();
  if (!name || !breed) {
    alert("Name and breed are required.");
    return;
  }
  const newPlayer = {
    name,
    breed,
  };
  try {
    const res = await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlayer),
    });
    const result = await res.json();
    if (result.success) {
      addPlayerForm.reset();
      getPlayers();
    } else {
      throw new Error(result.error.message);
    }
  } catch (err) {
    alert("Error adding player: " + err.message);
  }
});
const renderPlayers = () => {
  playersList.innerHTML = "";
  players.forEach((player) => {
    const card = document.createElement("div");
    card.classList.add("player-card");
    card.innerHTML = `
      <h3>${player.name}</h3>
      <img src="${player.imageUrl}" alt="${player.name}" />
    `;
    card.addEventListener("click", () => {
      getSinglePlayer(player.id);
    });
    playersList.appendChild(card);
  });
};
// === retrieving the player details === //
const getSinglePlayer = async (id) => {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();
    const player = data.data.player;

    showPlayerDetails(player);
  } catch (err) {
    console.error("Error getting single player:", err);
  }
};
const showPlayerDetails = (player) => {
  message.textContent = `Viewing: ${player.name}`;
  // === Adding the html through Java === //
  detailsDiv.innerHTML = `
      <button id="close-btn">&times;</button>
      <h2>${player.name}</h2>
      <p><strong>Breed:</strong> ${player.breed}</p>
      <p><strong>Status:</strong> ${player.status}</p>
      <p><strong>Team:</strong> ${player.team?.name || "Unassigned"}</p>
      <img src="${player.imageUrl}" alt="${player.name}" />
      <br />
      <button id="remove-btn">Remove Player</button>
    `;
  overlay.classList.remove("hidden");
  setTimeout(() => {
    const closeBtn = document.getElementById("close-btn");
    const removeBtn = document.getElementById("remove-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        overlay.classList.add("hidden");
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        removePlayer(player.id);
        overlay.classList.add("hidden");
      });
    }
  }, 0);
};
// === Removing the player from the page === //
const removePlayer = async (id) => {
  try {
    await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });

    message.textContent = "Player removed successfully.";
    detailsDiv.innerHTML = "";
    getPlayers();
  } catch (err) {
    console.error("Error removing player:", err);
  }
};

getPlayers();
