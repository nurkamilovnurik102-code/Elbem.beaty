/** Optional public-media hosting; no Firebase Storage / no secrets in VITE_ variables.
 * Unsigned Cloudinary presets are publicly discoverable: enforce format restrictions,
 * transformations, separate folder and account monitoring in Cloudinary Console.
 */
export async function uploadCloudinaryImage(file:File):Promise<string>{
  const cloud=String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME||'');
  const preset=String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET||'');
  if(!/^[a-zA-Z0-9_-]+$/.test(cloud)||!/^[a-zA-Z0-9_-]+$/.test(preset))throw Error('Настройте VITE_CLOUDINARY_CLOUD_NAME и VITE_CLOUDINARY_UPLOAD_PRESET');
  if(!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)||file.size>10*1024*1024)throw Error('Нужен JPEG, PNG, WebP, GIF или AVIF до 10 МБ');
  const data=new FormData();data.set('file',file);data.set('upload_preset',preset);
  const response=await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`,{method:'POST',body:data});
  const result:unknown=await response.json().catch(()=>({}));
  if(!response.ok)throw Error('Cloudinary отказал в загрузке ('+response.status+'). Проверьте unsigned preset.');
  if(!result||typeof result!=='object'||!('secure_url' in result)||typeof result.secure_url!=='string'||!result.secure_url.startsWith('https://res.cloudinary.com/'))throw Error('Cloudinary не вернул корректную публичную ссылку');
  return result.secure_url;
}
