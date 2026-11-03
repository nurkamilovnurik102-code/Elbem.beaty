const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'../src/App.tsx'),'utf8');
const store=fs.readFileSync(path.join(__dirname,'../src/store.ts'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../src/premium-theme.css'),'utf8');
const err=fs.readFileSync(path.join(__dirname,'../src/lib/input.ts'),'utf8');
test('booking gives immediate pending notice and success only after createBooking',()=>{
 const f=app.slice(app.indexOf('const submitBooking=async()=>'),app.indexOf('const cartTotal='));
 assert.ok(f.indexOf("notify(t('Отправляем заявку…'),'pending')")<f.indexOf('await createBooking(b)'));
 assert.ok(f.indexOf('await createBooking(b)')<f.indexOf('setSubmitted(b)'));
 assert.match(f,/setMyBookings\(old=>/);
 assert.match(f,/finally\{setBookingBusy\(false\)\}/);
});
test('order does not auto-open empty chat; confirms after Firestore write',()=>{
 const f=app.slice(app.indexOf('const submitOrder=async('),app.indexOf('const login=async()=>'));
 assert.doesNotMatch(f,/window\.open\('about:blank'/);
 assert.ok(f.indexOf('const saved=await makeOrder(order)')<f.indexOf('setOrderSuccess(saved)'));
 assert.match(f,/notify\(t\('Отправляем заказ…'\),'pending'\)/);
 assert.match(app,/Перейти в мои записи/);
});
test('content saving is atomic from the users perspective; never claims success before backend',()=>{
 const f=app.slice(app.indexOf('const saveContent=async()=>'),app.indexOf('const addBlock=async()=>'));
 assert.match(f,/await volumeWriteQueue\.current/);
 assert.ok(f.indexOf("await saveEntity('site_content'")<f.indexOf('setContentSaveFeedback({error:false,message})'));
 assert.match(f,/notify\(message,'error'\)/);
});
test('music visibility auto-saves separately and icon is removed when off',()=>{
 assert.match(app,/const togglePublicMusic=async\(enabled:boolean\)=>/);
 assert.match(app,/data:\{musicEnabled:enabled\}/);
 assert.match(app,/content\.musicEnabled&&Boolean\(content\.musicUrl\)&&<button className="music-float"/);
 assert.match(app,/onChange=\{e=>void togglePublicMusic\(e\.target\.checked\)\}/);
 assert.match(store,/onSnapshot\(doc\(requireDb\(\),'siteContent','main'\)/);
});
test('live volume updates player and auto-saves with short debounce',()=>{
 assert.match(app,/audio\.current\.volume=musicVolume\/100/);
 assert.match(app,/\},240\);return\(\)=>window\.clearTimeout\(timer\)/);
 assert.match(app,/musicVolume:volume/);
});
test('admin password uses Firebase reauthentication, customer login is separate',()=>{
 assert.match(app,/await signInWithEmailAndPassword\(auth,ownerClientEmail\.trim\(\),ownerClientPass\)/);
 assert.match(app,/await signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.match(app,/await reauthenticateWithCredential\(user,credential\)/);
 assert.match(app,/await updatePassword\(user,newAdminPassword\)/);
 assert.match(app,/disabled=\{passwordBusy\}/);
 assert.doesNotMatch(app,/verifyBeforeUpdateEmail/);
 assert.match(err,/auth\/requires-recent-login/);
});
test('progress toast is accessible, uses reduced motion, buttons show spinner',()=>{
 assert.match(app,/aria-live=\{notificationKind==='error'\?'assertive':'polite'\}/);
 assert.match(css,/\.btn-spinner/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(app,/className="btn-spinner"/);
});
