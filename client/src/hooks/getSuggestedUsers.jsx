import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSuggestedUsers } from "../redux/authSlice"


const getSuggestedUsers = ()=>{

    const dispatch = useDispatch();
    useEffect(() => {
 const fetchSuggestedUsers = async()=>{
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/suggested`,{withCredentials:true})
        if(res.data.success){
dispatch(setSuggestedUsers(res.data.users))
        }
    } catch (error) {
        console.log(error)
    }
 }
 fetchSuggestedUsers();
    }, [])
    
}

export default getSuggestedUsers;