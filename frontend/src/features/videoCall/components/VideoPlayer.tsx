import React from "react";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
};

export const VideoPlayer = ({ localVideoRef, remoteVideoRef }: Props) => (
  <div className="flex-1 bg-muted relative overflow-hidden">
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="object-cover h-full scale-x-[-1]"
    />
    <div className="absolute top-4 right-4 w-1/4 max-w-[240px] aspect-video rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
    </div>
  </div>
);
