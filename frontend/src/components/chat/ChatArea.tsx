import { useEffect, useState } from "react";
import ChatHeader from "./chat-header/ChatHeader";
import { MessageService } from "@/services/user/messageService";
import Message from "./messages/Message";
import MessageInput from "./messages/MessageInput";

const ChatArea = ({ selectedChat }: { selectedChat: any }) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedChat) {
          const response = await MessageService.getMessages(selectedChat._id);
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (selectedChat) fetchMessages();
  }, [selectedChat]);

  const handleMessageSent = (newMessage: any) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          <ChatHeader selectedChat={selectedChat} />
          <Message messages={messages} selectedChat={selectedChat} />
          <MessageInput chatId={selectedChat._id} onMessageSent={handleMessageSent} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatArea;
