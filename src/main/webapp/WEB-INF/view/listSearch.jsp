<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<hr />
<span>검색</span>
<div class="searchBtns">
    <button type="button" data-set="false" onclick="searchAco(this);"><i class="fa-solid fa-plus fa-xl"></i></button>
    <button type="button" id="searchChangeBtn" data-set="false" onclick="searchChange(this)"><i class="fa-solid fa-list fa-xl"></i></button>
    <button type="button" id="multiSearchResetBtn" onclick="searchReset();"><i class="fa-solid fa-trash-arrow-up fa-xl"></i></button>
    <button type="button" id="multiSearchBtn" onclick="searchSubmit();"><i class="fa-solid fa-magnifying-glass fa-xl"></i></button>
</div>
<div class="searchInputContent">
    <input type="text" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
</div>