#!/usr/bin/env python3
"""
Модуль для управления данными из CSV файлов
"""

import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

class DataManager:
    """Класс для управления данными из CSV файлов"""
    
    def __init__(self):
        self.heroes_data = None
        self.emblems_data = None
        self.items_data = None
        self._load_data()
    
    def _load_data(self):
        """Загружает все данные из CSV файлов"""
        try:
            # Загружаем данные о героях
            heroes_path = 'db_info_csv/hero_stats.csv'
            if os.path.exists(heroes_path):
                self.heroes_data = pd.read_csv(heroes_path, sep=';', encoding='utf-8')
                logger.info(f"Загружено {len(self.heroes_data)} героев")
            else:
                logger.warning(f"Файл {heroes_path} не найден")
            
            # Загружаем данные об эмблемах
            emblems_path = 'csv/emblems.csv'
            if os.path.exists(emblems_path):
                self.emblems_data = pd.read_csv(emblems_path, sep=';', encoding='utf-8')
                logger.info(f"Загружено {len(self.emblems_data)} эмблем")
            else:
                logger.warning(f"Файл {emblems_path} не найден")
            
            # Загружаем данные о предметах
            items_path = 'csv/items.csv'
            if os.path.exists(items_path):
                self.items_data = pd.read_csv(items_path, sep=';', encoding='utf-8')
                logger.info(f"Загружено {len(self.items_data)} предметов")
            else:
                logger.warning(f"Файл {items_path} не найден")
                
        except Exception as e:
            logger.error(f"Ошибка при загрузке данных: {e}")
    
    def get_all_heroes(self):
        """Возвращает всех героев с их характеристиками"""
        if self.heroes_data is None:
            return []
        
        heroes = []
        for _, row in self.heroes_data.iterrows():
            hero = {
                'hero_name': row['hero'],
                'main_role': self._get_main_role(row),
                'extra_role': self._get_extra_role(row),
                'hp': row['HP'],
                'growth_hp': row['growth_HP'],
                'regen_hp': row['regen_HP'],
                'growth_regen_hp': row['growth_regen_HP'],
                'resource_type': self._get_resource_type(row),
                'resource': row['mana/energy'],
                'growth_resource': row['growth_mana/energy'],
                'regen_resource': row['regen_mana/energy'],
                'growth_regen_resource': row['growth_regen_mana/energy'],
                'phys_attack': row['phys_attack'],
                'growth_phys_attack': row['growth_phys_attack'],
                'phys_def': row['phys_def'],
                'growth_phys_def': row['growth_phys_def'],
                'mag_def': row['mag_def'],
                'growth_mag_def': row['growth_mag_def'],
                'attack_speed': row['attack_speed'],
                'growth_attack_speed': row['growth_attack_speed'],
                'mag_power': row['mag_power'],
                'move_speed': row['move_speed'],
                'min_basic_attack_range': row['min_basic_attack_range'],
                'max_basic_attack_range': row['max_basic_attack_range'],
                'crit_chance_percent': row['crit_chance'],
                'crit_damage_percent': row['crit_damage'],
                'cd_reduction_percent': row['cd_reduction'],
                'phys_penetration': 0,  # Не указано в CSV
                'phys_penetration_percent': 0,  # Не указано в CSV
                'mag_penetration': row['mag_penetration'],
                'mag_penetration_percent': 0,  # Не указано в CSV
                'lifesteal_percent': row['lifesteal'],
                'spell_vamp_percent': row['spell_vamp'],
                'resilience_percent': row['resilence'],
                'crit_damage_reduction_percent': row['crit_dmg_reduction'],
                'healing_effect_percent': row['healing_effect'],
                'healing_received_percent': row['healing_received']
            }
            heroes.append(hero)
        
        return heroes
    
    def _get_main_role(self, row):
        """Определяет основную роль героя"""
        roles = {
            'assasin': 'Убийца',
            'marksman': 'Стрелок', 
            'mage': 'Маг',
            'tank': 'Танк',
            'fighter': 'Боец',
            'support': 'Поддержка'
        }
        
        for role_key, role_name in roles.items():
            if row[role_key] == 1:
                return role_name
        return None
    
    def _get_extra_role(self, row):
        """Определяет дополнительную роль героя"""
        roles = {
            'assasin': 'Убийца',
            'marksman': 'Стрелок', 
            'mage': 'Маг',
            'tank': 'Танк',
            'fighter': 'Боец',
            'support': 'Поддержка'
        }
        
        extra_roles = []
        for role_key, role_name in roles.items():
            if row[role_key] == 1:
                extra_roles.append(role_name)
        
        # Возвращаем вторую роль, если она есть
        return extra_roles[1] if len(extra_roles) > 1 else None
    
    def _get_resource_type(self, row):
        """Определяет тип ресурса героя"""
        if row['mana/energy'] > 0:
            if 'Energy' in str(row.get('resource_type', '')):
                return 'Energy'
            else:
                return 'Mana'
        return None
    
    def get_hero_by_name(self, hero_name):
        """Возвращает героя по имени"""
        heroes = self.get_all_heroes()
        for hero in heroes:
            if hero['hero_name'].lower() == hero_name.lower():
                return hero
        return None
    
    def get_heroes_by_role(self, role):
        """Возвращает героев определенной роли"""
        heroes = self.get_all_heroes()
        role_heroes = []
        
        for hero in heroes:
            if (hero['main_role'] == role or 
                hero['extra_role'] == role):
                role_heroes.append(hero)
        
        return role_heroes
    
    def get_emblems(self):
        """Возвращает все эмблемы"""
        if self.emblems_data is None:
            return []
        
        emblems = []
        for _, row in self.emblems_data.iterrows():
            emblem = {
                'name': row['emblems'],
                'extra_stat1': row['extra_stat1'],
                'extra_stat2': row['extra_stat2'],
                'extra_stat3': row['extra_stat3']
            }
            emblems.append(emblem)
        
        return emblems
    
    def get_items(self):
        """Возвращает все предметы"""
        if self.items_data is None:
            return []
        
        items = []
        for _, row in self.items_data.iterrows():
            item = {
                'name': row.iloc[0],  # Первая колонка - название
                'stats': row.iloc[1:].dropna().tolist()  # Остальные колонки - характеристики
            }
            items.append(item)
        
        return items
    
    def search_heroes(self, query):
        """Поиск героев по запросу"""
        heroes = self.get_all_heroes()
        query = query.lower()
        
        results = []
        for hero in heroes:
            if (query in hero['hero_name'].lower() or
                (hero['main_role'] and query in hero['main_role'].lower()) or
                (hero['extra_role'] and query in hero['extra_role'].lower())):
                results.append(hero)
        
        return results
    
    def get_hero_stats_at_level(self, hero_name, level):
        """Возвращает характеристики героя на определенном уровне"""
        hero = self.get_hero_by_name(hero_name)
        if not hero or level < 1:
            return None
        
        # Базовые характеристики + рост за уровень
        stats = {}
        for key in hero:
            if key.startswith('growth_'):
                base_key = key.replace('growth_', '')
                if base_key in hero:
                    base_value = hero[base_key]
                    growth_value = hero[key]
                    if pd.notna(base_value) and pd.notna(growth_value):
                        stats[base_key] = base_value + (growth_value * (level - 1))
                    else:
                        stats[base_key] = base_value
                else:
                    stats[key] = hero[key]
            elif not key.startswith('growth_'):
                stats[key] = hero[key]
        
        return stats

# Создаем глобальный экземпляр менеджера данных
data_manager = DataManager()
