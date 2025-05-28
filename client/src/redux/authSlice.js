import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        SuggestedUsers:[],
        userProfile:null,
        SelectedUser:null,
        Following:[],
        myStories:[],
        Stories:[]

    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user = action.payload
        },
         setSuggestedUsers:(state,action)=>{
            state.SuggestedUsers = action.payload
        },
        setuserProfile:(state,action)=>{
            state.userProfile = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.SelectedUser = action.payload
        },
        setFollowing:(state,action)=>{
            state.Following = action.payload
        },
        setmyStories:(state,action)=>{
            state.myStories=action.payload;
        },
        setStories:(state,action)=>{
            state.Stories=action.payload;
        }
    }
})

export const {setAuthUser,setSuggestedUsers,setuserProfile,setSelectedUser,setFollowing,setmyStories,setStories} = authSlice.actions;
export default authSlice.reducer;






