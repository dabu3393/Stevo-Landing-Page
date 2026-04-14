const PUBLICATION_ID = 'pub_ca080da3-c12a-4560-bfaf-842af5bac2b3';
const BASELINE = 100;
const PAGE_SIZE = 100;

exports.handler = async () => {
  try {
    let real = 0;
    let page = 1;

    while (true) {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions?limit=${PAGE_SIZE}&page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) {
        console.error('Beehiiv count error', res.status, await res.text());
        break;
      }

      const data = await res.json();

      if (page === 1 && typeof data?.total_results === 'number') {
        real = data.total_results;
        break;
      }

      const batch = Array.isArray(data?.data) ? data.data.length : 0;
      real += batch;
      if (batch < PAGE_SIZE) break;
      page++;
      if (page > 50) break;
    }

    return {
      statusCode: 200,
      headers: { 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ total: BASELINE + real, real })
    };
  } catch (err) {
    console.error('count error', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ total: BASELINE })
    };
  }
};
