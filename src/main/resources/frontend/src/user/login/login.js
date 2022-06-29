import React, {Component} from "react";
import Logo from "../../images/main/topLogo.png";
import login_intro from "../../images/login/login_introduce.png";
import login_session from "../../images/login/login_session.png";
import "../../css/login/login.css";

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            is_session_active: "unActive"
        }

        this.session_click = this.session_click.bind(this);
    }

    session_click = (e) => {
        if(e.target.className === "unActive"){
            this.setState({
                is_session_active: "active"
            });
        }else{
            this.setState({
                is_session_active: "unActive"
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
                            <img src={login_session} class={this.state.is_session_active} id="login_session_btn" onClick={this.session_click}/>
                            <span id="login_session_span">로그인 상태 유지</span>
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
                        <img src={login_intro} id="loginIntroImg" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;