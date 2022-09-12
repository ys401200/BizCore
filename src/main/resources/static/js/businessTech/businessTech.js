$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getScheduleList();
});

function getScheduleList() {
	let url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
} // End of getScheduleList()

function techSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#techSearchCategory").val();
	searchText = $(document).find("#techSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
}

function drawScheduleList() {
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc;
	
	if (storage.scheduleList === undefined) {
		msg.set("등록된 일정이 없습니다");
	}
	else {
		jsonData = storage.scheduleList;
	}

	storage.tempArray = [];

	for(let i = 0; i < jsonData.length; i++){
		if(jsonData[i].job === "tech"){
			storage.tempArray.push(jsonData[i]);
		}
	}

	jsonData = storage.tempArray;

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridScheduleList");

	header = [
		{
			"title" : "번호",
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
			"title" : "일정",
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
			"align" : "left",
		},
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content;

		job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "없음" : "기술일정";
		title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "제목 없음" : jsonData[i].title;
		customer = (jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "없음" : storage.customer[jsonData[i].customer].name;
		writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "없음" : storage.user[jsonData[i].writer].userName;
		place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "없음" : jsonData[i].place;
		content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "내용 없음" : jsonData[i].content;
		
		fromDate = dateDis(jsonData[i].from);
		fromSetDate = dateFnc(fromDate);
		
		toDate = dateDis(jsonData[i].to);
		toSetDate = dateFnc(toDate);

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": job,
			},
			{
				"setData": title,
			},
			{
				"setData": fromSetDate + " ~ " + toSetDate,
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
				"setData": jsonData[i].sopp,
			},
			{
				"setData": content,
			},
		];

		fnc = "scheduleDetailView(this);";
		ids.push(jsonData[i].no);
		dataJob.push(jsonData[i].job);
		data.push(str);
	}
	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawScheduleList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, dataJob, fnc);
}

function scheduleDetailView(e){
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

	id = $(e).data("id");
	url = "/api/schedule/tech/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, scheduleSuccessView, scheduleErrorView);
}

function scheduleSuccessView(result){
	let detailView, html = "", dataArray, job, title;

	job = (result.job === null || result.job === "" || result.job === undefined) ? "" : result.job;
	
	detailView = $(document).find(".detailContainer");
	detailView.hide();
	
	let from, to, place, writer, sopp, customer, partner, content, supportModel, supportVersion, cipOfCustomer, contractMethod, contract, supportStep, type;
		
	disDate = dateDis(result.from);
	from = dateFnc(disDate);

	disDate = dateDis(result.to);
	to = dateFnc(disDate);

	place = (result.place === null || result.place === "" || result.place === undefined) ? "없음" : result.place;
	
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
		sopp = "없음";
	}

	writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "없음" : storage.user[result.writer].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "없음" : storage.customer[result.customer].name;
	partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "없음" : storage.customer[result.partner].name;
	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "내용 없음" : result.content;
	supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "없음" : result.supportModel;
	supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "없음" : result.supportVersion;
	cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer == 0 || result.cipOfCustomer === undefined) ? "없음" : result.cipOfCustomer;
	contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "없음" : storage.code.etc[result.contractMethod];
	supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "없음" : storage.code.etc[result.supportStep];
	type = (result.type === "" || result.type === null || result.type === undefined) ? "없음" : storage.code.etc[result.type];

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
		contract = "없음";
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
			"title": "등록구분",
			"value": contractMethod,
		},
		{
			"title": "기술요청명",
			"value": title,
		},
		{
			"title": "영업기회",
			"value": sopp,
		},
		{
			"title": "계약",
			"value": contract,
		},
		{
			"title": "매출처",
			"value": partner,
		},
		{
			"title": "매출처 담당자",
			"value": cipOfCustomer,
		},
		{
			"title": "엔드유저",
			"value": customer,
		},
		{
			"title": "모델",
			"value": supportModel,
		},
		{
			"title": "버전",
			"value": supportVersion,
		},
		{
			"title": "단계",
			"value": supportStep,
		},
		{
			"title": "지원형태",
			"value": type,
		},
		{
			"title": "장소",
			"value": place,
		},
		{
			"title": "담당자",
			"value": writer,
		},
		{
			"title": "지원시작일",
			"value": from,
		},
		{
			"title": "지원종료일",
			"value": to,
		},
		{
			"title": "내용",
			"value": content,
		}
	];
	
	detailView.find(".detailMainSpan").text(title);
	detailView.find(".detailBtns").html("<button type='button' onclick='scheduleUpdateForm(" + JSON.stringify(result) + ")'>수정</button><button type='button' onclick='scheduleDelete(" + JSON.stringify(result) +")'>삭제</button><button type='button' onclick='detailContainerHide();'>닫기</button>");
	html = detailViewForm(dataArray);
	detailView.find(".detailContent").html(html);
	detailView.show();
}

function scheduleErrorView(){
	alert("에러");
}

function eventStop(){
	if(event.stopPropagation){
		event.stopPropagation();
	}
	event.cancelBubble = true;
}

function listChange(event){
	let tableList = $(".gridScheduleList");
	let calendarList = $(".calendarList");
	let pageContainer = $(".pageContainer");

	if($(event).data("type") === "table"){
		tableList.hide();
		pageContainer.hide();
		calendarList.show();
		$(event).data("type", "calendar");
		$(event).text("테이블로 표시");
	}else{
		tableList.show();
		pageContainer.show();
		calendarList.hide();
		$(event).data("type", "table");
		$(event).text("달력으로 표시");
	}
}

function scheduleSuccessList(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawScheduleList, 600);
	}else{
		window.setTimeout(drawScheduleList, 200);
	}
}

function scheduleErrorList(){
	alert("에러");
}

function scheduleInsertForm(getDate){
	let html, dataArray;

	dataArray = scheduleRadioInsert("tech", getDate);

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("일정등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$(document).find("[name='job'][value='tech']").prop("checked", true);
	}, 100);
}

function scheduleUpdateForm(result){
	let html, title, dataArray;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
	
	dataArray = scheduleRadioUpdate(result.job, result);

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text(title);
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("수정완료");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleUpdate(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$(document).find("[name='job'][value='" + result.job + "']").prop("checked", true);

		let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
		let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
		let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;

		$(document).find("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
		$(document).find("#type option[value='" + type + "']").prop("selected", true);
		$(document).find("#supportStep option[value='" + supportStep + "']").prop("selected", true);
	}, 100);
}

function scheduleRadioClick(e, result){
	let html, dataArray, tempFrom, tempTo, value = $(e).val();
	
	tempFrom = $(document).find("#from").val();
	tempTo = $(document).find("#to").val();
	
	modal.hide();

	if(result === undefined){
		dataArray = scheduleRadioInsert(value);
		html = detailViewFormModal(dataArray);

		modal.show();
		modal.headTitle.text("일정등록");
		modal.content.css("width", "50%");
		modal.body.html(html);
		modal.body.css("max-height", "800px");
		modal.confirm.text("등록");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "scheduleInsert();");
		modal.close.attr("onclick", "modal.hide();");
	}else{
		dataArray = scheduleRadioUpdate(value, result);
		html = detailViewFormModal(dataArray);

		modal.show();
		modal.headTitle.text(result.title);
		modal.content.css("width", "50%");
		modal.body.html(html);
		modal.body.css("max-height", "800px");
		modal.confirm.text("수정완료");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "scheduleUpdate(" + result.no + ");");
		modal.close.attr("onclick", "modal.hide();");
	}

	setTimeout(() => {
		$(document).find("[name='job'][value='" + value + "']").prop("checked", true);
		$(document).find("#from").val(tempFrom);
		$(document).find("#to").val(tempTo);
	}, 100);
}

function scheduleRadioInsert(value, date){
	let dataArray, myName, my, now;

	my = storage.my;
	myName = storage.user[my].userName;

	if(date === undefined){
		now = new Date();
		date = now.toISOString().slice(0, 10);
	}

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
			"disabled": false,
			"onClick": "scheduleRadioClick(this);",
		},
		{
			"title": "등록구분",
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
			"disabled": false,
		},
		{
			"title": "기술지원 요청명(*)",
			"elementId": "title",
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
			"title": "내용",
			"type": "textarea",
			"elementId": "content",
		},
	];

	return dataArray;
}

function scheduleInsert(){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job;
	method = "post";
	type = "insert";

	if($(document).find("#title").val() === ""){
		alert("기술요청명을 입력해주세요.");
		$(document).find("#title").focus();
		return false;
	}else if($(document).find("#sopp").val() === ""){
		alert("영업기회를 선택해주세요.");
		$(document).find("#sopp").focus();
		return false;
	}else if($(document).find("#partner").val() === ""){
		alert("엔드유저를 선택해주세요.");
		$(document).find("#partner").focus();
		return false;
	}else if($(document).find("#from").val() === ""){
		alert("지원시작일을 선택해주세요.");
		return false;
	}else if($(document).find("#to").val() === ""){
		alert("지원종료일을 선택해주세요.");
		$(document).find("#title").focus();
		return false;
	}else{
		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep, type;

		from = $(document).find("#from").val();
		from = new Date(from).getTime();
		to = $(document).find("#to").val();
		to = new Date(to).getTime();
		place = $(document).find("#place").val();
		writer = $(document).find("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());
		sopp = $(document).find("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		customer = $(document).find("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		partner = $(document).find("#partner");
		partner = dataListFormat(partner.attr("id"), partner.val());
		title = $(document).find("#title").val();
		content = tinymce.activeEditor.getContent();
		supportModel = $(document).find("#supportModel").val();
		supportVersion = $(document).find("#supportVersion").val();
		contract = $(document).find("#contract");
		contract = dataListFormat(contract.attr("id"), contract.val()); 
		contractMethod = $(document).find("[name='contractMethod']:checked").val();
		cipOfCustomer = $(document).find("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		supportStep = $(document).find("#supportStep").val();
		type = $(document).find("#type").val();

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

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, scheduleSuccessInsert, scheduleErrorInsert);
}

function scheduleSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function scheduleErrorInsert(){
	alert("등록에러");

}

function scheduleRadioUpdate(value, result){
	let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion;
		
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
		contract = "없음";
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
			"disabled": false,
			"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
		},
		{
			"title": "등록구분",
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
			"disabled": false,
		},
		{
			"title": "기술지원 요청명(*)",
			"elementId": "title",
			"disabled": false,
			"value": title,
		},
		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"disabled": false,
			"value": sopp,
		},
		{
			"title": "계약",
			"elementId": "contract",
			"dataKeyup": "contract",
			"disabled": false,
			"value": contract,
		},
		{
			"title": "매출처",
			"disabled": false,
			"elementId": "partner",
			"dataKeyup": "customer",
			"value": partner,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "customerUser",
			"elementId": "cipOfCustomer",
			"disabled": false,
			"value": cipOfCustomer,
		},
		{
			"title": "엔드유저(*)",
			"elementId": "customer",
			"disabled": false,
			"dataKeyup": "customer",
			"value": customer,
		},
		{
			"title": "모델",
			"elementId": "supportModel",
			"disabled": false,
			"value": supportModel,
		},
		{
			"title": "버전",
			"elementId": "supportVersion",
			"disabled": false,
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
			"value": place,
		},
		{
			"title": "담당자(*)",
			"dataKeyup": "user",
			"elementId": "writer",
			"value": writer,
		},
		{
			"title": "지원일자 시작일",
			"elementId": "from",
			"disabled": false,
			"type": "date",
			"value": from,
		},
		{
			"title": "지원일자 종료일",
			"elementId": "to",
			"disabled": false,
			"type": "date",
			"value": to,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "content",
			"value": content,
		},
	];

	return dataArray;
}

function scheduleUpdate(no){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + no;
	method = "put";
	type = "update";

	if($(document).find("#title").val() === ""){
		alert("기술요청명을 입력해주세요.");
		$(document).find("#title").focus();
		return false;
	}else if($(document).find("#sopp").val() === ""){
		alert("영업기회를 선택해주세요.");
		$(document).find("#sopp").focus();
		return false;
	}else if($(document).find("#customer").val() === ""){
		alert("엔드유저를 선택해주세요.");
		$(document).find("#customer").focus();
		return false;
	}else if($(document).find("#from").val() === ""){
		alert("지원시작일을 선택해주세요.");
		return false;
	}else if($(document).find("#to").val() === ""){
		alert("지원종료일을 선택해주세요.");
		$(document).find("#title").focus();
		return false;
	}else{
		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep, type;

		from = $(document).find("#from").val();
		from = new Date(from).getTime();
		to = $(document).find("#to").val();
		to = new Date(to).getTime();
		place = $(document).find("#place").val();
		writer = $(document).find("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());
		sopp = $(document).find("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		customer = $(document).find("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		partner = $(document).find("#partner");
		partner = dataListFormat(partner.attr("id"), partner.val());
		title = $(document).find("#title").val();
		content = tinymce.activeEditor.getContent();
		supportModel = $(document).find("#supportModel").val();
		supportVersion = $(document).find("#supportVersion").val();
		contract = $(document).find("#contract");
		contract = dataListFormat(contract.attr("id"), contract.val()); 
		contractMethod = $(document).find("[name='contractMethod']:checked").val();
		cipOfCustomer = $(document).find("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		supportStep = $(document).find("#supportStep").val();
		type = $(document).find("#type").val();

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

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, scheduleSuccessUpdate, scheduleErrorUpdate);
}

function scheduleSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function scheduleErrorUpdate(){
	alert("에러");
}

function scheduleSelectChange(){
	let url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSelectSuccess, scheduleSelectError);
}

function scheduleSelectSuccess(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawScheduleList, 600);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
	}else{
		window.setTimeout(drawScheduleList, 200);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
	}
}

function scheduleSelectError(){
	alert("에러");
}

function scheduleDelete(result){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + result.job + "/" + result.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, scheduleSuccessDelete, scheduleErrorDelete);
	}else{
		return false;
	}
}

function scheduleSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function scheduleErrorDelete(){
	alert("에러");
}