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
  getAllConnections,
  searchConnectedUsers,
} from "@/services/user/followService";
import { setActiveChat, setChats, setGroups } from "@/store/slices/chatSlice";
import { RootState } from "@/store/store";
import { User } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, groups, activeChat, unreadCounts } = useSelector(
    (state: RootState) => state.chat,
  );
  const { user } = useSelector((state: RootState) => state.auth);
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
    if (user?._id) loadInitialData();
  }, [user?._id, dispatch]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const options = await getAllConnections();
        setConnectionOptions(options.data);
      } catch (error) {
        console.error("Failed to load connections:", error);
      }
    };

    if (open && user?._id) fetchConnections();
  }, [open, user?._id]);

  useEffect(() => {
    const search = async () => {
      if (searchTerm.trim()) {
        try {
          const results = await searchConnectedUsers(searchTerm);
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
          chat.participants.find((id: string) => id !== user?._id)
        ) {
          dispatch(setActiveChat({ id: chat._id, type: "Chat" }));
        }
      });

      socket.on("groupCreated", (group: any) => {
        if (!groups.find((g) => g._id === group._id)) {
          dispatch(setGroups([...groups, group]));
        }
      });

      return () => {
        socket.off("chatCreated");
        socket.off("groupCreated");
      };
    }
  }, [socket, chats, groups, activeChat, user?._id, dispatch]);

  const handleSelectChat = (id: string, type: "Chat" | "Group") => {
    dispatch(setActiveChat({ id, type }));
    if (socket) {
      socket.emit("markMessagesAsRead", { chatId: id, chatType: type });
    }
  };

  const handleSelectUser = (selectedUser: User) => {
    const existingChat = chats.find(
      (chat) =>
        chat.participants.length === 2 &&
        chat.participants.includes(user?._id || "") &&
        chat.participants.includes(selectedUser._id),
    );
    if (existingChat) {
      handleSelectChat(existingChat._id, "Chat");
    } else {
      // Set as active chat but don’t create until a message is sent
      dispatch(setActiveChat({ id: selectedUser._id, type: "Chat" }));
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

  return (
    <div className="w-1/4 h-full bg-muted p-4 overflow-y-auto">
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
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleSelectChat(chat._id, "Chat")}
            className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center space-x-3 ${
              activeChat?.id === chat._id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {/* Placeholder avatar */}
              <span className="text-white font-medium">
                {chat.participants
                  .filter((id) => id !== user?._id)[0]
                  ?.charAt(0)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {chat.participants.filter((id) => id !== user?._id).join(", ")}
              </p>
            </div>
            {unreadCounts[chat._id] > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {unreadCounts[chat._id]}
              </span>
            )}
          </div>
        ))}
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
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => handleSelectChat(group._id, "Group")}
            className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center space-x-3 ${
              activeChat?.id === group._id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {group.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{group.name}</p>
            </div>
            {unreadCounts[group._id] > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {unreadCounts[group._id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
