import sqlite3
import json
import os
import re

DB_PATH = 'backend/data/mlbb_data.db'
OUTPUT_DIR = 'frontend/src/data'

def slugify(text):
    if not text: return "unknown"
    return re.sub(r'[^a-z0-9]', '', text.lower())

def get_growth(v1, v15):
    if v1 is None or v15 is None: return 0
    return round((v15 - v1) / 14.0, 3)

def migrate():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # --- 1. ГЕРОИ ---
    print("Migrating heroes...")
    cursor.execute("""
        SELECT h.*, hs.*, 
               pr.role_name_ru as p_ru, pr.role_name_en as p_en,
               er.role_name_ru as e_ru, er.role_name_en as e_en
        FROM heroes h
        JOIN hero_stats hs ON h.id = hs.hero_id
        LEFT JOIN hero_roles hr ON h.id = hr.hero_id
        LEFT JOIN roles pr ON hr.primary_role_id = pr.role_id
        LEFT JOIN roles er ON hr.extra_role_id = er.role_id
    """)
    
    heroes_json = []
    for row in cursor.fetchall():
        d = dict(row)
        roles_ru = [d['p_ru']] if d['p_ru'] else []
        if d['e_ru']: roles_ru.append(d['e_ru'])
        roles_en = [d['p_en']] if d['p_en'] else []
        if d['e_en']: roles_en.append(d['e_en'])

        slug = slugify(d['name_en'])
        hero = {
            "id": f"{slug}_{d['id']}",
            "image_id": slug,
            "name": { "ru": d['name_ru'], "en": d['name_en'] },
            "roles": { "ru": roles_ru, "en": roles_en },
            "resource": d['resource_type'],
            "stats": {
                "hp": { "base": d['hp_1lvl'], "growth": get_growth(d['hp_1lvl'], d['hp_15lvl']) },
                "hp_regen": { "base": d['regen_hp_1lvl'], "growth": get_growth(d['regen_hp_1lvl'], d['regen_hp_15lvl']) },
                "phys_atk": { "base": d['phys_atk_1lvl'], "growth": get_growth(d['phys_atk_1lvl'], d['phys_atk_15lvl']) },
                "phys_def": { "base": d['phys_def_1lvl'], "growth": get_growth(d['phys_def_1lvl'], d['phys_def_15lvl']) },
                "mag_def": { "base": d['mag_def_1lvl'], "growth": get_growth(d['mag_def_1lvl'], d['mag_def_15lvl']) },
                "atk_speed": { "base": d['atk_speed_1lvl'], "growth": get_growth(d['atk_speed_1lvl'], d['atk_speed_15lvl']) },
                "mag_power": { "base": d['mag_power_all_lvl'], "growth": 0 },
                "move_speed": d['move_speed'],
                "atk_range": { "min": d['min_basic_atk_range'], "max": d['max_basic_atk_range'] },
                "atk_speed_ratio": d['coeff_atk_speed_fraction']
            }
        }
        heroes_json.append(hero)

    # --- 2. ПРЕДМЕТЫ ---
    print("Migrating items...")
    cursor.execute("SELECT i.*, s.* FROM items i LEFT JOIN item_stats s ON i.item_id = s.item_id")
    items_json = []
    for row in cursor.fetchall():
        d = dict(row)
        slug = slugify(d['item_name_en'])
        item = {
            "id": f"{slug}_{d['item_id']}",
            "image_id": slug,
            "name": { "ru": d['item_name_ru'], "en": d['item_name_en'] },
            "cost": d['cost'],
            "category": d['category'],
            "stats": {}
        }
        exclude = ['item_id', 'item_name_ru', 'item_name_en', 'cost', 'category']
        for key, val in d.items():
            if key not in exclude and val and val != 0:
                item["stats"][key] = val
        items_json.append(item)

    # --- 3. ЭМБЛЕМЫ ---
    print("Migrating emblems...")
    cursor.execute("SELECT e.*, es.* FROM emblems e LEFT JOIN emblem_stats es ON e.emblem_id = es.emblem_id")
    emblems_json = []
    for row in cursor.fetchall():
        d = dict(row)
        slug = slugify(d['emblem_name_en'])
        emblem = {
            "id": f"{slug}_{d['emblem_id']}",
            "image_id": slug,
            "name": { "ru": d['emblem_name_ru'], "en": d['emblem_name_en'] },
            "stats": {}
        }
        exclude = ['emblem_id', 'emblem_name_ru', 'emblem_name_en']
        for key, val in d.items():
            if key not in exclude and val and val != 0:
                emblem["stats"][key] = val
        emblems_json.append(emblem)

    # --- СОХРАНЕНИЕ ---
    with open(f'{OUTPUT_DIR}/heroes.json', 'w', encoding='utf-8') as f:
        json.dump(heroes_json, f, ensure_ascii=False, indent=2)
    with open(f'{OUTPUT_DIR}/items.json', 'w', encoding='utf-8') as f:
        json.dump(items_json, f, ensure_ascii=False, indent=2)
    with open(f'{OUTPUT_DIR}/emblems.json', 'w', encoding='utf-8') as f:
        json.dump(emblems_json, f, ensure_ascii=False, indent=2)

    print("Migration complete!")
    conn.close()

if __name__ == "__main__":
    migrate()