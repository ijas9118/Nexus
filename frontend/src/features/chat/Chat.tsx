import { useState } from "react";
import Sidebar from "./components/sidbar/Sidebar";
import ChatArea from "./components/ChatArea";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);

  return (
    <div className="flex h-full">
      <Sidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      <ChatArea selectedChat={selectedChat} />
    </div>
  );
};

export default Chat;
