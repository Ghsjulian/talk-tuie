import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/index.css";
import useSignup from "../hooks/useSignup";

const Signup = () => {
    const { signupUser, isLoading } = useSignup();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const msgRef = useRef(null);
    const navigate = useNavigate();
    document.title = "Create Your Account - Voice Call App"
    

    const showMessage = (type, msg) => {
        if (type) {
            msgRef.current.classList.add("success");
            msgRef.current.textContent = msg;
        } else {
            msgRef.current.classList.add("error");
            msgRef.current.textContent = msg;
        }
        setTimeout(() => {
            msgRef.current.setAttribute("class", "");
            msgRef.current.textContent = "";
        }, 3000);
    };
    const handleAvatarChange = event => {
        const file = event.target.files[0];
        setFile(file);
        setFileName(file.name);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
    const SignupNow = async () => {
        if (avatar === null) {
            showMessage(false, "Please Select Profile Picture");
            return;
        }
        if (name === "") {
            showMessage(false, "Please Enter Username");
            return;
        }
        if (email === "") {
            showMessage(false, "Please Enter Email");
            return;
        }
        if (password === "") {
            showMessage(false, "Please Enter Password");
            return;
        }
        if (avatar && name.trim() && email.trim() && password.trim()) {
            const response = await signupUser(file, {
                name: name.trim(),
                email: email.trim(),
                password: password.trim()
            });
            if (response.type) {
                showMessage(true, response.message);
                navigate("/login");
            } else {
                showMessage(false, response.message);
            }
        }
    };

    return (
        <div className="page">
            <div className="login-form">
                {/* <img src="/icons/talk-twie.png" alt="Talk-Tuie" />*/}
                {avatar && <img id="avatar" src={avatar} alt="User Avatar" />}
                <span ref={msgRef} id="msg"></span>
                <label htmlFor="user-avatar">
                    {fileName ? fileName : "Select Profile Picture"}
                </label>
                <input
                    onChange={handleAvatarChange}
                    type="file"
                    accept="*/*"
                    id="user-avatar"
                    hidden
                />
                <input
                    type="text"
                    placeholder="Enter Your Name"
                    id="name"
                    name="name"
                    required
                    onChange={e => {
                        setName(e.target.value);
                    }}
                    value={name}
                />
                <input
                    type="email"
                    placeholder="Enter Your Email"
                    id="email"
                    name="email"
                    required
                    onChange={e => {
                        setEmail(e.target.value);
                    }}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    id="password"
                    name="password"
                    required
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                    value={password}
                />
                <button onClick={SignupNow} type="button" id="login-btn">
                    {isLoading ? "Processing..." : "Signup Now"}
                </button>
                <span>
                    Already Have An Account?
                    <NavLink to="/login">Login</NavLink>
                </span>
            </div>
        </div>
    );
};

export default Signup;
