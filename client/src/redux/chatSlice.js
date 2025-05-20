import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        chatMessages:[]
    },reducers:{
        setOnlineUsers:(state,action)=>{
state.onlineUsers = action.payload;
        },
        setMessages:(state,action)=>{
state.chatMessages = action.payload;
        }
    }
})

export const {setOnlineUsers,setMessages} = chatSlice.actions;
export default chatSlice.reducer;
