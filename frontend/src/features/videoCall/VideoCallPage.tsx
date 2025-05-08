import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/atoms/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize,
  Minimize,
} from "lucide-react";
import Peer, { MediaConnection } from "peerjs";
import { useParams, useNavigate } from "react-router-dom";

export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(true);
  const [peerId, setPeerId] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const socket = useSocket();
  const { meetId } = useParams<{ meetId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("VideoCallPage useEffect triggered", {
      meetId,
      isCallConnected,
      socket: !!socket,
    });

    if (!meetId || !socket) {
      console.error("Missing meetId or socket", { meetId, socket });
      return;
    }

    // Initialize PeerJS
    peerRef.current = new Peer();
    console.log("PeerJS initialized");

    peerRef.current.on("open", (id) => {
      console.log("PeerJS open, peerId:", id);
      setPeerId(id);
      socket.emit("join-video-room", { roomId: meetId, peerId: id });
      console.log("Emitted join-video-room", { roomId: meetId, peerId: id });
    });

    peerRef.current.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    // Get local stream
    const getLocalStream = async () => {
      try {
        console.log("Requesting local media stream");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;

        if (localVideoRef.current && !localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = stream;
          console.log("Local stream set to localVideoRef");
        }

        // Handle incoming calls
        peerRef.current?.on("call", (call) => {
          console.log("Received incoming call", call.peer);
          call.answer(stream);
          currentCallRef.current = call;

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
              remoteVideoRef.current.srcObject = remoteStream;
              console.log("Remote stream set to remoteVideoRef");
            } else {
              console.log(
                "Remote stream skipped - already set or ref unavailable",
              );
            }
          });

          call.on("close", () => {
            console.log("Call closed");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
              console.log("Cleared remoteVideoRef srcObject");
            }
          });

          call.on("error", (err) => {
            console.error("Call error:", err);
          });
        });

        // Handle user joined event
        socket.on("user-joined", ({ peerId: remotePeerId }) => {
          console.log("User joined event received", { remotePeerId });
          if (peerRef.current && peerId !== remotePeerId) {
            console.log("Initiating call to", remotePeerId);
            const call = peerRef.current.call(remotePeerId, stream);
            currentCallRef.current = call;

            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
                remoteVideoRef.current.srcObject = remoteStream;
                console.log(
                  "Remote stream set to remoteVideoRef from initiated call",
                );
              } else {
                console.log(
                  "Remote stream skipped - already set or ref unavailable",
                );
              }
            });

            call.on("close", () => {
              console.log("Initiated call closed");
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
                console.log("Cleared remoteVideoRef srcObject");
              }
            });

            call.on("error", (err) => {
              console.error("Initiated call error:", err);
            });
          }
        });

        // Handle user disconnected
        socket.on("user-disconnected", () => {
          console.log("User disconnected event received");
          if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
            console.log("Closed current call");
          }
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
            console.log("Cleared remoteVideoRef srcObject on disconnect");
          }
        });

        // Handle room users
        socket.on("room-users", ({ users }) => {
          console.log("Received room-users", users);
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    if (isCallConnected) {
      console.log("Starting getLocalStream");
      getLocalStream();
    }

    return () => {
      console.log("Cleaning up VideoCallPage");
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        localStreamRef.current = null;
      }
      // Clean up PeerJS
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
        console.log("Destroyed PeerJS instance");
      }
      // Clean up socket listeners
      socket.off("user-joined");
      socket.off("user-disconnected");
      socket.off("room-users");
      console.log("Removed socket listeners");
      // Leave room
      socket.emit("leave-video-room", { roomId: meetId });
      console.log("Emitted leave-video-room", { roomId: meetId });
    };
  }, [isCallConnected, socket, meetId]);

  const toggleMute = () => {
    console.log("Toggling mute", { isMuted });
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
        console.log("Set audio track enabled:", isMuted);
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    console.log("Toggling video", { isVideoOn });
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
        console.log("Set video track enabled:", !isVideoOn);
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleFullScreen = () => {
    console.log("Toggling fullscreen", { isFullScreen });
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const endCall = () => {
    console.log("Ending call");
    setIsCallConnected(false);
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
      console.log("Closed current call");
    }
    if (socket && meetId) {
      socket.emit("leave-video-room", { roomId: meetId });
      console.log("Emitted leave-video-room", { roomId: meetId });
    }
  };

  const exitCall = () => {
    console.log("Exiting call");
    setIsCallConnected(false);
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
      console.log("Closed current call");
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      localStreamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      console.log("Destroyed PeerJS instance");
    }
    if (socket && meetId) {
      socket.emit("leave-video-room", { roomId: meetId });
      console.log("Emitted leave-video-room", { roomId: meetId });
    }
    navigate("/");
    console.log("Navigated to home page");
  };

  if (!isCallConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">Call Ended</h1>
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              console.log("Rejoining call");
              setIsCallConnected(true);
            }}
          >
            Rejoin Call
          </Button>
          <Button variant="destructive" onClick={exitCall}>
            Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      {/* Main video (remote user) */}
      <div className="flex-1 bg-muted relative overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="object-cover h-full"
        />
        {/* Self view (local user) */}
        <div className="absolute top-4 right-4 w-1/4 max-w-[240px] aspect-video rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Controls */}
      <div className="bg-muted-foreground/30 p-4 flex justify-center items-center space-x-4">
        <Button
          variant="default"
          size="icon"
          className={`rounded-full ${isMuted ? "bg-primary" : "bg-muted-foreground"}`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
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
    </div>
  );
}
