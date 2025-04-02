// features/content/components/CommentInput.tsx
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { SendIcon } from "lucide-react";

interface CommentInputProps {
  onSubmit: (comment: string) => void;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onSubmit(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="flex gap-3 mb-6">
      <Avatar className="h-8 w-8">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 resize-none"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
          >
            <SendIcon className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
