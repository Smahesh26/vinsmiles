module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Keep cache short during migration; increase when Business Profile integration is live.
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Business Profile API configuration (set these in Vercel Environment Variables).
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const businessAccountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const businessLocationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  const missing = [
    !clientId && 'GOOGLE_CLIENT_ID',
    !clientSecret && 'GOOGLE_CLIENT_SECRET',
    !refreshToken && 'GOOGLE_REFRESH_TOKEN',
    !businessAccountId && 'GOOGLE_BUSINESS_ACCOUNT_ID',
    !businessLocationId && 'GOOGLE_BUSINESS_LOCATION_ID'
  ].filter(Boolean);

  if (missing.length) {
    return res.status(500).json({ 
      error: 'Missing API Credentials',
      message: `Please configure the following environment variables: ${missing.join(', ')}`
    });
  }

  try {
    // TODO (after Google approves your Business Profile API access):
    // 1) Exchange GOOGLE_REFRESH_TOKEN for an access token using:
    //    GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
    // 2) Call the Business Profile endpoint for reviews using:
    //    GOOGLE_BUSINESS_ACCOUNT_ID and GOOGLE_BUSINESS_LOCATION_ID.
    // 3) Map the Business Profile response to this frontend contract:
    //    {
    //      rating: number,
    //      total_reviews: number,
    //      reviews: [
    //        {
    //          author_name: string,
    //          text: string,
    //          rating: number
    //        }
    //      ]
    //    }

    return res.status(503).json({
      error: 'Business Profile API access pending',
      message: 'Google Business Profile API access is not approved yet. Reviews will be available after approval and endpoint wiring.'
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      error: 'Internal Server Error while fetching reviews',
      message: error && error.message ? error.message : 'Unexpected error while preparing Google Business Profile API call'
    });
  }
};
