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
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput;
	
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

	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	listSearchInput = $(".listSearchInput");
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
			"align" : "left",
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
			"align" : "left",
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
				},
				{
					"setData": fromSetDate + " ~ " + toSetDate,
				},
				{
					"setData": job,
				},
				{
					"setData": title,
				},
				{
					"setData": customer,
				},
				{
					"setData": writer,
				},
				{
					"setData": place,
				},
				{
					"setData": type,
				},
				{
					"setData": content,
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
	$(pageContainer).children().show();
	detailBackBtn.hide();
	listSearchInput.show();
	createGrid(container, header, data, ids, dataJob, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "techInsertForm();"
		},
		{
			"keyword": "notes",
			"onclick": ""
		},
		{
			"keyword": "set",
			"onclick": ""
		},
	];
	
	if(path[3] !== undefined && jsonData !== ""){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		techDetailView(content);
	}

	plusMenuSelect(menu);
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
	let from, to, place, writer, sopp, contract, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, gridList, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange;
	storage.techNo = result.no;
	gridList = $(".gridList");
	searchContainer = $(".searchContainer");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	listSearchInput = $(".listSearchInput");
	listRange = $(".listRange");

	disDate = dateDis(result.from);
	from = dateFnc(disDate);

	disDate = dateDis(result.to);
	to = dateFnc(disDate);

	place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
	
	if(result.sopp > 0){
		$.ajax({
			url: "/api/sopp/" + result.sopp,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				let jsonData;
				jsonData = cipher.decAes(resultData.data);
				jsonData = JSON.parse(jsonData);
				sopp = jsonData.title;
			}
		});
	}else{
		sopp = 0;
	}

	writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
	partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
	supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
	supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;
	cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer === "" || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
	contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : storage.code.etc[result.contractMethod];
	supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "" : storage.code.etc[result.supportStep];
	type = (result.type === "" || result.type === null || result.type === undefined) ? "" : storage.code.etc[result.type]; 

	if(result.contract > 0){
		$.ajax({
			url: "/api/contract/" + result.contract,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				let jsonData;
				jsonData = cipher.decAes(resultData.data);
				jsonData = JSON.parse(jsonData);
				contract = jsonData.title;
			}
		});
	}else{
		contract = "";
	}

	$.ajax({
		url: "/api/system/cip/" + cipOfCustomer,
		method: "get",
		async: false,
		dataType: "json",
		success:(resultData) => {
			let jsonData;
			jsonData = cipher.decAes(resultData.data);
			console.log(jsonData);

			cipOfCustomer = jsonData;
		}
	});

	dataArray = [
		{
			"title": "일정선택",
			"radioValue": [
				{
					"key": "tech",
					"value": "기술일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"radioType": "tab",
			"elementId": "jobTech",
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
			"elementName": "contractMethod",
		},
		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"value": sopp,
		},
		{
			"title": "계약",
			"elementId": "contract",
			"dataKeyup": "contract",
			"value": contract,
		},
		{
			"title": "매출처",
			"elementId": "partner",
			"dataKeyup": "customer",
			"value": partner,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "customerUser",
			"elementId": "cipOfCustomer",
			"value": cipOfCustomer,
		},
		{
			"title": "엔드유저(*)",
			"elementId": "customer",
			"dataKeyup": "customer",
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
			"title": "장소",
			"elementId": "place",
			"value": place,
		},
		{
			"title": "담당자(*)",
			"dataKeyup": "user",
			"elementId": "writer",
			"value": writer,
		},
		{
			"title": "지원일자 시작일(*)",
			"elementId": "from",
			"type": "date",
			"value": from,
		},
		{
			"title": "지원일자 종료일(*)",
			"elementId": "to",
			"type": "date",
			"value": to,
		},
		{
			"title": "",
		},
		{
			"title": "",
		},
		{
			"title": "기술지원명(*)",
			"elementId": "title",
			"value": title,
			"col": 4,
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
	gridList.html("");
	searchContainer.hide();
	gridList.html(html);
	gridList.show();
	notIdArray = ["writer"];

	setTimeout(() => {
		$("[name='job'][value='tech']").prop("checked", true);
		detailBackBtn.css("display", "flex");
		listSearchInput.hide();
		listRange.hide();
		
		let menu = [
			{
				"keyword": "add",
				"onclick": "techInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"techUpdate();\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "techDelete(" + JSON.stringify(result) + ");"
			},
		];

		let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
		let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
		let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
		
		$("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
		$("#type option[value='" + type + "']").prop("selected", true);
		$("#supportStep option[value='" + supportStep + "']").prop("selected", true);
		
		plusMenuSelect(menu);
		storage.editorArray = ["content"];
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
		inputDataList();
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
			"title": "일정선택",
			"radioValue": [
				{
					"key": "tech",
					"value": "기술일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"radioType": "tab",
			"elementId": "jobTech",
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
			"dataKeyup": "sopp",
			"disabled": false,
		},
		{
			"title": "계약",
			"elementId": "contract",
			"dataKeyup": "contract",
			"disabled": false,
		},
		{
			"title": "매출처",
			"disabled": false,
			"elementId": "partner",
			"dataKeyup": "customer",
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "customerUser",
			"elementId": "cipOfCustomer",
			"disabled": false,
		},
		{
			"title": "엔드유저(*)",
			"elementId": "customer",
			"disabled": false,
			"dataKeyup": "customer",
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
			"title": "장소",
			"elementId": "place",
			"disabled": false,
		},
		{
			"title": "담당자(*)",
			"dataKeyup": "user",
			"elementId": "writer",
			"value": myName,
		},
		{
			"title": "지원 시작일(*)",
			"elementId": "from",
			"value": date,
			"disabled": false,
			"type": "date",
		},
		{
			"title": "지원 종료일(*)",
			"elementId": "to",
			"value": date,
			"disabled": false,
			"type": "date",
		},
		{
			"title": "",
		},
		{
			"title": "",
		},
		{
			"title": "",
		},
		{
			"title": "기술지원명(*)",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "content",
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
	storage.editorArray = ["content"];
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
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
	}else if($("#partner").val() === ""){
		msg.set("엔드유저를 선택해주세요.");
		$("#partner").focus();
		return false;
	}else if($("#from").val() === ""){
		msg.set("지원시작일을 선택해주세요.");
		return false;
	}else if($("#to").val() === ""){
		msg.set("지원종료일을 선택해주세요.");
		$("#title").focus();
		return false;
	}else{
		let url, method, data, job, from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep, type;
		job = $("[name='job']:checked").val();
		from = $("#from").val();
		from = new Date(from).getTime();
		to = $("#to").val();
		to = new Date(to).getTime();
		place = $("#place").val();
		writer = $("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());
		sopp = $("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		customer = $("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		partner = $("#partner");
		partner = dataListFormat(partner.attr("id"), partner.val());
		title = $("#title").val();
		content = CKEDITOR.instances.content.getData();
		supportModel = $("#supportModel").val();
		supportVersion = $("#supportVersion").val();
		contract = $("#contract");
		contract = dataListFormat(contract.attr("id"), contract.val()); 
		contractMethod = $("[name='contractMethod']:checked").val();
		cipOfCustomer = $("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		supportStep = $("#supportStep").val();
		type = $("#type").val();

		data = {
			"job": job,
			"from": from,
			"to": to,
			"place": place,
			"writer": writer,
			"sopp": sopp,
			"customer": customer,
			"partner": partner,
			"title": title,
			"content": content,
			"supportModel": supportModel,
			"supportVersion": supportVersion,
			"contract": contract,
			"contractMethod": contractMethod,
			"cipOfCustomer": cipOfCustomer,
			"supportStep": supportStep,
			"type": type,
		};
	}

	url = "/api/schedule/" + job;
	method = "post";
	type = "insert";
	data = JSON.stringify(data);
	data = cipher.encAes(data);
	crud.defaultAjax(url, method, data, type, techSuccessInsert, techErrorInsert);
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
	}else if($("#customer").val() === ""){
		msg.set("엔드유저를 선택해주세요.");
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
		let url, method, data, type, job, from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep;
		job = $("[name='job']:checked").val();
		from = $("#from").val();
		from = new Date(from).getTime();
		to = $("#to").val();
		to = new Date(to).getTime();
		place = $("#place").val();
		writer = $("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());
		sopp = $("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		customer = $("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		partner = $("#partner");
		partner = dataListFormat(partner.attr("id"), partner.val());
		title = $("#title").val();
		content = CKEDITOR.instances.content.getData();
		supportModel = $("#supportModel").val();
		supportVersion = $("#supportVersion").val();
		contract = $("#contract");
		contract = dataListFormat(contract.attr("id"), contract.val()); 
		contractMethod = $("[name='contractMethod']:checked").val();
		cipOfCustomer = $("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		supportStep = $("#supportStep").val();
		type = $("#type").val();

		data = {
			"job": job,
			"from": from,
			"to": to,
			"place": place,
			"writer": writer,
			"sopp": sopp,
			"customer": customer,
			"partner": partner,
			"title": title,
			"content": content,
			"supportModel": supportModel,
			"supportVersion": supportVersion,
			"contract": contract,
			"contractMethod": contractMethod,
			"cipOfCustomer": cipOfCustomer,
			"supportStep": supportStep,
			"type": type,
		};
	}

	url = "/api/schedule/" + job + "/" + storage.techNo;
	method = "put";
	type = "update";
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, techsuccessUpdate, techErrorUpdate);
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

function techDelete(result){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + result.job + "/" + result.no;
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