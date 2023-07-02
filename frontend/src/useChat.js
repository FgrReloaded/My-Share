import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [files, setFiles] = useState([]);
  const socketRef = useRef();
  const host = "https://myshare-back.adaptable.app";

  useEffect(() => {
    socketRef.current = socketIOClient(host, {
      query: { roomId },
    });
    socketRef.current.emit("join_room", roomId);
    socketRef.current.on("show-loader", (data)=>{
       setLoader({load:data.load, ownedByCurrentUser: data.senderId === socketRef.current.id})
    })
    socketRef.current.on("newChatMessage", (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });
    socketRef.current.on("file-receive", (data)=>{
      const incomingFile = {
        ...data,
        ownedByCurrentUser: data.senderId === socketRef.current.id
      };
      setFiles((files)=>[...files, incomingFile]);
      setLoader(false)
    })


    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, host]);
  const showLoader = ()=>{
    console.log("first")
    socketRef.current.emit("show-loader", {load:true, senderId: socketRef.current.id})
  }
  const sendMessage = (messageBody) => {
    socketRef.current.emit("newChatMessage", {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };
  const shareFile = (url, filedata)=>{
    socketRef.current.emit("file-send", {url, filedata, senderId: socketRef.current.id});
  }

  return { messages, sendMessage, shareFile, files,showLoader, loader };
};

export default useChat;
