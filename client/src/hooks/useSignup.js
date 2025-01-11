import { useAuth } from "../context/Auth";
import React, { useState } from "react";

const useSignup = () => {
    const [isLoading, setLoading] = useState(false);
    const { api, login } = useAuth();

    const signupUser = async  (avatar,data) => {
        const formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("userData", JSON.stringify(data)); // Changed key to userData

        try {
            setLoading(true);
            const request = await fetch(`${api}/user-signup`, {
                method: "POST",
                body: formData
            });
            if (!request.ok) {
                throw new Error(
                     "Network Error In Signup"
                );
            }
            const response = await request.json();
            if (response.success) {
                setLoading(false);
                return {type:true, message:response.message}
            } else {
                setLoading(false);
                throw new Error(response.message);
            }
        } catch (error) {
            setLoading(false);
            return {type:false,message: error.message};
        } finally {
            setLoading(false);
        }
    };

    return { signupUser, isLoading };
};

export default useSignup;
