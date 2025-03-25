import { useSelector } from "react-redux";
import ChatContainer from "./components/ChatContainer";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChat from "./components/EmptyChat";
import { RootState } from "@/store/store";

const Chat = () => {
  const { selectedChatType } = useSelector((state: RootState) => state.chat);
  return (
    <div className="flex h-full overflow-hidden">
      <ContactsContainer />
      {selectedChatType !== undefined ? <ChatContainer /> : <EmptyChat />}
    </div>
  );
};

export default Chat;
