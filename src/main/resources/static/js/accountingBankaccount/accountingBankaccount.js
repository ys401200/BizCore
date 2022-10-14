let bnkXls = {};

bnkXls.code = {"002": "KDB산업은행","003": "IBK기업은행","004": "KB국민은행","007": "수협은행","011": "NH농협은행","012": "농협중앙회(단위농축협)","020": "우리은행","023": "SC제일은행","027": "한국씨티은행","031": "대구은행","032": "부산은행","034": "광주은행","035": "제주은행","037": "전북은행","039": "경남은행","045": "새마을금고중앙회","048": "신협중앙회","050": "저축은행중앙회","064": "산림조합중앙회","071": "우체국","081": "하나은행","088": "신한은행","089": "케이뱅크","090": "카카오뱅크","092": "토스뱅크","218": "KB증권","238": "미래에셋대우","240": "삼성증권","243": "한국투자증권","247": "NH투자증권","261": "교보증권","262": "하이투자증권","263": "현대차증권","264": "키움증권","265": "이베스트투자증권","266": "SK증권","267": "대신증권","269": "한화투자증권","271": "토스증권","278": "신한금융투자","279": "DB금융투자","280": "유진투자증권","287": "메리츠증권"};
    
	bnkXls.rxp = [
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{4})+[-]+(\\d{3})$",["004"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{5})+[-]+(\\d{1})$",["002","007","081"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})$",["023","088"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})+[-]+(\\d{1})$",["003","032"]],
		["^(\\d{3})+[-]+(\\d{3})+[-]+(\\d{6})$",["088","089"]],
		["^(\\d{3})+[-]+(\\d{4})+[-]+(\\d{4})+[-]+(\\d{2})$",["011","032"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{2})+[-]+(\\d{3})$",["003"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{3})$",["027","081"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{5})$",["081"]],
		["^(\\d{3})+[-]+(\\d{7})+[-]+(\\d{1})+[-]+(\\d{3})$",["002"]],
		["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{1})$",["007"]],
		["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{3})$",["002"]],
		["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})$",["090"]],
		["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})+[-]+(\\d{1})$",["004"]],
		["^(\\d{4})+[-]+(\\d{3})+[-]+(\\d{6})$",["020"]],
		["^(\\d{6})+[-]+(\\d{2})+[-]+(\\d{6})$",["004"]]
    ]

    bnkXls.readXlsFile = function(file){
      let reader, evfn;
      reader = new FileReader();
	  console.log("STEP 2 : Read xls file second stage");
      evfn = function(){
        let data, wrkBook;
        data = this.result;
        wrkBook = XLSX.read(data, {"type":"binary"});
        bnkXls.parseXlsFile(wrkBook);
      } // End of Anonymous Function in readExcel()

      reader.readAsBinaryString(file);
      reader.onload = evfn;
    } // End of bnkXls.readXlsFile()

    bnkXls.parseXlsFile = function(wb){
      let r, c, x, y, z, t, spLine, data = [], data1, data2, result;
      let bnkList, accList;
	  console.log("STEP 3 : data arrange with parsed data");
      // A1 타입 셀 이름 추출
      t = [];
      for(x in wb.Sheets[wb.SheetNames[0]]) if(x.substring(0,1) !== "!")  t.push(x);
      t.sort();

      // 2차원 배열로 변환
      for(x in t){
        r = t[x].substring(0,1).charCodeAt() - 65;
        c = t[x].substring(1) * 1 - 1;
        if(data[c] === undefined) data[c] = [];
        data[c][r] = wb.Sheets[wb.SheetNames[0]][t[x]].v;
      }
      
      // 헤더부분과 본문 부분 구분하기
      // 1차 시도 / 빈 줄 찾기
      for(x = 0 ; x < data.length ; x++)  if(data[x] === undefined) spLine = x;

      // 1차 시도 성공여부 검증 / 실패시 2차 시도 / row 중 숫자가 없는 row 찾기
      t = undefined;
      if(spLine === undefined){
          for(x = 0 ; x < data.length ; x++){
            if(data[x] !== undefined && !bnkXls.haveNumeric(data[x])) spLine = x;
          }
      }
      console.log(spLine);
      data1 = data.slice(0, spLine);
      data2 = data.slice(spLine);

      // ================ 은행명과 계좌번호 찾기 ===================
      bnkList = []; // 은행명 추정 데이터
      accList = []; // 계좌번호 추정 데이터
      t = [];

      // 추정 은행명 수집
      for(x = 0 ; x < data1.length ; x++) for(y = 0 ; y < data1[x].length ; y++)  t.push(data1[x][y]); // 2차원 배열을 1차원 배열로 전환
      
      // 추정 계좌번호 수집
      for(x = 0 ; x < t.length ; x++){
        if(t[x].includes("은행")) bnkList.push(t[x]);
        else{
          y = bnkXls.charCut(t[x]);
          if(y !== null && y !== undefined && y.includes("-")) accList.push(y);
        }
      }

      // 추정 계좌번호 중 날짜 형식 제거
      y = [new RegExp("^(\\d{4})+[-]+(\\d{1,2})+[-]+(\\d{1,2})$"), new RegExp("^(\\d{2})+[-]+(\\d{1,2})+[-]+(\\d{1,2})$")];
      t = [];
      for(x = 0 ; x < accList.length ; x++){
        if(!y[0].test(accList[x]) && !y[1].test(accList[x]))  t.push(accList[x]);
      }
      accList = t;
      
      // 추정 은행명이 없는 경우 정규식으로 재 추정 시도
      if(bnkList.length === 0 && accList.length > 0){
        t = accList[0];
        y = null;
        for(x = 0 ; x < bnkXls.rxp.length ; x++){          
          reg = new RegExp(bnkXls.rxp[x][0]);
          if((reg.test(t))){
            for(z = 0 ; z < bnkXls.rxp[x][1].length ; z++){
              y = bnkXls.code[bnkXls.rxp[x][1][z]];
              bnkList.push(y);
            }
          }
        }
      }

      // ================ 거래내역 정리하기 ===================      
      // 헤더 정리
      r = [-1,-1,-1,-1,-1,-1,-1,-1]; // 0-거래일시(일시,날짜,월일) 1-적요(적요) 2-내용(내용) 3-입금(입금,넣) 4-출금(출금,지금,찾) 5-잔액(잔액) 6-취급점(취급점,거래점) 7-메모(메모) 
      for(z in data2){
        t = data2[z];
        break;
      }
      z = z * 1;

      for(x = 0 ; x < t.length ; x++){
        if(t[x].includes("일시") || t[x].includes("월일") || t[x].includes("날짜")) r[0] = x;
        else if(t[x].includes("적요")) r[1] = x;
        else if(t[x].includes("내용")) r[2] = x;
        else if((t[x].includes("입금") || t[x].includes("넣")) && !t[x].includes("입금인")) r[3] = x;
        else if(t[x].includes("출금") || t[x].includes("지급") || t[x].includes("찾")) r[4] = x;
        else if(t[x].includes("잔액")) r[5] = x;
        else if(t[x].includes("취급점") || t[x].includes("거래점")) r[6] = x;
        else if(t[x].includes("메모")) r[7] = x;
      }

      t = [];
      for(x = z + 1 ; x < data2.length ; x++){
        if(r[0] >= 0 && data2[x][r[0]] === undefined) break;
        if(r[1] >= 0 && data2[x][r[1]] === undefined) break;
        if(r[2] >= 0 && data2[x][r[2]] === undefined) break;
        if(r[3] >= 0 && data2[x][r[3]] === undefined) break;
        if(r[4] >= 0 && data2[x][r[4]] === undefined) break;
        if(r[5] >= 0 && data2[x][r[5]] === undefined) break;
        if(r[6] >= 0 && data2[x][r[6]] === undefined) break;
        y = [data2[x][r[0]].replaceAll("(","").replaceAll(")",""), data2[x][r[1]], data2[x][r[2]], data2[x][r[3]], data2[x][r[4]], data2[x][r[5]], data2[x][r[6]], data2[x][r[7]] === undefined ? null : data2[x][r[7]]];
        t.push(y);
      }
      t.sort(function(a,b){let x,y;x=new Date(a[0]);y=new Date(b[0]);return x.getTime()-y.getTime();})
      result = {"bnkList":bnkList,"accList":accList,"detail":t};
	  console.log("STEP 4 : End of data arrange");
      console.log(result);
      processAccData(result);
    } // End of bnkXls.parseXlsFile()

    bnkXls.haveNumeric = function(arr){
      let x, y, z;
      if(arr === undefined) return false;
      if(typeof arr === "string"){
        for(x = 0 ; x < arr.length ; x++){
          z = arr.substring(x,x+1);
          z = z.charCodeAt();
          if(z > 47 && z < 58)  return true;
        }
      }else if(typeof arr === "object"){
        for(x = 0 ; x < arr.length ; x++){
          if(arr[x] !== undefined)  for(y = 0 ; y < arr[x].length ; y++){
            z = arr[x].substring(y,y+1);
            z = z.charCodeAt();
            if(z > 47 && z < 58)  return true;
          }
        }
      }
      return false;
    } // End of bnkXls.haveNumeric()

    bnkXls.charCut = (str)=>{
      let result="", x , y = 0, z = 0;
      for(x = 0 ; x < str.length ; x++){
        console.log(x + " / " + str[x] + " / y : " + y)
        if(str[x].charCodeAt() === 45){
          if(z === 0) z = 1;
          else break;
          if(y === 0) y = 1;
          result += str[x];
        }else if(str[x].charCodeAt() >= 48 && str[x].charCodeAt() <= 57){
          if(y === 0) y = 1;
          result += str[x];
          z = 0;
        }//else if(x === 1) break;
      }
      if(result === "") return null;
      else return result;
    } // End of bnkXls.charCut()

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
				list = list.replaceAll("\r","").replaceAll("\n","").replaceAll("\t","");
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

// 엑셀파일 입력 버튼 클릭시 실행되는 이벤트 리스너
function clickedDisk(){document.getElementById("xlsFile").click();}

// 엑셀 파일 선택시 실행되는 함수
function readFile(el){
	let file =  el.files[0];
	console.log("STEP 1 : Read xls file");
	storage.bankHistoryForParse = undefined;
	if(file === null)	return null;
	else bnkXls.readXlsFile(file);
} // End of readFile();

// 파싱된 엑셀 파일 데이터를 처리하는 메서드
function processAccData(data){
	let from, to, html, x;
	console.log("STEP 5 : prepare show data to user");
	// 파싱된 데터ㄹ 저장함
	storage.parseData = data;

	// 파일 엘리먼트를 초기화 함
	document.getElementById("xlsFile").value = "";

	// 파싱된 데이터의 빠른 시간과 늦은 시간을 구하고 이를 서버에 전닳하여 기존 데이터를 요청함
	from = data.detail[0][0];
	to = data.detail[data.detail.length - 1][0];
	from = (new Date(from)).getTime();
	to = (new Date(to)).getTime();
	getBankAccountHistoryWithDate(storage.page.bank, storage.page.account, from, to);

	// 모달을 띄우고 파싱된 데이터를 화면에 보여줌
	if(data.detail !== undefined && data.detail !== null && data.detail.length > 0){
		html = "<div class=\"parsedTitle\" data-idx=\"-1\"><div>일자</div><div>기재내용</div><div>입금</div><div>출금</div><div>잔액</div><div>거래점</div><div><input type=\"checkbox\" onclick=\"clickedCheckAll(this)\" checked /></div></div>";
		for(x = 0 ; x < data.detail.length ; x++){
			html += ("<div class=\"parsedItem\" data-idx=\"" + x + "\"><div>" + data.detail[x][0] + "</div><div>" + data.detail[x][2] + "</div><div>" + data.detail[x][3].toLocaleString() + "</div><div>" + data.detail[x][4].toLocaleString() + "</div><div>" + data.detail[x][5].toLocaleString() + "</div><div>" + data.detail[x][6] + "</div><div><input type=\"checkbox\" checked /></div></div>");
		}
	}
	console.log("STEP 6 : show modal");
	modal.show();
	modal.head.html("<div style=\"padding:1rem 0.2rem\">엑셀 파일에서 거래내역 추가</div>")
	modal.body.html(html);
	modal.confirm.html("등록");
	modal.confirm.click(saveDetailDataToServer);
} // End of processAccData();

function postProcessAccData(){
	let t1, t2, dt, x, y, data = storage.parseData;

	for(x = 0 ; x < storage.bankHistoryForParse.length ; x++){
		t1 = storage.bankHistoryForParse[x];
		for(y = 0 ; y < data.detail.length ; y++){
			t2 = data.detail[y];
			dt = (new Date(t2[0])).getTime();
			console.log("x : " + x + " / y : " + y + " / dt : " + dt);
			console.log("t1");
			console.log(t1);
			console.log("t2");
			console.log(t2);

			console.log("dt === t1.dt -- " + (t1.dt === dt) + " / dt : " + dt + " / t1.dt" + t1.dt);
			console.log("t1.deposit === t2[3] --" + (t1.deposit === t2[3]));
			console.log("t1.withdraw === t2[4] -- " + (t1.withdraw === t2[4]));
			console.log("t1.balance === t2[5] -- " + (t1.balance === t2[5]));

			if(dt === t1.dt && t1.deposit === t2[3] && t1.withdraw === t2[4] && t1.balance === t2[5]){
				console.log(" !!!!!!!!!" + x + " / " + y);
				document.getElementsByClassName("parsedItem")[y].className = "parsedItem savedItem";
				document.getElementsByClassName("parsedItem")[y].children[6].children[0].checked = false;
				document.getElementsByClassName("parsedItem")[y].children[6].children[0].disabled = true;
			}
		}
	}
}

function getBankAccountHistoryWithDate(bank, account, from, to){
	let url;
	url = apiServer + "/api/accounting/bankdetail/" + bank + "/" + account + "/" + from + "/" + to;
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let x, list, row;
			if (data.result === "ok") {
				console.log("=================== 1")
				list = cipher.decAes(data.data);
				list = list.replaceAll("\r","").replaceAll("\n","").replaceAll("\t","");
				list = JSON.parse(list);
				storage.bankHistoryForParse = list;
				postProcessAccData();
			} else {
				console.log("=================== 2")
			}
		}
	});
} // End of getBankAccountDetail()

function clickedCheckAll(el){
	let els, x;
	els = el.parentElement.parentElement.parentElement.getElementsByTagName("input");
	for(x = 0 ; x < els.length ; x++){
		if(els[x] === el || els[x].disabled === true) continue;
		els[x].checked = el.checked;
	}
}

// 은행 거래내역을 추가하는 함수
function saveDetailDataToServer(){
	let url, data = [], x, els, arr = [], bank, account;
	els = document.getElementsByClassName("modalBody")[0].getElementsByTagName("input");
	for(x = 0 ; x < els.length ; x++)	if(els[x].checked)	arr.push(els[x].parentElement.parentElement.dataset.idx * 1);
	for(x = 0 ; x < arr.length ; x++)	if(arr[x] >= 0)		data.push(storage.parseData.detail[arr[x]]);
	for(x = 0 ; x < data.length ; x++)	data[x][0] = (new Date(data[x][0])).getTime();
	console.log(data);

	if(data.length === 0)	return;

	data = JSON.stringify(data);
	data = cipher.encAes(data);
	account = storage.page.account;
	bank = storage.page.bank;

	url = apiServer + "/api/accounting/bankdetail/detail/" + bank + "/" + account;
	$.ajax({
		"url": url,
		"data":data,
		"method": "post",
		"dataType": "json",
		"contentType":"text/plain",
		"cache": false,
		success: (data) => {
			if (data.result === "ok") {
				console.log(data.data);
			} else {
				console.log(data.msg);
			}
		}
	});
	modal.hide();
}