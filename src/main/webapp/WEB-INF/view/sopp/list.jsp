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
                <div class="searchTitle">
                    <span>영업기회명</span>
                    <input type="text" data-type="sopp" id="searchTitle">
                </div>
                <div class="searchSoppType">
                    <span>판매방식</span>
                    <select id="searchSoppType">
                        <option value="">선택</option>
                        <option value="조달직판">조달직판</option>
                        <option value="조달간판">조달간판</option>
                        <option value="조달대행">조달대행</option>
                        <option value="직접판매">직접판매</option>
                        <option value="간접판매">간접판매</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div class="searchContType">
                    <span>계약구분</span>
                    <select id="searchContType">
                        <option value="">선택</option>
                        <option value="판매계약">판매계약</option>
                        <option value="유지보수">유지보수</option>
                        <option value="임대계약">임대계약</option>
                    </select>
                </div>
                <div class="searchStatus">
                    <span>진행단계</span>
                    <select id="searchStatus">
                        <option value="">선택</option>
                        <option value="영업정보파악">영업정보파악</option>
                        <option value="초기접촉">초기접촉</option>
                        <option value="제안서제출및PT">제안서제출및PT</option>
                        <option value="견적서제출">견적서제출</option>
                    </select>
                </div>
                <div class="searchCreated">
                    <span>등록일</span>
                    <div class="searchGridItem">
                        <input type="date" id="searchCreatedFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="searchCreatedTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
            </div>
        </div>
        <div class="soppContainer">
            <hr />
            <span id="containerTitle"></span>
            <a href="#" class="detailBackBtn">Back</a>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>