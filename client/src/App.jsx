import React from "react";
import {
    BrowserRouter,
    createBrowserRouter,
    RouterProvider,
    Routes,
    Route
} from "react-router-dom";
import MyRoutes from "./Router";
import { AuthProvider } from "./context/Auth";


const router = createBrowserRouter(MyRoutes);
const App = () => {
    return (<AuthProvider>
            <RouterProvider router={router} />
            </AuthProvider>
    );
};

export default App;
