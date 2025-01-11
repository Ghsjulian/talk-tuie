import { Navigate } from "react-router-dom";

//import components and pages here...
import NotFound from "./pages/404";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserAuth from "./auth/UserAuth"

const MyRoutes = [
    {
        path: "/",
        element: <UserAuth><Home/></UserAuth>,
    },

    {
        path: "/login",
        element:  <Login /> 
    },
    {
        path: "/signup",
        element:
        <Signup /> 
    },
    {
        path: "*",
        element: <NotFound />
    }
];
export default MyRoutes;
