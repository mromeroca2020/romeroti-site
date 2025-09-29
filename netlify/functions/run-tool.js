/* RomanoTI — Netlify Function: run-tool
   - Llama a tu API en Render para login y datos (/health, /auth/me, /system/info, /network/info)
   - Devuelve { message, output } para que tu tools.html lo entienda
   - Soporta pretty print en la URL: ?pretty=1[&indent=4]
*/

exports.handler = async (event, context) => {
  // === Config desde variables de entorno de Netlify ===
  const API_BASE = process.env.API_BASE || 'https://romanoti-tools-api.onrender.com';
  const USER = process.env.ENGINEER_USER || 'eng1';
  const PASS = process.env.ENGINEER_PASS || 'MySecret123$'; // ajusta en Netlify (no lo dejes en código)

  // Timeout de red
  const DEFAULT_TIMEOUT = 15000;

  // Helper: fetch con timeout y parseo seguro
  const doFetch = async (url, opts = {}) => {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), opts.timeout ?? DEFAULT_TIMEOUT);
    try {
      const res = await fetch(url, { ...opts, signal: ctrl.signal });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      if (!res.ok) {
        // Propagamos texto para depuración
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }
      return data;
    } finally {
      clearTimeout(id);
    }
  };

  try {
    // 1) Login para obtener token (password grant)
    const form = new URLSearchParams();
    form.set('username', USER);
    form.set('password', PASS);

    const tokenResp = await doFetch(`${API_BASE}/auth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    const token = tokenResp && tokenResp.access_token;
    if (!token) throw new Error('No se obtuvo access_token del backend');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2) Pedimos todo en paralelo
    const [health, me, systemInfo, networkInfo] = await Promise.all([
      doFetch(`${API_BASE}/health`),
      doFetch(`${API_BASE}/auth/me`, { headers: authHeaders }),
      doFetch(`${API_BASE}/system/info`, { headers: authHeaders }),
      doFetch(`${API_BASE}/network/info`, { headers: authHeaders })
    ]);

    const output = {
      ok: true,
      api: API_BASE,
      health,
      me,
      systemInfo,
      networkInfo
    };

    const result = {
      message: 'Tool executed successfully!',
      output
    };

    // ---------- Pretty print por querystring ----------
    const qs = event.queryStringParameters || {};
    const isTruthy = v => !(v === '0' || v === 'false' || v === 'off');
    const pretty = ['pretty', 'pretty-print', 'pretty_print', 'pp']
      .some(k => k in qs && isTruthy(qs[k] ?? '1'));

    const indentParam = Number(qs.indent);
    const spaces = Number.isFinite(indentParam)
      ? Math.max(0, Math.min(indentParam, 10))
      : 2;

    const bodyStr = JSON.stringify(result, null, pretty ? spaces : 0);
    // --------------------------------------------------

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      },
      body: bodyStr
    };
  } catch (err) {
    // Error controlado (también con pretty print)
    const qs = event.queryStringParameters || {};
    const pretty = 'pretty' in qs || 'pretty-print' in qs || 'pretty_print' in qs || 'pp' in qs;

    const errorBody = {
      ok: false,
      error: String(err && err.message ? err.message : err)
    };

    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      },
      body: JSON.stringify(errorBody, null, pretty ? 2 : 0)
    };
  }
};
