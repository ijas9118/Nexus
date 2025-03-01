import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Link, Plus, Smile, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import ChatHeader from "./chat-header/ChatHeader";
import { MessageService } from "@/services/user/messageService";

const ChatArea = ({ selectedChat }: { selectedChat: any }) => {
  const [messages, _] = useState<any[]>([
    {
      id: "1",
      content: "How has your day been so far?",
      timestamp: "10:06 AM",
      isSent: false,
    },
    {
      id: "2",
      content:
        "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
      timestamp: "10:10 AM",
      isSent: true,
    },
    {
      id: "3",
      content: "Awesome! I am just chilling outside.",
      timestamp: "3:34 PM",
      isSent: false,
    },
  ]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await MessageService.getMessages(selectedChat._id);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch messages:", error);
  //     }
  //   };

  //   if (selectedChat) fetchMessages();
  // }, [selectedChat]);
  return (
    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <ChatHeader selectedChat={selectedChat} />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
              >
                {!message.isSent && (
                  <Avatar className="h-8 w-8 mt-2 mr-2">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.isSent ? "bg-primary text-background" : "bg-secondary "
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  <p
                    className={`text-xs ${
                      message.isSent ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>

                {message.isSent && (
                  <Avatar className="h-8 w-8 mt-2 ml-2">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Link className="h-5 w-5" />
              </Button>
              <Input
                className="flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border-0"
                placeholder="Type a message..."
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
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
