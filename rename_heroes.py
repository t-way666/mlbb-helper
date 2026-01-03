import os
import shutil

# Сопоставление: Старое имя файла -> Новое имя (на основе name_en из БД)
rename_map = {
    "avrora.webp": "aurora.webp",
    "akay.webp": "akai.webp",
    "aldos.webp": "aldous.webp",
    "alisa.webp": "alice.webp",
    "alfa.webp": "alpha.webp",
    "baksiy.webp": "baxia.webp",
    "barts.webp": "barats.webp",
    "beatris.webp": "beatrix.webp",
    "beyn.webp": "bane.webp",
    "belerick.webp": "belerick.webp", # на всякий случай
    "belerik.webp": "belerick.webp",
    "broudi.webp": "brody.webp",
    "chane.webp": "change.webp",
    "chichi.webp": "cici.webp",
    "chong.webp": "yu_zhong.webp",
    "chu.webp": "chou.webp",
    "chzhusin.webp": "zhuxin.webp",
    "darius.webp": "dyrroth.webp",
    "diggi.webp": "diggie.webp",
    "dzhonson.webp": "johnson.webp",
    "dzhoy.webp": "joy.webp",
    "dzhulian.webp": "julian.webp",
    "edit.webp": "edith.webp",
    "eydora.webp": "eudora.webp",
    "eymon.webp": "aamon.webp",
    "fanni.webp": "fanny.webp",
    "fasha.webp": "pharsa.webp",
    "florin.webp": "floryn.webp",
    "fovius.webp": "phoveus.webp",
    "franko.webp": "franco.webp",
    "fredrin.webp": "fredrinn.webp",
    "gatotkacha.webp": "gatotkaca.webp",
    "glu.webp": "gloo.webp",
    "gossen.webp": "gusion.webp",
    "greyndzher.webp": "granger.webp",
    "grok.webp": "grock.webp",
    "gvinevra.webp": "guinevere.webp",
    "iksborg.webp": "x_borg.webp",
    "iksiya.webp": "ixia.webp",
    "in.webp": "yin.webp",
    "iritel.webp": "irithel.webp",
    "iv.webp": "yve.webp",
    "kayya.webp": "kaja.webp",
    "karmilla.webp": "carmilla.webp",
    "kerri.webp": "karrie.webp",
    "khanabi.webp": "hanabi.webp",
    "khanzo.webp": "hanzo.webp",
    "kharit.webp": "harith.webp",
    "kharli.webp": "harley.webp",
    "khayabusa.webp": "hayabusa.webp",
    "khelkart.webp": "helcurt.webp",
    "khilda.webp": "hilda.webp",
    "khilos.webp": "hylos.webp",
    "khalid.webp": "khaleed.webp",
    "kimmi.webp": "kimmy.webp",
    "klaud.webp": "claude.webp",
    "klint.webp": "clint.webp",
    "ksaver.webp": "xavier.webp",
    "kusaka.webp": "jawhead.webp",
    "lanselot.webp": "lancelot.webp",
    "lesli.webp": "lesley.webp",
    "leyla.webp": "layla.webp",
    "li_sun_sin.webp": "yi_sun_shin.webp",
    "liliya.webp": "lylia.webp",
    "lo_yi.webp": "luo_yi.webp",
    "lyunoks.webp": "lunox.webp",
    "matilda.webp": "mathilda.webp",
    "minotavr.webp": "minotaur.webp",
    "minsittar.webp": "minsitthar.webp",
    "natalya.webp": "natalia.webp",
    "novariya.webp": "novaria.webp",
    "odetta.webp": "odette.webp",
    "pakito.webp": "paquito.webp",
    "popol_i_kupa.webp": "popol_and_kupa.webp",
    "rafael.webp": "rafaela.webp",
    "rodzher.webp": "roger.webp",
    "rubi.webp": "ruby.webp",
    "san.webp": "sun.webp",
    "sesilion.webp": "cecilion.webp",
    "silvana.webp": "silvanna.webp",
    "su_yo.webp": "suyou.webp",
    "tamuz.webp": "thamuz.webp",
    "tigril.webp": "tigreal.webp",
    "tsiklop.webp": "cyclops.webp",
    "tszetyan.webp": "zetian.webp",
    "van_van.webp": "wanwan.webp",
    "veksana.webp": "vexana.webp",
    "veyl.webp": "vale.webp",
    "zask.webp": "zhask.webp"
}

target_dirs = [
    "backend/static/images/hero_base_avatar_icons/",
    "frontend/public/static/images/hero_base_avatar_icons/"
]

def run_rename():
    for d in target_dirs:
        if not os.path.exists(d):
            print(f"Skipping {d} - not found")
            continue
        print(f"Processing {d}...")
        files_in_dir = os.listdir(d)
        for old, new in rename_map.items():
            if old in files_in_dir:
                old_path = os.path.join(d, old)
                new_path = os.path.join(d, new)
                # Если файл с новым именем уже есть, удаляем его перед переименованием (чтобы не было конфликтов)
                if old != new:
                    if os.path.exists(new_path):
                        os.remove(new_path)
                    os.rename(old_path, new_path)
                    print(f"  {old} -> {new}")

if __name__ == "__main__":
    run_rename()
    print("\nDone!")
