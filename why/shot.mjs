import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ channel: "chrome", args:["--use-gl=angle","--enable-webgl","--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
await p.goto("http://127.0.0.1:4600/");
await p.waitForTimeout(1500);
await p.screenshot({ path: out + "-0.png" });
const pw = await p.$('input[type=password]');
if (pw) { await pw.fill(process.env.P); await p.keyboard.press("Enter"); }
await p.waitForTimeout(8000);
await p.screenshot({ path: out + "-1.png" });
const enter = p.getByText(/Enter the office/);
if (await enter.count()) { await enter.first().click(); await p.waitForTimeout(5000); }
await p.keyboard.press("Escape"); await p.waitForTimeout(800);
await p.screenshot({ path: out + "-2.png" });
await p.keyboard.down("w"); await p.waitForTimeout(2200); await p.keyboard.up("w"); await p.waitForTimeout(600);
await p.screenshot({ path: out + "-3.png" });
await b.close();
