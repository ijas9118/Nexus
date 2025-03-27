import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { closeChat } from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ChatHeader = ({ toggleContacts }: { toggleContacts: () => void }) => {
  const dispatch = useDispatch();
  const { selectedChatData } = useSelector((state: RootState) => state.chat);

  return (
    <div
      className="h-fit border-b-2 flex items-center 
      justify-between px-4 py-4 sm:px-6 md:px-10 lg:px-20"
    >
      <div className="flex gap-2 sm:gap-3 items-center w-full overflow-hidden">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
          <AvatarImage src={selectedChatData.profilePic} />
          <AvatarFallback>{selectedChatData.name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-sm sm:text-base truncate">
            {selectedChatData.name}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Active 2 mins ago
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-5 items-center flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            dispatch(closeChat());
            toggleContacts();
          }}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
