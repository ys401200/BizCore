<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="soppSearchContainer">
            <div class="soppSearchSelect">
                <select id="soppSearchCategory">
                    <option value="no">번호</option>
                    <option value="title">영업기회명</option>
                </select>
            </div>
            <div class="soppSearchText">
                <input type="text" id="soppSearchValue">
            </div>
            <div class="soppSearchBtn">
                <button type="button" onclick="soppSearchList();">검색</button>
            </div>
        </div>
        <div class="soppContainer">
            <hr />
            <span>영업기회조회</span>
            <div class="gridSoppList"></div>
            <div class="pageContainer"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>