// Функция для расчета урона
function calculateDamage() {
    const baseDamageInput = document.getElementById('base_damage');
    const armorInput = document.getElementById('armor');
    const finalDamageOutput = document.getElementById('final_damage');
    
    if (!baseDamageInput || !armorInput || !finalDamageOutput) {
        console.error('Элементы для расчета урона не найдены');
        return;
    }
    
    const baseDamage = parseFloat(baseDamageInput.value) || 0;
    const armor = parseFloat(armorInput.value) || 0;
    
    let finalDamage;
    if (armor >= 0) {
        finalDamage = baseDamage * (120 / (120 + armor));
    } else {
        finalDamage = baseDamage * (2 - (120 / (120 + Math.abs(armor))));
    }
    
    finalDamageOutput.textContent = Math.round(finalDamage);
}

// Функция для расчета защиты
function calculateDefenseValues() {
    const desiredReductionInput = document.getElementById('desired_reduction');
    const currentDefenseInput = document.getElementById('current_defense');
    const requiredDefenseOutput = document.getElementById('required_defense');
    const damageReductionOutput = document.getElementById('damage_reduction');
    
    if (!desiredReductionInput || !currentDefenseInput || 
        !requiredDefenseOutput || !damageReductionOutput) {
        console.error('Элементы для расчета защиты не найдены');
        return;
    }
    
    // Расчет снижения урона по текущей защите
    const defense = parseFloat(currentDefenseInput.value) || 0;
    let reduction;
    
    if (defense >= 0) {
        const multiplier = 120 / (120 + defense);
        reduction = (1 - multiplier) * 100;
    } else {
        const multiplier = 2 - (120 / (120 + Math.abs(defense)));
        reduction = (1 - multiplier) * 100;
    }
    
    damageReductionOutput.textContent = reduction.toFixed(2);

    // Расчет необходимой защиты
    const desiredReduction = parseFloat(desiredReductionInput.value) || 0;
    if (desiredReduction >= 100) {
        requiredDefenseOutput.textContent = '∞';
        return;
    }
    const requiredDefense = (120 * desiredReduction) / (100 - desiredReduction);
    requiredDefenseOutput.textContent = Math.round(requiredDefense);
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing defense calculator...');
    
    const desiredReductionInput = document.getElementById('desired_reduction');
    const currentDefenseInput = document.getElementById('current_defense');
    const baseDamageInput = document.getElementById('base_damage');
    const armorInput = document.getElementById('armor');
    
    // Проверка наличия всех элементов
    if (!desiredReductionInput || !currentDefenseInput || !baseDamageInput || !armorInput) {
        console.error('Не удалось найти все необходимые элементы HTML на странице!');
        return;
    }
    
    // Инициализация начальных значений
    calculateDefenseValues();
    calculateDamage();
    
    // Добавление обработчиков событий
    desiredReductionInput.addEventListener('input', calculateDefenseValues);
    currentDefenseInput.addEventListener('input', calculateDefenseValues);
    baseDamageInput.addEventListener('input', calculateDamage);
    armorInput.addEventListener('input', calculateDamage);
    
    console.log('Defense calculator initialized successfully');
});