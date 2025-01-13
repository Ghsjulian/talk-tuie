import { useAuth } from "../context/Auth";
import React, { useState } from "react";
import axios from "axios";

const useLogout = () => {
    const [isLoading, setLoading] = useState(false);
    const { api, login ,logout} = useAuth();

    const logoutUser = async data => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}/user-logout`, {
                withCredentials: true
            });
            if (response?.data?.success) {
                localStorage.removeItem("talktuie");
                logout();
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log("Error In Logout -> " + error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return { logoutUser, isLoading };
};

export default useLogout;
