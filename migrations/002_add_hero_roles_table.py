
import sqlite3

DB_FILE = 'data/mlbb_data.db'

def create_hero_roles_table(conn):
    """Создает таблицу hero_roles."""
    sql = """
    CREATE TABLE IF NOT EXISTS hero_roles (
        hero_id INTEGER NOT NULL,
        primary_role_id INTEGER NOT NULL,
        extra_role_id INTEGER,
        FOREIGN KEY (hero_id) REFERENCES heroes (id),
        FOREIGN KEY (primary_role_id) REFERENCES roles (role_id),
        FOREIGN KEY (extra_role_id) REFERENCES roles (role_id)
    );
    """
    try:
        cursor = conn.cursor()
        cursor.execute(sql)
        print("Таблица 'hero_roles' успешно создана (или уже существует).")
    except sqlite3.Error as e:
        print(f"Ошибка при создании таблицы hero_roles: {e}")

def main():
    """Основная функция для выполнения миграции."""
    conn = None
    try:
        conn = sqlite3.connect(DB_FILE)
        create_hero_roles_table(conn)
    except sqlite3.Error as e:
        print(f"Произошла ошибка SQLite: {e}")
    finally:
        if conn:
            conn.close()
            print("Соединение с БД закрыто.")

if __name__ == '__main__':
    main()
