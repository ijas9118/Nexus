import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({ messages, selectedChat }: { messages: any; selectedChat: any }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message: any) => (
        <div
          key={message.id}
          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
        >
          {!message.isSent && (
            <Avatar className="h-8 w-8 mt-2 mr-2">
              <AvatarImage src={selectedChat.avatar} />
              <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
              message.isSent ? "bg-primary text-background" : "bg-secondary "
            }`}
          >
            <p className="mb-1">{message.content}</p>
            <p
              className={`text-xs ${
                message.isSent ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {message.timestamp}
            </p>
          </div>

          {message.isSent && (
            <Avatar className="h-8 w-8 mt-2 ml-2">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
};

export default Message;
