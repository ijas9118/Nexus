import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";
import MessageContainer from "./MessageContainer";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
