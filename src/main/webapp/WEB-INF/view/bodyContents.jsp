<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="/css/bodyContents.css">

<script src="/js/bodyContent.js"></script>

<title>메인</title>
</head>
<body>
<jsp:include page="./header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="./sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<jsp:include page="./main/contentWork.jsp" />
	</div>
</div>
</body>
</html>