<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<link rel="stylesheet" type="text/css" href="/css/sideMenu.css" />
	<div class="sideMenu" id="sideMenu">
		<ul id="business">
			<!-- <li>
				<a href="/mypage">
					<img src="/images/main/icons/mypage.png" id="mypage" />
					<span>마이 페이지</span>
				</a>
			</li> -->
			<li>
				<a href="/">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>나의 업무 홈</span>
				</a>
			</li>
			<li>
				<a href="/business/notice">
					<img src="/images/main/icons/mainNoticeIcon.png" id="mainNoticeIcon" />
					<span>공지사항</span>
				</a>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSchedIcon" />
					<span>일정관리</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/business/schedule">일정조회</a></li>
					<li><a href="/business/workreport">업무일지작성</a></li>
					<li><a href="/business/workjournal">업무일지검토</a></li>
				</ul>
			</li>
			<li>
				<a href="/business/sales">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSalesIcon" />
					<span>영업활동관리</span>
					<!-- <span id="slideSpan">+</span> -->
				</a>
				<!-- <ul id="panel">
					<li><a href="/business/sales">영업활동조회</a></li>
				</ul> -->
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainSoppIcon.png" id="mainSoppIcon" />
					<span>영업기회</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/business/project">프로젝트관리</a></li>
					<li><a href="/business/sopp">영업기회조회</a></li>
					<li><a href="/business/estimate">견적관리</a></li>
				</ul>
			</li>
			<!-- <li>
				<a href="#">
					<img src="/images/main/icons/mainPpsIcon.png" id="mainPpsIcon" />
					<span>조달업무</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">조달업무할당</a></li>
					<li><a href="#">조달진행상황</a></li>
					<li><a href="#">조달계약관리</a></li>
				</ul>
			</li> -->
			<li>
				<a href="/business/contract">
					<img src="/images/main/icons/mainContIcon.png" id="mainContIcon" />
					<span>계약관리</span>
					<!-- <span id="slideSpan">+</span> -->
				</a>
				<!-- <ul id="panel">
					<li><a href="/business/contract">계약조회</a></li>
					<li><a href="#">계약등록</a></li>
		  			<li><a href="#">업체정보조회</a></li>
		  			<li><a href="#">매입/매출 자료등록</a></li>
				</ul> -->
			</li>
			<li>
				<a href="/business/tech">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSalesIcon" />
					<span>기술지원관리</span>
					<!-- <span id="slideSpan">+</span> -->
				</a>
				<!-- <ul id="panel">
					<li><a href="/business/tech">기술지원조회</a></li>
				</ul> -->
			</li>
			<!-- <li>
			<a href="#">
				<img src="/images/main/icons/mainTechIcon.png" id="mainTechIcon" />
				<span>기술지원업무</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="/business/tech">기술지원조회</a></li>
		  		<li><a href="#">유지보수계약관리</a></li>
		  		<li><a href="#">유지보수매입관리</a></li>
		  	</ul>
		</li> -->
			<li>
				<a href="/business/filebox">
					<img src="/images/main/icons/mainBoardFileIcon.png" id="mainBoardFileIcon" />
					<span>자료실</span>
				</a>
			</li>
			<!-- <li>
				<a href="/api/user/logout" onclick="return confirm('로그아웃 하시겠습니까??');">
					<img src="/images/main/icons/mainLogOutIcon.png" id="mainLogOutIcon" />
					<span>로그아웃</span>
				</a>
			</li> -->
			<li>
				<a href="#">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSchedIcon" />
					<span>설정</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/business/customer">고객사설정</a></li>
					<li><a href="/business/product">상품설정</a></li>
					<li><a href="/business/goal">영업목표설정</a></li>
					<li><a href="/business/employee">조직 관리</a></li>
				</ul>
			</li>
		</ul>

		<ul id="gw">
			<li>
				<a href="/gw/home">
					<img src="/images/main/icons/mainAccountHome.png" id="mainNoticeIcon" />
					<span>전자결재 홈</span>
				</a>
			</li>
			<li>
				<a href="/gw/write">
					<img src="/images/main/icons/mainNewAccount.png" id="mainNoticeIcon" />
					<span>새 결재 진행</span>
				</a>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainContIcon.png" id="mainHomeIcon" />
					<span>진행 중 문서</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/gw/wait">결재 대기 문서</a></li>
					<li><a href="/gw/due">결재 예정 문서</a></li>
					<li><a href="/gw/receive">결재 수신 문서</a></li>
					<li><a href="/gw/refer">참조 대기 문서</a></li>

				</ul>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainBoardFileIcon.png" id="mainHomeIcon" />
					<span>문서함</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/gw/mydraft">기안 문서함</a></li>
					<li><a href="/gw/myreturn">회수 문서함</a></li>
					<li><a href="/gw/mytemp">임시 저장함</a></li>
					<li><a href="/gw/myapp">결재 문서함</a></li>
					<li><a href="/gw/myreceive">수신 문서함</a></li>
					<li><a href="/gw/myrefer">참조/열람 문서함</a></li>
				</ul>
			</li>

		</ul>

		<ul id="accounting">
			<li>
				<a href="/accounting/slip">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingSlipIcon" />
					<span>전표관리</span>
				</a>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
					<span>매입매출</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/accounting/trade">매입매출</a></li>
					<li><a href="/accounting/unpaid">미지급현황</a></li>
					<li><a href="/accounting/receivable">미수금현황</a></li>
					<li><a href="/accounting/sales">매출원장</a></li>
					<li><a href="/accounting/purchase">매입원장</a></li>
				</ul>
			</li>
			<li>
				<a href="/accounting/bankaccount">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingBackIcon" />
					<span>은행예금</span>
				</a>
			</li>
			<li>
				<a href="/accounting/corporatecard">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingCardIcon" />
					<span>법인카드</span>
				</a>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingBillIcon" />
					<span>세금계산서</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="/accounting/purchasebill">- 매입</a></li>
					<li><a href="/accounting/salesbill">- 매출</a></li>
				</ul>
			</li>
		</ul>

		<ul id="mis">
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingLedgerIcon" />
					<span>매입매출현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">- 매입매출현황</a></li>
					<li><a href="#">- 미지급현황</a></li>
					<li><a href="#">- 미수금현황</a></li>
				</ul>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>자금현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">- 입출금조회</a></li>
					<li><a href="#">- 일자별자금일보</a></li>
				</ul>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>프로젝트현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">- 프로젝트진행조회</a></li>
					<li><a href="#">- 프로젝트별수익분석</a></li>
					<li><a href="#">- 계약별수익분석</a></li>
				</ul>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>인사관리현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">- 근태현황조회</a></li>
					<li><a href="#">- 개인별원가분석</a></li>
				</ul>
			</li>
			<li>
				<a href="#">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>영업분석</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="#">- 매출분석</a></li>
				</ul>
			</li>
		</ul>
	</div>