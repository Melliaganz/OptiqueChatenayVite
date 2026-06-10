import { checkPassword, getAccessToken, safeName, BUCKET } from './_lib/gcs.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkPassword(req)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const { name } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  const base = safeName(name);
  const dot = base.lastIndexOf('.');
  const stem = dot === -1 ? base : base.slice(0, dot);

  try {
    const token = await getAccessToken();

    // L'extension Resize Images crée des copies "nom_LxH.ext" : on supprime
    // l'originale et toutes ses variantes
    const targets = new Set([`images/${base}`]);
    const listRes = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o?prefix=${encodeURIComponent(`images/${stem}_`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (listRes.ok) {
      const data = await listRes.json();
      for (const item of data.items || []) {
        if (/_\d+x\d+\.[^.]+$/.test(item.name)) targets.add(item.name);
      }
    }

    for (const objectName of targets) {
      const gcsRes = await fetch(
        `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(objectName)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!gcsRes.ok && gcsRes.status !== 404) {
        return res.status(502).json({ error: 'Delete failed' });
      }
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Delete failed' });
  }
}
