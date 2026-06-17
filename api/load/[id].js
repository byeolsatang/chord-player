const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });

  const raw = await kv.get(`prog:${id}`);
  if (!raw) return res.status(404).json({ error: 'not found' });

  const item = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return res.status(200).json(item);
};
