const PUBLICATION_ID = 'pub_ca080da3-c12a-4560-bfaf-842af5bac2b3';
const BASELINE = 100;

exports.handler = async () => {
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { 'Cache-Control': 'public, max-age=60' },
        body: JSON.stringify({ total: BASELINE })
      };
    }

    const data = await res.json();
    const real =
      data?.total_results ??
      data?.pagination?.total ??
      data?.total ??
      (Array.isArray(data?.data) ? data.data.length : 0);

    return {
      statusCode: 200,
      headers: { 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ total: BASELINE + (Number(real) || 0) })
    };
  } catch (err) {
    console.error('count error', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ total: BASELINE })
    };
  }
};
