// Prova la stanza Vetrina: entra nell'ufficio, cammina fino alla porta ovest, guarda i video, scrive gli errori.
import { chromium } from 'playwright-core';
const out = process.argv[2] ?? 'E:/Lavori/stanze-shots/vetrina';
const b = await chromium.launch({ channel: 'chrome', args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
const errs = [];
p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(`${m.type()}: ${m.text()}`); });
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
await p.goto('http://127.0.0.1:4600/');
const pw = await p.$('input[type=password]');
if (pw) { await pw.fill(process.env.P ?? 'whystanze'); await p.keyboard.press('Enter'); }
await p.waitForTimeout(8000);
const enter = p.getByText(/Enter the office/);
if (await enter.count()) { await enter.first().click(); await p.waitForTimeout(5000); }
await p.keyboard.press('Escape'); await p.waitForTimeout(800);
// In ufficio, davanti alla porta, rivolto a ovest; poi a piedi dentro la stanza.
await p.evaluate(() => { const o = window.__office; o.player.pos.set(6, 0, -8); o.player.camYaw = 0; });
await p.waitForTimeout(1200);
await p.screenshot({ path: out + '-1-ufficio.png' });
await p.keyboard.down('w'); await p.waitForTimeout(2600); await p.keyboard.up('w'); await p.waitForTimeout(2500);
await p.screenshot({ path: out + '-2-porta.png' });
await p.keyboard.down('w'); await p.waitForTimeout(2500); await p.keyboard.up('w'); await p.waitForTimeout(2500);
await p.screenshot({ path: out + '-3-dentro.png' });
const st = await p.evaluate(() => { const o = window.__office; return { pos: o.player.pos.toArray(), video: [...document.querySelectorAll('video')].length, stanze: o.office.stanze.length }; });
console.log(JSON.stringify(st));
await p.evaluate(() => { window.__office.player.camYaw = Math.PI; });
await p.waitForTimeout(1500);
await p.screenshot({ path: out + '-4-guarda.png' });
console.log('ERRORI:', errs.length ? '\n' + errs.join('\n') : 'nessuno');
await b.close();
