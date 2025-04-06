import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const { activeChat, messages } = useSelector(
    (state: RootState) => state.chat,
  );
  const socket = useSocket();

  useEffect(() => {
    if (activeChat && socket) {
      // Fetch messages if not already loaded (could call an API here)
      // For now, assume messages are updated via socket
    }
  }, [activeChat, socket]);

  if (!activeChat) {
    return (
      <div className="w-3/4 h-full flex items-center justify-center ">
        <p className="text-muted-foreground">
          Select a chat to start messaging
        </p>
      </div>
    );
  }
  return (
    <div className="w-3/4 h-full flex flex-col ">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages[activeChat.id]?.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
      </div>
      <MessageInput chatId={activeChat.id} chatType={activeChat.type} />
    </div>
  );
};

export default ChatWindow;
