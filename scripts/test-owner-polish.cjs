const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),store=read('src/store.ts'),css=read('src/premium-theme.css'),shared=read('src/components/Shared.tsx');
test('owner gate is a single authorized Firebase account independent of customer login',()=>{
 assert.doesNotMatch(app,/adminClientLogin/);
 assert.doesNotMatch(app,/ownerClientPass/);
 assert.match(app,/await signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.match(app,/admin\?\(adminAuth\?Admin\(\):AdminGate\(\)\)/);
 assert.match(store,/token\.claims\.admin\s*===\s*true/);
 assert.doesNotMatch(app,/setCustomUserClaims|adminPass\s*===\s*['"`]/);
});
test('volume slider queues automatic Firestore updates to siteContent without altering another media setting',()=>{
 assert.match(app,/musicVolume:Number\(e\.target\.value\)/);
 assert.match(app,/setVolumeDirty\(true\)/);
 assert.match(app,/saveEntity\('site_content',\{id:'main',data:\{musicVolume:volume\}\}\)/);
 assert.match(store,/subscribePublicContent\(/);
 assert.match(app,/audio\.current\.volume=musicVolume\/100/);
});
test('public booking requires an explicitly selected server time and stale slots are cleared',()=>{
 assert.match(app,/slotsFor!==requestedSlotsKey/);
 assert.match(app,/!bookingTime\|\|!displayedTimes\.includes\(bookingTime\)/);
 assert.match(app,/setBookingTime\(old=>slots\.includes\(old\)\?old:''\)/);
 assert.match(store,/createBooking\(input:Booking\)/);
 assert.match(store,/runTransaction\(requireDb\(\),async tx=>/);
});
test('booking success navigates to account while shop checkout uses WhatsApp only',()=>{
 assert.match(app,/t\('Перейти в мои записи'\)/);
 assert.match(app,/setSubmitted\(b\)/);
 assert.match(app,/onClick=\{\(\)=>go\('Кабинет'\)\}/);
 assert.match(app,/t\('Заказать через WhatsApp'\)/);
 assert.doesNotMatch(app,/setOrderSuccess\(saved\)/);
});
test('admin uses the single locale chosen on the public website without its own language toggle',()=>{
 assert.match(app,/const editLocale=locale;/);
 assert.doesNotMatch(app,/setEditLocale\(/);
 assert.doesNotMatch(app,/className="admin-locale-picker"/);
 assert.match(app,/\{t\(p\)\}<\/span><\/button>/);
 assert.match(shared,/\{t\(status\)\}/);
});
test('promotion animation is accessible and reduced-motion safe',()=>{
 assert.match(css,/promotionBreath/);
 assert.match(css,/promotionGift/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(app,/await saveEntity\('site_content',\{id:'main',data:\{promotions:updated\}\}\)/);
});
