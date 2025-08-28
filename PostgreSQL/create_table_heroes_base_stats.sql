CREATE TABLE heroes_base_stats (
    id SERIAL PRIMARY KEY, -- Уникальный идентификатор героя, автоматически увеличивается
    hero_name VARCHAR(255) NOT NULL, -- Имя героя, обязательное поле (для простоты на текущем этапе)
    main_role VARCHAR(50), -- Основная роль (например, Fighter, Mage), может быть пустым
    extra_role VARCHAR(50), -- Дополнительная роль (например, Tank, Assasin), может быть пустым

    -- Базовые характеристики и рост
    hp INTEGER, -- Базовое здоровье
    growth_hp DECIMAL, -- Прирост здоровья за уровень
    regen_hp DECIMAL, -- Базовая регенерация здоровья
    growth_regen_hp DECIMAL, -- Прирост регенерации здоровья за уровень

    resource_type VARCHAR(50), -- 'Mana', 'Energy' или NULL
    resource INTEGER, -- Базовый запас ресурса
    growth_resource DECIMAL, -- Прирост ресурса за уровень (мана/энергия)
    regen_resource DECIMAL, -- Базовая регенерация ресурса
    growth_regen_resource DECIMAL, -- Прирост регенерации ресурса за уровень

    phys_attack INTEGER, -- Базовая физическая атака
    growth_phys_attack DECIMAL, -- Прирост физической атаки за уровень

    phys_def INTEGER, -- Базовая физическая защита
    growth_phys_def DECIMAL, -- Прирост физической защиты за уровень

    mag_def INTEGER, -- Базовая магическая защита
    growth_mag_def DECIMAL, -- Прирост магической защиты за уровень

    attack_speed DECIMAL, -- Базовая скорость атаки (вероятно, как множитель или число атак в сек)
    growth_attack_speed DECIMAL, -- Прирост скорости атаки за уровень
	
	attack_speed_coefficient_percent DECIMAL, -- Коэффициент скорости атаки в процентах (например, 100)
    mag_power DECIMAL, -- Базовая магическая сила (хотя обычно зависит от предметов, может быть базовый бонус?)
    
    move_speed INTEGER, -- Скорость передвижения

    min_basic_attack_range DECIMAL, -- Минимальная дальность базовой атаки
    max_basic_attack_range DECIMAL, -- Максимальная дальность базовой атаки

    -- Дополнительные характеристики
    crit_chance_percent DECIMAL, -- Шанс критического удара (%)
    crit_damage_percent DECIMAL, -- Множитель критического урона (%)
    cd_reduction_percent DECIMAL, -- Снижение времени перезарядки (%)

    phys_penetration DECIMAL, -- Плоское физическое пробивание
    phys_penetration_percent DECIMAL, -- Процентное физическое пробивание (%)

    mag_penetration DECIMAL, -- Плоское магическое пробивание
    mag_penetration_percent DECIMAL, -- Процентное магическое пробивание (%)

    lifesteal_percent DECIMAL, -- Вампиризм (%)
    spell_vamp_percent DECIMAL, -- Магический вампиризм (%)

    resilience_percent DECIMAL, -- Стойкость/сопротивление контролю (обычно %, но сделаем DECIMAL)
    crit_damage_reduction_percent DECIMAL, -- Снижение входящего критического урона (%)

    healing_effect_percent DECIMAL, -- Усиление исходящего исцеления (%)
    healing_received_percent DECIMAL -- Усиление входящего исцеления (%)
);