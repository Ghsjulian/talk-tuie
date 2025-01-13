import { useAuth } from "../context/Auth";
import React, { useState, useEffect } from "react";
import axios from "axios";

const useCall = () => {
    const { api, login } = useAuth();
    const [isCalling, setLoading] = useState(true);
    const [isFailed, setError] = useState(null);

    const Call = async (id, tag) => {
        setLoading(true);
        tag.textContent = "Adding";
        try {
            const response = await axios.get(`${api}/add-contact/${id}`, {
                withCredentials: true
            });
            console.log(response.data);
            tag.textContent = "Add";
        } catch (err) {
            setError(err);
            console.log(err);
            tag.textContent = "Failed";
        } finally {
            setLoading(false);
        }
    };

    return { Call, isCalling, isFailed };
};

export default useCall;
