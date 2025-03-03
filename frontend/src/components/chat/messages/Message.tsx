import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";

const Message = ({ messages, selectedChat }: { messages: any; selectedChat: any }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message: any, index: number) => (
        <div key={message._id || index}>
          {message.sender?._id === selectedChat.userId ? (
            <ReceivedMessage message={message} selectedChat={selectedChat} />
          ) : (
            <SentMessage message={message} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Message;
