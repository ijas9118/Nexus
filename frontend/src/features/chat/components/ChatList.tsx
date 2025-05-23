import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Input } from "@/components/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/dialog";
import MultipleSelector, {
  Option,
} from "@/components/organisms/multiple-select";
import { useSocket } from "@/hooks/useSocket";
import { ChatService } from "@/services/user/chatService";
import {
  setActiveChat,
  setChats,
  setGroups,
  setPendingChat,
} from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { Chat, Group, User } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatLastMessageTime } from "../utils/last-message-format";
import FollowService from "@/services/followService";

const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, groups, activeChat } = useSelector(
    (state: RootState) => state.chat,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?._id as string;
  const socket = useSocket();

  // Group creation states
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Option[]>([]);
  const [connectionOptions, setConnectionOptions] = useState<Option[]>([]);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const chatsData = await ChatService.fetchChats();
        const groupsData = await ChatService.fetchGroups();

        dispatch(setChats(chatsData));
        dispatch(setGroups(groupsData));
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    if (userId) loadInitialData();
  }, [userId, dispatch]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const options = await FollowService.getAllConnections();
        setConnectionOptions(options.data);
      } catch (error) {
        console.error("Failed to load connections:", error);
      }
    };

    if (open && userId) fetchConnections();
  }, [open, userId]);

  useEffect(() => {
    const search = async () => {
      if (searchTerm.trim()) {
        try {
          const results = await FollowService.searchConnectedUsers(searchTerm);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };
    search();
  }, [searchTerm]);

  useEffect(() => {
    if (socket) {
      socket.on("chatCreated", (chat: any) => {
        // Only add if not already in chats to prevent duplicates
        if (!chats.find((c) => c._id === chat._id)) {
          dispatch(setChats([...chats, chat]));
        }
        // Set as active chat if it matches the current user selection
        if (
          activeChat?.id ===
          chat.participants.find((p: any) => p._id !== userId)?._id
        ) {
          const otherParticipant = chat.participants.find(
            (p: any) => p._id !== userId,
          );
          dispatch(
            setActiveChat({
              id: chat._id,
              type: "Chat",
              userDetails: {
                userId: otherParticipant!._id,
                name: otherParticipant!.name,
                profilePic: otherParticipant!.profilePic,
              },
            }),
          );
        }
      });

      socket.on("groupCreated", (group: any) => {
        if (!groups.find((g) => g._id === group._id)) {
          dispatch(setGroups([...groups, group]));
        }
      });

      return () => {
        // socket.off("chatCreated");
        socket.off("groupCreated");
      };
    }
  }, [socket, chats, groups, activeChat, userId, dispatch]);

  const handleSelectChat = (
    chatOrGroup: Chat | Group,
    type: "Chat" | "Group",
  ) => {
    if (type === "Chat") {
      const chat = chatOrGroup as Chat;
      const otherParticipant = chat.participants.find((p) => p._id !== userId);
      dispatch(
        setActiveChat({
          id: chat._id,
          type: "Chat",
          userDetails: {
            userId: otherParticipant!._id,
            username: otherParticipant?.username,
            name: otherParticipant!.name,
            profilePic: otherParticipant!.profilePic,
          },
        }),
      );
    } else {
      const group = chatOrGroup as Group;
      dispatch(
        setActiveChat({
          id: group._id,
          type: "Group",
          userDetails: {
            name: group.name,
            // profilePic: group., // Add this if your Group type has a profilePic field
          },
        }),
      );
    }
    if (socket) {
      socket.emit("markMessagesAsRead", {
        chatId: chatOrGroup._id,
        chatType: type,
      });
    }
  };

  const handleSelectUser = (selectedUser: User) => {
    const existingChat = chats.find(
      (chat) =>
        chat.participants.length === 2 &&
        chat.participants.some((p) => p._id === userId) &&
        chat.participants.some((p) => p._id === selectedUser._id),
    );
    if (existingChat) {
      handleSelectChat(existingChat, "Chat");
    } else {
      // Set as active chat but don’t create until a message is sent
      dispatch(
        setPendingChat({
          userId: selectedUser._id,
          userDetails: {
            userId: selectedUser._id,
            name: selectedUser.name,
            username: selectedUser.username,
            profilePic: selectedUser.profilePic,
          },
        }),
      );
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleCreateGroup = () => {
    if (socket && groupName.trim() && user && selectedMembers.length > 0) {
      const memberIds = selectedMembers.map((m) => m.value);
      socket.emit("createGroup", { name: groupName, memberIds });
      setGroupName("");
      setSelectedMembers([]);
      setOpen(false);
    }
  };

  const getUnreadCount = (item: Chat | Group, userId: string): number => {
    const countObj = item.unreadCounts.find((c) => c.userId === userId);
    return countObj?.count || 0;
  };

  return (
    <div className="w-1/4 h-full p-4 overflow-y-auto border-r">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search connections..."
          className="w-full rounded-sm"
        />
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result._id}
                onClick={() => handleSelectUser(result)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
              >
                {result.profilePic && (
                  <img
                    src={result.profilePic}
                    alt={result.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{result.name}</p>
                  <p className="text-xs text-gray-500">{result.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chats List */}
      <h2 className="text-lg font-semibold mb-2">Chats</h2>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherParticipant = chat.participants.find(
            (p) => p._id !== userId,
          );
          return (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat, "Chat")}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center space-x-3 ${
                activeChat?.id === chat._id ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <div className="flex-1 flex items-center gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage
                    src={otherParticipant?.profilePic || ""}
                    className="rounded-full"
                  />
                  <AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {otherParticipant?.name}
                    </p>
                    {chat.lastMessage?.createdAt && (
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatLastMessageTime(chat.lastMessage.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage?.content
                        ? chat.lastMessage.content
                        : chat.lastMessage?.fileType
                          ? `📎 ${chat.lastMessage.fileType.toUpperCase()} File`
                          : ""}
                    </p>
                    {getUnreadCount(chat, userId) > 0 && (
                      <span className="bg-primary text-secondary rounded-full px-2 py-1 text-xs">
                        {getUnreadCount(chat, userId)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Groups List */}
      <div className="flex items-center justify-between mt-4 mb-2">
        <h2 className="text-lg font-semibold">Groups</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Plus className="h-5 w-5 cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full"
              />
              <MultipleSelector
                options={connectionOptions}
                value={selectedMembers}
                onChange={setSelectedMembers}
                placeholder="Select members..."
              />
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedMembers.length === 0}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                Create Group
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => {
          const lastMsg = group.lastMessage;
          return (
            <div
              key={group._id}
              onClick={() => handleSelectChat(group, "Group")}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center space-x-3 ${
                activeChat?.id === group._id ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <div className="flex-1 flex items-center gap-3">
                {/* Group Avatar */}
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={""} className="rounded-full object-cover" />
                  <AvatarFallback>
                    {group.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  {/* Top row: group name + time */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{group.name}</p>
                    {lastMsg?.createdAt && (
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatLastMessageTime(lastMsg.createdAt)}
                      </p>
                    )}
                  </div>

                  {/* Bottom row: last message + unread count */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {lastMsg?.content
                        ? lastMsg.content
                        : lastMsg?.fileType
                          ? `📎 ${lastMsg.fileType.toUpperCase()} File`
                          : ""}
                    </p>
                    {getUnreadCount(group, userId) > 0 && (
                      <span className="bg-primary text-secondary rounded-full px-2 py-1 text-xs">
                        {getUnreadCount(group, userId)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
