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
					<span id="gwSubTabTitle">결재 대기 문서</span>
					<div class="crudBtns batchBtn" style="display:none" >
						<button onclick="doBatchApproval()">승인</button>
						<button onclick="doBatchReject()">반려</button>
					</div>
					<div class="subContainer">
						<div class="listPageDiv">
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