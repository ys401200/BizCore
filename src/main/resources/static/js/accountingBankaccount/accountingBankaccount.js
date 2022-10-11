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

function drawAccountList(){
	let cnt, html, x, t, bnkcode;

	cnt = document.getElementsByClassName("accountListExpand")[0];

	// 헤더정보 입력 / 은행 계좌번호 최종확인일 잔고 종류 메모
	html = "<div><div>은행</div><div>계좌번호</div><div>최종확인일</div><div>잔고</div><div>종류</div><div>메모</div></div>";

	// 리스트 생성
	for(x = 0 ; x < storage.bankAccount.length ; x++){
		t = "<div onclick=\"clickedAccount(this)\" data-order=\"" + x + "\">";
		t+= ("<div>" + codeToBank(storage.bankAccount[x].bankCode) + "</div>");
		t+= ("<div>" + storage.bankAccount[x].account + "</div>");
		t+= ("<div>" + dateFormat(storage.bankAccount[x].updated) + "</div>");
		t+= ("<div>" + 0 + "</div>");
		t+= ("<div>" + storage.bankAccount[x].type + "</div>");
		t+= ("<input value=\"" + (storage.bankAccount[x].remark === null ? "" : storage.bankAccount[x].remark) + "\" disabled />");
		t+= ("<div></div>");
		t += "</div>";
		html += t;
	}
	cnt.innerHTML = html;
} // End of drawAccountList();

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
	let x, order, cntList, cntContent, parent;

	order = el.dataset.order * 1;
	parent = el.parentElement;
	cntList = document.getElementsByClassName("accountingContent")[0].children[0];
	cntContent = document.getElementsByClassName("accountingContent")[0].children[1];
	cntList.className = "accountListCollect";
	cntContent.style.display = "inline-block";
	for(x = 1 ; x < parent.children.length ; x++)	parent.children[x].children[6].innerText = "";
	el.children[6].innerText = "►";
	console.log(order);
} // End of clickedAccount()

function expandList(){
	let cntList, cntContent;

	order = el.dataset.order * 1;
	cntList = document.getElementsByClassName("accountingContent")[0].children[0];
	cntContent = document.getElementsByClassName("accountingContent")[0].children[1];
	cntList.className = "accountListExpand";
	cntContent.getElementsByClassName.display = "none";
} // End of expandList()
