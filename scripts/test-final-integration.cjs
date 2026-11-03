const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const app=read('src/App.tsx');
const store=read('src/store.ts');
const firebase=read('src/firebase.ts');
const rules=read('firestore.rules');
const phoneTs=read('src/phone.tsx');
const phoneJs=ts.transpileModule(phoneTs,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const exportsPhone={};
new Function('require','exports','module',phoneJs)(name=>name==='react-i18next'?{useTranslation:()=>({t:x=>x})}:name==='react/jsx-runtime'?{}:require(name),exportsPhone,{exports:exportsPhone});
const {validatePhone,composePhone}=exportsPhone;
test('country-specific phone lengths and fabricated repeating digits rejected',()=>{
 assert.equal(validatePhone('KG','555 123 456'),true);
 assert.equal(composePhone('KG','0555 123 456'),'+996555123456');
 assert.equal(validatePhone('KG','123'),false);
 assert.equal(validatePhone('KG','111111111'),false);
 assert.equal(validatePhone('US','555 123 4567'),true);
 assert.equal(validatePhone('US','555 123 456'),false);
 assert.equal(validatePhone('UZ','901234567'),true);
});
test('customer registration remains on customer auth, admin session isolated',()=>{
 assert.match(app,/createUserWithEmailAndPassword\(auth,authEmail\.trim\(\),authPass\)/);
 assert.match(app,/saveClientPhone\(internationalPhone\)/);
 assert.match(app,/signInWithEmailAndPassword\(ownerFirebaseAuth,ownerEmail,adminPass\)/);
 assert.match(firebase,/initializeApp\(config,'elbem-admin'\)/);
 assert.match(store,/adminDb/);
 assert.match(store,/token\.claims\.admin===true/);
});
test('sign out and booking success visible to clients',()=>{
 assert.match(app,/className="header-logout"/);
 assert.match(app,/Ваша заявка отправлена/);
 assert.match(app,/await createBooking\(b\)/);
 assert.match(app,/setSubmitted\(b\)/);
 for(const lang of ['ru','ky','en'])assert.ok(JSON.parse(read(`src/i18n/${lang}.json`))['Ваша заявка отправлена']);
});
test('music volume follows live site settings',()=>{
 assert.match(app,/subscribePublicContent\(/);
 assert.match(store,/onSnapshot\(doc\(requireDb\(\),'siteContent','main'\)/);
 assert.match(app,/audio\.current\.volume=musicVolume\/100/);
});
test('210-minute threshold enforced in both client and rules',()=>{
 assert.match(app,/MAX_ONLINE_BOOKING_MINUTES=210/);
 assert.match(store,/MAX_LOCKS=7/);
 assert.match(rules,/b\.duration <= 210/);
 assert.match(rules,/b\.lockKeys\.size\(\) <= 7/);
});
test('visual polish honours user preference',()=>{
 assert.match(read('src/premium-theme.css'),/prefers-reduced-motion:reduce/);
 assert.match(app,/quick-ambient/);
});
