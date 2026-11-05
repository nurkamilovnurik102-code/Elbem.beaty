EL BEM BEAUTY — исправление тестового загрузчика CommonJS.

Устанавливать ТОЛЬКО в корень существующего EL_BEM_BEAUTY (там, где package.json).
Патч не меняет src/store.ts, Firebase, Firestore Rules или данные.

1. Распакуй эту папку на рабочий стол.
2. Открой терминал VS Code в корне EL_BEM_BEAUTY.
3. Запусти:

python3 ~/Desktop/EL_BEM_SPARK_TEST_HOTFIX_2026_11_06/fix_spark_test.py .
node --test scripts/test-spark-logic.cjs
npm run verify

Исправляются три детали ТОЛЬКО внутри scripts/test-spark-logic.cjs:
- тестовому mock-администратору добавлен email;
- import.meta.env подменяется внутри тестового CommonJS-загрузчика;
- тестовый email совпадает с mock-администратором.

Новая база Firebase не нужна. Обновлять Vercel только после успешной проверки.
