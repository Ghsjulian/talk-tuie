// Creating The User Controller Class Here...
// Requiring the modules here
const path = require("path");
const dotenv = require("dotenv").config("../../.env");
const UserModel = require("../models/User.Model");
const Utils = require("../config/Utils");
const api = process.env.API;

class USerController {
    async UserSignup(req, res) {
        const { name, email, password } = JSON.parse(req.body.userData);
        const avatar = req.file.filename;
        // Create Validation
        try {
            if (name === "" && email === "" && password === "") {
                return res.json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    loc: "name",
                    message: "All Fields Are Required"
                });
            } else if (name === "") {
                return res.json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    loc: "name",
                    message: "User Name Is Required"
                });
            } else if (email === "") {
                return res.json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    loc: "email",
                    message: "Email Is Required"
                });
            } else if (password === "") {
                return res.json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    loc: "password",
                    message: "Password Is Required"
                });
            } else if (password.length < 5) {
                return res.json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    loc: "password",
                    message: "Password Will Be 6<"
                });
            } else {
                // If Everything Is Okay
                const isExist = await UserModel.findOne({
                    email
                });
                if (isExist) {
                    throw new Error("User Already Registered !");
                } else {
                    const hashedPassword = await Utils.makeHash(password);
                    const newUser = await new UserModel({
                        name,
                        email,
                        password: hashedPassword,
                        avatar: api + "/users/" + avatar
                    });
                    if (await newUser.save()) {
                        const currentID = newUser._id;
                        const token = await Utils.encodeJWT({
                            id: currentID,
                            name,
                            email
                        });
                        const updateToken = await UserModel.findOneAndUpdate(
                            { email: email },
                            { token: token }
                        );
                        if (updateToken) {
                            let user = {
                                id: currentID,
                                name,
                                email,
                                token,
                                contacts: newUser.contacts,
                                avatar: newUser.avatar
                            };
                            return res.json({
                                cose: 201,
                                success: true,
                                status: "success",
                                message: "User Registration Successfully!"
                            });
                        } else {
                            throw new Error("User Registration Faild!");
                        }
                    } else {
                        throw new Error("Error While Creating User!");
                    }
                }
            }
        } catch (error) {
            Utils.DeleteFile(avatar, "default-user.png");
            return res.json({
                code: 505,
                status: false,
                error: true,
                success: false,
                message: error.message || "Server Timeout Error"
            });
        }
    }
    async UserLogin(req, res) {
        const { email, password } = req.body;
        // Create Validation
        if (email.trim() === "" && password.trim() === "") {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                loc: "name",
                message: "All Fields Are Required"
            });
        } else if (email.trim() === "") {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                loc: "email",
                message: "Email Is Required"
            });
        } else if (password.trim() === "") {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                loc: "password",
                message: "Password Is Required"
            });
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                email.trim()
            )
        ) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                loc: "email",
                message: "Invalid Email Address"
            });
        } else if (password.trim().length < 5) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                loc: "password",
                message: "Password Will Be 6<"
            });
        } else {
            // If Everything Is Okay
            try {
                const isExist = await UserModel.findOne({
                    email
                });

                if (isExist) {
                    if (isExist.email === email.trim()) {
                        const isOkPassword = await Utils.compareHashed(
                            password,
                            isExist.password
                        );
                        if (isOkPassword) {
                            const id = isExist._id;
                            const name = isExist.name;
                            const email = isExist.email;
                            const token = await Utils.encodeJWT({
                                id,
                                name,
                                email
                            });
                            const update = await UserModel.findOneAndUpdate(
                                { email: email },
                                { token: token }
                            );
                            if (update) {
                                const user = {
                                    id: isExist._id,
                                    name: isExist.name,
                                    email: isExist.email,
                                    avatar: isExist.avatar,
                                    contacts: isExist.contacts,
                                    token: isExist.token
                                };
                                // Setting Cookies In Response
                                // functions.setCookie(res, token);
                                return await Utils.setCookie(res, token, user);
                            } else {
                                throw new Error("Login Faild Please Try Again");
                            }
                        } else {
                            throw new Error("Invalid Email Or Password");
                        }
                    } else {
                        throw new Error("Invalid Credentials");
                    }
                } else {
                    throw new Error("Invalid User Details");
                }
            } catch (error) {
                return res.json({
                    code: 505,
                    status: false,
                    error: true,
                    success: false,
                    message: error.message || "Server Timeout Error"
                });
            }
        }
    }
    async UserSearch(req, res) {
        let search = req.params.user;
        try {
            if (search !== "init") {
                const users = await UserModel.find({
                    name: { $regex: search, $options: "i" },
                    _id: { $ne: req.user._id }
                }).select("-password");
                return res.json(users);
            } else {
                const users = await UserModel.find({
                    _id: { $ne: req.user._id }
                }).select("-password");
                return res.json(users);
            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
        /*
    try {
        const users = await User.find({ name: { $regex: search, $options: 'i' } });
        res.json(users);
    } catch (error) {
        res.status(500).send('Server Error');
    }
        */
    }
    async AddContact(req, res) {
        try {
            if (req.user._id) {
                const user = await UserModel.findOne({
                    _id: req.params.id
                });
                if (user) {
                    return res.status(200).json(user);
                } else {
                    throw new Error("No User Found In The Server");
                }
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }
    async GetAllUser(req, res) {
        try {
            if (req.user._id) {
                var AllUsers = [];
                const users = await UserModel.find({
                    _id: { $ne: req.user._id }
                }).select(-"password");
                if (users) {
                    users.forEach(user => {
                        AllUsers.push({
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            friends: user.friends ? user.friends : [],
                            requests: user.requests ? user.requests : [],
                            is_requested: user.requests
                                ? user.requests.includes(req.user._id)
                                : false,
                            is_friend: user.friends
                                ? user.friends.includes(req.user._id)
                                : false
                        });
                    });
                    return res.status(200).json(AllUsers);
                } else {
                    throw new Error("No User Found In The Server");
                }
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }
    async UserLogout(req, res) {
        try {
            if (req.user._id) {
                return res
                    .cookie("talktuie", "", {
                        maxAge: 0
                    })
                    .status(200)
                    .json({
                        code: 200,
                        status: "success",
                        error: false,
                        success: true,
                        message: "User  Logged Out Successfully"
                    });
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }
    async UserProfileUpdate(req, res) {
        const data = JSON.parse(req.body.images);
        var profilePic = null;
        var coverPic = null;
        var isProfile,
            isCover = false;

        if (data.isProfile === "YES") {
            isProfile = true;
            profilePic = api + "/users/" + req.files.profilePic[0].filename;
        }
        if (data.isCover === "YES") {
            isCover = true;
            coverPic = api + "/users/" + req.files.coverPic[0].filename;
        }

        try {
            const user = await UserModel.findOne({ _id: req.user._id });
            const update = await UserModel.findByIdAndUpdate(req.user._id, {
                avatar: isProfile ? profilePic : user.avatar,
                cover: isCover ? coverPic : user.cover
            });
            if (update) {
                if (isProfile) {
                    Utils.DeleteFile(user.avatar, "default-user.png");
                }
                if (isCover) {
                    Utils.DeleteFile(user.cover, "default-cover.png");
                }
                return res.status(200).json({
                    code: 200,
                    status: true,
                    error: false,
                    success: true,
                    message: "Profile Updated Successfully"
                });
            } else {
                throw new Error("Error While Updating Profile !");
            }
        } catch (error) {
            console.log(
                "Error In Updating Profile Photo And Cover Photo On Backend Server Side --> "
            );
            console.log(error.message);
            if (isProfile) {
                await Utils.DeleteFile(profilePic, "default-user.png");
                return res.status(403).json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    message: error.message || "Server Error -403"
                });
            }
            if (isCover) {
                await Utils.DeleteFile(coverPic, "default-cover.png");
                return res.status(403).json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    message: error.message || "Server Error -403"
                });
            }
        }

        /*
        try {
            if (data.avatar === "YES") {
                isAvatar = true;
                filename = req.file.filename;
                data.avatar = api + "/users/" + req.file.filename;
            }
            if (data.current_password && data.current_password.length < 6) {
                throw new Error("Current Password Will Be 6 Character");
            }
            if (data.new_password && data.new_password.length < 6) {
                throw new Error("New Password Will Be 6 Character");
            }
            const isExist = await UserModel.findOne({ _id: req.user._id });
            if (isExist) {
                const isOkPassword = await Utils.compareHashed(
                    data.current_password,
                    isExist.password
                );
                if (isOkPassword) {
                    password = data.new_password;
                    delete data.new_password;
                    delete data.current_password;
                    data.password = await Utils.makeHash(password);
                    const update = await UserModel.findByIdAndUpdate(
                        req.user._id,
                        data
                    );
                    if (update) {
                        return res.status(200).json({
                            code: 200,
                            status: true,
                            error: false,
                            success: true,
                            message: "Profile Updated Successfully"
                        });
                    } else {
                        throw new Error("Error While Updating Profile !");
                    }
                } else {
                    throw new Error("Current Password Is Invalid");
                }
            } else {
                throw new Error("User Not Found");
            }
        } catch (error) {
            if (isAvatar) {
                await Utils.DeleteFile(filename);
                return res.status(403).json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    message: error.message || "Server Error -403"
                });
            } else {
                return res.status(403).json({
                    code: 403,
                    status: false,
                    error: true,
                    success: false,
                    message: error.message || "Server Error -403"
                });
            }
        }
        */
    }
    async PersonalInfoUpdate(req, res) {
        const { name, email, current_password, new_password } = req.body;
        var hashedPassword;

        try {
            if (current_password) {
                if (current_password.trim().length < 6) {
                    throw new Error("Current Password Length Will Be 6");
                }
            }
            if (new_password) {
                if (new_password.trim().length < 6) {
                    throw new Error("New Password Length Will Be 6");
                }
            }

            const isExist = await UserModel.findOne({ _id: req.user._id });
            if (isExist) {
                if (new_password && current_password) {
                    const isOkPassword = await Utils.compareHashed(
                        current_password,
                        isExist.password
                    );
                    if (isOkPassword) {
                        hashedPassword = await Utils.makeHash(new_password);
                    } else {
                        throw new Error("Invalid User Password");
                    }
                }
                const update = await UserModel.findByIdAndUpdate(req.user._id, {
                    name: name ? name : isExist.name,
                    email: email ? email : isExist.email,
                    password: new_password ? hashedPassword : isExist.password
                });
                if (update) {
                    return res.status(200).json({
                        code: 200,
                        status: true,
                        error: false,
                        success: true,
                        message: "Profile Updated Successfully"
                    });
                } else {
                    throw new Error("Error While Updating Profile !");
                }
            } else {
                throw new Error("User Not Found");
            }
        } catch (error) {
            return res.status(403).json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message
            });
        }
    }
    async DeleteUser(req, res) {
        try {
            if (req.user._id) {
                const deleteuser = await UserModel.deleteOne({ _id: id });
                if (deleteuser) {
                    return res.status(200).json({
                        code: 200,
                        status: true,
                        error: false,
                        success: true,
                        message: "User Deleted Successfully"
                    });
                } else {
                    throw new Error("Something Went Wrong");
                }
            } else {
                throw new Error("User ID Not Found");
            }
        } catch (error) {
            return res.status(403).json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message
            });
        }
    }
    async SendFriendRequest(req, res) {
        try {
            if (req.user._id) {
                const user = await UserModel.findOne({
                    _id: req.params.user_id
                });
                if (user) {
                    const requests = user.requests;
                    if (requests.includes(req.user._id)) {
                        await UserModel.updateOne(
                            { _id: req.params.user_id },
                            { $pull: { requests: req.user._id } }
                        );
                        await UserModel.updateOne(
                            { _id: req.params.user_id },
                            {
                                $pull: {
                                    notifications: {
                                        sender_name: req.user.name,
                                        sender_id: req.user._id,
                                        receiver_id: req.params.user_id,
                                        sender_avatar: req.user.avatar
                                    }
                                }
                            }
                        );
                        return res.json({
                            code: 200,
                            status: true,
                            error: false,
                            success: true,
                            message: "Request Cancelled"
                        });
                    } else {
                        await UserModel.updateOne(
                            { _id: req.params.user_id },
                            { $addToSet: { requests: req.user._id } }
                        );
                        await UserModel.updateOne(
                            { _id: req.params.user_id },
                            {
                                $addToSet: {
                                    notifications: {
                                        sender_name: req.user.name,
                                        sender_id: req.user._id,
                                        receiver_id: req.params.user_id,
                                        sender_avatar: req.user.avatar
                                    }
                                }
                            }
                        );
                        return res.json({
                            code: 200,
                            status: true,
                            error: false,
                            success: true,
                            message: "Request Sent"
                        });
                    }
                } else {
                    throw new Error("No User Found In The Server");
                }
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }
    async AcceptFriendRequest(req, res) {
        try {
            if (req.user._id) {
                const friend = await UserModel.findOne({
                    _id: req.params.user_id
                });
                const user = await UserModel.findOne({
                    _id: req.user._id
                });
                if (user) {
                    // For Request Accepter
                    await UserModel.updateOne(
                        { _id: req.user._id },
                        {
                            $addToSet: {
                                friends: {
                                    id: friend._id,
                                    name: friend.name,
                                    avatar: friend.avatar
                                }
                            }
                        }
                    );
                    // For Request Sender
                    await UserModel.updateOne(
                        { _id: req.params.user_id },
                        {
                            $addToSet: {
                                friends: {
                                    id: req.user._id,
                                    name: req.user.name,
                                    avatar: req.user.avatar
                                }
                            }
                        }
                    );
                    // Delete The Notification From Accepter
                    await UserModel.updateOne(
                        { _id: req.user._id },
                        {
                            $pull: {
                                notifications: { sender_id: friend._id }
                            }
                        }
                    );
                    // Delete The Friend Request From Accepter
                    await UserModel.updateOne(
                        { _id: req.user._id },
                        {
                            $pull: { requests: friend._id }
                        }
                    );
                    return res.json({
                        code: 200,
                        status: true,
                        error: false,
                        success: true,
                        message: "Friend Request Accepted"
                    });
                } else {
                    throw new Error("No User Found In The Server");
                }
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }
    async UnFriend(req, res) {
        try {
            if (req.user._id) {
                const friend = await UserModel.findOne({
                    _id: req.params.user_id
                });
                const user = await UserModel.findOne({
                    _id: req.user._id
                });
                if (user) {
                    await UserModel.updateOne(
                        { _id: friend._id },
                        {
                            $pull: {
                                friends: { id: user._id }
                            }
                        }
                        /*
                        { $pull: { "friends.$[].user": { id: friend._id } } }
                        */
                    );
                    await UserModel.updateOne(
                        { _id: req.user._id },
                        {
                            $pull: {
                                friends: { id: friend._id }
                            }
                        }
                        /*
                        { $pull: { "friends.$[].user": { id: req.user._id } } }
                        */
                    );

                    return res.json({
                        code: 200,
                        status: true,
                        error: false,
                        success: true,
                        message: "Unfriend Successfully"
                    });
                } else {
                    throw new Error("No User Found In The Server");
                }
            } else {
                throw new Error("Unauthorized User");
            }
        } catch (error) {
            return res.json({
                code: 403,
                status: false,
                error: true,
                success: false,
                message: error.message || "Something Went Worng"
            });
        }
    }

    async AllFriends(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.user._id });
            if (user) {
                if (user.friends.length > 0) {
                    res.json(user.friends);
                } else {
                    throw new Error("No Friends Found ");
                }
            } else {
                throw new Error("No User Exist");
            }
        } catch (error) {
            console.log(error.message);
            return res.json({
                error: true,
                success: false,
                status: false,
                code: 505,
                message: error.message || "Internal Server Error - 505"
            });
        }
    }
}

module.exports = new USerController();
