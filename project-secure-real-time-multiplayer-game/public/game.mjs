import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

const context = canvas.getContext('2d');
context.fillStyle = getRandomColor()

let players = []
let cPlayer

socket.on('connect', function () {

  let playerId = socket.io.engine.id
  // create a new player
  cPlayer = new Player({
    x: 100,
    y: 100,
    score: 0,
    id: playerId,
  })

  socket.emit("start", cPlayer)

  socket.on("bait", (bait) => {
    drawBait(bait.x, bait.y, bait.value)
  })

  if (cPlayer) {
    context.fillRect(...getCoord(cPlayer))
  }

  window.addEventListener("keydown", (e) => {
    let direction = e.key === "d" ? "right" :
      e.key === "a" ? "left" :
        e.key === "w" ? "up" :
          e.key === "s" ? "down" : null
    if (direction) {
      context.clearRect(...getCoord(cPlayer))
      cPlayer.movePlayer(direction, 10)
      checkBoundary(cPlayer)
      context.fillRect(...getCoord(cPlayer))
    }
  })



});


function getCoord(player) {
  return [player.x, player.y, 20, 20]
}

function getRandomColor() {
  let r, g, b
  r = Math.floor(Math.random() * 256)
  g = Math.floor(Math.random() * 256)
  b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

function checkBoundary(player) {
  if (player.x < 5) {
    player.x = 5
  }
  if (player.x > CANVAS_WIDTH - 25) {
    player.x = CANVAS_WIDTH - 25
  }
  if (player.y < 5) {
    player.y = 5
  }
  if (player.y > CANVAS_HEIGHT - 25) {
    player.y = CANVAS_HEIGHT - 25
  }
}


function drawBait(x, y, value) {
  // value 1-5
  // bait of different colors and size acc. to value
  let colors = ["#f542cb", "#f55742", "#f5f242", "#428df5", "#42f56c"]
  context.beginPath()
  context.arc(x, y, 20 - (value * 2), 0, 2 * Math.PI, false)
  context.fillStyle = colors[value - 1]
  context.fill()
}

