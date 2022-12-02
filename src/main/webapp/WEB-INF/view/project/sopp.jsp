<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">

        <div class="container">
            <div class="content-title">영업기회</div>
            <div class="sopp-summary">summary</div>
            <div class="sopp-content" onscroll="scrolledSopp(this)">
                <div class="sopp-info">
                        <div><div>관리자</div><div>홍길동</div></div>
                        <div><div>담당자</div><div>이순신 성춘향 연개소문</div></div>
                        <div><div>고객사</div><div>부산정밀(주)</div></div>
                        <div><div>협력사</div><div>(주)아이티원</div></div>
                </div>
                <div class="sopp-sticky">
                    <div class="sopp-expected">
                        <div>예상매출 : ₩ 100,000,000</div>
                        <div>
                            <div>'21.12.31</div>
                            <div><span style="width:35%;"></span><span style="left:calc(35% - 0.3rem);"></span></div>
                            <div>'22.12.31</div>
                        </div>
                    </div>
                    <div class="sopp-progress"><div class="sopp-done">개설</div><div class="sopp-done">접촉</div><div class="sopp-done">제안</div><div class="sopp-doing">견적</div><div>협상</div><div>계약</div><div>종료</div></div>
                    <div class="sopp-tab-cnt">
                        <div onclick="moveToTarget(this)" data-target="sopp-info" class="sopp-tab-select">설명</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-schedule" class="sopp-tab">일정</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-estimate" class="sopp-tab">견적</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-trade" class="sopp-tab">매입매출</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-attached" class="sopp-tab">관련자료</div>
                    </div>
                </div>
                <div class="sopp-desc"><textarea></textarea></div>
                <div class="sopp-sub-title"><span></span><div class="sopp-tab">일정</div><span></span><span></span><span></span></div>
                <div class="sopp-schedule"></div>
                <div class="sopp-sub-title"><span></span><span></span><div class="sopp-tab">견적</div><span></span><span></span></div>
                <div class="sopp-estimate"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><div class="sopp-tab">매입매출</div><span></span></div>
                <div class="sopp-trade"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><span></span><div class="sopp-tab">관련자료</div></div>
                <div class="sopp-attached"></div>
            </div>
        </div>

	</div>
</div>
<jsp:include page="../bottom.jsp"/>