

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
		storage.collected = {"dept":dept};
		getEmployeeDetailInfo(empNo, dept);
	}else if(this.getAttribute("for").substring(0,4) === "dept"){
		dept = this.getAttribute("for").substring(10);
		storage.collected = {"dept":dept};
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

// 기본정보 HTML 생성
function getHtmlBasicInfo(){
	let x, html = "", title, t;	

	// =========================================== 기본 정보 내용 ===========================================
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
	html += ("<div><input type=\"radio\" id=\"xEmpProhibited0\" data-p=\"basic\" data-n=\"prohibited\" name=\"xEmpProhibited\" class=\"xEmpProhibited radioSwitch\" data-v=\"0\" " + (storage.basic.prohibited ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited0\">허 용</label><input type=\"radio\" id=\"xEmpProhibited1\" name=\"xEmpProhibited\" class=\"xEmpProhibited radioSwitch\" data-p=\"basic\" data-n=\"prohibited\" data-v=\"1\" " + (storage.basic.prohibited ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"xEmpProhibited1\">차 단</label></div>");

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
	html += ("<div><input type=\"hidden\" id=\"zzAddr1\" class=\"xEmpAddr\"/><input id=\"zzAddr2\" class=\"xEmpAddr xEmpInput\" data-p=\"basic\" data-n=\"address\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address.split("===")[0]) + "\" onclick=\"daumPostCode('zzAddr1', 'zzAddr2', 'zzAddr3')\" /></div>");

	// 상세주소
	title = "상세주소";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div><input id=\"zzAddr3\" class=\"xEmpAddr xEmpInput\" data-p=\"basic\" data-n=\"address\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address.split("===")[1]) + "\" onkeyup=\"collectEmpData(event)\" onfocus=\"collectEmpData(event)\" /></div></div>");

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
	html += ("</div><div>" + (storage.basic.deleted == null ? "" : (new Date(storage.basic.deleted)).toISOString().substring(0,10)) + "</div></div>");
	return html;
}

// 권한정보 HTML 생성
function getHtmlPermissionInfo(){
	let x, html = "", title;
	
	// =========================================== 권 한 설 정  내 용 ===========================================
	// 부서장
	title = "부서장";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"deptHead\" id=\"deptHead1\" data-p=\"permission\" data-n=\"head\" data-v=\"1\" " + (storage.permission.head ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"deptHead1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"deptHead\" id=\"deptHead0\" data-p=\"permission\" data-n=\"head\" data-v=\"0\" " + (storage.permission.head ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"deptHead0\">아니오</label></div>");

	// 문서관리
	title = "문서담당";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"deptDocMng\" id=\"deptDocMng1\" data-p=\"permission\" data-n=\"doc\" data-v=\"1\" " + (storage.permission.doc ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"deptDocMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"deptDocMng\" id=\"deptDocMng0\" data-p=\"permission\" data-n=\"doc\" data-v=\"0\" " + (storage.permission.doc ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"deptDocMng0\">아니오</label></div></div>");

	// 인사
	title = "인사관리자";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"hrCip\" id=\"hrCip1\" data-p=\"permission\" data-n=\"hr\" data-v=\"1\" " + (storage.permission.hr ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"hrCip1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"hrCip\" id=\"hrCip0\" data-p=\"permission\" data-n=\"hr\" data-v=\"0\" " + (storage.permission.hr ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"hrCip0\">아니오</label></div>");

	// 문서
	title = "문서관리자";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"docMng\" id=\"docMng1\" data-p=\"permission\" data-n=\"docmng\" data-v=\"1\" " + (storage.permission.docmng ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"docMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"docMng\" id=\"docMng0\" data-p=\"permission\" data-n=\"docmng\" data-v=\"0\" " + (storage.permission.docmng ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"docMng0\">아니오</label></div></div>");

	// 인사
	title = "회계관리자";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xEmpNo\"><input type=\"radio\" class=\"radioSwitch\" name=\"accCip\" id=\"accCip1\" data-p=\"permission\" data-n=\"accounting\" data-v=\"1\" " + (storage.permission.accounting ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"accCip1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"accCip\" id=\"accCip0\" data-p=\"permission\" data-n=\"accounting\" data-v=\"0\" " + (storage.permission.accounting ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"accCip0\">아니오</label></div>");

	// 문서
	title = "전체관리자";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xEmpId\"><input type=\"radio\" class=\"radioSwitch\" name=\"prgMng\" id=\"prgMng1\" data-p=\"permission\" data-n=\"manager\" data-v=\"1\" " + (storage.permission.manager ? "checked" : "") + " onchange=\"collectEmpData(event)\" /><label for=\"prgMng1\">예</label><input type=\"radio\" class=\"radioSwitch\" name=\"prgMng\" id=\"prgMng0\" data-p=\"permission\" data-n=\"manager\" data-v=\"0\" " + (storage.permission.manager ? "" : "checked") + " onchange=\"collectEmpData(event)\" /><label for=\"prgMng0\">아니오</label></div></div>");
	return html;
}

// 연차정보 HTML 생성
function getHtmlAnnualInfo(){
	let x, y, html = "", title, t, t1, t2;
	// =========================================== 연 차 정 보  계 산 ===========================================
	y = {};
	y.join = new Date(storage.basic.joined);
	y.annual = Math.floor((new Date() - y.join) / 86400000 / 365);
	y.total = 15 + Math.floor(y.annual / 2);
	y.total = y.total > 25 ? 25 : y.total;
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
	
	// =========================================== 연 차 정 보 내 용 ===========================================
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
	html += "</div></div>";
	return html;
}

// 법카, 법차 HTML 생성
function getHtmlAssetInfo(){
	let x, y, html = "", title, t;
	// =========================================== 법인 카드 및 법인 차량 내용 정리 ===========================================
	t = {};
	t.vehicle = []
	t.card = [];
	t.hipass = [];
	for(x = 0 ; x < storage.card.length ; x++){
		if(storage.card[x].employee === storage.basic.no*1){
			if(storage.card[x].hipass)	t.hipass.push(storage.card[x]);
			else						t.card.push(storage.card[x]);
		}
	}
	for(x = 0 ; x < storage.vehicle.length ; x++)	if(storage.vehicle[x].employee === storage.basic.no*1)	t.vehicle.push(storage.vehicle[x]);
	
	// =========================================== 법인카드 / 법인차량  내 용 ===========================================
	// 법인카드
	title = "법인카드";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"xEmpNo\" style=\"grid-column:span 3;grid-gap: 1rem;justify-content:initial;\">";
	
	for(x = 0 ; x < t.card.length ; x++){
		html += "<select class=\"xCard xEmpInput\" data-p=\"asset\" data-n=\"card\" onchange=\"collectEmpData(event)\" ><option value=\"none\">- - - - - - 없 음 - - - - - -</option>";
		for(y = 0 ; y < storage.card.length ; y++){
			if(storage.card[y].hipass)	continue;
			html += ("<option value=\"" + storage.card[y].card + "\"" + (t.card[x].card === storage.card[y].card ? " selected" : "") + ">" + (storage.card[y].card + " " + storage.code["은행코드"][storage.card[y].bank]) + (storage.card[y].employee === null ? "" : " " + storage.user[storage.card[y].employee].userName) + "</option>");
		}
		html += "</select>";
	}
	if(t.card.length < 3){
		html += "<select class=\"xCard xEmpInput\" data-p=\"asset\" data-n=\"card\" onchange=\"collectEmpData(event)\"><option value=\"none\" selected>- - - - - - 없 음 - - - - - -</option>";
		for(y = 0 ; y < storage.card.length ; y++){
			if(storage.card[y].hipass)	continue;
			html += ("<option value=\"" + storage.card[y].card + "\">" + (storage.card[y].card + " " + storage.code["은행코드"][storage.card[y].bank]) + (storage.card[y].employee === null ? "" : " " + storage.user[storage.card[y].employee].userName) + "</option>");
		}
		html += "</select>";
	}
	html += "</div></div>";

	// 법인차량
	title = "법인차량";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"xEmpNo\">";

	
	html += "<select class=\"xVehicle xEmpInput\" data-p=\"asset\" data-n=\"vehicle\" onchange=\"collectEmpData(event)\" ><option value=\"none\">- - - - - - 없 음 - - - - - -</option>";
	for(y = 0 ; y < storage.vehicle.length ; y++){
		html += ("<option value=\"" + storage.vehicle[y].vehicle + "\"" + (t.vehicle[0] !== undefined && storage.vehicle[y].vehicle === t.vehicle[0].vehicle ? " selected" : "") + ">" + (storage.vehicle[y].vehicle + " " + storage.vehicle[y].model) + (storage.vehicle[y].employee === null ? "" : " " + storage.user[storage.vehicle[y].employee].userName) + "</option>");
	}
	html += "</select>";
	
	html += ("</div>");

	// 하이패스
	title = "하이패스";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += "<div class=\"xEmpNo\">";
	
	for(x = 0 ; x < t.hipass.length ; x++){
		html += "<select class=\"xHipass xEmpInput\" data-p=\"asset\" data-n=\"hipass\" onchange=\"collectEmpData(event)\" ><option value=\"none\">- - - - - - 없 음 - - - - - -</option>";
		for(y = 0 ; y < storage.card.length ; y++){
			if(!storage.card[y].hipass)	continue;
			html += ("<option value=\"" + storage.card[y].card + "\"" + (t.hipass[x].card === storage.card[y].card ? " selected" : "") + ">" + (storage.card[y].card + " " + storage.code["은행코드"][storage.card[y].bank]) + (storage.card[y].employee === null ? "" : " " + storage.user[storage.card[y].employee].userName) + "</option>");
		}
		html += "</select>";
	}
	if(t.hipass.length < 1){
		html += "<select class=\"xHipass xEmpInput\" data-p=\"asset\" data-n=\"hipass\" onchange=\"collectEmpData(event)\" ><option value=\"none\" selected>- - - - - - 없 음 - - - - - -</option>";
		for(y = 0 ; y < storage.card.length ; y++){
			if(!storage.card[y].hipass)	continue;
			html += ("<option value=\"" + storage.card[y].card + "\">" + (storage.card[y].card + " " + storage.code["은행코드"][storage.card[y].bank]) + (storage.card[y].employee === null ? "" : " " + storage.user[storage.card[y].employee].userName) + "</option>");
		}
		html += "</select>";
	}
	html += "</div>";
	return html;
}

// 엘리먼트에 직원정보를 입력하는 함수
function setEmpData(){
	let cnt, x, y, html = "", title, t, t1, t2;
	cnt = document.getElementsByClassName("listContent")[0].children[1];

	// =========================================== 기본 정보 타이틀 ===========================================
	title = "기본정보";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";

	html += ("<div class=\"employeeDetail\" data-p=\"basic\">" + getHtmlBasicInfo() + "</div>");
	
	// =========================================== 권 한 설 정  타 이 틀 ===========================================
	title = "권한설정";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"permission\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"permission\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";
	html += ("<div class=\"employeeDetail\" data-p=\"permission\">" + getHtmlPermissionInfo() + "</div>");
	
	// =========================================== 연 차 정 보  타 이 틀 ===========================================
	title = "연차정보";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"annualLeave\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"annualLeave\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";
	html += ("<div class=\"employeeDetail\" data-p=\"annualLeave\">" + getHtmlAnnualInfo() + "</div>");
	
	// =========================================== 법인카드 / 법인차량 ===========================================
	title = "법인카드/법인차량";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"asset\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"asset\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";
	html += ("<div class=\"employeeDetail\" data-p=\"asset\">" + getHtmlAssetInfo() + "</div>");

	cnt.innerHTML = html;

} // End of setEmpData()

// 정보 수정 시. 입력된 데이터를 수집하는 함수
function collectEmpData(e){
	let v, n, t, x, y, p, edited;
	v = e.target.className === "xEmpProhibited" ? e.target.dataset.v*1 : e.target.value.trim();
	n = e.target.dataset.n;
	p = e.target.dataset.p;
	if(storage.collected === undefined)	storage.collected = {};
	if(storage.collected[p] === undefined)	storage.collected[p] = {};

	//console.log(n + " / " + v);

	// 비밀번호 변경일 경우의 검증
	if(n === "pw"){
		t = document.getElementsByClassName("xEmpPw");
		v = [];
		v[0] = t[0].value;
		v[1] = t[1].value;
		if(v[0] === "" && v[1] === ""){
			t[0].style.backgroundColor = "";
			t[1].style.backgroundColor = "";
			delete storage.collected[p][n];
		}else if(v[0] !== v[1] || v[0].length < 8){ // 두 비번이 일치하지 않거나 비번 조건에 부합하지 않을 때
			t[0].style.backgroundColor = "#ffeff3";
			t[1].style.backgroundColor = "#ffeff3";
			e.target.parentElement.parentElement.parentElement.previousElementSibling.className = "";
			return;
		}else{
			t[0].style.backgroundColor = "";
			t[1].style.backgroundColor = "";
			v = v[0];
			storage.collected[p][n] = v;
		}
	}else if(n === "name"){
		v = e.target.value;
		if(storage.basic.name === v)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "rank"){
		v = e.target.value;
		if(storage.basic.rank === v*1)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "resigned"){
		v = e.target.value;
		v = v === "" ? null : v;
		if(storage.basic.resigned === v)	delete storage.collected[p][n];
		else 								storage.collected[p][n] = v;
	}else if(n === "prohibited"){
		v = e.target.dataset.v === "1";
		console.log(v);
		if(storage.basic.prohibited === v)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
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
		storage.collected[p].birthDay = v[0];
		storage.collected[p].gender = v[1];
		storage.collected[p].residentNo = v[2];
		edited = true;
		return;
	}else if(n === "address"){
		v = [];
		t = document.getElementsByClassName("xEmpAddr");
		v[0] = t[0].value * 1;
		v[1] = t[1].value;
		v[2] = t[2].value;
		if(storage.basic.zipCode === v[0])	delete storage.collected[p]["zipCode"];
		else 								storage.collected[p]["zipCode"] = v[0];
		if(storage.basic.address === v[1] + "===" + v[2]) delete storage.collected[p]["address"];
		else storage.collected[p]["address"] = v[1] + "===" + v[2];
	}else if(n === "homePhone"){
		v = e.target.value;
		if(storage.basic[n] === v)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "cellPhone"){
		v = e.target.value;
		if(storage.basic[n] === v)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "email"){
		v = e.target.value;
		if(storage.basic[n] === v)	delete storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "head" || n === "doc" || n === "accounting" || n === "hr" || n === "docmng" || n === "manager"){
		v = e.target.dataset.v === "1";
		console.log("v : " + v + " / n : " + n);
		if(storage[p][n] === v)	delete	storage.collected[p][n];
		else 							storage.collected[p][n] = v;
	}else if(n === "vehicle" || n === "hipass" || n === "card"){
		t = e.target.parentElement.children;
		v = e.target.value;
		console.log("p : " + p + " / n : " + n + " / v : " + v);

		// 법인카드인 경우 셀렉트 엘리먼트를 삭제하거나 추가 처리하도록 함
		if(n === "card" && e.target === t[t.length - 1] && t.length < 3 && v !== "none"){
			x = document.createElement("select");
			x.dataset.p = p;
			x.dataset.n = n;
			x.className = e.target.className;
			x.attributes.onchange = e.target.attributes.onchange;
			x.innerHTML = e.target.innerHTML;
			e.target.parentElement.appendChild(x);
		}else if(n === "card" && e.target !== t[t.length - 1] && v === "none")	window.setTimeout(()=>{e.target.remove();},100);

		// 현재 할당된 자산 정보를 저장하여 입력된 값들과 비교할 수 있도록 함
		v = {};
		v.card = [];
		v.vehicle = undefined;
		v.hipass = undefined;
		for(x = 0 ; x < storage.card.length ; x++)	if(!storage.card[x].hipass && storage.card[x].employee === storage.basic.no*1)	v.card.push(storage.card[x].card);
		v.card.sort();
		for(x = 0 ; x < storage.card.length ; x++){
			if(storage.card[x].hipass && storage.card[x].employee === storage.basic.no*1){
				v.hipass = storage.card[x].card;
				break
			}
		}
		for(x = 0 ; x < storage.vehicle.length ; x++){
			if(storage.vehicle[x].employee === storage.basic.no*1){
				v.vehicle = storage.vehicle[x].vehicle;
				break
			}
		}

		// 입력된 값들을 가져오도록 함
		t = {};
		x = e.target.parentElement.parentElement.parentElement;
		t.c = [];
		y = x.getElementsByClassName("xCard");
		t.v = x.getElementsByClassName("xVehicle")[0];
		t.h = x.getElementsByClassName("xHipass")[0];
		for(x = 0 ; x < y.length ; x++)	if(y[x].value !== "none")	t.c.push(y[x].value);
		t.c.sort();
		t.v = t.v.value;
		t.v = t.v === "none" ? undefined : t.v;
		t.h = t.h.value;
		t.h = t.h === "none" ? undefined : t.h;

		// === 원 저장값과 입력된 값을 비교함
		// 법인카드
		if(v.card.length !== t.c.length || JSON.stringify(v.card) !== JSON.stringify(t.c)){
			storage.collected.asset.card = t.c;
			edited = true;
		}else if(v.card.length === t.c.length){
			for(x = 0 ; x < t.c.length ; x++){
				if(v.card[x] !== t.c[x]){
					storage.collected.asset.card = t.c;
					edited = true;
					break;
				}
			}
			if(x === t.c.length)	delete storage.collected.asset.card;
		}
		// 법인차량
		if(v.vehicle !== t.v){
			storage.collected.asset.vehicle = t.v;
			edited = true;
		}else{
			delete storage.collected.asset.vehicle;
		}
		// 하이패스
		if(v.hipass !== t.h){
			storage.collected.asset.hipass = t.h;
			edited = true;
		}else{
			delete storage.collected.asset.hipass;
		}
	}

	if(edited !== false && edited !== true){
		t = 0;
		for(x in storage.collected[p]) if(x !== undefined) t++;
	}

	if(t > 0 || edited )	e.target.parentElement.parentElement.parentElement.previousElementSibling.className = "edited";
	else					e.target.parentElement.parentElement.parentElement.previousElementSibling.className = "";
} // End of collectEmpData()


// 입력 된 데이터에 대한 초기화/저장 작업 함수
function clickedImgBtn(el, status){
	let cnt, url, p, data;
	cnt = el.parentElement.parentElement.nextElementSibling;
	p = cnt.dataset.p;
	if(status === false){ // ========== 초기화 작업
		el.parentElement.parentElement.className = "";
		delete storage.collected[p];
		if(p === "basic")	cnt.innerHTML = getHtmlBasicInfo();
		if(p === "permission")	cnt.innerHTML = getHtmlPermissionInfo();
		if(p === "asset")	cnt.innerHTML = getHtmlAssetInfo();
	}else if(status === true){ // ========== 저장 작업
		url = apiServer + "/api/manage/employee/" + p + "/" + storage.basic.no;
		data = storage.collected[p];
		data.dept = storage.collected.dept;
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		$.ajax({
			"url": url,
			"data": data,
			"method": "post",
			"dataType": "json",
			"contentType":"text/plain",
			"cache": false,
			success: (data) => {
				if (data.result === "ok") {
					console.log("success");
					getEmployeeDetailInfo(storage.basic.no, storage.collected.dept);
				} else {
					msg.set("오류가 발생했습니다.");
					console.log("failure / " + data.msg);
				}
			}
		});
	}
} // End of clickImgBtn()







account = {
	no : number, // 번호
	owner : number, // 소유자
	observer : array[number], // 참관자 / 세부 항목의 담당자는 당연히 옵저버로 등록이 됨
	title : string, // 제목
	desc : string, // 상세설명
	status : number, // 상태 코드 / 개설(sopp 없음) / 진행(sopp 있고 close 안됨) / 종료 (sopp 종료 및 세부항목 완료되고 클로징 됨)
	established : number, // 개설일
	closed : number | null, // 상태가 종료인 경우 종료일
	type : number, // 어카운트의 유형 / 상세항목 미정
	sopp : array[number] // 영업기회들
}

sopp = {
	no : number, // 번호
	owner : number, // 주 담당자
	crew : array[number], // 담당자
	stage : number, // 진해 단계 코드
	title : string, // 제목
	desc : string, // 상세설명
	basis : { // 기초정보
		customer : number, // 거래처
		expected : number, // 예상매출액
		possibility : number, // 예상 가능성
		cip : {}, // 업체 담당자
		decisionMaker : {}, // 업체 의사결정권자
		items : [ // 예상 매출 아이템
			{
				supplier : number,
				product : number,
				price : number | null,
				quantity : number | null
			}
		]
	},
	source : null | string, // 근원 ?
	type : number, // 유형코드
	established : number, // 개설일
	closed : number | null, // 상태가 종료인 경우 종료일
	estimates : [string], // 견적번호들
	contract : number, // 계약번호
}