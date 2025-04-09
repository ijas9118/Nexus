import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";

interface MessageInputProps {
  chatId: string;
  chatType: "Chat" | "Group";
}

const MessageInput = ({ chatId, chatType }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const socket = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSend = () => {
    if (socket && content.trim() && user) {
      console.log(content);
      socket.emit("sendMessage", { chatId, chatType, content });
      setContent("");
    }
  };

  return (
    <div className="px-2 py-2 border-t bg-primary-foreground flex items-center space-x-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <Button onClick={handleSend}>Send</Button>
    </div>
  );
};

export default MessageInput;
