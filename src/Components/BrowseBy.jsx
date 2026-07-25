import React from 'react'
import { Link } from 'react-router-dom'
import image11 from "../assets/image11.svg"
import image12 from "../assets/image12.svg"
import image13 from "../assets/image13.svg"
import image14 from "../assets/image14.svg"

const BrowseBy = () => {
    return (
        <>
            <div className='flex justify-center px-4'>
                <div className='bg-[#F0F0F0] w-full max-w-309.75 rounded-2xl py-10 px-4'>
                    <h1 className='text-center font-integral font-bold text-[38px] md:text-[48px]'>Browse By Dress Style</h1>

                    <div className='flex flex-col justify-center gap-5 my-5 font-sans text-[36px] font-bold md:flex-row'>
                        {/* Casual Category */}
                        <Link 
                            to="/category/casual" 
                            className='relative w-full h-47.5 md:w-101.75 md:h-72.25 rounded-2xl overflow-hidden bg-white group cursor-pointer block'
                        >
                            <img src={image11} alt="Casual" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                            <h1 className='absolute top-6 left-6'>Casual</h1>
                        </Link>
                        
                        {/* Formal Category */}
                        <Link 
                            to="/category/formal" 
                            className='relative w-full h-47.5 md:w-171 md:h-72.25 rounded-2xl overflow-hidden bg-white group cursor-pointer block'
                        >
                            <img src={image13} alt="Formal" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                            <h1 className='absolute top-6 left-6'>Formal</h1>
                        </Link>
                    </div>
                    
                    <div className='flex flex-col justify-center gap-5 font-sans text-[36px] font-bold md:flex-row'>
                        {/* Party Category */}
                        <Link 
                            to="/category/party" 
                            className='relative w-full h-47.5 md:w-171 md:h-72.25 rounded-2xl overflow-hidden bg-white group cursor-pointer block'
                        >
                            <img src={image12} alt="Party" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                            <h1 className='absolute top-6 left-6'>Party</h1>
                        </Link>
                        
                        {/* Gym Category */}
                        <Link 
                            to="/category/gym" 
                            className='relative w-full h-47.5 md:w-101.75 md:h-72.25 rounded-2xl overflow-hidden bg-white group cursor-pointer block'
                        >
                            <img src={image14} alt="Gym" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                            <h1 className='absolute top-6 left-6'>Gym</h1>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export default BrowseBy