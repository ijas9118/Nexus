import { useEffect, useState } from "react";
import ChatHeader from "./chat-header/ChatHeader";
import { MessageService } from "@/services/user/messageService";
import Message from "./messages/Message";
import MessageInput from "./messages/MessageInput";

const ChatArea = ({ selectedChat }: { selectedChat: any }) => {
  const [messages, setMessages] = useState<any[]>([
    // {
    //   id: "1",
    //   content: "How has your day been so far?",
    //   timestamp: "10:06 AM",
    //   isSent: false,
    // },
    // {
    //   id: "2",
    //   content:
    //     "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
    //   timestamp: "10:10 AM",
    //   isSent: true,
    // },
    // {
    //   id: "3",
    //   content: "Awesome! I am just chilling outside.",
    //   timestamp: "3:34 PM",
    //   isSent: false,
    // },
  ]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await MessageService.getMessages(selectedChat._id);
        setMessages(response.data);
        console.log(response.data[0].sender._id, selectedChat.userId);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (selectedChat) fetchMessages();
  }, [selectedChat]);

  return (
    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          <ChatHeader selectedChat={selectedChat} />
          <Message messages={messages} selectedChat={selectedChat} />
          <MessageInput />
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
