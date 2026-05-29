exports.handler = async function(event, context) {
  const clientId = '5s497mxz0bz54rfyde1b3qorim8v7e';
  const clientSecret = 'l89ivoi30wli64jijql9vom90ktos4';
  const username = 'alldaynyc';

  try {
    const tokenRes = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) return { statusCode: 200, body: JSON.stringify({ live: false }) };

    const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const streamData = await streamRes.json();

    if (streamData.data && streamData.data.length > 0) {
      const stream = streamData.data[0];
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ live: true, title: stream.title || '', viewers: stream.viewer_count || 0 })
      };
    }

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ live: false }) };

  } catch (e) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ live: false }) };
  }
};
