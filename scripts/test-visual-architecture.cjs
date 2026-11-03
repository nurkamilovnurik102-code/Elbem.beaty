/** Static architecture/accessibility checks, not a substitute for device testing. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dir=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(dir,p),'utf8');

test('navigation and salon calendar helpers are independent of UI state',()=>{
  const app=read('src/App.tsx');
  assert.match(app,/from '\.\/config\/navigation'/);
  assert.match(app,/from '\.\/lib\/bookingDates'/);
  assert.ok(!app.includes('const routes='));
  assert.match(read('src/config/navigation.ts'),/export const pagePaths/);
  assert.match(read('src/lib/bookingDates.ts'),/Asia\/Bishkek/);
});

test('reusable UI and media selector are separate modules',()=>{
  assert.match(read('src/components/PageUI.tsx'),/export function BackgroundDecor/);
  assert.match(read('src/components/PageUI.tsx'),/aria-hidden="true"/);
  assert.match(read('src/components/AdminImageUpload.tsx'),/export function ImageUpload/);
  assert.match(read('src/App.tsx'),/from '\.\/components\/AdminImageUpload'/);
});

test('reveal motion observes just once and disconnects cleanly',()=>{
  const hook=read('src/hooks/useScrollReveal.ts');
  assert.match(hook,/IntersectionObserver/);
  assert.match(hook,/observer\.unobserve/);
  assert.match(hook,/observer\.disconnect\(\)/);
  assert.match(hook,/prefers-reduced-motion: reduce/);
});

test('mobile and touch modes have gentler visuals with reduced motion fallback',()=>{
  const css=read('src/premium-theme.css');
  assert.match(css,/@media \(max-width: 670px\)/);
  assert.match(css,/@media \(max-width: 430px\)/);
  assert.match(css,/@media \(hover: none\)/);
  assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css,/\.bg-petals \.ambient-glow/);
  assert.match(css,/\.quick::before/);
  const base=read('src/styles.css');
  assert.match(base,/\.mobile-menu-trigger\{display:none\}/);
  assert.match(base,/@media\(min-width:981px\).*?\.menu-overlay\{display:none!important/);
});

test('Firebase configuration, auth and business data are separate from decorative code',()=>{
  const ui=read('src/components/PageUI.tsx');
  const reveal=read('src/hooks/useScrollReveal.ts');
  assert.ok(!ui.includes('firebase'));
  assert.ok(!reveal.includes('firebase'));
  assert.match(read('src/App.tsx'),/await createBooking\(b\)/);
  assert.match(read('src/App.tsx'),/await checkAdmin\(\)/);
  assert.match(read('firestore.rules'),/b\.duration <= 210/);
});
