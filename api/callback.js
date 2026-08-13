const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

function getQuery(req) {
    return new URL(req.url, `https://${req.headers.host}`).searchParams;
}

function decodeState(state) {
    const dot = state.lastIndexOf('.');
    if (dot < 0) return '/';
    return Buffer.from(state.slice(dot + 1), 'base64url').toString();
}

function redirect(res, location) {
    res.writeHead(302, { Location: location });
    res.end();
}

export default async function handler(req, res) {
    const query = getQuery(req);
    const code = query.get('code');
    const state = query.get('state') || '';

    const redirectUri = decodeState(state);

    if (!code) {
        redirect(res, `${redirectUri}#error=missing_code`);
        return;
    }

    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
    const callbackUri = `${process.env.OAUTH_BASE_URL || `https://${req.headers.host}`}/api/callback`;

    console.error(`[oauth-callback] code=${code} state=${state} redirectUri=${redirectUri} cb=${callbackUri}`);

    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callbackUri }),
    });

    const data = await tokenRes.json();
    console.error(`[oauth-callback] github_response=${JSON.stringify(data)}`);

    const fragment = data.access_token
        ? `access_token=${data.access_token}&token_type=${data.token_type || 'bearer'}`
        : `error=${encodeURIComponent(data.error_description || data.error || 'OAuth failed')}`;

    redirect(res, `${redirectUri}#${fragment}`);
}
