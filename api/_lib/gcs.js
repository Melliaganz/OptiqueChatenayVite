import crypto from 'node:crypto';

export const BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || 'optiquechatenay-44520.appspot.com';

// Comparaison en temps constant pour éviter les attaques par timing
export function checkPassword(req) {
  const provided = String(req.headers['x-admin-password'] || '');
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  const a = crypto.createHash('sha256').update(provided).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

// Freine le brute-force : chaque tentative ratée coûte au moins une seconde
export function bruteForceDelay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

let cachedToken = null;

// Jeton d'accès OAuth2 obtenu en signant un JWT avec la clé de service
// (équivalent minimal de firebase-admin, sans dépendance)
export async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiry - 60000) {
    return cachedToken.token;
  }

  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claims = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/devstorage.read_write',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  ).toString('base64url');

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(sa.private_key, 'base64url');
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error('Token exchange failed');

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

// Nom de fichier seul, sans chemin (bloque le path traversal)
export function safeName(name) {
  return String(name).split('/').pop().split('\\').pop();
}
