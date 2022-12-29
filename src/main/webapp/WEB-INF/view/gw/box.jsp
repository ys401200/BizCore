<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="container">
					<hr />
					<span id="containerTitle">기안 문서함</span>
					<div class="listRange">
						<input type="range" class="listRangeInput" max="100" step="10" value="0" oninput="listRangeChange(this, drawList)">
						<span class="listRangeSpan">0</span>
					</div>
					<div class="gridList">
						<div class="listDiv"></div>
					</div>
					<div class="pageContainer"></div>
				</div>
			</div>
		</div>

		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />
		<script src="/js/gwCommon.js"></script>