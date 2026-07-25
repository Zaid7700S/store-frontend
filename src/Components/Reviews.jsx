import React, { useState } from 'react';
import arrow1 from "../assets/arrow1.svg"; 
import arrow2 from "../assets/arrow2.svg"; 

// 1. Define the 6 distinct reviews
const originalReviews = [
    {
        id: 1,
        name: "Sarah M.",
        rating: "⭐⭐⭐⭐⭐",
        text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
    },
    {
        id: 2,
        name: "Alex K.",
        rating: "⭐⭐⭐⭐⭐",
        text: "Finding clothes that fit perfectly and look this good is rare. The customer service was also outstanding! I will definitely be a returning customer."
    },
    {
        id: 3,
        name: "James L.",
        rating: "⭐⭐⭐⭐⭐",
        text: "As someone who is very particular about fabric quality, I am thoroughly impressed. The materials feel premium and breathable. Highly recommend Shop.co."
    },
    {
        id: 4,
        name: "Emily R.",
        rating: "⭐⭐⭐⭐⭐",
        text: "The delivery was lightning fast, and the packaging was beautiful. The dresses are true to size, fit like a glove, and look absolutely gorgeous."
    },
    {
        id: 5,
        name: "Michael T.",
        rating: "⭐⭐⭐⭐",
        text: "Great selection of everyday basics. The t-shirts haven't shrunk or faded after multiple washes. Solid value for the money."
    },
    {
        id: 6,
        name: "Jessica W.",
        rating: "⭐⭐⭐⭐⭐",
        text: "I bought a winter coat and it is incredibly warm and stylish. I get so many compliments on it everywhere I go!"
    }
];

// 2. Duplicate the array to create a seamless infinite loop without visual ghosting
const extendedReviews = [...originalReviews, ...originalReviews].map((review, index) => ({
    ...review,
    uniqueId: index 
}));

const Reviews = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const total = extendedReviews.length;

    // Functions to go to the next/prev review (loops mathematically)
    const next = () => setActiveIndex((prev) => (prev + 1) % total);
    const prev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

    // Calculates the position of each card relative to the active (center) card
    const getOffset = (index) => {
        let offset = (index - activeIndex + total) % total;
        if (offset > Math.floor(total / 2)) {
            offset -= total;
        }
        return offset;
    };

    return (
        <div className='w-full overflow-hidden'>
            <div className='mt-10 px-4 md:px-10 max-w-7xl mx-auto'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-[32px] md:text-[48px] font-integral font-bold uppercase'>
                            Our Happy Customers
                        </h1>
                    </div>
                    <div className='flex gap-3 z-50'>
                        <button onClick={prev} className='cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors'>
                            <img src={arrow2} alt="Previous" className="w-6 h-6" />
                        </button>
                        <button onClick={next} className='cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors'>
                            <img src={arrow1} alt="Next" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Carousel Track container */}
            <div className='relative w-full h-[300px] mt-10 mb-10 flex justify-center items-center overflow-hidden'>
                {extendedReviews.map((review, index) => {
                    // Determine where this card belongs right now
                    const offset = getOffset(index);
                    const isHidden = Math.abs(offset) > 2; // More than 2 spots away -> completely hidden
                    const isExtreme = Math.abs(offset) === 2; // Exactly 2 spots away -> extreme edges (blurred)

                    return (
                        <div
                            key={review.uniqueId}
                            // Base styling + dynamic blur/opacity classes
                            className={`absolute top-1/2 left-1/2 border border-gray-400 rounded-2xl w-[85vw] md:w-[400px] h-[240px] bg-white transition-all duration-500 ease-in-out shrink-0
                                ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                                ${isExtreme && !isHidden ? 'blur-[2px] opacity-70' : 'blur-none'}
                            `}
                            // Transforms dynamically slide the cards left and right based on their offset
                            style={{
                                transform: `translate(calc(-50% + ${offset * 100}% + ${offset * 20}px), -50%)`,
                                zIndex: isHidden ? 0 : 10 - Math.abs(offset),
                            }}
                        >
                            <div className='py-7 px-8 font-sans h-full flex flex-col justify-center'>
                                <p className="tracking-widest">{review.rating}</p>
                                <h2 className='text-[20px] font-bold mt-2 flex items-center gap-2'>
                                    {review.name} <span className="text-green-500">✅</span>
                                </h2>
                                <p className='text-[16px] mt-2 text-gray-600'>
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Reviews;