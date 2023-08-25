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
			<div class="contentHeaders">
				<hr />
				<span>업무일지검토</span>
				<div class="crudBtns">
					<button type="button" class="journalChangeBtn" data-type="next" onclick="CommonDatas.Temps.workJournalSet.journalChange(this);">업무일지(차주)</button>
					<button type="button" onclick="CommonDatas.Temps.workJournalSet.print_pdf();">일괄다운로드(PDF)</button>
					<button type="button" onclick="CommonDatas.Temps.workJournalSet.onePdf();">개별다운로드(PDF)</button>
					<!-- <button type="button" onclick="CommonDatas.Temps.workJournalSet.solPrint();">출력</button> -->
				</div>
			</div>
            <div class="workJournalContent"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>