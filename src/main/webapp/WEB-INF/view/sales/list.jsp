<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="salesSearchContainer">
            <div class="salesSearchSelect">
                <select id="salesSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">영업활동명</option>
                </select>
            </div>
            <div class="salesSearchText">
                <input type="text" id="salesSearchValue">
            </div>
            <div class="salesSearchBtn">
                <button type="button" onclick="salesSearchList();">검색</button>
            </div>
        </div>
        <div class="salesContainer">
            <hr />
            <span>영업활동조회</span>
            <div class="gridSalesList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>