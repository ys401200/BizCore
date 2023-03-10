<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">

        <div class="container">
            <div class="content-title"><div>영업기회</div><div></div></div>
            <div class="sopp-history">
                <div><img src="/images/sopp2/history.png" /> 진행상황</div>
                <div></div>
                <div><input onkeyup="inputtedComment(this, event)" /><button onclick="inputtedComment(this)">⏎</button></div>
                <div><div>관리자 변경</div><div><img onclick="cancelEdit(this)" src="/images/sopp2/circle_close.png" data-n="1" /><img src="/images/sopp2/confirm_circle.png" /></div></div>
                <div></div>
                <div><input onkeyup="inputtedComment(this, event)" /></div>
            </div>
            <div class="sopp-content" onscroll="scrolledSopp(this)">
                <div class="sopp-info">
                        <div><div>관리자</div><div><div></div><img onclick="editSopp('owner')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>담당자</div><div><div></div><img onclick="editSopp('coWorker')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>고객사</div><div><div></div><img onclick="editSopp('customer')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>협력사</div><div><div></div><img onclick="editSopp('partner')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                </div>
                <div class="sopp-sticky">
                    <div class="sopp-expected">
                        <div><div><T>예</T><T>상</T><T>매</T><T>출</T><T>:</T></div><span>₩</span><input onkeyup="inputExpectedSales(this)" disabled /><div><img onclick="editSopp('expected')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /><img onclick="cancelEdit(this)" class="edit-sopp-img" src="/images/sopp2/circle_close.png" data-n="3"/><img onclick="changeSopp('expected')" class="edit-sopp-img" src="/images/sopp2/confirm_circle.png" /></div></div>
                        <div>
                            <div></div>
                            <div><span></span><span></span></div>
                            <input type="date" disabled onchange="changeExpectedDate(this)" />
                            <div></div>
                        </div>
                    </div>
                    <div class="sopp-progress"></div>
                    <div class="sopp-tab-cnt">
                        <div onclick="moveToTarget(this)" data-target="sopp-info" class="sopp-tab-select"><div></div><div>설 명</div><div></div></div>
                        <div onclick="moveToTarget(this)" data-target="sopp-schedule" class="sopp-tab"><div></div><div>일 정</div><div><span> 0 </span></div></div>
                        <div onclick="moveToTarget(this)" data-target="sopp-estimate" class="sopp-tab"><div></div><div>견 적</div><div><span> 0 </span></div></div>
                        <div onclick="moveToTarget(this)" data-target="sopp-contract" class="sopp-tab"><div></div><div>계 약</div><div></div></div>
                        <div onclick="moveToTarget(this)" data-target="sopp-trade" class="sopp-tab"><div></div><div>매입매출</div><div><span> 0 </span></div></div>
                        <div onclick="moveToTarget(this)" data-target="sopp-attached" class="sopp-tab"><div></div><div>관련자료</div><div></div></div>
                    </div>
                </div>
                <div class="sopp-desc">
                    <div><div></div><div>영업기회 제목</div><div><img onclick="editSopp('content')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /><img onclick="cancelEdit(this)" class="edit-sopp-img" src="/images/sopp2/circle_close.png" data-n="2" /><img onclick="changeSopp('content')" class="edit-sopp-img" src="/images/sopp2/confirm_circle.png" /></div></div>
                    <div>본문</div>
                    <textarea name="sopp-desc-edit"></textarea>
                </div>
                <div class="sopp-sub-title"><div>일 정</div><div></div></div>



                <div class="sopp-schedule">
                    <div class="sopp-schedule-detail"></div>
                    <div class="sopp-calendar"></div>
                </div>
                
                
                
                <div class="sopp-sub-title"><div>견 적</div><div></div></div>
                <div class="sopp-estimate">
                    <div class="crudBtns">
                        <button type="button" class="crudAddBtn">견적추가</button>
                        <button type="button" class="crudUpdateBtn">견적수정</button>
                        <button type="button" class="estimatePdf">pdf 다운로드</button>
                        <a href="#" onclick="hideDetailView(EstimateSet.drawBack);" class="detailBackBtn">Back</a>
                    </div>
                    <div class="estimateList"></div>
                    <div class="versionPreview">
                        <div class="previewDefault">
                            <div>미리보기</div>
                        </div>
                    </div>
                    <div class="pageContainer"></div>
                    <div class="addPdfForm">
                        <jsp:include page="../business/form.jsp" />
                    </div>
                </div>
                <div class="sopp-sub-title"><div>계 약</div><div></div></div>
                <div class="sopp-contract"></div>
                <div class="sopp-sub-title"><div>매입매출</div><div></div></div>
                <div class="sopp-trade">
                    <div><!-- 상단 헤더부분 / 합계 금액 및 항목 추가 버튼 -->
                        <div><span>매출 합계</span><span>1,000,000</span></div>
                        <div><span>매입 합계</span><span>1,000,000</span></div>
                        <div><span>항목 추가</span></div>
                    </div><!-- End of child 1-->
                    <div><!-- 테이블 헤더부분 / 테이블 헤더 및 항목 추가 ROW 위치 -->
                        <div class="sopp-trade-row">
                            <span>구분</span>
                            <span>기준일자</span>
                            <span>거래처</span>
                            <span>제품</span>
                            <span>수량</span>
                            <span>단가</span>
                            <span>과세</span>
                            <span>합계</span>
                            <span>비고</span>
                        </div>
                        <div></div>
                    </div><!-- End of child 2-->
                    <div><!-- 매입 / 매출 테이블 및 페어링 라인 캔버스 위치 -->
                        <div class="sopp-trade-table"></div><div class="sopp-trade-pairing"></div>
                    </div><!-- End of child 3-->
                </div><!-- End of .sopp-trade -->
                <div class="sopp-sub-title"><div>관련자료</div><div></div></div>
                <div class="sopp-attached"></div>
            </div>
        </div>

	</div>
</div>

<jsp:include page="../bottom.jsp"/>