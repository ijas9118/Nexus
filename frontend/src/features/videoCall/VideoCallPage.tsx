import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState } from "@/store/store";

import { CallControls } from "./components/CallControls";
import { ReviewDialog } from "./components/ReviewDialog";
import { VideoPlayer } from "./components/VideoPlayer";
import { useVideoCall } from "./hooks/useVideoCall";

export default function VideoCallPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = user?.role;
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    isMuted,
    isVideoOn,
    isCallConnected,
    localVideoRef,
    remoteVideoRef,
    toggleMute,
    toggleVideo,
    exitCall,
  } = useVideoCall();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleReviewSubmit = (_rating: number, _feedback: string) => {
    // TODO: Send review data to the backend
    exitCall();
  };

  if (!isCallConnected) {
    if (userRole === "premium") {
      return (
        <ReviewDialog
          onSubmit={handleReviewSubmit}
          onExit={() => navigate("/myFeed")}
        />
      );
    } else navigate("/myFeed");
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      <VideoPlayer
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
      <CallControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        isFullScreen={isFullScreen}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        toggleFullScreen={toggleFullScreen}
        endCall={exitCall}
      />
    </div>
  );
}
