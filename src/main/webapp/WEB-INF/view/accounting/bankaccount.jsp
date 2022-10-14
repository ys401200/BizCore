<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %><jsp:include page="../header.jsp" />
<div id="bodyContents"><div id="sideContents"><jsp:include page="../sideMenu.jsp" /></div>
	<div id="bodyContent">
        <div class="accountingContainer">
            <hr class="bodyTitleBorder" />
            <span class="bodyTitle">은행예금</span>
			<div class="bodyFunc1"><input type="range" min="4" max="10" onchange="changeRange(this)" /><span></span></div>
			<div class="bodyFunc2"><input type="file" id="xlsFile" accept=".xls,.xlsx,.xlsm" onchange="readFile(this)" /><img src="/images/common/diskette.png"  onclick="clickedDisk()" /><img src="/images/common/close.png" onclick="clickedCloseHistory()" /></div>
            <div class="accountingContent">
				<div class="accountListExpand"></div><div class="accountHistory">
					<div>
						<div>일자</div>
						<div>기재내용</div>
						<div>입금</div>
						<div>출금</div>
						<div>잔액</div>
						<div>거래점</div>
						<div>통장메모</div>
						<div>메모</div>
						<div>연결</div>
					</div>
				</div>
				<div class="pageContainer"></div>
			</div>
        </div>

	</div>
</div>
</div><div class="msg_cnt"></div><jsp:include page="../bottom.jsp" /><script src="/js/accountingBankaccount/xlsx.full.min.js"></script>