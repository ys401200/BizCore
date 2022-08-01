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
				<span>결재등록/처리</span>
				<div class="mywritediv">
                <div class="searchForm"></div>
                <div class="writeForm">
					<div class="writeFormTitle"></div>
					<div class="writeFormInfo"></div>
					<div class="writeFormInput"></div>
					<div class="writeFormData"></div>
					<div class="insertedData"></div>
					<div class="buttonField"></div>
				</div>
				

                </div>
				
			</div>
		</div>

	</div>
	<div class="msg_cnt"></div>
	<jsp:include page="../bottom.jsp" />