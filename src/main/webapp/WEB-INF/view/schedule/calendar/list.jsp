<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="../../header.jsp" />
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="searchContainer">
			<jsp:include page="../../listSearch.jsp" />
			<div class="searchMultiContent">
				<div class="searchWriter">
					<span>담당자</span>
					<input type="text" data-complete="user" data-key="userNo" autocomplete="off" id="searchUser" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
				</div>
			</div>
		</div>
		<div class="calendarContainer">
			<div id="calendar"></div>
		</div>
	</div>
</div>
<jsp:include page="../../bottom.jsp" />