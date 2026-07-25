import React from 'react';

const StarRating = ({ rating = 0 }) => {
  // Ensure the rating stays between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center space-x-3">
      {/* Stars Container */}
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          // Calculate the percentage of the star to fill (0% to 100%)
          const fillPercentage = Math.max(0, Math.min(100, (clampedRating - index) * 100));

          return (
            <div key={index} className="relative w-6 h-6">
              {/* Background (Empty) Star */}
              <svg
                className="absolute top-0 left-0 w-full h-full text-transparent"
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
                  className="w-6 h-6 text-[#FBBF24]" /* Tailwind yellow-400 */
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

      {/* Numerical Rating Text */}
      <div className="text-lg text-gray-800">
        {clampedRating.toFixed(1)}
        <span className="text-gray-400">/5</span>
      </div>
    </div>
  );
};

export default StarRating;