import { lazy, Suspense } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Skeleton } from "@/components/atoms/skeleton";
const ChatList = lazy(() => import("./components/ChatList"));
const ChatWindow = lazy(() => import("./components/ChatWindow"));

const Chat = () => {
  useSocket();
  return (
    <div className="flex h-full">
      <Suspense fallback={<Skeleton />}>
        <ChatList />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <ChatWindow />
      </Suspense>
    </div>
  );
};

export default Chat;
