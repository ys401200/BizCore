

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
		els = cnt.getElementsByTagName("img");
		for(x = 0 ; x < els.length ; x++){
			els[x].style.width="1rem";
			els[x].style.height="1rem";
		}
	},1500);
	

	// For Initializing Code . . . . . . .  . . . . 
});

// 부서 추가 이미지 클릭시 실행되는 함수
function clickedDeptAdd(){
	let cnt, el, x, ids = [], names = [], border = "1px solid #2147b1", padding = "0.4rem", font = "0.9rem";
	
	// 부서코드 및 이름 중복 방지를 위한 데이터 수집
	for(x in storage.dept.dept){
		if(x !== undefined){
			ids.push(x);
			names.push(storage.dept.dept[x].deptName);
		}
	}
	storage.newDept = {};
	storage.newDept.ids = ids;
	storage.newDept.names = names;

	// parent 확인
	el = document.getElementsByClassName("deptTree")[0].getElementsByTagName("input");
	for(x in el){
		if(el[x].checked){
			storage.newDept.parent = el[x].id.substring(10);
			break;
		}
	}

	// 모달 띄우고 엘리먼트 채우기
	modal.show();
	modal.head[0].children[0].innerText = "부서 추가";
	cnt = modal.body[0];
	el = document.createElement("div");
	el.style.display = "grid";
	el.style.gridTemplateColumns = "2fr 3fr 2fr 3fr";
	el.style.border = border;
	el.style.fontSize = font;
	el.style.margin = "1rem 0.2rem";
	cnt.appendChild(el);
	el = document.createElement("div");
	el.style.padding = padding;
	el.style.textAlign = "center";
	el.style.borderRight = border;
	el.style.borderBottom = border;
	el.style.fontSize = font;
	el.innerText = "상위부서";
	cnt.children[0].appendChild(el);
	el = document.createElement("div");
	el.style.padding = padding;
	el.style.textAlign = "center";
	el.style.borderBottom = border;
	el.style.gridColumn = "span 3";
	el.style.fontSize = font;
	el.innerText = storage.dept.dept[storage.newDept.parent].deptName;
	cnt.children[0].appendChild(el);

	el = document.createElement("div");
	el.style.padding = padding;
	el.style.textAlign = "center";
	el.style.borderRight = border;
	el.style.fontSize = font;
	el.innerText = "부 서 명";
	cnt.children[0].appendChild(el);
	el = document.createElement("input");
	el.setAttribute("onkeyup", "this.value=this.value.replaceAll(' ', '');");
	el.style.padding = padding;
	el.style.textAlign = "center";
	el.style.border = "none";
	el.style.borderRight = border;
	el.style.backgroundColor = "#eeeeff";
	el.style.fontSize = font;
	el.dataset.name = "name";
	cnt.children[0].appendChild(el);

	el = document.createElement("div");
	el.style.padding = "0.2rem";
	el.style.textAlign = "center";
	el.style.borderRight = border;
	el.style.fontSize = font;
	el.innerText = "부서코드";
	cnt.children[0].appendChild(el);
	el = document.createElement("input");
	el.setAttribute("onkeyup", "this.value=this.value.replaceAll(' ', '');");
	el.style.padding = "0.2rem";
	el.style.textAlign = "center";
	el.style.border = "none";
	el.style.backgroundColor = "#eeeeff";
	el.style.fontSize = font;
	el.dataset.name = "id";
	cnt.children[0].appendChild(el);

	modal.close[0].onclick = () => {delete storage.newDept;modal.hide();};
	modal.confirm[0].onclick = () => {
		let id, name, data, els = document.getElementsByClassName("modalBody")[0].getElementsByTagName("input");
		name = els[0].value;
		id = els[1].value;
		// 부서명/아이디 중복/유효성 검증
		if(name === undefined || name.length < 3 || storage.newDept.names.includes(name)){
			els[0].focus();
			els[0].style.animation = "not-enough-warn 3s forwards";
			window.setTimeout(function(){els[0].style.animation="";},3000);
			return;
		}else if(id === undefined || id.length < 5 || storage.newDept.ids.includes(id)){
			els[1].focus();
			els[1].style.animation = "not-enough-warn 3s forwards";
			window.setTimeout(function(){els[1].style.animation="";},3000);
			return;
		}
		modal.hide();
		storage.newDept.id = id;
		data = {"deptId":id, "deptName":name, "parent":storage.newDept.parent};
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		fetch(apiServer + "/api/manage/department", {
			method: "POST",
			header: { "Content-Type": "text/plain" },
			body: data
		}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				if (response.result === "ok") {
					sessionStorage.removeItem("deptMapData");
					sessionStorage.removeItem("deptMapTime");
					getDeptMap(false);
					window.setTimeout(function(){
						let cnt, els, x;
						setDeptTree();
						cnt = document.getElementsByClassName("deptTree")[0];
						cnt.innerHTML = storage.dept.tree.getTreeHtml();
						els = cnt.getElementsByTagName("label");
						for(x = 0 ; x < els.length ; x++){
							if(els[x] === undefined) continue;
							els[x].onclick = getDetailInfo;
						}
						els = cnt.getElementsByClassName("dept-tree");
						for(x = 0 ; x < els.length ; x++)	els[x].checked = true;
						els = cnt.getElementsByTagName("img");
						for(x = 0 ; x < els.length ; x++){
							els[x].style.width="1rem";
							els[x].style.height="1rem";
						}
						els = cnt.getElementsByClassName("deptName");
						for(x = 0 ; x < els.length ; x++){
							if(els[x].getAttribute("for").substring(10) === storage.newDept.id){
								els[x].click();
								break;
							}
						}
						delete storage.newDept;
					},1000);
				} else {
					console.log(response.msg);
				}
			});
	}
	
} // End of clickedDeptAdd()

// 직원 추가 이미지 클릭시 실행되는 함수
function clickedUserAdd(){

} // End of clickedUserAdd()

// 부서 혹은 직원 클릭시 실행되는 함수
function getDetailInfo(){
	let empNo, dept;
	if(this.getAttribute("for").substring(0,3) === "emp"){
		empNo = this.getAttribute("for").substring(4);
		if(storage.basic !== undefined && storage.basic.no !== undefined && storage.basic.no == empNo)	return; // 현재 선택된 직원을 클릭하는 경우 종료함
		dept = this.parentElement.previousSibling.getAttribute("for").substring(10);
		storage.collected = {"dept":dept};
		document.getElementsByClassName("image_btns")[0].children[0].style.display = "";
		document.getElementsByClassName("image_btns")[0].children[1].style.display = "";
		getEmployeeDetailInfo(empNo, dept);
	}else if(this.getAttribute("for").substring(0,4) === "dept"){
		dept = this.getAttribute("for").substring(10);
		storage.collected = {"dept":dept};
		document.getElementsByClassName("image_btns")[0].children[0].style.display = "initial";
		document.getElementsByClassName("image_btns")[0].children[1].style.display = "initial";
		getDeptDetailInfo(dept); // ==================== 해당 함수 만들어야 함
	}
} // End of getDetailInfo()()

// 부서 클릭시 실행되는 함수
function getDeptDetailInfo(dept){
	let url;
	document.getElementsByClassName("listContent")[0].children[1].innerHTML = "";

	url = apiServer + "/api/manage/department/" + dept;
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
				storage.basic = list;
				setDeptData();
			} else {
				msg.set("[getEmployeeDetailInfo] Fail to get bank account information.");
			}
		}
	});
} // End of getDeptDetailInfo()


// 서버에서 직원의 상세 정보를 가져오는 함수
function getEmployeeDetailInfo(empNo, dept){
	let url;
	if(empNo === undefined)	return;
	document.getElementsByClassName("listContent")[0].children[1].innerHTML = "";

	url = apiServer + "/api/manage/employee/" + dept + "/" + empNo;
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

function setDeptData(){
	let cnt, x, y, html = "", title, t, t1, t2, root = storage.basic.isRoot;
	cnt = document.getElementsByClassName("listContent")[0].children[1];

	// 루트 부서를 선택한 경우, 회사정보를 기본정보로 세팅함
	if(root){
		storage.basic.name = storage.company.name;
		storage.basic.parent = null;
		storage.basic.taxId = storage.company.taxId;
		storage.basic.corpRegNo = storage.company.corpRegNo;
		storage.basic.zipCode = storage.company.zipCode;
		storage.basic.address = storage.company.address;
		storage.basic.contact = storage.company.contact;
		storage.basic.fax = storage.company.fax;
		storage.basic.email = storage.company.email;
		storage.basic.created = storage.company.created;
		storage.basic.modified = storage.company.modified;
	}

	// =========================================== 기본 정보 타이틀 ===========================================
	title = "기본정보";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";

	html += "<div class=\"employeeDetail\" data-p=\"basic\">";

	// =========================================== 기본 정보 내용 ===========================================
	// 부서명
	title = "부서명";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptName\" data-n=\"name\"><input class=\"xEmpInput\" value=\"" + storage.basic.name + "\" onkeyup=\"collectDeptData(this)\" /></div>");

	// 아이디
	title = "부서코드";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xDeptId\" data-n=\"id\"><input class=\"xEmpInput\" value=\"" + (storage.basic.id !== null ? storage.basic.id : "") + "\" " + (storage.basic.id !== null ? "disabled" : "") + " onkeyup=\"collectDeptData(this)\" /></div></div>");

	/*
	// 부서장
	title = "부서장";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptHead\">" + (storage.basic.head == null ? "지정안함" : storage.user[storage.basic.head].userName) + "</div>");

	// 문서관리자
	title = "문서관리자";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xDeptDoc\">" + (storage.basic.doc == null ? "지정안함" : storage.user[storage.basic.doc].userName) + "</div></div>");
	*/

	// 기본주소
	title = "주소";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptAddress\" data-n=\"address\" style=\"grid-column:span 3\"><input type=\"hidden\" id=\"zzAddr1\" /><input type=\"checkbox\" " + (storage.basic.address == null && !root ? "" : "checked") + " class=\"xDeptInuse\" " + (root ? "style=\"display:none;\"" : "") + " onchange=\"if(this.checked){if(storage.basic.address!==null){this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value=storage.basic.address[0];this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value=storage.basic.address[1];}}else{this.nextElementSibling.nextElementSibling.value='';this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value='';}\" /><span style=\"margin-left:2rem;\">기본주소:</span><input class=\"xEmpInput\" id=\"zzAddr2\" style=\"width:38%;\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address[0]) + "\" onclick=\"daumPostCode('zzAddr1', 'zzAddr2', 'zzAddr3')\" /><span style=\"margin-left:2rem;\">상세주소:</span><input class=\"xEmpInput\" id=\"zzAddr3\" style=\"width:38%;\" value=\"" + (storage.basic.address == null ? "" : storage.basic.address[1]) + "\" onkeyup=\"collectDeptData(this)\" /></div></div>");

	// 연락처
	title = "전화번호";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptContct\" style=\"grid-column:span 3\" data-n=\"contact\"><input type=\"checkbox\" " + (storage.basic.contact == null && !root ? "" : "checked") + " " + (root ? "style=\"display:none;\"" : "") + " class=\"xDeptInuse\" onchange=\"if(this.checked){for(let x=1;x<4;x++){this.parentElement.children[x].style.display='initial';this.parentElement.children[x].value=storage.basic.contact!==null&&storage.basic.contact[x-1]!==undefined?storage.basic.contact[x-1]:'';}}else{for(let x=1;x<4;x++){this.parentElement.children[x].style.display='none';this.parentElement.children[x].value=''};this.nextElementSibling.onkeyup();}\" onkeyup=\"collectDeptData(this)\" />");
	html += "<input class=\"xEmpInput\" style=\"width:16.5rem;\" value = \"" + (storage.basic.contact !== null && storage.basic.contact[0] !== undefined ? storage.basic.contact[0] : "") + "\" onkeyup=\"collectDeptData(this)\" /><input class=\"xEmpInput\" style=\"width:16.5rem;\" value = \"" + (storage.basic.contact !== null && storage.basic.contact[1] !== undefined ? storage.basic.contact[1] : "") + "\" onkeyup=\"collectDeptData(this)\" /><input class=\"xEmpInput\" style=\"width:16.5rem;\" value = \"" + (storage.basic.contact !== null && storage.basic.contact[2] !== undefined ? storage.basic.contact[2] : "") + "\" onkeyup=\"collectDeptData(this)\" /></div></div>";

	// 팩스
	title = "FAX";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptFax\" data-n=\"fax\"><input type=\"checkbox\" " + (storage.basic.fax == null && !root ? "" : "checked ") + (root ? "style=\"display:none;\"" : "") + " class=\"xDeptInuse\" onchange=\"this.nextElementSibling.value='';this.nextElementSibling.onkeyup()\" /><input class=\"xEmpInput\" value=\"" + (storage.basic.fax == null ? "" : storage.basic.fax) + "\" onkeyup=\"collectDeptData(this)\" /></div>");

	// 이메일
	title = "email";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xDeptEmail\" data-n=\"email\"><input type=\"checkbox\" " + (storage.basic.email == null && !root ? "" : "checked ") + (root ? "style=\"display:none;\"" : "") + " class=\"xDeptInuse\" onchange=\"this.nextElementSibling.value='';this.nextElementSibling.onkeyup()\" /><input class=\"xEmpInput\" value=\"" + (storage.basic.email == null ? "" : storage.basic.email) + "\" onkeyup=\"collectDeptData(this)\" /></div></div>");

	// 사업자번호
	title = "사업자번호";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	// 루트 부서인 경우 법인번호를 입력할 수 있도록 한다.
	html += ("<div class=\"xDeptTaxId\" " + (root ? "" : "style=\"grid-column:span 3\"") + " data-n=\"taxId\"><input type=\"checkbox\" " + (storage.basic.taxId == null && !root? "" : "checked ") + (root ? "style=\"display:none;\"" : "") + " class=\"xDeptInuse\" onchange=\"this.nextElementSibling.value='';this.nextElementSibling.onkeyup()\" /><input class=\"xEmpInput\" value=\"" + (storage.basic.taxId == null ? "" : storage.basic.taxId) + "\" onkeyup=\"collectDeptData(this)\" /></div>");
	if(root){ // 법인번호
		title = "법인번호";
		html += "<div>";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div>";
		html += ("<div class=\"xDeptCorpRegNo\" data-n=\"corpRegNo\"><input class=\"xEmpInput\" value=\"" + (storage.basic.corpRegNo == null ? "" : storage.company.corpRegNo) + "\" onkeyup=\"collectDeptData(this)\" /></div>");
	}
	html += "</div>";

	// 생성일
	title = "생성일";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"xDeptCreated\">" + (storage.basic.created !== null ? (new Date(storage.basic.created)).toISOString().substring(0,10) : "") + "</div>");

	// 수정일
	title = "수정일";
	html += "<div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += ("</div><div class=\"xDeptModified\">" + (storage.basic.modified !== null ? (new Date(storage.basic.modified)).toISOString().substring(0,10) : "") + "</div></div>");
	
	html += "</div>";

	// =========================================== 사용 현황 타이틀 ===========================================
	title = "사용현황";
	html += "<div><div class=\"image_btns\"><img src=\"/images/manage/icon_modified.png\" /></div><div class=\"manageSubTitle\">";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div><div class=\"image_btns\"><img src=\"/images/manage/icon_undo.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, false)\" /><img src=\"/images/manage/icon_confirm.png\" data-p\"basic\" onclick=\"clickedImgBtn(this, true)\" /></div></div>";

	html += "<div class=\"employeeDetail\" data-p=\"basic\">";

	// =========================================== 사용 현황 내용 ===========================================

	// 항목 1
	title = "항목1";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목2";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목3";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목4";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목5";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목6";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목7";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목8";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");
	// 항목 1
	title = "항목9";
	html += "<div><div>";
	for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
	html += "</div>";
	html += ("<div class=\"x\" style=\"grid-column:span 3\">. . . . .</div></div>");


	html += "</div>";

	cnt.innerHTML = html;
} // End of setDeptData()

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
		for(x in storage.collected[n]) if(x !== undefined) t++;
	}

	if(t > 0 || edited )	e.target.parentElement.parentElement.parentElement.previousElementSibling.className = "edited";
	else					e.target.parentElement.parentElement.parentElement.previousElementSibling.className = "";
} // End of collectEmpData()

function collectDeptData(e){
	let n, x, y, v, t, edited;
	n = e.parentElement.dataset.n;

	if(n === "name"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
		y = false;
		if(storage.basic.name !== v)	for(x in storage.dept.dept){
			if(storage.dept.dept[x].deptName === v){
				y = true;
				break;
			}
		}
		if(v === "" || y){
			edited = false;
			e.style.backgroundColor = "rgb(255, 239, 243)";
		}else{
			e.style.backgroundColor = "";
		}
	}else if(n === "id"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
		y = false;
		if(storage.basic.id !== v)	for(x in storage.dept.dept){
			if(x === v){
				y = true;
				break;
			}
		}
		if(v === "" || y){
			edited = false;
			e.style.backgroundColor = "rgb(255, 239, 243)";
		}else{
			e.style.backgroundColor = "";
		}
	}else if(n === "fax"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
	}else if(n === "email"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
	}else if(n === "taxId"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
	}else if(n === "address"){
		v = [null,[null,e.value]];
		v[0] = document.getElementById("zzAddr1").value;
		v[1][0] = document.getElementById("zzAddr2").value;
		if(JSON.stringify(storage.basic[n]) === JSON.stringify(v[1]) || e.value === ""){
			delete storage.collected[n];
			delete storage.collected.zipCode;
		}else{
			storage.collected.zipCode = v[0];
			storage.collected[n] = v[1];
			edited = true;
		}
	}else if(n === "contact"){
		v = [];
		for(x = 1 ; x < 4 ; x++)	if(e.parentElement.children[x].value !== "")	v.push(e.parentElement.children[x].value);
		if(JSON.stringify(storage.basic[n] !== null ? storage.basic[n].sort() : storage.basic[n]) === JSON.stringify(v.sort()))	delete storage.collected[n];
		else	storage.collected[n] = v;
	}else if(n === "corpRegNo"){
		v = e.value;
		if(storage.basic[n] === v || v === "")	delete storage.collected[n];
		else	storage.collected[n] = v;
	}

	if(edited !== false && edited !== true){
		t = 0;
		for(x in storage.collected[n]) if(x !== undefined) t++;
	}

	if(t > 0 || edited )	e.parentElement.parentElement.parentElement.previousElementSibling.className = "edited";
	else					e.parentElement.parentElement.parentElement.previousElementSibling.className = "";

} // End of collectDeptData()


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


