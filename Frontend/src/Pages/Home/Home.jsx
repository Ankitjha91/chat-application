import React from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeSocket } from "../../Store/Slice/socket/socket.slice";
import { setOnlineUsers } from "../../Store/Slice/socket/socket.slice";
import { setNewMessage } from "../../Store/Slice/message/message.slice";


const Home = () => {

  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector(state => state.userReducer);
  const { socket, onlineUsers } = useSelector(state => state.socketReducer);


  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(initializeSocket(userProfile?._id));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;
    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("newMessage", (newMessage) => {
      dispatch(setNewMessage(newMessage));
    });

    return () => {
      socket.close();
    }
  }, [socket]);

  return (
    <div className="flex">
      <UserSidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;