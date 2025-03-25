import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { closeChat } from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const { selectedChatData } = useSelector((state: RootState) => state.chat);

  return (
    <div className="h-[10vh] border-b-2 flex items-center justify-between px-20 ">
      <div className="flex gap-3 items-center justify-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={selectedChatData.profilePic} />
          <AvatarFallback>{selectedChatData.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedChatData.name}</h2>
          <p className="text-sm text-muted-foreground">Active 2 mins ago</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <UserInfo selectedChat={selectedChatData} /> */}
          {/* <ChatSettings /> */}
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center">
        <Button variant="ghost" onClick={() => dispatch(closeChat())}>
          <X />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
