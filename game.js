
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let score = 0;
let player = { x: width / 2 - 25, y: height - 80, width: 50, height: 50, speed: 10 };
let items = [];
let lastSpawn = Date.now();

function drawPlayer() {
  ctx.fillStyle = "#00FFFF";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function spawnItem() {
  const labels = ["ML", "2-LEG", "3-LEG", "4-LEG", "5-LEG", "+$DOG", "BOOSTED"];
  const label = labels[Math.floor(Math.random() * labels.length)];
  const size = 40;
  const x = Math.random() * (width - size);
  items.push({ x, y: -size, size, label });
}

function drawItems() {
  ctx.fillStyle = "#00FF00";
  ctx.font = "bold 20px monospace";
  items.forEach(item => {
    ctx.fillText(item.label, item.x, item.y);
  });
}

function updateItems() {
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].y += 4;
    if (
      items[i].x < player.x + player.width &&
      items[i].x + items[i].size > player.x &&
      items[i].y < player.y + player.height &&
      items[i].y + items[i].size > player.y
    ) {
      score += 100;
      document.getElementById("score").innerText = "Score: " + score;
      items.splice(i, 1);
    } else if (items[i].y > height) {
      items.splice(i, 1);
    }
  }
}

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#FF00FF";
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let j = 0; j < height; j += 50) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(width, j);
    ctx.stroke();
  }
}

function gameLoop() {
  drawBackground();
  drawPlayer();
  drawItems();
  updateItems();

  if (Date.now() - lastSpawn > 1000) {
    spawnItem();
    lastSpawn = Date.now();
  }

  requestAnimationFrame(gameLoop);
}

// Touch support
document.addEventListener("touchmove", (e) => {
  player.x = e.touches[0].clientX - player.width / 2;
});

// Fallback: mouse move support
document.addEventListener("mousemove", (e) => {
  player.x = e.clientX - player.width / 2;
});

gameLoop();
