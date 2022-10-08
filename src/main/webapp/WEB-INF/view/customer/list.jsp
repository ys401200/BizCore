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
                <div class="searchName">
                    <span>고객사명</span>
                    <input type="text" id="searchName">
                </div>
                <div class="searchCeoName">
                    <span>대표자명</span>
                    <input type="text" id="searchCeoName">
                </div>
                <div class="searchTaxId">
                    <span>사업자번호</span>
                    <input type="text" id="searchTaxId">
                </div>
            </div>
        </div>
		<div class="customerContainer">
			<hr />
            <span id="containerTitle">고객사조회</span>
            <div class="detailContents"></div>
            <div class="gridCustomerList"></div>
            <div class="pageContainer"></div>
		</div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />