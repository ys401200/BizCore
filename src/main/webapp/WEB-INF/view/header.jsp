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

<script src="/js/jquery.min.js"></script>
<script src="/js/jquery-ui.js"></script>
<script src="/js/jquery.easing.js"></script>
<script src="/js/loading.js"></script>
<script src="/js/<%= getPathName %>/<%= getPathName %>.js"></script>

<title>BizCore</title>
</head>
<body>
<div id="loadingDiv" style="width: 100%; height: 100%;"></div>
<jsp:include page="./modal/modal.jsp"/>
<div id="header">
	<input type="hidden" id="pathName" value="${getPathName}" />
	<div id="mainTopLogo">
		<a href="/"><img src="/images/main/topLogo.png" id="mainTopLogoImg" /></a>
		<img src="/images/main/topEllipse.png" id="mainTopEllipseImg" />
		<img src="/images/main/topVector.png" id="mainTopVectorImg" />
	</div>
	<div id="mainTopMenu">
		<ul>
			<li><button type="button" data-keyword="business" onClick="bodyTopPageClick(this);">업무관리</button></li>
			<li><button type="button" data-keyword="gw" onClick="bodyTopPageClick(this);">그룹웨어</button></li>
			<li><button type="button" data-keyword="accounting" onClick="bodyTopPageClick(this);">회계관리</button></li>
			<li><button type="button" data-keyword="mis" onClick="bodyTopPageClick(this);">경영정보</button></li>
		</ul>
	</div>
</div>
<script src="/js/header.js"></script>

