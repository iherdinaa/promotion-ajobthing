import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "motion/react";

interface GameProps {
  onComplete: (won: boolean) => void;
}

export default function Game({ onComplete }: GameProps) {
  const [gameState, setGameState] = useState<'tutorial' | 'spinning' | 'stopping' | 'done'>('tutorial');
  const controls = useAnimation();
  const currentAngle = useRef(0);

  const startSpin = () => {
    setGameState('spinning');
    
    // Animate spinning fast
    controls.start({
      rotate: [0, 360],
      transition: {
        ease: "linear",
        duration: 4,
        repeat: Infinity
      }
    });
  };

  const pauseSpin = () => {
    setGameState('stopping');
    controls.stop();

    const today = new Date().getUTCDate();
    let targetOffset = 0;
    if (today === 19) targetOffset = 45; 
    else if (today === 20) targetOffset = 135; 
    else if (today === 21) targetOffset = 225; 
    else if (today === 22) targetOffset = 315; 
    else if (today === 25) targetOffset = 60; 
    else targetOffset = 0; 

    controls.start({
      rotate: 360 * 3 + targetOffset, 
      transition: {
        ease: "circOut",
        duration: 4
      }
    }).then(() => {
      setTimeout(() => {
        setGameState('done');
      }, 500);
    });
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center p-4 bg-sky-200 bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-822148e6-1fa1-4830-ab09-58c4c1b0d5f4.jpg')`
      }}
    >
      <img 
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-80c08104-3dc6-4ac5-942f-8f13a881783c.png" 
        alt="Fuel Your Hiring" 
        className="absolute top-4 left-4 lg:top-6 lg:left-8 w-40 lg:w-56 z-50 object-contain"
      />

      {/* Container for Wheel */}
      <div className="relative shrink-0 flex items-center justify-center w-[36rem] h-[36rem] md:w-[48rem] md:h-[48rem] max-w-[95vw] max-h-[95vw]">
        <img 
          src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-aa04aa69-7cc1-4121-a68f-3ab3bf3cad80.png"
          className="absolute -top-4 md:-top-6 w-16 h-20 md:w-24 md:h-28 object-contain z-20 drop-shadow-xl"
          alt="Arrow"
        />
        <motion.img
          animate={controls}
          initial={{ rotate: 0 }}
          src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-496956f5-d4c0-4c31-80c3-5fefc66497fc.png"
          className="w-full h-full object-contain z-10 drop-shadow-2xl"
          alt="Wheel"
        />
      </div>

      {gameState === 'spinning' && (
        <div className="absolute bottom-10 lg:bottom-16 w-full flex justify-center z-50">
          <button
            onClick={pauseSpin}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-black py-4 px-16 rounded-full text-3xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.8)] border-4 border-red-700"
          >
            PAUSE
          </button>
        </div>
      )}

      {/* Done / Reward Popup */}
      {gameState === 'done' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md w-[90%] border-4 border-yellow-400 flex flex-col items-center"
          >
            <h2 className="text-3xl font-black text-orange-500 mb-2 leading-tight">Congrats!</h2>
            <p className="text-lg text-gray-700 font-bold mb-6">You get Grabgift Lucky draw</p>
            
            <img 
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-3c55e304-2eb4-40c6-bb11-628b97fca28c.png" 
              alt="Grabgift Reward" 
              className="w-48 h-auto object-contain mb-8 drop-shadow-lg"
            />

            <button 
              onClick={() => onComplete(true)}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border border-orange-300"
            >
              CLAIM NOW
            </button>
          </motion.div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {gameState === 'tutorial' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md w-[90%]"
          >
            <h2 className="text-3xl font-black text-orange-500 mb-4">How to Play</h2>
            
            <div className="space-y-4 text-gray-700 font-medium mb-8 text-sm lg:text-base text-center bg-orange-50 p-6 rounded-xl border border-orange-100">
              <p className="text-lg">🎡 <strong className="text-orange-600">Spin the Wheel</strong> and hit PAUSE!</p>
              <p className="text-lg">🎁 <strong className="text-green-600">Win Free Treats</strong> when the arrow points to the reward!</p>
            </div>
            <button 
              onClick={startSpin}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg"
            >
              SPIN NOW
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
