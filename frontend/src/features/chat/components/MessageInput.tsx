import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, setChats } from "@/store/slices/chatSlice"; // Import relevant actions

interface MessageInputProps {
  chatId: string;
  chatType: "Chat" | "Group";
}

const MessageInput = ({ chatId, chatType }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { pendingChat, chats } = useSelector((state: RootState) => state.chat);

  // Function to send a message
  const sendMessage = (
    targetChatId: string,
    targetChatType: "Chat" | "Group",
  ) => {
    if (socket && content.trim() && user) {
      socket.emit("sendMessage", {
        chatId: targetChatId,
        chatType: targetChatType,
        content,
      });
      setContent("");
    }
  };

  // Handle sending logic
  const handleSend = () => {
    if (!content.trim() || !user || !socket) return;

    // If there's a pending chat, create a new chat
    if (pendingChat) {
      socket.emit("createChat", pendingChat.userId);
    } else if (chatId) {
      // If there's an existing chatId, send the message directly
      sendMessage(chatId, chatType);
    }
  };

  // Listen for chatCreated event
  useEffect(() => {
    if (!socket || !pendingChat || !user) return;

    const handleChatCreated = (newChat: any) => {
      const recipient = newChat.participants.find(
        (p: any) => p._id !== user._id,
      );

      dispatch(setChats([...chats, newChat]));

      if (recipient._id !== user._id)
        dispatch(
          setActiveChat({
            id: newChat._id,
            type: "Chat",
            userDetails: {
              userId: recipient?._id,
              name: recipient?.name || "Unknown",
              username: recipient?.username,
              profilePic: recipient?.profilePic,
            },
          }),
        );

      // Send the message now that the chat is created
      sendMessage(newChat._id, "Chat");
    };

    socket.on("chatCreated", handleChatCreated);

    // Cleanup listener on unmount or when dependencies change
    return () => {
      socket.off("chatCreated", handleChatCreated);
    };
  }, [socket, pendingChat, user, content, dispatch, chats, sendMessage]);

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
