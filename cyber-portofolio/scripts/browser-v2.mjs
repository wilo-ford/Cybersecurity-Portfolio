import assert from 'node:assert/strict';
import { chromium } from '/tmp/v2-playwright/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1, 'Single hero heading');
    assert.match(await page.locator('h1').innerText(), /ABOGOURIN/);
    const trigger = page.getByRole('button', { name: /ouvrir le cristal/i });
    await trigger.click();
    assert.equal(await page.locator('.v2-crystal-button').getAttribute('aria-expanded'), 'true', 'Crystal opens');
    await page.getByRole('button', { name: /refermer le cristal/i }).click();
    assert.equal(await page.locator('.v2-crystal-button').getAttribute('aria-expanded'), 'false', 'Crystal closes');
    const sections = ['accueil', 'a-propos', 'competences', 'projets', 'parcours', 'blog', 'contact'];
    for (const id of sections) assert.equal(await page.locator('#' + id).count(), 1, 'Section ' + id);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 2, 'Horizontal overflow ' + overflow + 'px at ' + viewport.width);
    assert.deepEqual(errors, [], 'No page errors: ' + errors.join(', '));
    await page.screenshot({ path: 'screenshots/' + (viewport.width === 390 ? 'mobile-interactive.png' : 'desktop-interactive.png'), fullPage: true });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Mode détaillé' }).click();
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('.v2-webgl canvas').count(), 1, 'WebGL canvas renders in detailed mode');
  await page.getByRole('button', { name: /ouvrir le cristal/i }).click();
  assert.equal(await page.locator('.v2-webgl').getAttribute('data-open'), 'true');
  await page.close();
  console.log('Browser interactions, navigation, responsive layout and WebGL: PASS');
} finally {
  await browser.close();
}
