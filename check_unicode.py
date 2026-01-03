import sqlite3
import os
import unicodedata

def dump_hex(s):
    return " ".join(f"{ord(c):04x}" for c in s)

db_path = 'backend/data/mlbb_data.db'
img_dir = 'frontend/public/static/images/equipments/'

item_name = 'Говорящий с ветром'
expected_file = 'Говорящий_с_ветром.webp'

print(f"Checking: {item_name}")

# Из БД
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute('SELECT item_name_ru FROM items WHERE item_name_ru = ?', (item_name,))
db_row = cursor.fetchone()
if db_row:
    db_name = db_row[0]
    print(f"DB name:  {db_name}")
    print(f"DB hex:   {dump_hex(db_name)}")
else:
    print("Item not found in DB!")

# С диска
if os.path.exists(os.path.join(img_dir, expected_file)):
    print(f"File:     {expected_file}")
    print(f"File hex: {dump_hex(expected_file)}")
else:
    print(f"File {expected_file} NOT FOUND on disk!")
    # Посмотрим что есть похожее
    for f in os.listdir(img_dir):
        if 'Говорящий' in f:
            print(f"Found similar file: {f}")
            print(f"Similar hex:        {dump_hex(f)}")
