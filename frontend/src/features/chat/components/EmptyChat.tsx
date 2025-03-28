import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChat = () => {
  return (
    <div className="flex-1 md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-muted-foreground flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
        <h3>Choose a chat</h3>
      </div>
    </div>
  );
};

export default EmptyChat;
