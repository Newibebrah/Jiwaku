const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

function getBaseUrl(req) {
    return process.env.OAUTH_BASE_URL || `https://${req.headers.host}`;
}

function getQuery(req) {
    return new URL(req.url, `https://${req.headers.host}`).searchParams;
}

export default async function handler(req, res) {
    const query = getQuery(req);

    const clientId = query.get('client_id') || process.env.OAUTH_GITHUB_CLIENT_ID;
    const scope = query.get('scope') || 'repo';
    const provider = query.get('provider') || 'github';
    const state = query.get('state') || '';
    const redirectUri = query.get('redirect_uri') || '';

    const callbackUri = `${getBaseUrl(req)}/api/callback`;
    const packedState = `${state}.${Buffer.from(redirectUri).toString('base64url')}`;

    const authorize = new URL(GITHUB_AUTHORIZE_URL);
    authorize.searchParams.set('client_id', clientId);
    authorize.searchParams.set('redirect_uri', callbackUri);
    authorize.searchParams.set('scope', scope);
    authorize.searchParams.set('state', packedState);
    if (provider === 'github') {
        authorize.searchParams.set('provider', provider);
    }

    res.writeHead(302, { Location: authorize.toString() });
    res.end();
}
