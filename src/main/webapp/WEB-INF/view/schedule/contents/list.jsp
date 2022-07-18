<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <hr />
	<span>일정조회</span>
    <button type="button" class="listChangeBtn" data-type="table" onclick="listChange(this);">달력으로 표시</button>
    <div class="calendarList">
        <jsp:include page="./calendar.jsp" />
    </div>
    <div class="gridScheduleList"></div>
    <div class="pageContainer"></div>
</div>