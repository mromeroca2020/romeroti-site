// netlify/functions/run-tool.js
// Node 18+ (Netlify) — fetch nativo.

const API_BASE = process.env.API_BASE || 'https://romanoti-tools-api.onrender.com';
const USER = process.env.RTOOLS_USER || '';
const PASS = process.env.RTOOLS_PASS || '';

async function login() {
  if (!USER || !PASS) {
    throw new Error('Faltan variables RTOOLS_USER/RTOOLS_PASS en Netlify.');
  }
  const body = new URLSearchParams();
  body.append('username', USER);
  body.append('password', PASS);

  const res = await fetch(`${API_BASE}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Login failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error('Login OK pero sin access_token');
  return data.access_token;
}

async function call(path, token=null) {
  const url = `${API_BASE}${path}`;
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

exports.handler = async () => {
  try {
    // 1) Salud API (sin token)
    const health = await call('/health');

    // 2) Login y token
    const token = await login();

    // 3) Consultas en paralelo
    const [me, systemInfo, networkInfo] = await Promise.all([
      call('/auth/me', token),
      call('/system/info', token),
      call('/network/info', token),
    ]);

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        api: API_BASE,
        health,
        me,
        systemInfo,
        networkInfo
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ok: false, error: String(err) })
    };
  }
};
