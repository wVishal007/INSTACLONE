import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chatSlice"

const usegetAllMessages = ()=>{

    const dispatch = useDispatch();
    const {SelectedUser}=useSelector(store=>store.auth)
    useEffect(() => {
 const fetchAllMessages = async(id)=>{
    try {
        const res = await axios.get(`http://localhost:3000/api/v1/message/all/${SelectedUser?._id}`,{withCredentials:true})
        if(res.data.success){
dispatch(setMessages(res.data.messages))
        }
    } catch (error) {
        console.log(error)
    }
 }
 fetchAllMessages();
    }, [SelectedUser])
    
}

export default usegetAllMessages;