<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<jsp:include page="../header.jsp" />
	<div id="bodyContents">
		<div id="sideContents">
			<jsp:include page="../sideMenu.jsp" />
		</div>
		<div id="bodyContent">
			<div class="mylistContainer">
				<hr />
				<span>나의 문서함</span>
				<div class="mylistdiv"></div>
				
			</div>
		</div>

	</div>
	<div class="msg_cnt"></div>
	<jsp:include page="../bottom.jsp" />