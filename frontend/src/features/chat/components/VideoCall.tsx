import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useSocket } from "@/context/SocketContext";
import "./style.css";

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
  const socket = useSocket();
  const [peerId, setPeerId] = useState<string>("");
  const [callActive, setCallActive] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callStatus, setCallStatus] = useState<string>("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const callInstance = useRef<MediaConnection | null>(null);

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
      if (localStream.current && window.confirm("Incoming call. Accept?")) {
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

    socket?.on("call-made", (data) => {
      console.log(`Call-made received from ${data.from}`);
      if (data.from !== userId && localStream.current) {
        const accept = window.confirm(`${data.from} is calling. Accept?`);
        console.log("asdfasdf", accept);
        if (accept) {
          const call = peerInstance.current!.call(
            data.from,
            localStream.current,
          );
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
        } else {
          socket.emit("reject-call", { to: data.from });
          setCallStatus("Call rejected");
        }
      }
    });

    socket?.on("call-rejected", (data) => {
      console.log(`Call rejected by ${data.from}`);
      setCallStatus(`Call rejected by ${data.from}`);
      setCallActive(false);
      if (callInstance.current) {
        callInstance.current.close();
        callInstance.current = null;
      }
    });

    socket?.on("call-ended", (data) => {
      console.log(`Call ended by ${data.from}`);
      endCall(`Call ended by ${data.from}`);
    });

    return () => endCall("Component unmounted");
  }, [socket, userId]);

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

      socket?.emit("call-user", {
        to: recipientId,
        signal: null,
      });
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
    socket?.emit("end-call", { to: recipientId });
    socket?.disconnect();
    setCallActive(false);
    setStreamReady(false);
    setCallStatus(reason);
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

  return (
    <div className="video-call-container">
      <h3>My Peer ID: {peerId}</h3>
      <p>Status: {callStatus}</p>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <div className="controls">
        {!callActive ? (
          <>
            <button onClick={startCall} disabled={!streamReady}>
              Call {recipientId}
            </button>
            <button onClick={() => endCall("Closed")}>Close</button>
          </>
        ) : (
          <>
            <button onClick={toggleMic}>{micOn ? "Mute" : "Unmute"}</button>
            <button onClick={toggleVideo}>
              {videoOn ? "Video Off" : "Video On"}
            </button>
            <button onClick={() => endCall("Call ended")}>End Call</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
