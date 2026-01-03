import os
import shutil

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
    return res

img_dirs = [
    'backend/static/images/equipments/',
    'frontend/public/static/images/equipments/',
    'backend/static/images/emblems/',
    'frontend/public/static/images/emblems/',
    'backend/static/images/hero_base_avatar_icons/',
    'frontend/public/static/images/hero_base_avatar_icons/',
]

def rename_to_translit():
    for img_dir in img_dirs:
        if not os.path.exists(img_dir): continue
        print(f"Processing {img_dir}...")
        for f in os.listdir(img_dir):
            if f.endswith('.webp') or f.endswith('.png'):
                name_part, ext = os.path.splitext(f)
                new_name = transliterate(name_part) + ext
                if f != new_name:
                    print(f"  {f} -> {new_name}")
                    src = os.path.join(img_dir, f)
                    dst = os.path.join(img_dir, new_name)
                    if os.path.exists(dst):
                        os.remove(src) # Если файл с таким именем уже есть (например, из-за регистра), просто удаляем старый
                    else:
                        shutil.move(src, dst)

if __name__ == "__main__":
    rename_to_translit()