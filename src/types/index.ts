export interface FastSession {
  id: string;
  start_time: string; // ISO 8601 local
  end_time: string | null;
  target_duration_hours: number | null;
  status: 'active' | 'completed' | 'broken';
  break_reason: string | null;
  notes: string | null;
}

export interface WaterLog {
  id: string;
  fast_session_id: string | null;
  timestamp: string;
  amount_ml: number;
  note: string | null;
}

export interface ElectrolyteLog {
  id: string;
  fast_session_id: string | null;
  timestamp: string;
  type: 'sodium' | 'potassium' | 'magnesium';
  amount_mg: number;
  source: string | null;
}

export interface HealthCheckIn {
  id: string;
  fast_session_id: string | null;
  timestamp: string;
  energy: number;
  clarity: number;
  mood: 'great' | 'good' | 'neutral' | 'low' | 'bad';
  dizziness: 'none' | 'mild' | 'moderate' | 'severe';
  nausea: 'none' | 'mild' | 'moderate' | 'severe';
  heart_palpitations: boolean;
  headache: 'none' | 'mild' | 'moderate' | 'severe';
  muscle_cramps: boolean;
  notes: string | null;
  alert_level: 'none' | 'yellow' | 'orange' | 'red';
}

export interface BodyMetric {
  id: string;
  timestamp: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'ketone';
  value: number;
  value_secondary: number | null;
  unit: string;
  notes: string | null;
}

export interface JournalEntry {
  id: string;
  fast_session_id: string | null;
  timestamp: string;
  title: string | null;
  body: string;
  tags: string[];
  photos: string[];
}

export interface FastingBenefit {
  id: string;
  category: 'metabolic' | 'cellular' | 'cognitive' | 'immune' | 'psychological';
  title: string;
  summary: string;
  detail: string;
  evidence_level: 'established' | 'emerging' | 'preliminary';
  relevant_phase: string | null;
  min_hours: number | null;
  sources: string[];
}

export interface BenefitShown {
  id: string;
  benefit_id: string;
  shown_at: string;
}

export interface FastingPhase {
  key: string;
  name: string;
  onset_hours: number;
  end_hours: number | null;
  description: string;
  detail: string;
}

export type AlertLevel = 'none' | 'yellow' | 'orange' | 'red';

export type RefeedingTier = 'short' | 'medium' | 'extended';

export interface RefeedingPhase {
  name: string;
  time_range: string;
  foods: string[];
  notes: string;
}

export interface RefeedingProtocol {
  tier: RefeedingTier;
  label: string;
  duration_range: string;
  risk_level: string;
  phases: RefeedingPhase[];
  warnings: string[];
}

export interface UserSettings {
  units: 'imperial' | 'metric';
  water_goal_ml: number;
  default_fast_hours: number | null;
  wake_hour: number;
  sleep_hour: number;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  notifications_milestones: boolean;
  notifications_water: boolean;
  notifications_electrolytes: boolean;
  notifications_checkin: boolean;
  notifications_benefits: boolean;
  notifications_benefits_frequency_hours: number;
  notifications_refeeding: boolean;
  disclaimer_acknowledged: boolean;
  contraindications_shown: boolean;
  contraindication_flags: string[];
  name: string;
  dark_mode: boolean;
  onboarding_tutorial_complete: boolean;
}
