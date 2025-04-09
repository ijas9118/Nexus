import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { Dialog, DialogContent } from "@/components/organisms/dialog";
import { Button } from "@/components/atoms/button";
import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PhoneOff,
  VideoIcon,
  VideoOff,
} from "lucide-react";

interface VideoCallProps {
  userId: string;
  recipientId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  userId,
  recipientId,
  onClose,
}) => {
  const [peerId, setPeerId] = useState<string>("");
  const [callActive, setCallActive] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callStatus, setCallStatus] = useState<string>("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const callInstance = useRef<MediaConnection | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setStreamReady(true);
      setCallStatus("Ready to call");
    } catch (err) {
      console.error("Media error:", err);
      setCallStatus("Failed to access camera/microphone");
      setStreamReady(false);
    }
  };

  useEffect(() => {
    setupMedia();
    // Initialize PeerJS
    const peer = new Peer(userId); // Using userId as peer ID
    peerInstance.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      setCallStatus(`Peer error: ${err.message}`);
    });

    peer.on("call", (call) => {
      console.log("Received incoming call");
      callInstance.current = call; // Store the call
      if (localStream.current) {
        call.answer(localStream.current);
        call.on("stream", (remoteStream) => {
          console.log("Received remote stream from call");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setCallActive(true);
          setCallStatus("In call");
        });
        call.on("error", (err) => {
          console.error("Call error:", err);
          setCallStatus(`Call error: ${err.message}`);
        });
        call.on("close", () => endCall("Call ended by remote user"));
      }
    });

    // socket?.on("call-made", (data) => {
    //   console.log(`Call-made received from ${data.from}`);
    //   if (data.from !== userId && localStream.current) {
    //     // const accept = window.confirm(`${data.from} is calling. Accept?`);
    //     // console.log("asdfasdf", accept);
    //     // if (accept) {
    //     const call = peerInstance.current!.call(data.from, localStream.current);
    //     callInstance.current = call;
    //     call.on("stream", (remoteStream) => {
    //       if (remoteVideoRef.current) {
    //         remoteVideoRef.current.srcObject = remoteStream;
    //       }
    //       setCallActive(true);
    //       setCallStatus("In call");
    //     });
    //     call.on("error", (err) => {
    //       console.error("Call error:", err);
    //       setCallStatus(`Call error: ${err.message}`);
    //     });
    //     call.on("close", () => endCall("Call ended by remote user"));
    //     // } else {
    //     //   socket.emit("reject-call", { to: data.from });
    //     //   setCallStatus("Call rejected");
    //     // }
    //   }
    // });

    // socket?.on("call-rejected", (data) => {
    //   console.log(`Call rejected by ${data.from}`);
    //   setCallStatus(`Call rejected by ${data.from}`);
    //   setCallActive(false);
    //   if (callInstance.current) {
    //     callInstance.current.close();
    //     callInstance.current = null;
    //   }
    // });

    // socket?.on("call-ended", (data) => {
    //   console.log(`Call ended by ${data.from}`);
    //   endCall(`Call ended by ${data.from}`);
    // });

    return () => endCall("Component unmounted");
  }, [userId]);

  const startCall = () => {
    if (localStream.current && peerInstance.current) {
      setCallStatus("Calling...");
      const call = peerInstance.current.call(recipientId, localStream.current);
      callInstance.current = call;
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setCallActive(true);
        setCallStatus("In call");
      });
      call.on("error", (err) => {
        console.error("Call error:", err);
        setCallStatus(`Call error: ${err.message}`);
      });
      call.on("close", () => endCall("Call ended by remote user"));

      // socket?.emit("call-user", {
      //   to: recipientId,
      //   signal: null,
      // });
      console.log("Call-user event emitted");
    } else {
      setCallStatus("Cannot start call: stream or peer not ready");
    }
  };

  const endCall = (reason: string = "Call ended") => {
    if (callInstance.current) {
      callInstance.current.close();
      callInstance.current = null;
    }
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    // socket?.emit("end-call", { to: recipientId });
    // socket?.disconnect();
    setCallActive(false);
    setStreamReady(false);
    setCallStatus(reason);
    setIsFullScreen(false);
    onClose();
  };

  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      videoTrack.enabled = !videoOn;
      setVideoOn(!videoOn);
    }
  };

  const toggleFullScreen = () => {
    if (!modalRef.current) return;

    if (!isFullScreen) {
      modalRef.current.requestFullscreen().catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  return (
    <Dialog open={true} onOpenChange={() => endCall("Closed")}>
      <DialogContent
        ref={modalRef}
        className={`bg-gray-900 text-white p-6 rounded-lg shadow-xl w-full max-w-4xl transition-all duration-300 ${
          isFullScreen ? "h-full max-h-full" : "max-h-[90vh]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Video Call - Peer ID: {peerId}
          </h3>
        </div>

        <p className="text-sm text-gray-400 mb-4">Status: {callStatus}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-black rounded-md object-cover"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-black rounded-md object-cover"
          />
        </div>

        <div className="flex justify-center gap-4">
          {!callActive ? (
            <>
              <Button onClick={startCall} disabled={!streamReady}>
                Call {recipientId}
              </Button>
              <Button variant="secondary" onClick={() => endCall("Closed")}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={micOn ? "default" : "destructive"}
                onClick={toggleMic}
                className="flex items-center gap-2"
              >
                {micOn ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
                {micOn ? "Mute" : "Unmute"}
              </Button>
              <Button
                variant={videoOn ? "default" : "destructive"}
                onClick={toggleVideo}
                className="flex items-center gap-2"
              >
                {videoOn ? (
                  <VideoIcon className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
                {videoOn ? "Video Off" : "Video On"}
              </Button>
              <Button
                variant="outline"
                onClick={toggleFullScreen}
                className="flex items-center gap-2 text-white border-gray-600 hover:bg-gray-800"
              >
                {isFullScreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
                {isFullScreen ? "Exit Full Screen" : "Full Screen"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => endCall("Call ended")}
                className="flex items-center gap-2"
              >
                <PhoneOff className="h-4 w-4" />
                End Call
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
