import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";

const Message = ({ messages, selectedChat }: { messages: any; selectedChat: any }) => {
  console.log(messages, selectedChat);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message: any, index: number) => (
        <div key={message._id || index}>
          {message.sender !== selectedChat.userId ? (
            <SentMessage message={message} />
          ) : (
            <ReceivedMessage message={message} selectedChat={selectedChat} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Message;
