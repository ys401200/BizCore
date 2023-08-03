<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<link rel="stylesheet" type="text/css" href="/css/sideMenu.css" />
	<div class="sideMenu">
		<div class="business" data-path="/">
			<div class="menuItem">
				<a href="/">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>나의 업무 홈</span>
				</a>
			</div>
			<div class="menuItem">
				<a href="/business/notice">
					<img src="/images/main/icons/mainNoticeIcon.png" id="mainNoticeIcon" />
					<span>공지사항</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="schedule" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="schedule">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSchedIcon" />
					<span>일정관리</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/business/calendar">달력</a>
				</div>
				<div>
					<a href="/business/schedule">일정조회</a>
				</div>
				<div>
					<a href="/business/workreport">개인업무일지</a>
				</div>
				<!-- <div>
					<a href="/business/workjournal">업무일지검토</a>
				</div> -->
				<div>
					<a href="/business/workreport2">업무일지검토</a>
				</div>
			</div>
			<div class="menuItem">
				<a href="/business/sales">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSalesIcon" />
					<span>영업활동관리</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="sopp" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="sopp">
					<img src="/images/main/icons/mainSoppIcon.png" id="mainSoppIcon" />
					<span>영업기회</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<!-- <div>
					<a href="/business/project">프로젝트관리</a>
				</div> -->
				<div>
					<a href="/business/sopp">영업기회조회</a>
				</div>
				<div>
					<a href="/business/estimate">견적관리</a>
				</div>
			</div>
			<div class="menuItem">
				<a href="/business/contract">
					<img src="/images/main/icons/mainContIcon.png" id="mainContIcon" />
					<span>계약관리</span>
				</a>
			</div>
			<div class="menuItem">
				<a href="/business/tech">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSalesIcon" />
					<span>기술지원관리</span>
				</a>
			</div>
			<div class="menuItem">
				<a href="/business/filebox">
					<img src="/images/main/icons/mainBoardFileIcon.png" id="mainBoardFileIcon" />
					<span>자료실</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="setting" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="setting">
					<img src="/images/main/icons/mainSoppIcon.png" id="mainSoppIcon" />
					<span>설정</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/business/customer">고객사설정</a>
				</div>
				<div>
					<a href="/business/product">상품설정</a>
				</div>
				<div>
					<a href="/business/goal">영업목표설정</a>
				</div>
				<div>
					<a href="/business/employee">조직 관리</a>
				</div>
			</div>
		</div>
		<div class="gw" data-path="/gw/home">
			<div class="menuItem">
				<a href="/gw/home">
					<img src="/images/main/icons/mainAccountHome.png" id="mainNoticeIcon" />
					<span>전자결재 홈</span>
				</a>
			</div>
			<div class="menuItem">
				<a href="/gw/write">
					<img src="/images/main/icons/mainNewAccount.png" id="mainNoticeIcon" />
					<span>새 결재 진행</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="progress" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="progress">
					<img src="/images/main/icons/mainContIcon.png" id="mainHomeIcon" />
					<span>진행 중 문서</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/gw/wait">결재 대기 문서</a>
				</div>
				<div>
					<a href="/gw/due">결재 예정 문서</a>
				</div>
				<div>
					<a href="/gw/receive">결재 수신 문서</a>
				</div>
				<div>
					<a href="/gw/refer">참조 대기 문서</a>
				</div>
			</div>
			<div class="menuItem">
				<input type="radio" id="document" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="document">
					<img src="/images/main/icons/mainBoardFileIcon.png" id="mainHomeIcon" />
					<span>문서함</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/gw/mydraft">기안 문서함</a>
				</div>
				<div>
					<a href="/gw/myreturn">회수 문서함</a>
				</div>
				<div>
					<a href="/gw/mytemp">임시 저장함</a>
				</div>
				<div>
					<a href="/gw/myapp">결재 문서함</a>
				</div>
				<div>
					<a href="/gw/myreceive">수신 문서함</a>
				</div>
				<div>
					<a href="/gw/myrefer">참조/열람 문서함</a>
				</div>
			</div>
		</div>
		<div class="accounting" data-path="/accounting/home">
			<div class="menuItem">
				<a href="/accounting/slip">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingSlipIcon" />
					<span>전표관리</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="come" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="come">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
					<span>매입매출</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/accounting/trade">매입매출</a>
				</div>
				<div>
					<a href="/accounting/unpaid">미지급현황</a>
				</div>
				<div>
					<a href="/accounting/receivable">미수금현황</a>
				</div>
				<div>
					<a href="/accounting/sales">매출원장</a>
				</div>
				<div>
					<a href="/accounting/purchase">매입원장</a>
				</div>
			</div>
			<div class="menuItem">
				<a href="/accounting/bankaccount">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingBackIcon" />
					<span>은행예금</span>
				</a>
			</div>
			<div class="menuItem">
				<input type="radio" id="card" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="card">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
					<span>법인카드</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/accounting/corporatecard">법인카드 조회</a>
				</div>
				<div>
					<a href="/accounting/carddatainsert">카드내역 등록</a>
				</div>
			</div>
			<div class="menuItem">
				<input type="radio" id="bill" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="bill">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
					<span>세금계산서</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/accounting/purchasebill">매입</a>
				</div>
				<div>
					<a href="/accounting/salesbill">매출</a>
				</div>
			</div>
		</div>
		<!-- 
		<ul id="mis">
			<li>
				<a href="javascript:void(0)">
					<img src="/images/main/icons/mainHomeIcon.png" id="accountingLedgerIcon" />
					<span>매입매출현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="javascript:void(0)">- 매입매출현황</a></li>
					<li><a href="javascript:void(0)">- 미지급현황</a></li>
					<li><a href="javascript:void(0)">- 미수금현황</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0)">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>자금현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="javascript:void(0)">- 입출금조회</a></li>
					<li><a href="javascript:void(0)">- 일자별자금일보</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0)">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>프로젝트현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="javascript:void(0)">- 프로젝트진행조회</a></li>
					<li><a href="javascript:void(0)">- 프로젝트별수익분석</a></li>
					<li><a href="javascript:void(0)">- 계약별수익분석</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0)">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>인사관리현황</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="javascript:void(0)">- 근태현황조회</a></li>
					<li><a href="javascript:void(0)">- 개인별원가분석</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0)">
					<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
					<span>영업분석</span>
					<span id="slideSpan">+</span>
				</a>
				<ul id="panel">
					<li><a href="javascript:void(0)">- 매출분석</a></li>
				</ul>
			</li>
		</ul> -->
	</div>