<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="contractContainer">
					<hr />
					<span id="containerTitle">계약</span>
					<div class="crudBtns"><button onclick="contractInsertForm()">등록</button></div>
					<div class="contract-list"></div>
					<div class="pageContainer"></div>
				</div>

			</div>
		</div>
		<jsp:include page="../bottom.jsp" />