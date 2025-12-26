// Socket.IO client singleton for real-time updates
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    // TODO: Replace with your backend WebSocket URL
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      transports: ['websocket'],
    });
  }
  return socket;
}
