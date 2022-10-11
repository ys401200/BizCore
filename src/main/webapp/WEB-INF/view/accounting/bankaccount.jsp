<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents"><div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
	<div id="bodyContent">
		<!-- 검색 !!!!!
		<div class="searchContainer">
			<jsp:include page="../listSearch.jsp" />
			<div class="searchMultiContent">
				<div class="searchWriter">
					<span>담당자</span>
					<input type="text" data-type="user" id="searchWriter">
				</div>
				<div class="searchCustomer">
					<span>거래처</span>
					<input type="text" data-type="customer" id="searchCustomer">
				</div>
				<div class="searchType">
					<span>활동형태</span>
					<select id="searchType">
						<option value="">선택</option>
						<option value="회사방문">회사방문</option>
						<option value="기술지원">기술지원</option>
					</select>
				</div>
				<div class="searchDate">
					<span>일정시작일</span>
					<div class="searchGridItem">
						<input type="date" id="searchDateFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
						<span>~</span>
						<input type="date" id="searchDateTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
					</div>
				</div>
			</div>
		</div>
		-->
        <div class="accountingContainer">
            <hr class="bodyTitleBorder" />
            <span class="bodyTitle">은행예금</span>
            <!-- <div class="detailContents"></div> -->
            <div class="accountingContent">
				<div class="accountListExpand"></div><div class="accountHistory">
					<div>
						<div>일자</div>
						<div>기재내용</div>
						<div>입금</div>
						<div>출금</div>
						<div>잔액</div>
						<div>거래점</div>
						<div>통장메모</div>
						<div>메모</div>
						<div>승인?</div>
						<div>연결</div>
						<div>일시</div>
					</div>
					<div>
						<div>22.12.31 12:59</div>
						<div>기재내용기재내용</div>
						<div>100,000,000</div>
						<div>100,000,000</div>
						<div>100,000,000</div>
						<div>거래점포</div>
						<div>통장메모통장메모</div>
						<div>메모메모메모메모</div>
						<div>승인?</div>
						<div>연결</div>
						<div>일시</div>
					</div>
				</div>
			</div>
            <!-- <div class="pageContainer"></div> -->
        </div>

	</div>
</div>
</div><div class="msg_cnt"></div><jsp:include page="../bottom.jsp" />