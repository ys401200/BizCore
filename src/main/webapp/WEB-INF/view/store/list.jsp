<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="storeContainer">
			<div class="contentHeaders">
				<hr />
				<span id="containerTitle">재고 조회</span>
				<div class="listRange">
					<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.storeSet.drawSalesList);">
					<span class="listRangeSpan">0</span>
				</div>
				<div class="listSearchInput">
					<input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.storeSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
				</div>
				<div class="crudBtns">
					<button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.storeSet.storeInsertForm();">등록</button>
					<button type="button" class="crudUpdateBtn">수정</button>
					<button type="button" class="crudDeleteBtn">삭제</button>
					<a href="#" onclick="CommonDatas.hideDetailView(CommonDatas.Temps.storeSet.drawStoreList);" class="detailBackBtn">Back</a>
				</div>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>