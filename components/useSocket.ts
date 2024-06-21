import { API_URL } from "@/utils/constants";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const socketIo = io(API_URL);

		setSocket(socketIo);

		function cleanup() {
			socketIo.disconnect();
		}

		return cleanup;
	}, []);

	return socket;
};

export default useSocket;
