import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { MessageService } from "@/services/user/messageService";
import { Heart, Link, Send, Smile } from "lucide-react";
import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const MessageInput = ({ chatId }: { chatId: string }) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const response = await MessageService.sendMessage(chatId, messageText);
      setMessageText("");
      socket.emit("sendMessage", response.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Link className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          className="flex-1 rounded-lg border-[0.5px] shadow-md"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button variant="ghost" size="icon" onClick={handleSendMessage}>
          <Send className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
