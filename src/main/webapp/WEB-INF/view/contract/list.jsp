<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <!-- <div class="contractSearchContainer">
            <div class="contractSearchSelect">
                <select id="contractSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">계약명</option>
                </select>
            </div>
            <div class="contractSearchText">
                <input type="text" id="contractSearchValue">
            </div>
            <div class="contractSearchBtn">
                <button type="button" onclick="contractSearchList();"><img src="../images/common/search.png" alt="search"/></button>
            </div>
        </div>
        <div class="detailContainer">
            <hr />
            <span class="detailMainSpan"></span>
            <div class="detailBtns"></div>
            <div class="detailContent"></div>
        </div> -->
        <div class="contractContainer">
            <hr />
            <span id="containerTitle">계약조회</span>
            <button type="button" class="listInsertBtn" onclick="contractInsertForm();">등록</button>
            <div class="detailBtns"></div>
            <div class="detailContents"></div>
            <div class="gridContractList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>