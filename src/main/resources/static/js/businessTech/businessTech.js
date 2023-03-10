$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getTechList();
});

function getTechList() {
	let url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, techSuccessList, techErrorList);
} // End of getTechList()

function drawTechList() {
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput, hideArr, showArr;
	
	if (storage.scheduleList === undefined) {
		msg.set("등록된 일정이 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.scheduleList.sort(function(a, b){return b.created - a.created;});
		}else{
			jsonData = storage.searchDatas.sort(function(a, b){return b.created - a.created;});
		}
	}

	storage.tempArray = [];

	for(let i = 0; i < jsonData.length; i++){
		if(jsonData[i].job === "tech"){
			storage.tempArray.push(jsonData[i]);
		}
	}

	jsonData = storage.tempArray;

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn"];
	showArr = ["gridList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "listSearchInput"];
	containerTitle = $("#containerTitle");
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridList");

	header = [
		{
			"title" : "등록일",
			"align" : "center",
		},
		{
			"title" : "일정",
			"align" : "center",
		},
		{
			"title" : "일정구분",
			"align" : "center",
		},
		{
			"title" : "일정제목",
			"align" : "center",
		},
		{
			"title" : "매출처",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "장소",
			"align" : "center",
		},
		{
			"title" : "활동형태",
			"align" : "center",
		},
		{
			"title" : "일정설명",
			"align" : "center",
		},
	];

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 9,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content, type, disDate;
	
			job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "" : "기술일정";
			title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "" : jsonData[i].title;
			customer = (jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "" : storage.customer[jsonData[i].customer].name;
			writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "" : storage.user[jsonData[i].writer].userName;
			place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "" : jsonData[i].place;
			content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "" : jsonData[i].content;
			content = content.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br />", "");
			type = (jsonData[i].type === null || jsonData[i].type === "" || jsonData[i].type === undefined) ? "" : storage.code.etc[jsonData[i].type];
	
			fromDate = dateDis(jsonData[i].from);
			fromSetDate = dateFnc(fromDate, "mm-dd");
			
			toDate = dateDis(jsonData[i].to);
			toSetDate = dateFnc(toDate, "mm-dd");

			disDate = dateDis(jsonData[i].created, jsonData[i].modified);
			disDate = dateFnc(disDate, "mm-dd");
	
			str = [
				{
					"setData": disDate,
					"align": "center",
				},
				{
					"setData": fromSetDate + " ~ " + toSetDate,
					"align": "center",
				},
				{
					"setData": job,
					"align": "center",
				},
				{
					"setData": title,
					"align": "left",
				},
				{
					"setData": customer,
					"align": "center",
				},
				{
					"setData": writer,
					"align": "center",
				},
				{
					"setData": place,
					"align": "center",
				},
				{
					"setData": type,
					"align": "center",
				},
				{
					"setData": content,
					"align": "left",
				},
			];
	
			fnc = "techDetailView(this);";
			ids.push(jsonData[i].no);
			dataJob.push(jsonData[i].job);
			data.push(str);
		}
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawTechList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.html("기술일정조회");
	createGrid(container, header, data, ids, dataJob, fnc);
	setViewContents(hideArr, showArr);

	let path = $(location).attr("pathname").split("/");
	if(path[3] !== undefined && jsonData !== ""){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		techDetailView(content);
	}
}

function techDetailView(e){
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

	id = $(e).data("id");
	url = "/api/schedule/tech/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, techSuccessView, techErrorView);
}

function techSuccessView(result){
	let from, datas, to, place, writer, sopp, contract, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, gridList, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange, crudAddBtn, crudUpdateBtn, crudDeleteBtn;
	detailSetFormList(result);
	gridList = $(".gridList");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	crudUpdateBtn = $(".crudUpdateBtn");
	crudDeleteBtn = $(".crudDeleteBtn");
	datas = ["sopp", "writer", "customer", "partner", "cipOfCustomer", "contract"];
	notIdArray = ["writer"];

	disDate = dateDis(result.from);
	from = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

	disDate = dateDis(result.to);
	to = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

	place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
	
	if(result.sopp > 0){
		sopp = "";
		for(let key in storage.sopp){
			if(storage.sopp[key].no === result.sopp){
				sopp = storage.sopp[key].title;
			}
		}
	}

	writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
	partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
	supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
	supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;
	cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer == 0 || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
	contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : storage.code.etc[result.contractMethod];
	supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "" : storage.code.etc[result.supportStep];
	type = (result.type === "" || result.type === null || result.type === undefined) ? "" : storage.code.etc[result.type]; 

	contract = "";
	for(let key in storage.contract){
		if(storage.contract[key].no === result.contract){
			contract = storage.contract[key].title;
		}
	}

	for(let key in storage.cip){
		if(storage.cip[key].no === cipOfCustomer){
			cipOfCustomer = storage.cip[key].name;
		}
	}

	dataArray = [
		{
			"title": undefined,
			"radioValue": [
				{
					"key": "tech",
					"value": "기술일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"radioType": "tab",
			"elementId": ["jobTech"],
			"col": 4,
		},
		{
			"title": "등록구분(*)",
			"radioValue": [
				{
					"key": "10247",
					"value": "신규영업지원",
				},
				{
					"key": "10248",
					"value": "유지보수",
				},
			],
			"type": "radio",
			"col": 4,
			"elementName": "contractMethod",
		},
		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"complete": "sopp",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": sopp,
		},
		{
			"title": "계약",
			"elementId": "contract",
			"complete": "contract",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": contract,
		},
		{
			"title": "매출처",
			"elementId": "partner",
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": partner,
		},
		{
			"title": "매출처 담당자",
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "cipOfCustomer",
			"value": cipOfCustomer,
		},
		{
			"title": "엔드유저(*)",
			"elementId": "customer",
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": customer,
		},
		{
			"title": "모델",
			"elementId": "supportModel",
			"value": supportModel,
		},
		{
			"title": "버전",
			"elementId": "supportVersion",
			"value": supportVersion,
		},
		{
			"title": "단계",
			"selectValue": [
				{
					"key": "10213",
					"value": "접수단계",
				},
				{
					"key": "10214",
					"value": "출동단계",
				},
				{
					"key": "10215",
					"value": "미계약에 따른 보류",
				},
				{
					"key": "10253",
					"value": "처리완료",
				}
			],
			"type": "select",
			"elementId": "supportStep",
		},
		{
			"title": "지원형태",
			"selectValue": [
				{
					"key": "10187",
					"value": "전화상담",
				},
				{
					"key": "10208",
					"value": "현장방문",
				},
				{
					"key": "10209",
					"value": "원격지원",
				}
			],
			"type": "select",
			"elementId": "type",
		},
		{
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "writer",
			"value": writer,
		},
		{
			"title": "지원일자 시작일(*)",
			"elementId": "from",
			"type": "datetime",
			"value": from,
		},
		{
			"title": "지원일자 종료일(*)",
			"elementId": "to",
			"type": "datetime",
			"value": to,
		},
		{
			"title": "장소",
			"elementId": "place",
			"value": place,
		},
		{
			"title": "기술지원명(*)",
			"elementId": "title",
			"value": title,
			"col": 3,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "content",
			"value": content,
			"col": 4,
		},
	];
	
	html = detailViewForm(dataArray);
	containerTitle.html(title);
	gridList.after(html);
	hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
	showArr = ["defaultFormContainer"];
	setViewContents(hideArr, showArr);

	if(storage.my == result.writer){
		crudUpdateBtn.attr("onclick", "enableDisabled(this, \"techUpdate();\", \"" + notIdArray + "\");");
		crudUpdateBtn.css("display", "flex");
		crudDeleteBtn.css("display", "flex");
	}else{
		crudUpdateBtn.css("display", "none");
		crudDeleteBtn.css("display", "none");
	}
	
	detailBackBtn.css("display", "flex");
	detailTrueDatas(datas);

	setTimeout(() => {
		$("[name='job'][value='tech']").prop("checked", true);
		let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
		let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
		let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
		
		$("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
		$("#type option[value='" + type + "']").prop("selected", true);
		$("#supportStep option[value='" + supportStep + "']").prop("selected", true);

		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);
}

function techErrorView(){
	msg.set("에러");
}

function techSuccessList(result){
	storage.scheduleList = [];
	for(let i = 0; i < result.length; i++){
		if(result[i].job === "tech"){
			storage.scheduleList.push(result[i]);
		}
	}

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawTechList, 600);
		window.setTimeout(addSearchList, 800);
		window.setTimeout(searchContainerSet, 800);
	}else{
		window.setTimeout(drawTechList, 200);
		window.setTimeout(addSearchList, 400);
		window.setTimeout(searchContainerSet, 400);
	}
}

function techErrorList(){
	msg.set("에러");
}

function techInsertForm(){
	let dataArray, myName, my, now, date;

	my = storage.my;
	myName = storage.user[my].userName;

	now = new Date();
	date = now.toISOString().slice(0, 10);

	dataArray = [
		{
			"title": undefined,
			"radioValue": [
				{
					"key": "tech",
					"value": "기술일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"radioType": "tab",
			"elementId": ["jobTech"],
			"col": 4,
			"disabled": false,
		},
		{
			"title": "등록구분(*)",
			"radioValue": [
				{
					"key": "10247",
					"value": "신규영업지원",
				},
				{
					"key": "10248",
					"value": "유지보수",
				},
			],
			"type": "radio",
			"elementName": "contractMethod",
			"elementId": ["contractMethodNew", "contractMethodOld"],
			"col": 4,
			"disabled": false,
		},
		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"complete": "sopp",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"disabled": false,
		},
		{
			"title": "계약",
			"elementId": "contract",
			"complete": "contract",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"disabled": false,
		},
		{
			"title": "매출처",
			"disabled": false,
			"elementId": "partner",
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "매출처 담당자",
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "cipOfCustomer",
			"disabled": false,
		},
		{
			"title": "엔드유저(*)",
			"elementId": "customer",
			"disabled": false,
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "모델",
			"elementId": "supportModel",
			"disabled": false,
		},
		{
			"title": "버전",
			"elementId": "supportVersion",
			"disabled": false,
		},
		{
			"title": "단계",
			"selectValue": [
				{
					"key": "10213",
					"value": "접수단계",
				},
				{
					"key": "10214",
					"value": "출동단계",
				},
				{
					"key": "10215",
					"value": "미계약에 따른 보류",
				},
				{
					"key": "10253",
					"value": "처리완료",
				}
			],
			"type": "select",
			"elementId": "supportStep",
			"disabled": false,
		},
		{
			"title": "지원형태",
			"selectValue": [
				{
					"key": "10187",
					"value": "전화상담",
				},
				{
					"key": "10208",
					"value": "현장방문",
				},
				{
					"key": "10209",
					"value": "원격지원",
				}
			],
			"type": "select",
			"elementId": "type",
			"disabled": false,
		},
		{
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "writer",
			"value": myName,
		},
		{
			"title": "지원 시작일(*)",
			"elementId": "from",
			"value": date,
			"disabled": false,
			"type": "datetime",
		},
		{
			"title": "지원 종료일(*)",
			"elementId": "to",
			"value": date,
			"disabled": false,
			"type": "datetime",
		},
		{
			"title": "장소",
			"elementId": "place",
			"disabled": false,
		},
		{
			"title": "기술지원명(*)",
			"elementId": "title",
			"disabled": false,
			"col": 3,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "content",
			"disabled": false,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text("기술일정등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "techInsert();");
	modal.close.attr("onclick", "modal.hide();");

	storage.formList = {
		"job" : "",
		"contractMethod" : "",
		"sopp" : 0,
		"contract" : 0,
		"partner" : 0,
		"cipOfCustomer" : 0,
		"customer" : 0,
		"supportModel" : "",
		"supportVersion" : "",
		"supportStep" : "",
		"type" : "",
		"place" : "",
		"writer" : storage.my,
		"from" : "",
		"to" : "",
		"title" : "",
		"content" : "",
	};

	setTimeout(() => {
		let nowDate = new Date().toISOString().substring(0, 10);
		$("#from").val(nowDate + "T09:00");
		$("#to").val(nowDate + "T18:00");
		$("#writer").attr("data-change", true);
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function techInsert(){
	if($("#title").val() === ""){
		msg.set("기술요청명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#sopp").val() === ""){
		msg.set("영업기회를 선택해주세요.");
		$("#sopp").focus();
		return false;
	}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
		msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
		$("#sopp").focus();
		return false;
	}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
		msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
		$("#contract").focus();
		return false;
	}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#partner").focus();
		return false;
	}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
		msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfCustomer").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("엔드유저를 선택해주세요.");
		$("#customer").focus();
		return false;
	}else if(!validateAutoComplete($("#customer").val(), "customer")){
		msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#from").val() === ""){
		msg.set("지원시작일을 선택해주세요.");
		return false;
	}else if($("#to").val() === ""){
		msg.set("지원종료일을 선택해주세요.");
		$("#title").focus();
		return false;
	}else{
		let url, method, data, type, job;
		job = $("[name='job']:checked").val();
		formDataSet();
		url = "/api/schedule/" + job;
		method = "post";
		data = storage.formList;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, techSuccessInsert, techErrorInsert);
	}
}

function techSuccessInsert(){
	msg.set("등록완료");
	location.reload();
}

function techErrorInsert(){
	msg.set("등록에러");

}

function techUpdate(){
	if($("#title").val() === ""){
		msg.set("기술요청명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#sopp").val() === ""){
		msg.set("영업기회를 선택해주세요.");
		$("#sopp").focus();
		return false;
	}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
		msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
		$("#sopp").focus();
		return false;
	}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
		msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
		$("#contract").focus();
		return false;
	}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#partner").focus();
		return false;
	}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
		msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfCustomer").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("엔드유저를 선택해주세요.");
		$("#customer").focus();
		return false;
	}else if(!validateAutoComplete($("#customer").val(), "customer")){
		msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#from").val() === ""){
		msg.set("지원시작일을 선택해주세요.");
		return false;
	}else if($("#to").val() === ""){
		msg.set("지원종료일을 선택해주세요.");
		$("#title").focus();
		return false;
	}else{
		let url, method, data, type, job;
		job = $("[name='job']:checked").val();
		formDataSet();
		url = "/api/schedule/" + job + "/" + storage.formList.no;
		method = "put";
		data = storage.formList;
		type = "update";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, techsuccessUpdate, techErrorUpdate);
	}
}

function techsuccessUpdate(){
	msg.set("수정완료");
	location.reload();
}

function techErrorUpdate(){
	msg.set("에러");
}

function techSelectError(){
	msg.set("에러");
}

function techDelete(){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + storage.formList.job + "/" + storage.formList.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, techSuccessDelete, techErrorDelete);
	}else{
		return false;
	}
}

function techSuccessDelete(){
	msg.set("삭제완료");
	location.reload();
}

function techErrorDelete(){
	msg.set("에러");
}

function searchInputKeyup(){
	let searchAllInput, tempArray;
	searchAllInput = $("#searchAllInput").val();
	tempArray = searchDataFilter(storage.scheduleList, searchAllInput, "input");

	if(tempArray.length > 0){
		storage.searchDatas = tempArray;
	}else{
		storage.searchDatas = "";
	}

	drawTechList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.scheduleList.length; i++){
		let no, writer, customer, job, type, from, to, disDate, setCreated;
		no = storage.scheduleList[i].no;
		writer = (storage.scheduleList[i].writer === null || storage.scheduleList[i].writer == 0) ? "" : storage.user[storage.scheduleList[i].writer].userName;
		customer = (storage.scheduleList[i].customer === null || storage.scheduleList[i].customer == 0) ? "" : storage.customer[storage.scheduleList[i].customer].name;
		title = storage.scheduleList[i].title;
		job = "기술지원";
		type = storage.code.etc[storage.scheduleList[i].type];
		disDate = dateDis(storage.scheduleList[i].from);
		from = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.scheduleList[i].to);
		to = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.scheduleList[i].created, storage.scheduleList[i].modified);
		setCreated = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + writer + "#" + customer + "#" + title + "#" + job + "#" + type + "#from" + from + "#to" + to + "#created" + setCreated);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchWriter, searchCustomer, searchJob, searchType, searchDateFrom, searchDateTo, searchCreatedFrom;

	searchWriter = $("#searchWriter").val();
	searchCustomer = $("#searchCustomer").val();
	searchJob = $("#searchJob").val();
	searchType = $("#searchType").val();
	searchDateFrom = ($("#searchDateFrom").val() === "") ? "" : $("#searchDateFrom").val().replaceAll("-", "") + "#from" + $("#searchDateTo").val().replaceAll("-", "");
	
	let searchValues = [searchWriter, searchCustomer, searchJob, searchType, searchDateFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = searchDataFilter(storage.scheduleList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.scheduleList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.scheduleList;
	}
	
	drawTechList();
}