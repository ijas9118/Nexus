import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatService } from "@/services/user/chatService";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";

interface SidebarProps {
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
}

const Sidebar = ({ selectedChat, setSelectedChat }: SidebarProps) => {
  const [chats, setChats] = useState([
    {
      _id: "1",
      name: "Jane Doe",
      status: "typing...",
      lastMessage: "Hello world",
      lastMessageTime: "09:12 AM",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      unreadMessages: 4,
      username: "janedoe123",
      isActive: true,
    },
    {
      _id: "2",
      name: "John Doe",
      status: "last seen 5m ago",
      lastMessage: "Hello, how are you?",
      lastMessageTime: "11:53 AM",
      unreadMessages: 6,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      _id: "3",
      name: "Elizabeth Smith",
      status: "online",
      lastMessage: "This is cool",
      lastMessageTime: "02:23 PM",
      unreadMessages: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth",
    },
    {
      _id: "4",
      name: "John Smith",
      status: "last seen 1h ago",
      lastMessage: "I love js",
      lastMessageTime: "07:54 PM",
      unreadMessages: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Smith",
    },
  ]);
  useEffect(() => {
    const fetchChats = async () => {
      const response = await ChatService.getChat();
      setChats(response);
      console.log(response);
    };

    fetchChats();
  }, []);

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="px-4 h-16 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chats (3)</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="relative p-1 border-b cursor-pointer">
        <Search className="absolute left-4 top-3.5 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search connections..."
          className="pl-10 w-full border-0 focus-visible:ring-0 shadow-none cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat: any) => (
          <ChatItem
            key={chat._id}
            chat={chat}
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
