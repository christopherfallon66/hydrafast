// Simple i18n infrastructure for localization
// Phase 3: Add more languages by adding new locale files

type LocaleKey = keyof typeof en;
type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja';

const en = {
  // App
  app_name: 'HydraFast',

  // Nav
  nav_home: 'Home',
  nav_track: 'Track',
  nav_checkin: 'Check-In',
  nav_learn: 'Learn',
  nav_more: 'More',

  // Home
  home_start_fast: 'Start a Fast',
  home_end_fast: 'End Fast',
  home_ready: 'Ready to begin your fasting journey?',
  home_completed: 'Completed',
  home_longest: 'Longest',
  home_total: 'Total',
  home_latest_checkin: 'Latest Check-In',

  // Timer
  timer_goal_suffix: 'goal',
  timer_no_goal: 'No time goal set',

  // Water
  water_title: 'Water Intake',
  water_today: 'Today',
  water_goal: 'of goal',
  water_add: 'Add Water',
  water_custom: 'Custom',

  // Electrolytes
  electrolytes_title: 'Electrolytes',
  electrolytes_on_track: 'On Track',
  electrolytes_low: 'Low',
  electrolytes_very_low: 'Very Low',
  electrolytes_custom: '+ Custom',

  // Check-in
  checkin_title: 'Health Check-In',
  checkin_energy: 'Energy Level',
  checkin_clarity: 'Mental Clarity',
  checkin_mood: 'Mood',
  checkin_submit: 'Submit Check-In',

  // Alerts
  alert_yellow_title: 'Mild symptoms detected',
  alert_orange_title: 'Caution — consider ending your fast',
  alert_red_title: 'Urgent — please break your fast now',

  // Learn
  learn_timeline: 'Timeline',
  learn_benefits: 'Benefits',
  learn_refeeding: 'Refeeding',

  // More
  more_journal: 'Journal',
  more_history: 'Fast History',
  more_analytics: 'Analytics',
  more_export: 'Export Data',
  more_settings: 'Settings',

  // Settings
  settings_profile: 'Profile',
  settings_units: 'Units',
  settings_dark_mode: 'Dark Mode',
  settings_notifications: 'Notifications',

  // Common
  common_save: 'Save',
  common_cancel: 'Cancel',
  common_back: 'Back',
  common_delete: 'Delete',
  common_edit: 'Edit',
  common_done: 'Done',

  // Disclaimer
  disclaimer_title: 'Important Disclaimer',
  disclaimer_acknowledge: 'I Understand — Continue',
  disclaimer_footer: 'This is not medical advice. Consult a healthcare provider before fasting.',
};

const es: Record<LocaleKey, string> = {
  app_name: 'HydraFast',
  nav_home: 'Inicio',
  nav_track: 'Seguir',
  nav_checkin: 'Control',
  nav_learn: 'Aprender',
  nav_more: 'Más',
  home_start_fast: 'Iniciar Ayuno',
  home_end_fast: 'Terminar Ayuno',
  home_ready: '¿Listo para comenzar tu viaje de ayuno?',
  home_completed: 'Completados',
  home_longest: 'Más largo',
  home_total: 'Total',
  home_latest_checkin: 'Último Control',
  timer_goal_suffix: 'meta',
  timer_no_goal: 'Sin meta de tiempo',
  water_title: 'Consumo de Agua',
  water_today: 'Hoy',
  water_goal: 'de la meta',
  water_add: 'Agregar Agua',
  water_custom: 'Personalizado',
  electrolytes_title: 'Electrolitos',
  electrolytes_on_track: 'En Rango',
  electrolytes_low: 'Bajo',
  electrolytes_very_low: 'Muy Bajo',
  electrolytes_custom: '+ Personalizado',
  checkin_title: 'Control de Salud',
  checkin_energy: 'Nivel de Energía',
  checkin_clarity: 'Claridad Mental',
  checkin_mood: 'Estado de Ánimo',
  checkin_submit: 'Enviar Control',
  alert_yellow_title: 'Síntomas leves detectados',
  alert_orange_title: 'Precaución — considera terminar tu ayuno',
  alert_red_title: 'Urgente — por favor rompe tu ayuno ahora',
  learn_timeline: 'Línea de Tiempo',
  learn_benefits: 'Beneficios',
  learn_refeeding: 'Realimentación',
  more_journal: 'Diario',
  more_history: 'Historial de Ayunos',
  more_analytics: 'Análisis',
  more_export: 'Exportar Datos',
  more_settings: 'Configuración',
  settings_profile: 'Perfil',
  settings_units: 'Unidades',
  settings_dark_mode: 'Modo Oscuro',
  settings_notifications: 'Notificaciones',
  common_save: 'Guardar',
  common_cancel: 'Cancelar',
  common_back: 'Volver',
  common_delete: 'Eliminar',
  common_edit: 'Editar',
  common_done: 'Listo',
  disclaimer_title: 'Aviso Importante',
  disclaimer_acknowledge: 'Entiendo — Continuar',
  disclaimer_footer: 'Esto no es consejo médico. Consulte a un profesional de salud antes de ayunar.',
};

const locales: Record<Locale, Record<LocaleKey, string>> = {
  en,
  es,
  fr: en, // Placeholder — copy English until translations are provided
  de: en,
  pt: en,
  ja: en,
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: LocaleKey): string {
  return locales[currentLocale]?.[key] ?? locales.en[key] ?? key;
}

export function getSupportedLocales(): { code: Locale; label: string }[] {
  return [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français (coming soon)' },
    { code: 'de', label: 'Deutsch (coming soon)' },
    { code: 'pt', label: 'Português (coming soon)' },
    { code: 'ja', label: '日本語 (coming soon)' },
  ];
}
