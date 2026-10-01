// Prova come l'iPad e l'iPhone: da WhyOcto (rete di casa) al tasto WhyOffice, password, ufficio.
import { chromium, devices } from 'playwright-core';
import fs from 'node:fs';
const pw = fs.readFileSync('E:/Chiavi/whyoffice.txt', 'utf8').match(/^password: (\S+)/m)[1];
const octo = process.env.OCTO;
const out = process.argv[2] ?? 'E:/Lavori/stanze-shots/ipad';
const b = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
for (const [nome, dev] of [['ipad', devices['iPad Pro 11 landscape']], ['iphone', devices['iPhone 13']]]) {
  const ctx = await b.newContext({ ...dev });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', e => errori.push(e.message));
  await p.goto(octo);
  const [nuova] = await Promise.all([ctx.waitForEvent('page'), p.click('#whyofficeBtn')]);
  await nuova.waitForLoadState();
  nuova.on('pageerror', e => errori.push(e.message));
  const campo = await nuova.waitForSelector('input[type=password]', { timeout: 15000 }).catch(() => null);
  if (campo) { await campo.fill(pw); await nuova.keyboard.press('Enter'); }
  await nuova.waitForTimeout(12000);
  await nuova.screenshot({ path: `${out}-${nome}.png` });
  console.log(nome, nuova.url(), 'errori:', errori.length ? errori.slice(0, 3).join(' | ') : 'nessuno');
  await ctx.close();
}
await b.close();
