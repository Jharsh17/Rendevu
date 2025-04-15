const setupVoiceSockets = (io) => {
    io.on('connection', (socket) => {
      console.log('Voice socket connected:', socket.id);
  
      socket.on('join-voice', (channelId) => {
        socket.join(channelId);
        socket.to(channelId).emit('user-joined-voice', socket.id);
      });
  
      socket.on('offer', ({ offer, to }) => {
        socket.to(to).emit('offer', { offer, from: socket.id });
      });
  
      socket.on('answer', ({ answer, to }) => {
        socket.to(to).emit('answer', { answer, from: socket.id });
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
  