import { Button } from "@/components/atoms/button";
import { X } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center"></div>
        <div className="flex gap-5 items-center justify-center">
          <Button>
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
