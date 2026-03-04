import React from 'react'
import { Outlet } from 'react-router-dom'
import Leftsidebar from './Leftsidebar'
import Navbar from './Navbar'
import BottomBar from './BottomBar'
import Stories from './stories'

const MainLayout = () => {
  return (
    <div className="font-poppins min-h-screen bg-[#050505]">
      {/* Navbar stays at the top */}
      <div className="fixed top-0 w-full z-50"> 
        <Navbar/>
      </div>

      <div className='flex'>
        {/* Sidebar: Fixed width on desktop */}
        <div className='hidden md:block fixed left-0 top-0 h-screen w-[18%] lg:w-[16%] border-r border-white/5'>
            <Leftsidebar/>
        </div>

        {/* CONTENT WRAPPER:
            We add md:ml-[18%] to push the content away from the fixed sidebar.
        */}
        <div className='flex-1 flex flex-col md:ml-[18%] lg:ml-[16%] w-full min-h-screen'>
            {/* Stories at the top of the feed */}
            <div className="pt-16 md:pt-20">
                <Stories/>
            </div>
            
            {/* Page content (Home, Search, Profile) */}
            <main className='flex-1 pb-20 md:pb-0'>
                <Outlet/> 
            </main>
        </div>

        {/* Mobile Bottom Bar */}
        <div className='fixed bottom-0 bg-[#0a0a0a] border-t border-white/10 w-full md:hidden z-50'>
            <BottomBar/>
        </div>
      </div>
    </div>
  )
}

export default MainLayout