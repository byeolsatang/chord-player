const { kv } = require('@vercel/kv');
const crypto = require('crypto');

function randomId() {
  return crypto.randomBytes(4).toString('base64url').slice(0, 6);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, chords, bpm, sound } = req.body;
  if (!chords || typeof chords !== 'string') {
    return res.status(400).json({ error: 'chords required' });
  }

  let id = randomId();
  // collision avoidance
  while (await kv.exists(`prog:${id}`)) id = randomId();

  const item = {
    id,
    title: title || 'Untitled',
    chords,
    bpm: bpm || 80,
    sound: sound || 'piano',
    createdAt: new Date().toISOString(),
  };

  await kv.set(`prog:${id}`, JSON.stringify(item));
  await kv.lpush('recent', id);
  await kv.ltrim('recent', 0, 99);

  return res.status(200).json({ id });
};
