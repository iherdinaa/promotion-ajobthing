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
    
    // Compute rewards
    const today = new Date().getUTCDate();
    let voucherTitle = "RM200 OFF";
    let treatTitle = "Grabgift Chicken Lucky Draw";
    
    if (today === 19) {
      treatTitle = "Grabgift Chicken Lucky Draw";
    } else if (today === 20) {
      treatTitle = "TnGO";
      if (onboardingData.q2 === '1-6') {
        voucherTitle = "RM288 OFF";
      } else if (onboardingData.q2 === '7-15' || onboardingData.q2 === '16-30') {
        voucherTitle = "RM588 OFF";
      } else {
        voucherTitle = "RM988 OFF";
      }
    } else if (today === 21) {
      treatTitle = "Grabgift Chagee Lucky Draw";
    } else if (today === 22) {
      treatTitle = "Grabgift Burger Lucky Draw";
    } else if (today >= 25) {
      treatTitle = "Grabgift Beautea Lucky Draw";
    }

    const specialNote = `HR Day - ${onboardingData.q1} - ${onboardingData.q2} - ${onboardingData.q3.join(', ')} - ${voucherTitle} - ${gameWon ? treatTitle : 'No Treat'}`;

    const finalData = {
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      hasAccount: formData.hasAccount || formData.ajtAccount || '',
      hiringTimeline: onboardingData.q1,
      headcount: onboardingData.q2,
      jobPlatform: onboardingData.q3.join(', '),
      specialNote: specialNote,
      utmSource: urlParams.get('utm_source') || '',
      utmMedium: urlParams.get('utm_medium') || '',
      utmCampaign: urlParams.get('utm_campaign') || '',
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
