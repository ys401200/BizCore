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
				
				<div class="subContainer">
					<div class="listPageDiv">
						<div class="listDiv"></div>
						<div class="pageContainer"></div>
					</div>
					<div class="tableFormDiv">
						<div class="forButtons"></div>
						<div class="forTable"> 결재선 , 열람, 참조 정보 </div>
						<div class="forForm">상세 양식 조회 </div>
					</div>
				</div>
			</div>
		</div>

	</div>
	<div class="msg_cnt"></div>
	<jsp:include page="../bottom.jsp" />