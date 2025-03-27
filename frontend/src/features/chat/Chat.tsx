import { useSelector } from "react-redux";
import ChatContainer from "./components/ChatContainer";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChat from "./components/EmptyChat";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

const Chat = () => {
  const { selectedChatType } = useSelector((state: RootState) => state.chat);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    if (selectedChatType !== undefined) {
      setShowContacts(false);
    } else {
      setShowContacts(true);
    }
  }, [selectedChatType]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Contacts Container */}
      <div
        className={`${
          selectedChatType !== undefined && !showContacts ? "hidden" : "block"
        } md:block md:w-[25vw] lg:w-[20vw] w-full h-full`}
      >
        <ContactsContainer />
      </div>

      {/* Chat Container or Empty Chat */}
      {selectedChatType !== undefined ? (
        <div
          className={`${
            showContacts ? "hidden" : "block"
          } md:block flex-1 w-full h-full`}
        >
          <ChatContainer
            toggleContacts={() => setShowContacts(!showContacts)}
          />
        </div>
      ) : (
        <EmptyChat />
      )}
    </div>
  );
};

export default Chat;
