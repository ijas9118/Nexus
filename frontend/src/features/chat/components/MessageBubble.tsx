import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { Message } from "@/types";
import dayjs from "dayjs";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const isSender = message.sender === user?._id;
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleReact = (reaction: string) => {
    if (socket) {
      socket.emit("reactToMessage", { messageId: message._id, reaction });
      setEmojiPickerOpen(false);
    }
  };

  const handleRemoveReaction = () => {
    if (socket) {
      socket.emit("removeReaction", message._id);
    }
  };

  const handleDelete = () => {
    if (socket && isSender) {
      socket.emit("deleteMessage", message._id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    };

    if (emojiPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerOpen]);

  return (
    <div
      className={`relative flex flex-col gap-1 my-4 ${
        isSender ? "items-end" : "items-start"
      }`}
    >
      <div className="relative flex items-center group">
        {/* Message Bubble */}
        <div
          className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${
            isSender
              ? "bg-primary text-background  rounded-br-none"
              : "bg-secondary rounded-bl-none"
          }`}
        >
          {message.isDeleted ? (
            <p className="italic text-sm">This message was deleted</p>
          ) : (
            <>
              {message.replyTo && (
                <p className="text-xs italic mb-1">
                  Replying to: {message.replyTo}
                </p>
              )}
              {message.content && (
                <p className="whitespace-pre-line">{message.content}</p>
              )}
              {message.fileUrl && (
                <div className="mt-2">
                  {/* Handle image/video/pdf display here */}
                </div>
              )}
              <p
                className={`text-xs mt-1 ${
                  isSender
                    ? "text-background/70 text-end"
                    : "text-muted-foreground"
                }`}
              >
                {dayjs(message.createdAt).format("h:mm A")}
              </p>
            </>
          )}
        </div>

        <div
          className={`absolute top-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-all duration-300 ${
            isSender ? "-left-6" : "-right-6"
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
              >
                {emojiPickerOpen ? "Close Reactions" : "React"}
              </DropdownMenuItem>
              {isSender && !message.isDeleted && (
                <DropdownMenuItem onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
              )}
              {message.reactions.some((r) => r.userId === user?._id) && (
                <DropdownMenuItem onClick={handleRemoveReaction}>
                  Remove Reaction
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Reactions */}
      {message.reactions.length > 0 && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm border shadow-sm ${
            isSender ? "bg-primary" : "bg-secondary"
          } -mt-3 z-10`}
        >
          {message.reactions.map((r) => (
            <span
              key={r.userId}
              onClick={handleRemoveReaction}
              className="cursor-pointer"
            >
              {r.reaction}
            </span>
          ))}
        </div>
      )}

      {emojiPickerOpen && (
        <div
          className={`absolute  ${isSender ? "right-0 " : "left-0"} mt-2 z-20 scale-75`}
          ref={emojiRef}
        >
          <EmojiPicker
            open={emojiPickerOpen}
            onEmojiClick={(emoji) => handleReact(emoji.emoji)}
            autoFocusSearch={false}
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
