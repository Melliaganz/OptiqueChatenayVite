// Génère src/img/carteOsm.webp : aperçu statique OpenStreetMap centré sur le
// magasin, avec repère incrusté. À relancer seulement si l'adresse change :
//   yarn node scripts/genere-carte-osm.mjs
import sharp from "sharp";

const LAT = 48.75091480826975;
const LON = 2.261266276856034;
const ZOOM = 16;
const WIDTH = 1024;
const HEIGHT = 768;
const TILE = 256;

const n = 2 ** ZOOM;
const xf = ((LON + 180) / 360) * n;
const latRad = (LAT * Math.PI) / 180;
const yf = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

const centerX = xf * TILE;
const centerY = yf * TILE;
const left = Math.round(centerX - WIDTH / 2);
const top = Math.round(centerY - HEIGHT / 2);

const x0 = Math.floor(left / TILE);
const y0 = Math.floor(top / TILE);
const x1 = Math.floor((left + WIDTH - 1) / TILE);
const y1 = Math.floor((top + HEIGHT - 1) / TILE);

const tiles = [];
for (let x = x0; x <= x1; x++) {
  for (let y = y0; y <= y1; y++) {
    tiles.push({ x, y });
  }
}

console.log(`Téléchargement de ${tiles.length} tuiles (z${ZOOM})...`);
const buffers = await Promise.all(
  tiles.map(async ({ x, y }) => {
    const res = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${x}/${y}.png`, {
      headers: { "User-Agent": "OptiqueChatenay-static-map-once/1.0 (contact: lucaslengrandsites@gmail.com)" },
    });
    if (!res.ok) throw new Error(`Tuile ${x},${y} : HTTP ${res.status}`);
    return { x, y, buf: Buffer.from(await res.arrayBuffer()) };
  })
);

// Repère : goutte rose de la charte, pointe posée sur le magasin (centre)
const pin = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24">
  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
    fill="#ff69b4" stroke="#1a1a1a" stroke-width="1.2"/>
  <circle cx="12" cy="9" r="2.6" fill="#ffffff"/>
</svg>`);

const mosaic = sharp({
  create: {
    width: (x1 - x0 + 1) * TILE,
    height: (y1 - y0 + 1) * TILE,
    channels: 3,
    background: "#eee",
  },
})
  .composite(buffers.map(({ x, y, buf }) => ({ input: buf, left: (x - x0) * TILE, top: (y - y0) * TILE })))
  .png();

await sharp(await mosaic.toBuffer())
  .extract({ left: left - x0 * TILE, top: top - y0 * TILE, width: WIDTH, height: HEIGHT })
  .composite([{ input: pin, left: Math.round(WIDTH / 2 - 28), top: HEIGHT / 2 - 56 + 2 }])
  .webp({ quality: 82 })
  .toFile("src/img/carteOsm.webp");

console.log("OK -> src/img/carteOsm.webp");
