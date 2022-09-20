<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="container">
					<hr />
					<span>결재 대기 문서</span>
					<div class="waitDiv"></div>
				</div>
				<div class="container">
					<hr />
					<span>결재 예정 문서</span>
					<div class="dueDiv"></div>
					<div class="pageContainer"></div>
				</div>
				<div class="container">
					<hr />
					<span>결재 수신 문서</span>
					<div class="receiveDiv"></div>
					<div class="pageContainer"></div>
				</div>
				<div class="container">
					<hr />
					<span>참조/열람 대기 문서</span>
					<div class="referDiv"></div>
					<div class="pageContainer"></div>
				</div>
			</div>




		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />