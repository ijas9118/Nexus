import UserInfo from "./UserInfo";
import ChatSettings from "./ChatSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

const ChatHeader = ({ selectedChat }: { selectedChat: any }) => {
  return (
    <div className="border-b flex items-center justify-between px-4 h-16">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={selectedChat.avatar} />
          <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedChat.name}</h2>
          <p className="text-sm text-muted-foreground">Active 2 mins ago</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UserInfo selectedChat={selectedChat} />
        <ChatSettings />
      </div>
    </div>
  );
};

export default ChatHeader;
