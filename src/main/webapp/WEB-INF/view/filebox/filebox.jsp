<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	<jsp:include page="../header.jsp" />
	<div id="bodyContents">
		<div id="sideContents">
			<jsp:include page="../sideMenu.jsp" />
		</div>
		<div id="bodyContent">
			<div class="detailContainer">
				<hr />
				<span class="detailMainSpan"></span>
				<div class="detailBtns"></div>
				<div class="detailContent"></div>
			</div>
			<div class="fileBoxContainer">
				<hr />
				<span>자료실</span>
				<button type="button" onclick="fileBoxInsertForm();">등록</button>
				<div class="fileBoxContent"></div>
				<div class="gridFileBoxList"></div>
				<div class="pageContainer"></div>
			</div>
		</div>
	</div>
	<div class="msg_cnt"></div>
	<jsp:include page="../bottom.jsp" />