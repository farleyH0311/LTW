"use client";

import { useEffect } from "react";
import { initSocket } from "@/app/socket";

export default function SocketClient() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const socket = initSocket(token);
      socket.connect();
    }
  }, []);

  return null;
}
