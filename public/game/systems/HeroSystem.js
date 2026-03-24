export default class HeroSystem {
  constructor(inventory) {
    this.inventory = inventory;

    this.heroes = [
      {
        baseStats: { attack: 5, defense: 5, crit: 0.05, speed: 1 }
      }
    ];
  }

  getHeroStats() {
    const base = this.heroes[0].baseStats;
    const equip = this.inventory.getTotalStats();

    return {
      attack: base.attack + equip.attack,
      defense: base.defense + equip.defense,
      crit: Math.min(base.crit + equip.crit, 0.6),
      speed: Math.min(base.speed + (equip.speed || 0), 3)
    };
  }
}