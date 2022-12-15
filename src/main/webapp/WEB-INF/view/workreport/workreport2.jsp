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
            <div class="workReportTitle">주간 업무보고</div>
            <div class="workReportContent">
				<div class="dept-tree"></div>
				<div class="month-list"></div>
				<div class="report-container">
					<div>주간 업무 보고</div>
					<div><div>'22.12.12 ~ '22.12.19</div><div>홍길동</div></div>
					<div><div>지난 주 진행상황</div><div>이번 주 예정상황</div></div>
					<div><div></div><div></div></div>
					<div><div></div><div></div></div>
				</div>
			</div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>