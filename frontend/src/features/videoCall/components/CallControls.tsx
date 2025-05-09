import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/atoms/button";

type Props = {
  isMuted: boolean;
  isVideoOn: boolean;
  isFullScreen: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleFullScreen: () => void;
  endCall: () => void;
};

export const CallControls = ({
  isMuted,
  isVideoOn,
  isFullScreen,
  toggleMute,
  toggleVideo,
  toggleFullScreen,
  endCall,
}: Props) => (
  <div className="bg-muted-foreground/30 p-4 flex justify-center items-center space-x-4">
    <Button
      variant="default"
      size="icon"
      className={`rounded-full ${isMuted ? "bg-primary" : "bg-muted-foreground"}`}
      onClick={toggleMute}
    >
      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
    <Button
      variant="default"
      size="icon"
      className={`rounded-full ${!isVideoOn ? "bg-primary" : "bg-muted-foreground"}`}
      onClick={toggleVideo}
    >
      {isVideoOn ? (
        <Video className="h-5 w-5" />
      ) : (
        <VideoOff className="h-5 w-5" />
      )}
    </Button>
    <Button
      variant="destructive"
      size="icon"
      className="rounded-full bg-pink-500 hover:bg-pink-600"
      onClick={endCall}
    >
      <PhoneOff className="h-5 w-5" />
    </Button>
    <Button
      variant="default"
      size="icon"
      className="rounded-full bg-muted-foreground"
      onClick={toggleFullScreen}
    >
      {isFullScreen ? (
        <Minimize className="h-5 w-5" />
      ) : (
        <Maximize className="h-5 w-5" />
      )}
    </Button>
  </div>
);
