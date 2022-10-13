$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		getBankAccountList();
	} // End of prepare()

    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	storage.page = {"max":0,"current":0,"line":0};

	// For Initializing Code . . . . . . .  . . . . 
});

// 서버에서 은행계좌 정보를 가져오는 함수
function getBankAccountList(){
	let url;
	url = apiServer + "/api/accounting/bankaccount";
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let x, list;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				for(x = 0 ; x < list.length ; x++){
					if(list[x].created === undefined)	list[x].created = null;
					if(list[x].branch === undefined)	list[x].branch = null;
					if(list[x].remark === undefined)	list[x].remark = null;
					if(list[x].limit === undefined)		list[x].limit = null;
					if(list[x].created === undefined)	list[x].created = null;
					if(list[x].updated === undefined)	list[x].updated = null;
					if(list[x].deleted === undefined)	list[x].deleted = null;
				}
				storage.bankAccount = list;
				console.log("[getBankAccountList] Success getting bank account information.");
				drawAccountList();
			} else {
				msg.set("[getBankAccountList] Fail to get bank account information.");
			}
		}
	});
} // End of getBankAccountList()

// 서버에서 은행계좌 거래정보를 가져오는 함수
function getBankAccountHistory(bank, account){
	let url;
	url = apiServer + "/api/accounting/bankdetail/" + bank + "/" + account;
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let x, list, row;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				storage.bankHistory = list;
				row = Math.floor((document.getElementsByClassName("accountingContent")[0].clientHeight - 60) / 31 / 5);
				row = row < 4 ? 4 : row > 10 ? 10 : row;
				storage.page.line = row;
				document.getElementsByClassName("bodyFunc1")[0].children[0].value = row;
				storage.page.max = Math.ceil(list.length / (row * 5));
				storage.page.current = 1;
				console.log("[getBankAccountList] Success getting bank account information.");
				drawAccountHistory();
			} else {
				msg.set("[getBankAccountList] Fail to get bank account information.");
			}
		}
	});
} // End of getBankAccountDetail()

function drawAccountList(){
	let cnt, html, x, t;

	cnt = document.getElementsByClassName("accountingContent")[0].children[0];

	// 헤더정보 입력 / 은행 계좌번호 최종확인일 잔고 종류 메모
	html = "<div><div>은행</div><div>계좌번호</div><div>최종확인일</div><div>잔고</div><div>종류</div><div>메모</div></div>";

	// 리스트 생성
	for(x = 0 ; x < storage.bankAccount.length ; x++){
		t = "<div onclick=\"clickedAccount(this)\" data-order=\"" + x + "\">";
		t+= ("<div>" + codeToBank(storage.bankAccount[x].bankCode) + "</div>");
		t+= ("<div>" + storage.bankAccount[x].account + "</div>");
		t+= ("<div>" + dateFormat(storage.bankAccount[x].updated) + "</div>");
		t+= ("<div>" + storage.bankAccount[x].updated.toLocaleString() + "</div>");
		t+= ("<div>" + storage.bankAccount[x].type + "</div>");
		t+= ("<input value=\"" + (storage.bankAccount[x].remark === null ? "" : storage.bankAccount[x].remark) + "\" disabled />");
		t+= ("<div></div>");
		t += "</div>";
		html += t;
	}
	cnt.innerHTML = html;
} // End of drawAccountList();

function drawAccountHistory(){
	let cnt, html, x, list, start, end;

	list = storage.bankHistory;
	start = (storage.page.current - 1) * (storage.page.line * 5);
	end = start + (storage.page.line * 5) - 1;
	end = end >= storage.bankHistory.length ? storage.bankHistory.length - 1 : end;
	cnt = document.getElementsByClassName("accountingContent")[0].children[1];
	html = "<div><div>일자</div><div>기재내용</div><div>입금</div><div>출금</div><div>잔액</div><div>거래점</div><div>통장메모</div><div>메모</div><div>연결</div></div>";

	for(x = start ; x <= end ; x++){
		html += ("<div data-idx=\"" + x + "\">");
		html += ("<div>" + dateFormat(list[x].dt) + "</div>");
		html += ("<div>" + list[x].desc + "</div>");
		html += ("<div>" + list[x].deposit.toLocaleString() + "</div>");
		html += ("<div>" + list[x].withdraw.toLocaleString() + "</div>");
		html += ("<div>" + list[x].balance.toLocaleString() + "</div>");
		html += ("<div>" + (list[x].branch === null ? "" : list[x].branch) + "</div>");
		html += ("<div>" + (list[x].memo1 === null ? "" : list[x].memo1) + "</div>");
		html += ("<input value=\"" + (list[x].memo2 === null ? "" : list[x].memo2) + "\" onkeyup=\"writeMemo(this)\" />");
		html += ("<div><img src=\"" + (list[x].link === "y" ? "/images/common/linkIcon.png" : "/images/common/linkIcon.png") + "\"></div>");
		html +="</div>";
	}
	cnt.innerHTML = html;
	drawPaging();
} // End of drawAccountHostory()

function drawPaging(){
	let cnt, html, current, start, end, limit, padding, x;
	cnt = document.getElementsByClassName("pageContainer")[0];
	limit = storage.page.max;
	padding = 3;
	current = storage.page.current;
	start = current - padding;
	start = start < 1 ? 1 : start;
	end = current + padding;
	end = end > limit ? limit : end;
	console.log("limit : " + limit + " / padding : " + padding + " / current : " + current + " / start : " + start + " / end" + end);
	if(start === 1)			html = "";
	else if(start === 2)	html = "<div onclick=\"clickedPaging(1)\">1</div>";
	else if(start > 2)	html = "<div onclick=\"clickedPaging(1)\">1</div><div>...</div>";
	for(x = start ; x <= end ; x++){
		html += ("<div " + (current !== x ? "onclick=\"clickedPaging(" + x + ")\"" : "class=\"paging_cell_current\"") + ">" + x + "</div>");
	}
	if(end === limit - 1)		html += ("<div onclick=\"clickedPaging(" + limit + ")\">" + limit + "</div>");
	else if(end < limit - 1)	html += ("<div>...</div><div onclick=\"clickedPaging(" + limit + ")\">" + limit + "</div>");

	cnt.innerHTML = html;
} // End of drawPaging()

function clickedPaging(n){
	storage.page.current = n*1;
	drawAccountHistory();
}

// 날짜 포맷 함수
function dateFormat(l){
	let str = "", dt;
	if(l === undefined || l === null || isNaN(l))	return "";
	dt = new Date(l);
	str += (dt.getFullYear() + ".");
	str += ((dt.getMonth()+1) + ".");
	str += (dt.getDate());
	return str;
} // End of dateFormat()

function codeToBank(code){
	let t, bnk = {"002": "KDB산업은행","003": "IBK기업은행","004": "KB국민은행","007": "수협은행","011": "NH농협은행","012": "농협중앙회(단위농축협)","020": "우리은행","023": "SC제일은행","027": "한국씨티은행","031": "대구은행","032": "부산은행","034": "광주은행","035": "제주은행","037": "전북은행","039": "경남은행","045": "새마을금고중앙회","048": "신협중앙회","050": "저축은행중앙회","064": "산림조합중앙회","071": "우체국","081": "하나은행","088": "신한은행","089": "케이뱅크","090": "카카오뱅크","092": "토스뱅크","218": "KB증권","238": "미래에셋대우","240": "삼성증권","243": "한국투자증권","247": "NH투자증권","261": "교보증권","262": "하이투자증권","263": "현대차증권","264": "키움증권","265": "이베스트투자증권","266": "SK증권","267": "대신증권","269": "한화투자증권","271": "토스증권","278": "신한금융투자","279": "DB금융투자","280": "유진투자증권","287": "메리츠증권"};
	t = code === undefined ? "" : bnk[code];
	return t === undefined ? "" : t;
}

function clickedAccount(el){
	let x, order, cntList, cntContent, parent, bank, account;

	order = el.dataset.order * 1;
	parent = el.parentElement;
	cntList = document.getElementsByClassName("accountingContent")[0].children[0];
	cntContent = document.getElementsByClassName("accountingContent")[0].children[1];
	cntContent.innerHTML = "<div><div>일자</div><div>기재내용</div><div>입금</div><div>출금</div><div>잔액</div><div>거래점</div><div>통장메모</div><div>메모</div><div>연결</div></div>";
	document.getElementsByClassName("pageContainer")[0].innerHTML = "";
	cntList.className = "accountListCollect";
	cntContent.style.display = "inline-block";
	for(x = 1 ; x < parent.children.length ; x++)	parent.children[x].children[6].innerText = "";
	document.getElementsByClassName("bodyFunc1")[0].style.display = "inline-block";
	document.getElementsByClassName("bodyFunc2")[0].style.display = "inline-block";
	el.children[6].innerText = "►";
	bank = storage.bankAccount[order].bankCode;
	account = storage.bankAccount[order].account;
	storage.page.account = account;
	storage.page.bank = bank;
	getBankAccountHistory(bank, account);
} // End of clickedAccount()

function clickedCloseHistory(){
	let x, cntList, cntContent;
	cntList = document.getElementsByClassName("accountingContent")[0].children[0];
	cntContent = document.getElementsByClassName("accountingContent")[0].children[1];
	cntList.className = "accountListExpand";
	cntContent.style.display = "none";
	for(x = 1 ; x < cntList.children.length ; x++)	cntList.children[x].children[6].innerText = "";
	document.getElementsByClassName("bodyFunc1")[0].style.display = "none";
	document.getElementsByClassName("bodyFunc2")[0].style.display = "none";
	document.getElementsByClassName("pageContainer")[0].innerHTML = "";
} // End of clickedCloseHostory()

function expandList(){
	let cntList, cntContent;
	order = el.dataset.order * 1;
	cntList = document.getElementsByClassName("accountingContent")[0].children[0];
	cntContent = document.getElementsByClassName("accountingContent")[0].children[1];
	cntList.className = "accountListExpand";
	cntContent.getElementsByClassName.display = "none";
} // End of expandList()

function changeRange(el){
	let v, current;
	v = el.value * 1;
	current = (storage.page.line * 5 * (storage.page.current - 1)) / (v * 5);console.log("current : " + current)
	current = Math.floor(current) + 1;
	storage.page.line = v;
	storage.page.current = current;
	storage.page.max = Math.ceil(storage.bankHistory.length / (v * 5));
	document.getElementsByClassName("bodyFunc1")[0].children[1].innerText = v * 5;
	if(storage.page.handler !== undefined)	window.clearTimeout(storage.page.handler);
	storage.page.handler = window.setTimeout(function(){
		storage.page.handler = undefined;
		document.getElementsByClassName("bodyFunc1")[0].children[1].innerText = "";
	},7000);
	drawAccountHistory();
} // End of changeRange()

function writeMemo(el){
	const memo = el.value;
	const idx = el.parentElement.dataset.idx * 1;
	if(storage.writeMemo !== undefined)	window.clearTimeout(storage.writeMemo);
	storage.writeMemo = window.setTimeout(function(){saveBankAccMemo(idx, memo);},3000)
} // End of writeMemo()

function saveBankAccMemo(idx, memo){
	let dt, deposit, withdraw, balance, desc, url, data, bank, account;
	dt = storage.bankHistory[idx].dt;
	deposit = storage.bankHistory[idx].deposit;
	withdraw = storage.bankHistory[idx].withdraw;
	balance = storage.bankHistory[idx].balance;
	desc = storage.bankHistory[idx].desc === undefined || storage.bankHistory[idx].desc === null ? null : storage.bankHistory[idx].desc;
	account = storage.page.account;
	bank = storage.page.bank;
	data = {
		"dt":dt,
		"deposit":deposit,
		"withdraw":withdraw,
		"balance":balance,
		"desc":desc,
		"memo":memo
	}
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	url = apiServer + "/api/accounting/bankdetail/memo/" + bank + "/" + account;
	$.ajax({
		"url": url,
		"data":data,
		"method": "post",
		"dataType": "json",
		"contentType":"text/plain",
		"cache": false,
		success: (data) => {
			if (data.result === "ok") {
				msg.set("메모를 저장했습니다.");
			} else {
				msg.set("[getBankAccountList] Fail to get bank account information.");
			}
		}
	});
} // End of saveBankAccMemo()