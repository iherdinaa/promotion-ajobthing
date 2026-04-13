/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Homepage from "./components/Homepage";
import Game from "./components/Game";
import OnboardingForm from "./components/OnboardingForm";
import RewardScreen from "./components/RewardScreen";

// Replace this with the actual Web App URL after deploying the Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPsoQs4N5B1Qwd2IsQl_cyS6RB9X0olaqXhH9QDQLzvI_uk7x1dkW8NXSetSTgipKGIw/exec";

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game' | 'onboarding' | 'reward'>('home');
  const [gameWon, setGameWon] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleOnboardingComplete = async (onboardingData: { q1: string; q2: string; q3: string[] }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const finalData = {
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      status: gameWon ? 'Got Ticket' : 'No Ticket',
      hiringTimeline: onboardingData.q1,
      headcount: onboardingData.q2,
      jobPlatform: onboardingData.q3,
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_source: urlParams.get('utm_source') || ''
    };

    // Send data to Google Sheets via Apps Script
    try {
      if (SCRIPT_URL) {
        fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        });
      }
    } catch (error) {
      console.error("Error submitting data", error);
    }

    setScreen('reward');
  };

  return (
    <div className="font-sans">
      {screen === 'home' && <Homepage onStart={(data) => { setFormData(data); setScreen('game'); }} />}
      {screen === 'game' && <Game onComplete={(won) => { setGameWon(won); setScreen('onboarding'); }} />}
      {screen === 'onboarding' && <OnboardingForm onComplete={handleOnboardingComplete} />}
      {screen === 'reward' && <RewardScreen onPlayAgain={() => setScreen('home')} gameWon={gameWon} />}
    </div>
  );
}
