import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatItem = ({ chat, selectedChat, setSelectedChat }: any) => {
  return (
    <div
      key={chat._id}
      onClick={() => setSelectedChat(chat)}
      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
        selectedChat?._id === chat._id ? "bg-neutral-50 dark:bg-neutral-900" : ""
      }`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        {chat.isActive && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-400 border-2" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{chat.name}</h3>
          <p className="text-xs text-muted-foreground">{chat.lastMessageTime}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">{chat.lastMessage}</p>
          <div className=" h-5 w-5 rounded-full bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center text-xs text-secondary font-semibold">
            {chat.unreadMessages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
