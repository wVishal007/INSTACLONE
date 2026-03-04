import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useAllUsersPosts from '../hooks/useAllUsersPosts'
import getSuggestedUsers from '../hooks/getSuggestedUsers'
import useGetUsersFollowing from '../hooks/useGetUsersFollowing'
import useGetSavedPosts from '../hooks/useGetSavedPosts'

const Home = () => {
  useAllUsersPosts();
  getSuggestedUsers();
  useGetUsersFollowing();
  useGetSavedPosts();

  return (
    <div className='flex min-h-screen bg-[#050505]'>
      <div className='flex-grow px-4 md:px-8 py-6'>
        {/* New Bespoke Header */}
        <header className='mb-10 flex justify-between items-end'>
          <div>
            <h1 className='text-5xl font-black tracking-tighter text-white uppercase'>
              Discover<span className='text-red-600'>.</span>
            </h1>
            <p className='text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-2'>
              Curated for your perspective
            </p>
          </div>
          
          {/* Subtle Filter Tabs - Distinct from IG */}
          <div className='hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500'>
            <button className='text-white border-b-2 border-red-600 pb-1'>Trending</button>
            <button className='hover:text-white transition-colors'>Newest</button>
            <button className='hover:text-white transition-colors'>Following</button>
          </div>
        </header>

        <div className='flex gap-8'>
          <div className='flex-grow'>
            <Feed /> {/* We will modify the Feed to use a Masonry Grid */}
            <Outlet />
          </div>
          
          {/* Right sidebar becomes a 'floating' utility blade */}
          <div className='hidden xl:block w-[320px]'>
             <RightSideBar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home