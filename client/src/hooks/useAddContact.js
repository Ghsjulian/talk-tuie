import { useAuth } from "../context/Auth";
import React, { useState, useEffect } from "react";
import axios from "axios";

const useAddContact = () => {
    const { api, login } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(null);

    const addContact = async (id,tag) => {
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

    return { addContact, isLoading, isError };
};

export default useAddContact;
