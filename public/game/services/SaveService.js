export default class SaveService {
  constructor() {
    this.baseUrl = "http://localhost:3000";
  }

  async load() {
    const res = await fetch(`${this.baseUrl}/player/1`);
    return res.json();
  }

  async save(data) {
    await fetch(`${this.baseUrl}/player/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }
}