import React, {Component} from "react";
import SideMenu from "../sideMenu/sideMenu";
import BodyContent from "../bodyContent/bodyContent";
import "../css/bodyContents.css";

class BodyContents extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="bodyContents">
                <div id="sideContents">
                    <SideMenu />
                </div>
                <div id="bodyContent">
                    <BodyContent />
                </div>
            </div>
        )
    }
}

export default BodyContents;