import { useAuth } from "../context/Auth";
import React, { useState } from "react";
import axios from "axios";

const useLogin = () => {
    const [isLoading, setLoading] = useState(false);
    const { api, login } = useAuth();

    const loginUser = async data => {
        try {
            setLoading(true);
            const response = await axios.post(`${api}/user-login`, data, {
                withCredentials: true
            });
            localStorage.setItem(
                "talk-tuie",
                JSON.stringify(response.data.user)
            );
            if (response.data.success) {
                login(response.data.user);
                setLoading(false);
                return {type:true, message:response.data.message}
            } else {
                setLoading(false);
                throw new Error(response.data.message);
            }
        } catch (error) {
            setLoading(false);
            return {type:false,message: error.message};
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, isLoading };
};

export default useLogin;
