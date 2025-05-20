import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:'post',
    initialState:{
        posts:[],
        SelectedPost:null,
        SavedPosts:[]
    },
    reducers:{
        setPosts:(state,action)=>{
            state.posts = action.payload;
        },
          setSelectedPost:(state,action)=>{
            state.SelectedPost = action.payload;
        },
        
          setSavedPosts:(state,action)=>{
            state.SavedPosts = action.payload;
        }
    }
})

export const {setPosts,setSelectedPost,setSavedPosts} = postSlice.actions;
export default postSlice.reducer;