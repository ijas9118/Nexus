import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatService } from "@/services/user/chatService";
import { getAllConnections } from "@/services/user/followService";
import {
  ImageIcon,
  Info,
  Link,
  Phone,
  Plus,
  PlusCircle,
  Smile,
  ThumbsUp,
  Video,
} from "lucide-react";
import { FC, useEffect, useState } from "react";

const messages = [
  {
    id: "1",
    content: "How has your day been so far?",
    timestamp: "10:06 AM",
    sender: "Jane Doe",
    isSent: false,
  },
  {
    id: "2",
    content:
      "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
    timestamp: "10:10 AM",
    sender: "You",
    isSent: true,
  },
  {
    id: "3",
    content: "Awesome! I am just chilling outside.",
    timestamp: "3:34 PM",
    sender: "Jane Doe",
    isSent: false,
  },
];

const Messages: FC = () => {
  const [connectionsWithChats, setConnectionsWithChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [showSearch, setShowSearch] = useState(false); // State to toggle search field
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [allConnections, setAllConnections] = useState<any[]>([]); // State to store all connections
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const getAllChats = async () => {
      try {
        const connections = await getAllConnections();
        const chats = await ChatService.getChat();

        // Assuming chats contain members array with user IDs
        const chatMembers = chats.flatMap((chat: any) => chat.members);

        // Filter connections that are in any chat
        const connectionsWithChats = connections.filter((connection: any) =>
          chatMembers.includes(connection._id)
        );

        setConnectionsWithChats(connectionsWithChats);
        setAllConnections(connections); // Store all connections for search
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    getAllChats();
  }, []);

  // Filter connections based on search query
  const filteredConnections = allConnections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold">Chats ({connectionsWithChats.length})</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Field */}
        {showSearch && (
          <div className="p-4 border-b">
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-neutral-100 dark:bg-neutral-800 border-0"
            />
          </div>
        )}

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto">
          {(showSearch ? filteredConnections : connectionsWithChats).map(
            (connection: any) => (
              <div
                key={connection._id}
                onClick={() => setSelectedChat(connection)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                  selectedChat?._id === connection._id
                    ? "bg-neutral-50 dark:bg-neutral-900"
                    : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.profilePic} />
                    <AvatarFallback>{connection.name[0]}</AvatarFallback>
                  </Avatar>
                  {connection.isActive && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{connection.name}</h3>
                  <p className="text-sm text-gray-500">{connection.status}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">Active 2 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  {!message.isSent && (
                    <Avatar className="h-8 w-8 mt-2 mr-2">
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.isSent
                        ? "bg-black text-white dark:bg-neutral-800"
                        : "bg-gray-100 dark:bg-neutral-700"
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <p
                      className={`text-xs ${
                        message.isSent
                          ? "text-gray-300 dark:text-gray-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>

                  {message.isSent && (
                    <Avatar className="h-8 w-8 mt-2 ml-2">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Link className="h-5 w-5" />
                </Button>
                <Input
                  className="flex-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border-0"
                  placeholder="Type a message..."
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
