<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %> <%@ taglib
prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp" />
<div id="bodyContents">
  <div id="sideContents">
    <jsp:include page="../sideMenu.jsp" />
  </div>
  <div id="bodyContent">
    <div class="container">
      <hr />
      <span id="containerTitle">카드내역 등록</span>
      <div class="listRange">
        <input
          type="range"
          class="listRangeInput"
          max="100"
          step="10"
          value="0"
          oninput="CommonDatas.listRangeChange(this, CommonDatas.Temps.accountingCarddatainsert.drawDefaultList);"
        />
        <span class="listRangeSpan">0</span>
      </div>
      <div class="crudBtns">
        <label class="btnsLabel" for="xlsFile"
          >읽어오기<input
            style="display: none"
            type="file"
            id="xlsFile"
            accept=".xls,.xlsx,.xlsm"
            onchange="readFile(this)"
          />
        </label>
        <button class="btnsBtn" onclick="getCheckdData()">등록</button>
      </div>
      <div class="insertDiv">
        <div class="dataList"></div>
        <div class="parsedData"></div>
      </div>
      <div class="pageContainer"></div>
    </div>
  </div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />
<script src="/js/accountingBankaccount/xlsx.full.min.js"></script>
