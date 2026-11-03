import {ArrowUpRight,X,Gift} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import type {Promotion} from '../promotions';
import {MediaImage} from '../media';
export function PromotionFloat({offer,title,description,onClose,onContact}:{offer:Promotion;title:string;description:string;onClose:()=>void;onContact:()=>void}){
  const {t}=useTranslation();
  return <aside className="promotion-float" aria-label={t('Акция салона')}>
    <button className="promotion-dismiss" type="button" onClick={onClose} aria-label={t('Закрыть акцию')}><X size={15}/></button>
    {offer.image?<MediaImage src={offer.image} alt="" loading="lazy"/>:<Gift size={19} aria-hidden="true"/>}
    <div><small>{t('СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ')}</small><strong>{title}</strong><p>{description}</p>
      <button type="button" className="promotion-cta" onClick={onContact}>{t('Уточнить акцию')} <ArrowUpRight size={13}/></button>
    </div>
  </aside>;
}
