import UIManager from "./game/ui/UIManager.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  create() {
    this.gameScene = this.scene.get("GameScene");
    this.ui = new UIManager(this);

    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => this.ui.update(this.gameScene)
    });
  }
}