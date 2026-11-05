#!/usr/bin/env python3
"""Fix only the isolated CommonJS test harness for Vite import.meta.env.
Does not change application code, Firebase rules, or credentials.
"""
from pathlib import Path
import sys

root = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else Path.cwd().resolve()
target = root / 'scripts' / 'test-spark-logic.cjs'
if not (root / 'package.json').is_file() or not (root / 'src' / 'store.ts').is_file() or not target.is_file():
    sys.exit('ОШИБКА: укажи корневую папку EL_BEM_BEAUTY, где есть package.json, src/store.ts и scripts/test-spark-logic.cjs')
text = target.read_text(encoding='utf-8')
replacements = [
    (
        "const adminAuth={currentUser:{uid:'owner'}};",
        "const adminAuth={currentUser:{uid:'owner',email:'owner@example.com'}};",
    ),
    (
        ".outputText;\n const module={exports:{}};",
        ".outputText.replaceAll('import.meta.env', '__testViteEnv');\n const module={exports:{}};",
    ),
    (
        "new Function('require','module','exports','crypto',compiled)((name)=>customRequire(name),module,module.exports,globalThis.crypto||require('node:crypto').webcrypto);",
        "new Function('require','module','exports','crypto','__testViteEnv',compiled)((name)=>customRequire(name),module,module.exports,globalThis.crypto||require('node:crypto').webcrypto,{VITE_ADMIN_LOGIN_EMAIL:'owner@example.com'});",
    ),
]
updated = text
for before, after in replacements:
    if after in updated:
        continue
    if updated.count(before) != 1:
        sys.exit('СТОП: тестовый файл отличается от ожидаемой версии. Ничего не изменено.')
    updated = updated.replace(before, after)
if updated == text:
    print('Тестовый файл уже исправлен, повторное изменение не требуется.')
else:
    backup_dir = root / '.git'
    if not backup_dir.is_dir():
        sys.exit('СТОП: не найдена папка .git, ничего не изменено. Открой верную папку проекта.')
    backup = backup_dir / 'test-spark-logic.cjs.before-hotfix'
    if not backup.exists():
        backup.write_text(text, encoding='utf-8')
    target.write_text(updated, encoding='utf-8')
    print('ГОТОВО: исправлен только scripts/test-spark-logic.cjs')
    print('Резервная копия:', backup)
print('Проверь: node --test scripts/test-spark-logic.cjs')
print('Затем: npm run verify')
