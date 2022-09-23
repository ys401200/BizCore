$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSalesList();
});

function getSalesList() {
	let url, method, data, type;

	url = "/api/schedule/calendar/company";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, salesSuccessList, salesErrorList);
} // End of getSalesList()

function drawSalesList() {
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc;
	
	if (storage.scheduleList === undefined) {
		msg.set("등록된 일정이 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.scheduleList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridSalesList");

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
		let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content, type;

		job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "" : "영업일정";
		title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "" : jsonData[i].title;
		customer = (jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "" : storage.customer[jsonData[i].customer].name;
		writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "" : storage.user[jsonData[i].writer].userName;
		place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "" : jsonData[i].place;
		content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "" : jsonData[i].content;
		type = (jsonData[i].type === null || jsonData[i].type === "" || jsonData[i].type === undefined) ? "" : storage.code.etc[jsonData[i].type];
		
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
				"setData": type,
			},
			{
				"setData": content,
			},
		];

		fnc = "salesDetailView(this);";
		ids.push(jsonData[i].no);
		dataJob.push(jsonData[i].job);
		data.push(str);
	}
	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSalesList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, dataJob, fnc);

	let path = $(location).attr("pathname").split("/");

	if(path[3] !== undefined){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		salesDetailView(content);
	}
}

function salesDetailView(e){
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

	id = $(e).data("id");
	url = "/api/schedule/sales/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, salesSuccessView, salesErrorView);
}

function salesSuccessView(result){
	let dataArray, from, to, place, writer, sopp, customer, partner, title, content;
	
	storage.salesNo = result.no;

	$(".searchContainer").hide();

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
		},
		{
			"title": "활동시작일",
			"elementId": "from",
			"type": "date",
			"value": from,
		},
		{
			"title": "활동종료일",
			"elementId": "to",
			"type": "date",
			"value": to,
		},
		{
			"title": "장소",
			"elementId": "place",
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
			"value": sopp,
		},
		{
			"title": "매출처",
			"elementId": "customer",
			"dataKeyup": "customer",
			"value": customer,
		},
		{
			"title": "엔드유저",
			"elementId": "partner",
			"dataKeyup": "customer",
			"value": partner,
		},
		{
			"title": "",
			"elementId": "",
		},
		{
			"title": "제목",
			"elementId": "title",
			"value": title,
			"col": 3,
		},
		{
			"title": "내용",
			"elementId": "content",
			"type": "textarea",
			"value": content,
			"col": 3,
		}
	];
	
	html = detailViewForm(dataArray);
	conTitleChange("containerTitle", "<a href='#' onclick='detailViewContainerHide(\"영업활동조회\");'>뒤로가기</a>");
	$(".detailContents").html(html);
	$(".detailBtns").html("");
	notIdArray = ["writer"];
	$(".detailBtns").append("<button type='button' onclick='enableDisabled(this, \"salesUpdate();\", \"" + notIdArray + "\");'>수정</button><button type='button' onclick='salesDelete(" + JSON.stringify(result) + ");'>삭제</button>");
	$(".detailBtns").show();
	$(".detailContents").show();

	setTimeout(() => {
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();
	}, 100);
}

function salesErrorView(){
	alert("에러");
}

function salesSuccessList(result){
	storage.scheduleList = [];
	for(let i = 0; i < result.length; i++){
		if(result[i].job === "sales"){
			storage.scheduleList.push(result[i]);
		}
	}

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawSalesList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawSalesList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function salesErrorList(){
	alert("에러");
}

function salesInsertForm(){
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
					"key": "sales",
					"value": "영업일정",
				},
			],
			"type": "radio",
			"elementName": "job",
			"disabled": false,
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

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("일정등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "salesInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$(document).find("[name='job'][value='sales']").prop("checked", true);
	}, 300);
}

function salesInsert(){
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

	crud.defaultAjax(url, method, data, type, salesSuccessInsert, salesErrorInsert);
}

function salesSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function salesErrorInsert(){
	alert("등록에러");

}

function salesUpdate(){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + storage.salesNo;
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

	crud.defaultAjax(url, method, data, type, salesSuccessUpdate, salesErrorUpdate);
}

function salesSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function salesErrorUpdate(){
	alert("에러");
}

function scheduleSelectError(){
	alert("에러");
}

function salesDelete(result){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + result.job + "/" + result.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, salesSuccessDelete, salesErrorDelete);
	}else{
		return false;
	}
}

function salesSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function salesErrorDelete(){
	alert("에러");
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.scheduleList, searchAllInput, "input");
	drawSalesList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.scheduleList.length; i++){
		let no, writer, customer, job, type, from, to, disDate;
		no = storage.scheduleList[i].no;
		writer = (storage.scheduleList[i].writer === null || storage.scheduleList[i].writer == 0) ? "" : storage.user[storage.scheduleList[i].writer].userName;
		customer = (storage.scheduleList[i].customer === null || storage.scheduleList[i].customer == 0) ? "" : storage.customer[storage.scheduleList[i].customer].name;
		title = storage.scheduleList[i].title;
		job = "영업일정";
		type = storage.code.etc[storage.scheduleList[i].type];
		disDate = dateDis(storage.scheduleList[i].from);
		from = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.scheduleList[i].to);
		to = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + writer + "#" + customer + "#" + title + "#" + job + "#" + type + "#from" + from + "#to" + to);
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
		if(searchValues[i] !== ""){
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
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawSalesList();
}