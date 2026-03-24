import InventorySystem from "./systems/InventorySystem.js";
import HeroSystem from "./systems/HeroSystem.js";
import CombatSystem from "./systems/CombatSystem.js";
import { generateItem } from "./systems/LootSystem.js";
import SaveService from "./services/SaveService.js";
import MissionSystem from "./systems/MissionSystem.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  async create() {
    console.log("Game iniciou");

    // Sistemas
    this.inventory = new InventorySystem();
    this.heroSystem = new HeroSystem(this.inventory);
    this.combatSystem = new CombatSystem(this.heroSystem);
    this.saveService = new SaveService();
    this.missionSystem = new MissionSystem(this);

    // Load save
    try {
      const data = await this.saveService.load();

      this.gold = data.player?.gold || 0;
      this.inventory.items = data.inventory || [];
      this.inventory.equipment = data.equipment || {};
    } catch {
      this.gold = 0;
    }

    // Estado
    this.level = 1;
    this.enemy = this.spawnEnemy();

    // 🎨 UI
    this.enemyBox = this.add.rectangle(400, 250, 120, 120, 0xaa0000);

    this.enemyText = this.add.text(330, 180, "", { color: "#fff" });
    this.goldText = this.add.text(20, 20, "", { color: "#ffd700" });
    this.levelText = this.add.text(20, 50, "", { color: "#00ffff" });

    // 🖱 Clique SOMENTE no inimigo
    this.enemyBox.setInteractive().on("pointerdown", () => {
      this.hitEnemy(20);
    });

    // 🟦 BOTÃO MISSÃO
    this.missionButton = this.add.rectangle(400, 550, 220, 60, 0x6666ff)
      .setInteractive()
      .on("pointerdown", () => {
        this.missionSystem.startMission();
      });

    this.missionText = this.add.text(340, 535, "Iniciar Missão", {
      color: "#fff"
    });

    // 🟩 BARRA DE PROGRESSO
    this.progressBg = this.add.rectangle(400, 500, 300, 20, 0x222222);

    this.progressBar = this.add.rectangle(250, 500, 0, 20, 0x00ff00)
      .setOrigin(0, 0.5);

    // ⏱ Loop idle
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.updateCombat,
      callbackScope: this
    });

    // 💾 Autosave
    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: this.autoSave,
      callbackScope: this
    });
  }

  // ⚔️ Loop principal
  updateCombat() {
    const delta = this.game.loop.delta;

    // dano passivo
    this.hitEnemy(5);

    // missão com tempo real
    this.missionSystem.update(delta);

    // UI
    this.enemyText.setText(`Enemy HP: ${Math.floor(this.enemy.hp)}`);
    this.goldText.setText(`Gold: ${this.gold}`);
    this.levelText.setText(`Level: ${this.level}`);

    const progress = this.missionSystem.getProgress();
    this.progressBar.width = 300 * progress;

    if (this.missionSystem.isRunning()) {
      this.missionText.setText("Em missão...");
    } else {
      this.missionText.setText("Iniciar Missão");
    }

    // morte do inimigo
    if (this.enemy.hp <= 0) {
      this.killEnemy();
    }
  }

  // 💥 Dano
  hitEnemy(damage) {
    this.enemy.hp -= damage;

    // número flutuante
    const dmgText = this.add.text(400, 250, `-${damage}`, {
      fontSize: "18px",
      color: "#ff0000"
    }).setOrigin(0.5);

    this.tweens.add({
      targets: dmgText,
      y: dmgText.y - 50,
      alpha: 0,
      duration: 600,
      onComplete: () => dmgText.destroy()
    });

    // animação hit
    this.tweens.add({
      targets: this.enemyBox,
      scaleX: 1.1,
      scaleY: 1.1,
      yoyo: true,
      duration: 100
    });
  }

  // ☠️ Matar inimigo
  killEnemy() {
    this.gold += 10;
    this.level++;

    if (Math.random() < 0.5) {
      const item = generateItem();
      this.inventory.addItem(item);
      console.log("Drop:", item);
    }

    this.enemy = this.spawnEnemy();
  }

  // 🎁 Drop simples (usado na missão)
  generateItemDrop() {
    return {
      name: "Item " + Math.floor(Math.random() * 100),
      rarity: "common"
    };
  }

  // 👹 Spawn inimigo
  spawnEnemy() {
    return {
      hp: 50 + this.level * 20,
      defense: 10 + this.level * 5
    };
  }

  // 💾 Save
  autoSave() {
    this.saveService.save({
      player: { gold: this.gold },
      lastLogin: Date.now(),
      inventory: this.inventory.items,
      equipment: this.inventory.equipment
    });
  }
}