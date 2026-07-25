import React from 'react';

const UnAuthorized = () => {
  return (
    <div className="min-h-screen bg-[#F2F0F1] flex flex-col items-center justify-center p-4 font-sans">
      
      <div className="bg-white max-w-md w-full rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center text-center">
        
        {/* Icon Container */}
        <div className="w-20 h-20 bg-[#F0F0F0] rounded-full flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="black" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="font-integral font-bold text-[28px] md:text-[32px] leading-tight text-black mb-3">
          ACCESS DENIED
        </h1>
        
        <p className="text-[#9A9A9A] text-[15px] leading-relaxed mb-8">
          You don't have the necessary permissions to view this page. If you believe this is a mistake, please contact support.
        </p>

        {/* Action Button */}
        {/* You can replace this button with a React Router <Link> or attach an onClick handler to go back */}
        <button 
          onClick={() => window.history.back()} 
          className="w-full bg-black text-white px-8 py-4 rounded-full font-semibold text-[15px] hover:scale-[1.02] transition-transform shadow-md"
        >
          Go Back
        </button>
        
      </div>
      
    </div>
  );
}

export default UnAuthorized;