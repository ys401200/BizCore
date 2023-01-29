<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="gridList">
    <div class="listSearchInput" style="display:none;">
        <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
    </div>
    <div class="listRange">
        <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, drawScheduleList);">
        <span class="listRangeSpan">0</span>
    </div>
    <div class="crudBtns">
        <button type="button" class="crudAddBtn" onclick="scheduleInsertForm();">등록</button>
        <button type="button" class="crudUpdateBtn">수정</button>
        <button type="button" class="crudDeleteBtn" onclick="scheduleDelete();">삭제</button>
        <a href="#" onclick="hideDetailView(drawScheduleList);" class="detailBackBtn">Back</a>
    </div>

    <div class="pageContainer"></div>
</div>