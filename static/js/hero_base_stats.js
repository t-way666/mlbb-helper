
// Глобальные переменные для хранения данных о героях
let heroesData = [];
let originalHeroesData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, были ли данные переданы из шаблона
    if (typeof allHeroesData !== 'undefined') {
        // Данные уже загружены, просто инициализируем их
        initializeHeroData(allHeroesData);
        setupEventListeners();
        updateDisplay(); // Первый рендер таблицы
    } else {
        console.error('Данные о героях (allHeroesData) не найдены. Убедитесь, что они корректно передаются из шаблона Flask.');
    }
});

function initializeHeroData(data) {
    // Преобразуем строковые значения в числа для корректной сортировки и расчетов
    data.forEach(hero => {
        for (const key in hero) {
            if (typeof hero[key] === 'string' && !isNaN(parseFloat(hero[key])) && key !== 'hero_name') {
                hero[key] = parseFloat(hero[key]);
            }
        }
    });
    
    console.log('Данные успешно инициализированы из шаблона.');
    originalHeroesData = JSON.parse(JSON.stringify(data)); // Глубокая копия для сброса фильтров
    heroesData = data;
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
            if(heroLevelValue) heroLevelValue.textContent = this.value;
            // Используем debounce, чтобы не перерисовывать таблицу на каждое движение мыши
            debounce(updateDisplay, 200)();
        });
    }
}

function calculateStatForLevel(base, growth, level) {
    // Убедимся, что значения являются числами
    const numBase = parseFloat(base) || 0;
    const numGrowth = parseFloat(growth) || 0;
    const numLevel = parseInt(level, 10) || 1;
    return numBase + (numGrowth * (numLevel - 1));
}

function formatAvatarPath(heroName) {
    if (!heroName) return '';
    let sanitizedName = heroName.toLowerCase().trim();
    const replacements = {
        'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с',
        'x': 'х', 'y': 'у', 'b': 'в', 'n': 'н', 'm': 'м', 't': 'т'
    };
    for (const [en, ru] of Object.entries(replacements)) {
        sanitizedName = sanitizedName.replace(new RegExp(en, 'g'), ru);
    }
    return `images/hero_base_avatar_icons/${sanitizedName}.png`;
}

function updateDisplay() {
    if (!window.columnController) {
        console.warn('Column controller not found yet — продолжим рендер таблицы, колонками управим позже.');
        // не возвращаемся — дадим рендеру выполниться, затем, если контроллер появится, обновим видимость колонок
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
    const currentLevel = parseInt(heroLevel.value, 10) || 1;
    
    let filteredHeroes = [...originalHeroesData]; // Начинаем с исходных данных

    if (roleValue !== 'all') {
        filteredHeroes = filteredHeroes.filter(hero => 
            (hero.main_role?.toLowerCase() === roleValue.toLowerCase()) || 
            (hero.extra_role?.toLowerCase() === roleValue.toLowerCase())
        );
    }

    if (searchValue) {
        filteredHeroes = filteredHeroes.filter(hero =>
            hero.hero_name.toLowerCase().includes(searchValue)
        );
    }

    filteredHeroes.sort((a, b) => {
        let valA, valB;
        const statA = calculateStatForLevel(a[sortByValue] || 0, a[`growth_${sortByValue}`] || 0, currentLevel);
        const statB = calculateStatForLevel(b[sortByValue] || 0, b[`growth_${sortByValue}`] || 0, currentLevel);

        switch(sortByValue) {
            case 'hero_name':
            case 'role':
                valA = (sortByValue === 'role' ? a.main_role : a[sortByValue]) || '';
                valB = (sortByValue === 'role' ? b.main_role : b[sortByValue]) || '';
                return sortOrderValue === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            default:
                valA = statA;
                valB = statB;
                break;
        }
        return sortOrderValue === 'asc' ? valA - valB : valB - valA;
    });
    
    tableBody.innerHTML = '';
    
    filteredHeroes.forEach(hero => {
        const row = document.createElement('tr');
        
        const currentStats = {};
        for (const key in hero) {
            if (key.startsWith('growth_')) continue;
            const growthKey = `growth_${key}`;
            currentStats[key] = calculateStatForLevel(hero[key], hero[growthKey], currentLevel);
        }

        const avatarPath = formatAvatarPath(hero.hero_name);
        const heroNameCell = `
            <td class="hero-name-cell">
                <div class="hero-name-with-avatar">
                    <img src="/static/${avatarPath}" alt="${hero.hero_name}" class="hero-avatar" onerror="this.onerror=null; this.classList.add('avatar-not-found');">
                    <span>${hero.hero_name || ""}</span>
                </div>
            </td>`;

        const rowHTML = `
            ${heroNameCell}
            <td class="column-role">${hero.main_role || ""}${hero.extra_role ? ' / ' + hero.extra_role : ""}</td>
            <td class="column-hp">${Math.round(currentStats.hp)} (${(hero.growth_hp || 0).toFixed(1)})</td>
            <td class="column-hp_regen">${currentStats.regen_hp.toFixed(1)} (${(hero.growth_regen_hp || 0).toFixed(2)})</td>
            <td class="column-mana">${hero.resource ? Math.round(currentStats.resource) : 'N/A'} (${hero.growth_resource ? (hero.growth_resource || 0).toFixed(1) : 'N/A'})</td>
            <td class="column-mana_regen">${hero.regen_resource ? currentStats.regen_resource.toFixed(1) : 'N/A'} (${hero.growth_regen_resource ? (hero.growth_regen_resource || 0).toFixed(2) : 'N/A'})</td>
            <td class="column-phys_attack">${Math.round(currentStats.phys_attack)} (${(hero.growth_phys_attack || 0).toFixed(1)})</td>
            <td class="column-phys_def">${Math.round(currentStats.phys_def)} (${(hero.growth_phys_def || 0).toFixed(1)})</td>
            <td class="column-mag_def">${Math.round(currentStats.mag_def)} (${(hero.growth_mag_def || 0).toFixed(1)})</td>
            <td class="column-attack_speed">${(hero.attack_speed || 0).toFixed(3)} (${((hero.attack_speed_coefficient_fraction || 0) * 100).toFixed(1)}%)</td>
            <td class="column-move_speed">${hero.move_speed || "N/A"}</td>
        `;
        row.innerHTML = rowHTML;
        tableBody.appendChild(row);
    });
    
    if (window.columnController && typeof window.columnController.updateColumnVisibility === 'function') {
        window.columnController.updateColumnVisibility();
    } else {
        // если контроллер появится позже, он сам при инициализации применит видимость
    }
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
