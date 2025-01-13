import { Navigate } from "react-router-dom";

//import components and pages here...
import NotFound from "./pages/404";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserAuth from "./auth/UserAuth";
import LoginAuth from "./auth/LoginAuth";

const MyRoutes = [
    {
        path: "/",
        element: (
            <UserAuth>
                <Home />
            </UserAuth>
        )
    },

    {
        path: "/login",
        element: (
            <LoginAuth>
                <Login />
            </LoginAuth>
        )
    },
    {
        path: "/signup",
        element: <LoginAuth><Signup /></LoginAuth>
    },
    {
        path: "*",
        element: <NotFound />
    }
];
export default MyRoutes;
