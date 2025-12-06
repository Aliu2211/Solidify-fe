import { io } from 'socket.io-client';
import storage from '../utils/storage';

let socket = null;

export const initializeSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = storage.getAccessToken();

  if (!token) {
    console.error('No access token found');
    return null;
  }

  // Determine Socket URL
  let socketUrl = import.meta.env.VITE_SOCKET_URL;
  
  if (!socketUrl) {
    if (import.meta.env.PROD) {
      socketUrl = 'https://solidify.onrender.com';
    } else {
      socketUrl = 'http://localhost:5000';
    }
  }

  socket = io(socketUrl, {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  setupSocketListeners();

  return socket;
};

const setupSocketListeners = () => {
  if (!socket) return;

  socket.on('connect', () => {
    console.log('Connected to socket server');
    console.log('Socket ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
