exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) };
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const response = await fetch(
    'https://api.beehiiv.com/v2/publications/pub_ca080da3-c12a-4560-bfaf-842af5bac2b3/subscriptions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true
      })
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error('Beehiiv error', response.status, detail);
    return { statusCode: 400, body: JSON.stringify({ error: 'Subscription failed' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
