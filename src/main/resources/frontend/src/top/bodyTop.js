import React, {Component} from "react";
import topEllipse from "../images/main/topEllipse.png";
import topLogo from "../images/main/topLogo.png";
import topVector from "../images/main/topVector.png";
import "../css/bodyTop.css";

class BodyTop extends Component{
    constructor(props){
        super(props);

        this.state = {
            isActive_work: true,
            isActive_group: false,
            isActive_acc: false,
            isActive_manage: false,
        };

        this.bodyTopPageClick = this.bodyTopPageClick.bind(this);
    }
    
    bodyTopPageClick = (e) => {
        let id = e.target.dataset.keyword;
        let sideMenu = document.getElementById("sideMenu");
        let dataKeyArray = ["work", "group", "acc", "manage"];
        let index;

        if(id === dataKeyArray[0]){
            this.setState({
                isActive_work: true,
                isActive_group: false,
                isActive_acc: false,
                isActive_manage: false,
            });
        }else if(id === dataKeyArray[1]){
            this.setState({
                isActive_work: false,
                isActive_group: true,
                isActive_acc: false,
                isActive_manage: false,
            });
        }else if(id === dataKeyArray[2]){
            this.setState({
                isActive_work: false,
                isActive_group: false,
                isActive_acc: true,
                isActive_manage: false, 
            });
        }else if(id === dataKeyArray[3]){
            this.setState({
                isActive_work: false,
                isActive_group: false,
                isActive_acc: false,
                isActive_manage: true,
            });
        }

        for(index = 0; index <= dataKeyArray.length; index++){
            sideMenu.children[index].className = "ulUnactive";

            if(id === dataKeyArray[index]){
                sideMenu.children[index].className = "ulActive";
            }
        }
    }

    render(){
        return(
            <div id="header">
                <div id="mainTopLogo">
                    <a href=""><img src={topLogo} id="mainTopLogoImg" /></a>
                    <img src={topEllipse} id="mainTopEllipseImg" />
                    <img src={topVector} id="mainTopVectorImg" />
                </div>
                <div id="mainTopMenu">
                    <ul>
                        <li><button type="button" className={this.state.isActive_work ? "active" : null} data-keyword="work" onClick={this.bodyTopPageClick}>업무관리</button></li>
                        <li><button type="button" className={this.state.isActive_group ? "active" : null} data-keyword="group" onClick={this.bodyTopPageClick}>그룹웨어</button></li>
                        <li><button type="button" className={this.state.isActive_acc ? "active" : null} data-keyword="acc" onClick={this.bodyTopPageClick}>회계관리</button></li>
                        <li><button type="button" className={this.state.isActive_manage ? "active" : null} data-keyword="manage" onClick={this.bodyTopPageClick}>경영정보</button></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default BodyTop;