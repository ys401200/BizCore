<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="mywriteContainer">
					<hr />
					<span>새 결재 진행</span>
					<div class="ContentDiv">
						<div class="selectFormDiv">
							<div class='selector'><label for='select_1'>1.결재 양식 선택</label><input type='radio'
									name='radio' id='select_1' class='form' checked>
								<div class='formDetail'>
								</div>
								<div class='selectedForm'></div>
							</div>
							<div class='selector'><label for='select_2'>2.결재선 선택</label><input type='radio' name='radio'
									id='select_2' class='approvalLine'>
								<div class='approvalLineDetail'>
									
									<div>결재선 리스트</div>
								</div>
								<div class='selectedLine'></div>
							</div>
							<div class='selector'><label for='select_3'>3.양식 내용 입력</label><input type='radio'
									name='radio' id='select_3' class='insertForm' onchange='drawSelectedForm()'>
								<div></div>
							</div>
							<div class='selector'><label for='select_4'>4.상신하기</label><input type='radio' name='radio'
									id='select_4' class='sendForm'>
								<div></div>
							</div>
						</div>
						<div class="showSeletedFormDiv"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />