import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { addMessage } from "@/store/slices/chatSlice";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatData, selectedChatType } = useSelector(
    (state: RootState) => state.chat,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleReceiveMessage = (message: any) => {
    if (
      selectedChatType !== undefined &&
      selectedChatData?._id &&
      (selectedChatData._id === message.sender._id ||
        selectedChatData._id === message.recipient._id)
    ) {
      console.log("Message Received:", message);
      dispatch(addMessage(message));
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("recieveMessage", handleReceiveMessage);

    return () => {
      socket.off("recieveMessage", handleReceiveMessage);
    };
  }, [socket, selectedChatData, selectedChatType, dispatch]);

  const handleSendMessage = async () => {
    if (!socket) {
      console.log("Socket is not initialized");
      return;
    }
    if (selectedChatType === "connection") {
      socket?.emit("sendMessage", {
        sender: user?._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  const handleAddEmoji = (emoji: { emoji: string }) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[4vh] flex justify-center items-center px-8 mb-5 gap-2">
      <div className="flex-1 flex rounded-md items-center gap-1">
        <Input
          type="text"
          className="flex-1 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="ghost">
          <Paperclip />
        </Button>
        <div className="relative">
          <Button variant="ghost" onClick={() => setEmojiPickerOpen(true)}>
            <SmilePlus />
          </Button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <Button variant="ghost" onClick={handleSendMessage}>
        <Send />
      </Button>
    </div>
  );
};

export default MessageBar;
