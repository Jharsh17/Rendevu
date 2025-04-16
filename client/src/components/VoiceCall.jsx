import React, { useEffect, useRef, useState } from 'react';
import socket from '../sockets/voice';

const VoiceCall = ({ channelId, onLeaveCall }) => {
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const endCall = () => {
    // 1. Stop and release local media stream
    const localStream = localStreamRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // 2. Remove srcObject safely
    if (localStreamRef.current) {
      localStreamRef.current.srcObject = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null;
    }

    // 3. Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach(sender => {
        try {
          peerConnectionRef.current.removeTrack(sender);
        } catch (_) {}
      });

      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // 4. Emit leave signal
    socket.emit('leave-voice', channelId);

    // 5. Remove all listeners (prevent ghost events)
    socket.removeAllListeners('offer');
    socket.removeAllListeners('answer');
    socket.removeAllListeners('ice-candidate');

    // 6. Update state
    setIsCallActive(false);

    // 7. Optional callback
    if (onLeaveCall) onLeaveCall();
  };

  useEffect(() => {
    const initCall = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
        }

        socket.emit('join-voice', channelId);

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        peerConnectionRef.current = peer;

        localStream.getTracks().forEach((track) => {
          peer.addTrack(track, localStream);
        });

        const remoteStream = new MediaStream();
        if (remoteStreamRef.current) {
          remoteStreamRef.current.srcObject = remoteStream;
        }

        peer.ontrack = (event) => {
          event.streams[0].getAudioTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', {
              to: channelId,
              candidate: event.candidate,
            });
          }
        };

        socket.on('offer', async ({ from, offer }) => {
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('answer', { to: from, answer });
        });

        socket.on('answer', async ({ answer }) => {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit('offer', { to: channelId, offer });

        setIsCallActive(true);
      } catch (error) {
        console.error('Failed to start voice call:', error);
        endCall(); // fallback cleanup
      }
    };

    initCall();

    return () => {
      endCall();
    };
  }, [channelId]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <div className="flex flex-col gap-2">
        <audio ref={localStreamRef} autoPlay muted />
        <audio ref={remoteStreamRef} autoPlay />
      </div>
    </div>
  );
};

export default VoiceCall;
