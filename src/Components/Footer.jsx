import React from 'react'
import mail from "../assets/mail.svg"
import twitter from "../assets/twitter.svg"
import facebook from "../assets/facebook.svg"
import instagram from "../assets/instagram.svg"
import github from "../assets/github.svg"
import visa from "../assets/visa.svg"
import mastercard from "../assets/mastercard.svg"
import paypal from "../assets/paypal.svg"
import applepay from "../assets/applepay.svg"
import gpay from "../assets/gpay.svg"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <>

      <div className="flex justify-center px-4 relative z-10 translate-y-1/2">

        <div className="bg-black rounded-2xl max-w-7xl w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 gap-6">

          <div>
            <h1 className="text-white font-integral text-3xl md:text-[40px] font-bold leading-tight">
              STAY UPTO DATE ABOUT <br />OUR LATEST OFFERS</h1>
          </div>

          <form className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white rounded-full px-4 h-12 md:w-87.25">
              <img src={mail} alt="mail" className="mr-2 w-5 h-5" />
              <input type="email" placeholder="Enter Your Email" className="bg-transparent outline-none w-full" />
            </div>

            <button type="submit" className="bg-white rounded-full h-12 md:w-87.25 font-medium hover:bg-gray-200 transition cursor-pointer">
              Subscribe to Newsletter
            </button>
          </form>

        </div>
      </div>

      <div className='bg-[#F0F0F0] p-6 md:p-12 pt-48 md:pt-32'>

        <div className="max-w-7xl mx-auto">

          <div className='flex flex-col md:flex-row justify-between gap-8 md:gap-12'>
            <div className='md:w-[30%]'>
              <h1 className='font-integral text-[28.85px] font-bold mt-4 md:mt-0 md:text-[33.45px] md:font-extrabold'>SHOP.CO</h1>
              <p className='text-[14px] font-sans my-3 text-[#9A9A9A] '>We have clothes that suits your style and which you're proud to wear. From women to men.</p>
              <div className='flex gap-2 my-2'>
                <Link to="/"><img src={twitter} alt="" /></Link>
                <Link to="/"><img src={facebook} alt="" /></Link>
                <Link to="/"><img src={instagram} alt="" /></Link>
                <Link to="/"><img src={github} alt="" /></Link>
              </div>
            </div>

            <div className='flex-1'>
              <div className='grid grid-cols-2 md:grid-cols-4 md:gap-8 mt-8 md:mt-0 font-sans text-[14px] text-[#9A9A9A] md:text-[16px]'>
                <div className='space-y-2'>
                  <h1 className='font-semibold text-black mb-2'>Company</h1>
                  <p>About</p>
                  <p>Features</p>
                  <p>Work</p>
                  <p>Careers</p>
                </div>
                <div className='space-y-2' >
                  <h1 className='font-semibold text-black mb-2'>Help</h1>
                  <p>Customer Support</p>
                  <p>Delivery Details</p>
                  <p>Terms & Conditions</p>
                  <p>Privacy Policy</p>
                </div>

                <div className='space-y-2'>
                  <h1 className='font-semibold text-black mb-2'>FAQ</h1>
                  <p>Account</p>
                  <p>Manage Deliveres</p>
                  <p>Orders</p>
                  <p>Payments</p>
                </div>
                <div className='space-y-2'>
                  <h1 className='font-sans font-semibold text-black mb-2'>Resources</h1>
                  <p>Free eBook</p>
                  <p>Development Tutorial</p>
                  <p>How to-Blog</p>
                  <p>Youtube Playlist</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <hr className='border-[#9A9A9A] my-8' />

            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              <p className='text-center md:text-left text-[#9A9A9A] my-2 font-sans'>Shop.co © 2000-2023, All Rights Reserved</p>

              <div className='flex justify-center gap-2'>
                <Link><img src={visa} alt="" /></Link>
                <Link><img src={mastercard} alt="" /></Link>
                <Link><img src={paypal} alt="" /></Link>
                <Link><img src={applepay} alt="" /></Link>
                <Link><img src={gpay} alt="" /></Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Footer
