<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents"><div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
	<div id="bodyContent">
                <div class="listContainer">
                <hr class="bodyTitleBorder" />
                <span class="bodyTitle">직원 관리</span>
                <div class="listContent">
                        <div>
                                <div><div></div><div class="manageSubTitle" style="padding:10px;"><T>조</T><T>직</T><T>도</T></div><div class="image_btns" style="padding: 5px 0;"><img src="/images/manage/user_add.png"><img src="/images/manage/dept_add.png"></div></div>
                                <div class="deptTree"></div>
                        </div><div></div>
                </div>
        </div>

	</div>
</div>
</div><div class="msg_cnt"></div><div class="ac_cnt" onmouseenter="storage.ac.mouseon=true" onmouseleave="storage.ac.mouseon=false"></div><jsp:include page="../bottom.jsp" /><script src="/js/accountingBankaccount/xlsx.full.min.js"></script>