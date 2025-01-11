const dotenv = require("dotenv").config("../../.env");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const expiresIn = process.env.EXPIRES_IN;
const path = require("path");
const fs = require("fs");
const UserModel = require("../models/User.Model");

const makeHash = async password => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log("Error Hashing Password");
    }
};
const compareHashed = async (password, hashedPassword) => {
    try {
        return await bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        console.log(error);
    }
};
const encodeJWT = async payload => {
    return jwt.sign(payload, secretKey, { expiresIn });
};
const decodeJWT = async token => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
};
const setCookie = async (res, value,data) => {
    return res
        .cookie("talk-tuie", value, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production", // Set to true in production
            path: '/' // Ensure the path is correct
        })
        .status(200)
        .json({user:data,
            code: 200,
            status: "success",
            error: false,
            success: true,
            message: "User  Logged In Successfully"
        });
};
const DeleteFile = async (filepath, type) => {
    let file = path.join(__dirname, "../public/users/", filepath);
        try {
            //await fs.unlink(file);
            await fs.unlinkSync(file);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
};
const DeleteOldImg = async filepath => {
    try {
        let url = filepath.split("/");
        let len = url.length;
        let filename = url[len - 1];
        let file = path.join(__dirname, "../public/post/", filename);
        await fs.unlinkSync(file);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const getUser = async id => {
    try {
        const user = await UserModel.findOne({ _id: id }).select("-password");
        if (user) {
            return user;
        } else {
            throw new Error("No User Found");
        }
    } catch (error) {
        console.log(error.message);
    }
};
const isFriend = async id => {
    try {
        const user = await UserModel.findOne({ _id: id });
        if (user && user?._id) {
            const friends = user.friends;
            let result = friends.find(obj => obj?.id === id);
            if (result?.id) {
                if (result?.id === id) {
                    return true;
                } else {
                    throw new Error("User Not Friend Yet");
                }
            } else {
                throw new Error("You are not friends");
            }
        }
    } catch (error) {
        console.log("Error in isFriend in Utils.js --> ", error.message);
        return false;
    }
};

const getFriends = async id => {
    try {
        const user = await UserModel.findOne({ _id: id });
        if (user) {
            if (user.friends.length > 0) {
                return user.friends;
            } else {
                throw new Error("No Friends Found ");
            }
        }
    } catch (e) {
        return [];
    }
};

module.exports = {
    makeHash,
    compareHashed,
    encodeJWT,
    decodeJWT,
    setCookie,
    DeleteFile,
    DeleteOldImg,
    getUser,
    isFriend,
    getFriends
};
