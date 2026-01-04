export interface LocalizedString {
  ru: string;
  en: string;
}

export interface StatWithGrowth {
  base: number;
  growth: number;
}

export interface Hero {
  id: string;
  image_id: string;
  name: LocalizedString;
  roles: {
    ru: string[];
    en: string[];
  };
  resource: string;
  stats: {
    hp: StatWithGrowth;
    hp_regen: StatWithGrowth;
    phys_atk: StatWithGrowth;
    phys_def: StatWithGrowth;
    mag_def: StatWithGrowth;
    atk_speed: StatWithGrowth;
    mag_power: StatWithGrowth;
    move_speed: number;
    atk_range: {
      min: number;
      max: number;
    };
    atk_speed_ratio: number;
  };
}

export interface Item {
  id: string;
  image_id: string;
  name: LocalizedString;
  cost: number;
  category: string;
  stats: {
    hp?: number;
    regen_hp?: number;
    mana?: number;
    regen_mana?: number;
    adaptive_attack?: number;
    phys_atk?: number;
    mag_power?: number;
    phys_def?: number;
    mag_def?: number;
    phys_penetration_flat?: number;
    phys_penetration_fraction?: number;
    mag_penetration_flat?: number;
    mag_penetration_fraction?: number;
    hybrid_vamp_fraction?: number;
    lifesteal_fraction?: number;
    spell_vamp_fraction?: number;
    move_speed_flat?: number;
    move_speed_fraction?: number;
    cooldown_reduction_fraction?: number;
    attack_speed_fraction?: number;
    crit_chance_fraction?: number;
    crit_damage_fraction?: number;
    crit_damage_reduction_fraction?: number;
    healing_effect_fraction?: number;
  };
}

export interface Emblem {
  id: string;
  image_id: string;
  name: LocalizedString;
  stats: {
    hp?: number;
    regen_hp?: number;
    mana?: number;
    regen_mana?: number;
    hybrid_regen?: number;
    adaptive_attack?: number;
    phys_attack?: number;
    mag_power?: number;
    hybrid_def?: number;
    phys_def?: number;
    mag_def?: number;
    adaptive_penetration?: number;
    phys_penetration?: number;
    mag_penetration?: number;
    hybrid_penetration?: number;
    hybrid_vamp_fraction?: number;
    lifesteal_fraction?: number;
    spell_vamp_fraction?: number;
    move_speed_flat?: number;
    move_speed_fraction?: number;
    cooldown_reduction_fraction?: number;
    attack_speed_fraction?: number;
    healing_effect_fraction?: number;
  };
}