<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">

        <div class="container">
            <div class="content-title">계약</div>
            <div class="sopp-history">
                <div><img src="/images/sopp2/history.png" /> 진행상황</div>
                <div>
                    <div><img src="/images/sopp2/info_circle.png" class="profile-small" /><div class="history-employee">홍길동</div><div class="history-date">22.10.31 11:11</div><div class="history-comment">&lt;영업기회 개설&gt;</div></div>
                    <div><img src="/api/user/image/10002" class="profile-small" /><div class="history-employee">홍길동</div><div class="history-date">2022.10.31 11:11</div><div class="history-comment">이 건 담당자 만나서 내용 파악하고 진행하세요.</div></div>
                    <div><img src="/images/sopp2/info_circle.png" class="profile-small" /><div class="history-employee">홍길동</div><div class="history-date">22.10.31 11:11</div><div class="history-comment">&lt;스테이지 변경 : 접촉&gt;</div></div>
                    <div><img src="/api/user/image/10002" class="profile-small" /><div class="history-employee">이순신</div><div class="history-date">22.10.31 11:11</div><div class="history-comment">기존 김과장이 퇴사하고 얼마 전, 새로 입사한 이과징이 이 업무 담당합니다.</div></div>
                    <div><img src="/api/user/image/10002" class="profile-small" /><div class="history-employee">홍길동</div><div class="history-date">2022.10.31 11:11</div><div class="history-comment">김과장이 담당하던 다른 업무는 누가 맡는지도 확인하세요.</div></div>
                    <div><img src="/images/sopp2/info_circle.png" class="profile-small" /><div class="history-employee">연개소문</div><div class="history-date">22.10.31 11:11</div><div class="history-comment">&lt;스테이지 변경 : 제안&gt;</div></div>
                </div>
            </div>
            <div class="sopp-content" onscroll="scrolledSopp(this)">
                <div class="sopp-info">
                        <!-- <div><div>관리자</div><div><img src="/api/user/image/10002" class="profile-small" />홍길동</div></div>
                        <div><div>담당자</div><div><img src="/api/user/image/10002" class="profile-small" />이순신 <img src="/api/user/image/10002" class="profile-small" />성춘향 <img src="/api/user/image/10002" class="profile-small" />연개소문</div></div>
                        <div><div>매출처</div><div>(주)아이티원</div></div>
                        <div><div>매출처 담당자</div><div>김ㅇㅇ</div></div>
                        <div><div>엔드유저</div><div>부산정밀(주)</div></div>
                        <div><div>엔드유저 담당자</div><div>최ㅇㅇ</div></div>
                        <div><div>판매방식</div><div>조달직판</div></div>
                        <div><div>발주일자</div><div>2022-12-01</div></div>
                        <div><div>검수일자</div><div>2022-12-01</div></div>
                        <div><div>vat 포함여부</div><div>Y</div></div>
                        <div><div>계약금액</div><div>40,000,000원</div></div>
                        <div><div>매출이익</div><div>10,000,000원</div></div> -->
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
                    <div class="sopp-progress"></div>
                    <div class="sopp-tab-cnt">
                        <div onclick="moveToTarget(this)" data-target="sopp-info" class="sopp-tab-select">설명</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-schedule" class="sopp-tab">일정</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-estimate" class="sopp-tab">매입매출</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-trade" class="sopp-tab">유지보수</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-attached" class="sopp-tab">관련자료</div>
                    </div>
                </div>
                <div class="sopp-desc"><textarea></textarea></div>
                <div class="sopp-sub-title"><span></span><div class="sopp-tab">일정</div><span></span><span></span><span></span></div>
                <div class="sopp-schedule"></div>
                <div class="sopp-sub-title"><span></span><span></span><div class="sopp-tab">매입매출</div><span></span><span></span></div>
                <div class="sopp-estimate"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><div class="sopp-tab">유지보수</div><span></span></div>
                <div class="sopp-trade"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><span></span><div class="sopp-tab">관련자료</div></div>
                <div class="sopp-attached"></div>
            </div>
        </div>

	</div>
</div>
<jsp:include page="../bottom.jsp"/>