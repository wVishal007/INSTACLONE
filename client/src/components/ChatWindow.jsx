import React from 'react'
import ChatPage from './ChatPage'
import ChatPage2 from './chatPage2'

const ChatWindow = () => {
  return (
    <div>
        <div className='hidden md:block'><ChatPage /></div>
        <div className='block md:hidden'> <ChatPage2 /></div>
       
    </div>
  )
}

export default ChatWindow
