const setupVoiceSockets = (io) => {
    io.on('connection', (socket) => {
      console.log('Voice socket connected:', socket.id);
  
      socket.on('join-voice', (channelId) => {
        socket.join(channelId);
        socket.to(channelId).emit('user-joined-voice', socket.id);
      });
  
      socket.on('offer', async ({ from, offer }) => {
        console.log('Received offer from', from);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit('answer', { to: from, answer });
      });
      
      socket.on('answer', async ({ answer }) => {
        console.log('Received answer');
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      });
  
      socket.on('ice-candidate', ({ candidate, to }) => {
        socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
      });
  
      socket.on('leave-voice', (channelId) => {
        socket.leave(channelId);
        socket.to(channelId).emit('user-left-voice', socket.id);
      });
  
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  };
  
  module.exports = setupVoiceSockets;
  