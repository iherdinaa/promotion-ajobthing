import React, { useState, useRef } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface ThrowDartGameProps {
  onComplete: (won: boolean | string) => void;
}

interface AttachedBall {
  id: number;
  x: number;
  y: number;
  score: number;
}

export default function ThrowDartGame({ onComplete }: ThrowDartGameProps) {
  const { width, height } = useWindowSize();
  const [gameState, setGameState] = useState<
    "guide" | "ready" | "dragging" | "flying" | "result"
  >("guide");
  const [ballsRemaining, setBallsRemaining] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [highestThrow, setHighestThrow] = useState(0);
  const [message, setMessage] = useState("");
  const [attachedBalls, setAttachedBalls] = useState<AttachedBall[]>([]);
  const [hasHitBullseye, setHasHitBullseye] = useState(false);

  const ballControls = useAnimation();
  const boardRef = useRef<HTMLDivElement>(null);

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
      ballControls.set({ x: 0, y: 0, scale: 1 });
      return;
    }

    setGameState("flying");
    const newBalls = ballsRemaining - 1;
    setBallsRemaining(newBalls);

    // Calculate ball trajectory based on drag
    const powerY = Math.min(dragY * 3, 800);
    const targetY = -powerY;
    const targetX = -dragX * 3;

    const boardRect = boardRef.current?.getBoundingClientRect();
    const windowW = window.innerWidth;
    const startX = windowW / 2;
    
    let isHit = false;
    let hitScore = 0;
    let hitPctX = 50;
    let hitPctY = 50;

    if (boardRect) {
        // Approximate ball position at end of animation
        const ballEndX = startX + targetX;
        const ballEndY = (window.innerHeight * 0.8) + targetY;

        // Check if ball is inside board bounds
        if (
            ballEndX >= boardRect.left && 
            ballEndX <= boardRect.right &&
            ballEndY >= boardRect.top &&
            ballEndY <= boardRect.bottom
        ) {
            isHit = true;
            hitPctX = ((ballEndX - boardRect.left) / boardRect.width) * 100;
            hitPctY = ((ballEndY - boardRect.top) / boardRect.height) * 100;

            // Calculate distance from center (50, 50) to determine score
            const distX = hitPctX - 50;
            const distY = hitPctY - 50;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Determine score based on distance (assuming circular rings)
            // The board image is a dart board, we can approximate the rings
            if (distance < 5) {
              hitScore = 20; // Bullseye
              setHasHitBullseye(true);
            } else if (distance < 12) {
              hitScore = 18;
            } else if (distance < 20) {
              hitScore = 16;
            } else if (distance < 28) {
              hitScore = 14;
            } else if (distance < 36) {
              hitScore = 12;
            } else if (distance < 45) {
              hitScore = 10;
            } else {
              hitScore = 0; // Missed the scoring rings but hit the board
              isHit = false;
            }
        }
    }

    // Arc up
    await ballControls.start({
      x: targetX,
      y: targetY,
      scale: 0.3,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    });

    if (isHit) {
      setAttachedBalls((prev) => [
        ...prev,
        { id: Date.now(), x: hitPctX, y: hitPctY, score: hitScore },
      ]);
      setTotalScore((prev) => prev + hitScore);
      if (hitScore > highestThrow) {
        setHighestThrow(hitScore);
      }
      
      if (hitScore === 20) {
        setMessage("🎯 Bullseye!\n20 Points!");
      } else {
        setMessage(`+${hitScore}`);
      }
      
      // Ball sticks, we just fade the thrown ball and we show it in attachedBalls
      ballControls.set({ opacity: 0 });
    } else {
      // Miss
      setMessage("❌ Miss!");
      ballControls.start({
        y: targetY + 200,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
      });
    }

    setTimeout(() => {
      setMessage("");
      
      const newTotal = totalScore + hitScore;
      const willWin = hasHitBullseye || hitScore === 20 || newTotal > 15;

      if (willWin || newBalls === 0) {
        setGameState("result");
      } else {
        setGameState("ready");
        ballControls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
      }
    }, 1200);
  };

  const handleTryAgain = () => {
    setGameState("ready");
    setBallsRemaining(3);
    setTotalScore(0);
    setHighestThrow(0);
    setHasHitBullseye(false);
    setAttachedBalls([]);
    ballControls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
  };

  const hasWon = hasHitBullseye || totalScore > 15;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center p-0 z-50 overflow-hidden bg-black">
      {gameState === "result" && hasWon && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={400}
          gravity={0.2}
          style={{ zIndex: 60 }}
        />
      )}

      <div className="w-full h-full relative overflow-hidden flex flex-col bg-[#1f2937]">
        {/* Pattern Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-80"
          style={{
            backgroundImage:
              "url(https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-cb0737d0-334c-4dde-b4a3-cf8314f5b3f8.jpg)",
          }}
        ></div>

        {/* Counters */}
        <div className="absolute top-[12%] lg:top-[8%] left-1/2 -translate-x-1/2 z-20 flex gap-2 lg:gap-4 w-full max-w-[600px] justify-center px-4">
          <div className="bg-white/95 backdrop-blur border-2 border-red-400 rounded-xl p-2 px-3 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Current Score
            </div>
            <div className="text-xl lg:text-2xl font-black text-red-600">
              {totalScore}
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur border-2 border-green-400 rounded-xl p-2 px-3 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Highest Throw
            </div>
            <div className="text-xl lg:text-2xl font-black text-green-600">
              {highestThrow}
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur border-2 border-blue-400 rounded-xl p-2 px-3 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Remaining Balls
            </div>
            <div className="text-xl lg:text-2xl font-black text-blue-600">
              {ballsRemaining} / 3
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative w-full flex items-end justify-center pb-[10vh] lg:pb-[12vh]">
          {/* Success/Miss Message */}
          {message && (
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 z-50 text-4xl lg:text-5xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] animate-bounce text-center whitespace-pre-line">
              {message}
            </div>
          )}

          {/* Dart Board */}
          <div className="absolute top-[22%] lg:top-[16%] left-1/2 -translate-x-1/2 w-[100%] max-w-[650px] z-10 flex flex-col justify-center items-center h-[60%] lg:h-[70%]">
            <div ref={boardRef} className="relative w-full aspect-square max-h-full flex items-center justify-center">
                <img
                    src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-366da48f-7ecf-400b-8a8e-198a75434ec3.png"
                    alt="Dart Board"
                    className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                />
                
                {/* Attached Balls on the board */}
                <div className="absolute inset-0 z-20 m-auto" style={{ width: '100%', height: '100%' }}>
                    {attachedBalls.map((ball) => (
                        <motion.div 
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            key={ball.id} 
                            className="absolute flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 -ml-4 -mt-4 lg:-ml-6 lg:-mt-6"
                            style={{ 
                                left: `${ball.x}%`, 
                                top: `${ball.y}%`
                            }}
                        >
                            <img
                                src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-1a117b83-fc95-4698-a9dc-84097779e9e5.png"
                                alt="Sticky Ball"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
          </div>

          {/* Draggable Ball */}
          {gameState !== "result" && gameState !== "guide" && (
            <div className="relative z-40 flex items-center justify-center h-[20vh]">
              <motion.div
                drag={
                  gameState === "ready" || gameState === "dragging" ? true : false
                }
                dragConstraints={{ top: 0, left: -100, right: 100, bottom: 150 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={ballControls}
                className={`w-16 h-16 lg:w-24 lg:h-24 flex items-center justify-center ${
                  gameState === "ready" || gameState === "dragging" ? "cursor-grab active:cursor-grabbing" : ""
                } ${
                  gameState === "ready"
                    ? "hover:scale-105 transition-transform"
                    : ""
                }`}
                style={{ touchAction: "none" }}
              >
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-1a117b83-fc95-4698-a9dc-84097779e9e5.png"
                  alt="Sticky Ball"
                  className="w-full h-full object-contain drop-shadow-xl pointer-events-none"
                />
              </motion.div>

              {/* Drag Indicator */}
              {gameState === "ready" && (
                <div className="absolute top-[80%] mt-4 flex flex-col items-center justify-center pointer-events-none opacity-90 animate-bounce z-50">
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
              <span>🎯</span> Throw Ball Dart Challenge
            </h2>
            <div className="mb-4 text-sm lg:text-base text-[#ffcf00] font-black uppercase tracking-wide">
              Hit the Bullseye or Score Above 15 to Unlock ALL Rewards!
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left space-y-3 w-full">
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">👇</span>
                <span><strong>Drag the ball backward</strong>, aim carefully, and release to throw.</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎯</span>
                <span>Hit the <strong>Bullseye</strong> or score <strong>more than 15 points</strong> to unlock every reward.</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎁</span>
                <span>Otherwise, you'll still receive <strong>1 FREE Job Ad</strong>.</span>
              </p>
            </div>

            <button
              onClick={() => setGameState("ready")}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-[0_5px_15px_rgba(239,68,68,0.4)] border-b-4 border-pink-800 active:border-b-0 active:translate-y-1"
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
            className="bg-white p-6 lg:p-8 rounded-3xl text-center shadow-2xl max-w-md w-full border-4 border-blue-400 flex flex-col items-center"
          >
            {hasWon ? (
              <>
                <h2 className="text-3xl lg:text-4xl font-black text-green-500 mb-2 leading-tight">
                  {hasHitBullseye ? "🎉 Bullseye!" : "🎉 Great Throw!"}
                </h2>
                <p className="text-lg text-gray-700 font-bold mb-2">
                  Congratulations!
                </p>
                <p className="text-md text-red-500 font-bold mb-6">
                  You've unlocked ALL rewards!
                </p>

                <div className="w-full text-left space-y-2 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
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
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
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
                  You didn't reach the winning score.
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
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
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
