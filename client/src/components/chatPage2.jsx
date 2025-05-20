import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { setSelectedUser } from "../redux/authSlice";
import { setMessages } from "../redux/chatSlice";
import Messages from "./Messages";

import { Button } from "./ui/button";
import {
  MessageCircle,
  MessageCircleMore,
  MessageCircleMoreIcon,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const chatPage2 = () => {
  const [TextMessage, setTextMessage] = useState("");
  const { user, SuggestedUsers, SelectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const { onlineUsers, chatMessages } = useSelector((store) => store.chat);

  const SendMessageHandler = async (recieverID) => {
    try {
      const res = await axios.post(
        `https://instaclone-sje7.onrender.com/api/v1/message/send/${recieverID}`,
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
    <div className="flex flex-col z-10 md:flex-row h-screen w-full">
      {/* Sidebar - User List */}
      {!SelectedUser || window.innerWidth >= 768 ? (
        <section className="w-full md:w-1/4 px-4 py-4 border-r border-gray-200 overflow-y-auto">
          <h1
            onClick={() => dispatch(setSelectedUser(""))}
            className="font-bold text-xl mb-4 cursor-pointer hover:text-blue-700"
          >
            {user?.username}
          </h1>
          <hr className="border-gray-400 mb-4" />
          <div className="space-y-2">
            {SuggestedUsers.map((SuggestedUser) => {
              const isOnline = onlineUsers.includes(SuggestedUser?._id);
              return (
                <div
                  key={SuggestedUser?._id}
                  onClick={() => dispatch(setSelectedUser(SuggestedUser))}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      className="object-cover"
                      src={SuggestedUser?.ProfilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="font-semibold block">
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
                        <p
                          key={index}
                          className="text-xs text-gray-500 truncate w-40"
                        >
                          {msg.message}
                        </p>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Chat Section */}
      {SelectedUser && (
        <section className="flex flex-col flex-1 h-full px-4 py-3">
          {/* Back Button for Mobile */}
          <div className="md:hidden mb-2">
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className="text-blue-600 hover:underline text-sm font-bold mb-2"
            >
              ← Back to users
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center border-b border-gray-300 pb-2 mb-2">
            <Avatar className="mr-3">
              <AvatarImage
                className="object-cover"
                src={SelectedUser?.ProfilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg">
              {SelectedUser?.username}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <Messages SelectedUser={SelectedUser} />
          </div>

          {/* Input Field */}
          <div className="flex items-center mt-3 border-t pt-3">
            <input
              value={TextMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Type your message..."
            />
            <Button
              onClick={() => SendMessageHandler(SelectedUser?._id)}
              className="bg-blue-600 hover:bg-blue-700 transition"
            >
              <Send className="text-white" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default chatPage2;
