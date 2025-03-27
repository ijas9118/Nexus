import { useCallback, useEffect } from "react";
import NewDM from "./NewDM";
import { MessageService } from "@/services/user/messageService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setDirectMessageChats } from "@/store/slices/chatSlice";
import DMList from "./DMList";

const ContactsContainer = () => {
  const { directMessageChats } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const getUsersWithChat = useCallback(async () => {
    const response = await MessageService.getUsersWithChat();

    if (response) {
      dispatch(setDirectMessageChats(response));
    }
  }, [dispatch]);

  useEffect(() => {
    getUsersWithChat();
  }, []);

  return (
    <div className="md:w-[25vw] lg:w-[20vw] border-r w-full h-full">
      <div className="py-5">
        <div className="flex items-center justify-between pr-10">
          <div className="uppercase tracking-wide text-muted-foreground pl-10 font-normal text-xs">
            Direct Messages
          </div>
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto no-scrollbar">
          <DMList chats={directMessageChats} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <div className="uppercase tracking-wide text-muted-foreground pl-10 font-normal text-xs">
            Channels
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsContainer;
