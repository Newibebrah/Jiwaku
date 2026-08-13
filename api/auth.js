import { timingSafeEqual } from 'crypto';

function getQuery(req) {
    return new URL(req.url, `https://${req.headers.host}`).searchParams;
}

function readBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            resolve(new URLSearchParams(body));
        });
    });
}

function safeEqual(a, b) {
    const bufA = Buffer.from(String(a || ''));
    const bufB = Buffer.from(String(b || ''));
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
}

function loginPage(redirectUri, error) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Masuk — JIWAKU Admin</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background:
            radial-gradient(700px 400px at 85% -10%, rgba(10, 155, 201, 0.12), transparent 60%),
            radial-gradient(600px 350px at 5% 110%, rgba(124, 58, 237, 0.10), transparent 60%),
            #FFFFFF;
    }
    .card {
        width: min(100%, 380px);
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 20px;
        padding: 2rem 1.75rem;
        box-shadow: 0 14px 34px rgba(15, 27, 42, 0.09);
    }
    .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0B1520;
        margin-bottom: 0.4rem;
        letter-spacing: 0.01em;
    }
    .logo span { color: #0A9BC9; }
    .subtitle { color: #475569; font-size: 0.92rem; margin-bottom: 1.6rem; }
    .field { margin-bottom: 1.1rem; }
    label { display: block; font-weight: 500; font-size: 0.9rem; margin-bottom: 0.4rem; color: #0B1520; }
    input {
        width: 100%;
        padding: 0.72rem 0.9rem;
        border: 1px solid #CBD5E1;
        border-radius: 12px;
        font: inherit;
        font-size: 0.95rem;
        color: #0B1520;
        background: #FFFFFF;
        transition: border-color 0.3s, box-shadow 0.3s;
    }
    input:focus {
        outline: none;
        border-color: #0A9BC9;
        box-shadow: 0 0 0 3px rgba(10, 155, 201, 0.18);
    }
    button {
        width: 100%;
        padding: 0.8rem 1.2rem;
        border: none;
        border-radius: 999px;
        background: #0A9BC9;
        color: #fff;
        font: inherit;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 0.4rem;
        box-shadow: 0 8px 20px rgba(10, 155, 201, 0.28);
        transition: background 0.3s;
    }
    button:hover { background: #087AA0; }
    .error {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        color: #B91C1C;
        border-radius: 12px;
        padding: 0.7rem 0.9rem;
        font-size: 0.88rem;
        margin-bottom: 1.1rem;
    }
    .hint { margin-top: 1.2rem; font-size: 0.78rem; color: #64748B; text-align: center; }
</style>
</head>
<body>
    <div class="card">
        <div class="logo">JIWAKU<span>.</span></div>
        <p class="subtitle">Masuk untuk mengelola konten.</p>
        ${error ? `<div class="error">${error}</div>` : ''}
        <form method="POST" action="/api/auth">
            <input type="hidden" name="redirect_uri" value="${redirectUri}">
            <div class="field">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" autocomplete="username" required autofocus>
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" autocomplete="current-password" required>
            </div>
            <button type="submit">Masuk</button>
        </form>
        <p class="hint">Akses dibatasi. Hanya admin yang dapat masuk.</p>
    </div>
</body>
</html>`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function redirect(res, location) {
    res.writeHead(302, { Location: location });
    res.end();
}

export default async function handler(req, res) {
    const query = getQuery(req);
    const redirectUri = query.get('redirect_uri') || '/';

    if (req.method === 'POST') {
        const body = await readBody(req);
        const username = body.get('username');
        const password = body.get('password');
        const formRedirect = body.get('redirect_uri') || redirectUri;

        const expectedUser = process.env.ADMIN_USERNAME;
        const expectedPass = process.env.ADMIN_PASSWORD;
        const pat = process.env.GITHUB_PAT;

        if (expectedUser && expectedPass && pat && safeEqual(username, expectedUser) && safeEqual(password, expectedPass)) {
            console.error(`[oauth-auth] login_success=true`);
            redirect(res, `${formRedirect}#access_token=${encodeURIComponent(pat)}&token_type=bearer`);
            return;
        }

        console.error(`[oauth-auth] login_success=false`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(loginPage(escapeHtml(formRedirect), 'Username atau password salah.'));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(loginPage(escapeHtml(redirectUri), ''));
}