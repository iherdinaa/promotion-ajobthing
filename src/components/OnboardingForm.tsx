import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface OnboardingFormProps {
  onComplete: () => void;
}

const Snow = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: number; delay: number; duration: number; img: string }[]>([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      img: Math.random() > 0.5 
        ? "https://files.ajt.my/images/marketing-campaign/image-b5c61653-48e5-404d-aa95-da0f2ecc5351.png"
        : "https://files.ajt.my/images/marketing-campaign/image-4851506e-34bf-49a7-b5ab-ee7c373b4c23.png"
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map(flake => (
        <motion.img
          key={flake.id}
          src={flake.img}
          className="absolute top-[-50px] w-8 h-8 object-contain opacity-70"
          style={{ left: `${flake.left}%` }}
          animate={{
            y: ["0vh", "100vh"],
            rotate: [0, 360]
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  const q1Options = ["Currently hiring", "Hiring after Raya", "Hiring in 3 months", "Not yet planned"];
  const q2Options = ["1–6", "7-15", "16-30", "More than 30"];
  const q3Options = ["AJobThing (Maukerja & Ricebowl)", "Jobstreet", "LinkedIn", "Recruitment agency", "Social media", "Others"];

  const isNotPlanned = q1 === "Not yet planned";

  const toggleQ3 = (option: string) => {
    if (q3.includes(option)) {
      setQ3(q3.filter(item => item !== option));
    } else {
      setQ3([...q3, option]);
    }
  };

  const isFormValid = () => {
    if (!q1) return false;
    if (isNotPlanned) return true;
    if (!q2) return false;
    if (q3.length === 0) return false;
    if (q3.includes("Others") && otherText.trim() === "") return false;
    return true;
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center overflow-y-auto flex items-center justify-center p-4 lg:p-8"
      style={{ backgroundImage: `url('https://files.ajt.my/images/marketing-campaign/image-ece9b57a-7abf-4331-a6c1-4f678cf72a4c.gif')` }}
    >
      <Snow />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400 flex flex-col"
        style={{ width: '1051.56px', height: '641.05px', maxWidth: '100%' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-4 text-center shrink-0">
          <h1 className="text-2xl lg:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md">
            Unlock Rewards After Saving Fuel
          </h1>
        </div>
        
        {/* Subheader */}
        <div className="py-3 px-4 text-center border-b border-orange-100 shrink-0 bg-orange-50/50">
          <p className="text-base lg:text-lg font-bold text-orange-800 italic">
            "Just 3 questions to join Fuel Top Up Lucky Draw"
          </p>
        </div>

        {/* Questions Grid */}
        <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 overflow-y-auto flex-1">
          
          {/* Question 1 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">1</div>
              <h3 className="text-base font-bold text-orange-900">What is your next hiring timeline?</h3>
            </div>
            <div className="space-y-2">
              {q1Options.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setQ1(opt);
                    if (opt === "Not yet planned") {
                      setQ2(null);
                      setQ3([]);
                      setOtherText("");
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                    q1 === opt 
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className={`space-y-3 transition-opacity duration-300 ${isNotPlanned ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">2</div>
              <h3 className="text-base font-bold text-orange-900">How many positions are you planning to hire for replacements/new staff?</h3>
            </div>
            <div className="space-y-2">
              {q2Options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setQ2(opt)}
                  disabled={isNotPlanned}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                    q2 === opt 
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className={`space-y-3 transition-opacity duration-300 ${isNotPlanned ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">3</div>
              <h3 className="text-base font-bold text-orange-900">Which job portals are you currently using for hiring? <span className="text-xs font-normal text-gray-500 block">(Multiple choice)</span></h3>
            </div>
            <div className="space-y-2">
              {q3Options.map(opt => (
                <div key={opt} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => toggleQ3(opt)}
                    disabled={isNotPlanned}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-between text-sm ${
                      q3.includes(opt)
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                        : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    {opt}
                    {q3.includes(opt) && (
                      <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                  {opt === "Others" && q3.includes("Others") && (
                    <motion.input
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      type="text"
                      placeholder="Please specify..."
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      className="w-full p-2.5 border-2 border-orange-300 rounded-xl outline-none focus:border-orange-500 text-sm font-medium mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer / Submit */}
        <div className="p-4 lg:p-6 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
          <button
            onClick={onComplete}
            disabled={!isFormValid()}
            className={`w-full max-w-md py-3 rounded-2xl font-black text-lg tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              isFormValid()
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:scale-105 hover:shadow-orange-500/30 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            REVEAL REWARD ⚡
          </button>
        </div>

      </motion.div>
    </div>
  );
}
