const http = require("http");
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
// Required Modules
const UserModel = require("../models/User.Model");
const Utils = require("../config/Utils");

const users = {};
const totalFriends = [];

const getSocketID = id => {
    if (users?.id) {
        console.log("socket.js --> ", users[id]);
        return users[id].sock_id;
    }
    return;
};


const IO = new Server(server, {
    cors: {
        origin: ["http://localhost:5000","https://mini-facebook-wrdw.onrender.com"],
        method: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Create Socket Connection
IO.on("connection", async socket => {
    /*--> Create Handshake <--*/
    const user_id = socket.handshake.query.user_id;
    const user = await Utils.getUser(user_id);
    users[user_id] = user
    console.log(`\n [+] ---> ${user.name} Has Connected\n`);

    /*--> For Disonnecting User <--*/
    socket.on("disconnect", async socket => {
        delete users[user_id];
        console.log(`\n [-] ---> ${user.name} Has Disonnected\n`);
    });
});

// Export All
module.exports = { app, server, IO, users, getSocketID };
