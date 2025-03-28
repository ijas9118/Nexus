import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setSelectedChatMessages } from "@/store/slices/chatSlice";
import { MessageService } from "@/services/user/messageService";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { FaFolder } from "react-icons/fa";
import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
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

  const downloadFile = (url: string) => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;

    // Extract the filename from the URL
    const filename = url.split("/").pop() || "downloaded_file";
    link.setAttribute("download", filename); // Set the download attribute with the filename

    // Append to the document, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <DialogContent className="w-[95vw] max-w-[95vw] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogClose className="absolute right-4 top-4" />
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4">
                <img
                  src={imageUrl}
                  alt="Enlarged chat image"
                  className="max-h-[70vh] w-auto object-contain"
                />
                <Button
                  variant="outline"
                  onClick={() => downloadFile(imageUrl)}
                >
                  <Download className="mr-2" />
                  Download Image
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
