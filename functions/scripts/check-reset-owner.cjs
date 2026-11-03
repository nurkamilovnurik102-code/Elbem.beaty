'use strict';
/**
 * One-time owner credential diagnosis / reset. Developer workstation only.
 * Uses Firebase Admin SDK and an existing service-account credential.
 * Never creates users, assigns admin claims, or modifies Firestore.
 */
const admin = require('firebase-admin');
const [action, rawEmail] = process.argv.slice(2);
const email = String(rawEmail || '').trim().toLowerCase();
const projectId = process.env.GOOGLE_CLOUD_PROJECT;

function fail(msg) { console.error('Ошибка:', msg); process.exitCode = 1; }
function readSecret(label) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    if (!input.isTTY || !input.setRawMode) return reject(new Error('Нужен обычный интерактивный терминал VS Code.'));
    let password = '';
    const wasRaw = input.isRaw;
    process.stdout.write(label);
    function cleanup() { input.removeListener('data', onData); input.setRawMode(Boolean(wasRaw)); input.pause(); }
    function onData(chunk) {
      for (const char of chunk.toString('utf8')) {
        if (char === '\n' || char === '\r') { cleanup(); process.stdout.write('\n'); return resolve(password); }
        if (char === '\x03') { cleanup(); process.stdout.write('\n'); return reject(new Error('Ввод отменён.')); }
        if (char === '\x7f' || char === '\b') { password = password.slice(0, -1); continue; }
        if (char >= ' ') password += char;
      }
    }
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

(async () => {
  if (!['--check', '--reset'].includes(action) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail('Пример: node scripts/check-reset-owner.cjs --check owner@example.com');
  }
  if (projectId !== 'el-bem-beauty') return fail('Проверьте GOOGLE_CLOUD_PROJECT: нужен el-bem-beauty.');
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) return fail('Не указан GOOGLE_APPLICATION_CREDENTIALS.');
  admin.initializeApp({credential: admin.credential.applicationDefault(), projectId});
  let user;
  try { user = await admin.auth().getUserByEmail(email); }
  catch (e) { return fail(`Не удалось найти аккаунт в ${projectId}: ${e.code || e.message}`); }
  const role = user.customClaims && user.customClaims.admin === true;
  console.log('Аккаунт существует в проекте:', projectId);
  console.log('Email:', user.email);
  console.log('Административная роль admin:true:', role ? 'есть' : 'НЕТ');
  console.log('Провайдеры:', user.providerData.map(p => p.providerId).join(', ') || 'email/password или другой способ');
  if (!role) return fail('Роль администратора отсутствует. Пароль не менялся; сначала проверьте права.');
  if (action === '--check') return console.log('Проверка завершена; данные не изменены.');
  if (!process.stdin.isTTY) return fail('Для сброса нужен интерактивный терминал.');
  const password = await readSecret('НОВЫЙ пароль администратора (12–128 символов, ввод скрыт): ');
  if (password.length < 12 || password.length > 128) return fail('Пароль должен содержать от 12 до 128 символов. Данные не изменены.');
  const repeat = await readSecret('Повторите НОВЫЙ пароль (ввод скрыт): ');
  if (password !== repeat) return fail('Пароли не совпали. Данные не изменены.');
  await admin.auth().updateUser(user.uid, {password});
  console.log('УСПЕХ: пароль существующего администратора изменён.');
  console.log('Данные Firestore, клиенты, заказы и роли не изменялись.');
})().catch(e => fail(e.code || e.message));
