let score = 0;
let time = 60;
let spawnRate = 1500;
let gameInterval;
let spawnInterval;
let bgMusic = document.getElementById("bgMusic");
let splatSound = document.getElementById("splatSound");

const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const muteBtn = document.getElementById("muteBtn");
const installBtn = document.getElementById("installBtn");
const offlineNotice = document.getElementById("offlineNotice");

let isMuted = false;
let deferredPrompt;

// Apply slipper cursor dynamically
function applySlipperCursor() {
  gameArea.style.cursor = "url('assets/slipper-cursor-v2.png') 20 10, auto";
}

window.addEventListener("DOMContentLoaded", () => {
  applySlipperCursor();
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      installBtn.hidden = true;
    }
  }
});

muteBtn.onclick = () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  splatSound.muted = isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
};

function spawnCockroach() {
    const roach = document.createElement("img");
    roach.src = "assets/cockroach.png";
    roach.className = "cockroach";
  
    const gameAreaRect = gameArea.getBoundingClientRect();
    const maxTop = gameArea.clientHeight - 60;
    const maxLeft = gameArea.clientWidth - 60;
  
    roach.style.position = "absolute";
    roach.style.left = `${Math.random() * maxLeft}px`;
    roach.style.top = `${Math.random() * maxTop}px`;
  
    roach.onclick = () => {
      score++;
      scoreDisplay.textContent = `Kills: ${score}`;
      roach.src = "assets/cockroach-dead.png";
      splatSound.currentTime = 0;
      splatSound.play();
      roach.onclick = null;
      setTimeout(() => gameArea.removeChild(roach), 300);
    };
  
    gameArea.appendChild(roach);
  
    setTimeout(() => {
      if (gameArea.contains(roach)) {
        gameArea.removeChild(roach);
      }
    }, 4000);
  }
  

function updateTimer() {
  time--;
  timerDisplay.textContent = `Time: ${time}s`;

  if (time % 10 === 0 && time > 0) {
    spawnRate = Math.max(300, spawnRate - 200);
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnCockroach, spawnRate);
  }

  if (time <= 0) {
    endGame();
  }
}

function startGame() {
  document.getElementById("howToPlay").style.display = "none";
  bgMusic.play();
  score = 0;
  time = 60;
  spawnRate = 2000;
  timerDisplay.textContent = `Time: 60s`;
  scoreDisplay.textContent = `Kills: 0`;
  gameInterval = setInterval(updateTimer, 1000);
  spawnInterval = setInterval(spawnCockroach, spawnRate);
  applySlipperCursor(); // Ensure cursor applies when game starts
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  bgMusic.pause();
  document.querySelectorAll(".cockroach").forEach(el => el.remove());

  const gameOver = document.getElementById("gameOver");
  const finalScore = document.getElementById("finalScore");
  finalScore.textContent = `You killed ${score} cockroaches!`;
  gameOver.style.display = "flex";
}

function restartGame() {
  document.getElementById("gameOver").style.display = "none";
  startGame();
}

window.addEventListener("offline", () => {
  offlineNotice.hidden = false;
});

window.addEventListener("online", () => {
  offlineNotice.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
