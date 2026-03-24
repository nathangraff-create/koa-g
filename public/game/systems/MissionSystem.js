export default class MissionSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMission = null;
  }

  startMission() {
    if (this.currentMission) return;

    this.currentMission = {
      duration: 10, // segundos
      progress: 0
    };

    console.log("Missão iniciada");
  }

  update(delta) {
    if (!this.currentMission) return;

    this.currentMission.progress += delta / 1000;

    if (this.currentMission.progress >= this.currentMission.duration) {
      this.completeMission();
    }
  }

  completeMission() {
    console.log("Missão completa");

    // recompensa
    this.scene.gold += 50;

    if (Math.random() < 0.5) {
      const item = this.scene.generateItemDrop();
      this.scene.inventory.addItem(item);
    }

    this.currentMission = null;
  }

  getProgress() {
    if (!this.currentMission) return 0;

    return this.currentMission.progress / this.currentMission.duration;
  }

  isRunning() {
    return this.currentMission !== null;
  }
}