import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface SoccerGameProps {
  onComplete: (prizeType: string) => void;
}

export default function SoccerGame({ onComplete }: SoccerGameProps) {
  const [gameState, setGameState] = useState<
    "ready" | "dragging" | "shooting" | "result"
  >("ready");
  const [goalScored, setGoalScored] = useState(false);
  const { width, height } = useWindowSize();

  const ballControls = useAnimation();
  const goalkeeperControls = useAnimation();

  const [gkX, setGkX] = useState(0);

  // Goalkeeper continuous movement
  useEffect(() => {
    if (gameState === "ready" || gameState === "dragging") {
      goalkeeperControls.start({
        x: [-80, 80, -80],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      goalkeeperControls.stop();
    }
  }, [gameState, goalkeeperControls]);

  const handleDragStart = () => {
    if (gameState !== "ready" && gameState !== "dragging") return;
    setGameState("dragging");
  };

  const handleDragEnd = async (event: any, info: any) => {
    if (gameState !== "dragging") return;

    const dragY = info.offset.y;
    const dragX = info.offset.x;

    // Only shoot if dragged backwards (downwards) enough
    if (dragY < 20) {
      setGameState("ready");
      return;
    }

    setGameState("shooting");

    // Calculate shot
    // Pulling down (positive Y) shoots up (negative Y)
    // Pulling left (negative X) shoots right (positive X)
    const power = Math.min(dragY * 3, 700); // Distance to travel up
    const directionX = -dragX * 3; // Horizontal travel

    const targetY = -power;
    const targetX = directionX;

    // A goal is scored if it reaches the goal line
    // and stays within the goal posts
    const hitGoalFrame = targetY <= -200 && Math.abs(targetX) < 280;

    // Simple goalkeeper collision: if it's in the middle third and hit goal frame
    const keeperBlocked =
      hitGoalFrame && Math.abs(targetX) < 80 && Math.random() > 0.3;

    const isGoal = hitGoalFrame && !keeperBlocked;

    let finalTargetY = targetY;
    if (isGoal) {
      // Clamp Y so it stops inside the net
      finalTargetY = Math.max(targetY, -350);
    }

    setGoalScored(isGoal);

    // Animate ball
    await ballControls.start({
      x: targetX,
      y: finalTargetY,
      scale: 0.5, // ball gets smaller as it goes away
      rotate: 720,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    });

    if (keeperBlocked) {
      // Animate keeper jumping to block
      goalkeeperControls.start({
        x: targetX,
        y: -50,
        transition: { duration: 0.2 },
      });
    }

    // Wait a moment then show result
    setTimeout(() => {
      setGameState("result");
    }, 500);
  };

  const handleTryAgain = () => {
    setGameState("ready");
    setGoalScored(false);
    ballControls.set({ x: 0, y: 0, scale: 1, rotate: 0 });
    goalkeeperControls.set({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center p-0 z-50 overflow-hidden bg-black">
      {gameState === "result" && goalScored && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          gravity={0.2}
          style={{ zIndex: 60 }}
        />
      )}

      <div className="w-full h-full relative overflow-hidden flex flex-col">
        {/* Field Pattern Background */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
          style={{
            backgroundImage:
              "url(https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8de2d3fe-aad8-4c7d-a90d-f2edcd959764.jpg)",
          }}
        ></div>

        {/* Header Instructions */}
        <div className="absolute top-[5%] lg:top-[8%] left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[500px] bg-[#0a1e3f] border-[3px] border-white/90 rounded-2xl p-4 lg:p-5 text-center shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
          <h2 className="text-[15px] lg:text-[18px] font-black text-white flex items-center justify-center gap-2 drop-shadow-md">
            <span>⚽</span> Score a Goal to Unlock{" "}
            <span className="text-[#ffcf00]">ALL</span> Rewards!
          </h2>
          <div className="mt-2 space-y-1 text-[12px] lg:text-[14px] text-white/90 font-medium">
            <p>Drag and pull the football to shoot.</p>
            <p>Score a goal to unlock every reward.</p>
            <p>
              Miss the goal and you'll still receive{" "}
              <span className="text-[#ffcf00] font-bold">1 FREE Job Ad</span>.
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative w-full perspective-[1000px] flex items-end justify-center pb-[12vh] lg:pb-[15vh]">
          {/* Goal Post */}
          <div className="absolute top-[25%] lg:top-[20%] left-1/2 -translate-x-1/2 w-[98%] max-w-[850px] aspect-[2/1] z-10 flex justify-center items-end">
            <img
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-7a7e777b-77a2-4085-8b9e-b548c487c871.png"
              alt="Goalpost"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
            />
            {/* Goalkeeper */}
            <motion.div
              animate={goalkeeperControls}
              className="absolute bottom-[10%] w-[25%] aspect-[3/4] flex flex-col items-center justify-start z-20 pointer-events-none"
            >
              <img
                src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-6277fdfc-0941-4439-abf4-765fab233a4d.png"
                alt="Goalkeeper"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
          </div>

          {/* Goal Line Area (invisible) */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-full max-w-[600px] h-1 z-0"></div>

          {/* Football */}
          <div className="relative z-30 flex items-center justify-center">
            <motion.div
              drag={
                gameState === "ready" || gameState === "dragging" ? true : false
              }
              dragConstraints={{ top: 0, left: -100, right: 100, bottom: 150 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={ballControls}
              className={`w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center cursor-grab active:cursor-grabbing ${gameState === "ready" ? "animate-bounce hover:scale-105 transition-transform" : ""}`}
              style={{ touchAction: "none" }}
            >
              <img
                src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-e441cc0e-d37a-4abc-a879-070a3ba4d1a6.png"
                alt="Football"
                className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
              />
            </motion.div>

            {/* Drag Indicator beside the ball */}
            {gameState === "ready" && (
              <div className="absolute left-[100%] ml-2 bottom-0 w-16 h-16 opacity-80 animate-pulse pointer-events-none">
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-79805c58-db10-4b86-a039-214ffeee5b04.png"
                  alt="Drag to shoot"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {gameState === "result" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 lg:p-10 max-w-md w-full text-center shadow-2xl border-4 border-green-600 flex flex-col items-center"
          >
            {goalScored ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-black text-green-600 mb-2 uppercase italic">
                  GOAL!
                </h2>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Congratulations!
                </h3>
                <p className="text-gray-600 mb-4">
                  You've unlocked ALL rewards!
                </p>

                <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl mb-6 w-full text-left flex flex-col gap-2">
                  <p className="font-black text-yellow-800 text-center mb-2">
                    Awards:
                  </p>
                  <div className="text-sm font-bold bg-white p-2 rounded border border-gray-200">
                    🎁 Mystery Box
                  </div>
                  <div className="text-sm font-bold bg-white p-2 rounded border border-gray-200">
                    📢 1 FREE Job Ad
                  </div>
                  <div className="text-sm font-bold bg-white p-2 rounded border border-gray-200">
                    💳 1 Ticket to Join TnGo Lucky Draw
                  </div>
                  <div className="text-sm font-bold bg-white p-2 rounded border border-gray-200">
                    🎟️ Voucher Up To RM477
                  </div>
                </div>

                <button
                  onClick={() => onComplete("all_rewards")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                >
                  CLAIM REWARDS
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🥺</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">
                  Good Try!
                </h2>
                <p className="text-gray-600 mb-4">
                  You didn't score this time.
                </p>

                <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-xl mb-6 w-full text-center">
                  <p className="font-bold text-gray-700 mb-2">
                    You've still won:
                  </p>
                  <div className="text-lg font-black text-blue-600">
                    📢 1 FREE Job Ad
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
                    CLAIM REWARD
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
