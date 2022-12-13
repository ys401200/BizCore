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
            <div class="workReportTitle">개인업무일지</div>
            <div class="workReportContent">
				<div class="month-list"></div>
				<div class="dept-tree"></div>
				<div class="report-container"></div>
			</div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>