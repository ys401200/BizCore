<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>   
<div id="bodyChart_1">
	<hr />
	<span>연간 계획대비 실적</span>
	<div class="chartContentContainer">
		<canvas id="chartContent_1"></canvas>
	</div>
</div>

<div id="bodyChart_2">
	<hr />
	<span>월간 계획대비 실적</span>
	<div class="chartContentContainer">
		<canvas id="chartContent_2"></canvas><br />
		<div id="chartContentInfo"></div>
	</div>
</div>

<div id="bodyChart_3">
	<hr />
	<span>누적 계획대비 실적</span>
	<div class="chartContentContainer">
		<canvas id="chartContent_3"></canvas><br />	
		<div id="chartContentInfo"></div>
	</div>
</div>

<div id="bodyChart_4">
	<hr />
	<span>누적 판매방식 실적</span>
	<div class="chartContentContainer">
		<canvas id="chartContent_4"></canvas><br />
	</div>
</div>

<div id="bodyNotice">
	<hr />
	<span>공지사항</span>
	<div class="gridNoticeList"></div>
</div>

<div id="bodySched">
	<hr />
	<span>일정조회</span>
	<div class="gridScheduleList"></div>
</div>

<!-- <div id="bodySales">
	<hr />
	<span>영업활동</span>
	<div class="gridSalesList"></div>
</div>

<div id="bodyTech">
	<hr />
	<span>기술지원</span>
	<div class="gridTechList"></div>
</div> -->

<div id="bodySopp">
	<hr />
	<span>영업기회</span>
	<div class="gridSoppList"></div>
</div>

<div id="bodyContract">
	<hr />
	<span>계약조회</span>
	<div class="gridContractList"></div>
</div>
	

	

