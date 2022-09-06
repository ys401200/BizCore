<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="calendarList">
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