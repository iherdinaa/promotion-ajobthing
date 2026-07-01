import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface RewardScreenProps {
  onPlayAgain: () => void;
  gameWon: boolean | string;
  headcount?: string;
}

const VoucherPrize = () => (
  <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 flex flex-col items-center text-center w-full">
    <h3 className="text-xl font-black text-orange-800 mb-6">
      AJobThing Voucher
    </h3>
    <div className="flex flex-col items-center">
      <img
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-32b78986-c8d5-48e2-997b-7b1ca52460fd.png"
        className="h-40 object-contain drop-shadow-lg"
        alt="AJobThing Voucher"
      />
      <span className="text-lg font-bold text-orange-900 mt-4">
        Up to RM477 OFF
      </span>
      <span className="text-sm text-gray-500 mt-2 font-bold">
        (Valid until 7 July 2026)
      </span>
    </div>
  </div>
);

const TnGoPrize = () => (
  <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 flex flex-col items-center text-center w-full h-full">
    <h3 className="text-xl font-black text-blue-800 mb-6">
      1 Ticket to Join Lucky Draw
    </h3>
    <div className="flex flex-col items-center justify-center flex-1 relative w-full h-full">
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
        <img
          src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-3b14d0e8-ef24-45d6-897c-eaf15d9f9fec.png"
          className="relative h-40 object-contain drop-shadow-xl z-10"
          alt="TnGo Lucky Draw"
        />
        <span className="text-sm font-bold text-gray-600 mt-4 px-4 py-2 bg-white rounded-lg shadow-sm">
          Winners will be announced on 7 July 2026
        </span>
      </div>
    </div>
  </div>
);

const FreeJobAdPrize = () => (
  <div className="w-full max-w-4xl bg-gray-50 rounded-2xl p-4 lg:p-6 border-2 border-gray-200 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 lg:gap-8 mx-auto">
    <div className="flex flex-col items-center justify-center shrink-0">
      <h3 className="text-xl font-black text-gray-800 mb-2">
        1 Free Internship Job Ad
      </h3>
      <img
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-597cc0ba-7ed7-49b6-acc7-4c28650f79ad.png"
        className="h-28 lg:h-32 object-contain drop-shadow-lg"
        alt="Free Internship Job Ad"
      />
    </div>

    <div className="flex flex-col items-center md:items-start gap-4 w-full">
      <span className="text-sm lg:text-base text-gray-700 font-bold bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm w-full">
        Free Intern Job Ad will be assigned to your account. Login and post job
        now before expired in 7 days.
      </span>

      <a
        href="https://www.ajobthing.com/login?redirect=/campaign/rewards"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black py-3 lg:py-4 px-10 rounded-xl text-lg shadow-lg hover:scale-105 transition-transform mt-2 text-center"
      >
        Post Job Now
      </a>
    </div>
  </div>
);

const MysteryBoxPrize = () => (
  <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200 flex flex-col items-center text-center w-full max-w-lg mx-auto">
    <h3 className="text-xl font-black text-purple-800 mb-6">
      Mystery Box: Jobie Sticker Pack
    </h3>
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full"></div>
        <img
          src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-86cd5a69-4b30-4813-85a7-4cb5c8daf5b9.png"
          className="relative h-40 object-contain drop-shadow-xl z-10"
          alt="Jobie Sticker Pack"
        />
      </div>
      <a
        href="https://www.whatsapp.com/channel/0029VadYIsPB4hdYGIn57X2H"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-3 px-6 rounded-xl shadow-[0_5px_15px_-5px_rgba(37,211,102,0.5)] transition-all w-full text-lg relative z-10"
      >
        Download via WA Channel
      </a>
      <span className="text-sm text-gray-500 mt-2 font-bold">
        (Will share soon)
      </span>
    </div>
  </div>
);

export default function RewardScreen({
  onPlayAgain,
  gameWon,
  headcount,
}: RewardScreenProps) {
  const [showTngoPopup, setShowTngoPopup] = useState(false);
  const [tngoTimeLeft, setTngoTimeLeft] = useState(10);
  const [tngoExpired, setTngoExpired] = useState(false);
  const { width, height } = useWindowSize();

  const isWin = gameWon !== false;

  useEffect(() => {
    let timer: any;
    if (showTngoPopup && tngoTimeLeft > 0) {
      timer = setInterval(() => {
        setTngoTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTngoExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTngoPopup, tngoTimeLeft]);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center overflow-y-auto flex items-center justify-center p-4 lg:p-8"
      style={{
        backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-2119b2db-1800-41bf-a73e-66333d6cdd5d.jpg')`,
      }}
    >
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.1}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 w-full max-w-5xl ${isWin ? "bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_20px,#dc2626_20px,#dc2626_40px)] shadow-[0_0_50px_rgba(234,179,8,0.5)] border-yellow-400" : "bg-[repeating-linear-gradient(45deg,#d1d5db,#d1d5db_20px,#9ca3af_20px,#9ca3af_40px)] shadow-[0_0_50px_rgba(156,163,175,0.5)] border-gray-400"} rounded-3xl p-2 lg:p-3 border-4 lg:border-8 flex flex-col mt-4 md:mt-0`}
      >
        <div
          className={`absolute inset-0 border-[4px] lg:border-[6px] border-dotted ${isWin ? "border-yellow-200" : "border-gray-200"} rounded-2xl opacity-80 pointer-events-none`}
        ></div>

        <div
          className={`bg-white rounded-2xl w-full h-full z-10 relative border-2 lg:border-4 ${isWin ? "border-yellow-300" : "border-gray-300"} shadow-inner overflow-hidden`}
        >
          {/* Header */}
          <div
            className={`py-4 lg:py-6 px-4 text-center ${isWin ? "bg-gradient-to-r from-yellow-300 to-yellow-500 border-b-4 border-yellow-600" : "bg-gradient-to-r from-gray-300 to-gray-400 border-b-4 border-gray-500"}`}
          >
            <h1
              className={`text-3xl lg:text-5xl font-black ${isWin ? "text-red-600" : "text-gray-800"} tracking-wide drop-shadow-sm uppercase font-sans`}
            >
              {isWin
                ? "🎪 Congratulations! You Won! 🎪"
                : "🎪 Thank You for Playing! 🎪"}
            </h1>
          </div>

          {/* Rewards Grid */}
          <div className="p-4 lg:p-6 flex flex-col items-center gap-4 lg:gap-6">
            {gameWon === true ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full">
                <VoucherPrize />
                <div
                  onClick={() => setShowTngoPopup(true)}
                  className="cursor-pointer hover:scale-105 transition-transform w-full h-full"
                >
                  <TnGoPrize />
                </div>
              </div>
            ) : gameWon === "voucher" ? (
              <div className="w-full max-w-lg">
                <VoucherPrize />
              </div>
            ) : gameWon === "tngo" ? (
              <div
                className="w-full max-w-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowTngoPopup(true)}
              >
                <TnGoPrize />
              </div>
            ) : gameWon === "mystery_box" ? (
              <MysteryBoxPrize />
            ) : (
              <FreeJobAdPrize />
            )}

            <p className="text-sm font-medium text-gray-600 italic mt-4 text-center w-full">
              "If hiring, our Hiring Support will reach you to help your hiring
              needs via WhatsApp or Call."
            </p>
          </div>

          {/* Footer Actions */}
          <div className="bg-green-50 p-4 lg:px-6 lg:py-4 border-t-4 border-green-400 flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-4 text-left relative z-10 w-full sm:w-auto">
              <div className="bg-[#25D366] text-white p-3 rounded-full shadow-lg shrink-0 border-2 border-white animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0h1a5 5 0 0 0 5 5v1a.5.5 0 0 0 0 1h-1a.5.5 0 0 0-0-1Z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-black text-[#128C7E]">
                  Don't Miss Out!
                </h4>
                <p className="text-sm font-bold text-gray-800">
                  Check our official WA Channel <br className="sm:hidden" />
                  for the Lucky Winner announcement{" "}
                  <span className="text-red-500 font-black animate-pulse">
                    EVERYDAY 🎁
                  </span>
                </p>
              </div>
            </div>

            <a
              href="https://www.whatsapp.com/channel/0029VadYIsPB4hdYGIn57X2H"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-3 px-6 rounded-xl shadow-[0_5px_15px_-5px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all w-full sm:w-auto text-lg relative z-10 whitespace-nowrap shrink-0"
            >
              <span>Join WA Channel</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* TnGO Scan Popup */}
      <AnimatePresence>
        {showTngoPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl flex flex-col items-center justify-center h-[400px]"
            >
              {!tngoExpired && (
                <button
                  onClick={() => setShowTngoPopup(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              )}

              <h2 className="text-2xl font-black text-blue-600 mb-2">
                Scan Now!
              </h2>
              {tngoExpired ? (
                <div className="flex flex-col items-center py-10">
                  <span className="text-6xl mb-4">⏱️</span>
                  <p className="text-red-500 font-bold text-lg px-4">
                    Time is up! You cannot scan anymore.
                  </p>
                  <button
                    onClick={() => setShowTngoPopup(false)}
                    className="mt-6 bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-xl hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-full bg-blue-50 rounded-xl p-4 flex items-center justify-center border-2 border-blue-200 mb-4 h-[200px]">
                    <img
                      src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-01b86c06-deab-4dd3-9d33-72439db4f85d.png"
                      className="w-32 h-32 object-cover rounded-full shadow-inner"
                      alt="TnGO QR Placehoder"
                    />
                  </div>
                  <p className="text-red-500 font-bold text-xl drop-shadow-sm mb-2">
                    Closes in: {tngoTimeLeft}s
                  </p>
                  <p className="text-sm text-gray-500">
                    Scan fast using your TnGO app!
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
