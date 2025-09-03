import sqlite3
import logging

logger = logging.getLogger(__name__)
DB_FILE = 'data/mlbb_data.db'

def get_db_connection():
    """Создает и возвращает соединение с базой данных."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # Позволяет обращаться к колонкам по имени
    return conn

class DataManager:
    """Класс для управления данными из базы данных SQLite."""

    def __init__(self):
        # Соединение создается при необходимости в каждом методе
        pass

    def _get_all_stats_columns(self):
        """Вспомогательный метод для получения имен всех колонок статов."""
        conn = get_db_connection()
        cursor = conn.execute('SELECT * FROM hero_stats LIMIT 1')
        names = [description[0] for description in cursor.description]
        conn.close()
        return names

    def get_all_heroes(self):
        """Возвращает всех героев с их базовыми характеристиками."""
        heroes_list = []
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            # Объединяем таблицы, чтобы получить имя и статы
            sql = """
            SELECT h.name_ru, hs.* 
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            """
            cursor.execute(sql)
            rows = cursor.fetchall()
            
            for row in rows:
                heroes_list.append(dict(row))
        except sqlite3.Error as e:
            logger.error(f"Ошибка при получении всех героев: {e}")
        finally:
            conn.close()
        
        return heroes_list

    def get_hero_by_name(self, hero_name):
        """Возвращает одного героя по его русскому имени."""
        hero = None
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            sql = """
            SELECT h.name_ru, hs.* 
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            WHERE h.name_ru = ?
            """
            cursor.execute(sql, (hero_name,))
            row = cursor.fetchone()
            if row:
                hero = dict(row)
        except sqlite3.Error as e:
            logger.error(f"Ошибка при получении героя '{hero_name}': {e}")
        finally:
            conn.close()
        return hero

    def get_hero_stats_at_level(self, hero_name, level):
        """Рассчитывает и возвращает характеристики героя на определенном уровне."""
        if not (1 <= level <= 15):
            return None

        base_stats = self.get_hero_by_name(hero_name)
        if not base_stats:
            return None

        calculated_stats = {'name_ru': hero_name, 'level': level}
        
        # Проходим по всем статам
        for stat_name, base_value in base_stats.items():
            if stat_name.endswith('_1lvl'):
                # Находим соответствующий стат на 15 уровне
                stat_15lvl_name = stat_name.replace('_1lvl', '_15lvl')
                value_15lvl = base_stats.get(stat_15lvl_name)

                if value_15lvl is not None:
                    # Рассчитываем прирост за уровень
                    growth_per_level = (value_15lvl - base_value) / 14.0
                    # Рассчитываем значение на нужном уровне
                    current_value = base_value + growth_per_level * (level - 1)
                    
                    # Убираем суффикс _1lvl для ключа
                    clean_stat_name = stat_name.replace('_1lvl', '')
                    calculated_stats[clean_stat_name] = round(current_value, 2)
            
            # Добавляем статы, которые не меняются с уровнем
            elif not '_15lvl' in stat_name and not stat_name in calculated_stats:
                 calculated_stats[stat_name] = base_value

        return calculated_stats

    # --- Методы, которые пока не реализованы --- #

    def get_heroes_by_role(self, role):
        logger.warning("Метод get_heroes_by_role не реализован для SQLite.")
        return []

    def get_emblems(self):
        logger.warning("Метод get_emblems не реализован для SQLite.")
        return []

    def get_items(self):
        logger.warning("Метод get_items не реализован для SQLite.")
        return []

    def search_heroes(self, query):
        """Поиск героев по имени в базе данных."""
        results = []
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            # Ищем по частичному совпадению в русских именах
            sql = """
            SELECT h.name_ru, hs.* 
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            WHERE h.name_ru LIKE ?
            """
            cursor.execute(sql, (f'%{query}%',))
            rows = cursor.fetchall()
            for row in rows:
                results.append(dict(row))
        except sqlite3.Error as e:
            logger.error(f"Ошибка при поиске героев по запросу '{query}': {e}")
        finally:
            conn.close()
        return results

# Глобальный экземпляр для совместимости
data_manager = DataManager()

if __name__ == '__main__':
    # Пример использования
    print("--- Получение всех героев ---")
    all_heroes = data_manager.get_all_heroes()
    if all_heroes:
        print(f"Всего найдено: {len(all_heroes)} героев.")
        print(f"Пример данных по герою '{all_heroes[0]['name_ru']}':\n {all_heroes[0]}\n")

    print("--- Поиск героя по имени ---")
    hero_name = 'Алукард'
    alucard = data_manager.get_hero_by_name(hero_name)
    if alucard:
        print(f"Найден герой: {alucard['name_ru']}")
        print(f"Его ОЗ на 1 уровне: {alucard['hp_1lvl']}\n")

    print("--- Расчет статов на уровне ---")
    level = 10
    alucard_lvl_10 = data_manager.get_hero_stats_at_level(hero_name, level)
    if alucard_lvl_10:
        print(f"Статы героя {hero_name} на {level} уровне:")
        print(f"  ОЗ: {alucard_lvl_10.get('hp')}")
        print(f"  Физ. атака: {alucard_lvl_10.get('phis_atk')}")
        print(f"  Скорость атаки: {alucard_lvl_10.get('atk_speed')}\n")

    print("--- Поиск героев ---")
    query = 'ал'
    found_heroes = data_manager.search_heroes(query)
    if found_heroes:
        print(f"Найдены герои по запросу '{query}':")
        for hero in found_heroes:
            print(f"  - {hero['name_ru']}")