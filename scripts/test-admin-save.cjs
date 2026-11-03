const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname,'../src/App.tsx'),'utf8');
const store = fs.readFileSync(path.join(__dirname,'../src/store.ts'),'utf8');

test('settings save does not report success without Firebase', () => {
  const handler = app.slice(app.indexOf(' const saveContent=async()=>'),app.indexOf(' const addBlock=async()=>'));
  assert.match(handler,/if\(!configured\)throw Error/);
  assert.match(handler,/if\(!await checkAdmin\(\)\)throw Error/);
  assert.match(handler,/await saveEntity\('site_content',\{id:'main',data:content\}\)/);
  assert.ok(handler.indexOf("await saveEntity('site_content'") < handler.indexOf('setContentSaveFeedback({error:false,message})'));
});

test('public content subscription cannot erase unsaved admin edits', () => {
  assert.match(app,/subscribePublicContent\(incoming=>setState\(old=>\(\{/);
  assert.match(app,/contentDraftDirty\.current\?\{\.\.\.incoming,\.\.\.old\.content/);
  assert.match(app,/musicVolume:volumeEditInProgress\.current\?old\.content\.musicVolume:incoming\.musicVolume/);
  assert.match(app,/if\(key==='content'&&adminAuth\)\{contentDraftDirty\.current=true/);
  assert.match(app,/if\(contentEditVersion\.current===versionAtSave\)\{contentDraftDirty\.current=false/);
});

test('admin errors are explained and remain visible after save failure', () => {
  assert.match(app,/code==='permission-denied'/);
  assert.match(app,/role=\{contentSaveFeedback\.error\?'alert':'status'\}/);
  assert.match(app,/setContentSaveFeedback\(\{error:true,message\}\)/);
});

test('admin saving depends on backend write and service claim', () => {
  assert.match(store,/await setDoc\(doc\(requireAdminDb\(\),mapCollection\(table\),key\),data,\{merge:true\}\)/);
  const rules = fs.readFileSync(path.join(__dirname,'../firestore.rules'),'utf8');
  assert.match(rules,/request\.auth\.token\.admin == true/);
});
