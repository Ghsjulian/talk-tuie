const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        requests: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        },    
        contacts: {
            type: [{
                id: String,
                                    name: String,
                                    avatar: String 
            }]
        },
        token: {
            type: String
        },
        online : {
            type : Boolean        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
