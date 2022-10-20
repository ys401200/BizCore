

$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		getEstimateForm();
		getEstimateItem();
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


	/* ================================================================================
	storage.ac.fnc[0] = function(no){
		let acCnt, customer, t;
	
		customer = storage.ac.searched[no];
		storage.ac.target.value = customer[1];
		
		t = storage.customer[customer[0]];
		storage.estimate.customer = t;
		t = t === undefined ? "" : t.name;
		t = storage.ac.cip === undefined ? t : t + " / " + storage.ac.cip;
		document.getElementsByClassName("estimate_receiver")[0].innerText = t;
	
		acCnt = document.getElementsByClassName("ac_cnt")[0];
		acCnt.innerHTML = "";
		acCnt.style.display = "none";
		storage.ac.select = undefined;
		storage.ac.searched = undefined;
		passed(2);
	}
	
	storage.ac.fnc[1] = function(no){
		let x, acCnt, customer, t, idx, els;

		t = storage.ac.target.parentElement.parentElement;
		els = document.getElementsByClassName("estimateItem");
		for(x = 0 ; x < els.length ; x++){
			if(t === els[x]){
				idx = x;
			}
		}

		console.log("idx : " + idx);
	
		customer = storage.ac.searched[no];
		storage.ac.target.value = customer[1];
		window.setTimeout(function(){storage.estimate.items[idx].supplier = customer[0];},100);
		
		acCnt = document.getElementsByClassName("ac_cnt")[0];
		acCnt.innerHTML = "";
		acCnt.style.display = "none";
		storage.ac.select = undefined;
		storage.ac.searched = undefined;
	} // ==================================================================================
	*/ 
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	storage.page = {"max":0,"current":0,"line":0};

	// For Initializing Code . . . . . . .  . . . . 
});

// 견적 추가버튼 클릭시 실행되는 한수
function clickedAdd(el){
	let x, cnt, html;

	storage.estimate = {};
	cnt = document.getElementsByClassName("estimatePreview")[0];
	document.getElementsByClassName("listContainer")[0].style.display = "none";
	document.getElementsByClassName("eachContainer")[0].style.display = "block";

	// 양식 목록
	html = "";
	for(x = 0 ; x < storage.estimateForm.length ; x++){
		html += ("<input type=\"radio\" class=\"estimateFormName\" name=\"estimateFormName\" style=\"display:none;\" id=\"estimateFormName" + x + "\" />");
		html += ("<label onclick=\"selectForm(" + x + ")\" for=\"estimateFormName" + x + "\" data-no=\"" + x + "\" style=\"margin:0 0.5em;\">" + storage.estimateForm[x].name + "</label>");
	}
	cnt = document.getElementsByClassName("formNames")[0];
	cnt.innerHTML = html;

	// 작성자 등 기본 정보
	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText = storage.user[storage.my].userName;
	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.textAlign = "center";
	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "공개";
	cnt.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.textAlign = "center";

} // End of clickedAdd()

// 견적 추가버튼 클릭시 실행되는 한수
function closeAdd(el){
	document.getElementsByClassName("listContainer")[0].style.display = "block";
	document.getElementsByClassName("eachContainer")[0].style.display = "none";
} // End of closeAdd()

// 서버에서 견적 양식을 가져오는 함수
function getEstimateForm(){
	let url;
	url = apiServer + "/api/estimate/form/";
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
				storage.estimateForm = list;
			} else {
				msg.set("[getEstimateForm] Fail to get estimate form(s).");
			}
		}
	});
} // End of getBankAccountDetail()

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
} // End of getBankAccountDetail()

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

		// 회사정보 및 담당자 정보
		document.getElementsByClassName("company_name")[0].innerText = storage.company.name.split("(")[0];
		document.getElementsByClassName("company_ceo")[0].innerText = storage.company.ceo;
		document.getElementsByClassName("company_address")[0].innerText = storage.company.address;
		document.getElementsByClassName("company_contact")[0].innerText = storage.company.phone + " / " + storage.company.fax ;
		document.getElementsByClassName("estimate_sender")[0].innerText = storage.user[storage.my].userName;;
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
	let x, t, items, each, sum, dt, cnt = document.getElementsByClassName("estimatePreview")[0];

	if(cnt === undefined)	return;
	
	// =============== 견적일자 =======================
	if(storage.estimate.date === undefined)	storage.estimate.date = (new Date()).getTime();
	dt = new Date(storage.estimate.date);
	x = dt.getFullYear() + "년 ";
	x += ((dt.getMonth() + 1) + "월 ");
	x += (dt.getDate() + "일");
	document.getElementsByClassName("estimate_date")[0].innerText = x;

	// =========================== 견적명 =========================
	t = storage.estimate.title;
	document.getElementsByClassName("estimate_project")[0].innerText = t === undefined ? "" : t;

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
	document.getElementsByClassName("estimate_receiver")[0].innerText = t === undefined ? "" : t[2];

	// ====================== 견적 유효기간 ========================
	t = storage.estimate.exp;
	t = t === "1w" ? "견적일로 부터 1주일" : t === "2w" ? "견적일로 부터 2주일" : t === "4w" ? "견적일로 부터 4주일" : t === "1m" ? "견적일로 부터 1개월" : "";
	document.getElementsByClassName("estiomate_expiration_period")[0].innerText = t;

	// =========== 개별 아이템들 ============ 저장된 값들을 바탕으로 견적서에 그려 넣음 =============
	html = "<div style=\"display:grid;border-top:border-top: 1px solid black;\"><div>No</div><div>구 분</div><div>품 명 / 규 격</div><div>수 량</div><div>소비자가</div><div>공급단가</div><div>합계</div><div>비고</div></div>";
	sum = 0;
	items = storage.estimate.items === undefined ? [] : storage.estimate.items;
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
		html += ("<div></div></div>");
		sum += (each.quantity * each.price);
	}
	t = [Math.round(sum * 0.1), Math.round(sum * 1.1)];
	document.getElementsByClassName("estimate_total_amount")[0].innerText = "₩ " + t[1].toLocaleString()
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">공급가합계</div><div style=\"display:initial;text-align:right;\">" + sum.toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">부가가치세</div><div style=\"display:initial;text-align:right;\">" + t[0].toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");
	html += ("<div style=\"display:grid;\"><div style=\"grid-column-start:1;grid-column-end:7;\">총 금 액</div><div style=\"display:initial;text-align:right;\">" + t[1].toLocaleString() + "</div><div style=\"border-right:none;\"></div></div>");

	document.getElementsByClassName("estimate_content")[0].innerHTML = html;

} // End of setDataToPreview() /////////////////////////////////////////////////////////////////////////////////


// 입력된 항목 정보를 반영하는 함수
function setItem(el, e){
	let x, items, els, each, sum, t, regex = /[^0-9]/g;

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
		each.spec = els[x].children[1].getElementsByTagName("textarea")[0].value.replaceAll("\n", "<br />");
		items.push(each);
		t = [Math.round((each.quantity * each.price) * 0.1), Math.round((each.quantity * each.price) * 1.1)];
		els[x].children[1].children[15].innerText = t[0].toLocaleString();
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
		if(els[1].value !== "" && chk)	document.getElementsByClassName("eachContent")[0].children[0].children[1].className = "passed";
	}else if(step === 2){
		els = document.querySelector("#bodyContent > div.eachContainer > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)").getElementsByTagName("input");
		if(els[0].value !== "" && els[1].value !== "" && (els[2].checked || els[3].checked || els[4].checked || els[5].checked)){
			document.querySelector("#bodyContent > div.eachContainer > div > div:nth-child(1) > div:nth-child(3)").className = "passed";
		}
	}
}

// 견적 항목을 추가하는 한수
function addEstimateItem(el){
	let html, t, cnt = el.parentElement.parentElement.parentElement.parentElement
	html = "<div style=\"width:15px;\"></div><div><div>구 분</div><input onkeyup=\"setItem(this)\" /><div>타이틀</div><input onkeyup=\"setItem(this)\" style=\"border-right:1px solid #c3c3c3;\" /><div>매입처</div><input onkeyup=\"setItem(this, event)\" data-type=\"customer\" /><div>아이템</div><input onkeyup=\"setItem(this, event)\" style=\"border-right:1px solid #c3c3c3;\" /><div>스 펙</div><textarea onkeyup=\"setItem(this)\" data-type=\"html\" style=\"grid-column-start: 2;grid-column-end: 5;border-right:1px solid #c3c3c3;height:100px;\"></textarea><div>수 량</div><input onkeyup=\"setItem(this)\" data-type=\"number\" /><div>단 가</div><input onkeyup=\"setItem(this)\" data-type=\"number\" style=\"border-right:1px solid #c3c3c3;\" /><div>VAT</div><div></div><div>합 계</div><div style=\"border-right:1px solid #c3c3c3;\"></div></div>";
	t = document.createElement("div");
	t.className = "estimateItem";
	t.innerHTML = html;
	cnt.appendChild(t);

} // End of addEstimateItem()

// 견적 항목을 제거하는 한수
function removeEstimateItem(el){
	let els = document.getElementsByClassName("estimateItem");
	if(els.length > 1)	els[els.length - 1].remove();	
} // End of removeEstimateItem()



















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


