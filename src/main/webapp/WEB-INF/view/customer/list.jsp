<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="../header.jsp" />
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="searchContainer">
            <jsp:include page="../listSearch.jsp" />
            <div class="searchMultiContent">
                <div class="searchTitle">
                    <span>제목</span>
                    <input type="text" id="searchTitle">
                </div>
                <div class="searchWriter">
                    <span>담당자</span>
                    <input type="text" data-type="user" id="searchWriter">
                </div>
                <div class="searchCreated">
                    <span>등록일</span>
                    <div class="searchGridItem">
                        <input type="date" id="searchCreatedFrom" data-date-type="from" onchange="searchDateDefaultSet(this);">
                        <span>~</span>
                        <input type="date" id="searchCreatedTo" data-date-type="to" onchange="searchDateDefaultSet(this);">
                    </div>
                </div>
            </div>
        </div>
		<div class="customerContainer">
			<hr />
			<span>공지사항 </span>
			<div class="customerContent"></div>
			<div class="gridCustomerList"></div>
			<div class="pageContainer"></div>
		</div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />