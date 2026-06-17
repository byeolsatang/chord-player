const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  const ids = await kv.lrange('recent', 0, 19);
  if (!ids || !ids.length) return res.status(200).json([]);

  const items = await Promise.all(
    ids.map(async id => {
      const raw = await kv.get(`prog:${id}`);
      if (!raw) return null;
      const item = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return { id: item.id, title: item.title, createdAt: item.createdAt };
    })
  );

  return res.status(200).json(items.filter(Boolean));
};
