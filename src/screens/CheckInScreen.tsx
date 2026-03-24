import { useEffect } from 'react';
import { CheckInForm } from '../components/checkin/CheckInForm';
import { CheckInHistory } from '../components/checkin/CheckInHistory';
import { useCheckInStore } from '../store/checkinStore';

export function CheckInScreen() {
  const { recentCheckIns, loadRecent } = useCheckInStore();

  useEffect(() => { loadRecent(); }, []);

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-bold text-deep-ocean mb-1">Health Check-In</h1>
      <p className="text-xs text-text-secondary mb-4">How are you feeling right now? Be honest — this is for your safety.</p>

      <CheckInForm />

      <div className="mt-6">
        <CheckInHistory checkIns={recentCheckIns} />
      </div>
    </div>
  );
}
