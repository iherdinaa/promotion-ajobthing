import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface HomepageProps {
  onStart: (formData: { companyName: string; email: string; phone: string; hasAccount: string }) => void;
}

const Snow = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: number; delay: number; duration: number; img: string }[]>([]);

  useEffect(() => {
    const snowImages = [
      "https://files.ajt.my/images/marketing-campaign/image-b5c61653-48e5-404d-aa95-da0f2ecc5351.png",
      "https://files.ajt.my/images/marketing-campaign/image-4851506e-34bf-49a7-b5ab-ee7c373b4c23.png",
      "https://files.ajt.my/images/marketing-campaign/image-c98293ab-72f4-44d2-b13b-69d0f4b63ee2.png",
      "https://files.ajt.my/images/marketing-campaign/image-bf6f65c2-7bff-4e8d-975c-69e46d32ca4e.png",
      "https://files.ajt.my/images/marketing-campaign/image-80a52377-e207-425d-9460-cdcecba8aaf6.png",
      "https://files.ajt.my/images/marketing-campaign/image-94a8893a-6ede-43e7-9f77-d78f7ba1ccf6.png"
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
          className="absolute top-[-50px] w-10 h-10 md:w-12 md:h-12 object-contain opacity-70"
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

export default function Homepage({ onStart }: HomepageProps) {
  const [formData, setFormData] = useState({ companyName: "", email: "", phone: "", hasAccount: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    onStart({ ...formData, phone: formattedPhone });
  };

  return (
    <div 
      className="relative h-screen w-full bg-cover bg-center overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: `url('https://files.ajt.my/images/marketing-campaign/image-ece9b57a-7abf-4331-a6c1-4f678cf72a4c.gif')` }}
    >
      <Snow />
      
      {/* Logo */}
      <img 
        src="https://s3-ap-southeast-1.amazonaws.com/ricebowl/images/marketing-campaign/image-9520d447-0168-412d-9cd5-d083a3ab8884.png" 
        alt="Logo" 
        className="absolute top-4 left-4 lg:top-6 lg:left-8 h-6 lg:h-10 z-50 object-contain"
      />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center max-w-[1200px] mx-auto w-full gap-6 lg:gap-12 px-4 h-full py-4">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left w-full max-w-lg lg:max-w-xl">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src="https://files.ajt.my/images/marketing-campaign/image-7634595e-30ad-4f78-8f1b-55db7d2b631f.png" 
            alt="Fuel Your Hiring" 
            className="w-full max-w-[380px] lg:max-w-[550px] mt-6 lg:mt-10"
          />
          
          <div className="flex flex-col items-center space-y-3 w-full lg:w-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 text-white font-black text-sm lg:text-lg px-8 py-3 rounded-[2rem] shadow-[0_0_20px_rgba(249,115,22,0.4)] border-2 border-orange-300 text-center transform -rotate-2"
            >
              Hire & Win Extra Fuel Support from AJobThing
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white font-bold text-sm lg:text-base bg-black/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-white/20 shadow-xl inline-block"
            >
              14-20 April 2026
            </motion.div>
          </div>

          <div 
            className="w-full max-w-[575px] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 lg:p-5 mt-4 shadow-2xl flex flex-col justify-center mx-auto lg:mx-0"
          >
            <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 text-white font-black text-sm lg:text-base px-6 py-2 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] border-2 border-orange-300 text-center mb-6 inline-block self-center mx-auto">
              Play the Game & Win These Rewards
            </div>
            
            <div className="flex flex-row items-center justify-center gap-4 lg:gap-8 w-full">
              {/* Highlighted Main Reward */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-orange-400/30 blur-xl rounded-full"></div>
                <img 
                  src="https://files.ajt.my/images/marketing-campaign/image-dd64c0ff-e7f2-4959-9c50-3cf7d846d3d1.png" 
                  className="relative h-28 lg:h-40 object-contain hover:scale-110 transition-transform drop-shadow-2xl z-10" 
                  alt="Fuel Top Up"
                />
              </div>
              
              {/* Secondary Rewards */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <img 
                  src="https://files.ajt.my/images/marketing-campaign/image-cb17ce42-da63-42a5-911c-7d12fd403cfb.png" 
                  className="h-12 lg:h-16 object-contain hover:scale-105 transition-transform drop-shadow-lg" 
                  alt="RM200 Off"
                />
                <img 
                  src="https://files.ajt.my/images/marketing-campaign/image-c97b2bcf-f32b-4a30-a849-ef83654e22dd.png" 
                  className="h-12 lg:h-16 object-contain hover:scale-105 transition-transform drop-shadow-lg" 
                  alt="Free Job Ads"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Form & Jobie) */}
        <div className="relative flex justify-center lg:justify-end shrink-0">
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col relative"
            style={{ width: '447px' }}
          >
            {/* Form Header */}
            <div 
              className="bg-gradient-to-r from-red-700 to-red-800 flex flex-col items-center justify-center text-white px-6"
              style={{ height: '106px' }}
            >
              <h3 className="text-2xl font-black tracking-tight mb-1">Don't Run Out the Gas</h3>
              <p className="text-red-100 font-medium text-sm text-center">Enter details to start playing & win rewards</p>
            </div>

            {/* Form Body */}
            <form 
              onSubmit={handleSubmit} 
              className="px-8 py-6 bg-gray-50 flex flex-col justify-between"
              style={{ height: '468px' }}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" placeholder="e.g. AJobThing Sdn Bhd" required
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-colors"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" placeholder="youremail@gmail.com" required
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-red-500 outline-none bg-white transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
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

                <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 space-y-2 mt-2">
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

              <div className="mt-4">
                {errorMsg && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg text-center">
                    {errorMsg}
                  </div>
                )}
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-gray-900 font-black py-3.5 rounded-lg text-lg hover:from-orange-500 hover:to-orange-600 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  START NOW ⛽
                </button>
              </div>
            </form>
          </motion.div>

          {/* Jobie Character */}
          <img 
            src="https://files.ajt.my/images/marketing-campaign/image-cbf068c6-5c4b-4e1e-b461-74618f20d795.png" 
            className="absolute -right-12 lg:-right-24 bottom-4 lg:bottom-8 h-32 lg:h-48 z-20 pointer-events-none drop-shadow-xl"
            alt="Jobie"
          />
        </div>
      </div>
    </div>
  );
}
