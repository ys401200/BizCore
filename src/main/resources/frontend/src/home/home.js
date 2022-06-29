import React, {Component} from "react";
import BodyTop from "../top/bodyTop";
import BodyContents from "../bodyContents/bodyContents";

class Home extends Component{
    render(){
        return(
            <>
                <BodyTop />
                <BodyContents />
            </>
        )
    }
}

export default Home;