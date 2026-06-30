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
  const [headcount, setHeadcount] = useState("");

  const handleOnboardingComplete = async (onboardingData: { q1: string; q2: string; q3: string[] }) => {
    setHeadcount(onboardingData.q2);
    const urlParams = new URLSearchParams(window.location.search);
    
    const specialNote = `7.7 Hiring Fiesta - ${onboardingData.q1} - ${onboardingData.q2} - ${onboardingData.q3.join(', ')} - ${gameWon ? 'Voucher/TNGo' : 'Free Job Ads'}`;

    const finalData = {
      company_name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      ajt_account: formData.hasAccount || formData.ajtAccount || '',
      hiring_timeline: onboardingData.q1,
      headcount: onboardingData.q2,
      job_platform: onboardingData.q3.join(', '),
      special_note: specialNote,
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'direct',
      utm_campaign: urlParams.get('utm_campaign') || 'direct',
      sheetId: import.meta.env.VITE_SHEET_ID || '',
      sheetName: import.meta.env.VITE_SHEET_NAME || ''
    };

    // Send data to Google Sheets via Apps Script
    const scriptUrl = import.meta.env.VITE_APPSCRIPT_URL;
    try {
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(finalData),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
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
      {screen === 'reward' && <RewardScreen onPlayAgain={() => setScreen('home')} gameWon={gameWon} headcount={headcount} />}
    </div>
  );
}
