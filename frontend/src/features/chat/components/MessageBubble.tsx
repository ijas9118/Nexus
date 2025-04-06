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
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      >
        {message.isDeleted ? (
          <p className="italic">This message was deleted</p>
        ) : (
          <>
            {message.content && <p>{message.content}</p>}
            {message.fileUrl && (
              <div>
                {message.fileType === "image" && (
                  <img
                    src={message.fileUrl}
                    alt="Attachment"
                    className="max-w-full rounded"
                  />
                )}
                {message.fileType === "video" && (
                  <video
                    src={message.fileUrl}
                    controls
                    className="max-w-full rounded"
                  />
                )}
                {message.fileType === "pdf" && (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    className="text-blue-300 underline"
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}
            {message.replyTo && (
              <p className="text-xs italic">Replying to: {message.replyTo}</p>
            )}
            <div className="flex space-x-1 mt-1">
              {message.reactions.map((r) => (
                <span key={r.userId} className="text-sm">
                  {r.reaction}
                </span>
              ))}
            </div>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-1">
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowReactions(!showReactions)}>
              {showReactions ? "Hide Reactions" : "React"}
            </DropdownMenuItem>
            {isSender && !message.isDeleted && (
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            )}
            {message.reactions.some((r) => r.userId === user?._id) && (
              <DropdownMenuItem onClick={handleRemoveReaction}>
                Remove Reaction
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {showReactions && (
          <div className="flex space-x-2 mt-2">
            {["👍", "❤️", "😂", "😢", "😡"].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleReact(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
