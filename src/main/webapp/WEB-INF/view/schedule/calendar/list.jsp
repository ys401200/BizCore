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
				<div class="searchUserDept">
                    <span>부서</span>
                    <select id="searchUserDept" data-key="userDept">
                        <option value="">선택</option>
                        <option value="개발팀">개발팀</option>
                        <option value="영업팀">영업팀</option>
                        <option value="기술팀">기술팀</option>
                        <option value="서울팀">서울팀</option>
						<option value="관리팀">관리팀</option>
						<option value="마케팅팀">마케팅팀</option>
                    </select>
                </div>
			</div>
		</div>
		<div class="calendarContainer">
			<div id="calendar"></div>
		</div>
	</div>
</div>
<jsp:include page="../../bottom.jsp" />