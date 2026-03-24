import InventorySystem from "./systems/InventorySystem.js";
import HeroSystem from "./systems/HeroSystem.js";
import CombatSystem from "./systems/CombatSystem.js";
import { generateItem } from "./systems/LootSystem.js";
import SaveService from "./services/SaveService.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  async create() {
    this.inventory = new InventorySystem();
    this.heroSystem = new HeroSystem(this.inventory);
    this.combatSystem = new CombatSystem(this.heroSystem);
    this.saveService = new SaveService();

    const data = await this.saveService.load();

    this.gold = data.player?.gold || 0;
    this.inventory.items = data.inventory || [];
    this.inventory.equipment = data.equipment || {};

    this.enemy = this.spawnEnemy();

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: this.updateCombat,
      callbackScope: this
    });

    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: this.autoSave,
      callbackScope: this
    });
  }

  updateCombat() {
    this.combatSystem.update(this, this.enemy);

    if (this.enemy.hp <= 0) {
      this.gold += 10;

      if (Math.random() < 0.5) {
        this.inventory.addItem(generateItem());
      }

      this.enemy = this.spawnEnemy();
    }
  }

  spawnEnemy() {
    return {
      hp: 50 + Math.random() * 50,
      defense: 10 + Math.random() * 10
    };
  }

  autoSave() {
    this.saveService.save({
      gold: this.gold,
      lastLogin: Date.now(),
      inventory: this.inventory.items,
      equipment: this.inventory.equipment
    });
  }
}