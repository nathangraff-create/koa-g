import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let player = {
  gold: 0,
  inventory: [],
  equipment: {}
};

app.get("/player/1", (req, res) => {
  res.json({
    player,
    inventory: player.inventory,
    equipment: player.equipment
  });
});

app.post("/player/1", (req, res) => {
  player = req.body;
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Server running"));