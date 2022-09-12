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

function salesSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#salesSearchCategory").val();
	searchText = $(document).find("#salesSearchValue").val();
	
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
		if(jsonData[i].job === "sales"){
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

		job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "없음" : "영업일정";
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
	url = "/api/schedule/sales/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, scheduleSuccessView, scheduleErrorView);
}

function scheduleSuccessView(result){
	let detailView, html = "", dataArray, job, title;

	job = (result.job === null || result.job === "" || result.job === undefined) ? "" : result.job;
	
	detailView = $(document).find(".detailContainer");
	detailView.hide();
	
	let from, to, place, writer, sopp, customer, partner, content, type;
	
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
	type = (result.type === null || result.type === "" || result.type === undefined) ? "없음" : storage.code.etc[result.type];

	dataArray = [
		{
			"title": "일정시작일",
			"value": from,
		},
		{
			"title": "일정종료일",
			"value": to,
		},
		{
			"title": "장소",
			"value": place,
		},
		{
			"title": "활동형태",
			"value": type,
		},
		{
			"title": "담당자",
			"value": writer,
		},
		{
			"title": "영업기회",
			"value": sopp,
		},
		{
			"title": "매출처",
			"value": customer,
		},
		{
			"title": "엔드유저",
			"value": partner,
		},
		{
			"title": "제목",
			"value": title,
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

	dataArray = scheduleRadioInsert("sales", getDate);

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
		$(document).find("[name='job'][value='sales']").prop("checked", true);
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

		if(result.job === "sales"){
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;

			$(document).find("#type option[value='" + type + "']").prop("selected", true);
		}else if(result.job === "tech"){
			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;

			$(document).find("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
			$(document).find("#type option[value='" + type + "']").prop("selected", true);
			$(document).find("#supportStep option[value='" + supportStep + "']").prop("selected", true);
		}
		
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
					"key": "sales",
					"value": "영업일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"disabled": false,
			"onClick": "scheduleRadioClick(this);",
		},
		{
			"title": "활동시작일(*)",
			"elementId": "from",
			"value": date,
			"type": "date",
			"disabled": false,
		},
		{
			"title": "활동종료일(*)",
			"elementId": "to",
			"value": date,
			"type": "date",
			"disabled": false,
		},
		{
			"title": "장소",
			"elementId": "place",
			"disabled": false,
		},
		{
			"title": "활동형태",
			"selectValue": [
				{
					"key": "10170",
					"value": "회사방문",
				},
				{
					"key": "10171",
					"value": "기술지원",
				},
				{
					"key": "10221",
					"value": "제품설명",
				},
				{
					"key": "10222",
					"value": "시스템데모",
				},
				{
					"key": "10223",
					"value": "제품견적",
				},
				{
					"key": "10224",
					"value": "계약건 의사결정지원",
				},
				{
					"key": "10225",
					"value": "계약",
				},
				{
					"key": "10226",
					"value": "사후처리",
				},
				{
					"key": "10227",
					"value": "기타",
				},
				{
					"key": "10228",
					"value": "협력사요청",
				},
				{
					"key": "10229",
					"value": "협력사문의",
				},
				{
					"key": "10230",
					"value": "교육",
				},
				{
					"key": "10231",
					"value": "전화상담",
				},
				{
					"key": "10232",
					"value": "제조사업무협의",
				},
				{
					"key": "10233",
					"value": "외부출장",
				},
				{
					"key": "10234",
					"value": "제안설명회",
				}
			],
			"type": "select",
			"elementId": "type",
			"disabled": false,
		},
		{
			"title": "담당자(*)",
			"elementId": "writer",
			"dataKeyup": "user",
			"value": myName,
		},
		{
			"title": "영업기회",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"disabled": false,
		},
		{
			"title": "매출처",
			"disabled": false,
			"elementId": "customer",
			"dataKeyup": "customer",
		},
		{
			"title": "엔드유저",
			"disabled": false,
			"elementId": "partner",
			"dataKeyup": "customer",
		},
		{
			"title": "제목(*)",
			"elementId": "title",
			"disabled": false,
		},
		{
			"title": "내용",
			"elementId": "content",
			"type": "textarea",
		}
	];

	return dataArray;
}

function scheduleInsert(){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job;
	method = "post";
	type = "insert";

	if($(document).find("#from").val() === ""){
		alert("활동시작일을 선택해주세요.");
		return false;
	}else if($(document).find("#to").val() === ""){
		alert("활동종료일을 선택해주세요.");
		return false;
	}else if($(document).find("#title").val() === ""){
		alert("제목을 입력해주세요.");
		$(document).find("#title").focus();
		return false;
	}else{
		let from, to, place, writer, sopp, customer, partner, title, content, type;

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
	let dataArray, from, to, place, writer, sopp, customer, partner, title, content;
	
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

	writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "" : storage.user[result.writer].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
	partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

	dataArray = [
		{
			"title": "일정선택",
			"radioValue": [
				{
					"key": "sales",
					"value": "영업일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"disabled": false,
			"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
		},
		{
			"title": "활동시작일",
			"elementId": "from",
			"type": "date",
			"disabled": false,
			"value": from,
		},
		{
			"title": "활동종료일",
			"elementId": "to",
			"type": "date",
			"disabled": false,
			"value": to,
		},
		{
			"title": "장소",
			"elementId": "place",
			"disabled": false,
			"value": place,
		},
		{
			"title": "활동형태",
			"selectValue": [
				{
					"key": "10170",
					"value": "회사방문",
				},
				{
					"key": "10171",
					"value": "기술지원",
				},
				{
					"key": "10221",
					"value": "제품설명",
				},
				{
					"key": "10222",
					"value": "시스템데모",
				},
				{
					"key": "10223",
					"value": "제품견적",
				},
				{
					"key": "10224",
					"value": "계약건 의사결정지원",
				},
				{
					"key": "10225",
					"value": "계약",
				},
				{
					"key": "10226",
					"value": "사후처리",
				},
				{
					"key": "10227",
					"value": "기타",
				},
				{
					"key": "10228",
					"value": "협력사요청",
				},
				{
					"key": "10229",
					"value": "협력사문의",
				},
				{
					"key": "10230",
					"value": "교육",
				},
				{
					"key": "10231",
					"value": "전화상담",
				},
				{
					"key": "10232",
					"value": "제조사업무협의",
				},
				{
					"key": "10233",
					"value": "외부출장",
				},
				{
					"key": "10234",
					"value": "제안설명회",
				}
			],
			"type": "select",
			"elementId": "type",
			"disabled": false,
		},
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
			"value": writer,				
		},
		{
			"title": "영업기회",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"disabled": false,
			"value": sopp,
		},
		{
			"title": "매출처",
			"disabled": false,
			"elementId": "customer",
			"dataKeyup": "customer",
			"value": customer,
		},
		{
			"title": "엔드유저",
			"disabled": false,
			"elementId": "partner",
			"dataKeyup": "customer",
			"value": partner,
		},
		{
			"title": "제목",
			"elementId": "title",
			"disabled": false,
			"value": title,
		},
		{
			"title": "내용",
			"elementId": "content",
			"type": "textarea",
			"value": content,
		}
	];

	return dataArray;
}

function scheduleUpdate(no){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + no;
	method = "put";
	type = "update";

	if($(document).find("#from").val() === ""){
		alert("활동시작일을 선택해주세요.");
		return false;
	}else if($(document).find("#to").val() === ""){
		alert("활동종료일을 선택해주세요.");
		return false;
	}else if($(document).find("#title").val() === ""){
		alert("제목을 입력해주세요.");
		$(document).find("#title").focus();
		return false;
	}else{
		let from, to, place, writer, sopp, customer, partner, title, content, type;

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