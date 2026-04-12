/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Homepage from "./components/Homepage";
import Game from "./components/Game";
import OnboardingForm from "./components/OnboardingForm";
import RewardScreen from "./components/RewardScreen";

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game' | 'onboarding' | 'reward'>('home');
  const [gameWon, setGameWon] = useState(false);

  return (
    <div className="font-sans">
      {screen === 'home' && <Homepage onStart={() => setScreen('game')} />}
      {screen === 'game' && <Game onComplete={(won) => { setGameWon(won); setScreen('onboarding'); }} />}
      {screen === 'onboarding' && <OnboardingForm onComplete={() => setScreen('reward')} />}
      {screen === 'reward' && <RewardScreen onPlayAgain={() => setScreen('home')} gameWon={gameWon} />}
    </div>
  );
}
