import GameScene from "/game/GameScene.js";
import UIScene from "/UiScene.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game",
  scene: [GameScene, UIScene]
};

new Phaser.Game(config);