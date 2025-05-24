import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chatSlice"

const usegetRealtimeMsgs = ()=>{

    const dispatch = useDispatch();
    const {chatMessages} = useSelector(store=>store.chat)
    const {socket} = useSelector(store=>store.socketio)
    useEffect(() => {
socket?.on('newMessage',(newMessage)=>{
    dispatch(setMessages([...chatMessages,newMessage]))
})
socket?.on('newPostMessage',(newPostMessage)=>{
    dispatch(setMessages([...chatMessages,newPostMessage]))
})
return ()=>{
    socket?.off('newMessage')
}
    }, [chatMessages,setMessages])
    
}

export default usegetRealtimeMsgs;