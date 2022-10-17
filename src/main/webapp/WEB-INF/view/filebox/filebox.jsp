<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
		<div class="fileBoxContainer">
			<hr />
			<span>자료실</span>
            <div class="listSearchInput">
                <input type="text" class="searchAllInput" id="searchAllInput" onkeyup="searchInputKeyup();" placeholder="단어를 입력해주세요.">
            </div>
			<div class="fileBoxContent"></div>
			<div class="gridFileBoxList"></div>
			<div class="pageContainer"></div>
		</div>
	</div>
</div>
<jsp:include page="../bottom.jsp" />