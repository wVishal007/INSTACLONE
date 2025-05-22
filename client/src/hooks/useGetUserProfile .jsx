import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setuserProfile } from "../redux/authSlice"

const useGetUserProfile = (userID)=>{
    const dispatch = useDispatch();
    useEffect(() => {
 const fetchUserProfile = async()=>{
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/${userID}/profile`,{withCredentials:true})
        if(res.data.success){
dispatch(setuserProfile(res.data.User))
        }
    } catch (error) {
        console.log(error)
    }
 }
 fetchUserProfile();
    }, [userID])
    
}

export default useGetUserProfile ;