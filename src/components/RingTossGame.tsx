import React, { useState, useRef } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface RingTossGameProps {
  onComplete: (won: boolean | string) => void;
}

export default function RingTossGame({ onComplete }: RingTossGameProps) {
  const { width, height } = useWindowSize();
  const [gameState, setGameState] = useState<
    "guide" | "ready" | "dragging" | "flying" | "result"
  >("guide");
  const [throwsRemaining, setThrowsRemaining] = useState(5);
  const [successfulRings, setSuccessfulRings] = useState(0);
  const [landedRings, setLandedRings] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const ringControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    if (gameState === "ready") {
      setGameState("dragging");
    }
  };

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (gameState !== "dragging") return;

    const dragY = info.offset.y;
    const dragX = info.offset.x;

    if (dragY < 20) {
      setGameState("ready");
      ringControls.set({ x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 });
      return;
    }

    setGameState("flying");
    const newThrows = throwsRemaining - 1;
    setThrowsRemaining(newThrows);

    const power = Math.min(dragY * 2.5, 600);
    const directionX = -dragX * 2.5;

    const targetY = -power;
    const targetX = directionX;

    const polePositions = [-180, -90, 0, 90, 180]; // Match visuals
    let landedPoleIndex = -1;

    // Check if it reached the depth of the table/poles
    if (targetY <= -120 && targetY >= -500) {
      for (let i = 0; i < polePositions.length; i++) {
        if (Math.abs(targetX - polePositions[i]) < 70) {
          landedPoleIndex = i;
          break;
        }
      }
    }

    const isSuccess = landedPoleIndex !== -1;

    let finalTargetY = targetY;
    let finalTargetX = targetX;

    if (isSuccess) {
      finalTargetY = -220; // Snap to pole depth
      finalTargetX = polePositions[landedPoleIndex];
    }

    // Arc up
    await ringControls.start({
      x: finalTargetX,
      y: finalTargetY - 120, // Peak of arc
      scale: 0.6,
      rotateX: 60,
      rotateZ: 360,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    });

    if (isSuccess) {
      // Drop onto pole
      await ringControls.start({
        y: finalTargetY,
        scale: 0.55,
        rotateX: 70,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      });
      setMessage("✔ Success!");
      setSuccessfulRings((prev) => prev + 1);
      setLandedRings((prev) => [...prev, landedPoleIndex]);
    } else {
      // Drop and bounce slightly (miss)
      await ringControls.start({
        y: finalTargetY + 80,
        scale: 0.45,
        rotateX: 75,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      });
      setMessage("❌ Miss!");
    }

    setTimeout(() => {
      setMessage("");
      const updatedSuccess = isSuccess ? successfulRings + 1 : successfulRings;

      if (updatedSuccess >= 2 || newThrows === 0) {
        setGameState("result");
      } else {
        setGameState("ready");
        ringControls.set({ x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 });
      }
    }, 1000);
  };

  const handleTryAgain = () => {
    setGameState("ready");
    setThrowsRemaining(5);
    setSuccessfulRings(0);
    setLandedRings([]);
    ringControls.set({ x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 });
  };

  const hasWon = successfulRings >= 2;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center p-0 z-50 overflow-hidden bg-black">
      {gameState === "result" && hasWon && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          gravity={0.2}
          style={{ zIndex: 60 }}
        />
      )}

      <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#5bbcd8]">
        {/* Field Pattern Background */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
          style={{
            backgroundImage:
              "url(https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-593785d1-4c47-46a9-aa5a-1c5f062d3fcc.jpg)",
          }}
        ></div>

        {/* Counters */}
        <div className="absolute top-[8%] lg:top-[10%] left-1/2 -translate-x-1/2 z-20 flex gap-4 w-full max-w-[400px] justify-center px-4">
          <div className="bg-white/90 backdrop-blur border-2 border-orange-400 rounded-xl p-2 px-4 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Throws Remaining
            </div>
            <div className="text-xl lg:text-2xl font-black text-orange-600">
              {throwsRemaining} / 5
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur border-2 border-green-400 rounded-xl p-2 px-4 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Successful Rings
            </div>
            <div className="text-xl lg:text-2xl font-black text-green-600">
              {successfulRings} / 2
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={containerRef}
          className="flex-1 relative w-full perspective-[1000px] flex items-end justify-center pb-[12vh] lg:pb-[15vh]"
        >
          {/* Success/Miss Message */}
          {message && (
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-40 text-4xl lg:text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-bounce">
              {message}
            </div>
          )}

          {/* Table */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[95%] max-w-[700px] z-10 flex justify-center items-end">
            <img
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-a4452fa1-098a-4ca2-80b4-d3334631503b.png"
              alt="Table"
              className="w-full object-contain pointer-events-none drop-shadow-2xl scale-110 origin-bottom"
            />
            
            {/* Poles positioned on the table */}
            <div className="absolute bottom-[35%] w-full h-full flex justify-center z-15 pointer-events-none">
              {[-180, -90, 0, 90, 180].map((offsetX, index) => (
                <div 
                  key={index} 
                  className="absolute flex flex-col items-center"
                  style={{ transform: `translateX(${offsetX}px)` }}
                >
                  <img
                    src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-2d95a654-7fe5-409a-8d5c-c9e9a6c6a263.png"
                    alt="Pole"
                    className="h-24 lg:h-32 object-contain drop-shadow-md"
                  />
                  {landedRings.includes(index) && (
                    <img
                      src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-6d37cde2-6565-47a1-a36d-c2d3e0584092.png"
                      alt="Landed Ring"
                      className="absolute bottom-3 h-12 lg:h-16 object-contain drop-shadow-md z-20 scale-125"
                      style={{ transform: "rotateX(70deg)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Draggable Ring */}
          {gameState !== "result" && gameState !== "guide" && (
            <div className="relative z-30 flex items-center justify-center">
              <motion.div
                drag={
                  gameState === "ready" || gameState === "dragging" ? true : false
                }
                dragConstraints={{ top: 0, left: -100, right: 100, bottom: 150 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={ringControls}
                className={`w-32 h-16 lg:w-40 lg:h-20 flex items-center justify-center ${
                  gameState === "ready" || gameState === "dragging" ? "cursor-grab active:cursor-grabbing" : ""
                } ${
                  gameState === "ready"
                    ? "hover:scale-105 transition-transform animate-pulse"
                    : ""
                }`}
                style={{ touchAction: "none" }}
              >
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-6d37cde2-6565-47a1-a36d-c2d3e0584092.png"
                  alt="Ring"
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
                />
              </motion.div>

              {/* Drag Indicator */}
              {gameState === "ready" && (
                <div className="absolute top-full mt-4 flex flex-col items-center justify-center pointer-events-none opacity-90 animate-bounce">
                  <div className="bg-black/60 text-white text-xs lg:text-sm font-bold px-3 py-1.5 rounded-full whitespace-nowrap mb-1">
                    Pull DOWN to aim
                  </div>
                  <div className="text-white text-2xl drop-shadow-md">⬇️</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Guide Popup */}
      {gameState === "guide" && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#001b3a] border-4 border-white/20 p-6 lg:p-8 rounded-3xl text-center shadow-2xl max-w-md w-full flex flex-col items-center"
          >
            <h2 className="text-2xl lg:text-3xl font-black text-white flex items-center justify-center gap-2 drop-shadow-md mb-2">
              <span>🎪</span> Ring Toss
            </h2>
            <div className="mb-4 text-base lg:text-lg text-[#ffcf00] font-black uppercase tracking-wide">
              Land 2 Rings to Unlock ALL Rewards!
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left space-y-3 w-full">
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">👇</span>
                <span><strong>Pull the ring down</strong> and aim carefully. Release to toss it!</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎯</span>
                <span>Land <strong>2 rings onto the poles</strong> within 5 throws to win.</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎁</span>
                <span>If you miss, you'll still receive <strong>1 FREE Job Ad</strong>.</span>
              </p>
            </div>

            <button
              onClick={() => setGameState("ready")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-[0_5px_15px_rgba(239,68,68,0.4)] border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
            >
              PLAY NOW
            </button>
          </motion.div>
        </div>
      )}

      {/* Result Popups */}
      {gameState === "result" && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 lg:p-8 rounded-3xl text-center shadow-2xl max-w-md w-full border-4 border-yellow-400 flex flex-col items-center"
          >
            {hasWon ? (
              <>
                <h2 className="text-3xl lg:text-4xl font-black text-green-500 mb-2 leading-tight">
                  🎉 Congratulations!
                </h2>
                <p className="text-lg text-gray-700 font-bold mb-2">
                  You landed {successfulRings} rings!
                </p>
                <p className="text-md text-red-500 font-bold mb-6">
                  You've unlocked ALL rewards!
                </p>

                <div className="w-full text-left space-y-2 mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-gray-800 text-center mb-2">
                    Rewards Awarded:
                  </h3>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">🎁</span> Mystery Box
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">📢</span> 1 FREE Job Ad
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">💳</span> 1 Ticket to Join TnGo Lucky Draw
                  </div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">🎟️</span> Voucher Up To RM477
                  </div>
                </div>
                
                <button
                  onClick={() => onComplete("all_rewards")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                >
                  CONTINUE ➔
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-gray-800 mb-2 leading-tight">
                  Good Try!
                </h2>
                <p className="text-lg text-gray-600 font-bold mb-2">
                  You didn't land enough rings.
                </p>
                <p className="text-md text-gray-500 font-bold mb-6">
                  You've still won:
                </p>

                <div className="w-full text-left space-y-2 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="text-sm font-semibold flex items-center gap-2 justify-center">
                    <span className="text-lg">📢</span> 1 FREE Job Ad
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleTryAgain}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-4 rounded-xl text-xl transition-colors shadow-sm border-2 border-gray-300"
                  >
                    TRY AGAIN
                  </button>
                  <button
                    onClick={() => onComplete("free_job_ad")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                  >
                    CONTINUE ➔
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
