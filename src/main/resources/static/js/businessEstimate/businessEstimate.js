

$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		getEstimateBasic();
		getEstimateItem();
		getEstimateList();
	} // End of prepare()

    init();
	storage.estimate = {};
	storage.ac = {};
	storage.ac.mouseon = false;

	storage.ac.set = function(el, fncName){
		let x, html, acCnt = document.getElementsByClassName("ac_cnt")[0];

		if(storage.ac.searched === undefined || storage.ac.searched.length === 0){
			storage.ac.close();
			return;
		}

		storage.ac.fncName = fncName;

		// 자동완성 타겟 저장해두기
		storage.ac.target = el;

		// 자동완성 컨테이너 위치 잡기
		acCnt.style.color = "initial";
		acCnt.style.display = "initial";
		x = [];
		x[0] = el.offsetTop; // input 엘리먼트의 세로 위치
		x[1] = el.offsetLeft; // input 엘리먼트의 가로 위치
		x[2] = document.defaultView.getComputedStyle(el).getPropertyValue("width"); // input 엘리먼트의 너비
		x[2] = Math.floor(x[2].replace("px","") * 1) - 5;
		x[3] = el.offsetHeight; // input 엘리먼트의 높이
		x[4] = x[0] + x[3] + 5; // ac 컨테이너의 세로 위치
		x[5] = x[1]; // ac 컨테이너의 가로 위치
		x[6] = x[2]; // ac 컨테이너의 너비
		acCnt.style.top = x[4] + "px";
		acCnt.style.left = x[5] + "px";
		acCnt.style.width = x[6] + "px";

		// 자동완성 내용 생성
		html = "";
		for(x = 0 ; x < storage.ac.searched.length ; x++)	html += ("<div data-value=\"" + storage.ac.searched[x][0] + "\" onclick=\"storage.ac.target.dataset.value=this.dataset.value;storage.ac.confirm(" + storage.ac.fncName + ")\">" + storage.ac.searched[x][1] + "</div>");
		
		acCnt.innerHTML = html;
	} // End of storage.ac.set()

	storage.ac.close = function(){
		let acCnt = document.getElementsByClassName("ac_cnt")[0];
		acCnt.style.display = "none";
		storage.ac.searched = undefined;
		storage.ac.select = undefined;
		storage.ac.target = undefined;
		storage.ac.mouseon = false;
		storage.ac.idx = undefined;
		storage.ac.fncName = undefined;
	} // End of storage.ac.close()

	storage.ac.move = function(v, fnc){
		let x, color = "#eaeaff", acCnt = document.getElementsByClassName("ac_cnt")[0];
		if(storage.ac.searched === undefined || storage.ac.searched.length === 0 || isNaN(v) || v === "" || v === 0)	return;
		storage.ac.select = storage.ac.select === undefined ? storage.ac.searched.length : storage.ac.select;
		
		if(v > 0)		storage.ac.select++;
		else if(v < 0)	storage.ac.select--;
		
		storage.ac.select = storage.ac.select < 0 ? storage.ac.searched.length - 1 : storage.ac.select >= storage.ac.searched.length ? 0 : storage.ac.select;

		// 선택된 항목 하이라이트
		for(x = 0 ; x < acCnt.children.length ; x++){
			if(x === storage.ac.select){
				acCnt.children[x].style.backgroundColor = color;
				acCnt.children[x].scrollIntoViewIfNeeded();
			}else acCnt.children[x].style.backgroundColor =  "";
		}

		// 지정된 작업 수행
		if(fnc !== undefined)	fnc();
	} // End of storage.ac.move()

	storage.ac.confirm = function(fnc){
		// 지정된 작업 수행
		if(fnc !== undefined)	fnc();
		storage.ac.close();
		setDataToPreview();
	}

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	storage.page = {"max":0,"current":0,"line":0};

	// For Initializing Code . . . . . . .  . . . . 
});

// 기본 정보를 세팅하는 함수
function selectBasicInfo(n){
	let data = storage.estimateBasic[n];
	storage.estimate.firmName = data.firmName;
	storage.estimate.representative = data.representative;
	storage.estimate.phone = data.phone;
	storage.estimate.fax = data.fax;
	storage.estimate.address = data.address;
	setDataToPreview();
}

// 견적 추가버튼 클릭시 실행되는 한수
// function clickedAdd(el){
// 	let x, cnt, html;

// 	storage.estimate = {};
// 	cnt = document.getElementsByClassName("estimatePreview")[0];
// 	document.getElementsByClassName("listContainer")[0].style.display = "none";
// 	document.getElementsByClassName("eachContainer")[0].style.display = "block";

// 	// 양식 목록
// 	html = "";
// 	for(x = 0 ; x < storage.estimateForm.length ; x++){
// 		html += ("<input type=\"radio\" class=\"estimateFormName\" name=\"estimateFormName\" style=\"display:none;\" id=\"estimateFormName" + x + "\" />");
// 		html += ("<label onclick=\"selectForm(" + x + ")\" for=\"estimateFormName" + x + "\" data-no=\"" + x + "\" style=\"margin:0 0.5em;\">" + storage.estimateForm[x].name + "</label>");
// 	}
// 	cnt = document.getElementsByClassName("formNames")[0];
// 	cnt.innerHTML = html;

// 	// 견적 기본정보
// 	html = "";
// 	for(x in storage.estimateBasic){
// 		if(x === undefined)	continue;
// 		console.log(x);
// 		html += ("<input type=\"radio\" class=\"estimateBasInfo\" name=\"estimateBasInfo\" style=\"display:none;\" id=\"estimateBasInfo" + x + "\" />");
// 		html += ("<label onclick=\"selectBasicInfo(" + x + ")\" for=\"estimateBasInfo" + x + "\" data-no=\"" + x + "\" style=\"margin:0 0.5em;\">" + storage.estimateBasic[x].name + "</label>");
// 	}
// 	cnt = document.getElementsByClassName("basicInfo")[0];
// 	cnt.innerHTML = html;

// 	// 작성자 등 기본 정보
// 	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText = storage.user[storage.my].userName;
// 	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.textAlign = "center";
// 	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "공개";
// 	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.textAlign = "center";
// }

function clickedAdd(){
	let listContent, addPdfForm, addBtn, bodyTitle, bodyTitleFnc;
	listContent = $(".listContent");
	addPdfForm = $(".addPdfForm");
	bodyTitle = $(".bodyTitle");
	bodyTitleFnc = $(".bodyTitleFnc div");
	bodyTitle.text("견적추가");
	bodyTitleFnc.eq(0).text("새견적추가");
	bodyTitleFnc.eq(0).attr("onclick", "estimateInsert();");
	bodyTitleFnc.eq(0).show();
	bodyTitleFnc.eq(1).show();
	listContent.hide();
	addPdfForm.show();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	estimateFormInit();
}

function previewReset(){
	// <div class="previewDefault">
	// 	<div>미리보기</div>
	// </div>
	let versionPreview = $(".versionPreview");
	versionPreview.find(".mainPdf").remove();
}

function clickedUpdate(){
	let listContent, addPdfForm, bodyTitle, bodyTitleFnc;
	listContent = $(".listContent");
	addPdfForm = $(".addPdfForm");
	bodyTitle = $(".bodyTitle");
	bodyTitleFnc = $(".bodyTitleFnc div");
	bodyTitle.text("견적수정");
	bodyTitleFnc.eq(0).before("<div onclick=\"estimateInsert();\">새견적추가</div>");
	bodyTitleFnc.eq(0).text("견적수정");
	bodyTitleFnc.eq(0).attr("onclick", "estimateUpdate();");
	bodyTitleFnc.eq(0).show();
	bodyTitleFnc.eq(1).show();
	listContent.hide();
	addPdfForm.show();
	storage.estmDetail = storage.estmVerList[storage.detailIdx];
	$(".mainPdf").eq(1).find("input").val("");
	$(".mainPdf").eq(1).find(".pdfMainContentTitle").remove();
	$(".mainPdf").eq(1).find(".pdfMainContentItem").remove();
	estimateFormInit();
}

// 견적 추가버튼 클릭시 실행되는 한수
function closeAdd(el){
	let listContent, addPdfForm, bodyTitle, bodyTitleFnc;
	listContent = $(".listContent");
	addPdfForm = $(".addPdfForm");
	bodyTitle = $(".bodyTitle");
	bodyTitleFnc = $(".bodyTitleFnc div");
	bodyTitle.text("견적목록");
	bodyTitleFnc.eq(0).text("추가");
	bodyTitleFnc.eq(0).attr("onclick", "clickedAdd();");
	bodyTitleFnc.eq(0).hide();
	bodyTitleFnc.eq(1).hide();
	listContent.show();
	addPdfForm.hide();
	storage.estmDetail = undefined;
	$(".mainPdf").eq(1).find("input").val("");
	$(".mainPdf").eq(1).find(".pdfMainContentTitle").remove();
	$(".mainPdf").eq(1).find(".pdfMainContentItem").remove();
} // End of closeAdd()

// 서버에서 견적 양식을 가져오는 함수
function getEstimateBasic(){
	let url;
	url = apiServer + "/api/estimate/basic";
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let form, info, x;
			if (data.result === "ok") {
				x = cipher.decAes(data.data);
				x = JSON.parse(x);
				form = x.form;
				info = x.info;
				for(x = 0 ; x < form.length ; x++)	form[x].form = cipher.decAes(form[x].form);
				storage.estimateForm = form;
				storage.estimateBasic = info;
			} else {
				msg.set("[getEstimateForm] Fail to get estimate form(s).");
			}
		}
	});
} // End of getEstimateBasic()

// 서버에서 아이템을 가져오는 함수
function getEstimateItem(){
	let url;
	url = apiServer + "/api/estimate/item/";
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
				storage.item = list;
			} else {
				msg.set("[getEstimateItem] Fail to get item information.");
			}
		}
	});
} // End of getEstimateItem()

// 견적 양식
function selectForm(no){
	let x, h, w, cnt = document.getElementsByClassName("estimatePreview")[0];

	cnt.innerHTML = storage.estimateForm[no].form;
	// ============= 초기화 ================ 미리보기가 활성화 되어 있지 않은 경우 이를 활성화 하고 기초정보를 세팅함 ================
	if(cnt.style.display === ""){
		cnt.style.display = "inline-block";
		w = storage.estimateForm[no].width;
		h = storage.estimateForm[no].height;
		x = document.defaultView.getComputedStyle(cnt).getPropertyValue("width"); // 타겟 컨테이너의 너비값을 가지고 옮
		cnt.style.height = "calc(" + x + " / " + w + " * " + h + ")" // 타겟 컨테이너의 높이값을 성정함
		cnt.style.width = x;
		cnt.style.fontSize = "calc(" + x + " / 120)";
	}

	no = no === undefined ? 0 : no;
	storage.estimate.form = storage.estimateForm[no].name;	
	window.setTimeout(function(){setDataToPreview();},100); // 미리보기 활성화
	window.setTimeout(function(){passed(1);},200); // 다음 단계 진행 스텝 활성화
} // End of selectForm()

// 견적명
function setProject(el){
	storage.estimate.title = el.value;
	setDataToPreview(); // 미리보기 
	passed(1);
} // End of setProject()

// 담당자
function inputCip(el){
	storage.estimate.cip = el.value;
	setDataToPreview();
	passed(2);
} // End of inputCip()

// 자동완성에서 고객사 선택시 실행되는 함수
function acSelectCustomer(){
	let t;
	if(storage.ac.target.dataset.value === undefined || storage.ac.target.dataset.value === ""){
		storage.estimate.customer = storage.ac.target.value;
	}else{
		t = storage.ac.target.dataset.value;
		storage.estimate.customer = t;
		storage.ac.target.value = storage.customer[t].name;
	}
}

// 고객사 정보 입력시 실행되는 함수
function inputCustomer(el, e){
	let x, t, typed, custm, searched = [], fnc;
	typed = el.value;

	// 입력된 값이 없을 때 초기화 및 종료
	if(typed === undefined || typed === null || typed.length === 0)	storage.ac.close();

	// ====================== 위/아래 방향키 또는 엔터키 처리 ===========================================

	// ↑ , ↓ 또는 ⏎ 일 때의 처리
	if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter"){

		if(e.key === "ArrowUp" || e.key === "ArrowDown") { // ◀︎ 위 / 아래 방향키일 때
			t = e.key === "ArrowUp" ? -1 : 1;
			fnc = ()=>{storage.ac.target.dataset.value = storage.ac.searched[storage.ac.select][0];}
			storage.ac.move(t, fnc);
			return;
		}else{ // ◀︎ 엔터 키 일때
			storage.ac.confirm(acSelectCustomer);
			return;
		}
	}

	// ================================ 거래처 검색 및 자동완성 ==================================

	// 입력된 키워드를 바탕으로 검색
	for(x in storage.customer){
		custm = storage.customer[x];
		if(custm.name.includes(typed))	searched.push([x, custm.name]);
	}

	storage.ac.searched = searched;
	storage.ac.set(el, "acSelectCustomer");

	passed(2);
} // End of inputCustomer()

// 자동완성에서 매입처 선택시 실행되는 함수
function acSelectSupplier(){
	let t;
	if(storage.ac.target.dataset.value === undefined || storage.ac.target.dataset.value === ""){
		storage.estimate.items[storage.ac.idx].supplier = storage.ac.target.value;
	}else{
		t = storage.ac.target.dataset.value;
		storage.estimate.items[storage.ac.idx].supplier = t;
		storage.ac.target.value = storage.customer[t].name;
	}
}

// 자동완성에서 아이템 선택시 실행되는 함수
function acSelectItem(){
	let t, x;
	if(storage.ac.target.dataset.value === undefined || storage.ac.target.dataset.value === ""){
		storage.estimate.items[storage.ac.idx].supplier = storage.ac.target.value;
	}else{
		t = storage.ac.target.dataset.value;
		storage.estimate.items[storage.ac.idx].supplier = t;
		for(x = 0 ; x < storage.item.length ; x++){
			if(storage.item[x].no == t)	break;
		}
		storage.ac.target.value = storage.item[x].product;
	}
}

// 매입처 정보 입력시 실행되는 함수
function inputSupplier(el, e){
	let x, t, typed, supplier, searched = [], fnc, idx, els;
	typed = el.value;

	// 입력된 값이 없을 때 초기화 및 종료
	if(typed === undefined || typed === null || typed.length === 0)	storage.ac.close();

	// 현재 위치의 인덱스 찾기
	t = el.parentElement.parentElement;
	els = document.getElementsByClassName("estimateItem");
	for(x = 0 ; x < els.length ; x++){
		if(t === els[x]){
			idx = x;
			storage.ac.idx = x;
		}
	}	

	// ====================== 위/아래 방향키 또는 엔터키 처리 ===========================================

	// ↑ , ↓ 또는 ⏎ 일 때의 처리
	if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter"){

		if(e.key === "ArrowUp" || e.key === "ArrowDown") { // ◀︎ 위 / 아래 방향키일 때
			t = e.key === "ArrowUp" ? -1 : 1;
			fnc = ()=>{storage.ac.target.dataset.value = storage.ac.searched[storage.ac.select][0];}
			storage.ac.move(t, fnc);
			return;
		}else{ // ◀︎ 엔터 키 일때
			storage.ac.confirm(acSelectSupplier);
			return;
		}
	}

	// ================================ 거래처 검색 및 자동완성 ==================================

	// 입력된 키워드를 바탕으로 검색
	for(x in storage.customer){
		supplier = storage.customer[x];
		if(supplier.name.includes(typed))	searched.push([x, supplier.name]);
	}

	storage.ac.searched = searched;
	storage.ac.set(el, "acSelectSupplier");

	setDataToPreview();
} // End of inputSupplier()

// 아이템 정보 입력시 실행되는 함수
function inputItem(el, e){
	let x, t, typed, item, searched = [], fnc, idx, els;
	typed = el.value;

	// 입력된 값이 없을 때 초기화 및 종료
	if(typed === undefined || typed === null || typed.length === 0)	storage.ac.close();

	// 현재 위치의 인덱스 찾기
	t = el.parentElement.parentElement;
	els = document.getElementsByClassName("estimateItem");
	for(x = 0 ; x < els.length ; x++){
		if(t === els[x]){
			idx = x;
			storage.ac.idx = x;
		}
	}	

	// ====================== 위/아래 방향키 또는 엔터키 처리 ===========================================

	// ↑ , ↓ 또는 ⏎ 일 때의 처리
	if(e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter"){

		if(e.key === "ArrowUp" || e.key === "ArrowDown") { // ◀︎ 위 / 아래 방향키일 때
			t = e.key === "ArrowUp" ? -1 : 1;
			fnc = ()=>{storage.ac.target.dataset.value = storage.ac.searched[storage.ac.select][0];}
			storage.ac.move(t, fnc);
			return;
		}else{ // ◀︎ 엔터 키 일때
			storage.ac.confirm(acSelectItem);
			return;
		}
	}

	// ================================ 거래처 검색 및 자동완성 ==================================

	// 입력된 키워드를 바탕으로 검색
	for(x = 0 ; x < storage.item.length ; x++){
		item = storage.item[x];
		if(item.product.includes(typed))	searched.push([item.no, item.product]);
	}

	storage.ac.searched = searched;
	storage.ac.set(el, "acSelectItem");

	setDataToPreview();
} // End of inputItem()



// 세팅된 데이터를 미리보기에 반영하는 함수
function setDataToPreview(){
	let x, t, items, each, sum, dt, vat = 0, cnt = document.getElementsByClassName("estimatePreview")[0];

	if(cnt === undefined)	return;
	
	// =============== 견적일자 =======================
	if(storage.estimate.date === undefined)	storage.estimate.date = (new Date()).getTime();
	dt = new Date(storage.estimate.date);
	x = dt.getFullYear() + "년 ";
	x += ((dt.getMonth() + 1) + "월 ");
	x += (dt.getDate() + "일");
	cnt.getElementsByClassName("estimate_date")[0].innerText = x;

	// =========================== 견적명 =========================
	t = storage.estimate.title;
	cnt.getElementsByClassName("estimate_project")[0].innerText = t === undefined ? "" : t;

	// ========================== 담당자 및 고객사 ==========================
	t = [];
	t[0] = storage.estimate.cip;
	if(t[0] === undefined)	t[0] = "";
	
	t[1] = storage.estimate.customer;
	if(t[1] !== undefined){
		t[1] =  storage.customer[t[1]];
		t[1] = t[1] !== undefined ? t[1].name : storage.estimate.customer;
	}else t[1] = "";
	t[2] = t[1] + " " + t[0];
	t[2] = t[2].trim();
	cnt.getElementsByClassName("estimate_receiver")[0].innerText = t === undefined ? "" : t[2];

	// ====================================== 회사정보 및 담당자 정보 ======================================
	document.getElementsByClassName("company_name")[0].innerText = storage.estimate.firmName === undefined ? "" : storage.estimate.firmName;
	document.getElementsByClassName("company_ceo")[0].innerText = storage.estimate.representative === undefined ? "" : storage.estimate.representative;
	document.getElementsByClassName("company_address")[0].innerText = storage.estimate.address === undefined ? "" : storage.estimate.address;
	document.getElementsByClassName("company_contact")[0].innerText = (storage.estimate.phone === undefined ? "" : storage.estimate.phone) + " / " + (storage.estimate.fax === undefined ? "" : storage.estimate.fax);
	document.getElementsByClassName("estimate_sender")[0].innerText = storage.user[storage.my].userName + " " + storage.userRank[storage.user[storage.my].rank][0];

	// ====================== 견적 유효기간 ========================
	t = storage.estimate.exp;
	t = t === "1w" ? "견적일로 부터 1주일" : t === "2w" ? "견적일로 부터 2주일" : t === "4w" ? "견적일로 부터 4주일" : t === "1m" ? "견적일로 부터 1개월" : "";
	cnt.getElementsByClassName("estiomate_expiration_period")[0].innerText = t;

	// ====================== 하단 주석 ========================
	t = storage.estimate.remarks;
	t = t === undefined ? "" : t;
	cnt.getElementsByClassName("estimate_remark")[0].innerHTML = t;

	// =========== 개별 아이템들 ============ 저장된 값들을 바탕으로 견적서에 그려 넣음 =============
	html = "<div style=\"display:grid;border-top:border-top: 1px solid black;\"><div>No</div><div>구 분</div><div>품 명 / 규 격</div><div>수 량</div><div>소비자가</div><div>공급단가</div><div>합계</div><div>비고</div></div>";
	sum = 0;
	items = storage.estimate.items === undefined ? [] : storage.estimate.items;
	if(storage.estimate.form == "기본견적서"){
		for(x = 0 ; x < items.length ; x++){
			each = items[x];
			t = each.quantity * each.price;
			html += ("<div style=\"display:grid;\"><div>" + (x+1) + "</div>");
			html += ("<div>" + each.div + "</div>");
			html += ("<div><span style=\"font-weight:bold;\">" + each.title + "</span><br />" + each.spec + "</div>");
			html += ("<div>" + each.quantity.toLocaleString() + "</div>");
			html += ("<div></div>");
			html += ("<div>" + each.price.toLocaleString() + "</div>");
			html += ("<div>" + t.toLocaleString() + "</div>");
			html += ("<div>" + each.remark + "</div></div>");
			sum += (each.quantity * each.price);
			vat += (each.vat ? Math.round(each.quantity * each.price / 10) : 0);
		}
	}else{
		for(x = 0 ; x < items.length ; x++){
			each = items[x];
			t = each.quantity * each.price;
			html += ("<div style=\"display:grid;background-color:#feff75;\"><div>" + (x+1) + "</div><div style=\"grid-column-start:2;grid-column-end:4;font-weight:bold;\">" + each.title + "</div><div></div><div></div><div></div><div>" + t.toLocaleString() + "</div><div></div></div>");
			html += ("<div style=\"display:grid;\"><div>" + (x+1) + "</div>");
			html += ("<div>" + each.div + "</div>");
			html += ("<div>" + each.spec + "</div>"); // ===
			html += ("<div>" + each.quantity.toLocaleString() + "</div>");
			html += ("<div></div>");
			html += ("<div>" + each.price.toLocaleString() + "</div>");
			html += ("<div>" + t.toLocaleString() + "</div>");
			html += ("<div>" + each.remark + "</div></div>");
			sum += (each.quantity * each.price);
			vat += (each.vat ? Math.round(each.quantity * each.price / 10) : 0);
		}
	}
	
	// ====================== 중간 부분 ===== 견적금액  ========================
	t = [vat, sum + vat];
	cnt.getElementsByClassName("estimate_total_amount")[0].innerText = "₩ " + t[1].toLocaleString()

	// ====================== 항목 하단 합계 금액 ========================
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">공급가합계</div><div style=\"display:initial;text-align:right;\">" + sum.toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">부가가치세</div><div style=\"display:initial;text-align:right;\">" + t[0].toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">총 금 액</div><div style=\"display:initial;text-align:right;\">" + t[1].toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");

	document.getElementsByClassName("estimate_content")[0].innerHTML = html;
} // End of setDataToPreview() /////////////////////////////////////////////////////////////////////////////////


// 입력된 항목 정보를 반영하는 함수
function setItem(el, e){
	let x, y, items, els, each, sum, t, regex = /[^0-9]/g, vatInclude;

	// 전처리
	if(el.dataset !== undefined){
		if(el.dataset.type === "number"){
			t = el.value;
			t = t.replaceAll(regex, "");
			t = t.length > 0 ? t*1 : t;
			if((typeof t) === "number")	el.value = t.toLocaleString();
			else 			el.value = t;
		}else if(el.dataset.type === "customer"){
			inputSupplier(el, e);
		}else if(el.dataset.type === "item"){
			inputItem(el, e);
		}
	}
	
	// 항목 입력 엘리먼트들의 값을 전역 변수에 저장함 
	items = [];
	els = document.getElementsByClassName("estimateItem");

	for(x = 0 ; x < els.length ; x++){
		t = els[x].children[1].getElementsByTagName("input");
		each = {};
		sum = 0;
		each.div = t[0].value;
		each.title = t[1].value;
		each.supplier = t[2].dataset.value;
		each.item = t[3].dataset.value;
		each.quantity = t[4].value.replaceAll(",","")*1;
		each.price = t[5].value.replaceAll(",","")*1;
		each.vat = t[6].checked;
		each.spec = els[x].children[1].getElementsByTagName("textarea")[0].value.replaceAll("\n", "<br />");
		each.remark = els[x].children[1].getElementsByTagName("textarea")[1].value.replaceAll("\n", "<br />");
		items.push(each);
		t = each.vat ? [Math.round((each.quantity * each.price) * 0.1), Math.round((each.quantity * each.price) * 1.1)]
			: [0, each.quantity * each.price];
		els[x].children[1].children[15].children[2].innerText = t[0].toLocaleString();
		els[x].children[1].children[17].innerText = t[1].toLocaleString();
	}

	storage.estimate.items = items;
	setDataToPreview();
} // End of setItem();


function selectAcCustomer(no, fnc){
	let acCnt, customer, t;
	
	if(no === null || no === undefined || no === "" || isNaN(no) || storage.ac.searched === undefined || storage.ac.searched.length <= no)	return;

	fnc(no);
} // End of selectAcCustomer()

function passed(step){
	let x, els, chk;
	if(step === 1){
		els = [];
		els[0] = document.getElementsByClassName("estimateFormName");
		els[1] = document.getElementsByClassName("estimateProject")[0];
		chk = false;
		for(x = 0 ; x < els[0].length ; x++)	if(els[0][x].checked)	chk = true;
		if(els[1].value !== "" && chk){
			document.getElementsByClassName("eachContent")[0].children[0].children[1].className = "passed";
			els = document.getElementsByClassName("eachContent")[0].children[0].children[1].getElementsByTagName("input");
			for(x = 0 ; x < els.length ; x++)	els[x].disabled = false;
			els = document.getElementsByClassName("eachContent")[0].children[0].children[1].getElementsByTagName("textarea");
			for(x = 0 ; x < els.length ; x++)	els[x].disabled = false;
		}
	}else if(step === 2){
		els = document.querySelector("#bodyContent > div.eachContainer > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)").getElementsByTagName("input");
		if(els[0].value !== "" && els[1].value !== "" && (els[2].checked || els[3].checked || els[4].checked || els[5].checked)){
			document.querySelector("#bodyContent > div.eachContainer > div > div:nth-child(1) > div:nth-child(3)").className = "passed";
			els = document.getElementsByClassName("eachContent")[0].children[0].children[2].getElementsByTagName("input");
			for(x = 0 ; x < els.length ; x++)	els[x].disabled = false;
			els = document.getElementsByClassName("eachContent")[0].children[0].children[2].getElementsByTagName("textarea");
			for(x = 0 ; x < els.length ; x++)	els[x].disabled = false;
			document.getElementsByClassName("bodyTitleFnc")[1].children[0].style = "block";
		}
	}
} // End of passed()

// 견적 항목을 추가하는 한수
function addEstimateItem(el){
	let html, t, cnt = el.parentElement.parentElement.parentElement.parentElement, x = storage.estimate.items.length;
	html = "<div style=\"width:15px;\"></div><div><div>구 분</div><input onkeyup=\"setItem(this)\" /><div>타이틀</div><input onkeyup=\"setItem(this)\" style=\"border-right:1px solid #c3c3c3;\" /><div>매입처</div><input onkeyup=\"setItem(this, event)\" data-type=\"customer\" /><div>아이템</div><input onkeyup=\"setItem(this, event)\" data-type=\"item\" style=\"border-right:1px solid #c3c3c3;\" /><div>스 펙</div><div style=\"grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;\"><textarea  id=\"spec\" onkeyup=\"setItem(this)\" style=\"width:100%;height:100%\"></textarea></div><div>수 량</div><input onkeyup=\"setItem(this)\" data-type=\"number\" /><div>단 가</div><input onkeyup=\"setItem(this)\" data-type=\"number\" style=\"border-right:1px solid #c3c3c3;\" /><div>VAT</div><div><label style=\"width:20%;\"><input type=\"radio\" name=\"vatInclude" + x +"\" checked onchange=\"setItem(this)\" />과세</label><label style=\"width:30%;\"><input type=\"radio\" name=\"vatInclude" + x + "\" onchange=\"setItem(this)\" />비과세</label><div style=\"display:inline-block;width:50%;text-align:right\"></div></div><div>합 계</div><div style=\"border-right:1px solid #c3c3c3;\"></div><div>비 고</div><textarea onkeyup=\"setItem(this)\" style=\"grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;\"></textarea></div>";
	t = document.createElement("div");
	t.className = "estimateItem";
	t.innerHTML = html;
	cnt.appendChild(t);
} // End of addEstimateItem()

// 견적 항목을 제거하는 한수
function removeEstimateItem(el){
	let els = document.getElementsByClassName("estimateItem");
	if(els.length > 1){
		els[els.length - 1].remove();	
		storage.estimate.items.pop()
	}
} // End of removeEstimateItem()

// 견적 데이터를 인풋 엘리먼트에 넣어주는 함수
function setDataToInput(estimate){
	let x, t, v, el;

	// 양식 활성화
	v = estimate.form;
	el = document.getElementsByClassName("formNames")[0].getElementsByTagName("label");
	for(x = 0 ; x < el.length ; x++){
		if(el[x].innerText == v){
			el[x].click();
			break;
		}
	}
	// 견적명
	v = estimate.title;
	el = document.getElementsByClassName("estimateProject")[0];
	el.value = v;
	passed(1);

	// 업체명 
	v = estimate.title;
	el = document.getElementsByClassName("estimateInput")[0];
	el.dataset.value = v;
	t = storage.customer[v];
	t = t !== undefined ? t.name : v;
	el.value = t;

	// 업체 담당자
	v = estimate.title;
	el = document.getElementsByClassName("estimateInput")[1];
	el.value = v;

	// 유효기간
	v = estimate.exp;
	el = document.getElementsByName("rExp");
	for(x = 0 ; x < el.length ; x++)	if(el[x].value == v)	el[x].checked = true;

	// 하단 비고
	v = estimate.remarks;
	el = document.getElementsByClassName("formExp")[0].nextElementSibling.nextElementSibling;
	el.value = v.replaceAll("<br />","\n");
	passed(2);

	// ======================== 견적 항목 입력 ========================

	// 아이템 수 만큼 엘리먼트 만들어두기
	el = document.getElementsByClassName("addBtn")[0];
	for(x = 1 ; x < estimate.items.length ; x++)	addEstimateItem(el);

	// ===== for loop =====
	el = document.getElementsByClassName("estimateItem");
	for(x = 0 ; x < estimate.items.length ; x++){

		// 구분
		v = estimate.items[x].div;
		el[x].children[1].children[1].value = v;

		// 타이틀
		v = estimate.items[x].title;
		el[x].children[1].children[3].value = v;

		// 매입처
		v = estimate.items[x].supplier;
		el[x].children[1].children[5].dataset.value = v;
		t = storage.customer[v];
		if(t !== undefined && t.name !== undefined)	el[x].children[1].children[5].value = t.name;
		else										el[x].children[1].children[5].value = v;

		// 아이템
		v = estimate.items[x].item;
		el[x].children[1].children[7].dataset.value = v;
		for(t = 0 ; t < storage.item.length ; t++){
			if(t === undefined) continue;
			if(storage.item[t].no = v)	break;
		}
		t = storage.item[t];
		if(t !== undefined && t.no !== undefined)	el[x].children[1].children[7].value = t.product;
		else										el[x].children[1].children[7].value = v;

		// 스펙
		v = estimate.items[x].spec;
		el[x].children[1].children[9].value = v;

		// 수량
		v = estimate.items[x].quantity;
		el[x].children[1].children[11].value = v;

		// 가격
		v = estimate.items[x].price;
		el[x].children[1].children[13].value = v;

		// 과세여부
		v = estimate.items[x].vat;
		if(v)	el[x].children[1].children[15].children[0].children[0].checked;
		else	el[x].children[1].children[15].children[1].children[0].checked;

		// 비고
		v = estimate.items[x].remark;
		el[x].children[1].children[19].value = v.replaceAll("<br />","\n");		
	}

	storage.estimate = estimate;
	setDataToPreview();
} // End of setDataToInput()

// 견적 목록 클릭 이벤트 리스너
function clickedEstimate(el){
	let x, cnt, els, color = "#2147b1", estmNo, versionList;

	versionList = document.getElementsByClassName("versionList");
	if(versionList.length > 0){
		for(let i = 0; i < versionList.length; i++){
			versionList[i].remove();
		}
	}

	thisEle = el;
	versionList = document.createElement("div");
	versionList.className = "versionList";
	thisEle.after(versionList);
	cnt = thisEle.parentElement;
	els = cnt.children;

	for(x = 1 ; x < els.length ; x++){
		els[x].style.backgroundColor = "";
		els[x].style.color = "";
	}	

	thisEle.style.backgroundColor = color;
	thisEle.style.color = "#ffffff";
	estmNo = thisEle.dataset.no;
	getEstmVerList(estmNo);
	setTimeout(() => {
		$(thisEle).next().children(".versionListBody").eq(0).trigger("click");
	}, 300);
} // End of clickedEstimate()

function clickedEstmVer(el){
	let x, cnt, els, color = "#e1e9ff";
	cnt = document.getElementsByClassName("versionPreview")[0];
	els = el.parentElement.children;
	for(x = 1 ; x < els.length ; x++)	els[x].style.backgroundColor = "";
	el.style.backgroundColor = color;
	x = el.dataset.idx*1;
	cnt.innerHTML = storage.estmVerList[x].doc;
	storage.detailIdx = $(el).data("idx");
	// cnt.style.height = Math.floor(400 / storage.estmVerList[x].width * storage.estmVerList[x].height) + "px";
} // End of clickedEstmVer()

// 견적 목록을 그리는 함수
function drawEstmList(){
	let cnt, html, x, t, disDate;
	cnt = document.getElementsByClassName("estimateList")[0];

	html = "<div class=\"estimateAddBtns\"><button type=\"button\" onclick=\"clickedAdd();\">새견적추가</button></div>";
	html += "<div class=\"estimateListHeader\">";
	html += "<div>견적일자</div>";
	html += "<div>견적명</div>";
	html += "<div>버전</div>";
	html += "<div>양식</div>";
	html += "<div>금액</div>";
	html += "</div>";
	
	for(x = 0 ; x < storage.estmList.length ; x++){
		disDate = dateDis(storage.estmList[x].date);
		disDate = dateFnc(disDate, "yyyy.mm.dd");

		html += "<div class=\"esimateListBody\" onclick=\"clickedEstimate(this)\" data-idx=\"" + x + "\" data-no=\"" + storage.estmList[x].no + "\">";
		html += "<div style=\"justify-content: center;\">" + disDate + "</div>";
		html += "<div style=\"justify-content: left;\">" + storage.estmList[x].title + "</div>";
		html += "<div style=\"justify-content: center;\">" + storage.estmList[x].version + "</div>";
		html += "<div style=\"justify-content: center;\">" + storage.estmList[x].form + "</div>";
		html += "<div style=\"justify-content: right;\">" + storage.estmList[x].total.toLocaleString() + "</div></div>";
		html += "</div>";
	}

	cnt.innerHTML = html;
} // End of drawEstmList()

// 견적 버전 목록을 그리는 함수
function drawEstmVerList(){
	let cnt, html = "", x, t, versionPreview;
	cnt = document.getElementsByClassName("versionList")[0];
	html = "<div class=\"versionListHeader\">";
	html += "<div>버전</div>";
	html += "<div>견적명</div>";
	html += "<div>담당자</div>";
	html += "<div>견적일자</div>";
	html += "<div>금액</div>";
	html += "</div>";
	
	for(x = storage.estmVerList.length-1 ; x >= 0 ; x--){
		html += "<div class=\"versionListBody\" onclick=\"clickedEstmVer(this)\" data-idx=\"" + x + "\">";
		html += "<div style=\"justify-content: center;\">" + storage.estmVerList[x].version + "</div>";
		html += "<div style=\"justify-content: left;\">" + storage.estmVerList[x].title + "</div>";
		html += "<div style=\"justify-content: center;\">" + storage.user[storage.estmVerList[x].writer].userName + "</div>";
		html += "<div style=\"justify-content: center;\">" + dateFormat(storage.estmVerList[x].date) + "</div>";
		html += "<div style=\"justify-content: right;\">" + storage.estmList[x].total.toLocaleString() + "</div>";
		html += "</div>";
	}
	
	cnt.innerHTML = html;
	setTimeout(() => {
		versionPreview = $(".versionPreview");
		versionPreview.prepend("<div class=\"estimateUpdateBtns\"><button type=\"button\" onclick=\"clickedUpdate();\">견적수정</button></div>");
	}, 500)
} // End of drawEstmList()

// 견적 정보를 저장하는 함수
function saveEstimate(){
	let url, data, width = 0, height = 0, x;
	url = apiServer + "/api/estimate";
	data = storage.estimate;

	for(x = 0 ; x < storage.estimateForm.length ; x++){
		if(storage.estimateForm[x].name === storage.estimate.form){
			height = storage.estimateForm[x].height;
			width = storage.estimateForm[x].width;
			break;
		}
	}

	data.doc = document.getElementsByClassName("estimatePreview")[0].innerHTML.replaceAll("\r","").replaceAll("\n","");
	data.width = width;
	data.height = height;
	data.no = null;
	data.version = 1;
	data.related = {};
	data.related.parent = "empty:0000";
	data.related.previous = "empty:0000";
	data.related.next = ["empty:0000","empty:0000"];
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	$.ajax({
		"url": url,
		"data":data,
		"method": "post",
		"dataType": "json",
		"contentType":"text/plain",
		"cache": false,
		success: (data) => {
			if (data.result === "ok") {
				console.log(" = = = O K = = = ");
			} else {
				console.log(data.msg);
			}
		}
	});
} // End of saveEstimate()


// 견적 정보를 가져하는 함수
function getEstimateList(){
	let url;
	url = apiServer + "/api/estimate";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			if (data.result === "ok") {
				list = data.data;
				list = cipher.decAes(list);
				storage.estmList = JSON.parse(list);
				drawEstmList();
			} else {
				console.log(data.msg);
			}
		}
	});
} // End of getEstimateList()

// 견적 버전 목록을 가져오는 함수
function getEstmVerList(estmNo){
	let url;
	url = apiServer + "/api/estimate/" + estmNo;

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list, x;
			if (data.result === "ok") {
				list = data.data;
				list = cipher.decAes(list);
				list = JSON.parse(list);
				for(x = 0 ; x < list.length ; x++)	list[x].doc = cipher.decAes(list[x].doc);
				storage.estmVerList = list;
				drawEstmVerList();
			} else {
				console.log(data.msg);
			}
		}
	});
} // End of getEstimateList()

function dateFormat(l){
	let str = "", dt;
	if(l === undefined || l === null || isNaN(l))	return "";
	dt = new Date(l);
	str += (dt.getFullYear() + ".");
	str += ((dt.getMonth()+1) + ".");
	str += (dt.getDate());
	return str;
} // End of dateFormat()

function estimateInsert(){
	if($("#date").val() === ""){
		msg.set("견적일자를 입력해주세요.");
		$("#date").focus();
		return false;
	}else if($("#title").val() === ""){
		msg.set("사업명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("고객사를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if(!validateAutoComplete($("#customer").val(), "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#cip").val() === ""){
		msg.set("고객사 담당자를 입력해주세요.");
		$("#cip").focus();
		return false;
	}else if(!validateAutoComplete($("#cip").val(), "cip")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#cip").focus();
		return false;
	}else if($("#exp").val() === ""){
		msg.set("유효기간을 입력해주세요.");
		$("#exp").focus();
		return false;
	}else{
		let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas;
		pdfMainContentTitle = $(".pdfMainContainer .pdfMainContentTitle");
		pdfMainContentItem = $(".pdfMainContainer .pdfMainContentItem");
		remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
		address = $(".address").val();
		cip = $("#cip").val();
		customer = $("#customer").data("value").toString();
		date = new Date($("#date").val()).getTime();
		exp = $("#exp").val();
		fax = $("#fax").val();
		firmName = $("#firmName").val();
		phone = $("#phone").val();
		representative = $("#representative").val();
		title = $("#title").val();
		items = [];
		
		if(pdfMainContentTitle.length > 0){
			form = "서브타이틀";
		}else{
			form = "기본견적서";
		}
	
		for(let i = 0; i < pdfMainContentItem.length; i++){
			let item = $(pdfMainContentItem[i]);
			let textareaId = item.find(".itemSpec").children().attr("id");
			let itemTitle = item.prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
			let price;
	
			if($("[name=\"vat\"]:checked").data("value")){
				let tax = parseInt(item.find(".itemTotal").html().replaceAll(",", "") / 10);
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", "")) + parseInt(tax);
			}else{
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", ""));
			}
	
			if(itemTitle === undefined){
				itemTitle = "";
			}
	
			let itemDatas = {
				"div": item.find(".itemDivision").children().val(),
				"price": parseInt(item.find(".itemTotal").html().replaceAll(",", "")), 
				"quantity": parseInt(item.find(".itemQuantity").children().val()),
				"remark": item.find(".itemRemarks").children().val(),
				"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
				"item": "1100041",
				"supplier": $("#customer").data("value").toString(),
				"title": itemTitle,
				"vat": $("[name=\"vat\"]:checked").data("value"),
			};
			items.push(itemDatas);
		}
	
		insertCopyPdf();
		
		setTimeout(() => {
			addPdfForm = $(".addPdfForm");
		
			datas = {
				"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
				"address": address,
				"cip": cip,
				"customer": customer,
				"date": date,
				"exp": exp,
				"fax": fax,
				"firmName": firmName,
				"form": form,
				"items": items,
				"phone": phone,
				"representative": representative,
				"title": title,
				"width": 210,
				"height": 297,
				"no": null,
				"version": 1,
				"related": {
					"parent": null,
					"previous": null,
					"next": [null],
					"estimate": {
						"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
						"address": address,
						"cip": cip,
						"customer": customer,
						"date": date,
						"exp": exp,
						"fax": fax,
						"firmName": firmName,
						"form": form,
						"items": items,
						"phone": phone,
						"representative": representative,
						"title": title,
						"width": 210,
						"height": 297,
						"no": null,
						"version": 1,
						"remarks": remarks,
					}
				},
				"remarks": remarks,
			};
		
			datas = JSON.stringify(datas);
			datas = cipher.encAes(datas);
		
			$.ajax({
				url: "/api/estimate",
				method: "post",
				data: datas,
				dataType: "json",
				contentType: "text/plain",
				success: (result) => {
					location.reload();
					msg.set("등록되었습니다.");
				},
				error: () => {
					msg.set("에러입니다.");
				}
			});
		}, 300)
	}
}

function estimateUpdate(){
	if($("#date").val() === ""){
		msg.set("견적일자를 입력해주세요.");
		$("#date").focus();
		return false;
	}else if($("#title").val() === ""){
		msg.set("사업명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("고객사를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if(!validateAutoComplete($("#customer").val(), "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#cip").val() === ""){
		msg.set("고객사 담당자를 입력해주세요.");
		$("#cip").focus();
		return false;
	}else if(!validateAutoComplete($("#cip").val(), "cip")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#cip").focus();
		return false;
	}else if($("#exp").val() === ""){
		msg.set("유효기간을 입력해주세요.");
		$("#exp").focus();
		return false;
	}else{
		let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas;
		pdfMainContentTitle = $(".pdfMainContainer .pdfMainContentTitle");
		pdfMainContentItem = $(".pdfMainContainer .pdfMainContentItem");
		remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
		address = $(".address").val();
		cip = $("#cip").val();
		customer = $("#customer").data("value").toString();
		date = new Date($("#date").val()).getTime();
		exp = $("#exp").val();
		fax = $("#fax").val();
		firmName = $("#firmName").val();
		phone = $("#phone").val();
		representative = $("#representative").val();
		title = $("#title").val();
		items = [];
		
		if(pdfMainContentTitle.length > 0){
			form = "서브타이틀";
		}else{
			form = "기본견적서";
		}
	
		for(let i = 0; i < pdfMainContentItem.length; i++){
			let item = $(pdfMainContentItem[i]);
			let textareaId = item.find(".itemSpec").children().attr("id");
			let itemTitle = item.prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
			let price;
	
			if($("[name=\"vat\"]:checked").data("value")){
				let tax = parseInt(item.find(".itemTotal").html().replaceAll(",", "") / 10);
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", "")) + parseInt(tax);
			}else{
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", ""));
			}
	
			if(itemTitle === undefined){
				itemTitle = "";
			}
	
			let itemDatas = {
				"div": item.find(".itemDivision").children().val(),
				"price": parseInt(item.find(".itemTotal").html().replaceAll(",", "")), 
				"quantity": parseInt(item.find(".itemQuantity").children().val()),
				"remark": item.find(".itemRemarks").children().val(),
				"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
				"item": "1100041",
				"supplier": $("#customer").data("value").toString(),
				"title": itemTitle,
				"vat": $("[name=\"vat\"]:checked").data("value"),
			};
			items.push(itemDatas);
		}
	
		insertCopyPdf();
		
		setTimeout(() => {
			addPdfForm = $(".addPdfForm");
		
			datas = {
				"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
				"address": address,
				"cip": cip,
				"customer": customer,
				"date": date,
				"exp": exp,
				"fax": fax,
				"firmName": firmName,
				"form": form,
				"items": items,
				"phone": phone,
				"representative": representative,
				"title": title,
				"width": 210,
				"height": 297,
				"no": storage.estmDetail.no,
				"version": 1,
				"related": {
					"parent": null,
					"previous": null,
					"next": [null],
					"estimate": {
						"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
						"address": address,
						"cip": cip,
						"customer": customer,
						"date": date,
						"exp": exp,
						"fax": fax,
						"firmName": firmName,
						"form": form,
						"items": items,
						"phone": phone,
						"representative": representative,
						"title": title,
						"width": 210,
						"height": 297,
						"no": storage.estmDetail.no,
						"version": 1,
						"remarks": remarks,
					}
				},
				"remarks": remarks,
			};
		
			datas = JSON.stringify(datas);
			datas = cipher.encAes(datas);
		
			$.ajax({
				url: "/api/estimate/" + storage.estmDetail.no,
				method: "post",
				data: datas,
				dataType: "json",
				contentType: "text/plain",
				success: (result) => {
					location.reload();
					msg.set("수정되었습니다.");
				},
				error: () => {
					msg.set("에러입니다.");
				}
			});
		}, 300)
	}
}

function addEstTitle(e){
	let thisEle;
	thisEle = $(e);
	thisEle.parent().before("<div class=\"pdfMainContentTitle\"><div class=\"subTitleIndex\"></div><div class=\"subTitle\"><input type=\"text\" placeholder=\"타이틀입력\"></div><div></div><div></div><div></div><div class=\"subTitleTotal\"></div><div></div><div></div></div>");
	
	let subTitleIndex = $(".subTitleIndex");
	subTitleIndex.eq(subTitleIndex.length - 1).html(romanize(subTitleIndex.length));
	storage.subItemLength = 0;
}

function addEstItem(e){
	let thisEle;
	thisEle = $(e);
	thisEle.parent().before("<div class=\"pdfMainContentItem\"><div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"oneEstItemRemove(this);\">-</button></div></div>");
	productNameSet();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	addItemIndex();
}

function oneEstItemAdd(e){
	let thisEle, parent;
	thisEle = $(e);
	parent = thisEle.parents(".pdfMainContentItem");
	parent.after("<div class=\"pdfMainContentItem\"><div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"oneEstItemRemove(this);\">-</button></div></div>");
	productNameSet();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	addItemIndex();
}

function removeEstItem(e){
	let thisEle;
	thisEle = $(e);

	if(thisEle.parent().prev().attr("class") !== "pdfMainContentHeader"){
		thisEle.parent().prev().remove();
	}

	addItemIndex();
	setTotalHtml();
	setTitleTotal();
}

function oneEstItemRemove(e){
	let thisEle, parent;
	thisEle = $(e);
	parent = thisEle.parents(".pdfMainContentItem");
	parent.remove();
	addItemIndex();
	setTotalHtml();
	setTitleTotal();
}

function addItemIndex(){
	let mainDiv, mainPdf;
	let index = 0;
	mainPdf = $(".mainPdf");

	if(mainPdf.length > 1){
		mainDiv = mainPdf.eq(1).find(".pdfMainContainer").children("div");
	}else{
		mainDiv = mainPdf.eq(0).find(".pdfMainContainer").children("div");
	}
	
	for(let i = 0; i < mainDiv.length; i++){
		if($(mainDiv[i]).attr("class") === "pdfMainContentItem"){
			index++;
			$(mainDiv[i]).find(".itemIndex").html(index);
		}else if($(mainDiv[i]).attr("class") === "pdfMainContentAddBtns"){
			return false;
		}else{
			index = 0;
		}
	}
}

function productNameSet(){
	let pdfMainContentItem, itemProductName, mainPdf;
	mainPdf = $(".mainPdf");

	if(mainPdf.length > 1){
		pdfMainContentItem = mainPdf.eq(1).find(".pdfMainContentItem");
		itemProductName = mainPdf.eq(1).find(".itemSpec textarea");
	}else{
		pdfMainContentItem = mainPdf.eq(0).find(".pdfMainContentItem");
		itemProductName = mainPdf.eq(0).find(".itemSpec textarea");
	}

	for(let i = 1; i <= pdfMainContentItem.length; i++){
		$(itemProductName[i-1]).attr("id", "itemProductName_" + i);
	}
}

function romanize(num) {
    let digits, key, roman, i;
    if (isNaN(num)) return NaN;
    digits = String(+num).split("");
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"];
    roman = "";
    i = 3;
    while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function itemCalKeyup(e){
	let thisEle, itemQuantity, itemAmount, itemTotal, cal;
	thisEle = $(e);
	itemQuantity = thisEle.parent().parent().find(".itemQuantity").children();
	itemAmount = thisEle.parent().parent().find(".itemAmount").children();
	itemTotal = thisEle.parent().nextAll(".itemTotal");
	
	if(itemQuantity.val() === ""){
		itemQuantity.val(1);
	}
	
	thisEle.val(thisEle.val().replace(/[^0-9]/g,""));
	cal = parseInt(itemAmount.val().replaceAll(",", "")) * parseInt(itemQuantity.val());
	itemTotal.html(cal.toLocaleString("en-US"));
	inputNumberFormat(thisEle);
	setTotalHtml();
	setTitleTotal();
}

function estimateFormInit(){
	let selectAddress, writer, pdfMainContentAddBtns;
	selectAddress = $(".selectAddress select");
	writer = $("#writer");
	pdfMainContentAddBtns = $(".pdfMainContentAddBtns");

	for(let index in storage.estimateBasic){
		selectAddress.append("<option value=\"" + index + "\">" + storage.estimateBasic[index].name + "</option>")
	}
	
	writer.val(storage.user[storage.my].userName);

	if(storage.estmDetail !== undefined){
		for(let key in storage.estmDetail.related.estimate){
			if($("#" + key) !== undefined){
				let value = storage.estmDetail.related.estimate[key];

				if(key === "date"){
					value = new Date(storage.estmDetail.related.estimate[key]);
					value = dateDis(value);
					value = dateFnc(value);
				}else if(key === "customer"){
					$("#" + key).attr("data-value", value);
					value = storage.customer[value].name;
				}
				
				$("#" + key).val(value);
			}

		}

		if(storage.estmDetail.related.estimate.items.length > 0){
			detailItemSet();
		}
	}

	selectAddressInit();
}

function detailItemSet(){
	let thisBtn;
	let item = storage.estmDetail.related.estimate;
	let items = storage.estmDetail.related.estimate.items;

	for(let i = 0; i < items.length; i++){
		if(item.form === "서브타이틀"){
			let pdfMainContentTitle = $(".mainPdf").eq(1).find(".pdfMainContentTitle");
			
			if(pdfMainContentTitle.length == 0 || pdfMainContentTitle === undefined){
				thisBtn = $(".mainPdf").eq(1).find(".pdfMainContentAddBtns button").eq(0);
				addEstTitle(thisBtn);
				let subTitle = $(".mainPdf").eq(1).find(".subTitle");
				subTitle.eq(i).find("input").val(items[i].title);
			}
		}
		
		thisBtn = $(".mainPdf").eq(1).find(".pdfMainContentAddBtns button").eq(1);
		addEstItem(thisBtn);
		let pdfMainContentItem = $(".mainPdf").eq(1).find(".pdfMainContentItem").eq(i);
		pdfMainContentItem.find(".itemDivision input").val(items[i].div);
		pdfMainContentItem.find(".itemSpec").find("textarea").val(items[i].spec);
		pdfMainContentItem.find(".itemQuantity").find("input").val(items[i].quantity);
		pdfMainContentItem.find(".itemAmount").find("input").val(numberFormat(items[i].price));
		pdfMainContentItem.find(".itemRemarks").find("input").val(items[i].remark);
		itemCalKeyup(pdfMainContentItem.find(".itemAmount input"));
	}
}

function selectAddressChange(e){
	let thisEle, thisEleIndex;
	thisEle = $(e);
	thisEleIndex = thisEle.val();
	selectAddressInit(thisEleIndex);
}

function selectAddressInit(index){
	let firmName, representative, address, phone, fax;
	firmName = $("#firmName");
	representative = $("#representative");
	address = $(".address");
	phone = $("#phone");
	fax = $("#fax");

	if(index === undefined){
		firmName.val(storage.estimateBasic[1].firmName);
		representative.val(storage.estimateBasic[1].representative);
		address.val(storage.estimateBasic[1].address);
		phone.val(storage.estimateBasic[1].phone);
		fax.val(storage.estimateBasic[1].fax);
	}else{
		firmName.val(storage.estimateBasic[index].firmName);
		representative.val(storage.estimateBasic[index].representative);
		address.val(storage.estimateBasic[index].address);
		phone.val(storage.estimateBasic[index].phone);
		fax.val(storage.estimateBasic[index].fax);
	}
}

function setTotalHtml(){
	let pdfMainContentAmount, pdfMainContentTotal, pdfHeadInfoPrice, pdfMainContentItem, pdfMainContentTax, calAmount = 0;
	if($(".mainPdf").length > 1){
		pdfMainContentAmount = $(".mainPdf").eq(1).find(".pdfMainContentAmount div").eq(1);
		pdfMainContentTotal = $(".mainPdf").eq(1).find(".pdfMainContentTotal div").eq(1);
		pdfHeadInfoPrice = $(".mainPdf").eq(1).find(".pdfHeadInfoPrice div:eq(0) input");
		pdfMainContentItem = $(".mainPdf").eq(1).find(".pdfMainContentItem .itemTotal");
		pdfMainContentTax = $(".mainPdf").eq(1).find(".pdfMainContentTax div").eq(1);
	}else{
		pdfMainContentAmount = $(".pdfMainContentAmount div").eq(1);
		pdfMainContentTotal = $(".pdfMainContentTotal div").eq(1);
		pdfHeadInfoPrice = $(".pdfHeadInfoPrice div:eq(0) input");
		pdfMainContentItem = $(".pdfMainContentItem .itemTotal");
		pdfMainContentTax = $(".pdfMainContentTax div").eq(1);
	}

	for(let i = 0; i < pdfMainContentItem.length; i++){
		let item = parseInt($(pdfMainContentItem[i]).html().replaceAll(",", ""));
		
		if(isNaN(item)){
			item = 0;
		}
		
		calAmount += item;
	}
	
	pdfMainContentAmount.html(calAmount.toLocaleString("en-US"));

	if($("#vatTrue").is(":checked")){
		
		pdfMainContentTax.html(parseInt(pdfMainContentAmount.html().replaceAll(",", "") / 10).toLocaleString("en-US"));
	}else{
		pdfMainContentTax.html(0);
	}

	pdfMainContentTotal.html((calAmount + parseInt(pdfMainContentTax.html().replaceAll(",", ""))).toLocaleString("en-US"));
	pdfHeadInfoPrice.val(pdfMainContentTotal.html());
}

function setTitleTotal(){
	let mainDiv;
	let calTotal = 0;
	mainDiv = $(".pdfMainContainer").children("div");
	
	for(let i = 0; i < mainDiv.length; i++){
		if($(mainDiv[i]).attr("class") === "pdfMainContentItem"){
			if($(mainDiv[i]).find(".itemTotal").html() !== ""){
				calTotal += parseInt($(mainDiv[i]).find(".itemTotal").html().replaceAll(",", ""));
			}

			$(mainDiv[i]).prevAll(".pdfMainContentTitle").eq(0).find(".subTitleTotal").html(calTotal.toLocaleString("en-Us"));
		}else if($(mainDiv[i]).attr("class") === "pdfMainContentAddBtns"){
			return false;
		}else{
			calTotal = 0;
		}
	}
}

function insertCopyPdf(){
	let mainPdf, pdfMainContentAddBtns;

	if($(".mainPdf").length > 1){
		mainPdf = $(".mainPdf").eq(1);
	}else{
		mainPdf = $(".mainPdf").eq(0);
	}
	
	pdfMainContentAddBtns = mainPdf.find(".pdfMainContentAddBtns");
	mainPdf.find(".selectAddress").remove();
	pdfMainContentAddBtns.remove();

	if (typeof CKEDITOR !== undefined) {
		if ($(CKEDITOR.instances).length) {
			for (var key in CKEDITOR.instances) {
				CKEDITOR.instances[key].destroy();
			}
		}
	}
	
	let mainInput = mainPdf.find("input");
	for(let i = 0; i < mainInput.length; i++){
		let item = $(mainInput[i]);
		let parent = item.parent();

		if(item.attr("type") === "radio"){
			if(item.attr("name") === "vat"){
				if($(".mainPdf").find("[name=\"vat\"]:checked").data("value")){
					item.after("<div class=\"afterDiv\">(VAT 포함)</div>");
					parent.children("input[type=\"radio\"]").remove();
				}else{
					item.after("<div class=\"afterDiv\">(VAT 비포함)</div>");
					parent.children("input[type=\"radio\"]").remove();
				}

				parent.children("label").remove();
			}
		}else{
			if(parent.attr("class") === "vatInfo"){
				parent.children().eq(1).after("<div class=\"afterDiv\" style=\"padding-left: 2vw; padding-right: 1vw; font-weight: 600;\">" + item.val() + "</div>");
				item.remove();
			}else{
				parent.append("<div class=\"afterDiv\">" + item.val() + "</div>");
				item.remove();
			}
		}
	}
	
	mainPdf.find(".headInfoCustomer").children(".afterDiv").eq(0).after("<span style=\"font-size: 11px; display: flex; align-items: center; padding-left: 3px; padding-right: 3px;\">/</span>");
	mainPdf.find(".headInfoPhone").children(".afterDiv").eq(0).after("<span style=\"font-size: 11px; display: flex; align-items: center; padding-left: 3px; padding-right: 3px;\">/</span>");

	let pdfMainContainer = mainPdf.find(".pdfMainContainer").children("div");
	for(let i = 0; i < pdfMainContainer.length; i++){
		let item = $(pdfMainContainer[i]);
		if(item.attr("class") === "pdfMainContentHeader" || item.attr("class") === "pdfMainContentTitle" || item.attr("class") === "pdfMainContentItem"){
			item.children("div").last().remove();
			item.css("grid-template-columns", "10% 10% 30% 10% 10% 10% 10% 10%");
		}
	}
	
	let textarea = mainPdf.find("textarea");
	for(let i = 0; i < textarea.length; i++){
		let item = $(textarea[i]);
		let parent = item.parent();
		parent.append("<div class=\"afterDiv\">" + item.val().replaceAll("<p>", "").replaceAll("</p>", "") + "</div>");
		item.remove();
	}
}