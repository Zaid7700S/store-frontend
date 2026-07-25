import React from 'react'
import models from '../assets/models.svg'
import smallstar from '../assets/smallstar.svg'
import bigstar from '../assets/bigstar.svg'
import PicM from '../assets/PicM.png'
import ver from '../assets/ver.svg'
import zara from '../assets/zara.svg'
import ck from '../assets/ck.svg'
import gucci from '../assets/gucci.svg'
import prada from '../assets/prada.svg'
import { Link } from 'react-router-dom'

const Hero2 = () => {
    return (
        <>
            <div className='bg-[#F2F0F1] min-h-165.75 w-full relative flex flex-col overflow-hidden' >
                <div className='flex flex-col justify-center items-start  w-full px-4 relative  md:absolute my-8  md:my-24 md:mx-13 z-10 md:w-fit'>
                    <div>
                        <h1 className='text-[36px] font-integral text-left  font-extrabold md:text-[64px] leading-none '>FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
                    </div>
                    <div className='mt-4 block md:hidden'  >
                        <p className='font-sans text-[14px] leading-none  '>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
                    </div>
                    <div className='mt-4 hidden md:block' >
                        <p className='font-sans text-[16px] leading-none  '>Browse through our diverse range of meticulously crafted garments, designed<br /> to bring out your individuality and cater to your sense of style.</p>
                    </div>
                    <div className='mt-8 md:mt-4 w-full md:w-auto' >
                        <Link to={`/products`}><button className='cursor-pointer font-sans bg-black text-white py-4 px-13.5 rounded-full w-full md:w-52.5 h-13.5 text-[16px]'>Shop Now</button>
                                </Link>                    
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap mt-8 gap-4 md:gap-8 justify-center md:justify-start">
                        <div>
                            <h3 className="text-[40px] font-bold">200+</h3>
                            <p>International Brands</p>
                        </div>

                        <div>
                            <h3 className="text-[40px] font-bold">2,000+</h3>
                            <p>High-Quality Products</p>
                        </div>

                        <div className="w-full md:w-auto text-center md:text-left">
                            <h3 className="text-[40px] font-bold">30,000+</h3>
                            <p>Happy Customers</p>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='relative z-0 mt-auto md:ml-auto md:mt-0 w-full flex justify-center md:justify-end'>
                    <div className='hidden md:flex w-full h-full'>
                        <img src={models} alt="" className='object-cover object-top w-full' />
                    </div>
                    <div className='flex md:hidden w-full'>
                        <img src={PicM} alt="" className='object-cover w-full' />
                    </div>
                    <div className='absolute top-[40%] left-[5%] md:top-[45%] md:left-[45%]'>
                        <img src={smallstar} alt="" />
                    </div>
                    <div className='absolute  top-[5%] right-[5%] md:top-25 md:right-25'>
                        <img src={bigstar} alt="" />
                    </div>
                </div>
            </div>
            <div className='bg-black min-h-30.5 flex justify-center items-center py-6'>
                <div className='flex flex-wrap justify-center items-center gap-6 md:gap-20 px-4'>
                    <img src={ver} alt="Versace" className='h-6.25 md:h-8.25' />
                    <img src={zara} alt="Zara" className='h-7.5 md:h-9.5' />
                    <img src={gucci} alt="Gucci" className='h-7 md:h-9' />
                    <img src={prada} alt="Prada" className='h-6.25 md:h-8' />
                    <img src={ck} alt="Calvin Klein" className='h-6.25 md:h-8.25' />
                </div>
            </div>
        </>
    )
}

export default Hero2
