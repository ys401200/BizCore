<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="calendarList">
    <div class="calendarInfo">
        <button type="button" onclick="calendarPrev(this);">&laquo;</button>&nbsp;&nbsp;
        <div class="calendarYear">2022</div>
        <span class="calendarSpan">년</span>&nbsp;&nbsp;
        <div class="calendarMonth">7</div>
        <span class="calendarSpan">월</span>&nbsp;&nbsp;
        <button type="button" onclick="calendarNext(this);">&raquo;</button>
    </div>
    <table>
        <thead>
            <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>