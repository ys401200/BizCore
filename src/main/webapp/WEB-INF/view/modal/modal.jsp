<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" type="text/css" href="/css/modal/modal.css">
<div class="modalContainer"> 
	<div class="modalWrap" id="modal">
		<div class="modal">
			<div class="modalHead">
				<span class="modalHeadTitle">모달 제목</span>
				<span class="xClose" onclick="modal.xClose();"><i class="fa-solid fa-xmark"></i></span>
			</div>
			<div class="modalBody">
				<p>모달 내용칸</p>
			</div>
			<div class="modalFoot"> 
				<span class="modalBtns confirm" id="confirm">확인</span>
				<span class="modalBtns close" id="close">닫기</span>
			</div>
		</div>
	</div>
</div>