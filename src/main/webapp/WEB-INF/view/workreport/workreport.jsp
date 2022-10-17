<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="workReportContainer">
            <hr />
            <span>개인업무일지</span>
			<button type="button" id="reportInsertBtn">업무일지등록</button>
            <div class="workReportContent"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>