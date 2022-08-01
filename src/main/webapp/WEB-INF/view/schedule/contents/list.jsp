<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleSearchContainer">
    <div class="scheduleSearchSelect">
        <select id="scheduleSearchCategory">
            <option value="no">번호</option>
            <option value="job">일정구분</option>
            <option value="title">일정제목</option>
            <option value="place">장소</option>
            <option value="detail">일정설명</option>
        </select>
    </div>
    <div class="scheduleSearchText">
        <input type="text" id="scheduleSearchValue">
    </div>
    <div class="scheduleSearchBtn">
        <button type="button" onclick="scheduleSearchList();">검색</button>
    </div>
</div>
<div class="scheduleContainer">
    <hr />
    <span>일정조회</span>
    <button type="button" class="scheduleInsertBtn" onclick="scheduleInsertForm();">등록</button>
    <button type="button" class="listChangeBtn" data-type="table" onclick="listChange(this);">달력으로 표시</button>
    <jsp:include page="./calendar.jsp" />
    <div class="gridScheduleList"></div>
    <div class="pageContainer"></div>
</div>