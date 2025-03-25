import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

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

  const handleSendMessage = async () => {};

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
