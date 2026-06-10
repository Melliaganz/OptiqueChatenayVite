import crypto from 'node:crypto';
import { checkPassword, getAccessToken, safeName, BUCKET } from './_lib/gcs.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkPassword(req)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const { name, contentType, data, description } = req.body || {};
  if (!name || !data) {
    return res.status(400).json({ error: 'Missing name or data' });
  }

  const buffer = Buffer.from(String(data), 'base64');
  const metadata = {
    name: `images/${safeName(name)}`,
    contentType: contentType || 'application/octet-stream',
    cacheControl: 'public, max-age=31536000',
    metadata: {
      description: String(description || ''),
      // Jeton attendu par getDownloadURL() du SDK client Firebase
      firebaseStorageDownloadTokens: crypto.randomUUID(),
    },
  };

  // Upload multipart : une partie JSON (métadonnées) + une partie binaire (image)
  const boundary = `gcs-${crypto.randomUUID()}`;
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\nContent-Type: ${metadata.contentType}\r\n\r\n`
    ),
    buffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  try {
    const token = await getAccessToken();
    const gcsRes = await fetch(
      `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=multipart`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );
    if (!gcsRes.ok) {
      return res.status(502).json({ error: 'Upload failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Upload failed' });
  }
}
