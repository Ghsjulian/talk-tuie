import { useAuth } from "../context/Auth";
import React, { useState, useEffect } from "react";
import axios from "axios";

const useSearch = () => {
    const { api, login } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async searchTerm => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${api}/user-search/${searchTerm}`,
                  {withCredentials: true
                   // params: { search: searchTerm }
                }
            );
            setUsers(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { users, fetchUsers, loading, error };
};

export default useSearch;
