import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const navRef = useRef(null);
    const [isopen, setOpen] = useState(false);
    const openNav = () => {
        navRef.current.classList.toggle("open-nav");
        setOpen(!isopen);
    };
    return (
        <header>
            <img id="logo" src="/icons/talk-twie.png" alt="Talk-Tuie" />
            <div ref={navRef} className="links">
                <NavLink to="#">Home</NavLink>
                <NavLink to="#">Add Contact</NavLink>
                <NavLink to="#">Contact</NavLink>
                <NavLink to="#">Calls</NavLink>
                <NavLink to="#">Logout</NavLink>
            </div>
            {/** Add This When Nav Toggled */}
            <div onClick={openNav} className={isopen && "overly"}></div>
            <img
                onClick={openNav}
                id="menu-btn"
                src="/icons/menu-bar.png"
                alt="menu"
            />
        </header>
    );
};

export default Header;
