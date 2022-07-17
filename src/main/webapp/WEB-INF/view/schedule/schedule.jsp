<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div id="loadingDiv"></div>
		<c:if test="${getPathName eq 'businessSchedule'}">
			<jsp:include page="./contents/list.jsp" />
		</c:if>
		<c:if test="${getPathName eq 'businessCalendar'}">
			<jsp:include page="./contents/calendar.jsp" />
		</c:if>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>