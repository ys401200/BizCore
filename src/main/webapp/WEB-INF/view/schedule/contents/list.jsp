<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <hr />
    <span id="containerTitle"></span>
    <button type="button" class="listChangeBtn" data-type="table" onclick="listChange(this);"><i class="fa-regular fa-calendar-check fa-xl"></i></button>
    <select class="scheduleRange" id="scheduleRange" onchange="scheduleSelectChange();">
        <option value="company">회사별</option>
        <option value="dept">부서별</option>
        <option value="personal">개인별</option>
    </select>
    <jsp:include page="./calendar.jsp" />
    <a href="#" class="detailBackBtn">Back</a>
    <div class="gridList"></div>
    <div class="pageContainer"></div>
</div>