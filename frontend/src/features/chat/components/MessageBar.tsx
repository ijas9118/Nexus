import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { addMessage } from "@/store/slices/chatSlice";
import { MessageService } from "@/services/user/messageService";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleReveiveChannelMessage = useCallback(
    (message: any) => {
      if (
        selectedChatType !== undefined &&
        selectedChatData?._id &&
        selectedChatData._id === message.channelId
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
    socket.on("recieve-channel-message", handleReveiveChannelMessage);

    return () => {
      socket.off("recieveMessage", handleReceiveMessage);
      socket.off("recieve-channel-message", handleReveiveChannelMessage);
    };
  }, [
    socket,
    selectedChatData,
    selectedChatType,
    dispatch,
    handleReceiveMessage,
    handleReveiveChannelMessage,
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
    } else if (selectedChatType === "channel") {
      socket?.emit("send-channel-message", {
        sender: user?._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
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

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files![0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await MessageService.uploadFile(formData);

        if (response.status === 200 && response.data) {
          if (selectedChatType === "connection") {
            socket?.emit("sendMessage", {
              sender: user?._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.url,
            });
          } else if (selectedChatType === "channel") {
            socket?.emit("send-channel-message", {
              sender: user?._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.url,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex items-center p-2 sm:px-4 md:px-8 sm: gap-1 sm:gap-2 h-full border-t">
      <div className="flex-1 flex rounded-md items-center gap-1 h-full">
        <Input
          type="text"
          className="bg-transparent rounded-md h-10 text-base md:text-lg
          focus:border-none focus:outline-none"
          placeholder="Enter a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          variant="ghost"
          size="sm"
          className="p-1 sm:p-2"
          onClick={handleFileClick}
        >
          <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
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
