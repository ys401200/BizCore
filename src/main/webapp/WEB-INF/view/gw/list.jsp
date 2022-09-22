<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<!-- <div class="searchContainer">
					<div class="searchSelect">
						<select>
							<option value="no">문서번호</option>
							<option value="type">문서종류</option>
							<option value="customer">거래처</option>
							<option value="title">제목</option>
							<option value="writer">기안자</option>
							<option value="status">진행상태</option>
						</select>
					</div>
					<div class="searchText"><input type="text" id="searchValue"></div>
					<div class="searchBtn"><button type="button" >검색</button></div>
				</div> -->
				<div class="container">
					<hr />
					<span id="gwSubTabTitle">결재 대기 문서</span>

					<div class="subContainer">
						<div class="listPageDiv">
							<!-- <div class="batchBtn"><button type="button">일괄 결재 </button></div> -->
							<div class="listDiv"></div>
							<div class="pageContainer"></div>
						</div>
						<div class="modal-wrap"></div>
					</div>
				</div>
			</div>
		</div>

		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />