import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { Message } from "@/types";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const isSender = message.sender === user?._id;
  const [showReactions, setShowReactions] = useState(false);

  const handleReact = (reaction: string) => {
    if (socket) {
      socket.emit("reactToMessage", { messageId: message._id, reaction });
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

  return (
    <div
      className={`relative flex flex-col gap-1 mb-6 ${
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
            </>
          )}
        </div>

        {/* More Button - now floats just beside the bubble */}
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
                onClick={() => setShowReactions(!showReactions)}
              >
                {showReactions ? "Hide Reactions" : "React"}
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
            <span key={r.userId}>{r.reaction}</span>
          ))}
        </div>
      )}

      {/* Reaction Options */}
      {showReactions && (
        <div className="flex gap-2 mt-1">
          {["👍", "❤️", "😂", "😢", "😡"].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="text-xl"
              onClick={() => handleReact(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
