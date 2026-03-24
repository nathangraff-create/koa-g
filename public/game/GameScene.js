import InventorySystem from "./systems/InventorySystem.js";
import HeroSystem from "./systems/HeroSystem.js";
import CombatSystem from "./systems/CombatSystem.js";
import { generateItem } from "./systems/LootSystem.js";
import SaveService from "./services/SaveService.js";

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

    // 🖱 Clique para atacar
    this.input.on("pointerdown", () => {
      this.hitEnemy(20);
    });

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

  // ⚔️ Combate automático
  updateCombat() {
    this.hitEnemy(5); // dano passivo

    this.enemyText.setText(`Enemy HP: ${Math.floor(this.enemy.hp)}`);
    this.goldText.setText(`Gold: ${this.gold}`);
    this.levelText.setText(`Level: ${this.level}`);

    if (this.enemy.hp <= 0) {
      this.killEnemy();
    }
  }

  // 💥 Aplicar dano
  hitEnemy(damage) {
    this.enemy.hp -= damage;

    // 🔥 dano flutuante
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

    // efeito visual no inimigo
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

    // loot
    if (Math.random() < 0.5) {
      const item = generateItem();
      this.inventory.addItem(item);
      console.log("Drop:", item);
    }

    this.enemy = this.spawnEnemy();
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