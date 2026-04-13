import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GameProps {
  onComplete: (won: boolean) => void;
}

export default function Game({ onComplete }: GameProps) {
  const [showTutorial, setShowTutorial] = useState(true);
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [fuel, setFuel] = useState(100); // 100 to 0
  const [speed, setSpeed] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  
  const progressRef = useRef(0);
  const fuelRef = useRef(100);
  const speedRef = useRef(0);
  const isMoving = useRef(false);
  const isBraking = useRef(false);
  const canDriveRef = useRef(false);
  const lastTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  const startCountdown = () => {
    setShowTutorial(false);
    setCountdown(3);
    canDriveRef.current = false;
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown('Drive!');
      } else {
        setCountdown(null);
        canDriveRef.current = true;
        clearInterval(interval);
      }
    }, 1000);
  };

  // Trees generation
  const trees = useRef(Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    startPos: 40 + i * 13 + Math.random() * 10, // distribute along the 400vw track
    type: Math.random() > 0.5 
      ? "https://files.ajt.my/images/marketing-campaign/image-74a9bf62-f872-438e-8430-c26b68188331.png"
      : "https://files.ajt.my/images/marketing-campaign/image-6882b127-7e1d-46e3-ba34-3ef72ff236e0.png"
  })));

  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTime.current) lastTime.current = time;
      const dt = time - lastTime.current;
      lastTime.current = time;

      if (gameState === 'playing' && canDriveRef.current) {
        // Fuel depletes continuously over 8 seconds (8000ms)
        const newFuel = Math.max(0, fuelRef.current - (dt / 8000) * 100);
        fuelRef.current = newFuel;
        setFuel(newFuel);

        // Speed simulation
        const targetSpeed = isMoving.current && !isBraking.current ? 85 : 0;
        speedRef.current += (targetSpeed - speedRef.current) * (dt / 500); // Smooth acceleration/deceleration
        setSpeed(Math.round(speedRef.current));

        // Progress increases when holding the button
        // Takes 7 seconds of holding to reach 100% (20KM)
        if (isMoving.current && !isBraking.current) {
          const newProgress = Math.min(100, progressRef.current + (dt / 7000) * 100);
          progressRef.current = newProgress;
          setProgress(newProgress);
        }

        // Win/Loss conditions
        if (progressRef.current >= 100) {
          canDriveRef.current = false;
          if (gameState !== 'won') {
            setGameState('won');
          }
        } else if (fuelRef.current <= 0) {
          canDriveRef.current = false;
          if (gameState !== 'lost') {
            setGameState('lost');
          }
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canDriveRef.current) return;
      if (e.code === 'ArrowRight' || e.code === 'Space') isMoving.current = true;
      if (e.code === 'ArrowLeft') isBraking.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'Space') isMoving.current = false;
      if (e.code === 'ArrowLeft') isBraking.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden select-none bg-sky-200"
    >
      {/* Scrolling Track (Background + Scenery) */}
      <div 
        className="absolute top-0 left-0 h-full flex"
        style={{ 
          width: '600vw',
          transform: `translateX(-${progress * 3.6}vw)` // Scrolls by 360vw total
        }}
      >
        <div className="h-full w-[400vw] shrink-0 bg-bottom" style={{ backgroundImage: `url('https://files.ajt.my/images/marketing-campaign/image-b64feb0d-6355-4124-b495-474b7afa581c.jpg')`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }} />
        <div className="h-full w-[200vw] shrink-0 bg-bottom" style={{ backgroundImage: `url('https://files.ajt.my/images/marketing-campaign/image-dc99086a-85df-48e0-ad15-2052975484f7.jpg')`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }} />

        {/* Scenery Container */}
        <div className="absolute bottom-[20%] left-0 w-full h-64">
          {/* Start Line (Office) */}
          <img 
            src="https://files.ajt.my/images/marketing-campaign/image-b2288b81-e262-4890-9d5b-136ac2bd048b.png" 
            className="absolute bottom-0 h-48 object-contain"
            style={{ left: '20vw' }}
          />

          {/* Trees */}
          {trees.current.map(tree => (
            <img 
              key={tree.id}
              src={tree.type} 
              className="absolute bottom-0 h-32 object-contain"
              style={{ left: `${tree.startPos}vw` }}
            />
          ))}

          {/* Finish Line (Home) */}
          <img 
            src="https://files.ajt.my/images/marketing-campaign/image-a3b17a1e-d594-469e-beb0-1d18b7d8f2e4.png" 
            className="absolute bottom-0 h-48 object-contain"
            style={{ left: '380vw' }}
          />
        </div>
      </div>

      {/* Car (Fixed on screen) */}
      <div className="absolute bottom-[20%] left-0 w-full h-64 pointer-events-none">
        <img 
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTV0ZnR3dW11bHp2dGNyZHlza24wdm82ajN6azdyZzMxajNpdG10MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7kItzil2hsUYcsfvkg/giphy.gif" 
          className="absolute bottom-0 h-32 object-contain z-20"
          style={{ 
            left: '20vw',
            transform: `translateY(${isMoving.current ? Math.sin(progress * 2) * 5 : 0}px) rotate(${isMoving.current ? Math.cos(progress * 2) * 2 : 0}deg)`
          }}
        />
      </div>

      {/* Game Over / Win Overlay */}
      {gameState !== 'playing' && !showTutorial && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-[90%]"
          >
            <h2 className={`text-3xl lg:text-4xl font-black mb-4 ${gameState === 'won' ? 'text-green-600' : 'text-red-600'}`}>
              {gameState === 'won' ? "Well done, You've Arrived Home" : 'Oops, you ran out of gas!'}
            </h2>
            {gameState === 'won' ? (
              <div className="text-gray-600 mb-6 space-y-2 text-sm lg:text-base">
                <p className="font-bold text-green-600">You didn't run out of gas. You got 1 Fuel Lucky Draw Ticket.</p>
                <p>Claim to redeem all rewards.</p>
              </div>
            ) : (
              <div className="text-gray-600 mb-6 space-y-2 text-sm lg:text-base">
                <p className="font-bold text-red-500">You didn’t reach home, so you didn’t get a fuel lucky draw ticket.</p>
                <p>Want to get lucky draw ticket? Click <strong>Try Again</strong></p>
                <p>Or click <strong>Continue</strong> to skip.</p>
              </div>
            )}
            
            {gameState === 'won' && (
              <button 
                onClick={() => onComplete(true)}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-md"
              >
                Claim Now
              </button>
            )}

            {gameState === 'lost' && (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setGameState('playing');
                    setProgress(0);
                    setFuel(100);
                    progressRef.current = 0;
                    fuelRef.current = 100;
                    isMoving.current = false;
                    lastTime.current = null;
                    startCountdown();
                  }}
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => onComplete(false)}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors shadow-md"
                >
                  Continue
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-7xl md:text-9xl font-black text-orange-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] italic"
            >
              {countdown}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md w-[90%]"
          >
            <h2 className="text-3xl font-black text-orange-500 mb-4">How to Play</h2>
            <img 
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmhydDh0NTZ6Z2l4YWd3NzRhcHdncHZyOWM2ZWRuN3VpajFpejF5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7BLdFeQR7vwqYBM4Qw/giphy.gif" 
              alt="Tutorial" 
              className="w-full rounded-xl mb-6 shadow-md"
            />
            <div className="space-y-4 text-gray-700 font-medium mb-8 text-sm lg:text-base text-left bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p>🏆 <strong className="text-green-600">How to Win:</strong> Drive home without running out of gas!</p>
              <p>👉 <strong className="text-orange-600">Hold the Gas Pedal</strong> (bottom right) to drive.</p>
              <p>🛑 <strong className="text-red-600">Use the Brake</strong> (bottom left) to stop.</p>
              <p>⛽ <strong className="text-red-600">Watch your fuel!</strong> It runs out very fast.</p>
            </div>
            <button 
              onClick={startCountdown}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg"
            >
              PLAY NOW
            </button>
          </motion.div>
        </div>
      )}

      {/* Tap Instruction */}
      {progress === 0 && gameState === 'playing' && !showTutorial && countdown === null && (
        <div className="absolute top-1/3 w-full text-center pointer-events-none animate-pulse">
          <h2 className="text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            HOLD GAS TO DRIVE
          </h2>
        </div>
      )}

      {/* Distance Tracker & Speedometer (Top) */}
      {!showTutorial && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col md:flex-row gap-2 md:gap-4 z-40">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-black text-gray-800">
              {((progress / 100) * 20).toFixed(1)} <span className="text-orange-500 text-base md:text-lg">/ 20.0 KM</span>
            </span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-black text-gray-800">
              {speed} <span className="text-orange-500 text-base md:text-lg">km/h</span>
            </span>
          </div>
        </div>
      )}

      {/* Pedals */}
      {!showTutorial && gameState === 'playing' && countdown === null && (
        <>
          {/* Brake Pedal (Left) */}
          <div 
            className="absolute bottom-28 md:bottom-32 left-4 md:left-10 z-40 active:scale-95 transition-transform cursor-pointer"
            onPointerDown={(e) => { e.preventDefault(); isBraking.current = true; }}
            onPointerUp={(e) => { e.preventDefault(); isBraking.current = false; }}
            onPointerLeave={(e) => { e.preventDefault(); isBraking.current = false; }}
          >
            <img src="https://files.ajt.my/images/marketing-campaign/image-a5170d7f-f4a8-40f7-9b29-d96c6621d712.png" className="w-20 md:w-28 drop-shadow-xl" alt="Brake" />
          </div>

          {/* Gas Pedal (Right) */}
          <div 
            className="absolute bottom-28 md:bottom-32 right-4 md:right-10 z-40 active:scale-95 transition-transform cursor-pointer"
            onPointerDown={(e) => { e.preventDefault(); isMoving.current = true; }}
            onPointerUp={(e) => { e.preventDefault(); isMoving.current = false; }}
            onPointerLeave={(e) => { e.preventDefault(); isMoving.current = false; }}
          >
            <img src="https://files.ajt.my/images/marketing-campaign/image-4df2bcd4-46ad-4b91-a098-bdbbebf35f2a.png" className="w-24 md:w-32 drop-shadow-xl" alt="Gas" />
          </div>
        </>
      )}

      {/* UI Meter (Bottom) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black p-3 rounded-xl border-4 border-gray-800 flex items-center gap-4 shadow-2xl z-40">
        <img src="https://files.ajt.my/images/marketing-campaign/image-3690c278-bcb8-4a0e-b65f-bc5b23eff943.png" className="h-16 object-contain" />
        
        <div className="flex-1 flex flex-col gap-2">
          {/* Fuel Bar (Red) */}
          <div className="relative w-full h-8 bg-gray-900 border-2 border-gray-700 rounded overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-75"
              style={{ width: `${fuel}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
              {fuel.toFixed(2)}%
            </div>
          </div>
          
          {/* Home Bar (Green) */}
          <div className="relative w-full h-8 bg-gray-900 border-2 border-gray-700 rounded overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-75"
              style={{ width: `${100 - progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
              {(100 - progress).toFixed(2)}%
            </div>
          </div>
        </div>

        <img src="https://files.ajt.my/images/marketing-campaign/image-a3b17a1e-d594-469e-beb0-1d18b7d8f2e4.png" className="h-16 object-contain" />
      </div>
    </div>
  );
}
