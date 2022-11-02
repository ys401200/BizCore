

$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		
	} // End of prepare()

    init();
    getCorporateAssetInfo();

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
			els[x].onclick = getDetailInfo;
		}
		els = cnt.getElementsByClassName("dept-tree");
		for(x = 0 ; x < els.length ; x++)	els[x].checked = true;
	},1500);
	

	// For Initializing Code . . . . . . .  . . . . 
});

// 부서 혹은 직원 클릭시 실행되는 함수
function getDetailInfo(){
	let empNo, dept;
	if(this.getAttribute("for").substring(0,3) === "emp"){
		empNo = this.getAttribute("for").substring(4);
		dept = this.parentElement.previousSibling.children[0].getAttribute("for").substring(10);
		getEmployeeDetailInfo(empNo, dept);
	}else if(this.getAttribute("for").substring(0,4) === "dept"){
		dept = this.getAttribute("for").substring(10);
		getDeptDetailInfo(empNo, dept); // ==================== 해당 함수 만들어야 함
	}
} // End of getDetailInfo()()

// 부서 클리기 실행되는 함수
function getDeptDetailInfo(){

} // End of getDeptDetailInfo()


// 서버에서 직원의 상세 정보를 가져오는 함수
function getEmployeeDetailInfo(empNo, dept){
	let url;
	if(empNo === undefined)	return;

	url = apiServer + "/api/manage/employee/" + dept + "/" + empNo;
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
				storage.basic = list.basic;
				storage.annualLeave = list.annualLeave;
				storage.permission = list.permission;
				setEmpData();
			} else {
				msg.set("[getEmployeeDetailInfo] Fail to get bank account information.");
			}
		}
	});
} // End of getBankAccountList()

// 서버에서 법인카드 정보를 가져오는 함수
function getCorporateAssetInfo(){
	let url;

	url = apiServer + "/api/manage/corporateasset";
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				storage.card = list.card;
				storage.vehicle = list.vehicle;
			} else {
				msg.set("[getEmployeeDetailInfo] Fail to get bank account information.");
			}
		}
	});
} // End of getCorporateCardInfo()

// 엘리먼트에 직원정보를 입력하는 함수
function setEmpData(){
	let cnt, x, y, html, title, t, t1, t2;
	cnt = document.getElementsByClassName("listContent")[0].children[1];

	 html = "";

	// =========================================== 기본 정보 타이틀 ===========================================
	title = "기본정보";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" /><img src=\"/images/manage/icon_confirm.png\" /></div></div>";

	// =========================================== 기본 정보 내용 ===========================================
	html += "<div class=\"employeeDetail\">";

	// 사번
	title = "사번";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\">" + storage.basic.no + "</div>");

	// 아이디
	title = "아이디";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\">" + storage.basic.id + "</div></div>");

	// 비번
	title = "비밀번호";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpPw1\" ><input type=\"password\" data-p=\"basic\" data-n=\"pw\" class=\"xEmpPw xEmpInput\" onkeyup=\"collectEmpData(event)\" /></div>");

	title = "비번확인";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpPw2\"><input type=\"password\" data-p=\"basic\"  data-n=\"pw\" class=\"xEmpPw xEmpInput\"  onkeyup=\"collectEmpData(event)\"/></div></div>");

	// 이름
	title = "이름";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpName xEmpInput\" data-p=\"basic\" data-n=\"name\" value=\"" + storage.basic.name + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 직급
	title = "직급";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div><select class=\"xEmpRank xEmpInput\" onchange=\"collectEmpData(event)\" data-p=\"basic\"  data-n=\"rank\" >";
	t = "";
	for(x in storage.userRank)	t = "<option value=\"" + x + "\" " + (storage.basic.rank == x ? "selected" : "") + " >" + storage.userRank[x][0] + " / " + storage.userRank[x][1] + "</option>" + t;
	html += (t + "<select></div></div>");

	// 입사일
	title = "입사일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpJoined\" data-n=\"joined\" type=\"date\">" + (storage.basic.joined == null ? "" : (new Date(storage.basic.joined)).toISOString().substring(0,10)) + "</div>");

	// 퇴사일
	title = "퇴사일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpResigned xEmpInput\" data-p=\"basic\" data-n=\"resigned\" type=\"date\" value=\"" + (storage.basic.resigned == null ? "" : (new Date(storage.basic.resigned)).toISOString().substring(0,10)) + "\" onchange=\"collectEmpData(event)\" /></div></div>");

	// 로그인차단
	title = "로그인";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input type=\"radio\" id=\"xEmpProhibited0\" data-p=\"basic\" data-n=\"prohibited\" name=\"xEmpProhibited\" class=\"xEmpProhibited radioSwitch\" data-v=\"0\" " + (storage.basic.prohibited ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited0\">허 용</label><input type=\"radio\" id=\"xEmpProhibited1\" name=\"xEmpProhibited\" class=\"xEmpProhibited radioSwitch\" data-n=\"prohibited\" data-v=\"1\" " + (storage.basic.prohibited ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited1\">차 단</label></div>");

	// 주민번호
	if(storage.basic.birthDay !== undefined && storage.basic.birthDay !== null)	t = storage.basic.birthDay.replaceAll("-","").substring(2);
	else t = "      ";
	if(storage.basic.residentNo !== undefined && storage.basic.residentNo !== null)	t += storage.basic.residentNo;
	else t += "       ";
	title = "주민번호";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div>";
	for(x = 0 ; x < t.length ; x++)	html += ("<input class=\"xEmpResNo xEmpInput\" data-p=\"basic\" data-n=\"residentNo\" maxlength=\"1\" value=\"" + t[x].trim() + "\" onkeyup=\"collectEmpData(event)\" onfocus=\"this.select()\" " + (x > 6 ? "type=\"password\"" : "") + " />" + (x === 5 ? "<span style=\"width:1.2rem;text-align:center;margin-right:0.5rem;\">-</span>" : ""));
	html += "</div></div>";

	// 집주소
	title = "집주소";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input type=\"hidden\" id=\"postCode\" class=\"xEmpAddr\"/><input id=\"mainAddress\" class=\"xEmpAddr xEmpInput\" data-p=\"basic\" data-n=\"address\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address.split("===")[0]) + "\" onclick=\"daumPostCode()\" /></div>");

	// 상세주소
	title = "상세주소";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input id=\"detailAddress\" class=\"xEmpAddr xEmpInput\" data-p=\"basic\" data-n=\"address\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address.split("===")[1]) + "\" onkeyup=\"collectEmpData(event)\" onfocus=\"collectEmpData(event)\" /></div></div>");

	// 집전화
	title = "집전화";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpPhone xEmpInput\" data-p=\"basic\" data-n=\"homePhone\" value=\"" + (storage.basic.homePhone === null ? "" : storage.basic.homePhone) + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 휴대전화
	title = "휴대전화";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpCellNo xEmpInput\" data-p=\"basic\" data-n=\"cellPhone\" value=\"" + (storage.basic.cellPhone === null ? "" : storage.basic.cellPhone) + "\" onkeyup=\"collectEmpData(event)\" /></div></div>");

	// 이메일
	title = "이메일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input class=\"xEmpEmail xEmpInput\" data-p=\"basic\" data-n=\"email\" value=\"" + (storage.basic.email === null ? "" : storage.basic.email) + "\" onkeyup=\"collectEmpData(event)\" /></div>");

	// 등록일
	title = "등록일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.basic.created == null ? "" : (new Date(storage.basic.created)).toISOString().substring(0,10)) + "</div></div>");

	// 수정일
	title = "수정일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.basic.modified == null ? "" : (new Date(storage.basic.modified)).toISOString().substring(0,10)) + "</div>");

	// 삭제일
	title = "삭제일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div>" + (storage.basic.deleted == null ? "" : (new Date(storage.basic.deleted)).toISOString().substring(0,10)) + "</div></div></div>");

	
	// =========================================== 부 서 설 정  타 이 틀 ===========================================
	title = "부서설정";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" /><img src=\"/images/manage/icon_confirm.png\" /></div></div>";
	
	// =========================================== 부 서 설 정  내 용 ===========================================
	html += "<div class=\"employeeDetail\">";

	// 부서장
	title = "부서장";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"deptHead\" id=\"deptHead1\" data-p=\"permission\" data-n=\"head\" data-v=\"1\" " + (storage.permission.head ? "checked" : "") + " /><label for=\"deptHead1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"deptHead\" id=\"deptHead0\" data-p=\"permission\" data-n=\"head\" data-v=\"0\" " + (storage.permission.head ? "" : "checked") + " /><label for=\"deptHead0\">아니오</label></div>");

	// 문서관리
	title = "문서관리";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"deptDocMng\" id=\"deptDocMng1\" data-p=\"permission\" data-n=\"dptdoc\" data-v=\"1\" " + (storage.permission.doc ? "checked" : "") + " /><label for=\"deptDocMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"deptDocMng\" id=\"deptDocMng0\" data-p=\"permission\" data-n=\"dptdoc\" data-v=\"0\" " + (storage.permission.doc ? "" : "checked") + " /><label for=\"deptDocMng0\">아니오</label></div></div></div>");


	// =========================================== 회 사 설 정  타 이 틀 ===========================================
	title = "회사설정";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" /><img src=\"/images/manage/icon_confirm.png\" /></div></div>";
	
	// =========================================== 회 사 설 정  내 용 ===========================================
	html += "<div class=\"employeeDetail\">";

	// 인사
	title = "인사담당";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"hrCip\" id=\"hrCip1\" data-p=\"permission\" data-n=\"hr\" data-v=\"1\" " + (storage.permission.hr ? "checked" : "") + " /><label for=\"hrCip1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"hrCip\" id=\"hrCip0\" data-p=\"permission\" data-n=\"hr\" data-v=\"0\" " + (storage.permission.hr ? "" : "checked") + " /><label for=\"hrCip0\">아니오</label></div>");

	// 문서
	title = "문서담당";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"docMng\" id=\"docMng1\" data-p=\"permission\" data-n=\"doc\" data-v=\"1\" " + (storage.permission.docmng ? "checked" : "") + " /><label for=\"docMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"docMng\" id=\"docMng0\" data-p=\"permission\" data-n=\"doc\" data-v=\"0\" " + (storage.permission.docmng ? "" : "checked") + " /><label for=\"docMng0\">아니오</label></div></div>");

	// 인사
	title = "회계담당";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"accCip\" id=\"accCip1\" data-p=\"permission\" data-n=\"acc\" data-v=\"1\" " + (storage.permission.accounting ? "checked" : "") + " /><label for=\"accCip1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"accCip\" id=\"accCip0\" data-p=\"permission\" data-n=\"acc\" data-v=\"0\" " + (storage.permission.accounting ? "" : "checked") + " /><label for=\"accCip0\">아니오</label></div>");

	// 문서
	title = "관리자";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"prgMng\" id=\"prgMng1\" data-p=\"permission\" data-n=\"super\" data-v=\"1\" " + (storage.permission.manager ? "checked" : "") + " /><label for=\"prgMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"prgMng\" id=\"prgMng0\" data-p=\"permission\" data-n=\"super\" data-v=\"0\" " + (storage.permission.manager ? "" : "checked") + " /><label for=\"prgMng0\">아니오</label></div></div></div>");

	
	// =========================================== 연 차 정 보  계 산 ===========================================
	y = {};
	y.join = new Date(storage.basic.joined);
	y.annual = Math.floor((new Date() - y.join) / 86400000 / 365);
	y.total = 15 + Math.floor(y.annual / 2);
	y.used = 0;
	y.list = [];

	for(x = 0 ; x < storage.annualLeave.length ; x++){
		t1 = storage.annualLeave[x].start;
		t2 = storage.annualLeave[x].end;
		if(t2 - t1 < 86400000){ // 시작일과 종료일이 같은 경우
			t = (Math.floor((t2 - t1) / (60000 * 60) /2)) / 4;
			y.used += t;
			y.list.push([t, new Date(t1).toISOString().substring(0,10) + (t <= 0.5 ? " " + (new Date(t1).getHours() < 12 ? "오전" : "오후") : "")]);
		}else{ // 시작일이 종료일과 다른 경우
			t = (Math.ceil((t2 - t1 + 21600000) / 21600000)) / 4;
			y.list.push([t, new Date(t1).toISOString().substring(0,10) + " ~ " + new Date(t2).toISOString().substring(0,10)]);
		}
		

	}
	// =========================================== 연 차 정 보  타 이 틀 ===========================================
	title = "연차정보";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" /><img src=\"/images/manage/icon_confirm.png\" /></div></div>";
	
	// =========================================== 연 차 정 보 내 용 ===========================================
	html += "<div class=\"employeeDetail\">";

	// 기준일
	title = "발생기준";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\">" + storage.basic.joined + "</div>");

	// 근속연수
	title = "근속연수";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\">" + (y.annual + " 년") + "</div></div>");

	// 발생 연차
	title = "발생연차";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\">" + y.total + "</div>");

	// 사용 및 잔여 연차
	title = "사용/잔여";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\">" + (y.used + " / " + (y.total - y.used)) + "</div></div>");

	// 연차 사용 내역
	title = "사용내역";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += "<div class=\"xEmpNo\" style=\"grid-column:span 3\">";
	for(x = 0 ; x < y.list.length ; x++){
		html += (y.list[x][0] + " : " + y.list[x][1] + "<br />");
	}
	html += "</div></div></div>";


	// =========================================== 법인카드 / 법인차량 ===========================================
	title = "법인카드/법인차량";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" /><img src=\"/images/manage/icon_confirm.png\" /></div></div>";
	
	// =========================================== 법인카드 / 법인차량  내 용 ===========================================
	html += "<div class=\"employeeDetail\">";

	// 법인카드
	title = "법인카드";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\" style=\"grid-column:span 3;\"><select class=\"cocard\" data-p=\"asset\" data-n=\"card\"><option>없음</option><option>9999-9999-9999-9997 BNK</option><option>9999-9999-9999-9998 MASTER</option><option>9999-9999-9999-9999 VISA</option></select></div></div>");

	// 법인차량
	title = "법인차량";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><select class=\"cocar\"  data-p=\"asset\" data-n=\"car\"><option>없음</option><option>123차1234 제네시스</option><option>123차1235 그랜저</option><option>123차1236 소나타</option></select></div>");

	// 하이패스
	title = "하이패스";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><select class=\"hipass\" data-p=\"asset\" data-n=\"hipass\"><option>없음</option><option>9999-9999-9999-9997 BNK</option><option>9999-9999-9999-9998 MASTER</option><option>9999-9999-9999-9999 VISA</option></select></div></div>");



	


	

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