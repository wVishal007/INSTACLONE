import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useAllUsersPosts from '../hooks/useAllUsersPosts'
import getSuggestedUsers from '../hooks/getSuggestedUsers'
import useGetUsersFollowing from '../hooks/useGetUsersFollowing'
import useGetSavedPosts from '../hooks/useGetSavedPosts'

const home = () => {
  useAllUsersPosts();
  getSuggestedUsers();
    useGetUsersFollowing();
    useGetSavedPosts();
  return (
    <div className='flex'>
     <div className='flex-grow'>
       <Feed/>
       <Outlet/>
     </div>
    <RightSideBar/>
    </div>
  )
}

export default home
