import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface HomepageProps {
  onStart: (formData: { companyName: string; email: string; phone: string; hasAccount: string }) => void;
}

export default function Homepage({ onStart }: HomepageProps) {
  const [formData, setFormData] = useState({ companyName: "", email: "", phone: "", hasAccount: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      style={{ backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-822148e6-1fa1-4830-ab09-58c4c1b0d5f4.jpg')` }}
    >
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
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-80c08104-3dc6-4ac5-942f-8f13a881783c.png" 
              alt="Fuel Your Hiring" 
              className="w-full max-w-[380px] lg:max-w-[550px] mt-6 lg:mt-10"
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-white font-bold text-sm lg:text-base bg-black/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-white/20 shadow-xl inline-block"
            >
              19 - 26 May 2026
            </motion.div>
          </div>

          <div 
            className="w-full max-w-[575px] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 lg:p-5 shadow-2xl flex flex-col justify-center mx-auto lg:mx-0"
          >
            <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 text-white font-black text-sm lg:text-base px-6 py-2 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] border-2 border-orange-300 text-center mb-6 inline-block self-center mx-auto">
              Spin and Pause to Win These Rewards
            </div>
            
            <div className="flex flex-row items-center justify-center gap-4 lg:gap-8 w-full">
              {/* Highlighted Main Reward */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-orange-400/30 blur-xl rounded-full"></div>
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-34ce746d-fdc2-4f86-8bf2-4dcdc03ad0ee.png" 
                  className="relative h-28 lg:h-40 object-contain hover:scale-110 transition-transform drop-shadow-2xl z-10" 
                  alt="Fuel Top Up"
                />
              </div>
              
              {/* Secondary Rewards */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-9661e538-2f4b-4cc8-bdd1-76248dd5eb8f.png" 
                  className="h-12 lg:h-16 object-contain hover:scale-105 transition-transform drop-shadow-lg" 
                  alt="RM200 Off"
                />
                <img 
                  src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-9fb14efb-2653-48e2-9072-71df028ea424.png" 
                  className="h-12 lg:h-16 object-contain hover:scale-105 transition-transform drop-shadow-lg" 
                  alt="Free Job Ads"
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
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-80c08104-3dc6-4ac5-942f-8f13a881783c.png" 
              alt="Fuel Your Hiring" 
              className="w-full max-w-[260px] sm:max-w-[320px]"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-white font-bold text-xs bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20 shadow-xl inline-block"
            >
              19 - 26 May 2026
            </motion.div>
          </div>

          <div className="relative flex justify-center w-full">
            <motion.img 
              src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-496956f5-d4c0-4c31-80c3-5fefc66497fc.png"
              className="absolute top-1/2 left-1/2 w-[750px] lg:w-[900px] h-[750px] lg:h-[900px] max-w-none object-contain opacity-40 -z-10 pointer-events-none drop-shadow-xl"
              style={{ x: "-50%", y: "-50%" }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              alt="Wheel Background" 
            />

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col relative w-full lg:w-[447px] max-w-md mx-auto"
            >
              {/* Form Header */}
              <div 
                className="bg-gradient-to-r from-red-700 to-red-800 flex flex-col items-center justify-center text-white px-4 py-3 lg:px-6 lg:py-6 lg:h-[106px]"
              >
              <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-0.5 lg:mb-1 text-center">Spin & Pause to Win</h3>
              <p className="text-red-100 font-medium text-xs lg:text-sm text-center">Enter details to start playing & win rewards</p>
            </div>

            {/* Form Body */}
            <form 
              onSubmit={handleSubmit} 
              className="px-4 sm:px-8 py-3 lg:py-6 bg-gray-50 flex flex-col justify-between flex-1 lg:h-[468px]"
            >
              <div className="space-y-2 lg:space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" placeholder="e.g. AJobThing Sdn Bhd" required
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-colors"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" placeholder="youremail@gmail.com" required
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <span className="bg-white border-2 border-r-0 border-gray-200 rounded-l-lg p-2.5 flex items-center font-bold text-gray-700 text-sm">
                      🇲🇾 +60
                    </span>
                    <input 
                      type="tel" placeholder="123456789" required
                      className="w-full p-2.5 text-sm rounded-r-lg border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-colors"
                      value={formData.phone}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, phone: onlyNums});
                      }}
                    />
                  </div>
                </div>

                <div className="bg-green-50/50 p-2 lg:p-3 rounded-lg border border-green-100 space-y-2 mt-2">
                  <label className="text-sm font-bold text-gray-800">Do you have an AJobThing account?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasAccount: 'yes'})}
                      className={`flex-1 py-2 text-sm rounded-lg font-bold border-2 transition-all ${
                        formData.hasAccount === 'yes' 
                          ? 'bg-white border-green-500 text-green-600 shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, hasAccount: 'no'})}
                      className={`flex-1 py-2 text-sm rounded-lg font-bold border-2 transition-all ${
                        formData.hasAccount === 'no' 
                          ? 'bg-white border-green-500 text-green-600 shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 lg:mt-4">
                {errorMsg && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg text-center">
                    {errorMsg}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-gray-900 font-black py-2.5 lg:py-3.5 rounded-lg text-base lg:text-lg transition-all transform shadow-lg ${
                    isSubmitting 
                      ? 'bg-gray-300 cursor-not-allowed opacity-70' 
                      : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 hover:scale-[1.02]'
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
