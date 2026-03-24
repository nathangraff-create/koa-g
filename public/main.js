import GameScene from "./game/GameScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  scene: [GameScene]
};

new Phaser.Game(config);