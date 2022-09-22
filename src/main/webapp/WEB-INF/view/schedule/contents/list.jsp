<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <hr />
    <span id="containerTitle">일정조회</span>
    <button type="button" class="listInsertBtn" class="scheduleInsertBtn" onclick="scheduleInsertForm();">등록</button>
    <button type="button" class="listChangeBtn" data-type="table" onclick="listChange(this);">달력으로 표시</button>
    <select class="scheduleRange" id="scheduleRange" onchange="scheduleSelectChange();">
        <option value="company">회사별</option>
        <option value="dept">부서별</option>
        <option value="personal">개인별</option>
    </select>
    <jsp:include page="./calendar.jsp" />
    <div class="detailBtns"></div>
    <div class="detailContents"></div>
    <div class="gridScheduleList"></div>
    <div class="pageContainer"></div>
</div>