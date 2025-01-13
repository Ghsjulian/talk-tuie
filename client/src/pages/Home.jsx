import React from "react";
import "../assets/css/page.css";
import Header from "../components/Header";
import UserList from "../components/UserList";

const Home = () => {
    return (
        <div className="page">
            <div className="home-page">
                <Header />
                <main>
                 <UserList/>
                </main>
            </div>
        </div>
    );
};

export default Home;
