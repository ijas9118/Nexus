import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";
import MessageContainer from "./MessageContainer";

const ChatContainer = ({ toggleContacts }: { toggleContacts: () => void }) => {
  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <ChatHeader toggleContacts={toggleContacts} />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
