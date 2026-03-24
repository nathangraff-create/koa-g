export default class CombatSystem {
  constructor(heroSystem) {
    this.heroSystem = heroSystem;
    this.lastAttackTime = 0;
  }

  update(scene, enemy) {
    const now = Date.now();
    const stats = this.heroSystem.getHeroStats();

    const interval = 1000 / stats.speed;

    if (now - this.lastAttackTime >= interval) {
      this.lastAttackTime = now;

      let damage = stats.attack;
      const mitigation = enemy.defense / (enemy.defense + 150);
      damage *= (1 - mitigation);

      if (Math.random() < stats.crit) {
        damage *= 1.5;
      }

      enemy.hp -= Math.floor(damage);
    }
  }
}