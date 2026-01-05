export default async function handler(req, res) {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  const placeId = process.env.VITE_GOOGLE_PLACE_ID;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;

  // Sécurité : Vérifier les variables d'environnement
  if (!apiKey || !placeId) {
    return res.status(500).json({ error: 'Missing API Key or Place ID' });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Headers pour la performance et CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    // Cache de 24h pour améliorer le score LCP et réduire les appels Google
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Google data' });
  }
}
