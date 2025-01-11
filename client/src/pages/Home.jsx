import React from "react";
import "../assets/css/page.css";
import Header from "../components/Header"

const Home = () => {
    return (
        <div className="page">
            <div className="home-page">
                <Header/>
                <main>Main</main>
            </div>
        </div>
    );
};

export default Home;
