c:\Users\REPUBLIC OF GAMERS\Downloads\Telegram Desktop\hero_stats.csv// Глобальные переменные
let heroesData = [];
let originalHeroesData = [];

document.addEventListener('DOMContentLoaded', function() {
    loadHeroData();
    setupEventListeners();
});

function loadHeroData() {
    fetch('/api/heroes')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Ошибка в данных:', data.error);
                return;
            }
            // Преобразуем строковые значения в числа
            data.forEach(hero => {
                hero.hp = parseFloat(hero.hp) || 0;
                hero.growth_hp = parseFloat(hero.growth_hp) || 0;
                hero.regen_hp = parseFloat(hero.regen_hp) || 0;
                hero.growth_regen_hp = parseFloat(hero.growth_regen_hp) || 0;
                hero.resource = hero.resource ? parseFloat(hero.resource) : null;
                hero.growth_resource = hero.growth_resource ? parseFloat(hero.growth_resource) : null;
                hero.regen_resource = hero.regen_resource ? parseFloat(hero.regen_resource) : null;
                hero.growth_regen_resource = hero.growth_regen_resource ? parseFloat(hero.growth_regen_resource) : null;
                hero.phys_attack = parseFloat(hero.phys_attack) || 0;
                hero.growth_phys_attack = parseFloat(hero.growth_phys_attack) || 0;
                hero.phys_def = parseFloat(hero.phys_def) || 0;
                hero.growth_phys_def = parseFloat(hero.growth_phys_def) || 0;
                hero.mag_def = parseFloat(hero.mag_def) || 0;
                hero.growth_mag_def = parseFloat(hero.growth_mag_def) || 0;
                hero.attack_speed = parseFloat(hero.attack_speed) || 0;
                hero.attack_speed_coefficient_percent = parseFloat(hero.attack_speed_coefficient_percent) || 0;
                hero.move_speed = parseFloat(hero.move_speed) || 0;
            });
            console.log('Данные успешно загружены');
            originalHeroesData = JSON.parse(JSON.stringify(data));
            heroesData = data;
            updateDisplay();
        })
        .catch(error => {
            console.error('Ошибка при запросе данных:', error);
        });
}

function setupEventListeners() {
    const roleFilter = document.getElementById('roleFilter');
    const searchFilter = document.getElementById('searchFilter');
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    const heroLevel = document.getElementById('heroLevel');
    const heroLevelValue = document.getElementById('heroLevelValue');

    if (roleFilter) roleFilter.addEventListener('change', updateDisplay);
    if (searchFilter) searchFilter.addEventListener('input', debounce(updateDisplay, 300));
    if (sortBy) sortBy.addEventListener('change', updateDisplay);
    if (sortOrder) sortOrder.addEventListener('change', updateDisplay);
    if (heroLevel) {
        heroLevel.addEventListener('input', function() {
            heroLevelValue.textContent = this.value;
            updateDisplay();
        });
    }
}

// Функция для расчета значения характеристики с учетом роста и уровня
function calculateStatForLevel(base, growth, level) {
    return base + (growth * (level - 1));
}

// Функция для форматирования пути к аватару героя
function formatAvatarPath(heroName) {
    if (!heroName) return null;
    
    // Используем имя героя вместо хранимого пути
    let sanitizedName = heroName.toLowerCase().trim();
    
    // Заменяем случайно попавшие английские буквы на русские
    sanitizedName = sanitizedName
        .replace(/a/g, 'а')
        .replace(/e/g, 'е')
        .replace(/o/g, 'о')
        .replace(/p/g, 'р')
        .replace(/c/g, 'с')
        .replace(/x/g, 'х')
        .replace(/y/g, 'у')
        .replace(/b/g, 'в')
        .replace(/n/g, 'н')
        .replace(/m/g, 'м')
        .replace(/t/g, 'т');
    
    const avatarPath = `images/hero_base_avatar_icons/${sanitizedName}.png`;
    
    return avatarPath;
}

function updateDisplay() {
    if (!window.columnController) {
        console.error('Column controller not found');
        return;
    }

    const roleFilter = document.getElementById('roleFilter');
    const searchFilter = document.getElementById('searchFilter');
    const sortBy = document.getElementById('sortBy');
    const sortOrder = document.getElementById('sortOrder');
    const heroLevel = document.getElementById('heroLevel');
    const tableBody = document.getElementById('heroesTableBody');
    
    if (!tableBody || !roleFilter || !sortBy || !sortOrder || !heroLevel) {
        console.error('Required elements not found');
        return;
    }
    
    const roleValue = roleFilter.value;
    const searchValue = searchFilter ? searchFilter.value.toLowerCase() : '';
    const sortByValue = sortBy.value;
    const sortOrderValue = sortOrder.value;
    const currentLevel = parseInt(heroLevel.value) || 1;
    
    // Фильтрация героев
    let filteredHeroes = [...heroesData];

    // Фильтр по роли (теперь на русском языке)
    if (roleValue !== 'all') {
        filteredHeroes = filteredHeroes.filter(hero => 
            (hero.main_role?.toLowerCase() === roleValue.toLowerCase()) || 
            (hero.extra_role?.toLowerCase() === roleValue.toLowerCase())
        );
    }

    // Поиск по имени героя
    if (searchValue) {
        filteredHeroes = filteredHeroes.filter(hero =>
            hero.hero_name.toLowerCase().includes(searchValue)
        );
    }

    // Сортировка героев с учетом уровня
    filteredHeroes.sort((a, b) => {
        let valA, valB;

        // Обработка разных типов значений для сортировки
        switch(sortByValue) {
            case 'hero_name':
            case 'role':
                valA = (sortByValue === 'role' ? a.main_role : a[sortByValue]) || '';
                valB = (sortByValue === 'role' ? b.main_role : b[sortByValue]) || '';
                return sortOrderValue === 'asc' ? 
                    valA.localeCompare(valB) : 
                    valB.localeCompare(valA);

            case 'hp':
                valA = calculateStatForLevel(a.hp, a.growth_hp, currentLevel);
                valB = calculateStatForLevel(b.hp, b.growth_hp, currentLevel);
                break;

            case 'regen_hp':
                valA = calculateStatForLevel(a.regen_hp, a.growth_regen_hp, currentLevel);
                valB = calculateStatForLevel(b.regen_hp, b.growth_regen_hp, currentLevel);
                break;

            case 'resource':
                valA = a.resource ? calculateStatForLevel(a.resource, a.growth_resource || 0, currentLevel) : 0;
                valB = b.resource ? calculateStatForLevel(b.resource, b.growth_resource || 0, currentLevel) : 0;
                break;

            case 'regen_resource':
                valA = a.regen_resource ? calculateStatForLevel(a.regen_resource, a.growth_regen_resource || 0, currentLevel) : 0;
                valB = b.regen_resource ? calculateStatForLevel(b.regen_resource, b.growth_regen_resource || 0, currentLevel) : 0;
                break;

            case 'phys_attack':
                valA = calculateStatForLevel(a.phys_attack, a.growth_phys_attack, currentLevel);
                valB = calculateStatForLevel(b.phys_attack, b.growth_phys_attack, currentLevel);
                break;

            case 'phys_def':
                valA = calculateStatForLevel(a.phys_def, a.growth_phys_def, currentLevel);
                valB = calculateStatForLevel(b.phys_def, b.growth_phys_def, currentLevel);
                break;

            case 'mag_def':
                valA = calculateStatForLevel(a.mag_def, a.growth_mag_def, currentLevel);
                valB = calculateStatForLevel(b.mag_def, b.growth_mag_def, currentLevel);
                break;

            case 'attack_speed':
            case 'move_speed':
                valA = parseFloat(a[sortByValue]) || 0;
                valB = parseFloat(b[sortByValue]) || 0;
                break;

            default:
                valA = (a[sortByValue] || '').toString().toLowerCase();
                valB = (b[sortByValue] || '').toString().toLowerCase();
                return sortOrderValue === 'asc' ? 
                    valA.localeCompare(valB) : 
                    valB.localeCompare(valA);
        }

        return sortOrderValue === 'asc' ? valA - valB : valB - valA;
    });
    
    // Очистка таблицы
    tableBody.innerHTML = '';
    
    // Обновление таблицы
    filteredHeroes.forEach(hero => {
        const row = document.createElement('tr');
        
        // Расчет значений с учетом уровня
        const currentHp = calculateStatForLevel(hero.hp, hero.growth_hp, currentLevel);
        const currentHpRegen = calculateStatForLevel(hero.regen_hp, hero.growth_regen_hp, currentLevel);
        const currentResource = hero.resource ? calculateStatForLevel(hero.resource, hero.growth_resource || 0, currentLevel) : null;
        const currentResourceRegen = hero.regen_resource ? calculateStatForLevel(hero.regen_resource, hero.growth_regen_resource || 0, currentLevel) : null;
        const currentPhysAtk = calculateStatForLevel(hero.phys_attack, hero.growth_phys_attack, currentLevel);
        const currentPhysDef = calculateStatForLevel(hero.phys_def, hero.growth_phys_def, currentLevel);
        const currentMagDef = calculateStatForLevel(hero.mag_def, hero.growth_mag_def, currentLevel);

        // Формируем HTML для ячейки с именем и аватаром героя
        let heroNameCell = `
            <td class="hero-name-cell">
                <div class="hero-name-with-avatar">`;
                
        if (hero.hero_name) {
            const avatarPath = formatAvatarPath(hero.hero_name);
            heroNameCell += `<img src="/static/${avatarPath}" alt="${hero.hero_name}" class="hero-avatar" onerror="this.onerror=null; this.classList.add('avatar-not-found');">`;
        } else {
            heroNameCell += `<div class="hero-avatar-placeholder" style="width: 32px; height: 32px; background-color: #eee; border-radius: 50%; display: inline-block; margin-right: 8px;"></div>`;
        }
        
        heroNameCell += `
                    <span>${hero.hero_name || ""}</span>
                </div>
            </td>`;

        // Остальной HTML для строки таблицы
        const rowHTML = `
            ${heroNameCell}
            <td class="column-role">${hero.main_role || ""}${hero.extra_role ? ' / ' + hero.extra_role : ""}</td>
            <td class="column-hp">${Math.round(currentHp)} (${hero.growth_hp.toFixed(1)})</td>
            <td class="column-hp_regen">${currentHpRegen.toFixed(1)} (${hero.growth_regen_hp.toFixed(2)})</td>
            <td class="column-mana">${currentResource ? Math.round(currentResource) : 'N/A'} (${hero.growth_resource ? parseFloat(hero.growth_resource).toFixed(1) : 'N/A'})</td>
            <td class="column-mana_regen">${currentResourceRegen ? currentResourceRegen.toFixed(1) : 'N/A'} (${hero.growth_regen_resource ? parseFloat(hero.growth_regen_resource).toFixed(2) : 'N/A'})</td>
            <td class="column-phys_attack">${Math.round(currentPhysAtk)} (${hero.growth_phys_attack.toFixed(1)})</td>
            <td class="column-phys_def">${Math.round(currentPhysDef)} (${hero.growth_phys_def.toFixed(1)})</td>
            <td class="column-mag_def">${Math.round(currentMagDef)} (${hero.growth_mag_def.toFixed(1)})</td>
            <td class="column-attack_speed">${hero.attack_speed.toFixed(3)} (${hero.attack_speed_coefficient_percent.toFixed(1)}%)</td>
            <td class="column-move_speed">${hero.move_speed || "N/A"}</td>
        `;
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
    
    // Принудительное обновление видимости колонок
    window.columnController.updateColumnVisibility();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}