import React from 'react'
import Header from '../UserLayout/Header'
import SideBar from './SideBar'
import Footer from '../UserLayout/Footer'
import { useState } from 'react'
function CategoryLayout({children}) {
    const [isPopUp,setIsPopUp]=useState(false);

  return (
    <div className='font-Montserrat'
      style={isPopUp?{backgroundColor :""}:{}}
    >
      <Header isPopUp={isPopUp} setIsPopUp={setIsPopUp}/>
        <div className='xl:flex mx-2 xl:mx-20 mt-5 border-t-[1px] border-gray-400'>
            <div className='xl:basis-[20%] mt-10 hidden xl:block'>
                <SideBar/>
            </div>
            <div className='xl:basis-[80%]'>
                {children}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CategoryLayout
