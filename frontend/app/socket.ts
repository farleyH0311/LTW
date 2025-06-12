import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token: string) {
  if (socket) {
    console.log("đã có");
    socket.disconnect();
    socket = null;
  }

  socket = io("http://localhost:3333", {
    auth: {
      token,
    },
    autoConnect: false,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });

  return socket;
}
export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    console.log("Socket manually disconnected");
    socket = null;
  }
}
