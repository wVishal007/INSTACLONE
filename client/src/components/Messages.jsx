import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import usegetAllMessages from "../hooks/usegetAllMessages";
import usegetRealtimeMsgs from "../hooks/usegetRealtimeMsgs";
import { IoIosClose } from "react-icons/io";
import Post from './Post'

const Messages = ({ SelectedUser }) => {
  const { chatMessages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [Show, setShow] = useState(false);
  const [CurrentPost, setCurrentPost] = useState({})
  usegetAllMessages();
  usegetRealtimeMsgs();

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
        {chatMessages &&
          chatMessages.map((msg) => {
            return (
              <div
                className={`flex px-2 my-1 ${
                  msg.senderID === user?._id ? "justify-end" : "justify-start"
                }`}
                key={msg?._id}
              >
                <div>
                  <div className="flex gap-2 items-center">
                    {msg.senderID === user?._id ? (
                      <Avatar>
                        <AvatarImage
                          className="shadow-2xs object-cover"
                          src={user?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage
                          className="shadow-2xs object-cover"
                          src={SelectedUser?.ProfilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs break-words rounded-lg py-1 px-2 ${
                        msg.senderID === user?._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } ${msg.PostMessage ? "p-0 bg-transparent" : ""}`}
                    >
                      {msg?.PostMessage ? (
                        <div
                          onClick={() => {setShow(true)
                            setCurrentPost(posts.find((item) => item._id === msg.PostMessage))
                          }}
                          className="bg-gray-100 px-2 py-1 pb-2 rounded-lg shadow-2xl border-gray-400 border-2 flex gap-1 flex-col"
                        >
                          <span className="text-sm font-bold text-black">
                            {
                              posts.find((item) => item._id === msg.PostMessage)
                                ?.author?.username
                            }
                          </span>
                          <img
                            className="rounded-lg h-full w-full object-cover"
                            src={
                              posts.find((item) => item._id === msg.PostMessage)
                                ?.image
                            }
                            alt="image"
                          />
                          <span className="text-xs font-semibold text-gray-600">
                            {
                              posts.find((item) => item._id === msg.PostMessage)
                                ?.caption
                            }
                          </span>
                        </div>
                      ) : (
                        msg.message
                      )}
                      <Dialog open={Show}>
                        <DialogTrigger asChild></DialogTrigger>
                        <DialogContent
                          className="bg-white w-fit max-w-[90vw] max-h-[90vh] h-fit p-0 flex items-center justify-between flex-col gap-2"
                          onInteractOutside={() => {}}
                        >
                          <div className="flex relative justify-center items-center "><Post Show={Show} post={CurrentPost}/>
                          <IoIosClose className="absolute top-1 right-1 text-4xl font-bold" onClick={()=>setShow(false)}/></div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
