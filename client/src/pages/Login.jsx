import React, { useState, useEffect, useRef } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import "../assets/css/index.css";
import useLogin from "../hooks/useLogin";

const Login = () => {
    const { loginUser, isLoading } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const msgRef = useRef(null);
    const navigate = useNavigate()

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
    const LoginNow = async () => {
        if (email === "") {
            showMessage(false, "Please Enter Email");
            return;
        }
        if (password === "") {
            showMessage(false, "Please Enter Password");
            return;
        }
        if (email.trim() && password.trim()) {
            const response = await loginUser({ email, password });
            if (response.type) {
                showMessage(true, response.message);
                navigate("/")
            } else {
                showMessage(false, response.message);
            }
        }
    };
    return (
        <div className="page">
            <div className="login-form">
                <img src="/icons/talk-twie.png" alt="Talk-Tuie" />
                <span ref={msgRef} id="msg"></span>
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
                <button onClick={LoginNow} type="button" id="login-btn">
                    {isLoading ? "Processing..." : "Login Now"}
                </button>
                <span>
                    Don't Have An Account?
                    <NavLink to="/signup">Signup</NavLink>
                </span>
            </div>
        </div>
    );
};

export default Login;
