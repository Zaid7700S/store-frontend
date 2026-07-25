import React, { useState } from 'react'
import cross from '../assets/cross.svg'
import { Link } from 'react-router-dom';

const SmallHeader = () => {
  const token = localStorage.getItem("accessToken");

    const isAuthenticated = token;
    const[on,setOn] = useState(true);
    if(!on ) return null;
  return (
    !isAuthenticated && (
    <div className="bg-black text-white font-sans p-1 flex justify-center items-center w-full h-8.5 md:h-[38] ">
        <p className='text-center text-[12px] md:text-[14px]'>Sign up and get 20% off to your first order. <Link to='/signup' className='font-bold underline '>Sign Up Now</Link></p>
        <button onClick={()=>{setOn(false)}} className='hidden md:flex absolute right-9 cursor-pointer  h-[20] w-[20]'><img src={cross} alt="" /></button>
      </div>)
  )
}

export default SmallHeader
