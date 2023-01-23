import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
context.fillStyle = "#191919"

let players = []
let cPlayer

socket.on('connect', function () {
  let playerId = socket.io.engine.id
  cPlayer = new Player({
    x: 100,
    y: 100,
    score: 0,
    id: playerId
  })

  if (cPlayer) {
    context.fillRect(...getCoord(cPlayer))
  }

  window.addEventListener("keydown", (e) => {
    let direction = e.key === "d" ? "RIGHT" :
      e.key === "a" ? "LEFT" :
        e.key === "w" ? "UP" :
          e.key === "s" ? "DOWN" : null
    if (direction) {
      context.clearRect(...getCoord(cPlayer))
      cPlayer.movePlayer(direction, 50)
      context.fillRect(...getCoord(cPlayer))
    }
  })

});


function getCoord(player, size) {
  return [player.x, player.y, size || 20, size || 20]
}
