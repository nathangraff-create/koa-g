export default class SaveService {
  async load() {
    try {
      const res = await fetch("/player/1");
      return await res.json();
    } catch (e) {
      console.warn("API falhou, usando localStorage");

      const data = localStorage.getItem("save");

      return data
        ? JSON.parse(data)
        : {
            player: { gold: 0 },
            inventory: [],
            equipment: {}
          };
    }
  }

  save(data) {
    localStorage.setItem("save", JSON.stringify(data));
  }
}