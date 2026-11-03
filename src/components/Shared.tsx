/** Real reusable interface components extracted without changing the approved layout. */
import {Search, X} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import type {ReactNode} from 'react';
import {MediaImage} from '../media';
import {money} from '../data';

export function LanguageSelector({active,onSelect}:{active:string;onSelect:(language:'ky'|'ru'|'en')=>void}){
  return <div className="language-choice" aria-label="Язык интерфейса">{(['ky','ru','en'] as const).map(code=><button type="button" key={code} className={active===code?'selected':''} aria-pressed={active===code} onClick={()=>onSelect(code)}>{code==='ky'?'KG':code.toUpperCase()}</button>)}</div>
}
export function RatingStars({rating}:{rating?:number}){
  const score=Math.max(1,Math.min(5,Math.round(Number(rating)||5)));
  return <div className="stars" role="img" aria-label={`${score} из 5`}>{'★'.repeat(score)}{'☆'.repeat(5-score)}</div>
}
export function SearchField({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder:string}){
  return <label className="search"><Search size={16}/><input type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>
}
export function AdminMetric({name,value}:{name:string;value:number}){
  return <div className="stat"><span>{name}</span><strong>{value}</strong></div>
}
export function MoneyAmount({amount,from=false}:{amount:number;from?:boolean}){
  const {t}=useTranslation();
  return <>{from?t('от')+' ':''}{money(amount)}</>
}
export function EmptyMessage({children}:{children:ReactNode}){
  return <p className="hint" role="status">{children}</p>
}
export function StatusPill({status}:{status:string}){
  const {t}=useTranslation();
  return <span className="status-pill">{t(status)}</span>
}
export function GalleryAdminItem({photo,index,onRemove}:{photo:string;index:number;onRemove:()=>void}){
  const {t}=useTranslation();
  return <div className="gallery-admin-item"><MediaImage src={photo} alt={`Фото галереи ${index+1}`}/><button className="mini-btn" type="button" onClick={onRemove}>{t('Удалить')} <X size={13}/></button></div>
}
export function BookingActions({onConfirm,onCancel}:{onConfirm:()=>void;onCancel:()=>void}){
  const {t}=useTranslation();
  return <><button type="button" className="mini-btn" onClick={onConfirm}>{t('Подтвердить')}</button> <button type="button" className="mini-btn" onClick={onCancel}>{t('Отменить')}</button></>
}
export function OrderStatusSelect({value,onChange}:{value:string;onChange:(status:string)=>void}){
  const {t}=useTranslation();
  return <select aria-label="Статус заказа" value={value} onChange={e=>onChange(e.target.value)}>{['pending','processing','completed','cancelled'].map(status=><option key={status} value={status}>{t(status)}</option>)}</select>
}
