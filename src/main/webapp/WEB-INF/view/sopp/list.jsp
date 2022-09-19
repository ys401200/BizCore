<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="searchContainer"></div>
        <div class="soppContainer">
            <hr />
            <span id="containerTitle">영업기회조회</span>
            <button type="button" class="listInsertBtn" onclick="soppInsertForm();">등록</button>
            <div class="detailBtns"></div>
            <div class="detailContents"></div>
            <div class="gridSoppList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>