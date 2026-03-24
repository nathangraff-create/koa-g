export function generateItem() {
  return {
    name: "Sword",
    type: "weapon",
    rarity: "common",
    stats: {
      attack: Math.floor(Math.random() * 5),
      crit: Math.random() * 0.1
    }
  };
}