import React, {Component} from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from "../home/home";
import Login from "../user/login/login";

class AppRouter extends Component {
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" component={Home}></Route>
                    <Route path="/user/login" component={Login}></Route>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default AppRouter;