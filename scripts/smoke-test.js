#!/usr/bin/env node
/**
 * MailX API smoke test — run with server on PORT (default 5000).
 */
const port = process.env.PORT || 5000;
const base = `http://localhost:${port}`;

async function run() {
  const checks = [];

  try {
    const res = await fetch(`${base}/`);
    const body = await res.json();
    const ok = res.ok && body.message && body.database === 'supabase';
    checks.push({ name: 'GET / health', ok, detail: JSON.stringify(body) });
  } catch (err) {
    checks.push({ name: 'GET / health', ok: false, detail: err.message });
  }

  try {
    const res = await fetch(`${base}/get-emails`, {
      headers: { Authorization: 'Bearer invalid' },
    });
    checks.push({
      name: 'GET /get-emails rejects bad token',
      ok: res.status === 401,
      detail: `status ${res.status}`,
    });
  } catch (err) {
    checks.push({ name: 'GET /get-emails rejects bad token', ok: false, detail: err.message });
  }

  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) {
    console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
  console.log(`\nAll ${checks.length} smoke checks passed.`);
}

run();
