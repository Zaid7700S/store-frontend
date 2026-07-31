import React from 'react';

const StarRating = ({ rating = 0, compact = false }) => {
  // Ensure the rating stays between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating));
  
  // Adjust star size based on the compact prop
  const starSize = compact ? "w-4 h-4" : "w-5 h-5 md:w-6 md:h-6";

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          // Calculate the percentage of the star to fill (0% to 100%)
          // This allows for perfect 4.9 or 3.2 star fillings!
          const fillPercentage = Math.max(0, Math.min(100, (clampedRating - index) * 100));

          return (
            <div key={index} className={`relative ${starSize}`}>
              {/* Background (Empty) Star */}
              <svg
                className="absolute top-0 left-0 w-full h-full text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>

              {/* Foreground (Filled) Star - Width controlled dynamically */}
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <svg
                  className={`${starSize} text-[#FFC633]`} 
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
