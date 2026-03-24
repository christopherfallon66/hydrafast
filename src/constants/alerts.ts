import type { HealthCheckIn, AlertLevel } from '../types';

// Thresholds for safety alert computation
export const ALERT_THRESHOLDS = {
  yellow: {
    dizziness: ['mild'],
    nausea: ['mild'],
    energy_below: 3,
    muscle_cramps: true,
    headache: ['mild'],
  },
  orange: {
    dizziness: ['moderate'],
    nausea: ['moderate'],
    heart_palpitations: true,
    consecutive_low_energy_threshold: 2,
    energy_below: 2,
  },
  red: {
    dizziness: ['severe'],
    nausea: ['severe'],
    heart_palpitations_with_dizziness: true,
  },
};

/**
 * Pure function: compute alert level from a single check-in.
 * For orange-level consecutive energy checks, pass previousCheckIn.
 */
export function computeAlertLevel(
  checkIn: Omit<HealthCheckIn, 'id' | 'timestamp' | 'alert_level'>,
  previousCheckIn?: Pick<HealthCheckIn, 'energy'> | null
): AlertLevel {
  // RED checks (most urgent first)
  if (checkIn.dizziness === 'severe') return 'red';
  if (checkIn.nausea === 'severe') return 'red';
  if (checkIn.heart_palpitations && checkIn.dizziness !== 'none') return 'red';
  if (checkIn.headache === 'severe') return 'red';

  // ORANGE checks
  if (checkIn.dizziness === 'moderate') return 'orange';
  if (checkIn.nausea === 'moderate') return 'orange';
  if (checkIn.heart_palpitations) return 'orange';
  if (checkIn.energy < 2 && previousCheckIn && previousCheckIn.energy < 2) return 'orange';
  if (checkIn.headache === 'moderate') return 'orange';

  // YELLOW checks
  if (checkIn.dizziness === 'mild') return 'yellow';
  if (checkIn.nausea === 'mild') return 'yellow';
  if (checkIn.energy <= 3) return 'yellow';
  if (checkIn.muscle_cramps) return 'yellow';
  if (checkIn.headache === 'mild') return 'yellow';

  return 'none';
}
