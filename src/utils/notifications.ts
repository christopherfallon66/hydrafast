/** Request notification permission from the user */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Show a local notification */
export function showNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/favicon.svg',
    tag: tag || undefined,
    silent: false,
  });
}

/** Schedule a notification after a delay (ms). Returns a timeout ID to cancel. */
export function scheduleNotification(title: string, body: string, delayMs: number, tag?: string): number {
  return window.setTimeout(() => {
    showNotification(title, body, tag);
  }, delayMs);
}

/** Cancel a scheduled notification */
export function cancelScheduledNotification(timeoutId: number) {
  window.clearTimeout(timeoutId);
}

// Notification scheduling manager for active fasts
class NotificationManager {
  private timers: number[] = [];

  clearAll() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  /** Schedule water reminders every intervalMs during waking hours */
  scheduleWaterReminders(intervalMs: number, wakeHour: number, sleepHour: number) {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= wakeHour && hour < sleepHour) {
      const id = scheduleNotification(
        '💧 Hydration Reminder',
        'Time to drink some water! Staying hydrated is essential during fasting.',
        intervalMs,
        'water-reminder'
      );
      this.timers.push(id);
    }
  }

  /** Schedule electrolyte reminder */
  scheduleElectrolyteReminder(delayMs: number) {
    const id = scheduleNotification(
      '⚡ Electrolyte Check',
      "Have you logged your electrolytes today? Sodium, potassium, and magnesium are essential during fasting.",
      delayMs,
      'electrolyte-reminder'
    );
    this.timers.push(id);
  }

  /** Schedule health check-in reminder */
  scheduleCheckInReminder(delayMs: number) {
    const id = scheduleNotification(
      '❤️ Health Check-In',
      "Time for a quick check-in. How are you feeling? Log your energy, clarity, and any symptoms.",
      delayMs,
      'checkin-reminder'
    );
    this.timers.push(id);
  }

  /** Schedule milestone notification */
  scheduleMilestone(hours: number, delayMs: number) {
    const id = scheduleNotification(
      '🎯 Fasting Milestone',
      `You've been fasting for ${hours} hours! Check the Timeline to see what your body is doing.`,
      delayMs,
      `milestone-${hours}`
    );
    this.timers.push(id);
  }
}

export const notificationManager = new NotificationManager();

/** Set up all notifications for an active fast */
export function setupFastNotifications(
  startTime: string,
  settings: {
    notifications_water: boolean;
    notifications_electrolytes: boolean;
    notifications_checkin: boolean;
    notifications_milestones: boolean;
    wake_hour: number;
    sleep_hour: number;
  }
) {
  notificationManager.clearAll();

  const elapsedMs = Date.now() - new Date(startTime).getTime();
  const elapsedHours = elapsedMs / 3600000;

  // Water reminders every hour
  if (settings.notifications_water) {
    notificationManager.scheduleWaterReminders(3600000, settings.wake_hour, settings.sleep_hour);
  }

  // Electrolyte reminder at 8 hours and every 12 hours
  if (settings.notifications_electrolytes && elapsedHours >= 12) {
    notificationManager.scheduleElectrolyteReminder(8 * 3600000);
  }

  // Check-in reminders
  if (settings.notifications_checkin) {
    const intervalHours = elapsedHours > 120 ? 6 : elapsedHours > 48 ? 8 : 12;
    notificationManager.scheduleCheckInReminder(intervalHours * 3600000);
  }

  // Milestone notifications
  if (settings.notifications_milestones) {
    const milestones = [12, 24, 48, 72, 96, 120, 168];
    for (const m of milestones) {
      if (elapsedHours < m) {
        const delayMs = (m * 3600000) - elapsedMs;
        notificationManager.scheduleMilestone(m, delayMs);
      }
    }
  }
}
