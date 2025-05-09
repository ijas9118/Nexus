import { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";

export const useVideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(true);
  const [peerId, setPeerId] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  const socket = useSocket();
  const { meetId } = useParams<{ meetId: string }>();

  useEffect(() => {
    if (!meetId || !socket) return;

    peerRef.current = new Peer();

    peerRef.current.on("open", (id) => {
      setPeerId(id);
      socket.emit("join-video-room", { roomId: meetId, peerId: id });
    });

    peerRef.current.on("error", console.error);

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peerRef.current?.on("call", (call) => {
          call.answer(stream);
          currentCallRef.current = call;

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current)
              remoteVideoRef.current.srcObject = remoteStream;
          });

          call.on("close", () => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          });

          call.on("error", console.error);
        });

        socket.on("user-joined", ({ peerId: remotePeerId }) => {
          if (peerRef.current && peerId !== remotePeerId) {
            const call = peerRef.current.call(remotePeerId, stream);
            currentCallRef.current = call;

            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current)
                remoteVideoRef.current.srcObject = remoteStream;
            });

            call.on("close", () => {
              if (remoteVideoRef.current)
                remoteVideoRef.current.srcObject = null;
            });

            call.on("error", console.error);
          }
        });

        socket.on("user-disconnected", () => {
          currentCallRef.current?.close();
          currentCallRef.current = null;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        });
      } catch (err) {
        console.error("Media access error", err);
      }
    };

    if (isCallConnected) initMedia();

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerRef.current?.destroy();
      socket.emit("leave-video-room", { roomId: meetId });
      socket.off("user-joined");
      socket.off("user-disconnected");
    };
  }, [isCallConnected]);

  const toggleMute = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !isVideoOn));
    setIsVideoOn(!isVideoOn);
  };

  //   const endCall = () => {
  //     setIsCallConnected(false);
  //     currentCallRef.current?.close();
  //     socket.emit("leave-video-room", { roomId: meetId });
  //   };

  const exitCall = () => {
    setIsCallConnected(false);
    currentCallRef.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.destroy();
    socket.emit("leave-video-room", { roomId: meetId });
  };

  return {
    isMuted,
    isVideoOn,
    isCallConnected,
    localVideoRef,
    remoteVideoRef,
    toggleMute,
    toggleVideo,
    exitCall,
    setIsCallConnected,
  };
};
