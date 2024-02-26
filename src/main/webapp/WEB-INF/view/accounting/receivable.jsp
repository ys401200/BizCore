<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib
prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents">
  <div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
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
            onclick="CommonDatas.addAutoComplete(this);"
            onkeyup="CommonDatas.addAutoComplete(this);"
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
              onchange="CommonDatas.searchDateDefaultSet(this);"
            />
            <span>~</span>
            <input
              type="date"
              id="searchIssueTo"
              max="9999-12-31"
              data-date-type="to"
              onchange="CommonDatas.searchDateDefaultSet(this);"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="receivableContainer">
      <div class="contentHeaders">
        <hr />
        <span id="containerTitle">미수급 현황조회</span>
        <div class="listRange">
          <input
            type="range"
            class="listRangeInput"
            max="100"
            step="10"
            value="0"
            oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.accountingReceivableSet.drawReceivableList);"
          />
          <span class="listRangeSpan">0</span>
        </div>
        <div class="listSearchInput">
          <input
            type="text"
            class="searchAllInput"
            id="searchAllInput"
            onkeyup="CommonDatas.Temps.accountingReceivableSet.searchInputKeyup();"
            placeholder="단어를 입력해주세요."
          />
        </div>
      </div>
      <table class="totalReceivableList">
        <thead>
          <tr>
            <th>총 기초잔액</th>
            <th>총 매출합계</th>
            <th>총 수금완료합계</th>
            <th>총 잔액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="totalCustBalance">0</td>
            <td id="totalVatAmountS">0</td>
            <td id="totalSerialTotalS">0</td>
            <td id="totalRemainAmount">0</td>
          </tr>
        </tbody>
      </table>
      <div class="gridList"></div>
      <div class="pageContainer"></div>
    </div>
  </div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />
