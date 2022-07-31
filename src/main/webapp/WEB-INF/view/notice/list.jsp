<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="../header.jsp" />
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="noticeSearchContainer">
            <div class="noticeSearchSelect">
                <select id="noticeSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">제목</option>
                </select>
            </div>
            <div class="noticeSearchText">
                <input type="text" id="noticeSearchValue">
            </div>
            <div class="noticeSearchBtn">
                <button type="button" onclick="noticeSearchList();">검색</button>
            </div>
        </div>
		<div class="noticeContainer">
			<hr />
			<span>공지사항 </span>
			<div class="noticeContent"></div>
			<div class="gridNoticeList"></div>
			<div class="pageContainer"></div>
		</div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />