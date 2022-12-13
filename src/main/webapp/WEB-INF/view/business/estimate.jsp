<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents"><div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
	<div id="bodyContent">
		<div class="searchContainer">
            <jsp:include page="../listSearch.jsp" />
            <div class="searchMultiContent">
				<div class="searchDate">
                    <span>견적일자</span>
                    <div class="searchGridItem">
                        <input type="date" id="searchDateFrom" max="9999-12-31" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="searchDateTo" max="9999-12-31" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
                <div class="searchTitle">
                    <span>견적명</span>
                    <input type="text" autocomplete="off" id="searchTitle">
                </div>
                <div class="searchVersion">
                    <span>버전</span>
                    <input type="text" autocomplete="off" id="searchVersion">
                </div>
                <div class="searchForm">
                    <span>양식</span>
                    <input type="text" autocomplete="off" id="searchForm">
                </div>
				<div class="searchPrice">
                    <span>금액</span>
                    <div class="searchGridItem">
                        <input type="text" id="searchPriceFrom" onkeyup="inputNumberFormat(this);">
                        <span>~</span>
                        <input type="text" id="searchPriceTo" onkeyup="inputNumberFormat(this);">
                    </div>
                </div>
            </div>
        </div>
        <div class="listContainer">
            <hr />
            <span id="containerTitle">견적</span>
			<div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="EstimateSet.searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
            <div class="listRange">
                <input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="listRangeChange(this, drawSoppList);">
                <span class="listRangeSpan">0</span>
            </div>
            <div class="crudBtns">
				<button type="button" class="crudAddBtn">견적추가</button>
				<button type="button" class="crudUpdateBtn">견적수정</button>
				<button type="button" class="estimatePdf">pdf 다운로드</button>
				<a href="#" onclick="hideDetailView(EstimateSet.drawBack);" class="detailBackBtn">Back</a>
			</div>
			<!-- <span class="bodyTitleFnc">
				<div style="display: none;"></div>
				<div style="display: none;">추가</div>
				<div onclick="closeAdd()">닫기</div>
			</span> -->
			<div class="estimateList"></div>
			<div class="versionPreview">
				<div class="previewDefault">
					<div>미리보기</div>
				</div>
			</div>
			<div class="pageContainer"></div>
			<div class="addPdfForm">
				<jsp:include page="./form.jsp" />
			</div>
        </div>
		<!-- <div class="eachContainer">
            <hr class="bodyTitleBorder" />
            <span class="bodyTitle">견적 상세 내용</span><span class="bodyTitleFnc"><div onclick="saveEstimate()" style="display:none" >저장</div><div onclick="closeAdd()" style="margin-left:2em">닫기</div></span>
            <div class="eachContent">
				<div>
					<div class="passed">STEP 1
						<div><div></div><div>양식 / 견적명</div></div>
						<div class="estimateStep1"><div style="height:96px;"></div>
							<div>
								<div>견적 양식</div>
								<div class="formNames" style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"></div>
								<div>기본 정보</div>
								<div class="basicInfo" style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"></div>
								<div>견 적 명</div>
								<div style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"><input class="estimateProject" style="width:calc(100% - 3px);height:100%;border:none;font-size:1em;" onkeyup="setProject(this)" /></div>
								<div>작 성 자</div>
								<div></div>
								<div>열람권한</div>
								<div></div>
							</div>
						</div>
					</div>
					<div>STEP 2
						<div><div></div><div>거래처 정보 / 견적 유효기간 </div></div>
						<div class="estimateStep2"><div style="height:130px;"></div>
							<div>
								<div>업 체 명</div>
								<div style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"><input disabled class="estimateInput" onkeyup="inputCustomer(this, event)" onblur="if(!storage.ac.mouseon)storage.ac.close()" data-value="-1"/></div>
								<div>담 당 자</div>
								<div><input disabled class="estimateInput" onkeyup="inputCip(this)" /></div>
								<div>유효기간</div>
								<div class="formExp"><input disabled type="radio" name="rExp" value="1w" id="rExp1" onchange="storage.estimate.exp=this.value;setDataToPreview();passed(2);" /><label style="margin-right:0.5em;">1주</label><input disabled type="radio" name="rExp" value="2w" id="rExp2" onchange="storage.estimate.exp=this.value;setDataToPreview();passed(2);" /><label style="margin-right:0.5em;">2주</label><input disabled type="radio" name="rExp" value="4w" id="rExp3" onchange="storage.estimate.exp=this.value;setDataToPreview();passed(2);" /><label style="margin-right:0.5em;">4주</label><input disabled type="radio" name="rExp" value="1m" id="rExp4" onchange="storage.estimate.exp=this.value;setDataToPreview();passed(2);" /><label style="margin-right:0.5em;">1개월</label></div>
								<div>비 고</div><textarea id="remarks1" onkeyup="storage.estimate.remarks=this.value.replaceAll('\n','<br />');setDataToPreview();" style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;">Remarks</textarea>
							</div>
						</div>
					</div>
					<div>STEP 3
						<div><div></div><div><div style="display:inline-block;width:50%;">견적 항목 입력</div><div style="display:inline-block;width:50%;text-align:right;"><span class="addBtn" style="margin:0 1em;" onclick="addEstimateItem(this)">+</span><span onclick="removeEstimateItem(this)">-</span></div></div></div>
						<div class="estimateItem"><div style="height:275px;border-right: 1px dotted #2c77b7;width:1px;margin: -0.2em 0.5em -0.4em calc(0.2em - 1px);"></div>
							<div>
								<div>구 분</div><input disabled onkeyup="setItem(this)" />
								<div>타이틀</div><input disabled onkeyup="setItem(this)" style="border-right:1px solid #c3c3c3;" />
								<div>매입처</div><input disabled onkeyup="setItem(this, event)" data-type="customer" />
								<div>아이템</div><input disabled onkeyup="setItem(this, event)" data-type="item" style="border-right:1px solid #c3c3c3;" />
								<div>스 펙</div><div style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"><textarea  id="spec" onkeyup="setItem(this)" style="width:100%;height:100%"></textarea></div>
								<div>수 량</div><input disabled onkeyup="setItem(this)" pattern="[0-9,\\,]+" data-type="number" />
								<div>단 가</div><input disabled onkeyup="setItem(this)" data-type="number" style="border-right:1px solid #c3c3c3;" />
								<div>VAT</div><div><label style="width:20%;"><input type="radio" name="vatInclude0" checked onchange="setItem(this)" />과세</label><label style="width:30%;"><input type="radio" name="vatInclude0" onchange="setItem(this)" />비과세</label><div style="display:inline-block;width:50%;text-align:right"></div></div>
								<div>합 계</div><div style="border-right:1px solid #c3c3c3;text-align:right;"></div>
								<div>비 고</div><textarea id="remarks2" onkeyup="setItem(this)" style="grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;"></textarea>
							</div>
						</div>
					</div>
				</div><div class="estimatePreview">미리보기</div>
			</div>
        </div> -->
	</div>
</div>
</div><div class="msg_cnt"></div><div class="ac_cnt" onmouseenter="storage.ac.mouseon=true" onmouseleave="storage.ac.mouseon=false"></div><jsp:include page="../bottom.jsp" /><script src="/js/accountingBankaccount/xlsx.full.min.js"></script>