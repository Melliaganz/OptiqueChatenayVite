import { checkPassword } from './_lib/gcs.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkPassword(req)) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  return res.status(200).json({ ok: true });
}
