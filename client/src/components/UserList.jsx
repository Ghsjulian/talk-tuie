import React, { useEffect, useRef, useState } from "react";
import useSearch from "../hooks/useSearch";
import useAddContact from "../hooks/useAddContact";
import useCall from "../hooks/useCall";
import { useAuth } from "../context/Auth";

const UserList = () => {
    const { onlineUsers, socket } = useAuth();
    const [term, setTerm] = useState("");
    const { fetchUsers, users, loading, error } = useSearch();
    const { addContact, isLoading, isError } = useAddContact();
    // const { Call, isCalling, isFailed } = useCall();

    /*-------------------------;---*/
    
    /*-------------------------;---*/
    const isOnline = id => {
        if (onlineUsers.includes(id)) {
            return true;
        } else {
            return false;
        }
    };
    useEffect(() => {
        if (term) {
            fetchUsers(term);
        } else {
            fetchUsers("init");
        }
    }, [term, onlineUsers]);
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
                                        <div
                                            className={
                                                isOnline(user._id)
                                                    ? "online"
                                                    : "offline"
                                            }
                                        ></div>
                                    </div>
                                    <strong>{user.name}</strong>
                                </div>
                                <div className="btn-area">
                                    <button
                                        id="add"
                                        onClick={e => {
                                            e.preventDefault();
                                            addContact(user._id, e.target);
                                        }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        id="call"
                                        onClick={e => {
                                            e.preventDefault();
                                            Call(user._id, e.target);
                                        }}
                                    >
                                        Call
                                    </button>
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
