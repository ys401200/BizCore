<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <hr />
    <span id="containerTitle"></span>
    <button type="button" class="listChangeBtn" data-type="calendar" onclick="listChange(this);"><i class="fa-solid fa-list-ol fa-xl"></i></button>
    <select class="scheduleRange" id="scheduleRange" onchange="scheduleSelectChange();">
        <option value="company">회사별</option>
        <option value="dept">부서별</option>
        <option value="personal">개인별</option>
    </select>
    <jsp:include page="./list.jsp" />
    <div class="calendarList">
        <div class="calendarMoreContent">
            <div class="moreContentHeader">
                <div class="moreContentTitle">more</div>
                <div class="moreContentClose" onclick="moreContentClose();">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </div>
        <div class="calendarInfo">
            <button type="button" onclick="calendarPrev(this);"><img src="../images/common/privious-btn.png" alt="next"/></button>&nbsp;&nbsp;
            <div class="calendarYear"></div>
            <span class="calendarSpan">년</span>&nbsp;&nbsp;
            <div class="calendarMonth"></div>
            <span class="calendarSpan">월</span>&nbsp;&nbsp;
            <button type="button" onclick="calendarNext(this);"><img src="../images/common/next-btn.png" alt="next"/></button>
        </div>
        <div class="calendar_container"></div>
    </div>
</div>