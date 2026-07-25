import React from 'react'
import { Outlet } from 'react-router-dom'
import SmallHeader from './SmallHeader'
import Navbar from './Navbar'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <>
        <SmallHeader/>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default MainLayout
