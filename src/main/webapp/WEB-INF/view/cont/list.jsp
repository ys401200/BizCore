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
                <div class="searchCust">
                    <span>매출처</span>
                    <input type="text" data-complete="customer" data-key="custNo" autocomplete="off" id="searchCust" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchBuyr">
                    <span>엔드유저</span>
                    <input type="text" data-complete="customer" data-key="buyrNo" autocomplete="off" id="searchBuyr" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchTitle">
                    <span>계약명</span>
                    <input type="text" data-complete="contract" data-key="contTitle" autocomplete="off" id="searchTitle" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchCategories">
                    <span>카테고리(제품회사명)</span>
                    <input type="text" data-complete="categories" data-key="categories" data-type="search" autocomplete="off" id="searchCategories" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchCntrctMth">
                    <span>계약방식</span>
                    <select id="searchCntrctMth" data-key="cntrctMth">
                        <option value="">선택</option>
                        <option value="판매계약">판매계약</option>
                        <option value="유지보수">유지보수</option>
                    </select>
                </div>
                <div class="searchUser">
                    <span>담당자</span>
                    <input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchContType">
                    <span>판매방식</span>
                    <select id="searchContType" data-key="contType">
                        <option value="">선택</option>
                        <option value="조달직판">조달직판</option>
                        <option value="조달간판">조달간판</option>
                        <option value="조달대행">조달대행</option>
                        <option value="직접판매">직접판매</option>
                        <option value="간접판매">간접판매</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div class="searchMaintenanceTarget">
                    <span>유지보수대상</span>
                    <select id="searchMaintenanceTarget" data-key="maintenanceTarget">
                        <option value="">선택</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
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
        <div class="contContainer">
            <div class="contentHeaders">
                <hr />
                <span id="containerTitle">계약조회</span>
                <div class="listRange">
                    <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.contSet.drawContList);">
                    <span class="listRangeSpan">0</span>
                </div>
                <div class="listSearchInput">
                    <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="CommonDatas.Temps.contSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
                </div>
                <div class="crudBtns">
                    <!-- <button type="button" class="contractReqBtn" onclick="popup(this);">계약요청</button> -->
                    <button type="button" class="crudAddBtn" onclick="CommonDatas.Temps.contSet.contInsertForm();">등록</button>
                    <button type="button" class="crudUpdateBtn">수정</button>
                    <button type="button" class="crudDeleteBtn">삭제</button>
                    <a href="#" onclick="CommonDatas.hideDetailView(CommonDatas.Temps.contSet.drawContList);" class="detailBackBtn">Back</a>
                </div>
            </div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
            <div class="addPdfForm">
				<jsp:include page="../business/form.jsp" />
			</div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>