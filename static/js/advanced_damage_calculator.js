document.addEventListener('DOMContentLoaded', function () {
    const attackerHeroSelect = document.getElementById('attacker-hero-select');
    const attackerHeroLevel = document.getElementById('attacker-hero-level');
    const attackerLevelDisplay = document.getElementById('attacker-level-display');
    const attackerHeroAvatar = document.getElementById('attacker-hero-avatar');

    const defenderHeroSelect = document.getElementById('defender-hero-select');
    const defenderHeroLevel = document.getElementById('defender-hero-level');
    const defenderLevelDisplay = document.getElementById('defender-level-display');
    const defenderHeroAvatar = document.getElementById('defender-hero-avatar');

    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    const roleTranslation = {
        'Стрелок': 'Marksman',
        'Боец': 'Fighter',
        'Убийца': 'Assassin',
        'Маг': 'Mage',
        'Поддержка': 'Support',
        'Танк': 'Tank'
    };

    // Получаем данные об эмблемах и предметах из HTML (script type=application/json)
    let allEmblems = [];
    let allItems = [];
    try {
        const emblemScript = document.getElementById('emblem-data');
        if (emblemScript) {
            allEmblems = JSON.parse(emblemScript.textContent || '[]');
        }
    } catch (e) {
        console.warn('Failed to parse emblems JSON:', e);
        allEmblems = [];
    }

    try {
        const itemScript = document.getElementById('item-data');
        if (itemScript) {
            allItems = JSON.parse(itemScript.textContent || '[]');
        }
    } catch (e) {
        console.warn('Failed to parse items JSON:', e);
        allItems = [];
    }

    let currentItemSlot = null; // Для отслеживания, какой слот предмета был нажат
    let currentTarget = null; // Для отслеживания, для кого выбирается эмблема/предмет (attacker/defender)
    let selectedAttackerEmblem = null;
    let selectedAttackerItems = [null, null, null, null, null, null];
    let selectedDefenderEmblem = null;
    let selectedDefenderItems = [null, null, null, null, null, null];

    // --- Функции для расчета бонусов --- //
    function calculateEmblemBonuses(emblem) {
        if (!emblem) return {};
        
        const bonuses = {};
        const emblemStats = allEmblems.find(e => e.emblem_id === emblem.emblem_id);
        
        if (emblemStats) {
            // Физическая атака
            if (emblemStats.phys_attack) bonuses.phys_attack = emblemStats.phys_attack;
            if (emblemStats.adaptive_attack) bonuses.adaptive_attack = emblemStats.adaptive_attack;
            
            // Магическая сила
            if (emblemStats.mag_power) bonuses.mag_power = emblemStats.mag_power;
            
            // Защита
            if (emblemStats.phys_def) bonuses.phys_def = emblemStats.phys_def;
            if (emblemStats.mag_def) bonuses.mag_def = emblemStats.mag_def;
            if (emblemStats.hybrid_def) bonuses.hybrid_def = emblemStats.hybrid_def;
            
            // HP
            if (emblemStats.hp) bonuses.hp = emblemStats.hp;
            
            // Проникновение
            if (emblemStats.phys_penetration) bonuses.phys_penetration = emblemStats.phys_penetration;
            if (emblemStats.mag_penetration) bonuses.mag_penetration = emblemStats.mag_penetration;
            if (emblemStats.adaptive_penetration) bonuses.adaptive_penetration = emblemStats.adaptive_penetration;
            
            // Прочие характеристики
            if (emblemStats.move_speed_flat) bonuses.move_speed_flat = emblemStats.move_speed_flat;
            if (emblemStats.cooldown_reduction_fraction) bonuses.cooldown_reduction_fraction = emblemStats.cooldown_reduction_fraction;
            if (emblemStats.attack_speed_fraction) bonuses.attack_speed_fraction = emblemStats.attack_speed_fraction;
        }
        
        return bonuses;
    }

    function calculateItemBonuses(items) {
        const bonuses = {};
        
        items.forEach(item => {
            if (!item) return;
            
            const itemStats = allItems.find(i => i.item_id === item.item_id);
            if (!itemStats) return;
            
            // Физическая атака
            if (itemStats.phys_atk) bonuses.phys_attack = (bonuses.phys_attack || 0) + itemStats.phys_atk;
            if (itemStats.adaptive_attack) bonuses.adaptive_attack = (bonuses.adaptive_attack || 0) + itemStats.adaptive_attack;
            
            // Магическая сила
            if (itemStats.mag_power) bonuses.mag_power = (bonuses.mag_power || 0) + itemStats.mag_power;
            
            // Защита
            if (itemStats.phys_def) bonuses.phys_def = (bonuses.phys_def || 0) + itemStats.phys_def;
            if (itemStats.mag_def) bonuses.mag_def = (bonuses.mag_def || 0) + itemStats.mag_def;
            
            // HP
            if (itemStats.hp) bonuses.hp = (bonuses.hp || 0) + itemStats.hp;
            
            // Проникновение
            if (itemStats.phys_penetration_flat) bonuses.phys_penetration = (bonuses.phys_penetration || 0) + itemStats.phys_penetration_flat;
            if (itemStats.phys_penetration_fraction) bonuses.phys_penetration_fraction = (bonuses.phys_penetration_fraction || 0) + itemStats.phys_penetration_fraction;
            if (itemStats.mag_penetration_flat) bonuses.mag_penetration = (bonuses.mag_penetration || 0) + itemStats.mag_penetration_flat;
            if (itemStats.mag_penetration_fraction) bonuses.mag_penetration_fraction = (bonuses.mag_penetration_fraction || 0) + itemStats.mag_penetration_fraction;
            
            // Прочие характеристики
            if (itemStats.move_speed_flat) bonuses.move_speed_flat = (bonuses.move_speed_flat || 0) + itemStats.move_speed_flat;
            if (itemStats.cooldown_reduction_fraction) bonuses.cooldown_reduction_fraction = (bonuses.cooldown_reduction_fraction || 0) + itemStats.cooldown_reduction_fraction;
            if (itemStats.attack_speed_fraction) bonuses.attack_speed_fraction = (bonuses.attack_speed_fraction || 0) + itemStats.attack_speed_fraction;
        });
        
        return bonuses;
    }

    function calculateTotalBonuses(emblem, items) {
        const emblemBonuses = calculateEmblemBonuses(emblem);
        const itemBonuses = calculateItemBonuses(items);
        
        const totalBonuses = {};
        
        // Объединяем все бонусы
        [...Object.keys(emblemBonuses), ...Object.keys(itemBonuses)].forEach(key => {
            totalBonuses[key] = (emblemBonuses[key] || 0) + (itemBonuses[key] || 0);
        });
        
        return totalBonuses;
    }

    function processAdaptiveStats(bonuses, baseStats) {
        const processed = {...bonuses};
        
        // Обработка адаптивной атаки
        if (processed.adaptive_attack && processed.adaptive_attack > 0) {
            const physBonus = processed.phys_attack || 0;
            const magBonus = processed.mag_power || 0;
            const basePhys = baseStats.phys_attack || 0;
            const baseMag = baseStats.mag_power || 0;
            
            // Сравниваем общие значения (базовые + бонусные)
            if ((basePhys + physBonus) >= (baseMag + magBonus)) {
                processed.phys_attack = (processed.phys_attack || 0) + processed.adaptive_attack;
            } else {
                processed.mag_power = (processed.mag_power || 0) + processed.adaptive_attack;
            }
            delete processed.adaptive_attack;
        }
        
        // Обработка гибридной защиты
        if (processed.hybrid_def && processed.hybrid_def > 0) {
            processed.phys_def = (processed.phys_def || 0) + processed.hybrid_def;
            processed.mag_def = (processed.mag_def || 0) + processed.hybrid_def;
            delete processed.hybrid_def;
        }
        
        // Обработка гибридного вампиризма
        if (processed.hybrid_vamp_fraction && processed.hybrid_vamp_fraction > 0) {
            processed.lifesteal_fraction = (processed.lifesteal_fraction || 0) + processed.hybrid_vamp_fraction;
            processed.spell_vamp_fraction = (processed.spell_vamp_fraction || 0) + processed.hybrid_vamp_fraction;
            delete processed.hybrid_vamp_fraction;
        }
        
        // Обработка адаптивного проникновения
        if (processed.adaptive_penetration && processed.adaptive_penetration > 0) {
            const physPenBonus = processed.phys_penetration || 0;
            const magPenBonus = processed.mag_penetration || 0;
            const basePhysPen = baseStats.phys_penetration || 0;
            const baseMagPen = baseStats.mag_penetration || 0;
            
            // Сравниваем общие значения проникновения
            if ((basePhysPen + physPenBonus) >= (baseMagPen + magPenBonus)) {
                processed.phys_penetration = (processed.phys_penetration || 0) + processed.adaptive_penetration;
            } else {
                processed.mag_penetration = (processed.mag_penetration || 0) + processed.adaptive_penetration;
            }
            delete processed.adaptive_penetration;
        }
        
        return processed;
    }

    function generateBonusDetails(bonuses, emblem, items) {
        const details = [];
        
        // Детализация от эмблемы
        if (emblem) {
            const emblemStats = allEmblems.find(e => e.emblem_id === emblem.emblem_id);
            if (emblemStats) {
                if (emblemStats.phys_attack) details.push(`Эмблема: +${emblemStats.phys_attack} физ. атака`);
                if (emblemStats.mag_power) details.push(`Эмблема: +${emblemStats.mag_power} маг. сила`);
                if (emblemStats.phys_def) details.push(`Эмблема: +${emblemStats.phys_def} физ. защита`);
                if (emblemStats.mag_def) details.push(`Эмблема: +${emblemStats.mag_def} маг. защита`);
                if (emblemStats.adaptive_attack) details.push(`Эмблема: +${emblemStats.adaptive_attack} адапт. атака`);
                if (emblemStats.hybrid_def) details.push(`Эмблема: +${emblemStats.hybrid_def} гибрид. защита`);
                if (emblemStats.phys_penetration) details.push(`Эмблема: +${emblemStats.phys_penetration} физ. проникновение`);
                if (emblemStats.mag_penetration) details.push(`Эмблема: +${emblemStats.mag_penetration} маг. проникновение`);
                if (emblemStats.adaptive_penetration) details.push(`Эмблема: +${emblemStats.adaptive_penetration} адапт. проникновение`);
            }
        }
        
        // Детализация от предметов
        items.forEach((item, index) => {
            if (!item) return;
            const itemStats = allItems.find(i => i.item_id === item.item_id);
            if (!itemStats) return;
            
            const itemName = item.item_name_ru || item.item_name_en || `Предмет ${index + 1}`;
            if (itemStats.phys_atk) details.push(`${itemName}: +${itemStats.phys_atk} физ. атака`);
            if (itemStats.mag_power) details.push(`${itemName}: +${itemStats.mag_power} маг. сила`);
            if (itemStats.phys_def) details.push(`${itemName}: +${itemStats.phys_def} физ. защита`);
            if (itemStats.mag_def) details.push(`${itemName}: +${itemStats.mag_def} маг. защита`);
            if (itemStats.adaptive_attack) details.push(`${itemName}: +${itemStats.adaptive_attack} адапт. атака`);
            if (itemStats.hybrid_def) details.push(`${itemName}: +${itemStats.hybrid_def} гибрид. защита`);
            if (itemStats.phys_penetration_flat) details.push(`${itemName}: +${itemStats.phys_penetration_flat} физ. проникновение`);
            if (itemStats.phys_penetration_fraction) details.push(`${itemName}: +${(itemStats.phys_penetration_fraction * 100).toFixed(1)}% физ. проникновение`);
            if (itemStats.mag_penetration_flat) details.push(`${itemName}: +${itemStats.mag_penetration_flat} маг. проникновение`);
            if (itemStats.mag_penetration_fraction) details.push(`${itemName}: +${(itemStats.mag_penetration_fraction * 100).toFixed(1)}% маг. проникновение`);
        });
        
        return details;
    }

    // --- Вспомогательные функции для изображений --- //
    function getEmblemImagePath(emblemNameEn) {
        // Пример: basic common emblem.png
    if (!emblemNameEn) return '/static/images/emblems/Базовая обычная эмблема.png';
    // Нормализуем: убираем лишние пробелы, но не меняем регистр (файлы на Linux чувствительны к регистру)
    const fileName = emblemNameEn.trim().replace(/\s+/g, ' ');
    const path = `/static/images/emblems/${fileName}.png`;
    return encodeURI(path);
    }

    // helper: try multiple candidate paths for an <img> element
    function setImageWithCandidates(imgElement, candidates, finalFallback) {
        let idx = 0;
        console.debug('setImageWithCandidates: candidates=', candidates, 'finalFallback=', finalFallback);
        function tryNext() {
            if (idx >= candidates.length) {
                console.debug('setImageWithCandidates: no candidates left, using fallback', finalFallback);
                imgElement.src = finalFallback;
                imgElement.onerror = null;
                return;
            }
            const p = candidates[idx];
            console.debug('setImageWithCandidates: trying', p);
            imgElement.src = encodeURI(p);
            idx += 1;
        }
        imgElement.onerror = function() { tryNext(); };
        tryNext();
    }

    function getItemImagePath(itemNameRu) {
        // Пример: Ботинки.png
    if (!itemNameRu) return '/static/images/equipments/Ботинки.png';
    // Normalize: replace multiple spaces with single underscore, preserve Cyrillic and case
    const fileName = itemNameRu.trim().replace(/\s+/g, '_');
    const path = `/static/images/equipments/${fileName}.png`;
    return encodeURI(path);
    }

    // --- Функции для заполнения модальных окон --- //
    function populateEmblemModal() {
        const container = document.getElementById('emblem-list-container');
        container.innerHTML = ''; // Очищаем предыдущие элементы
        // Уберем дубли по emblem_id
        const seen = new Set();
        allEmblems.forEach(emblem => {
            if (!emblem) return;
            if (seen.has(emblem.emblem_id)) return;
            seen.add(emblem.emblem_id);
            const emblemDiv = document.createElement('div');
            emblemDiv.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'align-items-center');
            emblemDiv.dataset.emblemId = emblem.emblem_id;
            emblemDiv.dataset.emblemNameRu = emblem.emblem_name_ru;
            emblemDiv.dataset.emblemNameEn = emblem.emblem_name_en;

            const img = document.createElement('img');
            // Если в БД нет английского имени, пробуем взять русское и привести к англ. имени-формату
            let emblemNameEn = emblem.emblem_name_en;
            if (!emblemNameEn || emblemNameEn === 'null') {
                emblemNameEn = emblem.emblem_name_ru || '';
            }
            // Сформируем упорядоченный список кандидатов: наиболее вероятные в начале
            const emblemCandidatesSet = new Set();
            const ru = emblem.emblem_name_ru || '';
            const en = emblem.emblem_name_en || '';
            // 1) русское имя с исходным регистром
            if (ru) emblemCandidatesSet.add(`/static/images/emblems/${ru}.png`);
            // 2) русское имя lower
            if (ru) emblemCandidatesSet.add(`/static/images/emblems/${ru.trim().toLowerCase()}.png`);
            // 3) русское имя with underscores
            if (ru) emblemCandidatesSet.add(`/static/images/emblems/${ru.trim().replace(/\s+/g, '_')}.png`);
            // 4) english name as-is
            if (en) emblemCandidatesSet.add(`/static/images/emblems/${en}.png`);
            const emblemCandidates = Array.from(emblemCandidatesSet);
            setImageWithCandidates(img, emblemCandidates, '/static/images/emblems/Базовая обычная эмблема.png');
            img.alt = emblem.emblem_name_ru;
            img.classList.add('me-3');
            img.style.width = '40px'; // Уменьшаем размер иконки
            img.style.height = '40px';

            const span = document.createElement('span');
            span.textContent = emblem.emblem_name_ru;

            emblemDiv.appendChild(img);
            emblemDiv.appendChild(span);
            container.appendChild(emblemDiv);
        });
    }

    function populateItemModal() {
        const container = document.getElementById('item-list-container');
        container.innerHTML = ''; // Очищаем предыдущие элементы
        // Уберем дубли по item_id
        const seen = new Set();
        allItems.forEach(item => {
            if (!item) return;
            if (seen.has(item.item_id)) return;
            seen.add(item.item_id);
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'align-items-center');
            itemDiv.dataset.itemId = item.item_id;
            itemDiv.dataset.itemNameRu = item.item_name_ru;

            const img = document.createElement('img');
            const itemCandidatesSet = new Set();
            const ruItem = item.item_name_ru || '';
            const enItem = item.item_name_en || '';
            // Prioritize ru underscore (most files use underscores), then ru exact, then ru lower, then hyphen->underscore, then en
            if (ruItem) itemCandidatesSet.add(`/static/images/equipments/${ruItem.trim().replace(/\s+/g,'_')}.png`);
            if (ruItem) itemCandidatesSet.add(`/static/images/equipments/${ruItem}.png`);
            if (ruItem) itemCandidatesSet.add(`/static/images/equipments/${ruItem.trim().toLowerCase()}.png`);
            // replace hyphens with underscores
            if (ruItem) itemCandidatesSet.add(`/static/images/equipments/${ruItem.trim().replace(/-/g,'_')}.png`);
            if (enItem) itemCandidatesSet.add(`/static/images/equipments/${enItem}.png`);
            const itemCandidates = Array.from(itemCandidatesSet);
            setImageWithCandidates(img, itemCandidates, '/static/images/equipments/Ботинки.png');
            img.alt = item.item_name_ru;
            img.classList.add('me-3');
            img.style.width = '40px'; // Уменьшаем размер иконки
            img.style.height = '40px';

            const span = document.createElement('span');
            span.textContent = item.item_name_ru;

            itemDiv.appendChild(img);
            itemDiv.appendChild(span);
            container.appendChild(itemDiv);
        });
    }

    // --- Обработчики событий --- //
    document.getElementById('emblemSelectionModal').addEventListener('show.bs.modal', populateEmblemModal);
    document.getElementById('itemSelectionModal').addEventListener('show.bs.modal', populateItemModal);

    // Обработчик выбора эмблемы
    document.getElementById('emblem-list-container').addEventListener('click', function(event) {
        const selectedEmblemDiv = event.target.closest('.list-group-item');
        if (selectedEmblemDiv && currentTarget) {
            const emblemId = selectedEmblemDiv.dataset.emblemId;
            const emblemNameEn = selectedEmblemDiv.dataset.emblemNameEn;
            const emblemNameRu = selectedEmblemDiv.dataset.emblemNameRu;
            
            // Обновляем иконку эмблемы в зависимости от цели
            const targetImg = document.getElementById(`${currentTarget}-emblem-icon`);
            const chosenRu = emblemNameRu || '';
            const chosenEn = emblemNameEn || '';
            const targetSet = new Set();
            if (chosenRu) targetSet.add(`/static/images/emblems/${chosenRu}.png`);
            if (chosenRu) targetSet.add(`/static/images/emblems/${chosenRu.trim().replace(/\s+/g,'_')}.png`);
            if (chosenRu) targetSet.add(`/static/images/emblems/${chosenRu.trim().toLowerCase()}.png`);
            if (chosenEn) targetSet.add(`/static/images/emblems/${chosenEn}.png`);
            setImageWithCandidates(targetImg, Array.from(targetSet), '/static/images/emblems/Базовая обычная эмблема.png');
            
            // Сохраняем выбранную эмблему в соответствующее состояние
            const emblemObj = allEmblems.find(e => String(e.emblem_id) === String(emblemId)) || {emblem_name_en: emblemNameEn, emblem_name_ru: emblemNameRu};
            if (currentTarget === 'attacker') {
                selectedAttackerEmblem = emblemObj;
            } else if (currentTarget === 'defender') {
                selectedDefenderEmblem = emblemObj;
            }
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('emblemSelectionModal'));
            modal.hide();
        }
    });

    // Обработчик выбора предмета
    document.getElementById('item-list-container').addEventListener('click', function(event) {
        const selectedItemDiv = event.target.closest('.list-group-item');
        if (selectedItemDiv && currentItemSlot && currentTarget) {
            const itemId = selectedItemDiv.dataset.itemId;
            const itemNameRu = selectedItemDiv.dataset.itemNameRu;
            
            // сохраняем выбор в соответствующее состояние
            const itemObj = allItems.find(i => String(i.item_id) === String(itemId)) || {item_name_ru: itemNameRu};
            if (currentTarget === 'attacker') {
                selectedAttackerItems[currentItemSlot - 1] = itemObj;
                document.getElementById(`attacker-item-${currentItemSlot}-icon`).src = getItemImagePath(itemObj.item_name_ru || itemObj.item_name_en || 'Ботинки');
            } else if (currentTarget === 'defender') {
                selectedDefenderItems[currentItemSlot - 1] = itemObj;
                document.getElementById(`defender-item-${currentItemSlot}-icon`).src = getItemImagePath(itemObj.item_name_ru || itemObj.item_name_en || 'Ботинки');
            }

            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('itemSelectionModal'));
            modal.hide();
        }
    });

    // Обработчик для кнопок выбора предмета (чтобы знать, какой слот был нажат)
    document.querySelectorAll('.item-select-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentItemSlot = this.dataset.slotId;
            currentTarget = this.dataset.target;
        });
    });

    // Обработчик для кнопок выбора эмблемы (чтобы знать, для кого выбирается)
    document.querySelectorAll('[data-bs-target="#emblemSelectionModal"]').forEach(button => {
        button.addEventListener('click', function() {
            currentTarget = this.dataset.target;
        });
    });

    function updateHeroAvatar(selectElement, avatarElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const heroName = selectedOption.value;
        const heroRole = selectedOption.getAttribute('data-role');

        if (heroName) {
            const fallbackRole = roleTranslation[heroRole] || 'Fighter';
            const fallbackUrl = `/static/images/roles/${fallbackRole}.png`;

            // Попробуем несколько вариантов путей к файлу аватара (чтобы учесть регистр и пробелы)
            const candidates = [];
            // 1) точное имя
            candidates.push(`${heroName}.png`);
            // 2) lowercase
            candidates.push(`${heroName.toLowerCase()}.png`);
            // 3) lowercase + collapse spaces
            candidates.push(`${heroName.toLowerCase().trim().replace(/\s+/g, ' ')}.png`);
            // 4) lowercase + underscores
            candidates.push(`${heroName.toLowerCase().trim().replace(/\s+/g, '_')}.png`);

            const avatarCandidates = candidates.map(c => `/static/images/hero_base_avatar_icons/${c}`);
            setImageWithCandidates(avatarElement, avatarCandidates, fallbackUrl);
        } else {
            avatarElement.src = '/static/images/roles/Fighter.png'; // Default placeholder
        }
    }

    attackerHeroLevel.addEventListener('input', function() {
        attackerLevelDisplay.textContent = this.value;
    });

    defenderHeroLevel.addEventListener('input', function() {
        defenderLevelDisplay.textContent = this.value;
    });

    attackerHeroSelect.addEventListener('change', () => updateHeroAvatar(attackerHeroSelect, attackerHeroAvatar));
    defenderHeroSelect.addEventListener('change', () => updateHeroAvatar(defenderHeroSelect, defenderHeroAvatar));


    calculateBtn.addEventListener('click', function () {
        const attackerHero = attackerHeroSelect.value;
        const attackerLevel = attackerHeroLevel.value;
        const defenderHero = defenderHeroSelect.value;
        const defenderLevel = defenderHeroLevel.value;

        if (!attackerHero || !defenderHero) {
            resultsDiv.innerHTML = '<p class="text-danger">Пожалуйста, выберите обоих героев.</p>';
            return;
        }

        const fetchAttacker = fetch(`/api/hero_stats/${attackerHero}/${attackerLevel}`).then(res => res.json());
        const fetchDefender = fetch(`/api/hero_stats/${defenderHero}/${defenderLevel}`).then(res => res.json());

        Promise.all([fetchAttacker, fetchDefender])
            .then(([attackerStats, defenderStats]) => {
                if (attackerStats.error || defenderStats.error) {
                    resultsDiv.innerHTML = `<p class="text-danger">Ошибка: ${attackerStats.error || defenderStats.error}</p>`;
                    return;
                }

                // Рассчитываем бонусы для атакующего
                const attackerRawBonuses = calculateTotalBonuses(selectedAttackerEmblem, selectedAttackerItems);
                const attackerBonuses = processAdaptiveStats(attackerRawBonuses, attackerStats);
                
                // Рассчитываем бонусы для защищающегося
                const defenderRawBonuses = calculateTotalBonuses(selectedDefenderEmblem, selectedDefenderItems);
                const defenderBonuses = processAdaptiveStats(defenderRawBonuses, defenderStats);

                // Итоговые характеристики атакующего (базовые + бонусы)
                const physAttack = (attackerStats.phys_attack || 0) + (attackerBonuses.phys_attack || 0);
                const magAttack = (attackerStats.mag_power || 0) + (attackerBonuses.mag_power || 0);

                // Итоговые характеристики защищающегося (базовые + бонусы)
                const physDef = (defenderStats.phys_def || 0) + (defenderBonuses.phys_def || 0);
                const magDef = (defenderStats.mag_def || 0) + (defenderBonuses.mag_def || 0);

                // Учет проникновения (плоское + процентное)
                const physPenetrationFlat = (attackerBonuses.phys_penetration || 0);
                const physPenetrationFraction = (attackerBonuses.phys_penetration_fraction || 0);
                const magPenetrationFlat = (attackerBonuses.mag_penetration || 0);
                const magPenetrationFraction = (attackerBonuses.mag_penetration_fraction || 0);
                
                // Процентное проникновение применяется к защите цели
                const physPenetration = physPenetrationFlat + (physDef * physPenetrationFraction);
                const magPenetration = magPenetrationFlat + (magDef * magPenetrationFraction);
                
                const effectivePhysDef = Math.max(0, physDef - physPenetration);
                const effectiveMagDef = Math.max(0, magDef - magPenetration);

                // Формулы расчета с учетом проникновения
                const physDamageReduction = effectivePhysDef / (effectivePhysDef + 120);
                const magDamageReduction = effectiveMagDef / (effectiveMagDef + 120);

                const finalPhysDamage = physAttack * (1 - physDamageReduction);
                const finalMagDamage = magAttack * (1 - magDamageReduction);

                // Эффективная скорость атаки и ориентировочный DPS по автоатакам
                const baseAttackSpeed = attackerStats.attack_speed || 0;
                const attackSpeedBonusFraction = attackerBonuses.attack_speed_fraction || 0;
                const effectiveAttackSpeed = baseAttackSpeed * (1 + attackSpeedBonusFraction);
                const physDps = finalPhysDamage * (effectiveAttackSpeed || 0);

                // Подготавливаем строки для отображения характеристик с бонусами
                const attackerPhysBonus = (attackerBonuses.phys_attack || 0);
                const attackerMagBonus = (attackerBonuses.mag_power || 0);
                const defenderPhysBonus = (defenderBonuses.phys_def || 0);
                const defenderMagBonus = (defenderBonuses.mag_def || 0);

                // Генерируем детализацию бонусов
                const attackerBonusDetails = generateBonusDetails(attackerBonuses, selectedAttackerEmblem, selectedAttackerItems);
                const defenderBonusDetails = generateBonusDetails(defenderBonuses, selectedDefenderEmblem, selectedDefenderItems);
                
                const attackerPhysDisplay = attackerPhysBonus > 0 ? 
                    `${Math.round(attackerStats.phys_attack || 0)} + <span class="bonus-detail" data-details="${attackerBonusDetails.filter(d => d.includes('физ. атака') || d.includes('адапт. атака')).join('; ')}" style="color: #28a745; cursor: pointer; text-decoration: underline;">${Math.round(attackerPhysBonus)}</span>` : 
                    `${Math.round(attackerStats.phys_attack || 0)}`;
                
                const attackerMagDisplay = attackerMagBonus > 0 ? 
                    `${Math.round(attackerStats.mag_power || 0)} + <span class="bonus-detail" data-details="${attackerBonusDetails.filter(d => d.includes('маг. сила') || d.includes('адапт. атака')).join('; ')}" style="color: #28a745; cursor: pointer; text-decoration: underline;">${Math.round(attackerMagBonus)}</span>` : 
                    `${Math.round(attackerStats.mag_power || 0)}`;
                
                // Проникновение атакующего
                const attackerPenetrationDisplay = physPenetration > 0 || magPenetration > 0 ? 
                    `Проникновение: ${physPenetration > 0 ? `Физ: ${Math.round(physPenetration)}` : ''}${physPenetration > 0 && magPenetration > 0 ? ', ' : ''}${magPenetration > 0 ? `Маг: ${Math.round(magPenetration)}` : ''}` : 
                    '';
                
                // Для защиты показываем эффективную защиту с учетом проникновения
                const defenderPhysDisplay = defenderPhysBonus > 0 ? 
                    `${Math.round(defenderStats.phys_def || 0)} + <span class="bonus-detail" data-details="${defenderBonusDetails.filter(d => d.includes('физ. защита') || d.includes('гибрид. защита')).join('; ')}" style="color: #28a745; cursor: pointer; text-decoration: underline;">${Math.round(defenderPhysBonus)}</span> (эфф: ${Math.round(effectivePhysDef)})` : 
                    `${Math.round(defenderStats.phys_def || 0)} (эфф: ${Math.round(effectivePhysDef)})`;
                
                const defenderMagDisplay = defenderMagBonus > 0 ? 
                    `${Math.round(defenderStats.mag_def || 0)} + <span class="bonus-detail" data-details="${defenderBonusDetails.filter(d => d.includes('маг. защита') || d.includes('гибрид. защита')).join('; ')}" style="color: #28a745; cursor: pointer; text-decoration: underline;">${Math.round(defenderMagBonus)}</span> (эфф: ${Math.round(effectiveMagDef)})` : 
                    `${Math.round(defenderStats.mag_def || 0)} (эфф: ${Math.round(effectiveMagDef)})`;

                resultsDiv.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Атакующий: ${attackerHero} (Ур. ${attackerLevel})</h6>
                            <ul>
                                <li>Физ. атака: ${attackerPhysDisplay}</li>
                                <li>Маг. сила: ${attackerMagDisplay}</li>
                                <li>Скорость атаки: ${effectiveAttackSpeed ? effectiveAttackSpeed.toFixed(2) : '—'}</li>
                                ${attackerPenetrationDisplay ? `<li>${attackerPenetrationDisplay}</li>` : ''}
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6>Защищающийся: ${defenderHero} (Ур. ${defenderLevel})</h6>
                            <ul>
                                <li>Физ. защита: ${defenderPhysDisplay} (Снижение урона: ${(physDamageReduction * 100).toFixed(1)}%)</li>
                                <li>Маг. защита: ${defenderMagDisplay} (Снижение урона: ${(magDamageReduction * 100).toFixed(1)}%)</li>
                            </ul>
                        </div>
                    </div>
                    <hr>
                    <h5>Итоговый урон:</h5>
                    <ul>
                        <li>Физ урон: <strong>${Math.round(finalPhysDamage)}</strong></li>
                        <li>Маг урон: <strong>${Math.round(finalMagDamage)}</strong></li>
                        <li>DPS (автоатаки, физ): <strong>${Math.round(physDps)}</strong></li>
                    </ul>
                `;
                
                // Добавляем обработчики кликов для детализации бонусов
                resultsDiv.querySelectorAll('.bonus-detail').forEach(element => {
                    element.addEventListener('click', function() {
                        const details = this.getAttribute('data-details');
                        if (details) {
                            alert('Детализация бонусов:\n' + details.replace(/; /g, '\n'));
                        }
                    });
                });
            })
            .catch(error => {
                resultsDiv.innerHTML = `<p class="text-danger">Произошла ошибка при загрузке данных.</p>`;
                console.error('Error fetching hero stats:', error);
            });
    });
});
