<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="scheduleContainer">
    <div class="contentHeaders">
        <hr />
        <span id="containerTitle">일정조회</span>
        <div class="listRange">
            <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, drawSoppList);">
            <span class="listRangeSpan">0</span>
        </div>
        <div class="listSearchInput">
            <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
        </div>
        <div class="crudBtns">
            <button type="button" class="contractReqBtn" onclick="popup(this);">계약요청</button>
            <button type="button" class="crudAddBtn" onclick="soppInsertForm();">등록</button>
            <button type="button" class="crudUpdateBtn">수정</button>
            <button type="button" class="crudDeleteBtn" onclick="soppDelete();">삭제</button>
            <a href="#" onclick="CommonDatas.hideDetailView(drawSoppList);" class="detailBackBtn">Back</a>
        </div>
        <button type="button" class="listChangeBtn" data-type="calendar" onclick="listChange(this);"><i class="fa-solid fa-list-ol fa-xl"></i></button>
        <select class="scheduleRange" id="scheduleRange" onchange="scheduleSelectChange();">
            <option value="company">회사별</option>
            <option value="dept">부서별</option>
            <option value="employee">개인별</option>
        </select>
    </div>
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