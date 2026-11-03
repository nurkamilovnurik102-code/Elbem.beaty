/** Sanitization, international phone parsing and readable auth errors. */
import {PHONE_COUNTRIES} from '../phone';
export const safeText=(s:string)=>s.replace(/[<>]/g,'').slice(0,1200);
export const PHONE_COUNTRIES_MATCH=(value:string)=>{const info=[...PHONE_COUNTRIES].sort((a,b)=>b.dial.length-a.dial.length).find(c=>value.startsWith('+'+c.dial));return info?{country:info.iso,local:value.slice(info.dial.length+1)}:null};
export const formatAuthError=(e:unknown,t:(key:string)=>string)=>{
 const code=typeof e==='object'&&e!==null&&'code' in e?String((e as {code:unknown}).code):'';
 if(code==='auth/invalid-credential'||code==='auth/wrong-password'||code==='auth/user-not-found')return t('Неверный email или пароль.');
 if(code==='auth/email-already-in-use')return t('Этот email уже зарегистрирован.');
 if(code==='auth/weak-password')return t('Выберите более надёжный пароль.');
 if(code==='auth/too-many-requests')return t('Слишком много попыток. Попробуйте позже.');
 if(code==='auth/invalid-email')return t('Введите корректный email.');
 if(code==='auth/requires-recent-login')return t('Сеанс устарел. Повторно войдите в админку и попробуйте ещё раз.');
 if(code==='auth/operation-not-allowed')return t('Действие не разрешено настройками Firebase Authentication. Проверьте способ входа Email/Password.');
 if(code==='auth/network-request-failed')return t('Нет связи с сервером авторизации. Проверьте интернет.');
 if(code==='auth/invalid-continue-uri'||code==='auth/unauthorized-continue-uri')return t('Домен сайта не разрешён в Firebase Authentication. Добавьте домен в Authorized domains.');
 if(code==='auth/email-change-needs-verification')return t('Подтвердите новый email по ссылке из письма.');
 if(code==='auth/user-disabled')return t('Учётная запись отключена в Firebase.');
 if(e instanceof Error&&e.message.includes('роль администратора'))return t('У аккаунта нет прав администратора.');
 console.error('Sign-in error',e);
 return t('Не удалось выполнить вход. Попробуйте ещё раз.');
};
