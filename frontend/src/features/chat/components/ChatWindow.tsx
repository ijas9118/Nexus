import { useSocket } from "@/hooks/useSocket";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ChatService } from "@/services/user/chatService";
import { setMessages } from "@/store/slices/chatSlice";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { activeChat, messages, pendingChat } = useSelector(
    (state: RootState) => state.chat,
  );
  const socket = useSocket();
  const hasFetched = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log(activeChat);
    if (activeChat && socket) {
      const fetchMessages = async () => {
        try {
          const chatMessages = await ChatService.fetchMessages(
            activeChat.id,
            activeChat.type,
          );
          console.log(chatMessages);
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
    if (socket) {
      socket.on("newMessage", (message: any) => {
        dispatch(
          setMessages({
            chatId: message.chatId,
            messages: [...(messages[message.chatId] || []), message],
          }),
        );
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, dispatch, messages]);

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
        <div className="flex-1 p-4 overflow-y-auto">
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
      <div className="flex-1 p-4 overflow-y-auto">
        {activeChat &&
          messages[activeChat.id]?.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))}
      </div>
      {activeChat && (
        <MessageInput chatId={activeChat.id} chatType={activeChat.type} />
      )}
    </div>
  );
};

export default ChatWindow;
