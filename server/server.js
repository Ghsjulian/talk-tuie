// Import all modules here
const { server, app, IO } = require("./socket");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Declaring some variables
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || "127.0.0.1";
const DB = process.env.SERVER_DB || "talk-tuie";
const URI = process.env.SERVER_URI || "mongodb://localhost:27017/";

// Defined Some Middlewares
/*
const publicPath = path.join(__dirname);
app.use(express.static(publicPath + "/public/"));
*/
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Define the index route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(
    cors({
        origin: HOST,
        credentials: true
    })
);

// Import All Routes Here...
// Defined The API Endpoints
const UserRouter = require("./routes/User.Routes");
app.use("/api", UserRouter);

// Listening The Server
mongoose
    .connect(URI, { dbName: DB })
    .then(() => {
        server.listen(PORT, () => {
            console.clear();
            console.log(
                `\n ____________________________________________________`
            );
            console.log(`\n [+]  SERVER IS RUNNING - ${HOST}`);
            console.log(`\n [+]  WEB DEVELOPER NAME : GHS JULIAN`);
            console.log(`\n [+]  https://github.com/Ghsjulian`);
            console.log(`\n [+]  https://ghsresume.netlify.app`);
            console.log(
                ` ____________________________________________________\n\n`
            );
        });
    })
    .catch(error => {
        console.clear();
        console.log(error);
    });
