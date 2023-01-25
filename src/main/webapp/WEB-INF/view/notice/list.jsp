<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="../header.jsp" />
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="searchContainer">
            <jsp:include page="../listSearch.jsp" />
            <div class="searchMultiContent">
                <div class="searchTitle">
                    <span>제목</span>
                    <input type="text" autocomplete="off" id="searchTitle">
                </div>
                <div class="searchWriter">
                    <span>담당자</span>
                    <input type="text" data-complete="user" autocomplete="off" id="searchWriter" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchCreated">
                    <span>등록일</span>
                    <div class="searchGridItem">
                        <input type="date" id="searchCreatedFrom" max="9999-12-31" data-date-type="from" onchange="CommonDatas.searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="searchCreatedTo" max="9999-12-31" data-date-type="to" onchange="CommonDatas.searchDateDefaultSet(this);">
                    </div>
                </div>
            </div>
        </div>
		<div class="noticeContainer">
			<hr />
			<span id="containerTitle">공지사항</span>
            <div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="const SearchInputKeyup = new NoticeSet(); SearchInputKeyup.searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
            <div class="crudBtns">
                <button type="button" class="crudAddBtn" onclick="const InsertForm = new NoticeSet(); InsertForm.noticeInsertForm();">등록</button>
            </div>
            <div class="listRange">
                <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="const RangeChange = new NoticeSet(); CommonDatas.listRangeChange(this, RangeChange.drawNoticeList);">
                <span class="listRangeSpan">0</span>
            </div>
			<div class="noticeContent"></div>
			<div class="gridNoticeList"></div>
			<div class="pageContainer"></div>
		</div>
	</div>
</div>
<jsp:include page="../bottom.jsp" />