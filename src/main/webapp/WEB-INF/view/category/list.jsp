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
                <div class="searchTitle">
                    <span>카테고리명</span>
                    <input type="text" autocomplete="off" data-key="custCategoryName" id="searchTitle">
                </div>
                <div class="searchUser">
                    <span>담당자</span>
                    <input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchDate">
					<span>등록일</span>
					<div class="searchGridItem">
						<input type="date" id="searchDateFrom" max="9999-12-31" data-date-type="from" onchange="CommonDatas.searchDateDefaultSet(this);">
						<span>~</span>
						<input type="date" id="searchDateTo" max="9999-12-31" data-date-type="to" onchange="CommonDatas.searchDateDefaultSet(this);">
					</div>
				</div>
            </div>
        </div>
        <div class="categoryContainer">
			<div class="contentHeaders">
				<span id="containerTitle">카테고리</span>
				<div class="listRange">
					<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.categorySet.drawCategoryList);">
					<span class="listRangeSpan">0</span>
				</div>
				<div class="listSearchInput">
					<input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.categorySet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
				</div>
				<div class="crudBtns">
					<button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.categorySet.categoryInsertForm();">등록</button>
				</div>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>