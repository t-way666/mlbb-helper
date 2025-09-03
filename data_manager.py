import sqlite3
import logging

logger = logging.getLogger(__name__)
DB_FILE = 'data/mlbb_data.db'

def get_db_connection():
    """Создает и возвращает соединение с базой данных."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

class DataManager:
    """Класс для управления данными, адаптированный для возврата данных в старом формате."""

    def __init__(self):
        pass

    def _map_row_to_hero_dict(self, row):
        """Преобразует строку из БД в словарь формата, который ожидает приложение."""
        hero_dict = {}
        row_dict = dict(row)

        key_map = {
            'name_ru': 'hero_name',
            'hp_1lvl': 'hp',
            'regen_hp_1lvl': 'regen_hp',
            'resource_1lvl': 'resource',
            'regen_resouce_1lvl': 'regen_resource',
            'phis_atk_1lvl': 'phys_attack',
            'phis_def_1lvl': 'phys_def',
            'mag_def_1lvl': 'mag_def',
            'atk_speed_1lvl': 'attack_speed',
            'coeff_atk_speed_percent': 'attack_speed_coefficient_percent',
            'magic_power_all_lvl': 'mag_power',
            'move_speed': 'move_speed',
            'min_basic_atk_range': 'min_basic_atk_range',
            'max_basic_atk_range': 'max_basic_atk_range',
        }

        for db_key, app_key in key_map.items():
            if db_key in row_dict:
                hero_dict[app_key] = row_dict[db_key]

        for stat_name, base_value in row_dict.items():
            if stat_name.endswith('_1lvl'):
                stat_15lvl_name = stat_name.replace('_1lvl', '_15lvl')
                
                if stat_name == 'mag_def_1lvl':
                    stat_15lvl_name = 'mag_def'
                if stat_name == 'regen_resouce_1lvl':
                    stat_15lvl_name = 'regen_resource_15lvl'

                value_15lvl = row_dict.get(stat_15lvl_name)
                if value_15lvl is not None:
                    growth = (value_15lvl - base_value) / 14.0
                    app_key = None
                    for db_k, app_k in key_map.items():
                        if db_k == stat_name:
                            app_key = app_k
                            break
                    if app_key:
                        hero_dict[f'growth_{app_key}'] = round(growth, 2)

        resource_val = hero_dict.get('resource', 0)
        if resource_val == 100:
            hero_dict['resource_type'] = 'Energy'
        elif resource_val > 100:
            hero_dict['resource_type'] = 'Mana'
        else:
            hero_dict['resource_type'] = None
            
        # Добавляем стандартные характеристики, если они отсутствуют
        default_stats = {
            'crit_chance_percent': 0,
            'crit_damage_percent': 200,
            'cd_reduction_percent': 0,
            'phys_penetration': 0,
            'phys_penetration_percent': 0,
            'mag_penetration': 0,
            'mag_penetration_percent': 0,
            'lifesteal_percent': 0,
            'spell_vamp_percent': 0,
            'resilience_percent': 0,
            'crit_damage_reduction_percent': 0,
            'healing_effect_percent': 0,
            'healing_received_percent': 0
        }
        for stat, value in default_stats.items():
            if stat not in hero_dict:
                hero_dict[stat] = value

        # Добавляем роли героя
        hero_dict['main_role'] = row_dict.get('primary_role_name_ru')
        hero_dict['extra_role'] = row_dict.get('extra_role_name_ru')

        return hero_dict
    def get_all_heroes(self):
        """Возвращает всех героев с их базовыми характеристиками и ролями в старом формате."""
        heroes_list = []
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            sql = """
            SELECT
                h.name_ru, hs.*,
                pr.role_name_ru AS primary_role_name_ru,
                er.role_name_ru AS extra_role_name_ru
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            LEFT JOIN hero_roles hr ON h.id = hr.hero_id
            LEFT JOIN roles pr ON hr.primary_role_id = pr.role_id
            LEFT JOIN roles er ON hr.extra_role_id = er.role_id
            """
            cursor.execute(sql)
            rows = cursor.fetchall()
            for row in rows:
                heroes_list.append(self._map_row_to_hero_dict(row))
        except sqlite3.Error as e:
            logger.error(f"Ошибка при получении всех героев: {e}")
        finally:
            conn.close()
        return heroes_list
    def get_hero_by_name(self, hero_name):
        """Возвращает одного героя по имени в старом формате."""
        hero = None
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            sql = """
            SELECT 
                h.name_ru, hs.*, 
                pr.role_name_ru AS primary_role_name_ru,
                er.role_name_ru AS extra_role_name_ru
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            LEFT JOIN hero_roles hr ON h.id = hr.hero_id
            LEFT JOIN roles pr ON hr.primary_role_id = pr.role_id
            LEFT JOIN roles er ON hr.extra_role_id = er.role_id
            WHERE h.name_ru LIKE ?
            """
            cursor.execute(sql, (hero_name,))
            row = cursor.fetchone()
            if row:
                hero = self._map_row_to_hero_dict(row)
        except sqlite3.Error as e:
            logger.error(f"Ошибка при получении героя '{hero_name}': {e}")
        finally:
            conn.close()
        return hero

    def get_hero_stats_at_level(self, hero_name, level):
        """Рассчитывает и возвращает характеристики героя на определенном уровне."""
        if not (1 <= level <= 15):
            return None
        hero = self.get_hero_by_name(hero_name)
        if not hero:
            return None

        calculated_stats = hero.copy()
        calculated_stats['level'] = level

        for key, value in hero.items():
            if isinstance(key, str) and key.startswith('growth_'):
                base_key = key.replace('growth_', '')
                if base_key in hero:
                    base_value = hero[base_key]
                    growth_value = value
                    calculated_stats[base_key] = base_value + growth_value * (level - 1)
        
        return calculated_stats

    def search_heroes(self, query):
        """Поиск героев по имени в базе данных."""
        results = []
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            sql = """
            SELECT 
                h.name_ru, hs.*, 
                pr.role_name_ru AS primary_role_name_ru,
                er.role_name_ru AS extra_role_name_ru
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            LEFT JOIN hero_roles hr ON h.id = hr.hero_id
            LEFT JOIN roles pr ON hr.primary_role_id = pr.role_id
            LEFT JOIN roles er ON hr.extra_role_id = er.role_id
            WHERE h.name_ru LIKE ?
            """
            cursor.execute(sql, (f'%{query}%',))
            rows = cursor.fetchall()
            for row in rows:
                results.append(self._map_row_to_hero_dict(row))
        except sqlite3.Error as e:
            logger.error(f"Ошибка при поиске героев по запросу '{query}': {e}")
        finally:
            conn.close()
        return results

    def get_heroes_by_role(self, role):
        """Возвращает героев определенной роли."""
        heroes_list = []
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            sql = """
            SELECT 
                h.name_ru, hs.*, 
                pr.role_name_ru AS primary_role_name_ru,
                er.role_name_ru AS extra_role_name_ru
            FROM heroes h
            JOIN hero_stats hs ON h.id = hs.hero_id
            LEFT JOIN hero_roles hr ON h.id = hr.hero_id
            LEFT JOIN roles pr ON hr.primary_role_id = pr.role_id
            LEFT JOIN roles er ON hr.extra_role_id = er.role_id
            WHERE pr.role_name_ru = ? OR er.role_name_ru = ?
            """
            cursor.execute(sql, (role, role))
            rows = cursor.fetchall()
            for row in rows:
                heroes_list.append(self._map_row_to_hero_dict(row))
        except sqlite3.Error as e:
            logger.error(f"Ошибка при получении героев по роли '{role}': {e}")
        finally:
            conn.close()
        return heroes_list

    # --- Заглушки для нереализованных методов --- #
    def get_emblems(self): return []
    def get_items(self): return []

data_manager = DataManager()

if __name__ == '__main__':
    print("--- Тестирование DataManager ---")
    hero_name = 'Мия'
    miya = data_manager.get_hero_by_name(hero_name)
    if miya:
        print(f"Найден герой: {miya['hero_name']}")
        print(f"Основная роль: {miya.get('main_role')}")
        print(f"Дополнительная роль: {miya.get('extra_role')}")
    else:
        print(f"Герой {hero_name} не найден.")

    print("\n--- Тестирование get_heroes_by_role (Стрелок) ---")
    marksmen = data_manager.get_heroes_by_role('Стрелок')
    if marksmen:
        for hero in marksmen:
            extra_role = f"/{hero.get('extra_role')}" if hero.get('extra_role') else ''
            print(f"- {hero['hero_name']} ({hero.get('main_role')}{extra_role})")
    else:
        print("Стрелки не найдены.")