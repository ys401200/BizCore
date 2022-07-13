<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:include page="./header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="./sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div id="loadingDiv"></div>
		<!-- <jsp:include page="./main/contentWork.jsp" /> -->
	</div>
</div>
<div class="msg_cnt"></div>
<div class="modal_panel">
	<div class="modal_wrap">
		<div class="modal_title"></div>
		<div class="modal_close"></div>
		<div class="modal_content"></div>
	</div>
</div>
<jsp:include page="./bottom.jsp"/>