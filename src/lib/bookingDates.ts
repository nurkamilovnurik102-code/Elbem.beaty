/** All booking calendar dates use the local salon day in Asia/Bishkek. */
export function bishkekDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bishkek', day: '2-digit', month: '2-digit', year: 'numeric',
  }).formatToParts(date);
  const value = (key: string) => parts.find(part => part.type === key)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export const today = () => bishkekDate(new Date());
export const nextDays = () => Array.from({length: 14}, (_, i) =>
  bishkekDate(new Date(Date.now() + i * 86400000)),
);
export const times = Array.from({length: 20}, (_, index) => {
  const minutes = 9 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});
export const uid = () => crypto.randomUUID();

export const nextBookingLimit = () => bishkekDate(new Date(Date.now()+90*86400000));
