import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PlinkoGameProps {
  onComplete: (prizeType: string) => void;
}

const PRIZES = [
  { id: 0, name: "Mystery Box", type: "mystery_box" },
  { id: 1, name: "1 Free Job Ad", type: "free_job_ad" },
  { id: 2, name: "TnGo E-Wallet", type: "tngo", grand: true },
  { id: 3, name: "Voucher RM477", type: "voucher" },
  { id: 4, name: "1 Free Job Ad", type: "free_job_ad" },
];

export default function PlinkoGame({ onComplete }: PlinkoGameProps) {
  const [gameState, setGameState] = useState<"ready" | "dropping" | "finished">(
    "ready",
  );
  const [selectedPrize, setSelectedPrize] = useState<number | null>(null);
  const [coinPath, setCoinPath] = useState<{ x: number[]; y: number[] }>({
    x: [0],
    y: [0],
  });
  const { width, height } = useWindowSize();
  const boardRef = useRef<HTMLDivElement>(null);
  const coinX = useMotionValue(0);

  // Constants for board
  const ROWS = 8;
  const COLUMNS = 9;

  const dropCoin = () => {
    if (gameState !== "ready") return;
    setGameState("dropping");

    // 1. Determine prize based on weighted probability (reduced free job ad)
    const rand = Math.random();
    let targetBucket = 0;
    if (rand < 0.35)
      targetBucket = 0; // 35% Mystery Box
    else if (rand < 0.5)
      targetBucket = 1; // 15% Free Job Ad (Left)
    else if (rand < 0.6)
      targetBucket = 2; // 10% TnGo E-Wallet Lucky Draw
    else if (rand < 0.85)
      targetBucket = 3; // 25% Voucher Up To RM477
    else targetBucket = 4; // 15% Free Job Ad (Right)

    setSelectedPrize(targetBucket);

    const startX = coinX.get();

    // 2. Generate smooth physics-like path
    const targetXForBucket = [-150, -75, 0, 75, 150]; // Approximate px offsets for 5 buckets
    const targetX = targetXForBucket[targetBucket];

    const xFrames = [startX];
    const yFrames = [0];

    let currentY = 0;
    const Y_STEP = 45; // Row spacing

    for (let i = 1; i <= ROWS; i++) {
      currentY += Y_STEP;
      const progress = i / ROWS;

      // Interpolate X position towards the target bucket
      let nextX = startX + (targetX - startX) * progress;

      if (i < ROWS) {
        // Add random peg bounce offset
        nextX += (Math.random() - 0.5) * 50;
      }

      const prevX = xFrames[xFrames.length - 1];
      const midX = (prevX + nextX) / 2;

      // Bounce up slightly when hitting a peg
      xFrames.push(midX);
      yFrames.push(currentY - 15);

      xFrames.push(nextX);
      yFrames.push(currentY);
    }

    // Final drop into bucket
    xFrames.push(targetX);
    yFrames.push(currentY + 50);

    setCoinPath({ x: xFrames, y: yFrames });

    // 4. Wait for animation to finish
    setTimeout(
      () => {
        setGameState("finished");
      },
      xFrames.length * 150 + 500,
    );
  };

  const pegs = [];
  for (let r = 0; r <= ROWS; r++) {
    const isOdd = r % 2 !== 0;
    const cols = isOdd ? COLUMNS + 1 : COLUMNS;
    for (let c = 0; c < cols; c++) {
      pegs.push(
        <div
          key={`peg-${r}-${c}`}
          className="absolute w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8),inset_0_2px_2px_rgba(255,255,255,0.8)] border border-yellow-100"
          style={{
            top: `${r * 45 + 50}px`,
            left: `calc(50% + ${(c - Math.floor(cols / 2)) * 60 + (isOdd ? 30 : 0)}px)`,
            transform: "translateX(-50%)",
          }}
        />,
      );
    }
  }

  return (
    <div className="relative w-full max-w-4xl h-screen flex flex-col items-center justify-center p-2 lg:p-4 z-10 mx-auto">
      {gameState === "finished" && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          gravity={0.2}
        />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-8 w-full max-w-5xl"
      >
        {/* Left Side: Game Board */}
        <div className="flex-1 bg-yellow-900 rounded-3xl p-2 lg:p-4 shadow-[0_0_50px_rgba(234,179,8,0.3)] border-4 lg:border-8 border-yellow-500 relative">
          <div className="bg-[#1a2f60] rounded-2xl w-full h-full z-10 relative border-4 border-[#122247] shadow-inner flex flex-col overflow-hidden">
            <div className="pt-6 pb-2 bg-gradient-to-b from-[#0f1f45] to-transparent flex flex-col items-center justify-center z-20">
              <h2 className="text-4xl lg:text-5xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] uppercase tracking-wider font-sans mb-1">
                PLINKO
              </h2>
              <div className="bg-red-600 text-white font-bold text-xs lg:text-sm px-6 py-1 rounded-full uppercase tracking-widest shadow-md border-b-2 border-red-800">
                Drop, Bounce, Win!
              </div>
            </div>

            {/* Board Area */}
            <div className="h-[420px] relative w-full mt-2" ref={boardRef}>
              {pegs}

              {/* The Coin */}
              <motion.div
                className={`absolute w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.8),inset_0_2px_4px_rgba(255,255,255,0.8)] z-40 flex items-center justify-center cursor-grab active:cursor-grabbing ${gameState === "ready" ? "hover:scale-110 transition-transform" : ""}`}
                style={{
                  top: "0px",
                  left: "calc(50% - 20px)",
                  x: gameState === "ready" ? coinX : undefined,
                }}
                drag={gameState === "ready" ? "x" : false}
                dragConstraints={{ left: -160, right: 160 }}
                dragElastic={0.1}
                dragMomentum={false}
                onClick={dropCoin}
                animate={
                  gameState === "dropping" || gameState === "finished"
                    ? {
                        x: coinPath.x,
                        y: coinPath.y,
                        rotate: 360 * 4,
                      }
                    : {
                        y: [0, -8, 0],
                      }
                }
                transition={
                  gameState === "dropping" || gameState === "finished"
                    ? {
                        duration: coinPath.x.length * 0.12,
                        ease: "linear",
                        times: coinPath.x.map(
                          (_, i) => i / (coinPath.x.length - 1),
                        ),
                      }
                    : {
                        y: {
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        },
                      }
                }
              >
                <div className="w-6 h-6 border border-yellow-700/30 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-lg drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                    ★
                  </span>
                </div>
              </motion.div>

              {gameState === "ready" && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 text-yellow-300 font-black text-sm lg:text-base animate-pulse whitespace-nowrap z-20 flex flex-col items-center pointer-events-none drop-shadow-md">
                  <span className="text-2xl mb-1">↔️</span>
                  <span className="bg-black/40 px-3 py-1 rounded-full">
                    Drag to aim, Tap to drop!
                  </span>
                </div>
              )}
            </div>

            {/* Prize Buckets */}
            <div className="h-28 lg:h-32 flex flex-row border-t-8 border-[#0f1f45] relative z-20 overflow-hidden rounded-b-xl">
              {PRIZES.map((prize, idx) => {
                let bgColor = "bg-blue-800";
                let borderColor = "border-blue-900";
                let textColor = "text-white";

                if (idx === 0) {
                  bgColor = "bg-purple-800";
                  borderColor = "border-purple-950";
                } else if (idx === 2) {
                  bgColor = "bg-yellow-400";
                  borderColor = "border-yellow-600";
                  textColor = "text-yellow-900";
                } else if (idx === 3) {
                  bgColor = "bg-red-600";
                  borderColor = "border-red-800";
                }

                return (
                  <div
                    key={idx}
                    className={`flex-1 flex flex-col items-center justify-center p-1 relative border-r-4 ${borderColor} ${bgColor} ${gameState === "finished" && selectedPrize === idx ? "opacity-100 ring-inset ring-4 ring-white animate-pulse" : "opacity-90"}`}
                  >
                    {prize.grand && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-red-600 text-yellow-300 text-[10px] font-black px-3 py-1 rounded-t-lg uppercase tracking-widest shadow-lg whitespace-nowrap flex items-center gap-1 z-10 border-t border-l border-r border-red-500">
                        <span>★</span> GRAND PRIZE <span>★</span>
                      </div>
                    )}
                    <span
                      className={`text-[10px] lg:text-sm font-black text-center px-1 leading-tight ${textColor} drop-shadow-sm`}
                    >
                      {prize.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: How to Play */}
        <div className="w-full lg:w-72 shrink-0 bg-yellow-100 rounded-3xl border-4 lg:border-8 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex flex-col overflow-hidden relative">
          <div className="bg-red-600 border-b-4 border-red-800 py-4 px-2 text-center flex items-center justify-between relative">
            <div className="flex space-x-1 absolute left-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            </div>
            <h3 className="text-white font-black text-xl w-full uppercase tracking-widest text-center">
              HOW TO PLAY
            </h3>
            <div className="flex space-x-1 absolute right-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 flex-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.5)_10px,rgba(255,255,255,0.5)_20px)]">
            <div className="flex items-center gap-4 bg-white/80 p-3 rounded-xl shadow-sm border border-yellow-200">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-yellow-900 shrink-0 border-2 border-yellow-500">
                1
              </div>
              <p className="text-sm font-bold text-yellow-900">
                Click to drop the coin
              </p>
              <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-600 shadow-sm flex items-center justify-center text-[8px] text-yellow-900">
                ★
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/80 p-3 rounded-xl shadow-sm border border-yellow-200">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-yellow-900 shrink-0 border-2 border-yellow-500">
                2
              </div>
              <p className="text-sm font-bold text-yellow-900">
                Watch it bounce down the board
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/80 p-3 rounded-xl shadow-sm border border-yellow-200">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-yellow-900 shrink-0 border-2 border-yellow-500">
                3
              </div>
              <p className="text-sm font-bold text-yellow-900">
                Land in a slot to win a prize!
              </p>
            </div>
          </div>

          <div className="bg-yellow-900 h-8 flex items-center justify-around px-2 border-t-4 border-yellow-950">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full bg-red-500 border border-red-300"
              ></span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Result Modal */}
      {gameState === "finished" && selectedPrize !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 lg:p-10 max-w-md w-full text-center shadow-2xl border-4 border-yellow-400 flex flex-col items-center"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-600 mb-2">You Won:</p>
            <div className="bg-yellow-100 border-2 border-yellow-300 px-6 py-3 rounded-xl mb-8">
              <span className="text-2xl font-black text-red-600">
                {PRIZES[selectedPrize].name}
              </span>
            </div>

            <button
              onClick={() => onComplete(PRIZES[selectedPrize].type)}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
            >
              CONTINUE
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
