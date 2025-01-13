import React, { useState, useEffect } from "react";
import useSearch from "../hooks/useSearch";

const UserList = () => {
    const [term, setTerm] = useState("");
    const { fetchUsers, users, loading, error } = useSearch();

    useEffect(() => {
        if (term) {
            fetchUsers(term);
        } else {
            fetchUsers("init");
        }
    }, [term]);
    console.log(users);
    return (
        <>
            <div className="search-area">
                <input
                    onChange={e => {
                        setTerm(e.target.value);
                    }}
                    value={term}
                    type="text"
                    placeholder="Search User..."
                />
                <button>search</button>
            </div>
            <div className="users-list">
                {users &&
                    users?.length > 0 &&
                    users.map((user, index) => {
                        return (
                            <div key={index + 23} className="user">
                                <div className="flex-user">
                                    <div className="user-avatar">
                                        <img src={user.avatar} />
                                    </div>
                                    <strong>{user.name}</strong>
                                </div>
                                <div className="btn-area">
                                    <button id="add">Add</button>
                                    <button id="call">Call</button>
                                </div>
                            </div>
                        );
                    })}

                {/*<div className="user">
                    <div className="flex-user">
                        <div className="user-avatar">
                            <img src="/ghs.jpg" />
                        </div>
                        <strong>Ghs Julian</strong>
                    </div>
                    <div className="btn-area">
                        <button id="add">Add</button>
                        <button id="call">Call</button>
                    </div>
                </div>*/}
            </div>
        </>
    );
};

export default UserList;
