import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface OnboardingFormProps {
  onComplete: (data: { q1: string; q2: string; q3: string[] }) => Promise<void> | void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const q1Options = ["Currently hiring", "Hiring Next Month", "Hiring in 3 months", "Not yet planned"];
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
    if (!isNotPlanned && !q2) return false;
    if (q3.length === 0) return false;
    if (q3.includes("Others") && otherText.trim() === "") return false;
    return true;
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center overflow-y-auto flex items-center justify-center p-4 lg:p-8"
      style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-822148e6-1fa1-4830-ab09-58c4c1b0d5f4.jpg')` }}
    >
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400 flex flex-col"
        style={{ width: '1051.56px', height: '641.05px', maxWidth: '100%' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-4 text-center shrink-0">
          <h1 className="text-2xl lg:text-4xl font-black text-white tracking-wide uppercase drop-shadow-md">
            Claim Your Rewards
          </h1>
        </div>
        
        {/* Subheader */}
        <div className="py-3 px-4 text-center border-b border-orange-100 shrink-0 bg-orange-50/50">
          <p className="text-base lg:text-lg font-bold text-orange-800 italic">
            "Just 3 questions to join Lucky Draw"
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
          <div className="space-y-3 transition-opacity duration-300">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md">3</div>
              <h3 className="text-base font-bold text-orange-900">Which job portals are you currently using for hiring? <span className="text-xs font-normal text-gray-500 block">(Multiple choice)</span></h3>
            </div>
            <div className="space-y-2">
              {q3Options.map(opt => (
                <div key={opt} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => toggleQ3(opt)}
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
            onClick={async () => {
              if (isFormValid() && !isSubmitting) {
                setIsSubmitting(true);
                const finalQ3 = q3.includes("Others") ? [...q3.filter(i => i !== "Others"), `Others: ${otherText}`] : q3;
                await Promise.resolve(onComplete({ q1: q1!, q2: q2 || "", q3: finalQ3 }));
                setIsSubmitting(false); // Can be kept or unmounted if parent handles navigation immediately
              }
            }}
            disabled={!isFormValid() || isSubmitting}
            className={`w-full max-w-md py-3 rounded-2xl font-black text-lg tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              isFormValid() && !isSubmitting
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:scale-105 hover:shadow-orange-500/30 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? "LOADING..." : "REVEAL REWARD ⚡"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
