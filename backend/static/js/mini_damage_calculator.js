document.addEventListener('DOMContentLoaded', function() {
    const optionsContainer = document.getElementById('optionsContainer');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsList = document.getElementById('resultsList');
    const targetDefenseInput = document.getElementById('targetDefense');
    const baseDamageReductionDisplay = document.getElementById('baseDamageReductionDisplay');

    // Обработчики для полей цели
    const targetInputs = [
        'targetDefense',
        'adaptiveDefenseReductionFlat',
        'adaptiveDefenseReductionPercent',
        'additionalTargetDamageReductionPercent'
    ];

    targetInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
                if (this.hasAttribute('max') && this.value > parseInt(this.getAttribute('max'))) {
                    this.value = this.getAttribute('max');
                }
                updateBaseDamageReduction();
            });
        }
    });

    // Обновление отображения базового снижения урона
    function updateBaseDamageReduction() {
        const defense = parseFloat(targetDefenseInput.value) || 0;
        const reduction = (defense / (defense + 120)) * 100;
        baseDamageReductionDisplay.textContent = reduction.toFixed(1) + '%';
    }

    // Создание нового варианта
    function createOption() {
        const optionBlock = document.createElement('div');
        optionBlock.className = 'option-block';
        
        const header = document.createElement('div');
        header.className = 'option-header';
        
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'option-title-input';
        titleInput.value = `Вариант ${optionsContainer.children.length + 1}`;
        titleInput.placeholder = 'Название варианта';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
        removeBtn.onclick = () => optionBlock.remove();
        
        header.appendChild(titleInput);
        header.appendChild(removeBtn);
        
        const content = document.createElement('div');
        content.className = 'mt-3';
        content.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Адаптивная атака:</label>
                <input type="number" class="form-control damage-input" value="0" min="0">
                <div class="form-text">Базовое значение урона до применения модификаторов</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Бонус урона (%):</label>
                <input type="number" class="form-control multiplier-input" value="0" min="0">
                <div class="form-text">Дополнительное процентное усиление урона</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Проникновение (фиксированное):</label>
                <input type="number" class="form-control def-pen-flat-input" value="0" min="0">
                <div class="form-text">Фиксированное значение проникновения защиты</div>
            </div>
            <div class="mb-3">
                <label class="form-label">Проникновение (%):</label>
                <input type="number" class="form-control def-pen-percent-input" value="0" min="0" max="100">
                <div class="form-text">Процентное значение проникновения защиты</div>
            </div>
        `;
        
        optionBlock.appendChild(header);
        optionBlock.appendChild(content);
        
        return optionBlock;
    }

    // Добавление варианта по кнопке
    addOptionBtn.onclick = function() {
        optionsContainer.appendChild(createOption());
    };

    // Расчёт урона
    calculateBtn.onclick = function() {
        const options = optionsContainer.children;
        if (options.length === 0) {
            alert('Добавьте хотя бы один вариант для расчёта');
            return;
        }

        const results = [];
        const targetDefense = parseFloat(targetDefenseInput.value) || 0;
        const adaptiveDefRedFlat = parseFloat(document.getElementById('adaptiveDefenseReductionFlat').value) || 0;
        const adaptiveDefRedPercent = parseFloat(document.getElementById('adaptiveDefenseReductionPercent').value) || 0;
        const additionalDamageReduction = parseFloat(document.getElementById('additionalTargetDamageReductionPercent').value) || 0;

        // Сбор данных и расчёт для каждого варианта
        Array.from(options).forEach(option => {
            const title = option.querySelector('.option-title-input').value;
            const damage = parseFloat(option.querySelector('.damage-input').value) || 0;
            const multiplier = parseFloat(option.querySelector('.multiplier-input').value) || 0;
            const defPenFlat = parseFloat(option.querySelector('.def-pen-flat-input').value) || 0;
            const defPenPercent = parseFloat(option.querySelector('.def-pen-percent-input').value) || 0;

            // Расчёт итоговой защиты
            let finalDefense = targetDefense;
            
            // Применение адаптивного снижения защиты
            finalDefense = Math.max(0, finalDefense - adaptiveDefRedFlat);
            finalDefense *= (100 - adaptiveDefRedPercent) / 100;
            
            // Применение проникновения защиты
            finalDefense = Math.max(0, finalDefense - defPenFlat);
            finalDefense *= (100 - defPenPercent) / 100;

            // Расчёт снижения урона от защиты
            const defenseReduction = finalDefense / (finalDefense + 120);
            
            // Расчёт итогового урона
            let finalDamage = damage * (1 + multiplier / 100);
            finalDamage *= (1 - defenseReduction);
            finalDamage *= (1 - additionalDamageReduction / 100);

            results.push({
                title,
                damage: Math.round(finalDamage)
            });
        });

        // Сортировка результатов по убыванию урона
        results.sort((a, b) => b.damage - a.damage);

        // Отображение результатов
        resultsList.innerHTML = '';
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            
            resultElement.innerHTML = `
                <div class="result-title">${result.title}</div>
                <div class="damage-value">${result.damage}</div>
            `;
            
            resultsList.appendChild(resultElement);
        });

        resultsContainer.classList.remove('d-none');
    };

    // Добавляем первый вариант при загрузке страницы
    if (optionsContainer.children.length === 0) {
        optionsContainer.appendChild(createOption());
    }
});