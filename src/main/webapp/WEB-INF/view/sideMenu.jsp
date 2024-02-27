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
    <div class="menuItem" data-key="schedule">
      <input
        type="radio"
        id="schedule"
        name="sideMenu"
        onclick="CommonDatas.sideMenuItemClick();"
      />
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
        <a href="/business/workjournal">업무일지검토</a>
      </div>
    </div>
    <div class="menuItem" data-key="sales">
      <a href="/business/sales">
        <img src="/images/main/icons/mainSalesIcon.png" id="mainSalesIcon" />
        <span>영업활동관리</span>
      </a>
    </div>
    <div class="menuItem" data-key="sopp">
      <input type="radio" id="sopp" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
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
    <div class="menuItem" data-key="orderSales">
      <a href="/business/orderSales">
        <img src="/images/main/icons/mainSoppIcon.png" id="mainSoppIcon" />
        <span>수주판매보고</span>
      </a>
    </div>
    <div class="menuItem" data-key="cont">
      <input type="radio" id="cont" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
      <label for="cont">
        <img src="/images/main/icons/mainContIcon.png" id="mainContIcon" />
        <span>계약관리</span>
        <span>+</span>
      </label>
    </div>
    <div class="panel">
      <div>
        <a href="/business/cont">계약조회</a>
      </div>
    </div>
    <!-- <div class="menuItem" data-key="tech">
				<input type="radio" id="tech" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();">
				<label for="tech">
					<img src="/images/main/icons/mainSchedIcon.png" id="mainSchedIcon" />
					<span>기술지원관리</span>
					<span>+</span>
				</label>
			</div>
			<div class="panel">
				<div>
					<a href="/business/tech">기술지원조회</a>
				</div>
				<div>
					<a href="/business/store">재고 조회</a>
				</div>
			</div> -->
    <div class="menuItem" data-key="tech">
      <a href="/business/tech">
        <img src="/images/main/icons/mainTechIcon.png" id="mainTechIcon" />
        <span>기술지원관리</span>
      </a>
    </div>
    <div class="menuItem" data-key="store">
      <input type="radio" id="store" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
      <label for="store">
        <img src="/images/main/icons/mainStoreIcon.png" id="mainStoreIcon" />
        <span>재고조회</span>
        <span>+</span>
      </label>
    </div>
    <div class="panel" data-key="categories"></div>
    <div class="menuItem">
      <a href="/business/reference">
        <img src="/images/main/icons/mainBoardFileIcon.png" id="mainBoardFileIcon" />
        <span>자료실</span>
      </a>
    </div>
    <div class="menuItem" data-key="setting">
      <input type="radio" id="setting" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
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
        <a href="/business/category">카테고리설정</a>
      </div>
      <div>
        <a href="/business/goal">영업목표설정</a>
      </div>
      <div>
        <a href="/business/user">사용자설정</a>
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
      <input
        type="radio"
        id="progress"
        name="sideMenu"
        onclick="CommonDatas.sideMenuItemClick();"
      />
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
      <input
        type="radio"
        id="document"
        name="sideMenu"
        onclick="CommonDatas.sideMenuItemClick();"
      />
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
      <input type="radio" id="come" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
      <label for="come">
        <img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
        <span>매입/매출 관리</span>
        <span>+</span>
      </label>
    </div>
    <div class="panel">
      <!-- <div>
        <a href="/accounting/trade">매입매출</a>
      </div> -->
      <div>
        <a href="/accounting/unpaid">미지급현황</a>
      </div>
      <div>
        <a href="/accounting/receivable">미수금현황</a>
      </div>
      <!-- <div>
        <a href="/accounting/purchase">매입원장</a>
      </div>
      <div>
        <a href="/accounting/sales">매출원장</a>
      </div> -->
    </div>
    <div class="menuItem">
      <input type="radio" id="deposit" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
      <label for="deposit">
        <img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
        <span>자금 관리</span>
        <span>+</span>
      </label>
    </div>
    <div class="panel">
      <div>
        <a href="/accounting/bankaccount">자금현황조회</a>
      </div>
      <div>
        <a href="#">계좌내역등록</a>
      </div>
      <div>
        <a href="#">계좌내역조회</a>
      </div>
      <div>
        <a href="/accounting/carddatainsert">카드내역 등록</a>
      </div>
      <div>
        <a href="/accounting/corporatecard">카드내역조회</a>
      </div>
    </div>
    <div class="menuItem">
      <input type="radio" id="bill" name="sideMenu" onclick="CommonDatas.sideMenuItemClick();" />
      <label for="bill">
        <img src="/images/main/icons/mainHomeIcon.png" id="accountingTradeIcon" />
        <span>세금계산서 관리</span>
        <span>+</span>
      </label>
    </div>
    <div class="panel">
      <div>
        <a href="/accounting/billpurchase">매입 계산서 조회</a>
      </div>
      <div>
        <a href="/accounting/billsales">매출 계산서 조회</a>
      </div>
      <div>
        <a href="#">계산서 등록</a>
      </div>
      <div>
        <a href="#">계산서 발행</a>
      </div>
      <div>
        <a href="#">계산서 연결 현황</a>
      </div>
      <div>
        <a href="#">거래처별 매출 원장</a>
      </div>
      <div>
        <a href="#">거래처별 매입 원장</a>
      </div>
    </div>
    <div class="menuItem">
      <a href="/accounting/vat">
        <img src="/images/main/icons/mainHomeIcon.png" id="accountingVatIcon" />
        <span>부가가치세</span>
      </a>
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
