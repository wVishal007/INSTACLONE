import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='overflow-y-auto md:h-full'>
      <Posts/>
    </div>
  )
}

export default Feed
