<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="/css/bodyTop.css" />
<script src="/js/jquery.min.js"></script>
<script src="/js/jquery-ui.js"></script>
<title>헤더</title>
</head>
<body>
<div id="header">
	<div id="mainTopLogo">
		<a href=""><img src="/images/main/topLogo.png" id="mainTopLogoImg" /></a>
		<img src="/images/main/topEllipse.png" id="mainTopEllipseImg" />
		<img src="/images/main/topVector.png" id="mainTopVectorImg" />
	</div>
	<div id="mainTopMenu">
		<ul>
			<li><button type="button" data-keyword="work" onClick="bodyTopPageClick(this);">업무관리</button></li>
			<li><button type="button" data-keyword="group" onClick="bodyTopPageClick(this);">그룹웨어</button></li>
			<li><button type="button" data-keyword="acc" onClick="bodyTopPageClick(this);">회계관리</button></li>
			<li><button type="button" data-keyword="manage" onClick="bodyTopPageClick(this);">경영정보</button></li>
		</ul>
	</div>
</div>
</body>
<script src="/js/header.js"></script>
</html>