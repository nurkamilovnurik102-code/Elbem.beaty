/**
 * Run ONLY from the developer's trusted computer with Firebase Admin SDK access.
 * Creates a separate admin account using their own Gmail as the username and a
 * unique password. Password never appears in command arguments, logs or source.
 * Does not change bookings, store data, Firestore rules or customer sessions.
 *
 * Example:
 * GOOGLE_CLOUD_PROJECT=el-bem-beauty \
 * GOOGLE_APPLICATION_CREDENTIALS=/secure/firebase-service-account.json \
 * node scripts/create-owner.cjs new.owner@gmail.com
 */
'use strict';
const admin=require('firebase-admin');

const projectId=process.env.GOOGLE_CLOUD_PROJECT;
const email=String(process.argv[2]||'').trim().toLowerCase();
if (!projectId||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: GOOGLE_CLOUD_PROJECT=el-bem-beauty GOOGLE_APPLICATION_CREDENTIALS=/secure/file.json node scripts/create-owner.cjs new.owner@gmail.com');
  process.exitCode=1;
} else if (!process.stdin.isTTY) {
  console.error('Run in an interactive terminal. Password input from files or command-line parameters is disabled.');
  process.exitCode=1;
} else {
  admin.initializeApp({credential:admin.credential.applicationDefault(),projectId});
  (async()=>{
    // Don't promote an already registered client by accident.
    try {
      await admin.auth().getUserByEmail(email);
      throw Error('Этот Gmail уже зарегистрирован. Новый пароль и права автоматически не выдаются. Подтвердите владельца и используйте отдельную проверенную процедуру назначения роли.');
    } catch(e) {
      if(e?.code!=='auth/user-not-found')throw e;
    }
    const password=await readSecret('Придумайте отдельный пароль администратора (минимум 12 символов): ');
    if (password.length<12 || password.length>128) throw Error('Пароль должен содержать от 12 до 128 символов.');
    const repeat=await readSecret('Повторите пароль: ');
    if(password!==repeat)throw Error('Пароли не совпадают. Никакие данные не изменены.');
    const user=await admin.auth().createUser({email,password,emailVerified:false,disabled:false});
    try {
      await admin.auth().setCustomUserClaims(user.uid,{...(user.customClaims||{}),admin:true});
    } catch(error) {
      // Fail closed: an account without admin privileges is not a successful transfer.
      console.error('Не удалось назначить роль; созданный аккаунт удаляется.');
      try{await admin.auth().deleteUser(user.uid)}catch(cleanup){console.error('Удалите созданную учётную запись вручную:',cleanup.message)}
      throw error;
    }
    console.log(`Новый администратор создан: ${email}. Можно войти на /admin с этим email и назначенным паролем.`);
    console.log('Это НЕ пароль Gmail. Передавайте пароль владельцу только по защищённому каналу.');
    console.log('Старый администратор остаётся активным, пока его роль не отозвана отдельно.');
  })().catch(error=>{console.error('Не удалось создать владельца:',error.message);process.exitCode=1;});
}

function readSecret(prompt) {
  return new Promise((resolve,reject)=>{
    process.stdout.write(prompt);
    const input=process.stdin;
    const wasRaw=input.isRaw;
    let secret='';
    const cleanup=()=>{
      input.off('data',onData);
      input.setRawMode(Boolean(wasRaw));
      input.pause();
    };
    const onData=(buf)=>{
      const value=buf.toString('utf8');
      for(const key of value){
        if(key==='\r'||key==='\n'){cleanup();process.stdout.write('\n');return resolve(secret);}
        if(key==='\u0003'){cleanup();process.stdout.write('\n');return reject(Error('Отменено пользователем.'));}
        if(key==='\u007f'||key==='\b'){secret=secret.slice(0,-1);continue;}
        if(key>=' ' && key!=='\u007f')secret+=key;
      }
    };
    input.setRawMode(true);
    input.resume();
    input.on('data',onData);
  });
}
