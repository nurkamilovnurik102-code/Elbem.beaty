/** Image URL/library selector; Cloud Firestore stores URL strings, not file bytes. */
import {useTranslation} from 'react-i18next';
import {MediaImage} from '../media';

type ImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  uploadImage: (file: File, onSaved: (url: string) => void) => Promise<void>;
  uploading: boolean;
  library?: string[];
};

export function ImageUpload({value, onChange, label, uploadImage, uploading, library = []}: ImageUploadProps) {
  const {t} = useTranslation();
  return (
    <div className="admin-image-picker">
      <label className="field">
        {label} {t('— ссылка')}
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://..."/>
      </label>
      <label className="field">
          {t('Или загрузить фото с устройства')}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) void uploadImage(file, onChange);
              e.target.value = '';
            }}/>
        </label>
      <p className="hint">{t('Без Cloudinary файл доступен как локальный предпросмотр. Для всех устройств нужна публичная HTTPS-ссылка.')}</p>
      {library.length > 0 && (
        <label className="field">
          {t('Или выбрать из галереи')}
          <select value="" onChange={e => {if (e.target.value) onChange(e.target.value);}}>
            <option value="">{t('Выберите фотографию')}</option>
            {library.map((image, index) => <option value={image} key={index}>{t('Фотография')} {index + 1}</option>)}
          </select>
        </label>
      )}
      {value && <div className="admin-preview"><MediaImage src={value} alt={t('Предпросмотр изображения')}/><span>{t('Так фотография будет кадрироваться в карточке')}</span></div>}
    </div>
  );
}
