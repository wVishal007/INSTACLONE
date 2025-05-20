import { Heart, MessageCircleMore } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navgate = useNavigate()
    const location = useLocation();
    const HideNavbar = location.pathname === "/chat"
useEffect(()=>{
 const HideNavbar = location.pathname === "/chat"
},[navgate])
  return (
    <div className='block md:hidden'>
      <div className={`flex px-3 mt-5 items-center justify-between ${HideNavbar ? 'hidden':'flex'}`}>
        <div className='font-bold text-xl'>LOGO</div>
        <div className='flex gap-2 font-bold'>
            <span><Heart/></span>
            <span onClick={()=>navgate('/chat')} className='cursor-pointer'><MessageCircleMore/></span>
        </div>

      </div>
    </div>
  )
}

export default Navbar
