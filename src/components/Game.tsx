import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "motion/react";

interface GameProps {
  onComplete: (won: boolean) => void;
}

export default function Game({ onComplete }: GameProps) {
  const [gameState, setGameState] = useState<'tutorial' | 'spinning' | 'stopping' | 'done'>('tutorial');
  const controls = useAnimation();
  const rotateValue = useMotionValue(0);
  const totalRotation = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Track rotation in real-time via rAF so controls.stop() doesn't lose the current angle
  const startTracking = () => {
    const tick = () => {
      totalRotation.current = rotateValue.get();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopTracking = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => () => stopTracking(), []);

  const startSpin = () => {
    setGameState('spinning');
    const current = totalRotation.current;
    startTracking();

    controls.start({
      rotate: current + 360 * 100,
      transition: {
        ease: "linear",
        duration: 400,
      }
    });
  };

  const pauseSpin = () => {
    setGameState('stopping');
    // Snapshot the real current angle BEFORE stopping the animation
    const current = totalRotation.current;
    controls.stop();
    stopTracking();

    const currentMod = ((current % 360) + 360) % 360;

    const today = new Date().getUTCDate();

    // Segment layout confirmed from wheel image (arrow at top = 0 deg):
    // Angle mapping (calibrated from testing):
    //   Burger   = -40
    //   Beautea  = 0
    //   Chicken  = 144
    //   TnGO     = 72, 86, 108
    //   Chagee   = 216
    //   Voucher RM200 = 1, 6, 178
    let segmentAngle = 0;
    if (today === 19) segmentAngle = 144;      // Grabgift Chicken
    else if (today === 20) segmentAngle = 72;   // TnGO (confirmed working)
    else if (today === 21) segmentAngle = 216;  // Grabgift Chagee
    else if (today === 22) segmentAngle = -40;  // Grabgift Burger
    else if (today === 25) segmentAngle = 0;    // Grabgift Beautea
    else segmentAngle = 0;

    const diff = (segmentAngle - currentMod + 360) % 360;
    // Always spin at least 3 full rotations before landing
    const finalAngle = current + 360 * 3 + (diff === 0 ? 360 : diff);

    controls.start({
      rotate: finalAngle,
      transition: {
        ease: "circOut",
        duration: 4
      }
    }).then(() => {
      totalRotation.current = finalAngle;
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
          style={{ rotate: rotateValue }}
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
      {gameState === 'done' && (() => {
        const today = new Date().getUTCDate();
        const isTngoDay = today === 20;
        const rewardLabel = isTngoDay ? "You get TnGo reward" : "You get Grabgift Lucky draw";

        let rewardImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-08fa14e8-8c3a-477e-bdc4-d3e0a346a21e.png"; // Burger (default for non-TnGO)
        if (isTngoDay) {
          rewardImg = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4JaYKs2QN3NiHeXjtLyPyv1876S2MX.png";
        } else if (today === 25) {
          rewardImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-7d765751-c0ca-48bd-a0ce-3d8fb5e656eb.png";
        }

        return (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md w-[90%] border-4 border-yellow-400 flex flex-col items-center"
            >
              <h2 className="text-3xl font-black text-orange-500 mb-2 leading-tight">Congrats!</h2>
              <p className="text-lg text-gray-700 font-bold mb-6">{rewardLabel}</p>
              
              <img 
                src={rewardImg}
                alt="Reward"
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
        );
      })()}

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
