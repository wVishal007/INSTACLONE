import { useState,useEffect } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Signup from './components/signup'
import Login from './components/login'
import Home from './components/home'
import MainLayout from './components/MainLayout'
import Profile from './components/profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setCommentNotification, setlikeNotifications } from './redux/RTN'
import ProtectedRoutes from './components/ProtectedRoutes'
import ChatWindow from './components/ChatWindow'
import '../src/index.css'
import NotificationPage from './components/NotificationPage'
import Search from './components/Search'

const browserRouter = createBrowserRouter([
  {
      path:'/',
  element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
  children:[
    {
      path:'/',
      element:<ProtectedRoutes><Home/></ProtectedRoutes>
    },
    {
      path:'/profile/:id',
      element:<ProtectedRoutes><Profile/></ProtectedRoutes>
    },
     {
      path:'/account/edit',
      element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>
    },
     {
      path:'/chat',
      element:<ProtectedRoutes><ChatWindow/></ProtectedRoutes>
    },
     {
      path:'/notifications',
      element:<ProtectedRoutes><NotificationPage/></ProtectedRoutes>
    },
     {
      path:'/Search',
      element:<ProtectedRoutes><Search/></ProtectedRoutes>
    }

  ]
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/login',
    element:<Login/>
  }
])

function App() {
  const dispatch = useDispatch()
  const {socket} = useSelector(store=>store.socketio)
  const {user} = useSelector(store=>store.auth)
  useEffect(() => {
 if(user){
  const socketio = io('https://instaclone-sje7.onrender.com',{
    query:{
      userId:user?._id
    },transports:['websocket']
  })
dispatch(setSocket(socketio))
socketio.on('getOnlineUsers',(onlineUsers)=>{
  dispatch(setOnlineUsers(onlineUsers))
})

socketio.on('notification',(notification)=>{
  dispatch(setlikeNotifications(notification))
})
socketio.on('CommentNotification',(notification)=>{
  dispatch(setCommentNotification(notification))
})

return ()=>{
  socketio.close();
  dispatch(setSocket(null))

}
 }
 else if(socket){
  socket?.close();
  dispatch(setSocket(null))
 }
  }, [user,dispatch])
  

  return (
    <>
 <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
