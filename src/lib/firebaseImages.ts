const FIREBASE_BUCKET_URL =
  "https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/";

// URL publique d'une variante redimensionnée (convention "nom_LxH.ext") d'une
// image du bucket Firebase Storage
export function getResizedUrl(fullPath: string, size: string): string {
  const dotIndex = fullPath.lastIndexOf(".");
  const name = fullPath.substring(0, dotIndex);
  const ext = fullPath.substring(dotIndex);
  const resizedPath = `${name}_${size}${ext}`;
  return `${FIREBASE_BUCKET_URL}${encodeURIComponent(resizedPath)}?alt=media`;
}
