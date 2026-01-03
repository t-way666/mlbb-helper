import sqlite3
import os
import re

def transliterate(name):
    slots = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '_', '«': '', '»': '', '"': '', "'": '', '-': '_'
    }
    res = ""
    for char in name.lower():
        res += slots.get(char, char)
    # Удаляем лишние символы и двойные подчеркивания
    res = re.sub(r'[^a-z0-9_]', '', res)
    res = re.sub(r'_+', '_', res)
    return res.strip('_')

def get_db_data():
    conn = sqlite3.connect('backend/data/mlbb_data.db')
    cursor = conn.cursor()
    
    # Герои: (name_ru, name_en)
    cursor.execute('SELECT name_ru, name_en FROM heroes')
    heroes = cursor.fetchall()
    
    # Предметы: (name_ru)
    cursor.execute('SELECT name FROM items')
    items = cursor.fetchall()
    
    conn.close()
    return heroes, items

def sync():
    heroes, items = get_db_data()
    
    print("--- ПЛАН ПЕРЕИМЕНОВАНИЯ ГЕРОЕВ (по name_en) ---")
    for ru, en in heroes:
        target = en.lower().replace(' ', '_')
        print(f"БД: {ru} ({en}) -> Ожидаемый файл: {target}.webp")
        
    print("\n--- ПЛАН ПЕРЕИМЕНОВАНИЯ ПРЕДМЕТОВ (по транслиту name_ru) ---")
    for (name,) in items:
        target = transliterate(name)
        print(f"БД: {name} -> Ожидаемый файл: {target}.webp")

if __name__ == "__main__":
    sync()
