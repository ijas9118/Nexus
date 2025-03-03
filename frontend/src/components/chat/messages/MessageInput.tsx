import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Link, Send, Smile } from "lucide-react";

const MessageInput = () => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Link className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          className="flex-1 rounded-lg border-[0.5px] shadow-md"
          placeholder="Type a message..."
        />
        <Button variant="ghost" size="icon">
          <Send className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
