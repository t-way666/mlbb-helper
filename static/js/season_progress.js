document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('seasonProgressForm');
    const resultsDiv = document.getElementById('results');

    // Конфигурация рангов и их уровней
    const rankConfig = {
        'Warrior': { starsPerLevel: 3, totalStars: 9 },
        'Elite': { starsPerLevel: 4, totalStars: 12 },
        'Master': { starsPerLevel: 4, totalStars: 16 },
        'Grandmaster': { starsPerLevel: 5, totalStars: 25 },
        'Epic': { starsPerLevel: 5, totalStars: 25 },
        'Legend': { starsPerLevel: 5, totalStars: 25 },
        'Mythic': { starsPerLevel: Infinity, totalStars: Infinity }
    };

    // Порядок рангов для определения прогресса
    const rankOrder = [
        'Warrior III', 'Warrior II', 'Warrior I',
        'Elite III', 'Elite II', 'Elite I',
        'Master IV', 'Master III', 'Master II', 'Master I',
        'Grandmaster V', 'Grandmaster IV', 'Grandmaster III', 'Grandmaster II', 'Grandmaster I',
        'Epic V', 'Epic IV', 'Epic III', 'Epic II', 'Epic I',
        'Legend V', 'Legend IV', 'Legend III', 'Legend II', 'Legend I',
        'Mythic'
    ];

    // Функция для получения базового ранга (без уровня)
    function getBaseRank(fullRank) {
        return fullRank.split(' ')[0];
    }

    // Функция для получения уровня ранга
    function getRankLevel(fullRank) {
        if (fullRank === 'Mythic') return 1;
        const level = fullRank.split(' ')[1];
        // Преобразуем римские цифры в арабские
        const romanToArabic = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5 };
        return romanToArabic[level] || 1;
    }

    // Расчет количества звезд между рангами
    function calculateStarDifference(fromRank, fromStars, toRank, toStars) {
        let totalStars = 0;
        const fromIndex = rankOrder.indexOf(fromRank);
        const toIndex = rankOrder.indexOf(toRank);

        if (fromIndex === toIndex) {
            return toStars - fromStars;
        }

        // Звезды до конца текущего уровня
        const fromBaseRank = getBaseRank(fromRank);
        totalStars += rankConfig[fromBaseRank].starsPerLevel - fromStars;

        // Проходим по всем промежуточным рангам
        for (let i = fromIndex + 1; i < toIndex; i++) {
            const currentRank = getBaseRank(rankOrder[i]);
            totalStars += rankConfig[currentRank].starsPerLevel;
        }

        // Добавляем звезды в целевом ранге
        totalStars += toStars;

        return totalStars;
    }

    function formatTimeRange(minMinutes, maxMinutes) {
        function formatTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return hours > 0 ? `${hours} ч ${mins} мин` : `${mins} мин`;
        }
        
        return `${formatTime(minMinutes)} - ${formatTime(maxMinutes)}`;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = {
            startRank: document.getElementById('startRank').value,
            startStars: parseInt(document.getElementById('startStars').value),
            currentRank: document.getElementById('currentRank').value,
            currentStars: parseInt(document.getElementById('currentStars').value),
            targetRank: document.getElementById('targetRank').value,
            targetStars: parseInt(document.getElementById('targetStars').value),
            currentWinrate: parseFloat(document.getElementById('currentWinrate').value),
            gamesPlayed: parseInt(document.getElementById('gamesPlayed').value)
        };

        // Проверка валидности звезд для каждого ранга
        function validateStars(rank, stars) {
            const baseRank = getBaseRank(rank);
            if (baseRank === 'Mythic') return true;
            return stars <= rankConfig[baseRank].starsPerLevel;
        }

        // Валидация введенных данных
        if (!validateStars(data.startRank, data.startStars) ||
            !validateStars(data.currentRank, data.currentStars) ||
            !validateStars(data.targetRank, data.targetStars)) {
            alert('Количество звезд превышает максимально допустимое для выбранного ранга');
            return;
        }

        // Расчет необходимых звезд
        const starsNeeded = calculateStarDifference(
            data.currentRank, data.currentStars,
            data.targetRank, data.targetStars
        );

        // Расчет прогресса с начала сезона
        const progressStars = calculateStarDifference(
            data.startRank, data.startStars,
            data.currentRank, data.currentStars
        );

        // Расчет необходимых побед с учетом винрейта
        const expectedWinrate = data.currentWinrate / 100;
        const gamesNeeded = Math.ceil(starsNeeded / (2 * expectedWinrate - 1));
        
        // Расчет времени
        const minTimePerGame = 6; // минимальное время игры в минутах
        const maxTimePerGame = 25; // максимальное время игры в минутах
        const totalMinTime = gamesNeeded * minTimePerGame;
        const totalMaxTime = gamesNeeded * maxTimePerGame;

        // Форматирование результатов
        resultsDiv.innerHTML = `
            <div class="results-container">
                <div class="result-section">
                    <div class="section-title">Текущий прогресс</div>
                    <div class="result-item">
                        Получено звезд с начала сезона: ${progressStars}
                    </div>
                    <div class="result-item">Текущий винрейт: ${data.currentWinrate}%</div>
                    <div class="result-item">Сыграно матчей: ${data.gamesPlayed}</div>
                </div>

                <div class="result-section">
                    <div class="section-title">До цели осталось</div>
                    <div class="result-item">Необходимо звезд: ${starsNeeded}</div>
                    <div class="result-item">Примерное количество игр: ${gamesNeeded}</div>
                    <div class="result-item">
                        Расчетное время: ${formatTimeRange(totalMinTime, totalMaxTime)}
                    </div>
                </div>

                <div class="result-section">
                    <div class="section-title">Рекомендации</div>
                    <div class="recommendation-item">
                        <i class="bi bi-clock"></i>
                        В среднем вам нужно играть ${Math.ceil(gamesNeeded / 30)} игр в день, чтобы достичь цели за месяц
                    </div>
                    <div class="recommendation-item">
                        <i class="bi bi-calendar-check"></i>
                        При текущем винрейте ${data.currentWinrate}%, вам потребуется победить в ${Math.ceil(gamesNeeded * expectedWinrate)} играх
                    </div>
                </div>
            </div>
        `;

        resultsDiv.style.display = 'block';
    });
});