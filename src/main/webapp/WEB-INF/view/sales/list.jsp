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
				<div class="searchWriter">
					<span>담당자</span>
					<input type="text" data-complete="user" autocomplete="off" id="searchWriter" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchCustomer">
					<span>거래처</span>
					<input type="text" data-complete="customer" autocomplete="off" id="searchCustomer" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchType">
					<span>활동형태</span>
					<select id="searchType">
						<option value="">선택</option>
						<option value="회사방문">회사방문</option>
						<option value="기술지원">기술지원</option>
						<option value="전화상담">전화상담</option>
						<option value="현장방문">현장방문</option>
						<option value="원격지원">원격지원</option>
						<option value="제품설명">제품설명</option>
						<option value="시스템데모">시스템데모</option>
						<option value="제품견적">제품견적</option>
						<option value="계약전 의사결정지원">계약전 의사결정지원</option>
						<option value="계약">계약</option>
						<option value="사후처리">사후처리</option>
						<option value="협력사요청">협력사요청</option>
						<option value="협력사문의">협력사문의</option>
						<option value="교육">교육</option>
						<option value="전화상담">전화상담</option>
						<option value="제조사업무협의">제조사업무협의</option>
						<option value="외부출장">외부출장</option>
						<option value="제안설명회">제안설명회</option>
						<option value="기타">기타</option>
					</select>
				</div>
				<div class="searchDate">
					<span>일정시작일</span>
					<div class="searchGridItem">
						<input type="date" id="searchDateFrom" max="9999-12-31" data-date-type="from" onchange="CommonDatas.searchDateDefaultSet(this);">
						<span>~</span>
						<input type="date" id="searchDateTo" max="9999-12-31" data-date-type="to" onchange="searchDateDefaultSet(this);">
					</div>
				</div>
			</div>
		</div>
        <div class="salesContainer">
			<div class="contentHeaders">
				<hr />
				<span id="containerTitle">영업활동조회</span>
				<div class="listSearchInput">
					<input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
				</div>
				<div class="listRange">
					<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="listRangeChange(this, drawSalesList);">
					<span class="listRangeSpan">0</span>
				</div>
				<div class="crudBtns">
					<button type="button" class="crudAddBtn" onclick="salesInsertForm();">등록</button>
					<button type="button" class="crudUpdateBtn">수정</button>
					<button type="button" class="crudDeleteBtn" onclick="salesDelete();">삭제</button>
					<a href="#" onclick="hideDetailView(drawSalesList);" class="detailBackBtn">Back</a>
				</div>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>