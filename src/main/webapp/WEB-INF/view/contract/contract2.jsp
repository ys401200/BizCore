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

					<div class="crudBtns cntBackBtn" style="display:none;"><button onclick="cntBack()">Back</button></div>
					<div class="contract-list"></div>
					<div class="contract-container" style="display:none;">
						<div class="tabs">
							<input type="radio" id="tabMain" name="tabItem" data-content-id="tabMainDiv"
								onclick="tabItemClick(this)" checked>
							<label class="tabItem" for="tabMain" style="z-index: 8; width:25%; padding-left:0%;">기본
								정보</label>

							<input type="radio" id="tabSche" name="tabItem" data-content-id="tabScheDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem scheLabel" for="tabSche"
								style="z-index: 6; width: 25%; padding-left: 25%;">일정(0)</label>

							<input type="radio" id="tabEst" name="tabItem" data-content-id="tabEstDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem estLabel" for="tabEst"
								style="z-index: 4; width:25%; padding-left: 50%;">견적(0)</label>

							<input type="radio" id="tabTrade" name="tabItem" data-content-id="tabTradeDiv"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabTrade" style="z-index: 2; width: 25%; padding-left: 75%;">
								매입매출(0)</label>
						</div>

						<div class="contract-main" id="tabMainDiv">

						</div>
						<div class="contract-sche" id="tabScheDiv" style="display: none;">

						</div>
						<div class="sopp-estimate" id="tabEstDiv" style="display: none;">
							<div class="crudBtns estBtns">
								<button type="button" class="crudAddBtn">견적추가</button>
								<button type="button" class="crudUpdateBtn">견적수정</button>
								<button type="button" class="estimatePdf">pdf 다운로드</button>
								<a href="#" onclick="hideDetailView(EstimateSet.drawBack);" class="detailBackBtn">Back</a>
							</div>
							<div class="estimateList">	<div class="pageContainer"></div></div>
							<div class="versionPreview">
								<div class="previewDefault">
									<div>미리보기</div>
								</div>
							</div>
							
							<div class="addPdfForm">
								<jsp:include page="../business/form.jsp" />
							</div>
						</div>
						<div class="contract-trade" id="tabTradeDiv" style="display: none;">




						</div>
					</div>
					<div class="pageContainer2 cntPageCnt"></div>
				</div>

			</div>
		</div>
		<jsp:include page="../bottom.jsp" />