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
					<span>요청명</span>
					<input type="text" data-key="title" id="searchTitle">
				</div>
				<div class="searchWriter">
					<span>담당자</span>
					<input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchCustomer">
					<span>거래처</span>
					<input type="text" data-complete="customer" data-key="custNo" autocomplete="off" id="searchCust" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchCnt">
					<span>등록구분</span>
					<select id="searchCnt" data-key="cntrctMth">
						<option value="">선택</option>
						<option value="10247">신규영업지원</option>
						<option value="10248">유지보수</option>
					</select>
				</div>
				<div class="searchSteps">
					<span>진행단계</span>
					<select id="searchSteps" data-key="techdSteps">
						<option value="">선택</option>
						<option value="10213">접수단계</option>
						<option value="10214">출동단계</option>
						<option value="10215">미계약에 따른 보류</option>
						<option value="10253">처리완료</option>
					</select>
				</div>
				<div class="searchDate">
					<span>일정시작일</span>
					<div class="searchGridItem">
						<input type="date" id="searchDateFrom" max="9999-12-31" data-date-type="from" onchange="CommonDatas.searchDateDefaultSet(this);">
						<span>~</span>
						<input type="date" id="searchDateTo" max="9999-12-31" data-date-type="to" onchange="CommonDatas.searchDateDefaultSet(this);">
					</div>
				</div>
			</div>
		</div>
        <div class="techContainer">
			<div class="contentHeaders">
				<hr />
				<span id="containerTitle">기술지원조회</span>
				<div class="listRange">
					<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.techSet.drawTechList);">
					<span class="listRangeSpan">0</span>
				</div>
				<div class="listSearchInput">
					<input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.techSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
				</div>
				<div class="crudBtns">
					<button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.techSet.techInsertForm();">등록</button>
					<button type="button" class="crudUpdateBtn">수정</button>
					<button type="button" class="crudDeleteBtn">삭제</button>
					<a href="#" onclick="CommonDatas.hideDetailView(CommonDatas.Temps.techSet.drawTechList);" class="detailBackBtn" style="display:none;">Back</a>
				</div>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
<jsp:include page="../bottom.jsp"/>