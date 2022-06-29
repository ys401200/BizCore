import React, {Component} from "react";
import Logo from "../../images/main/topLogo.png";
import loginIntro from "../../images/login/loginIntroduce.png";
import loginSession from "../../images/login/loginSession.png";
import "../../css/login/login.css";

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            isSessionActive: "unActive"
        }

        this.sessionClick = this.sessionClick.bind(this);
    }

    sessionClick = (e) => {
        if(e.target.className === "unActive"){
            this.setState({
                isSessionActive: "active"
            });
        }else{
            this.setState({
                isSessionActive: "unActive"
            });
        }
    }

    render(){
        return(
            <div id="loginContents">
                <div id="loginContent">
                    <form id="loginForm" method="post" action="/user/login">
                        <div id="loginLogoImgDiv">
                            <img src={Logo} id="loginLogoImg" />
                        </div>
                        <div id="loginInput">
                            <input type="text" id="compId" name="compId" placeholder="회사 아이디" /><br />
                            <input type="text" id="userId" name="userId" placeholder="사용자 아이디" /><br />
                            <input type="password" id="pw" name="pw" placeholder="비밀번호" />
                        </div>
                        <div id="loginSessionDiv">
                            <img src={loginSession} class={this.state.isSessionActive} id="loginSessionBtn" onClick={this.sessionClick}/>
                            <span id="loginSessionSpan">로그인 상태 유지</span>
                        </div>
                        <div id="loginBtns">
                            <button type="submit" id="loginBtn">로그인</button>
                        </div>
                    </form>
                </div>
                <div id="loginIntroduce">
                    <div id="loginSpans">
                        <span id="loginIntroSpan_1">Welcome to </span>
                        <span id="loginIntroSpan_2">Biz Core</span>
                    </div>
                    <div id="loginIntroImgDiv">
                        <img src={loginIntro} id="loginIntroImg" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;