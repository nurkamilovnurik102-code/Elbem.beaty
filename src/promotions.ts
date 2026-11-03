import type {LocalizedFields} from './data';
export type Promotion={id:string;name:string;description:string;image:string;active:boolean;localized?:LocalizedFields};
// Backwards-compatible representation of the existing offer, until an admin saves the first list.
// No discount or price is implied or generated.
export const defaultOffers:Promotion[]=[{
  id:'classic-lamination-sugaring',name:'Лами + шугаринг',
  description:'Лами + шугаринг. Условия и стоимость уточняйте у администратора салона.',
  image:'',active:true,
  localized:{ky:{name:'Лами + шугаринг',description:'Лами + шугаринг. Баасын жана шарттарын салондун администраторунан тактаңыз.'},en:{name:'Lamination + sugaring',description:'Ask the salon about lamination and sugaring offer terms and pricing.'}}
}];
