export default class UIManager {
  constructor(scene) {
    this.scene = scene;

    this.goldText = scene.add.text(20, 20, "Gold: 0");

    this.button = scene.add.text(20, 60, "Inventory")
      .setInteractive()
      .on("pointerdown", () => alert("Inventory aberto"));
  }

  update(game) {
    this.goldText.setText("Gold: " + game.gold);
  }
}
