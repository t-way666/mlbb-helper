#!/usr/bin/env python3
"""
Тест для проверки работы с CSV данными
"""

import sys
from data_manager import data_manager

def test_heroes_loading():
    """Тест загрузки данных о героях"""
    print("=== Тест загрузки героев ===")
    
    heroes = data_manager.get_all_heroes()
    if heroes:
        print(f"✓ Загружено {len(heroes)} героев")
        
        # Проверяем первого героя
        first_hero = heroes[0]
        required_fields = ['hero_name', 'main_role', 'hp', 'phys_attack']
        
        for field in required_fields:
            if field in first_hero:
                print(f"✓ Поле {field}: {first_hero[field]}")
            else:
                print(f"✗ Отсутствует поле {field}")
                return False
        
        return True
    else:
        print("✗ Не удалось загрузить героев")
        return False

def test_hero_search():
    """Тест поиска героев"""
    print("\n=== Тест поиска героев ===")
    
    # Поиск по имени
    results = data_manager.search_heroes("Алукард")
    if results:
        print(f"✓ Найден герой: {results[0]['hero_name']}")
        print(f"  Роль: {results[0]['main_role']}")
        print(f"  HP: {results[0]['hp']}")
        return True
    else:
        print("✗ Не удалось найти героя Алукард")
        return False

def test_hero_by_role():
    """Тест получения героев по роли"""
    print("\n=== Тест получения героев по роли ===")
    
    fighters = data_manager.get_heroes_by_role("Боец")
    if fighters:
        print(f"✓ Найдено {len(fighters)} бойцов")
        for fighter in fighters[:3]:  # Показываем первых 3
            print(f"  - {fighter['hero_name']}")
        return True
    else:
        print("✗ Не удалось найти бойцов")
        return False

def test_emblems():
    """Тест загрузки эмблем"""
    print("\n=== Тест загрузки эмблем ===")
    
    emblems = data_manager.get_emblems()
    if emblems:
        print(f"✓ Загружено {len(emblems)} эмблем")
        first_emblem = emblems[0]
        print(f"  Первая эмблема: {first_emblem['name']}")
        print(f"  Стат 1: {first_emblem['extra_stat1']}")
        return True
    else:
        print("✗ Не удалось загрузить эмблемы")
        return False

def test_items():
    """Тест загрузки предметов"""
    print("\n=== Тест загрузки предметов ===")
    
    items = data_manager.get_items()
    if items:
        print(f"✓ Загружено {len(items)} предметов")
        first_item = items[0]
        print(f"  Первый предмет: {first_item['name']}")
        if first_item['stats']:
            print(f"  Характеристики: {first_item['stats'][:3]}...")
        return True
    else:
        print("✗ Не удалось загрузить предметы")
        return False

def test_hero_stats_at_level():
    """Тест получения характеристик героя на определенном уровне"""
    print("\n=== Тест характеристик героя на уровне ===")
    
    hero_name = "Алукард"
    level = 15
    
    stats = data_manager.get_hero_stats_at_level(hero_name, level)
    if stats:
        print(f"✓ Характеристики {hero_name} на {level} уровне:")
        print(f"  HP: {stats['hp']}")
        print(f"  Физическая атака: {stats['phys_attack']}")
        print(f"  Скорость передвижения: {stats['move_speed']}")
        return True
    else:
        print(f"✗ Не удалось получить характеристики {hero_name}")
        return False

def main():
    """Основная функция тестирования"""
    print("=== Тест работы с CSV данными ===\n")
    
    tests = [
        ("Загрузка героев", test_heroes_loading),
        ("Поиск героев", test_hero_search),
        ("Герои по роли", test_hero_by_role),
        ("Загрузка эмблем", test_emblems),
        ("Загрузка предметов", test_items),
        ("Характеристики на уровне", test_hero_stats_at_level),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append(result)
        except Exception as e:
            print(f"✗ Ошибка выполнения теста {test_name}: {e}")
            results.append(False)
    
    # Итоговый результат
    passed = sum(results)
    total = len(results)
    
    print("\n" + "=" * 50)
    print(f"Результат: {passed}/{total} тестов пройдено")
    
    if passed == total:
        print("🎉 Все тесты пройдены! Работа с CSV данными успешна!")
        return 0
    else:
        print("❌ Некоторые тесты не пройдены. Проверьте ошибки выше.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
