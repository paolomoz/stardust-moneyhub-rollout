import pw from '/private/tmp/claude-502/-Users-paolo-stardust-rollout-stardust-moneyhub-rollout/21829465-ee8e-43f4-ada1-08cdd470f8fc/scratchpad/pw/node_modules/playwright/index.js';
const { chromium } = pw;
const file = 'file://' + process.argv[2];
const out = process.argv[3];
const w = +(process.argv[4] || 1440);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
const resp = await p.goto(file, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => ({ err: e.message }));
await p.waitForTimeout(1200);
// overflow check
const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
// broken images
const broken = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
await p.screenshot({ path: out, fullPage: true });
console.log(`shot ${out} @${w}  overflow=${overflow}  brokenImgs=${broken.length}  consoleErrs=${errs.length}`);
if (broken.length) console.log('  BROKEN:', broken.slice(0, 8).join('\n  '));
if (errs.length) console.log('  ERRS:', errs.slice(0, 5).join(' | '));
await b.close();
