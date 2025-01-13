const Utils = require("../config/Utils");
const UserModel = require("../models/User.Model");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const IO = socketIo(server, {
    cors: {
        origin: [process.env.SERVER_HOST, "http://localhost:5000"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const online_users = new Set();
const total_users = {};

IO.on("connection", async socket => {
    try {
        // const token = socket.request.headers.cookie.slice(9) || null;
        const token = socket.handshake.query.token;
        const user = await Utils.decodeJWT(token);
        const ID = user?.id;
        const sock_id = socket.id;
        const db_user = await UserModel.find({ _id: ID }).select("-password");
        online_users.add(ID);
        total_users[ID] = {
            sock_id,
            u_id: db_user?._id,
            name: db_user?.name,
            avatar: db_user?.avatar
        };
        /*------> SEND ONLINE USERS TO CLIENTS <-----*/
        console.log(`\n[+] ${user?.name} Has Connected !\n`);
        IO.emit("online-users", Array.from(online_users));

        /*------> SEND AND ACCEPT  CALL <-----*/
        socket.on("join", data => {
           // socket.join(data.room);
            console.log(`User  ${socket.id} joined room: ${data.room}`);
        });

        /*------> SEND AND ACCEPT  CALL <-----*/
        socket.on("disconnect", () => {
            online_users.delete(ID);
            IO.emit("online-users", Array.from(online_users));
            console.log(`\n[-] ${user?.name} Has Disconnected !\n`);
        });
    } catch (error) {
        console.log("\n[!] SOCKET ERROR  -->  \n", error.message);
    }

    /*
    socket.on("callUser ", ({ userToCall, signalData }) => {
        IO.to(userToCall).emit("callUser ", {
            signal: signalData,
            from: socket.id
        });
    });

    socket.on("answerCall", ({ to, signal }) => {
        IO.to(to).emit("callAccepted", signal);
    });
*/
});

module.exports = { app, server, IO };
