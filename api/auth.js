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

function sendJson(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

function loginPage(provider, siteId, error) {
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
    button:disabled { opacity: 0.6; cursor: wait; }
    .error {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        color: #B91C1C;
        border-radius: 12px;
        padding: 0.7rem 0.9rem;
        font-size: 0.88rem;
        margin-bottom: 1.1rem;
    }
    .status { font-size: 0.8rem; color: #64748B; margin-top: 0.6rem; text-align: center; }
</style>
</head>
<body>
    <div class="card">
        <div class="logo">JIWAKU<span>.</span></div>
        <p class="subtitle">Masuk untuk mengelola konten.</p>
        <div id="error" class="error" style="display:none"></div>
        <form id="loginForm">
            <div class="field">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" autocomplete="username" required autofocus>
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" autocomplete="current-password" required>
            </div>
            <button type="submit" id="submitBtn">Masuk</button>
        </form>
        <p class="status" id="status">Menghubungkan ke panel admin…</p>
    </div>
<script>
(function () {
    var provider = ${JSON.stringify(provider)};
    var baseUrl = ${JSON.stringify(siteId)};
    var handshakeDone = false;
    var pendingToken = null;
    var statusEl = document.getElementById('status');
    var btn = document.getElementById('submitBtn');
    var errEl = document.getElementById('error');

    function showError(msg) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
    }

    function sendAuthorize() {
        if (!window.opener) { showError('Popup ini dibuka tanpa jendela induk. Kembali ke panel admin.'); return; }
        if (!handshakeDone) { pendingToken = pendingToken; return; }
        var payload = JSON.stringify({ token: pendingToken });
        window.opener.postMessage('authorization:' + provider + ':success:' + payload, baseUrl);
        window.close();
    }

    window.addEventListener('message', function (e) {
        if (e.origin === baseUrl && e.data === 'authorizing:' + provider) {
            handshakeDone = true;
            statusEl.textContent = 'Panel admin terhubung. Silakan masuk.';
            btn.disabled = false;
            if (pendingToken) sendAuthorize();
        }
    });

    if (window.opener) {
        window.opener.postMessage('authorizing:' + provider, baseUrl);
        setTimeout(function () {
            if (!handshakeDone) {
                statusEl.textContent = 'Tidak dapat terhubung ke panel admin. Silakan muat ulang.';
                btn.disabled = false;
            }
        }, 4000);
    }

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        errEl.style.display = 'none';
        btn.disabled = true;
        statusEl.textContent = 'Memverifikasi…';

        var body = new URLSearchParams();
        body.set('username', document.getElementById('username').value);
        body.set('password', document.getElementById('password').value);

        fetch('/api/auth', { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.token) {
                    pendingToken = data.token;
                    statusEl.textContent = 'Berhasil. Menutup jendela…';
                    sendAuthorize();
                } else {
                    statusEl.textContent = '';
                    btn.disabled = false;
                    showError(data.error || 'Username atau password salah.');
                }
            })
            .catch(function () {
                statusEl.textContent = '';
                btn.disabled = false;
                showError('Terjadi kesalahan koneksi.');
            });
    });
})();
</script>
</body>
</html>`;
}

export default async function handler(req, res) {
    const query = getQuery(req);
    const provider = query.get('provider') || 'github';
    const siteId = query.get('site_id') || '';
    const configured = (process.env.OAUTH_BASE_URL || '').replace(/\/+$/, '');
    const baseOrigin = configured || (siteId && siteId.includes('://') ? siteId.replace(/\/+$/, '') : `https://${siteId || req.headers.host}`);

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    const pat = process.env.GITHUB_PAT;

    if (req.method === 'POST') {
        const body = await readBody(req);
        const username = body.get('username');
        const password = body.get('password');

        console.error(`[oauth-auth] env_user=${expectedUser ? 'set' : 'UNSET'} env_pass=${expectedPass ? 'set' : 'UNSET'} pat=${pat ? 'set' : 'UNSET'}`);

        if (expectedUser && expectedPass && pat && safeEqual(username, expectedUser) && safeEqual(password, expectedPass)) {
            console.error(`[oauth-auth] login_success=true`);
            sendJson(res, 200, { token: pat });
            return;
        }

        console.error(`[oauth-auth] login_success=false user_match=${safeEqual(username, expectedUser)} pass_match=${safeEqual(password, expectedPass)}`);
        sendJson(res, 401, { error: 'Username atau password salah.' });
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(loginPage(provider, baseOrigin, ''));
}