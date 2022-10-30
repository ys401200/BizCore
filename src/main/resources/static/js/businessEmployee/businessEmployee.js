

$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		
	} // End of prepare()

    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	window.setTimeout(() => {
		let cnt, els, x;
		cnt = document.getElementsByClassName("deptTree")[0];
		cnt.innerHTML = storage.dept.tree.getTreeHtml();
		els = cnt.getElementsByTagName("label");
		for(x = 0 ; x < els.length ; x++){
			if(els[x] === undefined) continue;
			els[x].onclick = getEmployeeDetailInfo;
		}
		els = cnt.getElementsByClassName("dept-tree");
		for(x = 0 ; x < els.length ; x++)	els[x].checked = true;
	},1500);
	

	// For Initializing Code . . . . . . .  . . . . 
});


// 서버에서 직원의 상세 정보를 가져오는 함수
function getEmployeeDetailInfo(){
	let url, empNo;
	if(this.getAttribute("for").substring(0,3) !== "emp")	return;
	empNo = this.getAttribute("for").substring(4);
	if(empNo === undefined)	return;

	url = apiServer + "/api/system/manage/employee/" + empNo;
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			if (data.result === "ok") {
				msg.set("[getEmployeeDetailInfo] Success to get detail employee information.",1);
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				storage.empInfo = list;
				setEmpData();
			} else {
				msg.set("[getEmployeeDetailInfo] Fail to get bank account information.");
			}
		}
	});
} // End of getBankAccountList()


// 엘리먼트에 직원정보를 입력하는 함수
function setEmpData(){
	let cnt, x, y, html, title, t;
	cnt = document.getElementsByClassName("listContent")[0].children[1];

	 html = "";

	// ===== 기본 정보 타이틀 =====
	title = "기본정보";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";

	// ===== 기본 정보 내용 =====
	html += "<div class=\"employeeDetail\">";

	// 사번
	title = "사번";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\">" + storage.empInfo.no + "</div>");

	// 아이디
	title = "아이디";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\">" + storage.empInfo.id + "</div></div>");

	// 비번
	title = "비밀번호";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpPw1\" ><input type=\"password\" data-n=\"pw\" class=\"xEmpPw xEmpInput\" onkeyup=\"collectEmpData(event)\" /></div>");

	title = "비번확인";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpPw2\"><input type=\"password\" data-n=\"pw\" class=\"xEmpPw xEmpInput\"  onkeyup=\"collectEmpData(event)\"/></div></div>");

	// 이름
	title = "이름";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpName xEmpInput\" data-n=\"name\" value=\"" + storage.empInfo.name + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 직급
	title = "직급";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div><select class=\"xEmpRank xEmpInput\" onchange=\"collectEmpData(event)\" data-n=\"rank\" >";
	t = "";
	for(x in storage.userRank)	t = "<option value=\"" + x + "\" " + (storage.empInfo.rank == x ? "selected" : "") + " >" + storage.userRank[x][0] + " / " + storage.userRank[x][1] + "</option>" + t;
	html += (t + "<select></div></div>");

	// 입사일
	title = "입사일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpJoined xEmpInput\" data-n=\"joined\" type=\"date\" value=\"" + (storage.empInfo.joined == null ? "" : (new Date(storage.empInfo.joined)).toISOString().substring(0,10)) + "\" onchange=\"collectEmpData(event)\" /></div>");

	// 퇴사일
	title = "퇴사일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpResigned xEmpInput\" data-n=\"resigned\" type=\"date\" value=\"" + (storage.empInfo.resigned == null ? "" : (new Date(storage.empInfo.resigned)).toISOString().substring(0,10)) + "\" onchange=\"collectEmpData(event)\" /></div></div>");

	// 로그인차단
	title = "로그인";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input type=\"radio\" id=\"xEmpProhibited0\" data-n=\"prohibited\" name=\"xEmpProhibited\" class=\"xEmpProhibited\" style=\"display:none;\" data-v=\"0\" " + (storage.empInfo.prohibited ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited0\" style=\"display:inline-block;margin-right:2rem;padding:0.3rem;\">허 용</label><input type=\"radio\" id=\"xEmpProhibited1\" name=\"xEmpProhibited\" class=\"xEmpProhibited\" style=\"display:none;\" data-n=\"prohibited\" data-v=\"1\" " + (storage.empInfo.prohibited ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited1\" style=\"display:inline-block;margin-right:2rem;padding:0.3rem;\">차 단</label></div>");

	// 주민번호
	if(storage.empInfo.birthDay !== undefined && storage.empInfo.birthDay !== null)	t = storage.empInfo.birthDay.replaceAll("-","").substring(2);
	else t = "      ";
	if(storage.empInfo.residentNo !== undefined && storage.empInfo.residentNo !== null)	t += storage.empInfo.residentNo;
	else t += "       ";
	title = "주민번호";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div>";
	for(x = 0 ; x < t.length ; x++)	html += ("<input class=\"xEmpResNo xEmpInput\" data-n=\"residentNo\" maxlength=\"1\" value=\"" + t[x].trim() + "\" onkeyup=\"collectEmpData(event)\" onfocus=\"this.select()\" " + (x > 6 ? "type=\"password\"" : "") + " />" + (x === 5 ? "<span style=\"width:1.2rem;text-align:center;margin-right:0.5rem;\">-</span>" : ""));
	html += "</div></div>";

	// 집주소
	title = "집주소";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input type=\"hidden\" id=\"postCode\" class=\"xEmpAddr\"/><input id=\"mainAddress\" class=\"xEmpAddr xEmpInput\" data-n=\"address\" value=\"" + (storage.empInfo.address == null ? "" : storage.empInfo.address.split("===")[0]) + "\" onclick=\"daumPostCode()\" /></div>");

	// 상세주소
	title = "상세주소";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input id=\"detailAddress\" class=\"xEmpAddr xEmpInput\" data-n=\"address\" value=\"" + (storage.empInfo.address == null ? "" : storage.empInfo.address.split("===")[0]) + "\" onkeyup=\"collectEmpData(event)\" onfocus=\"collectEmpData(event)\" /></div></div>");

	// 집전화
	title = "집전화";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpPhone xEmpInput\" data-n=\"homePhone\" value=\"" + (storage.empInfo.homePhone === null ? "" : storage.empInfo.homePhone) + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 휴대전화
	title = "휴대전화";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpCellNo xEmpInput\" data-n=\"cellPhone\" value=\"" + (storage.empInfo.cellPhone === null ? "" : storage.empInfo.cellPhone) + "\" onkeyup=\"collectEmpData(event)\" /></div></div>");

	// 이메일
	title = "이메일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpEmail xEmpInput\" data-n=\"email\" value=\"" + (storage.empInfo.email === null ? "" : storage.empInfo.email) + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 등록일
	title = "등록일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.empInfo.created == null ? "" : (new Date(storage.empInfo.created)).toISOString().substring(0,10)) + "</div></div>");

	// 수정일
	title = "수정일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.empInfo.modified == null ? "" : (new Date(storage.empInfo.modified)).toISOString().substring(0,10)) + "</div>");

	// 삭제일
	title = "삭제일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.empInfo.deleted == null ? "" : (new Date(storage.empInfo.deleted)).toISOString().substring(0,10)) + "</div></div>");





	


	

	cnt.innerHTML = html;

} // End of setEmpData


function collectEmpData(e){
	let v, n, t, x;
	v = e.target.className === "xEmpProhibited" ? e.target.dataset.v*1 : e.target.value.trim();
	n = e.target.dataset.n;
	if(storage.collected === undefined)	storage.collected = {};

	console.log(n + " / " + v);

	// 비밀번호 변경일 경우의 검증
	if(n === "pw"){
		t = document.getElementsByClassName("xEmpPw");
		v = [];
		v[0] = t[0].value;
		v[1] = t[1].value;
		if(v[0] !== v[1] || v[0].length < 8){
			t[0].style.backgroundColor = "#ffeff3";
			t[1].style.backgroundColor = "#ffeff3";
			return;
		}else{
			t[0].style.backgroundColor = "";
			t[1].style.backgroundColor = "";
			v = v[0];
		}
	}else if(n === "residentNo"){
		if(e.target.nextElementSibling !== null){
			if(e.target.nextElementSibling.tagName === "SPAN")	e.target.nextElementSibling.nextElementSibling.focus();
			else	e.target.nextElementSibling.focus();
		}
		v = "";
		t = document.getElementsByClassName("xEmpResNo");
		for(x = 0 ; x < t.length ; x++)	v += t[x].value.trim();
		if(v.length < 13)	return;
		v = [v.substring(0,6), v.substring(6,7) * 1 - 1, v.substring(6)];
		t = [v[0].substring(0,2) * 1 + 2000, v[0].substring(2,4), v[0].substring(4)];
		if(t[0] > (new Date()).getFullYear())	t[0] -= 100;
		v[0] = t[0] + "-" + t[1] + "-" + t[2];
		v[1] = v[1] % 2;
		storage.collected.birthDay = v[0];
		storage.collected.gender = v[1];
		storage.collected.residentNo = v[2];
		return;
	}else if(n === "address"){
		v = [];
		t = document.getElementsByClassName("xEmpAddr");
		v[0] = t[0].value * 1;
		v[1] = t[1].value;
		v[2] = t[2].value;
		if(!isNaN(v[0]) && v[0] > 10000)	storage.collected.zipCode = v[0];
		if(v[1] !== undefined && v[1] !== ""){
			if(storage.collected.address === undefined)	storage.collected.address = ["",""];
			storage.collected.address[0] = v[1];
		}
		if(v[2] !== undefined && v[2] !== ""){
			if(storage.collected.address === undefined)	storage.collected.address = ["",""];
			storage.collected.address[1] = v[2];
		}
		return;
	}

	storage.collected[n] = v;
}





// =======================================================================================


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