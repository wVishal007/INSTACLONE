import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import usegetAllMessages from "../hooks/usegetAllMessages";
import usegetRealtimeMsgs from "../hooks/usegetRealtimeMsgs";

const Messages = ({ SelectedUser }) => {
  const {chatMessages} = useSelector(store=>store.chat)
  const {user} =useSelector(store=>store.auth)
  const {posts} = useSelector(store=>store.post)
  usegetAllMessages()
   usegetRealtimeMsgs()

// const PhotoCheck = async(msg) =>{
//  const urlPattern = /https://res.cloudinary.com;
//    return await urlPattern.test(msg)
// }   
  
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={SelectedUser?.ProfilePicture}
              className="object-cover"
            />
            <AvatarFallback className="rounded-full bg-gray-200 p-2">
              CN
            </AvatarFallback>
          </Avatar>
          <span>{SelectedUser?.username}</span>
          <Link
            to={`/profile/${SelectedUser?._id}`}
            className="cursor-pointer hover:font-bold"
          >
            <Button className="font-semibold hover:font-bold rounded-sm p-2 m-3 text-black bg-gray-200">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col">
      {
         chatMessages && chatMessages.map((msg)=>{
            return (
                <div className={`flex px-2 my-1 ${msg.senderID === user?._id ? 'justify-end':'justify-start'}`} key={msg?._id}>
                    <div>
               <div className="flex gap-2 items-center">
                       {
                        msg.senderID === user?._id ? (   <Avatar>
                        <AvatarImage className='shadow-2xs object-cover' src={user?.profilePicture}/>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>) : ( <Avatar>
                        <AvatarImage className='shadow-2xs object-cover' src={SelectedUser?.ProfilePicture}/>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>)
                      }
                   
                      <div className={`max-w-xs break-words rounded-lg py-1 px-2 ${msg.senderID === user?._id ? 'bg-blue-500 text-white':'bg-gray-200'} ${msg.PostMessage ? 'p-0 bg-transparent' : ''}`}>
                        {msg?.PostMessage ? <div className="flex flex-col">
                          <img className="rounded-lg h-full w-full object-cover" src={msg.PostMessage}/> 
                        </div>: msg.message }
                          
                      </div>
               </div>
                    </div>
                </div>
            )
        })
      }
      </div>
    </div>
  );
};

export default Messages;
