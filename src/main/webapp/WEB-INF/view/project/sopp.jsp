<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:include page="../header.jsp"/>
<div id="bodyContents">
	<div id="sideContents">
		<jsp:include page="../sideMenu.jsp" />
	</div>
	<div id="bodyContent">

        <div class="container">
            <div class="content-title"><div>영업기회</div><div></div></div>
            <div class="sopp-history">
                <div><img src="/images/sopp2/history.png" /> 진행상황</div>
                <div></div>
                <div><input onkeyup="inputtedComment(this, event)" /><button onclick="inputtedComment(this)">⏎</button></div>
                <div><div>관리자 변경</div><div><img onclick="cancleEdit(this)" src="/images/sopp2/circle_close.png" /><img src="/images/sopp2/confirm_circle.png" /></div></div>
                <div></div>
                <div><input onkeyup="inputtedComment(this, event)" /></div>
            </div>
            <div class="sopp-content" onscroll="scrolledSopp(this)">
                <div class="sopp-info">
                        <div><div>관리자</div><div><div></div><img onclick="editSopp('owner')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>담당자</div><div><div></div><img onclick="editSopp('coWorker')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>고객사</div><div><div></div><img onclick="editSopp('customer')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                        <div><div>협력사</div><div><div></div><img onclick="editSopp('partner')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div></div>
                </div>
                <div class="sopp-sticky">
                    <div class="sopp-expected">
                        <div><div><T>예</T><T>상</T><T>매</T><T>출</T><T>:</T></div><div></div><img onclick="editSopp('expected')" class="edit-sopp-img" src="/images/sopp2/edit_square.png" /></div>
                        <div>
                            <div></div>
                            <div><span></span><span></span></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="sopp-progress"></div>
                    <div class="sopp-tab-cnt">
                        <div onclick="moveToTarget(this)" data-target="sopp-info" class="sopp-tab-select">설명</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-schedule" class="sopp-tab">일정</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-estimate" class="sopp-tab">견적</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-contract" class="sopp-tab">계약</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-trade" class="sopp-tab">매입매출</div>
                        <div onclick="moveToTarget(this)" data-target="sopp-attached" class="sopp-tab">관련자료</div>
                    </div>
                </div>
                <div class="sopp-desc"><textarea></textarea></div>
                <div class="sopp-sub-title"><span></span><div class="sopp-tab">일정</div><span></span><span></span><span></span><span></span></div>
                <div class="sopp-schedule"></div>
                <div class="sopp-sub-title"><span></span><span></span><div class="sopp-tab">견적</div><span></span><span></span><span></span></div>
                <div class="sopp-estimate"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><div class="sopp-tab">계약</div><span></span><span></span></div>
                <div class="sopp-contract"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><span></span><div class="sopp-tab">매입매출</div><span></span></div>
                <div class="sopp-trade"></div>
                <div class="sopp-sub-title"><span></span><span></span><span></span><span></span><span></span><div class="sopp-tab">관련자료</div></div>
                <div class="sopp-attached"></div>
            </div>
        </div>

	</div>
</div>
<jsp:include page="../bottom.jsp"/>