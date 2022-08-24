<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="workJournalContainer">
            <hr />
            <span>업무일지검토</span>
			<button type="button" id="borBtn" onclick="journalChangeBtn(this);">업무일지(차주)</button>
			<button type="button" id="absBtn" onclick="journalChangeBtn(this);">업무일지(금주)</button>
			<button type="button" onclick="print_pdf();">일괄다운로드(PDF)</button>
			<button type="button" onclick="solPdf();">개별다운로드(PDF)</button>
			<button type="button" onclick="solPrint();">출력</button>
            <div class="workJournalContent"></div>
        </div>
	</div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp"/>