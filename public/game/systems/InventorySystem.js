export default class InventorySystem {
  constructor() {
    this.items = [];
    this.equipment = { weapon: null, armor: null, accessory: null };
    this.maxSlots = 30;
  }

  addItem(item) {
    if (this.items.length >= this.maxSlots) return;
    this.items.push(item);
  }

  getTotalStats() {
    let stats = { attack: 0, defense: 0, crit: 0 };

    Object.values(this.equipment).forEach(item => {
      if (!item) return;
      stats.attack += item.stats.attack || 0;
      stats.defense += item.stats.defense || 0;
      stats.crit += item.stats.crit || 0;
    });

    return stats;
  }
}