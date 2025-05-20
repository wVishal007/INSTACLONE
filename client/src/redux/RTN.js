//real time notifications = rts
import { createSlice } from "@reduxjs/toolkit";

const RtnSlice = createSlice({
    name:'RTN',
    initialState:{
        likeNotifications:[],

    },reducers:{
        setlikeNotifications:(state,action)=>{
            if(action.payload.type==='like'){
                state.likeNotifications.push(action.payload)
            } else if(action.payload.type==='dislike'){
                state.likeNotifications = state.likeNotifications.filter((item)=>item.userID !== action.payload.userID)
            }
        }
    }
})

export const {setlikeNotifications} = RtnSlice.actions;
export default RtnSlice.reducer;