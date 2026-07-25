import React from 'react'
import models from '../assets/models.svg'
import smallstar from '../assets/smallstar.svg'
import bigstar from '../assets/bigstar.svg'

const Hero = () => {
    return (
        <>
            <div className='bg-[#F2F0F1] h-165.75 w-full relative' >
                <div className=' w-fit absolute top-25 left-12.5 '>
                    <h1 className='font-integral font-extrabold text-[64px] leading-none '>FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
                </div>
                <div className=' w-fit absolute top-75 left-12.5'>
                    <p className='font-sans text-[16px] leading-none  '>Browse through our diverse range of meticulously crafted garments, designed<br /> to bring out your individuality and cater to your sense of style.</p>
                </div>
                <div className=' w-fit absolute top-87.5 left-12.5'>
                    <button className='cursor-pointer font-sans bg-black text-white py-4 px-13.5 rounded-full w-52.5 h-13.5 text-[16px]'>Shop Now</button>
                </div>
                <div className=''>
                    <img src={models} alt="" />
                </div>
                <div className=' w-fit absolute flex top-112.5 left-12.5 gap-8'  >
                    <div className=''>
                        <h3 className='font-sans text-[40px] font-bold '>200+</h3>
                        <p className=''>International Brands</p>
                    </div>
                    <div>
                        <h3 className='font-sans text-[40px] font-bold'>2,000+</h3>
                        <p className='font-sans text-[16px]'>High-Quality Products</p>
                    </div>
                    <div>
                        <h3 className='font-sans text-[40px] font-bold'>30,000+</h3>
                        <p>Happy Customers</p>
                    </div>

                </div>
                <div className='absolute top-72.5 left-200'>
                    <img src={smallstar} alt="" />
                </div>
                <div className='absolute top-25 left-325'>
                    <img src={bigstar} alt="" />
                </div>
            </div>
        </>
    )
}

export default Hero
