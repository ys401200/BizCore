<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <!-- <div class="salesSearchContainer">
            <div class="salesSearchSelect">
                <select id="salesSearchCategory">
                    <option value="no">번호</option>
                    <option value="job">일정구분</option>
                    <option value="title">일정제목</option>
                    <option value="place">장소</option>
                    <option value="detail">일정설명</option>
                </select>
            </div>
            <div class="salesSearchText">
                <input type="text" id="salesSearchValue">
            </div>
            <div class="salesSearchBtn">
                <button type="button" onclick="salesSearchList();"><img src="/images/common/search.png" alt="search"/></button>
            </div>
        </div>
        <div class="detailContainer">
            <hr />
            <span class="detailMainSpan"></span>
            <div class="detailBtns"></div>
            <div class="detailContent"></div>
        </div> -->
        <div class="salesContainer">
            <hr />
            <span id="containerTitle">영업활동조회</span>
            <button type="button" class="listInsertBtn" onclick="salesInsertForm();">등록</button>
            <div class="detailBtns"></div>
            <div class="detailContents"></div>
            <div class="gridSalesList"></div>
            <div class="pageContainer"></div>
        </div>
<jsp:include page="../bottom.jsp"/>