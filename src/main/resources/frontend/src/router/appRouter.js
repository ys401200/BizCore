import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "../user/login";

const AppRouter = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/user/login" element={<Login />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;