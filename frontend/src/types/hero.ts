export interface Hero {
    hero_name: string;
    hero_name_en: string;
    main_role: string;
    extra_role?: string;
    hp: number;
    regen_hp: number;
    resource: number;
    regen_resource: number;
    phys_attack: number;
    phys_def: number;
    mag_def: number;
    attack_speed: number;
    attack_speed_coefficient_fraction: number;
    mag_power: number;
    move_speed: number;
    min_basic_atk_range: number;
    max_basic_atk_range: number;
    resource_type: string;
    
    // Приросты статов (growth)
    growth_hp: number;
    growth_regen_hp: number;
    growth_phys_attack: number;
    growth_phys_def: number;
    growth_mag_def: number;
    growth_attack_speed: number;
    
    // Дефолтные статы (из DataManager)
    crit_chance_fraction: number;
    crit_damage_fraction: number;
    cooldown_reduction_fraction: number;
    phys_penetration: number;
    phys_penetration_fraction: number;
    mag_penetration: number;
    mag_penetration_fraction: number;
    lifesteal_fraction: number;
    spell_vamp_fraction: number;
    resilience_fraction: number;
    crit_damage_reduction_fraction: number;
    healing_effect_fraction: number;
    healing_received_fraction: number;
}

export interface Item {
    item_id: number;
    item_name_ru: string;
    item_name_en?: string;
    category: string;
    price: number;
    description?: string;
    // Статы предметов (соответствуют колонкам БД)
    phys_atk?: number;
    mag_power?: number;
    attack_speed_fraction?: number;
    crit_chance_fraction?: number;
    hp?: number;
    mana?: number;
    phys_def?: number;
    mag_def?: number;
    lifesteal_fraction?: number;
    spell_vamp_fraction?: number;
    cooldown_reduction_fraction?: number;
    // Проникновение
    phys_penetration_flat?: number;
    phys_penetration_fraction?: number;
    mag_penetration_flat?: number;
    mag_penetration_fraction?: number;
    move_speed_flat?: number;
    move_speed_fraction?: number;
}

export interface Emblem {
    emblem_id: number;
    emblem_name_ru: string;
    // Базовые статы эмблемы
    adaptive_attack?: number;
    phys_attack?: number;
    mag_power?: number;
    hp?: number;
    hybrid_regen?: number;
    attack_speed?: number;
    cooldown_reduction_fraction?: number;
    crit_chance_fraction?: number;
    phys_penetration?: number;
    mag_penetration?: number;
    hybrid_penetration?: number;
    lifesteal_fraction?: number;
    spell_vamp_fraction?: number;
    hybrid_lifesteal_fraction?: number;
    move_speed_fraction?: number;
}
