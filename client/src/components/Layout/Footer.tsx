import React from 'react';


const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          
          {/* Left: Logo */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
             <img src="/logo.png" alt="K Progress" className="h-8 w-auto opacity-90" />
          </div>
          
          {/* Center: Slogan */}
          <div className="w-full md:w-1/3 flex justify-center text-xs text-gray-400 font-medium">
             <span className="flex items-center">
                Built for productivity Tracking
             </span>
          </div>

          {/* Right: Short Description */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end text-xs text-gray-400">
             AI-Powered Personal Growth Tracker
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
