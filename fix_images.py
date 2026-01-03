import sqlite3
import os
import shutil

db_path = 'backend/data/mlbb_data.db'
img_dirs = [
    'backend/static/images/equipments/',
    'frontend/public/static/images/equipments/'
]

def normalize_name(name):
    return name.replace(' ', '_')

def fix_images():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT item_name_ru FROM items')
    items = [row[0] for row in cursor.fetchall()]
    conn.close()

    for img_dir in img_dirs:
        if not os.path.exists(img_dir):
            print(f"Directory {img_dir} not found, skipping...")
            continue
        
        print(f"Processing {img_dir}...")
        existing_files = os.listdir(img_dir)
        
        for item_name in items:
            expected_name = normalize_name(item_name) + '.webp'
            
            if expected_name in existing_files:
                # print(f"  OK: {expected_name}")
                continue
            
            # Если точного совпадения нет, ищем без учета регистра
            found = False
            for f in existing_files:
                if f.lower() == expected_name.lower():
                    print(f"  Fixing case/name: {f} -> {expected_name}")
                    os.rename(os.path.join(img_dir, f), os.path.join(img_dir, expected_name))
                    found = True
                    break
            
            if not found:
                # Пробуем найти по началу названия (на случай если там -min или .png)
                base_name = normalize_name(item_name)
                for f in existing_files:
                    if f.startswith(base_name):
                        print(f"  Matching by prefix: {f} -> {expected_name}")
                        os.rename(os.path.join(img_dir, f), os.path.join(img_dir, expected_name))
                        found = True
                        break
                
            if not found:
                print(f"  NOT FOUND: {item_name} (expected {expected_name})")

if __name__ == "__main__":
    fix_images()
