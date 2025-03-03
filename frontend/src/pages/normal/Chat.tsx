import { useState } from "react";
import ChatArea from "../../components/chat/ChatArea";
import Sidebar from "../../components/chat/sidbar/Sidebar";

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
