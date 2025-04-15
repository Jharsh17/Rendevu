import React, { useEffect, useRef, useState } from 'react';
import socket from '../sockets/voice';

const VoiceCall = ({ channelId }) => {
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const initCall = async () => {
      // Step 1: Get audio from mic
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current.srcObject = localStream;

      // Step 2: Connect to signaling server
      socket.emit('join-voice', channelId);

      // Step 3: Create peer connection
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });
      peerConnectionRef.current = peer;

      // Step 4: Add local audio tracks
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });

      // Step 5: Remote stream
      const remoteStream = new MediaStream();
      remoteStreamRef.current.srcObject = remoteStream;

      peer.ontrack = (event) => {
        event.streams[0].getAudioTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      // Step 6: Handle ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: channelId,
            candidate: event.candidate,
          });
        }
      };

      // Step 7: Listen to signaling events
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

      // Step 8: Create and send offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('offer', { to: channelId, offer });

      setIsCallActive(true);
    };

    initCall();

    return () => {
      // Cleanup
      peerConnectionRef.current?.close();
      socket.emit('leave-voice', channelId);
      setIsCallActive(false);
    };
  }, [channelId]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">Voice Call Active</h2>
      <div className="flex flex-col gap-2">
        <audio ref={localStreamRef} autoPlay muted />
        <audio ref={remoteStreamRef} autoPlay />
        <p className="text-sm text-gray-500">Connected to channel: {channelId}</p>
      </div>
    </div>
  );
};

export default VoiceCall;
