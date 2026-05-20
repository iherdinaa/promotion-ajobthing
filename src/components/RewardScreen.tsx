import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RewardScreenProps {
  onPlayAgain: () => void;
  gameWon: boolean;
  headcount?: string;
}

const Snow = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: number; delay: number; duration: number; img: string }[]>([]);

  useEffect(() => {
    const snowImages = [
      "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-01b86c06-deab-4dd3-9d33-72439db4f85d.png",
      "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-40c8bf3a-498b-4be9-8868-2cf05eac8fce.jpg"
    ];

    const newFlakes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      img: snowImages[Math.floor(Math.random() * snowImages.length)]
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map(flake => (
        <motion.img
          key={flake.id}
          src={flake.img}
          className="absolute top-[-50px] w-10 h-10 md:w-12 md:h-12 object-contain opacity-70 rounded-full"
          style={{ left: `${flake.left}%` }}
          animate={{
            y: ["0vh", "100vh"],
            rotate: [0, 360]
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function RewardScreen({ onPlayAgain, gameWon, headcount }: RewardScreenProps) {
  const [showTngoPopup, setShowTngoPopup] = useState(false);
  const [tngoTimeLeft, setTngoTimeLeft] = useState(10);
  const [tngoExpired, setTngoExpired] = useState(false);
  const [tngoScanned, setTngoScanned] = useState(false);

  const today = new Date().getUTCDate(); // e.g. 19, 20, 21, 22, 25

  let voucherTitle = "RM200 OFF AJobThing Voucher";
  let voucherImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-553cdeb1-c3f9-44b8-84ef-0bf230b6d2de.png";
  let treatTitle = "Grabgift";
  let treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-3c55e304-2eb4-40c6-bb11-628b97fca28c.png"; // KFC default
  let isTngo = false;

  if (today === 19) {
    treatTitle = "Grabgift Lucky Draw";
    treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-3c55e304-2eb4-40c6-bb11-628b97fca28c.png";
  } else if (today === 20) {
    isTngo = true;
    treatTitle = "TnGO Reward";
    treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-01b86c06-deab-4dd3-9d33-72439db4f85d.png";
    if (headcount === '1-6') {
      voucherTitle = "RM288 OFF AJobThing Voucher";
      voucherImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-b0e8c425-8526-4503-b571-1ed6fb10ae8a.png";
    } else if (headcount === '7-15' || headcount === '16-30') {
      voucherTitle = "RM588 OFF AJobThing Voucher";
      voucherImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-96295f5a-4932-41bb-9946-7d11d9c8b854.png";
    } else {
      voucherTitle = "RM988 OFF AJobThing Voucher";
      voucherImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-ea5a31d7-3fd9-4a43-a6d6-55e53461fa25.png";
    }
  } else if (today === 21) {
    treatTitle = "Grabgift Chagee";
    treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8f01e5f8-8571-445d-b0f4-7125f8eaae78.png";
  } else if (today === 22) {
    treatTitle = "Grabgift Burger";
    treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8ccc0fca-1502-4fb3-92d5-a5987765cfd2.png";
  } else if (today >= 25) {
    treatTitle = "Grabgift Beautea";
    treatImg = "https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-4c669575-97eb-4cdf-b2ff-86030c479e9f.png";
  }

  useEffect(() => {
    let timer: any;
    if (showTngoPopup && tngoTimeLeft > 0) {
      timer = setInterval(() => {
        setTngoTimeLeft(prev => {
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
      style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-822148e6-1fa1-4830-ab09-58c4c1b0d5f4.jpg')` }}
    >
      <Snow />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400 flex flex-col mt-10 md:mt-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-6 px-4 text-center">
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-wide drop-shadow-md">
            Happy International HR Day!
          </h1>
        </div>

        {/* Rewards Grid */}
        <div className="p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Guaranteed Reward */}
          <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 flex flex-col items-center text-center">
            <h3 className="text-xl font-black text-orange-800 mb-6">Guaranteed Reward</h3>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Voucher</span>
                <img src={voucherImg} className="h-40 object-contain drop-shadow-lg" alt={voucherTitle} />
                <span className="text-lg font-bold text-orange-900 mt-2">{voucherTitle}</span>
                <span className="text-xs text-red-500 font-semibold mt-1">*Expired before 26 May 2026</span>
              </div>
            </div>
          </div>

          {/* Special Treat */}
          <div className={`bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 flex flex-col items-center text-center ${!gameWon ? 'bg-gray-50 border-gray-200' : ''}`}>
            <h3 className={`text-xl font-black mb-6 ${gameWon ? 'text-orange-800' : 'text-gray-600'}`}>
              {gameWon ? (today === 20 ? 'Free Treat for You' : '1 Free Treat Lucky Draw') : 'No Free Treat Lucky Draw'}
            </h3>
            
            <div className="flex flex-col items-center gap-4 mb-6 flex-1 justify-center relative w-full h-full">
              {gameWon && <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{treatTitle}</span>}
              <div className="relative">
                {gameWon && <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full"></div>}
                {isTngo && gameWon ? (
                  <button 
                    onClick={() => {
                      if (!tngoScanned) {
                        setTngoScanned(true);
                        setShowTngoPopup(true);
                      }
                    }}
                    disabled={tngoScanned}
                    className={`relative z-10 flex flex-col items-center transition-transform ${tngoScanned ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-105'}`}
                  >
                    <img 
                      src={treatImg} 
                      className="relative h-40 object-contain drop-shadow-xl z-10" 
                      alt={treatTitle} 
                    />
                    <div className={`font-bold text-xs py-1 px-3 rounded-full mt-2 inline-block shadow-md ${tngoScanned ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white'}`}>
                      {tngoScanned ? 'Scanned' : 'Click to Scan'}
                    </div>
                    {!tngoScanned && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">You have 10 seconds to scan, prepare your phone first.</p>
                    )}
                  </button>
                ) : (
                  <img 
                    src={treatImg} 
                    className={`relative h-40 object-contain drop-shadow-xl z-10 transition-all ${!gameWon ? 'grayscale opacity-40' : ''}`} 
                    alt={treatTitle} 
                  />
                )}
              </div>
              {!gameWon && <span className="text-sm font-bold text-gray-500 mt-2">Treat not collected this time.</span>}
            </div>

            <p className="text-sm font-medium text-gray-600 italic mt-auto">
              "If hiring, our Hiring Support will reach you to help your hiring needs via WhatsApp or Call."
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-green-50 p-4 lg:p-6 border-t-4 border-green-400 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-4 text-left relative z-10 w-full sm:w-auto">
            <div className="bg-[#25D366] text-white p-3 rounded-full shadow-lg shrink-0 border-2 border-white animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0h1a5 5 0 0 0 5 5v1a.5.5 0 0 0 0 1h-1a.5.5 0 0 0-0-1Z" /></svg>
            </div>
            <div>
              <h4 className="text-xl font-black text-[#128C7E]">Don't Miss Out!</h4>
              <p className="text-sm font-bold text-gray-800">
                Check our official WA Channel <br className="sm:hidden" />for the Lucky Winner announcement <span className="text-red-500 font-black animate-pulse">EVERYDAY 🎁</span>
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
                >×</button>
              )}
              
              <h2 className="text-2xl font-black text-blue-600 mb-2">Scan Now!</h2>
              {!tngoExpired ? (
                <>
                  <div className="w-full bg-blue-50 rounded-xl p-4 flex items-center justify-center border-2 border-blue-200 mb-4">
                    <img
                      src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-95f8e2d0-0dc1-4af5-a53b-209a52285f5f.jpg"
                      className="w-64 h-64 object-contain"
                      alt="TnGO QR Code"
                    />
                  </div>
                  <p className="text-red-500 font-bold text-xl drop-shadow-sm mb-2">
                    Closes in: {tngoTimeLeft}s
                  </p>
                  <p className="text-sm text-gray-500">Scan fast using your TnGO app!</p>
                </>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <p className="text-red-500 font-bold text-lg px-4">Time is up! You cannot scan anymore.</p>
                  <button 
                    onClick={() => setShowTngoPopup(false)}
                    className="mt-6 bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-xl hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
