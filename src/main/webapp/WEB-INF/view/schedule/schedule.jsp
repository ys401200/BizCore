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
					<input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchCustomer">
					<span>영업기회</span>
					<input type="text" data-complete="sopp" data-key="soppNo" autocomplete="off" id="searchSopp" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchCustomer">
					<span>매출처</span>
					<input type="text" data-complete="customer" data-key="custNo" autocomplete="off" id="searchCust" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
				<div class="searchType">
					<span>활동형태</span>
					<select id="searchType" data-key="type">
						<option value="">선택</option>
						<option data-value="10170" value="회사방문">회사방문</option>
						<option data-value="10171" value="기술지원">기술지원</option>
						<option data-value="10187" value="전화상담">전화상담</option>
						<option data-value="10208" value="현장방문">현장방문</option>
						<option data-value="10209" value="원격지원">원격지원</option>
						<option data-value="10221" value="제품설명">제품설명</option>
						<option data-value="10222" value="시스템데모">시스템데모</option>
						<option data-value="10223" value="제품견적">제품견적</option>
						<option data-value="10224" value="계약전 의사결정지원">계약전 의사결정지원</option>
						<option data-value="10225" value="계약">계약</option>
						<option data-value="10226" value="사후처리">사후처리</option>
						<option data-value="10227" value="기타">기타</option>
						<option data-value="10228" value="협력사요청">협력사요청</option>
						<option data-value="10229" value="협력사문의">협력사문의</option>
						<option data-value="10230" value="교육">교육</option>
						<option data-value="10231" value="전화상담">전화상담</option>
						<option data-value="10232" value="제조사업무협의">제조사업무협의</option>
						<option data-value="10233" value="외부출장">외부출장</option>
						<option data-value="10234" value="제안설명회">제안설명회</option>
					</select>
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
        <div class="salesContainer">
			<div class="contentHeaders">
				<hr />
				<span id="containerTitle">일정조회</span>
				<div class="listRange">
					<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.salesSet.drawSalesList);">
					<span class="listRangeSpan">0</span>
				</div>
				<div class="listSearchInput">
					<input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.salesSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
				</div>
				<div class="crudBtns">
					<button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.scheduleSet.scheduleInsertForm();">등록</button>
					<button type="button" class="crudUpdateBtn">수정</button>
					<button type="button" class="crudDeleteBtn">삭제</button>
					<a href="#" onclick="CommonDatas.hideDetailView(CommonDatas.Temps.scheduleSet.drawScheduleList);" class="detailBackBtn">Back</a>
				</div>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>