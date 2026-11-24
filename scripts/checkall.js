const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = process.argv[2];
const files = []; (function walk(d){ for (const f of fs.readdirSync(d)) { const p = path.join(d,f); if (fs.statSync(p).isDirectory()) { if (!/assets|media/.test(f)) walk(p); } else if (f.endsWith('.html') && !/manifest/.test(f)) files.push('/' + path.relative(root, p)); } })(root);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const issues = {};
  const queue = files.slice(); let done = 0;
  async function worker() {
    const pg = await ctx.newPage();
    pg.on('response', r => { const u = r.url(); if (r.status() >= 400 && u.startsWith('http://localhost')) (issues[pg.__p] ||= new Set()).add(r.status() + ' ' + u.slice(21, 160)); });
    pg.on('request', r => { const u = r.url(); if (/hapi\.mmcreation|hapidam\.com|insaho\.fr\//.test(u)) (issues[pg.__p] ||= new Set()).add('REMOTE ' + u.slice(0, 140)); });
    pg.on('pageerror', e => (issues[pg.__p] ||= new Set()).add('JSERR ' + String(e).slice(0, 150)));
    while (queue.length) { const p = queue.shift(); pg.__p = p; await pg.goto('http://localhost:8080' + p, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => (issues[p] ||= new Set()).add('GOTO ' + e.message.slice(0,80))); await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { try{window.scrollTo(0, y)}catch(e){}; await new Promise(r => setTimeout(r, 60)); } }).catch(()=>{}); await pg.waitForTimeout(800); done++; }
  }
  await Promise.all([1,2,3,4,5,6].map(worker));
  console.log('checked', done);
  const agg = {}; for (const [p, s] of Object.entries(issues)) for (const i of s) (agg[i] ||= []).push(p);
  for (const [i, ps] of Object.entries(agg).sort((a,b)=>b[1].length-a[1].length)) console.log(ps.length, i, ps.length < 10 ? ps.join(' ') : '');
  await b.close();
})();
