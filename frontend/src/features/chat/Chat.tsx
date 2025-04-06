import { useSocket } from "@/hooks/useSocket";
import { ChatList } from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

const Chat = () => {
  useSocket();
  return (
    <div className="flex h-full">
      <ChatList />
      <ChatWindow />
    </div>
  );
};

export default Chat;
