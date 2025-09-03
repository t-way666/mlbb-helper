
import sqlite3

DB_FILE = 'data/mlbb_data.db'

ROLES_DATA = [
    ('Стрелок', 'Marksman'),
    ('Боец', 'Fighter'),
    ('Убийца', 'Assassin'),
    ('Маг', 'Mage'),
    ('Танк', 'Tank'),
    ('Поддержка', 'Support')
]

def create_roles_table(conn):
    """Создает таблицу roles, если она не существует."""
    sql = """
    CREATE TABLE IF NOT EXISTS roles (
        role_id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name_ru TEXT NOT NULL UNIQUE,
        role_name_en TEXT NOT NULL UNIQUE
    );
    """
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        print("Таблица 'roles' успешно создана (или уже существует).")
    except sqlite3.Error as e:
        print(f"Ошибка при создании таблицы roles: {e}")

def insert_roles_data(conn):
    """Вставляет данные о ролях в таблицу roles."""
    sql = "INSERT OR IGNORE INTO roles (role_name_ru, role_name_en) VALUES (?, ?)"
    try:
        cursor = conn.cursor()
        cursor.executemany(sql, ROLES_DATA)
        conn.commit()
        print(f"Успешно вставлено {cursor.rowcount} новых ролей. Всего ролей: {len(ROLES_DATA)}.")
    except sqlite3.Error as e:
        print(f"Ошибка при вставке данных о ролях: {e}")

def main():
    """Основная функция для выполнения миграции."""
    conn = None
    try:
        conn = sqlite3.connect(DB_FILE)
        create_roles_table(conn)
        insert_roles_data(conn)
    except sqlite3.Error as e:
        print(f"Произошла ошибка SQLite: {e}")
    finally:
        if conn:
            conn.close()
            print("Соединение с БД закрыто.")

if __name__ == '__main__':
    main()
