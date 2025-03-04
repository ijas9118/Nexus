import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReceivedMessage = ({
  message,
  selectedChat,
}: {
  message: any;
  selectedChat: any;
}) => {
  return (
    <div className="flex justify-start">
      {/* <Avatar className="h-8 w-8 mt-2 mr-2">
        <AvatarImage src={selectedChat.avatar} />
        <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
      </Avatar> */}
      <div className="max-w-[70%] rounded-2xl rounded-tl-none px-4 py-2 bg-secondary">
        <p className="mb-1">{message.text}</p>
        <p className="text-xs text-muted-foreground">{message.sentTime}</p>
      </div>
    </div>
  );
};

export default ReceivedMessage;
