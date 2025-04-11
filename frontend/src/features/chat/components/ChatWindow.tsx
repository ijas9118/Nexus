import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ChatService } from "@/services/user/chatService";
import { setMessages } from "@/store/slices/chatSlice";
import ChatHeader from "./ChatHeader";
import { ScrollArea } from "@/components/organisms/scroll-area";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChat, messages, pendingChat } = useSelector(
    (state: RootState) => state.chat,
  );
  const socket = useSocket();
  const hasFetched = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (activeChat && socket) {
      const fetchMessages = async () => {
        try {
          const chatMessages = await ChatService.fetchMessages(
            activeChat.id,
            activeChat.type,
          );
          dispatch(
            setMessages({ chatId: activeChat.id, messages: chatMessages }),
          );
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      if (!hasFetched.current[activeChat.id]) {
        fetchMessages();
      }

      socket.emit("markMessagesAsRead", {
        chatId: activeChat.id,
        chatType: activeChat.type,
      });
    }
  }, [activeChat, dispatch, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      dispatch(
        setMessages({
          chatId: message.chatId,
          messages: [...(messages[message.chatId] || []), message],
        }),
      );

      const isUserViewingChat =
        activeChat &&
        activeChat.id === message.chatId &&
        activeChat.type === message.chatType;

      const isNotSender = message.sender !== user?._id;

      if (isUserViewingChat && isNotSender) {
        socket.emit("markMessagesAsRead", {
          chatId: message.chatId,
          chatType: message.chatType,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, messages, activeChat, user?._id]);

  if (!activeChat && !pendingChat) {
    return (
      <div className="w-3/4 h-full flex items-center justify-center ">
        <p className="text-muted-foreground">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  if (pendingChat) {
    return (
      <div className="w-3/4 h-full flex flex-col">
        <ChatHeader />
        <div className="h-full flex items-center justify-center ">
          <p className="text-muted-foreground">
            Start a conversation with this user!
          </p>
        </div>
        <MessageInput chatId={pendingChat.userId} chatType="Chat" />
      </div>
    );
  }

  return (
    <div className="w-3/4 h-full flex flex-col ">
      <ChatHeader />
      <div className="flex-1 w-full h-full">
        <ScrollArea className="h-[calc(100vh-200px)] px-2 sm:px-4 md:px-6">
          {activeChat &&
            messages[activeChat.id]?.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
        </ScrollArea>
      </div>
      {activeChat && (
        <MessageInput chatId={activeChat.id} chatType={activeChat.type} />
      )}
    </div>
  );
};

export default ChatWindow;
