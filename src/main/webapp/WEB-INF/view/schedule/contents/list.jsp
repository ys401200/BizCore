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
        <button type="button" onclick="scheduleSearchList();"><img src="../images/common/search.png" alt="search"/></button>
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
    <span>일정조회</span>
    <button type="button" class="scheduleInsertBtn" onclick="scheduleInsertForm();">등록</button>
    <button type="button" class="listChangeBtn" data-type="table" onclick="listChange(this);">달력으로 표시</button>
    <select class="scheduleRange" id="scheduleRange" onchange="scheduleSelectChange();">
        <option value="company">회사별</option>
        <option value="dept">부서별</option>
        <option value="personal">개인별</option>
    </select>
    <!-- <select class="scheduleType" id="scheduleType" onchange="scheduleSelectChange();">
        <option value="all">전체</option>
        <option value="sales">영업활동</option>
        <option value="tech">기술지원</option>
        <option value="etc">기타</option>
    </select> -->
    <jsp:include page="./calendar.jsp" />
    <div class="gridScheduleList"></div>
    <div class="pageContainer"></div>
</div>