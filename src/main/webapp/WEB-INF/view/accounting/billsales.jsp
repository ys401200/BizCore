<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib
prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp" />
<div id="bodyContents">
  <div id="sideContents">
    <jsp:include page="../sideMenu.jsp" />
  </div>
  <div id="bodyContent">
    <div class="searchContainer">
      <jsp:include page="../listSearch.jsp" />
      <div class="searchMultiContent">
        <div class="searchCustomer">
          <span>거래처</span>
          <input
            type="text"
            data-complete="customer"
            autocomplete="off"
            id="searchBuyerCustomer"
            onclick="addAutoComplete(this);"
            onkeyup="addAutoComplete(this);"
          />
        </div>
        <div class="searchIssue">
          <span>발행일</span>
          <div class="searchGridItem">
            <input
              type="date"
              id="searchIssueFrom"
              max="9999-12-31"
              data-date-type="from"
              onchange="searchDateDefaultSet(this);"
            />
            <span>~</span>
            <input
              type="date"
              id="searchIssueTo"
              max="9999-12-31"
              data-date-type="to"
              onchange="searchDateDefaultSet(this);"
            />
          </div>
        </div>
        <div class="searchPrice">
          <span>금액</span>
          <div class="searchGridItem">
            <input type="text" id="searchPriceFrom" onkeyup="inputNumberFormat(this);" />
            <span>~</span>
            <input type="text" id="searchPriceTo" onkeyup="inputNumberFormat(this);" />
          </div>
        </div>
      </div>
    </div>
    <div class="salesbillContainer">
      <hr />
      <span id="containerTitle">매출계산서조회</span>
      <div class="listSearchInput">
        <input
          type="text"
          class="searchAllInput"
          id="searchAllInput"
          onkeyup="searchInputKeyup();"
          placeholder="단어를 입력해주세요."
        />
      </div>
      <div class="listRange">
        <input
          type="range"
          class="listRangeInput"
          max="100"
          step="10"
          value="0"
          oninput="listRangeChange(this, drawSalesbillList);"
        />
        <span class="listRangeSpan">0</span>
      </div>
      <div class="gridList"></div>
      <div class="pageContainer"></div>
    </div>
    <div class="detailSecondTabs"></div>
  </div>
</div>
<jsp:include page="../bottom.jsp" />
