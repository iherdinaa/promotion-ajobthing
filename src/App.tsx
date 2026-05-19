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
  const [formData, setFormData] = useState<any>({});
  const [headcount, setHeadcount] = useState("");

  const handleOnboardingComplete = async (onboardingData: { q1: string; q2: string; q3: string[] }) => {
    setHeadcount(onboardingData.q2);
    const urlParams = new URLSearchParams(window.location.search);
    
    // Compute reward based on calendar day
    const today = new Date().getUTCDate();
    let rewardEarned = "GrabGift Chicken Lucky Draw";
    
    if (today === 19) {
      rewardEarned = "GrabGift Chicken Lucky Draw";
    } else if (today === 20) {
      rewardEarned = "TnGO";
    } else if (today === 21) {
      rewardEarned = "GrabGift Chagee Lucky Draw";
    } else if (today === 22) {
      rewardEarned = "GrabGift Burger Lucky Draw";
    } else if (today >= 25) {
      rewardEarned = "GrabGift Beautea Lucky Draw";
    }

    // Format: HR Day - hiring_timeline - headcount - job_platform - RM200 OFF - {reward earn based on calendar}
    // Example: HR Day - hiring now - 1-6 - jobstreet - RM200 OFF - GrabGift Chicken Lucky Draw
    const specialNote = `HR Day - ${onboardingData.q1} - ${onboardingData.q2 || 'N/A'} - ${onboardingData.q3.join(', ')} - RM200 OFF - ${gameWon ? rewardEarned : 'No Treat'}`;

    const finalData = {
      company_name: formData.companyName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      ajt_account: formData.hasAccount || '',
      hiring_timeline: onboardingData.q1 || '',
      headcount: onboardingData.q2 || '',
      job_platform: onboardingData.q3.join(', ') || '',
      special_note: specialNote,
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      sheetId: import.meta.env.VITE_SHEET_ID || '',
      sheetName: import.meta.env.VITE_SHEET_NAME || ''
    };

    // Send data to Google Sheets via Apps Script
    const scriptUrl = import.meta.env.VITE_APPSCRIPT_URL;
    console.log("[v0] Submitting data to Google Sheets:", finalData);
    console.log("[v0] Using VITE_APPSCRIPT_URL:", scriptUrl);
    
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(finalData),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });
      console.log("[v0] Fetch completed (no-cors mode, response opaque)");
    } catch (error) {
      console.error("[v0] Error submitting data:", error);
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
