const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const app=read('src/App.tsx'),store=read('src/store.ts'),css=read('src/premium-theme.css'),shared=read('src/components/Shared.tsx');
test('owner gate has distinct customer credentials and protected admin session',()=>{
 assert.match(app,/const adminClientLogin=async\(\)=>/);
 assert.match(app,/await signInWithEmailAndPassword\(auth,ownerClientEmail\.trim\(\),ownerClientPass\)/);
 assert.match(app,/await signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.match(app,/admin\?\(adminAuth&&authUser\?Admin\(\):AdminGate\(\)\)/);
 assert.match(store,/token\.claims\.admin===true/);
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
test('success screens for bookings and orders have real navigation',()=>{
 assert.match(app,/t\('Перейти в мои записи'\)/);
 assert.match(app,/setOrderSuccess\(saved\)/);
 assert.match(app,/t\('Заказ успешно отправлен'\)/);
 assert.match(app,/onClick=>go\('Кабинет'\)/.source? /onClick=\{\(\)=>go\('Кабинет'\)\}/ : /doesnotexist/);
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
