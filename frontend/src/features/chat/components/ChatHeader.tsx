import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { closeChat } from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { Video, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCall from "./VideoCall";

const ChatHeader = ({ toggleContacts }: { toggleContacts: () => void }) => {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector(
    (state: RootState) => state.chat,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [showVideoCall, setShowVideoCall] = useState(false);

  return (
    <div
      className="h-fit border-b-2 flex items-center 
      justify-between px-4 py-4 md:px-6 "
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
          {selectedChatType === "connection" && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Active 2 mins ago
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 sm:gap-5 items-center flex-shrink-0">
        {selectedChatType === "connection" && (
          <>
            <Button onClick={() => setShowVideoCall(true)} variant="ghost">
              <Video />
            </Button>
            {showVideoCall && (
              <VideoCall
                userId={user?._id as string}
                recipientId={selectedChatData._id}
                onClose={() => setShowVideoCall(false)}
              />
            )}
          </>
        )}
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
