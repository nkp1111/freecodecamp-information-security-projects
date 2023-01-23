class Player {
  constructor({ x, y, score, id }) {
    this.x = x
    this.y = y
    this.score = score
    this.id = id
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
      case "up":
        this.y -= speed;
        break;
      case "down":
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
