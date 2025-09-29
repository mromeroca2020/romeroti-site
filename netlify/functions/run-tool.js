// netlify/functions/run-tool.js

const API_BASE = process.env.API_BASE || 'https://romanoti-tools-api.onrender.com';
const USER = process.env.RTOOLS_USER || '';
const PASS = process.env.RTOOLS_PASS || '';

async function login() {
  if (!USER || !PASS) throw new Error('Faltan RTOOLS_USER/RTOOLS_PASS en Netlify');
  const body = new URLSearchParams();
  body.append('username', USER);
  body.append('password', PASS);

  const res = await fetch(`${API_BASE}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!data.access_token) throw new Error('Login OK pero sin access_token');
  return data.access_token;
}

async function call(path, token=null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

exports.handler = async () => {
  try {
    const health = await call('/health');
    const token  = await login();

    const [me, systemInfo, networkInfo] = await Promise.all([
      call('/auth/me', token),
      call('/system/info', token),
      call('/network/info', token),
    ]);

    // Payload completo
    const payload = { ok: true, api: API_BASE, health, me, systemInfo, networkInfo };

    // DEVOLVEMOS TAMBIÉN 'output' para que el front actual no rompa
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: '✅ Tool executed successfully!',
        output: payload,          // <--- compatibilidad con el HTML actual
        ...payload                // y además exponemos las claves por separado
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
