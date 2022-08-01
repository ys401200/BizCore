<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="contSearchContainer">
            <div class="contSearchSelect">
                <select id="contSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">영업기회명</option>
                </select>
            </div>
            <div class="contSearchText">
                <input type="text" id="contSearchValue">
            </div>
            <div class="contSearchBtn">
                <button type="button" onclick="contSearchList();">검색</button>
            </div>
        </div>
        <div class="contContainer">
            <hr />
            <span>계약조회</span>
            <div class="gridContList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>