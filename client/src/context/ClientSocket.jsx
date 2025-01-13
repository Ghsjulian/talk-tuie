import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./Auth";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { isLogin, user, setSocket, setOnlineUsers, onlineUsers } = useAuth();
    const sock_url = import.meta.env.VITE_SOCK_URL;
    useEffect(() => {
        if (isLogin) {
            const newSocket = io(sock_url, {
                transports: ["websocket"],
                withCredentials: true,
                query: {
                    token:
                        JSON.parse(localStorage.getItem("talktuie")).token ||
                        null
                }
            });
            setSocket(newSocket);
            newSocket.on("online-users", users => {
                setOnlineUsers(users);
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isLogin, sock_url]);

    return (
        <SocketContext.Provider value={sock_url}>
            {children}
        </SocketContext.Provider>
    );
};
