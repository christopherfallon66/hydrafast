import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSettingsStore } from './store/settingsStore';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { TrackScreen } from './screens/TrackScreen';
import { CheckInScreen } from './screens/CheckInScreen';
import { LearnScreen } from './screens/LearnScreen';
import { MoreScreen } from './screens/MoreScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';

function AppContent() {
  const { disclaimer_acknowledged, contraindications_shown, contraindication_flags } = useSettingsStore();

  // Show onboarding if not completed
  if (!disclaimer_acknowledged || !contraindications_shown) {
    return <OnboardingScreen />;
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-glacier relative">
      {/* Contraindication banner */}
      {contraindication_flags.length > 0 && (
        <div className="bg-amber-50 border-b border-warning px-4 py-2 text-center">
          <p className="text-xs text-amber-800">
            Reminder: Consult a healthcare provider before fasting. You indicated health considerations during screening.
          </p>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/track" element={<TrackScreen />} />
        <Route path="/checkin" element={<CheckInScreen />} />
        <Route path="/learn" element={<LearnScreen />} />
        <Route path="/more" element={<MoreScreen />} />
      </Routes>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
