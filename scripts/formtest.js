const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  const posts = [];
  await pg.route('http://localhost:8080/', (route, req) => { if (req.method() === 'POST') { posts.push(req.postData()); return route.fulfill({ status: 200, body: 'ok' }); } return route.continue(); });
  pg.on('request', r => { if (r.method() === 'POST' && !r.url().endsWith(':8080/')) console.log('OTHER POST', r.url()); });
  await pg.goto('http://localhost:8080/fr/page/nous-contacter.19479.html', { waitUntil: 'networkidle' });
  await pg.addStyleTag({ content: '.klaro{display:none!important}' });
  const f = pg.locator('#form_Form_1523_19999_1');
  await f.locator('button[type=submit]').click(); await pg.waitForTimeout(500);
  console.log('empty submit msg:', await f.locator('.insaho-form-message').textContent(), 'posts', posts.length);
  const vals = { lastname: 'Test', firstname: 'Essai', company: 'Soc', city: 'Tours', email: 'test@example.com', mobile: '0600000000' };
  for (const [k, v] of Object.entries(vals)) await f.locator(`.form_type-${k} input:not([type=hidden])`).fill(v);
  await f.locator('textarea').fill('Bonjour, ceci est un test.');
  await f.locator('button[type=submit]').click(); await pg.waitForTimeout(1000);
  console.log('ok msg:', await f.locator('.insaho-form-message').textContent());
  console.log('payload:', decodeURIComponent(posts[0] || '').replace(/\+/g, ' '));
  await f.screenshot({ path: 'shots2/form_contact.png' });
  // footer newsletter
  const n = pg.locator('#form_Form_1576_20839_1');
  await n.locator('[name$="[email]"]').fill('news@example.com'); await n.locator('[name$="[function]"]').fill('Directeur');
  await n.locator('button[type=submit]').click(); await pg.waitForTimeout(1000);
  console.log('newsletter payload:', decodeURIComponent(posts[1] || '').replace(/\+/g, ' '));
  await b.close();
})();
