import { useEffect, useState } from "react";
import ChatHeader from "./chat-header/ChatHeader";
import { MessageService } from "@/services/user/messageService";
import Message from "./messages/Message";
import MessageInput from "./messages/MessageInput";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatArea = ({ selectedChat }: { selectedChat: any }) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedChat) {
          const response = await MessageService.getMessages(selectedChat._id);
          setMessages(response.data);
          socket.emit("joinChat", selectedChat._id);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (selectedChat) fetchMessages();

    return () => {
      if (selectedChat) {
        socket.emit("leaveChat", selectedChat._id);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) =>
        prevMessages.some((msg) => msg._id === message._id)
          ? prevMessages
          : [...prevMessages, message],
      );
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          <ChatHeader selectedChat={selectedChat} />
          <Message messages={messages} selectedChat={selectedChat} />
          <MessageInput chatId={selectedChat._id} />
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
