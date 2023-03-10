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
                <div class="searchVendor">
                    <span>공급사</span>
                    <input type="text" data-complete="customer" autocomplete="off" id="searchVendor" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
                </div>
                <div class="searchCategoryName">
                    <span>제품그룹</span>
                    <input type="text" autocomplete="off" id="searchCategoryName">
                </div>
                <div class="searchName">
                    <span>상품명</span>
                    <input type="text" autocomplete="off" id="searchName">
                </div>
            </div>
        </div>
        <div class="productContainer">
            <hr />
            <span id="containerTitle">상품조회</span>
            <div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
            <div class="listRange">
                <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="CommonDatas.listRangeChange(this, drawProductList);">
                <span class="listRangeSpan">0</span>
            </div>
            <div class="crudBtns">
				<button type="button" class="crudAddBtn" onclick="productInsertForm();">등록</button>
				<button type="button" class="crudUpdateBtn">수정</button>
				<button type="button" class="crudDeleteBtn" onclick="productDelete();">삭제</button>
				<a href="#" onclick="hideDetailView(drawProductList);" class="detailBackBtn">Back</a>
			</div>
            <div class="gridList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>