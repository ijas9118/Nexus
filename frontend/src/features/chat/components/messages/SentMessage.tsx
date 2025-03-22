const SentMessage = ({ message }: { message: any }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-2xl rounded-tr-none px-4 py-2 bg-primary text-background">
        <p className="mb-1">{message.text}</p>
        <p className="text-xs text-primary-foreground">{message.sentTime}</p>
      </div>
    </div>
  );
};

export default SentMessage;
