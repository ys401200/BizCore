<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="searchContainer">
            <jsp:include page="../listSearch.jsp" />
            <div class="searchMultiContent">
                <div class="searchUser">
                    <span>담당자</span>
                    <input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
            </div>
        </div>
        <div class="userContainer">
            <div class="contentHeaders">
                <hr />
                <span id="containerTitle">사용자 조회</span>
                <div class="listRange">
                    <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.userSet.drawUserList);">
                    <span class="listRangeSpan">0</span>
                </div>
                <div class="listSearchInput">
                    <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.userSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
                </div>
                <div class="crudBtns">
                    <!-- <button type="button" class="contractReqBtn" onclick="popup(this);">계약요청</button> -->
                    <button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.userSet.userInsertForm();">등록</button>
                    <button type="button" class="crudResetBtn" onclick="CommonDatas.Temps.user.userPasswordReset();">암호초기화</button>
                    <button type="button" class="crudUpdateBtn">수정</button>
                    <button type="button" class="crudDeleteBtn">삭제</button>
                    <a href="#" onclick="CommonDatas.hideDetailView(CommonDatas.Temps.userSet.drawUserList);" class="detailBackBtn">Back</a>
                </div>
            </div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>