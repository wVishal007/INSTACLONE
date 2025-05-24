//real time notifications = rts
import { createSlice } from "@reduxjs/toolkit";

const RtnSlice = createSlice({
    name:'RTN',
    initialState:{
        likeNotifications:[],
        commentNotifications:[]

    },reducers:{
        setlikeNotifications:(state,action)=>{
            if(action.payload.type==='like'){
                state.likeNotifications.push(action.payload)
            } else if(action.payload.type==='dislike'){
                state.likeNotifications = state.likeNotifications.filter((item)=>item.userID !== action.payload.userID)
            }
        },
        setCommentNotification:(state,action)=>{
             state.commentNotifications.unshift(action.payload);
        }
    }
})

export const {setlikeNotifications,setCommentNotification} = RtnSlice.actions;
export default RtnSlice.reducer;