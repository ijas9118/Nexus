import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const handleReceiveMessage = useCallback(
    (message: any) => {
      if (
        selectedChatType !== undefined &&
        selectedChatData?._id &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        console.log("Message Received:", message);
        dispatch(addMessage(message));
      }
    },
    [dispatch, selectedChatData._id, selectedChatType],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("recieveMessage", handleReceiveMessage);

    return () => {
      socket.off("recieveMessage", handleReceiveMessage);
    };
  }, [
    socket,
    selectedChatData,
    selectedChatType,
    dispatch,
    handleReceiveMessage,
  ]);

  const handleSendMessage = async () => {
    if (!socket) {
      console.log("Socket is not initialized");
      return;
    }
    if (!message.trim()) {
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
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddEmoji = (emoji: { emoji: string }) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="min-h-[4vh] flex items-center px-2 sm:px-4 md:px-8 mb-2 sm:mb-5 gap-1 sm:gap-2">
      <div className="flex-1 flex rounded-md items-center gap-1">
        <Input
          type="text"
          className="flex-1 bg-transparent rounded-md text-sm sm:text-base
          focus:border-none focus:outline-none py-1 sm:py-2"
          placeholder="Enter a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button variant="ghost" size="sm" className="p-1 sm:p-2">
          <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 sm:p-2"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <SmilePlus className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div
            className="absolute bottom-12 right-0 scale-75 sm:scale-100 origin-bottom-right"
            ref={emojiRef}
          >
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 sm:p-2"
        onClick={handleSendMessage}
      >
        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

export default MessageBar;
