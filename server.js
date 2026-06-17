const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3456;
const DB_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Load / save JSON db
function loadDb() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return { progressions: {} }; }
}
function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function randomId(len = 6) {
  return crypto.randomBytes(len).toString('base64url').slice(0, len);
}

// POST /api/save  { title, chords, bpm, sound }
app.post('/api/save', (req, res) => {
  const { title, chords, bpm, sound } = req.body;
  if (!chords || typeof chords !== 'string') {
    return res.status(400).json({ error: 'chords required' });
  }
  const db = loadDb();
  let id = randomId();
  while (db.progressions[id]) id = randomId(); // collision avoidance
  db.progressions[id] = {
    id, title: title || 'Untitled',
    chords, bpm: bpm || 80, sound: sound || 'piano',
    createdAt: new Date().toISOString(),
  };
  saveDb(db);
  res.json({ id });
});

// GET /api/load/:id
app.get('/api/load/:id', (req, res) => {
  const db = loadDb();
  const item = db.progressions[req.params.id];
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
});

// GET /api/recent  — last 20
app.get('/api/recent', (req, res) => {
  const db = loadDb();
  const list = Object.values(db.progressions)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20)
    .map(({ id, title, createdAt }) => ({ id, title, createdAt }));
  res.json(list);
});

app.listen(PORT, () => console.log(`chord-player running on http://localhost:${PORT}`));
