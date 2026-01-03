document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('winrateForm');
    const resultsDiv = document.getElementById('results');
    
    // HTML шаблон для результатов
    const resultsTemplate = `
        <h3 class="text-center mb-4">Результаты расчета</h3>
        <div class="results-container">
            <div class="stats-grid">
                <div class="stat-item">
                    <h4 class="section-title">Текущая статистика</h4>
                    <p>Винрейт: <span id="currentWinrateResult">0</span>%</p>
                    <p>Матчей сыграно: <span id="matchesPlayedResult">0</span></p>
                </div>
                <div class="stat-item">
                    <h4 class="section-title">Необходимо сыграть</h4>
                    <p>Количество матчей: <span id="requiredMatches">0</span></p>
                    <p>С винрейтом: <span id="expectedWinrateResult">0</span>%</p>
                </div>
                <div class="stat-item">
                    <h4 class="section-title">Итоговый результат</h4>
                    <p>Желаемый винрейт: <span id="desiredWinrateResult">0</span>%</p>
                    <p>Всего матчей будет: <span id="totalMatches">0</span></p>
                </div>
            </div>
        </div>
    `;

    function calculateAdditionalMatches(currentWinrate, playedMatches, expectedWinrate, desiredWinrate) {
        // Валидация входных данных
        if (currentWinrate < 0 || currentWinrate > 100) {
            throw new Error('Текущий винрейт должен быть между 0 и 100');
        }
        if (expectedWinrate < 0 || expectedWinrate > 100) {
            throw new Error('Ожидаемый винрейт должен быть между 0 и 100');
        }
        if (desiredWinrate < 0 || desiredWinrate > 100) {
            throw new Error('Желаемый винрейт должен быть между 0 и 100');
        }
        if (playedMatches < 1) {
            throw new Error('Количество сыгранных матчей должно быть больше 0');
        }

        // Если желаемый винрейт ниже текущего
        if (desiredWinrate < currentWinrate) {
            throw new Error('Желаемый винрейт ниже текущего - просто продолжайте играть');
        }

        // Если желаемый винрейт выше ожидаемого
        if (desiredWinrate > expectedWinrate) {
            throw new Error('Невозможно достичь желаемого винрейта с текущей эффективностью игры');
        }

        const currentWins = Math.floor((currentWinrate / 100) * playedMatches);
        
        // Оптимизированная формула расчета необходимых матчей
        const requiredWinrate = desiredWinrate / 100;
        const expectedWinrateDec = expectedWinrate / 100;
        
        // Используем формулу: (Требуемые победы - Текущие победы) / (Ожидаемый винрейт - Требуемый винрейт)
        const additionalMatches = Math.ceil(
            (requiredWinrate * playedMatches - currentWins) / 
            (expectedWinrateDec - requiredWinrate)
        );

        return Math.max(0, additionalMatches);
    }

    function updateResults(currentWr, matches, expectedWr, desiredWr, requiredMatches) {
        // Убеждаемся, что структура результатов существует
        if (resultsDiv.innerHTML.trim() === '') {
            resultsDiv.innerHTML = resultsTemplate;
        }

        const resultElements = {
            currentWinrate: document.getElementById('currentWinrateResult'),
            matchesPlayed: document.getElementById('matchesPlayedResult'),
            expectedWinrate: document.getElementById('expectedWinrateResult'),
            desiredWinrate: document.getElementById('desiredWinrateResult'),
            requiredMatches: document.getElementById('requiredMatches'),
            totalMatches: document.getElementById('totalMatches')
        };

        // Проверяем наличие всех элементов
        const missingElements = Object.entries(resultElements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Отсутствуют элементы:', missingElements);
            showError('Ошибка обновления результатов: некоторые элементы не найдены');
            return;
        }

        try {
            // Обновляем значения
            resultElements.currentWinrate.textContent = currentWr;
            resultElements.matchesPlayed.textContent = matches;
            resultElements.expectedWinrate.textContent = expectedWr;
            resultElements.desiredWinrate.textContent = desiredWr;
            resultElements.requiredMatches.textContent = requiredMatches;
            resultElements.totalMatches.textContent = parseInt(matches) + parseInt(requiredMatches);

            // Показываем результаты
            resultsDiv.style.display = 'block';
            requestAnimationFrame(() => {
                resultsDiv.classList.add('show');
            });
        } catch (error) {
            console.error('Ошибка при обновлении результатов:', error);
            showError('Произошла ошибка при обновлении результатов');
        }
    }

    function showError(message) {
        if (!resultsDiv) {
            console.error('Элемент результатов не найден');
            return;
        }

        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Очищаем только сообщения об ошибках
        const existingAlerts = resultsDiv.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Добавляем новое сообщение об ошибке
        resultsDiv.appendChild(alert);
        resultsDiv.style.display = 'block';
    }

    function clearResults() {
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.classList.remove('show');
            // Восстанавливаем структуру результатов
            resultsDiv.innerHTML = resultsTemplate;
        }
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Очищаем предыдущие результаты
            clearResults();
            
            try {
                const currentWinrate = parseFloat(document.getElementById('currentWinrate').value) || 0;
                const matchesPlayed = parseInt(document.getElementById('matchesPlayed').value) || 0;
                const expectedWinrate = parseFloat(document.getElementById('expectedWinrate').value) || 0;
                const desiredWinrate = parseFloat(document.getElementById('desiredWinrate').value) || 0;

                const additionalMatches = calculateAdditionalMatches(
                    currentWinrate,
                    matchesPlayed,
                    expectedWinrate,
                    desiredWinrate
                );

                updateResults(
                    currentWinrate.toFixed(2),
                    matchesPlayed,
                    expectedWinrate.toFixed(2),
                    desiredWinrate.toFixed(2),
                    additionalMatches
                );
            } catch (error) {
                showError(error.message);
            }
        });
    } else {
        console.error('Форма калькулятора не найдена');
    }
});