<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div id="loadingDiv"></div>
		<jsp:include page="./contents/list.jsp" />
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>