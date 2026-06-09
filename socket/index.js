const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');

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
      const token = socket.handshake.auth?.token;
      const user = verifyAccessToken(token);

      if (!user || user.role !== 'teacher' || user.userId !== String(teacherId)) {
        socket.emit('socket_error', { message: 'Unauthorized to join this room' });
        return;
      }

      const room = String(teacherId);
      socket.join(room);
      console.log(`Teacher ${teacherId} joined room via socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

// const getIO = () => io;

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
