import React from 'react'

// Create a reusable Logo component or update your Sidebar/Navbar
const Logo = () => (
  <div className="flex items-center gap-1 cursor-pointer group">
    <h1 className="font-black text-2xl tracking-[0.25em] text-white transition-all group-hover:tracking-[0.3em]">
      FRAME
    </h1>
    <span className="h-2 w-2 bg-red-600 rounded-full mt-2 animate-pulse" />
  </div>
);

export default Logo