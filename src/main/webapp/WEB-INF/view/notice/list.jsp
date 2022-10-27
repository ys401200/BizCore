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
                    <input type="text" data-complete="user" autocomplete="off" id="searchWriter" onclick="addAutoComplete(this);" onkeyup="addAutoComplete(this);">
                </div>
                <div class="searchCreated">
                    <span>등록일</span>
                    <div class="searchGridItem">
                        <input type="date" id="searchCreatedFrom" max="9999-12-31" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="searchCreatedTo" max="9999-12-31" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
            </div>
        </div>
		<div class="noticeContainer">
			<hr />
			<span id="containerTitle">공지사항</span>
            <div class="crudBtns">
                <button type="button" onclick="noticeInsertForm();"><i class="fa-solid fa-pencil"></i></button>
            </div>
            <div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
            <div class="listRange">
                <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="listRangeChange(this, drawNoticeList);">
                <span class="listRangeSpan">0</span>
            </div>
			<div class="noticeContent"></div>
			<div class="gridNoticeList"></div>
			<div class="pageContainer"></div>
		</div>
	</div>
</div>
<jsp:include page="../bottom.jsp" />