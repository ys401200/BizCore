<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="/css/sideMenu.css" />
<div id="sideMenu">
	<ul id="business">
		<li>
			<a href="/">
				<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon"/>
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
		  		<li><a href="/business/calendar">- 캘린더</a></li>
		  		<li><a href="/business/schedule">- 일정조회</a></li>
		  		<li><a href="#">- 일정등록</a></li>
		  		<li><a href="#">- 개인업무일지작성</a></li>
		  		<li><a href="#">- 업무일지검토</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainSalesIcon.png" id="mainSalesIcon" />
				<span>영업활동관리</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="#">- 영업활동조회</a></li>
		  		<li><a href="#">- 영업활동등록</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainSoppIcon.png"  id="mainSoppIcon"/>
				<span>영업기회</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="#">- 영업기회조회</a></li>
		  		<li><a href="#">- 영업기회등록</a></li>
		  		<li><a href="#">- 견적관리</a></li>
		  		<li><a href="#">- 견적작성</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainPpsIcon.png" id="mainPpsIcon" />
				<span>조달업무</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="#">- 조달업무할당</a></li>
		  		<li><a href="#">- 조달진행상황</a></li>
		  		<li><a href="#">- 조달계약관리</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainContIcon.png" id="mainContIcon" />
				<span>계약관리</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="#">- 계약조회</a></li>
		  		<li><a href="#">- 계약등록</a></li>
		  		<li><a href="#">- 업체정보조회</a></li>
		  		<li><a href="#">- 매입/매출 자료등록</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainTechIcon.png" id="mainTechIcon" />
				<span>기술지원업무</span>
				<span id="slideSpan">+</span>
			</a>
			<ul id="panel">
		  		<li><a href="#">- 기술지원조회</a></li>
		  		<li><a href="#">- 기술지원등록</a></li>
		  		<li><a href="#">- 유지보수계약관리</a></li>
		  		<li><a href="#">- 유지보수매입관리</a></li>
		  	</ul>
		</li>
		<li>
			<a href="#">
				<img src="/images/main/icons/mainBoardFileIcon.png" id="mainBoardFileIcon" />
				<span>자료실</span>
			</a>
		</li>
		<li>
			<a href="/api/user/logout">
				<img src="/images/main/icons/mainLogOutIcon.png" id="mainLogOutIcon" />
				<span>로그아웃</span>
			</a>
		</li>
	</ul>
		
	<ul id="gw">
		<li>
			<a href="#">
				<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
				<span>그룹웨어</span>
				<span id="slideSpan">+</span>
			</a>
		</li>
	</ul>
	
	<ul id="accounting">
		<li>
			<a href="#">
				<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
				<span>회계관리</span>
				<span id="slideSpan">+</span>
			</a>
		</li>
	</ul>
	
	<ul id="mis">
		<li>
			<a href="#">
				<img src="/images/main/icons/mainHomeIcon.png" id="mainHomeIcon" />
				<span>경영정보</span>
				<span id="slideSpan">+</span>
			</a>
		</li>
	</ul>
</div>