// Client des endpoints d'administration (/api/admin-*).
// Le mot de passe transite dans un header et n'est vérifié que côté serveur.

const PASSWORD_HEADER = "x-admin-password";

export async function verifyPassword(password: string): Promise<boolean> {
  const res = await fetch("/api/admin-verify", {
    method: "POST",
    headers: { [PASSWORD_HEADER]: password },
  });
  return res.ok;
}

// Recompresse l'image dans le navigateur : limite la définition et le poids
// avant l'envoi (les fonctions Vercel plafonnent à ~4,5 Mo par requête)
async function compressImage(file: File, maxDim = 1600, quality = 0.8): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? file), "image/webp", quality);
    });
  } catch {
    return file;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// XMLHttpRequest plutôt que fetch : seul moyen d'avoir la progression d'envoi
function postWithProgress(
  url: string,
  password: string,
  body: string,
  onProgress: (pct: number) => void
): Promise<number> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(PASSWORD_HEADER, password);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => resolve(xhr.status);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(body);
  });
}

export async function uploadImage(
  file: File,
  description: string,
  password: string,
  onProgress: (pct: number) => void
): Promise<boolean> {
  const blob = await compressImage(file);
  const data = await blobToBase64(blob);
  // toBlob peut replier sur un autre format que webp (vieux Safari)
  const ext = blob.type === "image/webp" ? ".webp" : `.${blob.type.split("/")[1] || "jpg"}`;
  const name = file.name.replace(/\.[^.]+$/, "") + ext;

  const status = await postWithProgress(
    "/api/admin-upload",
    password,
    JSON.stringify({ name, contentType: blob.type, data, description }),
    onProgress
  );
  return status === 200;
}

export async function deleteImage(name: string, password: string): Promise<boolean> {
  const res = await fetch("/api/admin-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json", [PASSWORD_HEADER]: password },
    body: JSON.stringify({ name }),
  });
  return res.ok;
}
