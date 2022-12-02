<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">

				<div class="container">
					<hr />
					<span id="containerTitle">법인카드</span>
					<div class="listRange"><input type="range" class="listRangeInput" max="100" step="10" value="0"
							oninput="listRangeChange(this, drawCardList)">
						<span class="listRangeSpan">0</span>
					</div>
					<div class="crudBtns"><input type="file" id="xlsFile" accept=".xls,.xlsx,.xlsm"
							onchange="readFile(this)" /><button onclick="getCheckdData()">등록</button></div>
					<div class="gridList">
						<div class="parsedData">
						</div>
					</div>
					<div class="pageContainer"></div>
				</div>
			</div>
		</div>
		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />
		<script src="/js/accountingBankaccount/xlsx.full.min.js"></script>