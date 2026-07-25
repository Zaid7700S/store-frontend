import React from 'react'
import Hero from '../Components/Hero'
import Hero2 from '../Components/Hero2'
import NewArrivals from '../Components/NewArrivals'
import TopSelling from '../Components/TopSelling'
import BrowseBy from '../Components/BrowseBy'
import Reviews from '../Components/Reviews'


const HomePage = () => {
    return (
        <>
            <Hero2 />
            <NewArrivals />
            <TopSelling />
            <BrowseBy />
            <Reviews />
        </>
    )
}

export default HomePage
