import ChatContainer from "./components/ChatContainer";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChat from "./components/EmptyChat";

const Chat = () => {
  return (
    <div className="flex h-full overflow-hidden text-white">
      <ContactsContainer />
      {/* <EmptyChat /> */}
      <ChatContainer />
    </div>
  );
};

export default Chat;
