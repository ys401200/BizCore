<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <hr />
    <span id="containerTitle">일정조회</span>
    <div class="listSearchInput">
        <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.schedule2Set.searchInputKeyup();" placeholder="단어를 입력해주세요.">
    </div>
    <div class="listRange">
        <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.schedule2Set.drawFlexScheduleList);">
        <span class="listRangeSpan">0</span>
    </div>
    <select class="scheduleRange" id="scheduleRange" onchange="CommonDatas.Temps.schedule2Set.scheduleSelectChange();">
        <option value="company">회사별</option>
        <option value="dept">부서별</option>
        <option value="employee">개인별</option>
    </select>
    <div class="listFlexContainer">
        <div class="calendarList">
            <div class="calendarMoreContent">
                <div class="moreContentHeader">
                    <div class="moreContentTitle"></div>
                    <div class="moreContentClose" onclick="CommonDatas.Temps.schedule2Set.moreContentClose();">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
            <div class="infoFlexContainer">
                <div>
                    <!-- <div class="calendarInfoRadio">
                        <input type="radio" name="infoRadio" id="infoRadioYear">
                        <label for="infoRadioYear">연</label>
                        <input type="radio" name="infoRadio" id="infoRadioMonth">
                        <label for="infoRadioMonth">월</label>
                        <input type="radio" name="infoRadio" id="infoRadioDay">
                        <label for="infoRadioDay">일</label>
                    </div> -->
                    <div class="calendarInfoButton">
                        <button type="button" data-type="calendar" data-flag="false" onclick="CommonDatas.Temps.schedule2Set.scheduleDisplaySet(this);">달력 확대&nbsp;<i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="calendarInfo">
                        <button type="button" onclick="CommonDatas.Temps.schedule2Set.calendarPrev(this);">&lt;</button>&nbsp;&nbsp;
                        <div class="calendarYear"></div>
                        <span class="calendarSpan">년</span>&nbsp;&nbsp;
                        <div class="calendarMonth"></div>
                        <span class="calendarSpan">월</span>&nbsp;&nbsp;
                        <button type="button" onclick="CommonDatas.Temps.schedule2Set.calendarNext(this);">&gt;</button>
                    </div>
                </div>
                <div></div>
            </div>
            <div class="calendar_container"></div>
        </div>
        <jsp:include page="./list.jsp" />
    </div>
</div>