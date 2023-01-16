<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<hr />
<span>검색</span>
<div class="searchBtns">
    <button type="button" data-set="true" onclick="CommonDatas.searchAco(this);"><i class="fa-solid fa-minus fa-xl"></i></button>
    <!-- <button type="button" id="searchChangeBtn" data-set="false" onclick="searchChange(this)"><i class="fa-solid fa-list fa-xl"></i></button> -->
    <button type="button" id="multiSearchResetBtn" onclick="CommonDatas.searchReset();"><i class="fa-solid fa-trash-arrow-up fa-xl"></i></button>
    <button type="button" id="multiSearchBtn" onclick="const SearchSubmit = new NoticeSet(); SearchSubmit.searchSubmit();"><i class="fa-solid fa-magnifying-glass fa-xl"></i></button>
</div>