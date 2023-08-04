<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
		<div class="workReportContainer">
			<div class="contentHeaders">
				<hr />
            	<span>개인업무일지</span>
				<div class="crudBtns">
					<button type="button">업무일지등록(금주)</button>
					<button type="button">업무일지등록(차주)</button>
				</div>
			</div>
            <div class="workReportContent"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>