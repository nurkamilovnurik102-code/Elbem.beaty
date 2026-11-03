/** Public pages and their URLs. Changing labels requires updating i18n dictionaries. */
export const routes = [
  'Главная', 'Услуги', 'Мастера', 'Запись', 'Обучение', 'Магазин',
  'Галерея', 'Отзывы', 'О нас', 'Контакты', 'Кабинет',
];

export const pagePaths: Record<string, string> = {
  'Главная': '/',
  'Услуги': '/services',
  'Мастера': '/masters',
  'Запись': '/booking',
  'Обучение': '/academy',
  'Магазин': '/shop',
  'Корзина': '/cart',
  'Галерея': '/gallery',
  'Отзывы': '/reviews',
  'О нас': '/about',
  'Контакты': '/contacts',
  'Кабинет': '/account',
  'Подробнее': '/details',
  'Админка': '/admin',
};

export const pathPages = Object.fromEntries(
  Object.entries(pagePaths).map(([name, path]) => [path, name]),
);
