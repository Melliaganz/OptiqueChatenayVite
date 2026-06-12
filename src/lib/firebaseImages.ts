// Accès à Firebase Storage par son API REST publique : le bucket est en
// lecture publique (les URLs ?alt=media fonctionnent sans token), le SDK
// firebase (~43 kB) n'apporte rien de plus ici.
const BUCKET =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "optiquechatenay-44520.appspot.com";

const API_BASE = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

// L'extension Firebase "Resize Images" génère des copies "nom_LxH.ext"
export function isResizedVariant(name: string): boolean {
  return /_\d+x\d+\.[^.]+$/.test(name);
}

// URL publique d'un fichier du bucket ("images/photo.webp")
export function getFileUrl(fullPath: string): string {
  return `${API_BASE}/${encodeURIComponent(fullPath)}?alt=media`;
}

// URL publique d'une variante redimensionnée (convention "nom_LxH.ext")
export function getResizedUrl(fullPath: string, size: string): string {
  const dotIndex = fullPath.lastIndexOf(".");
  const name = fullPath.substring(0, dotIndex);
  const ext = fullPath.substring(dotIndex);
  return getFileUrl(`${name}_${size}${ext}`);
}

// Tous les chemins ("images/...") sous un préfixe, pagination comprise
export async function listFiles(prefix: string): Promise<string[]> {
  const names: string[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({ prefix });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) throw new Error(`Listing du bucket : HTTP ${res.status}`);
    const data: { items?: { name: string }[]; nextPageToken?: string } =
      await res.json();
    for (const item of data.items ?? []) names.push(item.name);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return names;
}

export interface FileMetadata {
  timeCreated: string;
  description: string;
}

export async function getFileMetadata(fullPath: string): Promise<FileMetadata> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(fullPath)}`);
  if (!res.ok) throw new Error(`Métadonnées de ${fullPath} : HTTP ${res.status}`);
  const data: { timeCreated: string; metadata?: { description?: string } } =
    await res.json();
  return {
    timeCreated: data.timeCreated,
    description: data.metadata?.description || "",
  };
}
