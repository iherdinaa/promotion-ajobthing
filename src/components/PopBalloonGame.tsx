import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PopBalloonGameProps {
  onComplete: (won: boolean | string) => void;
}

type BalloonColor = "yellow" | "red" | "pink" | "green" | "blue";

interface Balloon {
  id: number;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  color: BalloonColor;
  popped: boolean;
}

const BALLOON_ASSETS: Record<BalloonColor, string> = {
  yellow: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-a33ac4f4-6185-4bc9-9446-f47c23572296.png",
  red: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-7de37138-26e7-4e57-8816-bb8318fae1a0.png",
  pink: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-db5ce24b-b8e1-442b-adb6-218ddb7da335.png",
  green: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-485c05f7-dae2-4b3a-a3a5-03fbbf1a5b9c.png",
  blue: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-97600530-c603-4581-8760-520939a60088.png",
};

export default function PopBalloonGame({ onComplete }: PopBalloonGameProps) {
  const { width, height } = useWindowSize();
  const [gameState, setGameState] = useState<
    "guide" | "ready" | "dragging" | "flying" | "result"
  >("guide");
  const [dartsRemaining, setDartsRemaining] = useState(5);
  const [balloonsPopped, setBalloonsPopped] = useState(0);
  const [message, setMessage] = useState("");
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  const dartControls = useAnimation();
  const boardRef = useRef<HTMLDivElement>(null);

  const initBalloons = () => {
    const newBalloons: Balloon[] = [];
    const colors: BalloonColor[] = ["yellow", "red", "pink", "green", "blue"];
    const numBalloons = Math.floor(Math.random() * 21) + 40; // 40 to 60 balloons
    
    // Grid-based random placement to ensure good coverage
    const cols = 8;
    const rows = 7;
    const cellW = 100 / cols;
    const cellH = 100 / rows;

    for (let i = 0; i < numBalloons; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols) % rows;
      
      const offsetX = Math.random() * (cellW * 0.6);
      const offsetY = Math.random() * (cellH * 0.6);
      
      newBalloons.push({
        id: i,
        x: col * cellW + offsetX,
        y: row * cellH + offsetY,
        color: colors[Math.floor(Math.random() * colors.length)],
        popped: false,
      });
    }
    setBalloons(newBalloons);
  };

  useEffect(() => {
    initBalloons();
  }, []);

  const handleDragStart = () => {
    if (gameState === "ready") {
      setGameState("dragging");
    }
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (gameState === "dragging") {
      const dragX = info.offset.x;
      // targetX will be -dragX * 5
      const rotateZ = (-dragX * 5) / 15;
      dartControls.set({ rotateZ });
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
      dartControls.set({ x: 0, y: 0, scale: 1, rotateZ: 0 });
      return;
    }

    setGameState("flying");
    const newDarts = dartsRemaining - 1;
    setDartsRemaining(newDarts);

    // Calculate dart trajectory based on drag
    // Pulling down (positive Y) shoots up (negative Y)
    // Pulling left (negative X) shoots right (positive X)
    const powerY = Math.min(dragY * 3, 800);
    const targetY = -powerY;
    const targetX = -dragX * 5;

    // We need to map targetX, targetY to board coordinates
    const boardRect = boardRef.current?.getBoundingClientRect();
    const windowW = window.innerWidth;
    
    let isHit = false;
    let hitBalloonId = -1;

    // Approximate where the dart lands in the viewport
    // The dart starts roughly at center bottom
    const startX = windowW / 2;
    // We assume the board occupies roughly 15% to 65% of screen height from top
    // For simplicity, we just use the targetX/Y offsets relative to center
    
    if (boardRect) {
        // Calculate dart tip position at end of animation (approximate)
        // Dart starts at 80% height, middle width
        const dartEndX = startX + targetX;
        const dartEndY = (window.innerHeight * 0.8) + targetY;

        // Check if dart tip is inside board bounds
        if (
            dartEndX >= boardRect.left && 
            dartEndX <= boardRect.right &&
            dartEndY >= boardRect.top &&
            dartEndY <= boardRect.bottom
        ) {
            // Convert to percentage of board
            const hitPctX = ((dartEndX - boardRect.left) / boardRect.width) * 100;
            const hitPctY = ((dartEndY - boardRect.top) / boardRect.height) * 100;

            // Check collision with balloons
            for (let i = balloons.length - 1; i >= 0; i--) {
                const b = balloons[i];
                if (!b.popped) {
                    // Parent container is 75% width, 65% height, centered horizontally (12.5% left), top is (17.5% - 5% = 12.5%)
                    const balloonBoardX = 12.5 + (b.x * 0.75);
                    const balloonBoardY = 12.5 + (b.y * 0.65);

                    // Approximate balloon hit box
                    if (
                        Math.abs(hitPctX - (balloonBoardX + 5)) < 8 && 
                        Math.abs(hitPctY - (balloonBoardY + 10)) < 12
                    ) {
                        isHit = true;
                        hitBalloonId = b.id;
                        break;
                    }
                }
            }
        }
    }

    // Determine target rotation based on X velocity
    const rotateZ = (targetX / 15);

    // Arc up
    await dartControls.start({
      x: targetX,
      y: targetY,
      scale: 0.4,
      rotateZ: rotateZ,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    });

    if (isHit) {
      // Pop balloon
      setBalloons((prev) => 
        prev.map((b) => b.id === hitBalloonId ? { ...b, popped: true } : b)
      );
      setMessage("🎈 POP!\nNice Shot!");
      setBalloonsPopped((prev) => prev + 1);
      
      // Dart falls after popping
      dartControls.start({
        y: targetY + 200,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
      });
    } else {
      // Stick into board or fall
      setMessage("❌ Miss!");
    }

    setTimeout(() => {
      setMessage("");
      const updatedSuccess = isHit ? balloonsPopped + 1 : balloonsPopped;

      if (updatedSuccess >= 2 || newDarts === 0) {
        setGameState("result");
      } else {
        setGameState("ready");
        dartControls.set({ x: 0, y: 0, scale: 1, rotateZ: 0, opacity: 1 });
      }
    }, 1200);
  };

  const handleTryAgain = () => {
    setGameState("ready");
    setDartsRemaining(5);
    setBalloonsPopped(0);
    initBalloons();
    dartControls.set({ x: 0, y: 0, scale: 1, rotateZ: 0, opacity: 1 });
  };

  const hasWon = balloonsPopped >= 2;

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
        {/* Field Pattern Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-80"
          style={{
            backgroundImage:
              "url(https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-4459a269-5c6c-40f2-8e9c-c775e12f9b2f.jpg)",
          }}
        ></div>

        {/* Counters */}
        <div className="absolute top-[8%] lg:top-[10%] left-1/2 -translate-x-1/2 z-20 flex gap-4 w-full max-w-[400px] justify-center px-4">
          <div className="bg-white/95 backdrop-blur border-2 border-red-400 rounded-xl p-2 px-4 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Darts Remaining
            </div>
            <div className="text-xl lg:text-2xl font-black text-red-600">
              {dartsRemaining} / 5
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur border-2 border-green-400 rounded-xl p-2 px-4 shadow-lg text-center flex-1">
            <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Balloons Popped
            </div>
            <div className="text-xl lg:text-2xl font-black text-green-600">
              {balloonsPopped} / 2
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative w-full flex items-end justify-center pb-[10vh] lg:pb-[12vh]">
          {/* Success/Miss Message */}
          {message && (
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 z-50 text-3xl lg:text-5xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] animate-bounce text-center whitespace-pre-line">
              {message}
            </div>
          )}

          {/* Balloon Board */}
          <div className="absolute top-[8%] lg:top-[5%] left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] z-10 flex flex-col justify-center items-center h-[85%] lg:h-[90%]">
            <div ref={boardRef} className="relative w-full h-full flex items-center justify-center">
                <img
                    src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-e65eecfd-167d-416d-8dc1-4df97f66b5c8.png"
                    alt="Balloon Board"
                    className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                />
                
                {/* Balloons positioned on the board */}
                <div className="absolute inset-0 z-20 m-auto" style={{ width: '75%', height: '65%', top: '-5%' }}>
                    {balloons.map((balloon) => (
                        <div 
                            key={balloon.id} 
                            className="absolute flex flex-col items-center justify-center"
                            style={{ 
                                left: `${balloon.x}%`, 
                                top: `${balloon.y}%`,
                                width: '12%',
                                height: '22%'
                            }}
                        >
                            {!balloon.popped && (
                                <img
                                    src={BALLOON_ASSETS[balloon.color]}
                                    alt="Balloon"
                                    className="w-full h-full object-contain drop-shadow-md animate-pulse"
                                    style={{ animationDuration: `${2 + Math.random() * 2}s` }}
                                />
                            )}
                            {balloon.popped && (
                                <div className="w-full h-full relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-yellow-400 rounded-full animate-ping opacity-0"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Draggable Dart */}
          {gameState !== "result" && gameState !== "guide" && (
            <div className="relative z-40 flex items-center justify-center h-[25vh]">
              <motion.div
                drag={
                  gameState === "ready" || gameState === "dragging" ? true : false
                }
                dragConstraints={{ top: 0, left: -100, right: 100, bottom: 150 }}
                dragElastic={0.2}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={dartControls}
                className={`w-24 h-36 lg:w-32 lg:h-48 flex items-center justify-center origin-bottom ${
                  gameState === "ready" || gameState === "dragging" ? "cursor-grab active:cursor-grabbing" : ""
                } ${
                  gameState === "ready"
                    ? "hover:scale-105 transition-transform"
                    : ""
                }`}
                style={{ touchAction: "none" }}
              >
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-707ed357-f3ad-4468-a6c2-e28f1f806302.png"
                  alt="Dart"
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
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
              <span>🎈</span> Pop Balloon
            </h2>
            <div className="mb-4 text-base lg:text-lg text-[#ffcf00] font-black uppercase tracking-wide">
              Pop 2 Balloons to Unlock ALL Rewards!
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6 text-left space-y-3 w-full">
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">👇</span>
                <span><strong>Pull the dart down</strong> and aim carefully. Release to throw!</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎯</span>
                <span>Pop <strong>2 balloons</strong> within 5 darts to win.</span>
              </p>
              <p className="text-white/90 text-sm font-medium flex gap-3 items-start">
                <span className="text-xl">🎁</span>
                <span>If you miss, you'll still receive <strong>1 FREE Job Ad</strong>.</span>
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
                  🎉 Great Shot!
                </h2>
                <p className="text-lg text-gray-700 font-bold mb-2">
                  You popped {balloonsPopped} balloons!
                </p>
                <p className="text-md text-red-500 font-bold mb-6">
                  You've unlocked ALL rewards!
                </p>

                <div className="w-full text-left space-y-2 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
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
                  You didn't pop enough balloons.
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
