<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="techSearchContainer">
            <div class="techSearchSelect">
                <select id="techSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">영업활동명</option>
                </select>
            </div>
            <div class="techSearchText">
                <input type="text" id="techSearchValue">
            </div>
            <div class="techSearchBtn">
                <button type="button" onclick="techSearchList();">검색</button>
            </div>
        </div>
        <div class="detailContainer">
            <hr />
            <span class="detailMainSpan"></span>
            <div class="detailBtns"></div>
            <div class="detailContent"></div>
        </div>
        <div class="scheduleContainer">
            <hr />
            <span>기술지원조회</span>
            <button type="button" class="scheduleInsertBtn" onclick="scheduleInsertForm();">등록</button>
            <div class="gridScheduleList"></div>
            <div class="pageContainer"></div>
        </div>
<jsp:include page="../bottom.jsp"/>