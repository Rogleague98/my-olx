import { io as socketIOClient, Socket } from 'socket.io-client';

// Set VITE_SOCKET_URL in your .env file (e.g., VITE_SOCKET_URL=http://localhost:5000)
// Fix for TypeScript: declare ImportMetaEnv type for Vite
interface ImportMetaEnv {
  readonly VITE_SOCKET_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SOCKET_URL =
  (typeof import.meta !== 'undefined' &&
    typeof (import.meta as any).env !== 'undefined' &&
    (import.meta as any).env.VITE_SOCKET_URL) ||
  'http://localhost:5000';

export const socket: Socket = socketIOClient(SOCKET_URL, {
  autoConnect: false,
});

export function registerUser(userId: string) {
  if (socket && userId) {
    socket.emit('register', userId);
  }
} 