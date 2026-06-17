const { Redis } = require('@upstash/redis');
const crypto = require('crypto');

const redis = Redis.fromEnv();

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
  while (await redis.exists(`prog:${id}`)) id = randomId();

  const item = {
    id,
    title: title || 'Untitled',
    chords,
    bpm: bpm || 80,
    sound: sound || 'piano',
    createdAt: new Date().toISOString(),
  };

  await redis.set(`prog:${id}`, JSON.stringify(item));
  await redis.lpush('recent', id);
  await redis.ltrim('recent', 0, 99);

  return res.status(200).json({ id });
};
