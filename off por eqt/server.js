import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Corrigir __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// "BANCO" TEMPORÁRIO (MEMÓRIA)
// =========================
let player = {
  gold: 0,
  lastLogin: Date.now(),
  inventory: [],
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  }
};

// =========================
// FUNÇÃO DE PROGRESSO OFFLINE
// =========================
function applyOfflineProgress(player) {
  const now = Date.now();
  const diff = (now - player.lastLogin) / 1000;

  // limite de 8 horas
  const capped = Math.min(diff, 60 * 60 * 8);

  const goldEarned = Math.floor(capped * 2);

  return {
    ...player,
    gold: player.gold + goldEarned,
    lastLogin: now
  };
}

// =========================
// API
// =========================

// LOAD
app.get("/player/1", (req, res) => {
  player = applyOfflineProgress(player);

  res.json({
    player,
    inventory: player.inventory,
    equipment: player.equipment
  });
});

// SAVE
app.post("/player/1", (req, res) => {
  const data = req.body;

  // validação básica (anti-quebra)
  player = {
    gold: Math.max(0, data.gold || 0),
    lastLogin: data.lastLogin || Date.now(),
    inventory: Array.isArray(data.inventory) ? data.inventory : [],
    equipment: data.equipment || {
      weapon: null,
      armor: null,
      accessory: null
    }
  };

  res.json({ status: "saved" });
});

// =========================
// SERVIR FRONTEND (PWA)
// =========================
app.use(express.static(path.join(__dirname, "public")));

// fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server rodando na porta:", PORT);
});