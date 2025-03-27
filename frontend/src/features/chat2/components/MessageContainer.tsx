import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MessageService } from "@/services/user/messageService";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { selectedChatData, selectedChatType, selectedChatMessages } =
    useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await MessageService.getMessages(selectedChatData._id);
        if (response) {
          console.log(response);
          dispatch(setSelectedChatMessages(response));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "connection") {
        getMessages();
      }
    }
  }, [dispatch, selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: string | null = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.updatedAt).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-muted-foreground my-2">
              {moment(message.updatedAt).format("LL")}
            </div>
          )}
          {selectedChatType === "connection" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: any) => {
    console.log(message);
    return (
      <div
        className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
          >
            {message.content}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          {moment(message.updatedAt).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:px-8 w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
