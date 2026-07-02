import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import PlinkoGame from "./PlinkoGame";
import SoccerGame from "./SoccerGame";

interface GameProps {
  onComplete: (won: boolean | string) => void;
}

const games = [
  {
    date: 30,
    month: 5,
    name: "Emoji Jackpot",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-18905397-0913-40af-a82a-a4204a032201.png",
    id: "jackpot",
  },
  {
    date: 1,
    month: 6,
    name: "Plinko Board",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-990f9c6b-9eec-42b2-b6a1-4ea72223901e.png",
    id: "plinko",
  },
  {
    date: 2,
    month: 6,
    name: "Soccer Challenge (NEW)",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-e7e04fbe-4b3d-4636-9a16-99056ca20706.png",
    id: "goal",
  },
  {
    date: 3,
    month: 6,
    name: "Ring Toss",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-7d116e58-f654-4df7-9683-cebd06ffca0b.png",
    id: "ring",
  },
  {
    date: 6,
    month: 6,
    name: "Pop Up Ballon",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-123e7d29-1dca-4cc3-8a10-9af721a8538d.png",
    id: "balloon",
  },
  {
    date: 7,
    month: 6,
    name: "Throw Dart",
    img: "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-49e99ff6-2602-4fa2-9eec-6cba367ef3e5.png",
    id: "dart",
  },
];

export default function Game({ onComplete }: GameProps) {
  const [gameState, setGameState] = useState<
    "selection" | "jackpot" | "plinko" | "goal" | "result"
  >("selection");
  const [gameResult, setGameResult] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinEmojis, setSpinEmojis] = useState(["❓", "❓", "❓"]);
  const { width, height } = useWindowSize();

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();

  const handlePlayGame = (gameId: string) => {
    if (gameId === "jackpot") {
      setGameState("jackpot");
      setIsSpinning(true);

      let iterations = 0;
      const allEmojis = [
        "💬",
        "📢",
        "👩‍💼",
        "🎉",
        "🎁",
        "🚀",
        "🌟",
        "💼",
        "🏆",
        "🔥",
      ];

      const interval = setInterval(() => {
        setSpinEmojis([
          allEmojis[Math.floor(Math.random() * allEmojis.length)],
          allEmojis[Math.floor(Math.random() * allEmojis.length)],
          allEmojis[Math.floor(Math.random() * allEmojis.length)],
        ]);
        iterations++;

        if (iterations > 20) {
          clearInterval(interval);
          setSpinEmojis(["💬", "📢", "👩‍💼"]);
          setIsSpinning(false);
        }
      }, 100);
    } else if (gameId === "plinko") {
      setGameState("plinko");
    } else if (gameId === "goal") {
      setGameState("goal");
    }
  };

  const handleAnswer = (correct: boolean) => {
    setGameResult(correct);
    setGameState("result");
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center overflow-y-auto"
      style={{
        backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-2119b2db-1800-41bf-a73e-66333d6cdd5d.jpg')`,
      }}
    >
      {gameState === "selection" && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

      <img
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-9520d447-0168-412d-9cd5-d083a3ab8884.png"
        alt="Logo"
        className="absolute top-4 left-4 lg:top-6 lg:left-8 h-6 lg:h-10 z-50 object-contain"
      />

      {/* Game Selection State */}
      {gameState === "selection" && (
        <div className="relative z-10 w-full max-w-5xl mt-10 mb-8 flex flex-col items-center">
          {/* Header Image added as requested */}
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8e7b7322-c9b5-4e4b-83e4-3c26f59bcd26.png"
            alt="Fuel Your Hiring"
            className="w-full max-w-[300px] sm:max-w-[400px] mb-8 drop-shadow-2xl z-20"
          />

          <div className="w-full bg-[repeating-linear-gradient(45deg,rgba(239,68,68,0.2),rgba(239,68,68,0.2)_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_40px)] backdrop-blur-xl rounded-3xl p-4 lg:p-8 shadow-[0_0_40px_rgba(234,179,8,0.3)] border-4 border-yellow-400 relative">
            <div className="relative inline-block mx-auto mb-10 w-full text-center">
              <div className="bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_15px,#dc2626_15px,#dc2626_30px)] rounded-full p-1.5 shadow-[0_0_30px_rgba(234,179,8,0.4)] border-4 border-yellow-400 inline-block">
                <div className="bg-white rounded-full px-8 py-3 border-4 border-yellow-300">
                  <h2 className="text-2xl lg:text-4xl font-black text-center text-red-600 drop-shadow-sm uppercase tracking-wider font-sans">
                    🎪 Select Mini Game to Play 🎪
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {games.map((g, i) => {
                const isActive =
                  g.date === currentDay && g.month === currentMonth;
                const displayActive =
                  isActive ||
                  g.id === "jackpot" ||
                  g.id === "plinko" ||
                  g.id === "goal";

                return (
                  <motion.div
                    key={i}
                    whileHover={displayActive ? { scale: 1.05, y: -5 } : {}}
                    className={`relative rounded-3xl p-6 flex flex-col items-center overflow-hidden transition-all ${
                      displayActive
                        ? "bg-gradient-to-b from-white/90 to-white/95 shadow-xl border-4 border-yellow-400"
                        : "bg-white/40 shadow-lg border-2 border-white/30 opacity-70 grayscale-[50%]"
                    }`}
                  >
                    {displayActive && (
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(234,179,8,0.1)_10px,rgba(234,179,8,0.1)_20px)] pointer-events-none"></div>
                    )}

                    <div
                      className={`font-bold px-4 py-1.5 rounded-full text-xs mb-6 uppercase tracking-widest shadow-md z-10 ${
                        displayActive
                          ? "bg-red-600 text-yellow-300"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {g.date} {g.month === 5 ? "June" : "July"} 2026
                    </div>

                    <div className="h-32 flex items-center justify-center mb-4 z-10">
                      <img
                        src={g.img}
                        className="max-h-full object-contain drop-shadow-xl"
                        alt={g.name}
                      />
                    </div>

                    <h3 className="font-black text-xl mb-6 text-gray-800 text-center h-14 flex items-center justify-center font-sans z-10 leading-tight">
                      {g.name}
                    </h3>

                    {displayActive ? (
                      <button
                        onClick={() => handlePlayGame(g.id)}
                        className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-900 border-b-[6px] border-yellow-600 font-black py-4 rounded-xl shadow-xl transition-all active:border-b-0 active:translate-y-2 uppercase tracking-wider z-10 text-lg"
                      >
                        PLAY NOW
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300/80 text-gray-600 font-bold py-4 rounded-xl cursor-not-allowed border-b-4 border-gray-400 z-10"
                      >
                        Coming Soon
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Jackpot Game State */}
      {gameState === "jackpot" && (
        <div className="relative z-10 w-full max-w-4xl h-screen flex flex-col items-center justify-center p-2 lg:p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_20px,#dc2626_20px,#dc2626_40px)] rounded-3xl p-2 lg:p-3 shadow-[0_0_50px_rgba(234,179,8,0.5)] border-4 lg:border-8 border-yellow-400 flex flex-col items-center text-center relative overflow-hidden w-full max-w-[95vw] lg:max-w-[1000px] max-h-[95vh]"
          >
            {/* Carnival lights decoration */}
            <div className="absolute inset-0 border-[4px] lg:border-[6px] border-dotted border-yellow-200 rounded-2xl opacity-80 pointer-events-none"></div>

            <div className="bg-white rounded-2xl p-3 lg:p-6 w-full h-full z-10 relative border-2 lg:border-4 border-yellow-300 shadow-inner flex flex-col justify-between">
              <h2 className="text-2xl lg:text-4xl font-black text-red-600 mb-2 lg:mb-4 drop-shadow-sm uppercase tracking-wider font-sans">
                🎪 Emoji Jackpot 🎪
              </h2>

              <div className="w-full relative flex flex-col items-center justify-center overflow-hidden mb-2 lg:mb-4 shrink-0">
                <img
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8c813016-c4de-4e0a-8b99-ac7c9982c6a5.png"
                  alt="Jackpot Machine"
                  className="object-contain w-full max-h-[35vh] lg:max-h-[45vh] drop-shadow-xl"
                />
                <div className="absolute top-[48%] left-[34%] w-[15%] h-[20%] flex items-center justify-center -translate-x-1/2">
                  <span className="text-3xl lg:text-6xl">{spinEmojis[0]}</span>
                </div>
                <div className="absolute top-[48%] left-[48%] w-[15%] h-[20%] flex items-center justify-center -translate-x-1/2">
                  <span className="text-3xl lg:text-6xl">{spinEmojis[1]}</span>
                </div>
                <div className="absolute top-[48%] left-[60%] w-[15%] h-[20%] flex items-center justify-center -translate-x-1/2">
                  <span className="text-3xl lg:text-6xl">{spinEmojis[2]}</span>
                </div>
              </div>

              {!isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full shrink-0"
                >
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 border-2 lg:border-4 border-dashed border-red-500 p-3 lg:p-4 rounded-xl lg:rounded-2xl w-full mb-3 lg:mb-6 shadow-lg shrink-0">
                    <p className="text-lg lg:text-xl font-black text-red-600 mb-1 lg:mb-2 uppercase tracking-wide font-sans">
                      ⭐ Hint ⭐
                    </p>
                    <p className="text-gray-900 font-bold text-sm lg:text-lg leading-snug font-sans">
                      A feature to let HRs and Employers send messages to
                      candidates in AJobThing.
                    </p>
                  </div>

                  <div className="flex flex-row gap-2 lg:gap-4 w-full shrink-0">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-red-900 border-b-[6px] border-yellow-600 font-black py-2 lg:py-4 px-2 lg:px-6 rounded-xl text-base lg:text-2xl transition-all shadow-xl active:border-b-0 active:translate-y-2 uppercase tracking-wide font-sans"
                    >
                      A. AJobThing Chat
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="flex-1 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-red-900 border-b-[6px] border-yellow-600 font-black py-2 lg:py-4 px-2 lg:px-6 rounded-xl text-base lg:text-2xl transition-all shadow-xl active:border-b-0 active:translate-y-2 uppercase tracking-wide font-sans"
                    >
                      B. Candidate Search
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Result State */}
      {gameState === "result" && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-md w-[90%] border-4 border-yellow-400 flex flex-col items-center"
          >
            {gameResult ? (
              <>
                <h2 className="text-3xl font-black text-green-500 mb-2 leading-tight">
                  Correct!
                </h2>
                <p className="text-lg text-gray-700 font-bold mb-6">
                  You got the right answer!
                </p>
                <div className="text-6xl mb-6">🎉</div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-red-500 mb-2 leading-tight">
                  Oops!
                </h2>
                <p className="text-lg text-gray-700 font-bold mb-6">
                  The correct answer is AJobThing Chat. However, you can still
                  enjoy the reward. Claim now.
                </p>
                <div className="text-6xl mb-6">🎁</div>
              </>
            )}

            <button
              onClick={() => onComplete(gameResult)}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform shadow-lg border border-orange-300"
            >
              CONTINUE
            </button>
          </motion.div>
        </div>
      )}

      {/* Plinko Game State */}
      {gameState === "plinko" && <PlinkoGame onComplete={onComplete} />}

      {/* Soccer Game State */}
      {gameState === "goal" && <SoccerGame onComplete={onComplete} />}
    </div>
  );
}
