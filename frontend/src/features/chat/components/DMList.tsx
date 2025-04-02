import { AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { Avatar } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { formatLastMessageTime } from "../utils/last-message-format";

const DMList = ({
  chats,
  isChannel = false,
}: {
  chats: any[];
  isChannel?: boolean;
}) => {
  const { selectedChatData } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleClick = (chat: any) => {
    if (isChannel) {
      dispatch(setSelectedChatType("channel"));
    } else {
      dispatch(setSelectedChatType("connection"));
    }
    dispatch(setSelectedChatData(chat));

    if (selectedChatData && selectedChatData._id !== chat._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };

  return (
    <div className="mt-5">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
            ${
              selectedChatData && selectedChatData._id === chat._id
                ? "bg-secondary hover:bg-secondary"
                : "hover:bg-secondary"
            }`}
          onClick={() => handleClick(chat)}
        >
          <div className="flex gap-5 items-center justify-start">
            {!isChannel && (
              <>
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={chat.profilePic} className="rounded-full" />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex justify-between items-center ">
                    <span className="font-semibold text-sm sm:text-base truncate">
                      {chat.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatLastMessageTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {chat.lastMessageContent}
                  </p>
                </div>
              </>
            )}
            {isChannel && (
              <>
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={chat.profilePic} className="rounded-full" />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex justify-between items-center ">
                    <span className="font-semibold text-sm sm:text-base truncate">
                      {chat.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatLastMessageTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {chat.lastMessageContent}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DMList;
