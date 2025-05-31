
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let roadOffset = 0;
let score = 0;
let playerX = width / 2;
const roadHeight = 400;

let items = [];
let lastSpawn = 0;

function drawPerspectiveRoad() {
  const lanes = 10;
  const laneWidth = width / lanes;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 40; i++) {
    let lineY = height - i * 10 + (roadOffset % 10);
    let lineWidth = width * (1 - i / 50);
    let x = (width - lineWidth) / 2;

    ctx.strokeStyle = "#00FFFF";
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + lineWidth, lineY);
    ctx.stroke();
  }
}

function drawPalmTrees() {
  for (let i = 0; i < 10; i++) {
    let scale = 1 - i / 10;
    let treeY = height - i * 60 + (roadOffset % 60);
    let treeHeight = 50 * scale;
    let treeWidth = 10 * scale;

    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(100 * scale, treeY, treeWidth, treeHeight);
    ctx.fillRect(width - 100 * scale, treeY, treeWidth, treeHeight);
  }
}

function drawCar() {
  ctx.fillStyle = "#FF00FF";
  ctx.beginPath();
  ctx.moveTo(playerX - 30, height - 40);
  ctx.lineTo(playerX + 30, height - 40);
  ctx.lineTo(playerX, height - 80);
  ctx.closePath();
  ctx.fill();
}

function spawnItem() {
  const types = ["ML", "2-LEG", "3-LEG", "+$DOG"];
  const label = types[Math.floor(Math.random() * types.length)];
  const x = width / 2 + (Math.random() * 200 - 100);
  items.push({ x, y: -20, label });
}

function drawItems() {
  ctx.fillStyle = "#00FF00";
  ctx.font = "bold 20px monospace";
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].y += 4;
    ctx.fillText(items[i].label, items[i].x, items[i].y);

    // Collision detection
    if (
      items[i].y > height - 100 &&
      Math.abs(items[i].x - playerX) < 40
    ) {
      score += 100;
      document.getElementById("score").innerText = "Score: " + score;
      items.splice(i, 1);
    } else if (items[i].y > height) {
      items.splice(i, 1);
    }
  }
}

function gameLoop() {
  roadOffset += 4;

  drawPerspectiveRoad();
  drawPalmTrees();
  drawItems();
  drawCar();

  if (Date.now() - lastSpawn > 1200) {
    spawnItem();
    lastSpawn = Date.now();
  }

  requestAnimationFrame(gameLoop);
}

// Touch and mouse support
document.addEventListener("touchmove", (e) => {
  playerX = e.touches[0].clientX;
});
document.addEventListener("mousemove", (e) => {
  playerX = e.clientX;
});

gameLoop();
