import {useTranslation} from 'react-i18next';
import {useId,type ChangeEvent} from 'react';

export const PHONE_COUNTRIES = [
  {iso:'KG',name:'Кыргызстан',dial:'996',digits:[9]},
  {iso:'KZ',name:'Казахстан',dial:'7',digits:[10]},
  {iso:'RU',name:'Россия',dial:'7',digits:[10]},
  {iso:'UZ',name:'Узбекистан',dial:'998',digits:[9]},
  {iso:'TJ',name:'Таджикистан',dial:'992',digits:[9]},
  {iso:'TR',name:'Турция',dial:'90',digits:[10]},
  {iso:'AE',name:'ОАЭ',dial:'971',digits:[9]},
  {iso:'US',name:'США',dial:'1',digits:[10]},
  {iso:'GB',name:'Великобритания',dial:'44',digits:[10]},
  {iso:'DE',name:'Германия',dial:'49',digits:[10,11]},
  {iso:'KR',name:'Южная Корея',dial:'82',digits:[9,10]},
  {iso:'CN',name:'Китай',dial:'86',digits:[11]},
] as const;
export type PhoneCountry=typeof PHONE_COUNTRIES[number]['iso'];
export const getPhoneCountry=(iso:PhoneCountry)=>PHONE_COUNTRIES.find(c=>c.iso===iso)!;
export const composePhone=(iso:PhoneCountry,local:string)=>'+'+getPhoneCountry(iso).dial+local.replace(/\D/g,'').replace(/^0+(?=\d)/,'');
export function validatePhone(iso:PhoneCountry,local:string){
  const number=local.replace(/\D/g,'').replace(/^0+(?=\d)/,'');
  return (getPhoneCountry(iso).digits as readonly number[]).includes(number.length)
    && !/^(\d)\1+$/.test(number)
    && !/^(0123456789|1234567890|123456789|9876543210|987654321)$/.test(number);
}
export const PHONE_FLAGS:Record<PhoneCountry,string>={KG:'🇰🇬',KZ:'🇰🇿',RU:'🇷🇺',UZ:'🇺🇿',TJ:'🇹🇯',TR:'🇹🇷',AE:'🇦🇪',US:'🇺🇸',GB:'🇬🇧',DE:'🇩🇪',KR:'🇰🇷',CN:'🇨🇳'};
export function PhoneField({country,onCountryChange,value,onChange,label}:{country:PhoneCountry;onCountryChange:(iso:PhoneCountry)=>void;value:string;onChange:(value:string)=>void;label:string}){
  const {t}=useTranslation();
  const id=useId();
  return <div className="phone-control elbem-phone-control">
    <label className="elbem-phone-label" htmlFor={id}>{label}</label>
    <div className="elbem-phone-group">
      <div className="elbem-phone-prefix">
        <select className="elbem-phone-country" value={country} onChange={e=>onCountryChange(e.target.value as PhoneCountry)} aria-label={t('Страна')} title={t(getPhoneCountry(country).name)}>
          {PHONE_COUNTRIES.map(c=><option key={c.iso} value={c.iso} title={t(c.name)}>{PHONE_FLAGS[c.iso]} +{c.dial}</option>)}
        </select>
      </div>
      <div className="elbem-phone-local"><input id={id} className="elbem-phone-number" type="tel" inputMode="tel" autoComplete="tel-national" value={value} maxLength={19} placeholder={country==='KG'?'555 123 456':t('Номер без кода страны')} onChange={(event:ChangeEvent<HTMLInputElement>)=>onChange(event.target.value.replace(/[^\d\s()\-]/g,''))}/></div>
    </div>
    {value.trim()&&!validatePhone(country,value)&&<small className="phone-error" role="status">{t('Проверьте номер для выбранной страны')}</small>}
  </div>;
}
