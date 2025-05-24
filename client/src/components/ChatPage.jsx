import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { setSelectedUser } from "../redux/authSlice";
import { setMessages } from "../redux/chatSlice";
import Messages from "./Messages";

import { Button } from "./ui/button";
import {
  Image,
  MessageCircleMore,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ChatPage = () => {
  const inputRef = useRef()
  const [TextMessage, setTextMessage] = useState("");
  const { user, SuggestedUsers, SelectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const { onlineUsers, chatMessages } = useSelector((store) => store.chat);

  const SendMessageHandler = async (recieverID) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message/send/${recieverID}`,
        { message: TextMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...chatMessages, res.data.newMessage]));
        setTextMessage("");
        // toast.success(res.data.confirmation)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    return () => {
      setSelectedUser(null);
    };
  });

  return (
    <div className="flex md:ml-[20%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1
          onClick={() => dispatch(setSelectedUser(""))}
          className="font-bold text-xl mb-4 px-3 cursor-pointer hover:text-blue-700"
        >
          {user?.username}
        </h1>
        <hr className="border-gray-400 mb-4" />
        <div className="overflow-y-auto h-[80vh]">
          {SuggestedUsers.map((SuggestedUser) => {
            const isOnline = onlineUsers.includes(SuggestedUser?._id);
            return (
              <div
                key={SuggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(SuggestedUser))}
                className="flex gap-3 bg-gray-50 my-1 rounded-lg px-2 items-center hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex my-2 justify-between">
                  <Avatar className="mr-4 w-14 h-14">
                    <AvatarImage
                      className="object-cover"
                      src={SuggestedUser?.ProfilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold flex justify-start">
                      {SuggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isOnline ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                    {chatMessages
                      ?.filter((msg) => msg.senderID === SuggestedUser?._id)
                      .map((msg, index) => (
                        <span className="text-xs font-semibold text-gray-600" key={index}>{msg.message}</span>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {SelectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full px-5 mx-5">
          <div className=" pt-3 pb-2 border-b border-b-gray-300 flex items-center font-semibold">
            <Avatar className="mr-4">
              <AvatarImage
                className="object-cover"
                src={SelectedUser?.ProfilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{SelectedUser?.username}</span>
          </div>
          Messages comming....
          <Messages SelectedUser={SelectedUser} />
          <div className="p-4 gap-3 border-t border-t-gray-300 flex items-center">
            <input
              value={TextMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 focus-visible:ring-transparent mr-2 border border-1/4 h-15 rounded-xl px-2"
              placeholder="type your message here"
            />
            <input ref={inputRef} className="hidden" type="file" />
            <Button onClick={()=>inputRef.current.click()} className='cursor-pointer'><Image className="text-black font-bold bg-white"/></Button>
            <Button
              onClick={() => SendMessageHandler(SelectedUser?._id)}
              className="bg-blue-700 hover:scale-90"
            >
              <Send className="cursor-pointer hover:text-pink-400 font-bold z-10" />
            </Button>
          </div>
        </section>
      ) : (
        <div className="hidden md:flex w-full h-full justify-center items-center border-l border-l-gray-300 ml-10">
          <div className="flex flex-col gap-2 items-center">
            <MessageCircleMore className="w-30 h-30 " />
            <span className="font-semibold text-xl">Your Messages</span>
            <span className="">Message to start chat...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
