<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<% 
	String getPathName = (String)session.getAttribute("pathName");
	request.setAttribute("getPathName", getPathName);
%>
<!DOCTYPE html>
<html>
<head>
<link rel="icon" href="/favicon" type="image/x-icon">
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="/css/header.css" />
<link rel="stylesheet" type="text/css" href="/css/loading.css" />
<link rel="stylesheet" type="text/css" href="/css/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="/css/jquery-ui.structure.css" />
<link rel="stylesheet" type="text/css" href="/css/jquery-ui.theme.css" />
<link rel="stylesheet" type="text/css" href="/css/bodyContents.css" />
<link rel="stylesheet" type="text/css" href="/css/<%= getPathName %>/<%= getPathName %>.css" />
<link rel="stylesheet" type="text/css" href="/css/common_jh.css" />
<link rel="stylesheet" type="text/css" href="/css/common_sh.css" />

<script src="/js/jquery.min.js"></script>
<script src="/js/axios/axios.min.js"></script>
<script src="/js/jquery-ui.js"></script>
<script src="/js/jquery.easing.js"></script>
<script src="/js/html2pdf.bundle.min.js"></script>
<script src="/js/loading.js"></script>
<script src="/js/chart.js"></script>
<script src="/js/editor/ckeditor.js"></script>
<script src="/js/<%= getPathName %>/<%= getPathName %>.js"></script>
<script src="https://cdn.tiny.cloud/1/kh4eirod6bgv8u2sxlaeikxy5hxfogh0edhzloljxh6zf046/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script src="https://kit.fontawesome.com/a37df9d8b5.js" crossorigin="anonymous"></script>
<script src="/js/common_jh.js"></script>
<script src="/js/common_sh.js"></script>
<script src="/js/gwEstimate/gwEstimate.js"></script>

<title>BizCore</title>
</head>
<body>
<input type="hidden" id="pathName" value="${getPathName}" />
<div id="loadingDiv" style="width: 100%; height: 100%;"></div>
<div class="msg_cnt"></div>
<jsp:include page="./modal/modal.jsp"/>
<jsp:include page="./note/note.jsp"/>
<div id="header">
	<div id="mainTopLogo">
		<a href="/"><img src="/api/system/logo" id="mainTopLogoImg" /></a>
		<img src="/images/main/topEllipse.png" id="mainTopEllipseImg" />
		<%-- <img src="/images/main/topVector.png" id="mainTopVectorImg" /> --%>
	</div>
	<div class="mainTopMenu" id="mainTopMenu">
		<ul>
			<li><button type="button" data-keyword="business" onClick="bodyTopPageClick(this);">업무관리</button></li>
			<li><button type="button" data-keyword="gw" onClick="bodyTopPageClick(this);">전자결재</button></li>
			<!-- <li><button type="button" data-keyword="accounting" onClick="bodyTopPageClick(this);">회계관리</button></li> -->
			<li><button type="button" data-keyword="accounting" onClick="bodyTopPageClick(this);">회계관리</button></li>
			<!-- <li><button type="button" data-keyword="mis" onClick="bodyTopPageClick(this);">경영정보</button></li> -->
		</ul>
	</div>
	<div id="mainInfo">
		<a href="#" onclick="noteContentShow();" id="infoMessageImg">
			<img id="myInfoMessageImg" src="/images/main/icons/message.png">
		</a>
		<img id="myInfoImage" src="/api/my/image" >
		<a href="/mypage">
			<span><%= session.getAttribute("userName") %></span>&nbsp;
			<span><%= session.getAttribute("userRank") %></span>
		</a>
		<a href="/api/user/logout" onclick="return confirm('로그아웃 하시겠습니까??');">
			<img id="myInfoImageLogout" src="/images/main/icons/logout.png" >
		</a>
	</div>
</div>
<script src="/js/header.js"></script>

