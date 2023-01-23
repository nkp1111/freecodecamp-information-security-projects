class Player {
  constructor({ x, y, score, id }) {
    this.x = x
    this.y = y
    this.score = score
    this.id = id
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "LEFT":
        this.x -= speed;
        break;
      case "RIGHT":
        this.x += speed;
        break;
      case "UP":
        this.y -= speed;
        break;
      case "DOWN":
        this.y += speed;
        break;
    }
  }

  collision(item) {

  }

  calculateRank(arr) {

  }
}

export default Player;
