import React, { useRef,useState } from 'react'
import {Dialog, DialogContent, DialogHeader} from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {Textarea} from './ui/textarea'
import {Button} from './ui/button'
import { readFileAsDataURL } from '../lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';
import { useNavigate } from 'react-router-dom';
import useAllUsersPosts from '../hooks/useAllUsersPosts';



const CreatePostDialog = ({open ,setOpen}) => {
const [loading, setloading] = useState(false)
const imageRef = useRef();
const [file, setfile] = useState("")
const [caption, setcaption] = useState("")
const [imgPreview, setimgPreview] = useState("")
const {user} = useSelector(store=>store.auth)
const {posts} = useSelector(store=>store.post)
const dispatch = useDispatch();


const fileChangeHandler =async (e) =>{
const File = e.target.files?.[0];
if(File){
    setfile(File)
    const dataUrl = await readFileAsDataURL(File)
    setimgPreview(dataUrl)
}
}

const createPostHandler = async (e)=>{
const formData = new FormData()
formData.append("caption",caption)
if(imgPreview){
    formData.append("image",file)
}
try {
    console.log(formData)
    setloading(true)
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,formData,{
        headers:{
"Content-Type":'multipart/form-data'
        },withCredentials:true
    }
    )
    if(res.data.success){
        toast.success(res.data.message);
        dispatch(setPosts([res.data.post, ...posts]));
        setfile(null)
        setcaption('')
         setimgPreview("")
        setOpen(false)
    }
} catch (error) {
    toast.error(error.response.data.message)
} finally{
    setloading(false)
}
}


  return (
   <Dialog open ={open}>
<DialogContent className="bg-white" onInteractOutside={()=>setOpen(false)}>
<DialogHeader className='font-semibold text-center'>
    Create new post
</DialogHeader>
<div className='flex gap-3 items-center'>
    <Avatar>
        <AvatarImage src={user?.profilePicture} alt=''/>
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div >
        <h1 className='text-xs font-semibold'>{user?.username}</h1>
        <span className='text-gray-600 text-xs'>Caption here</span>
    </div>
</div>
<Textarea value={caption} onChange={(e)=>setcaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Wite a caption'/>
{/* <input type='file'/> */}
{
    imgPreview && <div className='w-full h-104 my-5 flex items-center justify-center'>
        <img className='object-cover h-full w-full rounded-md ' src={imgPreview} alt="" />
    </div>
}
<div className='flex justify-between'>
    <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden' />
<Button onClick={()=>imageRef.current.click()} className='bg-blue-500 rounded-lg w-fit mx-auto hover:bg-[#0095F6] hover:scale-110'>select from device</Button>
{
    imgPreview && (

        loading ? (<Button className='w-35 mx-auto'><Loader2 className='rounded-lg mr-2 h-4 w-4 animate-spin'/>Please wait...</Button>)
        :
        (<Button type='submit' onClick={createPostHandler} className='rounded-lg mx-auto w-30 font-semibold hover:scale-110'>Post</Button>)
)
}
</div>
</DialogContent>
   </Dialog>
  )
}

export default CreatePostDialog
