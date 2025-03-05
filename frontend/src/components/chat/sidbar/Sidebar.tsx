import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatService } from "@/services/user/chatService";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllConnections } from "@/services/user/followService";
import SearchDropdown from "./SearchDropdown";

interface SidebarProps {
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
}

const Sidebar = ({ selectedChat, setSelectedChat }: SidebarProps) => {
  const [chats, setChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchChats = async () => {
      const response = await ChatService.getChats();
      setChats(response);
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const searchConnections = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        const response = await getAllConnections(debouncedSearchTerm);
        setSearchResults(response);
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    };
    searchConnections();
  }, [debouncedSearchTerm]);

  const handleConnectionSelect = async (connection: any) => {
    try {
      const chat = await ChatService.createNewChat(connection._id);
      const response = await ChatService.getChats();
      setChats(response);

      const newChat = response.find((c: any) => c._id === chat._id);
      setSelectedChat(newChat);

      setSearchResults([]);
      setSearchTerm("");
      setIsSearching(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  return (
    <div className="w-80 border-r flex flex-col relative">
      <div className="px-4 h-16 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chats ({chats.length})</h1>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Search Results Dropdown */}
      {isSearching && searchResults.length > 0 && (
        <SearchDropdown
          searchResults={searchResults}
          onSelect={handleConnectionSelect}
        />
      )}

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
