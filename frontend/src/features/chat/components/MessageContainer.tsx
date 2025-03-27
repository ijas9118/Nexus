import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MessageService } from "@/services/user/messageService";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/organisms/scroll-area";

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
            <motion.div
              className="text-center text-muted-foreground my-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {moment(message.updatedAt).format("LL")}
            </motion.div>
          )}
          {selectedChatType === "connection" &&
            renderDMMessages(message, index)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: any, index: number) => {
    return (
      <motion.div
        className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}
        initial={{
          opacity: 0,
          x: message.sender === selectedChatData._id ? -50 : 50,
        }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
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
      </motion.div>
    );
  };

  return (
    <div className="flex-1 w-full h-full">
      <ScrollArea className="h-[calc(100vh-200px)] px-2 sm:px-4 md:px-8">
        {renderMessages()}
        <div ref={scrollRef} />
      </ScrollArea>
    </div>
  );
};

export default MessageContainer;
