import {useTranslation} from 'react-i18next';

/** Presentation-only footer. Navigation and WhatsApp actions are delegated to App. */
export function Footer({go,wa}:{go:(page:string)=>void;wa:(message:string)=>void}) {
  const {t}=useTranslation();
  return <footer className="footer"><div className="shell footer-grid"><div><div className="footer-logo">✦ EL BEM</div><p>{t("Красота в каждой детали.")}<br/>{t("Узген, Кыргызстан.")}</p></div><div><b>{t("Исследуйте")}</b>{['Услуги','Мастера','Запись','Обучение'].map(p=><button key={p} onClick={()=>go(p)}>{t(p)}</button>)}</div><div><b>{t("Информация")}</b>{['О нас','Галерея','Контакты','Отзывы'].map(p=><button key={p} onClick={()=>go(p)}>{t(p)}</button>)}</div><div><b>{t("Связь")}</b><a href="https://www.instagram.com/ozgon.salon.el_bem/" target="_blank" rel="noreferrer">Instagram ↗</a><button onClick={()=>wa('Здравствуйте!')}>WhatsApp ↗</button></div></div><div className="shell footer-bottom"><span>{t("© EL BEM BEAUTY")}</span></div></footer>;
}
