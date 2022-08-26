<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="waitSearchContainer">
					<div class="waitSearchSelect">
						<select>
							<option value="no">문서번호</option>
							<option value="type">문서종류</option>
							<option value="customer">거래처</option>
							<option value="title">제목</option>
							<option value="writer">기안자</option>
							<option value="status">진행상태</option>
						</select>
					</div>
					<div class="waitSearchText"><input type="text" id="waitSearchValue"></div>
					<div class="waitSearchBtn"><button type="button" onclick="waitSearchFunction()">검색</button></div>
				</div>
				<div class="container">
					<hr />
					<span>결재 대기 문서</span>

					<div class="subContainer">
						<div class="listPageDiv">
							<div class="batchBtn"><button type="button">일괄 결재 </button></div>
							<div class="listDiv"></div>
							<div class="pageContainer"></div>
						</div>

						<div class="modal-wrap">
							<div class="setApprovalModal">
								<div class="modal-title">결재하기</div>
								<div class="modal-body">
									<div class="labelContainer">
										<label><input type="radio" name="type"/>승인</label>
										<label><input type="radio" name="type" />반려</label>
										<label><input type="radio" name="type" />협의요청</label>
										<label><input type="radio" name="type" />보류</label>
										<label><input type="radio" name="type" />선결</label>
										<label><input type="radio" name="type" />후결</label>
									</div>
									<label>의견 <input type="text"/></label>




								</div>
								<div class="close-wrap">
									<button id="quit" onclick="closeModal(this)">취소</button>

									<button id="set" onclick="closeModal(this)">결재</button>

								</div>


							</div>



						</div>
					</div>
				</div>
			</div>
		</div>

		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />