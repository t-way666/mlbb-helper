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

    function updateHeroAvatar(selectElement, avatarElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const heroName = selectedOption.value;
        const heroRole = selectedOption.getAttribute('data-role');

        if (heroName) {
            const avatarUrl = `/static/images/hero_base_avatar_icons/${heroName.toLowerCase()}.png`;
            const fallbackRole = roleTranslation[heroRole] || 'Fighter';
            const fallbackUrl = `/static/images/roles/${fallbackRole}.png`;

            avatarElement.src = avatarUrl;
            avatarElement.onerror = function() {
                this.src = fallbackUrl;
                this.onerror = null; // Prevent infinite loop if fallback also fails
            };
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

                // Характеристики атакующего
                const physAttack = attackerStats.phys_attack || 0;
                const magAttack = attackerStats.mag_power || 0;

                // Характеристики защищающегося
                const physDef = defenderStats.phys_def || 0;
                const magDef = defenderStats.mag_def || 0;

                // Формулы расчета
                const physDamageReduction = physDef / (physDef + 120);
                const magDamageReduction = magDef / (magDef + 120);

                const finalPhysDamage = physAttack * (1 - physDamageReduction);
                const finalMagDamage = magAttack * (1 - magDamageReduction);

                resultsDiv.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Атакующий: ${attackerHero} (Ур. ${attackerLevel})</h6>
                            <ul>
                                <li>Физ. атака: ${Math.round(physAttack)}</li>
                                <li>Маг. сила: ${Math.round(magAttack)}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6>Защищающийся: ${defenderHero} (Ур. ${defenderLevel})</h6>
                            <ul>
                                <li>Физ. защита: ${Math.round(physDef)} (Снижение: ${(physDamageReduction * 100).toFixed(1)}%)</li>
                                <li>Маг. защита: ${Math.round(magDef)} (Снижение: ${(magDamageReduction * 100).toFixed(1)}%)</li>
                            </ul>
                        </div>
                    </div>
                    <hr>
                    <h5>Итоговый урон (без учета проникновения и других модификаторов):</h5>
                    <ul>
                        <li>Урон от базовой физ. атаки: <strong>${Math.round(finalPhysDamage)}</strong></li>
                        <li>Урон от базовой маг. силы: <strong>${Math.round(finalMagDamage)}</strong></li>
                    </ul>
                `;
            })
            .catch(error => {
                resultsDiv.innerHTML = `<p class="text-danger">Произошла ошибка при загрузке данных.</p>`;
                console.error('Error fetching hero stats:', error);
            });
    });
});
