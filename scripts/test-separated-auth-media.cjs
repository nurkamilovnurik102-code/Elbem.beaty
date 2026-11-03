const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=f=>fs.readFileSync(new URL('../'+f,'file://'+__filename).pathname,'utf8');
const app=read('src/App.tsx'),store=read('src/store.ts'),rules=read('firestore.rules');
test('client and admin have independent Firebase Auth sessions',()=>{
 assert.match(app,/await signInWithEmailAndPassword\(auth,ownerClientEmail\.trim\(\),ownerClientPass\)/);
 assert.match(app,/await signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.match(read('src/firebase.ts'),/initializeApp\(config,'elbem-admin'\)/);
 assert.match(app,/admin\?\(adminAuth&&authUser\?Admin\(\):AdminGate\(\)\)/);
});
test('each client sees their own bookings and orders, admin write protected by claims',()=>{
 assert.match(store,/where\('userId','==',user\.uid\)/);
 assert.match(rules,/request\.auth\.token\.admin == true/);
 assert.match(rules,/resource\.data\.userId == request\.auth\.uid/);
});
test('responsive phone layout is one full-width column',()=>{
 const css=read('src/premium-theme.css');
 assert.match(css,/\.phone-control\.elbem-phone-control\s*\{[\s\S]*?grid-template-columns:minmax\(0,1fr\)!important/);
 assert.match(css,/\.elbem-phone-number\s*\{width:100%!important/);
});
test('local photo selectable on Firebase mode but cannot persist device-specific path',()=>{
 const upload=read('src/components/AdminImageUpload.tsx');
 assert.match(upload,/type="file"/);
 assert.doesNotMatch(upload,/!configured\s*\?/);
 assert.match(store,/elbem-local-image:/);
 assert.match(app,/await saveLocalImage\(file\)/);
 assert.match(read('src/lib/cloudinaryUpload.ts'),/api\.cloudinary\.com/);
});
test('no secret service account embedded in public frontend',()=>{
 assert.doesNotMatch(app,/VITE_ADMIN_PASSWORD|VITE_FIREBASE_PRIVATE_KEY/);
});
