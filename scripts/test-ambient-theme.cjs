'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const main = read('src/main.tsx');
const aura = read('src/ambient-background.css');
const app = read('src/App.tsx');

test('three predictable stylesheet layers only', () => {
  const imports = [...main.matchAll(/import\s+['"]\.\/([^'"]+\.css)['"]/g)].map(x => x[1]);
  assert.deepEqual(imports, ['styles.css', 'premium-theme.css', 'ambient-background.css']);
});
test('public aura does not cover user controls or affect admin layout', () => {
  assert.match(aura, /\.premium-public::before/);
  assert.match(aura, /\.premium-public::after/);
  assert.match(aura, /pointer-events:\s*none/);
  assert.match(aura, /z-index:\s*-1/);
  assert.doesNotMatch(aura, /\.admin-shell\s*\{/);
  assert.match(app, /className="premium-public"/);
});
test('aura uses compositor animations and reduced-motion fallback', () => {
  assert.match(aura, /@keyframes elbem-aura-rose/);
  assert.match(aura, /@keyframes elbem-aura-champagne/);
  assert.match(aura, /transform:\s*translate3d/);
  assert.match(aura, /prefers-reduced-motion:\s*reduce/);
  assert.match(aura, /animation:\s*none/);
});
test('light and dark modes have their own palette', () => {
  assert.match(aura, /--elbem-page-base:\s*#fdfbf7/);
  assert.match(aura, /:root\[data-theme="dark"\]/);
  assert.match(aura, /--elbem-page-base:\s*#251e27/);
});
test('core Firebase, booking, admin and Google entry points remain intact', () => {
  for (const text of ['await createBooking(b)', 'await checkAdmin()', 'signInWithPopup(auth,provider)', "className=\"admin-shell\"", 'subscribePublicContent']) {
    assert.ok(app.includes(text), `Missing: ${text}`);
  }
});
