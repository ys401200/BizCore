<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents"><div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
	<div id="bodyContent">
                <div class="listContainer">
                <hr class="bodyTitleBorder" />
                <span class="bodyTitle">직원 관리</span>
                <div class="listContent">
                        <div>
                                <div>조 직 도</div>
                                <div class="deptTree"></div>
                        </div><div>
                                <div>상 세 정 보</div>
                                <div class="employeeDetail">
                                        <div><div>사 번</div><div></div></div>
                                        <div><div>이름</div><div></div></div>
                                        <div><div>아이디</div><div></div></div>
                                        <div><div>비번변경</div><div></div></div>
                                        <div><div>비번확인</div><div></div></div>
                                        <div><div>직급</div><div></div></div>
                                        <div><div>로그인</div><div></div></div>
                                        <div><div>입사일</div><div></div></div>
                                        <div><div>퇴사일</div><div></div></div>
                                        <div><div>주민번호</div><div></div></div>
                                        <div><div>휴대전화</div><div></div></div>
                                        <div><div>집주소</div><div></div></div>
                                        <div><div>상세주소</div><div></div></div>
                                        <div><div>집전화</div><div></div></div>
                                        <div><div>이메일</div><div></div></div>
                                        <div><div>등록일</div><div></div></div>
                                        <div><div>수정일</div><div></div></div>
                                </div>
                        </div>
                </div>
        </div>

	</div>
</div>
</div><div class="msg_cnt"></div><div class="ac_cnt" onmouseenter="storage.ac.mouseon=true" onmouseleave="storage.ac.mouseon=false"></div><jsp:include page="../bottom.jsp" /><script src="/js/accountingBankaccount/xlsx.full.min.js"></script>