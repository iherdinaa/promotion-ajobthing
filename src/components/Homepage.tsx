import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface HomepageProps {
  onStart: (formData: { companyName: string; email: string; phone: string; hasAccount: string }) => void;
}

export default function Homepage({ onStart }: HomepageProps) {
  const [formData, setFormData] = useState({ companyName: "", email: "", phone: "", hasAccount: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { width, height } = useWindowSize();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hasAccount) {
      setErrorMsg("Please select if you have an AJobThing account.");
      return;
    }

    // Check if played today
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(`played_${formData.email.toLowerCase()}`);
    
    if (lastPlayed === today) {
      setErrorMsg("This email has already played today. Please try again tomorrow!");
      return;
    }
    
    setIsSubmitting(true);
    
    // Save play date
    localStorage.setItem(`played_${formData.email.toLowerCase()}`, today);
    setErrorMsg("");
    // Format phone number to start with 60 before passing it
    let formattedPhone = formData.phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '60' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('60') && formattedPhone.length > 0) {
      formattedPhone = '60' + formattedPhone;
    }

    setIsSubmitting(false);
    onStart({ ...formData, phone: formattedPhone });
  };

  return (
    <div 
      className="relative min-h-screen lg:h-screen w-full bg-cover bg-center overflow-y-auto lg:overflow-hidden flex items-start lg:items-center justify-center pt-14 pb-8 lg:py-0"
      style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-40ffeae5-60cf-4bf1-aaf8-b69e0da914c3.png')` }}
    >
      <Confetti width={width} height={height} numberOfPieces={80} gravity={0.05} />
      <img 
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-9520d447-0168-412d-9cd5-d083a3ab8884.png" 
        alt="Logo" 
        className="absolute top-4 left-4 lg:top-6 lg:left-8 h-6 lg:h-10 z-50 object-contain"
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center max-w-[1200px] mx-auto w-full gap-4 lg:gap-12 px-4 h-full py-2 lg:py-4">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-2 lg:space-y-4 text-center lg:text-left w-full max-w-lg lg:max-w-xl order-2 lg:order-1 mt-6 lg:mt-0">
          <div className="hidden lg:flex flex-col items-center w-full lg:w-auto">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8e7b7322-c9b5-4e4b-83e4-3c26f59bcd26.png" 
              alt="Fuel Your Hiring" 
              className="w-full max-w-[380px] lg:max-w-[550px] mt-6 lg:mt-10"
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-white font-bold text-sm lg:text-base bg-black/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-white/20 shadow-xl inline-block"
            >
              30 June - 7 July 2026
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-6 lg:mt-8 z-20"
            >
              <img 
                src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-aabf5c45-6912-4a5f-a61f-7226e8e7267e.png" 
                alt="Mystery Gift" 
                className="w-full max-w-[500px] lg:max-w-[700px] hover:scale-105 transition-transform cursor-pointer drop-shadow-2xl"
              />
            </motion.div>
          </div>

          <div 
            className="w-full max-w-[750px] lg:max-w-[850px] bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-4 lg:p-6 shadow-2xl flex flex-col justify-center mx-auto lg:mx-0 relative mt-6 lg:mt-10"
          >
            <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 text-white font-black text-sm lg:text-base px-6 py-2 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] border-2 border-orange-300 text-center inline-block self-center mx-auto relative z-10 -mt-8 lg:-mt-10 mb-4 lg:mb-6">
              Available Prizes for You
            </div>
            
            <div className="flex flex-row items-center justify-center -space-x-2 lg:-space-x-4 w-full">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-3b14d0e8-ef24-45d6-897c-eaf15d9f9fec.png" 
                  className="relative h-20 lg:h-24 object-contain hover:scale-110 transition-transform drop-shadow-xl z-10" 
                  alt="TnGo Reward"
                />
              </div>
              
              <div className="relative flex-shrink-0">
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-cc6e559a-53d1-42f5-b09e-7bc9e1defc82.png" 
                  className="h-20 lg:h-24 object-contain hover:scale-110 transition-transform drop-shadow-lg" 
                  alt="RM200 Off"
                />
              </div>
              
              <div className="relative flex-shrink-0">
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-32b78986-c8d5-48e2-997b-7b1ca52460fd.png" 
                  className="h-20 lg:h-24 object-contain hover:scale-110 transition-transform drop-shadow-lg" 
                  alt="Free Job Ads"
                />
              </div>

              <div className="relative flex-shrink-0">
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-ddea2662-b6f2-4906-8ae9-aa1cff5c2598.png" 
                  className="h-20 lg:h-24 object-contain hover:scale-110 transition-transform drop-shadow-lg" 
                  alt="Special Prize"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Form & Jobie) */}
        <div className="relative flex flex-col items-center lg:justify-end shrink-0 order-1 lg:order-2 w-full lg:w-auto">
          
          {/* Mobile Title (hidden on lg) */}
          <div className="flex lg:hidden flex-col items-center w-full mb-3 relative z-10 mt-1 sm:mt-0">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-8e7b7322-c9b5-4e4b-83e4-3c26f59bcd26.png" 
              alt="Fuel Your Hiring" 
              className="w-full max-w-[260px] sm:max-w-[320px]"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-white font-bold text-xs bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20 shadow-xl inline-block"
            >
              30 June - 7 July 2026
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 z-20"
            >
              <img 
                src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-aabf5c45-6912-4a5f-a61f-7226e8e7267e.png" 
                alt="Mystery Gift" 
                className="w-full max-w-[400px] sm:max-w-[500px] hover:scale-105 transition-transform cursor-pointer drop-shadow-2xl"
              />
            </motion.div>
          </div>

          <div className="relative flex justify-center w-full">
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-10 flex flex-col relative w-full lg:w-[447px] max-w-md mx-auto border-4 border-yellow-300"
            >
              {/* Form Header */}
              <div 
                className="bg-gradient-to-r from-red-600 to-red-800 flex flex-col items-center justify-center text-white px-4 py-4 lg:px-6 lg:py-6"
              >
              <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-1 text-center drop-shadow-md text-yellow-300">Join Mini Hiring Games Everyday</h3>
              <p className="text-white font-semibold text-xs lg:text-sm text-center">Enter details to play and win direct gift</p>
            </div>

            {/* Form Body */}
            <form 
              onSubmit={handleSubmit} 
              className="px-6 sm:px-8 py-5 lg:py-8 bg-gray-50 flex flex-col justify-between flex-1"
            >
              <div className="space-y-4 lg:space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" placeholder="e.g. AJobThing Sdn Bhd" required
                    className="w-full p-3 text-sm rounded-xl border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-all shadow-sm"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" placeholder="youremail@gmail.com" required
                    className="w-full p-3 text-sm rounded-xl border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-all shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex shadow-sm rounded-xl">
                    <span className="bg-white border-2 border-r-0 border-gray-200 rounded-l-xl p-3 flex items-center font-bold text-gray-700 text-sm">
                      🇲🇾 +60
                    </span>
                    <input 
                      type="tel" placeholder="123456789" required
                      className="w-full p-3 text-sm rounded-r-xl border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-all"
                      value={formData.phone}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, phone: onlyNums});
                      }}
                    />
                  </div>
                </div>

                <div className="bg-yellow-50/50 p-3 lg:p-4 rounded-xl border border-yellow-200 space-y-3 mt-4">
                  <label className="text-sm font-bold text-gray-800 text-center block">Do you have an AJobThing account?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasAccount: 'yes'})}
                      className={`flex-1 py-2.5 text-sm rounded-xl font-bold border-2 transition-all ${
                        formData.hasAccount === 'yes' 
                          ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-yellow-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasAccount: 'no'})}
                      className={`flex-1 py-2.5 text-sm rounded-xl font-bold border-2 transition-all ${
                        formData.hasAccount === 'no' 
                          ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-yellow-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 lg:mt-6">
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center">
                    {errorMsg}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-gray-900 font-black py-3.5 lg:py-4 rounded-xl text-base lg:text-lg transition-all transform shadow-lg border-b-4 ${
                    isSubmitting 
                      ? 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-70' 
                      : 'bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 hover:-translate-y-1 border-yellow-500 active:border-b-0 active:translate-y-1'
                  }`}
                >
                  {isSubmitting ? 'SUBMITTING...' : 'START NOW'}
                </button>
              </div>
            </form>
          </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

