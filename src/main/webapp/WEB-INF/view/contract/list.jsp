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
                <div class="searchEmployee">
                    <span>담당자</span>
                    <input type="text" data-type="user" id="searchEmployee">
                </div>
                <div class="searchCustomer">
                    <span>거래처</span>
                    <input type="text" data-type="customer" id="searchCustomer">
                </div>
                <div class="searchEndUser">
                    <span>엔드유저</span>
                    <input type="text" data-type="customer" id="searchEndUser">
                </div>
                <div class="searchTitle">
                    <span>계약명</span>
                    <input type="text" data-type="contract" id="searchTitle">
                </div>
                <div class="searchSalesType">
                    <span>판매방식</span>
                    <select id="searchSalesType">
                        <option value="">선택</option>
                        <option value="조달직판">조달직판</option>
                        <option value="조달간판">조달간판</option>
                        <option value="조달대행">조달대행</option>
                        <option value="직접판매">직접판매</option>
                        <option value="간접판매">간접판매</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div class="searchContractType">
                    <span>계약방식</span>
                    <select id="searchContractType">
                        <option value="">선택</option>
                        <option value="판매계약">판매계약</option>
                        <option value="유지보수">유지보수</option>
                        <option value="임대계약">임대계약</option>
                    </select>
                </div>
                <div class="searchStartOfFreeMaintenance">
                    <span>무상유지보수(시작일)</span>
                    <div class="searchGridItem">
                        <input type="date" id="startOfFreeMaintenanceFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="startOfFreeMaintenanceTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
                <div class="searchStartOfPaidMaintenance">
                    <span>유상유지보수(시작일)</span>
                    <div class="searchGridItem">
                        <input type="date" id="startOfPaidMaintenanceFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="startOfPaidMaintenanceTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
                <div class="searchSaleDate">
                    <span>발주일</span>
                    <div class="searchGridItem">
                        <input type="date" id="saleDateFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="saleDateTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
            </div>
        </div>
        <div class="contractContainer">
            <hr />
            <span id="containerTitle"></span>
            <div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
            <a href="/business/contract" class="detailBackBtn">Back</a>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
        <div class="detailSecondTabs"></div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>