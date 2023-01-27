<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="contractContainer">
					<hr />
					<span id="containerTitle">계약</span>
					<div class="listRange">
						<input type="range" class="listRangeInput" max="100" step="10" value="0"
							oninput="listRangeChange(this, drawList)">
						<span class="listRangeSpan">0</span>
					</div>
					<!-- <div class="crudBtns"><button onclick="contractInsertForm()">등록</button></div> -->
					<div class="contract-list"></div>
					<div class="contract-container" style="display:none;">
						<div class="tabs">
							<input type="radio" id="tabMain" name="tabItem" data-content-id="tabMainDiv"
								onclick="tabItemClick(this)" checked>
							<label class="tabItem" for="tabMain" style="z-index: 8; width:25%; padding-left:0%;">기본
								정보</label>

							<input type="radio" id="tabSche" name="tabItem" data-content-id="tabScheDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabSche"
								style="z-index: 6; width: 25%; padding-left: 25%;">일정</label>

							<input type="radio" id="tabEst" name="tabItem" data-content-id="tabEstDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabEst"
								style="z-index: 4; width:25%; padding-left: 50%;">견적</label>

							<input type="radio" id="tabTrade" name="tabItem" data-content-id="tabTradeDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabTrade" style="z-index: 2; width: 25%; padding-left: 75%;">
								매입매출</label>
						</div>

						<div class="contract-main" id="tabMainDiv">

						</div>
						<div class="contract-sche" id="tabScheDiv" style="display: none;">

						</div>
						<div class="contract-est" id="tabEstDiv" style="display: none;">



						</div>
						<div class="contract-trade" id="tabTradeDiv" style="display: none;">




						</div>
					</div>
					<div class="pageContainer"></div>
				</div>

			</div>
		</div>
		<jsp:include page="../bottom.jsp" />