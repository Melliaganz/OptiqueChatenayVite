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

  try {
    const token = await getAccessToken();
    const objectPath = encodeURIComponent(`images/${safeName(name)}`);
    const gcsRes = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${objectPath}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!gcsRes.ok && gcsRes.status !== 404) {
      return res.status(502).json({ error: 'Delete failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Delete failed' });
  }
}
