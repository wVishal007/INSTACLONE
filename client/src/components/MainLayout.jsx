import React from 'react'
import { Outlet } from 'react-router-dom'
import Leftsidebar from './Leftsidebar'
import Navbar from './Navbar'
import BottomBar from './BottomBar'
import Stories from './stories'

const MainLayout = () => {
  return (
    <div className="font-poppins">
     <div> <Navbar/></div>
     <Stories/>
<div className='flex-1'>
    <Leftsidebar/>
    <Outlet/>  
   <div className='fixed bottom-0 bg-white w-full md:hidden'>
 <BottomBar/>
   </div>
</div>
    </div>
  )
}

export default MainLayout
