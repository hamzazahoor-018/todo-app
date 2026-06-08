const { Server } = require('socket.io');

let io;

const initSocket = (server, frontendOrigin) => {
  io = new Server(server, {
    cors: {
      origin: frontendOrigin,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_teacher_room', ({ teacherId }) => {
      if (!teacherId) {
        return;
      }

      const room = String(teacherId);
      socket.join(room);
      console.log(`Socket ${socket.id} joined teacher room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => io;

const emitNewSubmission = (teacherId, payload) => {
  if (!io || !teacherId) {
    return;
  }

  io.to(String(teacherId)).emit('new_submission', payload);
};

module.exports = {
  initSocket,
  getIO,
  emitNewSubmission
};
