// socket.on('join-voice')
// socket.on('offer')
// socket.on('answer')
// socket.on('ice-candidate')


module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('✅ A user connected:', socket.id);
  
      socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        console.log(`👥 User ${socket.id} joined channel ${channelId}`);
      });
  
      socket.on('sendMessage', (messageData) => {
        io.to(messageData.channelId).emit('receiveMessage', messageData);
      });
  
      socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
      });
    });
  };
  