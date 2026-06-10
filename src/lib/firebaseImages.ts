// Même source que la config client (lib/firebase.ts), avec repli sur le bucket connu
const BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "optiquechatenay-44520.appspot.com";

const FIREBASE_BUCKET_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/`;

// L'extension Firebase "Resize Images" génère des copies "nom_LxH.ext"
export function isResizedVariant(name: string): boolean {
  return /_\d+x\d+\.[^.]+$/.test(name);
}

// URL publique d'une variante redimensionnée (convention "nom_LxH.ext") d'une
// image du bucket Firebase Storage
export function getResizedUrl(fullPath: string, size: string): string {
  const dotIndex = fullPath.lastIndexOf(".");
  const name = fullPath.substring(0, dotIndex);
  const ext = fullPath.substring(dotIndex);
  const resizedPath = `${name}_${size}${ext}`;
  return `${FIREBASE_BUCKET_URL}${encodeURIComponent(resizedPath)}?alt=media`;
}
