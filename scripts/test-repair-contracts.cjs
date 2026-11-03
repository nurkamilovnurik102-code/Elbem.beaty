const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=file=>fs.readFileSync(path.join(root,file),'utf8');
const app=load('src/App.tsx');
const firebase=load('src/firebase.ts');
const css=load('src/premium-theme.css');
const content=load('src/data.ts');
const store=load('src/store.ts');
test('admin password is checked with the entered owner email and explicit custom claim',()=>{
 assert.match(app,/signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.ok(!app.includes('signInWithEmailAndPassword(ownerFirebaseAuth,sharedAdminEmail,adminPass)'));
 assert.match(store,/token\.claims\.admin===true/);
});
test('Spark client only needs actual used Firebase properties, not Storage bucket',()=>{
 assert.match(firebase,/config\.apiKey && config\.authDomain && config\.projectId && config\.appId/);
 assert.ok(!firebase.includes('Object.values(config).every(Boolean)'));
});
test('public offer and floating card follow the same content list with backwards-compatible fallback',()=>{
 assert.match(content,/promotions\?:Promotion\[\]/);
 assert.match(app,/content\.promotions\?\?defaultOffers/);
 assert.match(app,/firstOffer&&<section className="offer"/);
 assert.match(app,/firstOffer&&dismissedPromotion!==firstOffer\.id&&<PromotionFloat/);
 assert.match(app,/adminPage==='Акции'/);
 assert.match(app,/persistPromotions=async\(updated:Promotion\[\]\)/);
 assert.match(app,/await saveEntity\('site_content',\{id:'main',data:\{promotions:updated\}\}\)/);
 assert.match(app,/if\(await persistPromotions\(/);
});
test('auth dialog is portaled, accessible, keyboard-operable and scroll locked',()=>{
 assert.match(app,/authOpen&&createPortal\(/);
 assert.match(app,/role="dialog" aria-modal="true"/);
 assert.match(app,/document\.body\.style\.overflow='hidden'/);
 assert.match(app,/event\.key==='Escape'/);
 assert.match(app,/event\.key!=='Tab'/);
 assert.match(css,/\.modal-backdrop\{position:fixed!important/);
});
test('mobile nav is truly sticky and styles honor reduced motion',()=>{
 assert.match(css,/\.header\{position:sticky!important/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.promotion-float/);
});
