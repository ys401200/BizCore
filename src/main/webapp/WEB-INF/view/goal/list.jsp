<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">
        <div class="goalContainer">
            <div class="contentHeaders">
                <hr />
                <span id="containerTitle">영업목표설정</span>
				<div class="crudBtns">
                    <button type="button" class="crudAddBtn" onclick="let goal = new Goal(); CommonDatas.Temps.goal.insert();">등록</button>
                </div>
            </div>
			<div class="goalContent"></div>
        </div>
	</div>
</div>
<jsp:include page="../bottom.jsp"/>