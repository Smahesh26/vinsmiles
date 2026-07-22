async function resolvePlaceId(apiKey) {
  const explicitQuery = process.env.GOOGLE_PLACE_QUERY;
  const fallbackQuery = 'VinSmiles Greater Kailash II New Delhi';
  const query = (explicitQuery && explicitQuery.trim()) || fallbackQuery;

  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`;
  const findResponse = await fetch(findUrl);
  const findData = await findResponse.json();

  if (findData.status !== 'OK' || !findData.candidates || !findData.candidates.length) {
    const message = findData.error_message || `Could not resolve place from query: ${query}`;
    throw new Error(message);
  }

  return findData.candidates[0].place_id;
}

module.exports = async function(req, res) {
  // Allow cross-origin requests if accessed from elsewhere, though Vercel handles this for the same domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Cache the response for 12 hours (43200 seconds) to avoid hitting Google API limits
  res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const configuredPlaceId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Missing API Credentials',
      message: 'Please configure GOOGLE_PLACES_API_KEY in your Vercel Environment Variables.'
    });
  }

  try {
    const placeId = configuredPlaceId || await resolvePlaceId(apiKey);

    // The Google Places API Details endpoint
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,user_ratings_total,rating&key=${apiKey}`;
    
    // Using native fetch (available in Node 18+ which Vercel uses by default)
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google API Error:', data.status, data.error_message);
      return res.status(500).json({ error: data.error_message || 'Failed to fetch from Google Places API' });
    }

    // Return the cleaned data to the frontend
    return res.status(200).json({
      place_id: placeId,
      rating: data.result.rating,
      total_reviews: data.result.user_ratings_total,
      reviews: data.result.reviews || []
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: 'Internal Server Error while fetching reviews' });
  }
};
