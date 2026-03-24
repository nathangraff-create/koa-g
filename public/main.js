import Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js";
import GameScene from "./game/GameScene.js";
import UIScene from "./game/UIScene.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game",
  scene: [GameScene, UIScene]
};

new Phaser.Game(config);