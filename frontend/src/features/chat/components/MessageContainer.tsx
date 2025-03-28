import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MessageService } from "@/services/user/messageService";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { FaFolder } from "react-icons/fa";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { selectedChatData, selectedChatType, selectedChatMessages } =
    useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  const checkIfImage = (filePath: string) => {
    const imageRegex = /\.(jpeg|jpg|png|webp)$/i;
    return imageRegex.test(filePath);
  };

  const checkIfVideo = (filePath: string) => {
    const videoRegex = /\.(mp4|mov|avi)$/i;
    return videoRegex.test(filePath);
  };

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = url.split("/").pop()?.split("?")[0] || "downloaded_file";
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
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
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} />
              </div>
            ) : checkIfVideo(message.fileUrl) ? (
              <div className="cursor-pointer">
                <video
                  height={300}
                  width={300}
                  src={message.fileUrl}
                  controls
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <FaFolder />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className=""
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <Download />
                </span>
              </div>
            )}
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
        {showImage && (
          <Dialog open={showImage} onOpenChange={setShowImage}>
            <DialogContent className="w-[99vw] max-w-[99vw] max-h-[99vh] h-[99vh] text-secondary dark:text-primary bg-black/50 border-none">
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={imageUrl}
                  alt="Enlarged chat image"
                  className="max-h-[70vh] w-auto object-contain"
                />

                <Button
                  className="absolute top-2 right-12 text-2xl cursor-pointer bg-transparent border-none hover:scale-110 transition-all duration-300"
                  onClick={() => downloadFile(imageUrl)}
                >
                  <Download size={32} />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageContainer;
