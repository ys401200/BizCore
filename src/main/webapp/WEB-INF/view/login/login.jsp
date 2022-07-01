<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="/css/login/login.css" />
<script src="/js/jquery.min.js"></script>
<title>로그인</title>
</head>
<body>
<div id="loginContents">
    <div id="loginContent">
        <form id="loginForm" enctype="multipart/form-data">
            <div id="loginLogoImgDiv">
                <img src="/images/main/topLogo.png" id="loginLogoImg" />
            </div>
            <div id="loginInput">
                <input type="text" id="compId" name="compId" placeholder="회사 아이디" /><br />
                <input type="text" id="userId" name="userId" placeholder="사용자 아이디" /><br />
                <input type="password" id="pw" name="pw" placeholder="비밀번호" />
            </div>
            <div id="loginSessionDiv">
                <img src="/images/login/loginSession.png" id="loginSessionBtn" onclick="loginSessionClick(this)"/>
                <span id="loginSessionSpan">로그인 상태 유지</span>
            </div>
            <div id="loginBtns">
                <button type="button" id="loginBtn" onclick="loginSubmit()">로그인</button>
            </div>
        </form>
    </div>
    <div id="loginIntroduce">
        <div id="loginSpans">
            <span id="loginIntroSpan_1">Welcome to </span>
            <span id="loginIntroSpan_2">Biz Core</span>
        </div>
        <div id="loginIntroImgDiv">
            <img src="/images/login/loginIntroduce.png" id="loginIntroImg" />
        </div>
    </div>
</div>
</body>
<script src="/js/login/login.js"></script>
</html>