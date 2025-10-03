# MLBB Helper Website

Веб-приложение для помощи игрокам Mobile Legends: Bang Bang с информацией о героях, предметах и калькуляторами.

## Установка и запуск
1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
2. Создайте файл `.env` (необязательно, но рекомендуется) и задайте секретный ключ Flask:
   ```
   SECRET_KEY=your-secret-key
   ```
3. Убедитесь, что база данных существует: `data/mlbb_data.db` (SQLite). Репозиторий уже содержит файл БД. Если его нет, добавьте актуальную копию.
4. Запустите приложение:
   ```bash
   python app.py
   ```
   или
   ```bash
   flask run --host=0.0.0.0 --port=8080
   ```
5. Откройте браузер и перейдите: http://127.0.0.1:8080/

### Продакшен (опционально)
Для запуска через gunicorn:
```bash
gunicorn -c gunicorn_config.py wsgi:app
```

## Структура проекта
- `app.py` — основное Flask-приложение и маршруты
- `data_manager.py` — доступ к данным из SQLite (`data/mlbb_data.db`)
- `static/` — статические файлы (JS, CSS, изображения)
- `templates/` — Jinja2-шаблоны
- `data/` — JSON и база данных (`news.json`, `roadmap.json`, `mlbb_data.db`)
- `gunicorn_config.py`, `wsgi.py` — конфигурация и точка входа для gunicorn

## Данные и хранение
Приложение использует SQLite-базу `data/mlbb_data.db` в связке с вспомогательными JSON:
- `data/mlbb_data.db` — основная БД (таблицы героев, ролей, предметов, эмблем и их статов)
- `data/news.json` — список новостей (рендерится на главной)
- `data/roadmap.json` — дорожная карта (рендерится на главной)

Работа с БД инкапсулирована в `data_manager.py` (модуль `DataManager`). Соединение создаётся через стандартный `sqlite3`. Маппинг полей из БД преобразован в ключи, ожидаемые фронтендом; для базовых статов вычисляются приросты до 15 уровня.

## Маршруты (UI)
- `/` — главная страница (новости + дорожная карта)
- `/advanced_damage_calculator` — расширенный калькулятор урона (герои, предметы, эмблемы)
- `/defense-calculator` — калькулятор защиты
- `/mini-damage-calculator` — мини-калькулятор урона
- `/winrate_calculator` — корректировка винрейта
- `/season_progress` — прогресс сезона
- `/hero_base-stats` — таблица базовых характеристик героев

## REST API
- GET `/api/heroes` — список всех героев
- GET `/api/hero_stats/<hero_name>/<int:level>` — статсы героя на уровне 1–15
- GET `/api/heroes/search?q=<query>` — поиск героев по имени
- GET `/api/heroes/<hero_name>` — получение героя по имени
- GET `/api/heroes/role/<role>` — герои по роли
- GET `/api/emblems` — список эмблем
- GET `/api/items` — список предметов

## Статика и медиа
Изображения и прочие ассеты расположены в `static/images/` (иконки, герои, предметы, ранги и т.д.). CSS/JS — в `static/css/` и `static/js/` соответственно.

## Настройка среды разработки в VS Code (опционально)
1. Активируйте виртуальное окружение в терминале VS Code:
   ```bash
   source .venv/bin/activate
   ```
2. Выберите интерпретатор из виртуального окружения:
   - `Ctrl+Shift+P` → `Python: Select Interpreter` → укажите `.venv/bin/python`
3. При проблемах с анализатором:
   ```json
   "python.analysis.extraPaths": [".venv/lib/python3.11/site-packages"]
   ```
   Замените `python3.11` на вашу версию Python.

## Примечания
- Переменные окружения PostgreSQL больше не используются — хранение данных переведено на SQLite.
- Для продакшен-запуска задайте надёжный `SECRET_KEY` через `.env`.