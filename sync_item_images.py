import os
import shutil

# Путь к изображениям во фронтенде
IMG_DIR = 'frontend/public/static/images/equipments'

# Словарь замен (на основе транслитерации и известных несовпадений)
def transliterate(name):
    slots = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '_', '-': '_', "'": ''
    }
    return ''.join([slots.get(c.lower(), c.lower()) for c in name if c.isalnum() or c in ' -\''])

def normalize_en(name):
    return name.lower().replace("'", "").replace(" ", "_").replace("-", "_").replace(".", "")

# Читаем список предметов
with open('items_list.txt', 'r') as f:
    lines = f.readlines()

all_files = os.listdir(IMG_DIR)

for line in lines:
    if '|' not in line: continue
    name_en, name_ru = line.strip().split('|')
    
    target_name = normalize_en(name_en)
    target_path = os.path.join(IMG_DIR, f"{target_name}.webp")
    
    if os.path.exists(target_path):
        continue # Уже есть
        
    # Пробуем найти подходящий файл
    translit_ru = transliterate(name_ru)
    
    candidates = [
        f"{translit_ru}.webp",
        f"{translit_ru}_min.webp",
        f"{normalize_en(name_en)}.png", # Если есть png
    ]
    
    found = False
    for cand in candidates:
        cand_path = os.path.join(IMG_DIR, cand)
        if os.path.exists(cand_path):
            print(f"Mapping: {cand} -> {target_name}.webp")
            shutil.copy2(cand_path, target_path)
            found = True
            break
    
    if not found:
        print(f"!!! Not found for: {name_ru} ({name_en})")
