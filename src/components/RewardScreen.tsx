import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface RewardScreenProps {
  onPlayAgain: () => void;
  gameWon: boolean;
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
          className="absolute top-[-50px] w-10 h-10 md:w-12 md:h-12 object-contain opacity-70"
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

export default function RewardScreen({ onPlayAgain, gameWon }: RewardScreenProps) {
  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center overflow-y-auto flex items-center justify-center p-4 lg:p-8"
      style={{ backgroundImage: `url('https://files.ajt.my/images/marketing-campaign/image-ece9b57a-7abf-4331-a6c1-4f678cf72a4c.gif')` }}
    >
      <Snow />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400 flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-6 px-4 text-center">
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-wide drop-shadow-md">
            Congrats, You Get Hiring Rewards!
          </h1>
        </div>

        {/* Rewards Grid */}
        <div className="p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Guaranteed Reward */}
          <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 flex flex-col items-center text-center">
            <h3 className="text-xl font-black text-orange-800 mb-6">Guaranteed Reward</h3>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Voucher</span>
                <img src="https://files.ajt.my/images/marketing-campaign/image-cb17ce42-da63-42a5-911c-7d12fd403cfb.png" className="h-24 object-contain drop-shadow-lg" alt="RM200 OFF" />
                <span className="text-lg font-bold text-orange-900 mt-2">RM200 OFF AJobThing Voucher</span>
                <span className="text-xs text-gray-500 mt-1">(Valid until 20 April 2026)</span>
              </div>
              
              <div className="w-full flex items-center gap-4 my-2">
                <div className="h-px bg-orange-200 flex-1"></div>
                <span className="text-sm font-bold text-orange-400">and</span>
                <div className="h-px bg-orange-200 flex-1"></div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Free Job Ads*</span>
                <img src="https://files.ajt.my/images/marketing-campaign/image-c97b2bcf-f32b-4a30-a849-ef83654e22dd.png" className="h-24 object-contain drop-shadow-lg" alt="Free Job Ads" />
              </div>
            </div>

            <a 
              href="https://www.ajobthing.com/login?redirect=/campaign/rewards"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md mt-auto"
            >
              Claim Free Job Ads*
            </a>
            <p className="text-xs text-gray-500 mt-3 leading-tight">
              To claim free job ads, please login and go to the Rewards page. Make sure you have an AJobThing account.
            </p>
          </div>

          {/* Lucky Draw Ticket */}
          <div className={`bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 flex flex-col items-center text-center ${!gameWon ? 'bg-gray-50 border-gray-200' : ''}`}>
            <h3 className={`text-xl font-black mb-6 ${gameWon ? 'text-orange-800' : 'text-gray-600'}`}>
              {gameWon ? '1 Lucky Draw Ticket' : '0 Lucky Draw Ticket'}
            </h3>
            
            <div className="flex flex-col items-center gap-4 mb-6 flex-1 justify-center">
              {gameWon && <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">for Fuel Top Up</span>}
              <div className="relative">
                {gameWon && <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full"></div>}
                <img 
                  src="https://files.ajt.my/images/marketing-campaign/image-e44feda6-e67b-43b5-9751-d1350349c304.png" 
                  className={`relative h-40 object-contain drop-shadow-2xl z-10 transition-all ${!gameWon ? 'grayscale opacity-40' : ''}`} 
                  alt="Fuel Top Up" 
                />
              </div>
              {!gameWon && <span className="text-sm font-bold text-gray-500 mt-2">Ticket not collected this time.</span>}
            </div>

            <p className="text-sm font-medium text-gray-600 italic mt-auto">
              "If hiring, our Hiring Support will reach you to help your hiring needs via WhatsApp or Call."
            </p>
          </div>

        </div>

        {/* Tips Section */}
        <div className="px-6 lg:px-10 pb-6">
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-bold text-sm lg:text-base">
              💡 Tips to Win: Use This Voucher to Buy Job Package & More chances to win Fuel Top Up!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 lg:p-10 border-t border-gray-100 flex flex-col items-center gap-6">
          
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Share this game</span>
            <div className="flex gap-3">
              <a 
                href="https://api.whatsapp.com/send?text=Play%20Fuel%20Your%20Hiring%20and%20win%20exclusive%20rewards!%20%F0%9F%9A%97%F0%9F%92%A8%20https%3A%2F%2Fpromotion.ajobthing.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 shadow-md inline-block"
              >
                WhatsApp
              </a>
              <a 
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpromotion.ajobthing.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A66C2] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 shadow-md inline-block"
              >
                LinkedIn
              </a>
              <a 
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpromotion.ajobthing.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 shadow-md inline-block"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-sm font-medium text-gray-600 text-center">
              Check WA Channel for Lucky Winner announcement EVERYDAY
            </p>
            <a 
              href="https://www.whatsapp.com/channel/0029VadYIsPB4hdYGIn57X2H"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-3 px-8 rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Join WA Channel
            </a>
          </div>

          <button 
            onClick={onPlayAgain}
            className="text-sm font-bold text-gray-400 hover:text-gray-600 underline mt-4"
          >
            Play Again
          </button>
        </div>

      </motion.div>

      {/* Jobie Character */}
      <img 
        src="https://files.ajt.my/images/marketing-campaign/image-cbf068c6-5c4b-4e1e-b461-74618f20d795.png" 
        className="absolute -right-4 lg:right-10 bottom-4 lg:bottom-10 h-40 lg:h-64 z-20 pointer-events-none drop-shadow-xl"
        alt="Jobie"
      />
    </div>
  );
}
