$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getContractList();
});

function getContractList() {
	let url, method, data;

	url = "/api/contract";
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, contractSuccessList, contractErrorList);
}

function contractSearchList(){
	let searchCategory, searchText, url, method, data;

	url = "/api/contract";
	method = "get";
	data = "";

	searchCategory = $(document).find("#contractSearchCategory").val();
	searchText = $(document).find("#contractSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, contractSuccessList, contractErrorList);
}

function drawContractList() {
	let contractContainer, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.contractList === undefined) {
		msg.set("등록된 계약 없습니다");
	}
	else {
		jsonData = storage.contractList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	contractContainer = $(".gridContractList");

	header = [
		{
			"title" : "번호",
			"align" : "center",
		},
		{
			"title" : "판매방식",
			"align" : "center",
		},
		{
			"title" : "계약방식",
			"align" : "center",
		},
		{
			"title" : "계약명",
			"align" : "left",
		},
		{
			"title" : "엔드유저",
			"align" : "center",
		},
		{
			"title" : "계약금액",
			"align" : "right",
		},
		{
			"title" : "매출이익",
			"align" : "right",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "유지보수시작일",
			"align" : "center",
		},
        {
			"title" : "유지보수종료일",
			"align" : "center",
		},
		{
			"title" : "발주일자",
			"align" : "center",
		},
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let salesType, contractType, title, endUser, contractAmount, profit, employee, startOfFreeMaintenance, endOfFreeMaintenance, saleDate;
		
		salesType = (jsonData[i].salesType === null || jsonData[i].salesType === "") ? "없음" : storage.code.etc[jsonData[i].salesType];
		contractType = (jsonData[i].contractType === null || jsonData[i].contractType === "") ? "없음" : storage.code.etc[jsonData[i].contractType];
		title = (jsonData[i].title === null || jsonData[i].title === "") ? "제목 없음" : jsonData[i].title;
		endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "없음" : storage.customer[jsonData[i].endUser].name;
		contractAmount = (jsonData[i].contractAmount == 0 || jsonData[i].contractAmount === null) ? 0 : numberFormat(jsonData[i].contractAmount);
		profit = (jsonData[i].profit == 0 || jsonData[i].profit === null) ? 0 : numberFormat(jsonData[i].profit);
		employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "없음" : storage.user[jsonData[i].employee].userName;
		
		disDate = dateDis(jsonData[i].startOfFreeMaintenance);
		startOfFreeMaintenance = dateFnc(disDate);

		disDate = dateDis(jsonData[i].endOfFreeMaintenance);
		endOfFreeMaintenance = dateFnc(disDate);

		disDate = dateDis(jsonData[i].saleDate);
		saleDate = dateFnc(disDate);

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": salesType,
			},
			{
				"setData": contractType,
			},
			{
				"setData": title,
			},
			{
				"setData": endUser,
			},
			{
				"setData": contractAmount,
			},
			{
				"setData": profit,
			},
			{
				"setData": employee,
			},
			{
				"setData": startOfFreeMaintenance,
			},
			{
				"setData": endOfFreeMaintenance,
			},
			{
				"setData": saleDate,
			}
		];

		fnc = "contractDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawContractList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(contractContainer, header, data, ids, fnc);
}

function contractDetailView(e){
	let id, url, method, data;

	id = $(e).data("id");
	url = "/api/contract/" + id;
	method = "get";

	crud.defaultAjax(url, method, data, contractSuccessView, contractErrorView);
}

function contractSuccessList(result){
	storage.contractList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawContractList, 600);
	}
}

function contractErrorList(){
	alert("에러");
}

function contractSuccessView(result){
	let html, title, employee, salesType, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, disDate, dataArray;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	employee = (result.employee == 0 || result.employee === null) ? "데이터 없음" : storage.user[result.employee].userName;
	salesType = (result.salesType === null || result.salesType === "") ? "데이터 없음" : storage.code.etc[result.salesType];
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	cipOfCustomer = (result.cipOfCustomer == 0 || result.cipOfCustomer === null) ? "데이터 없음" : storage.user[result.cipOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.customer[result.endUser].name;
	cipOfendUser = (result.cipOfendUser == 0 || result.cipOfendUser === null) ? "데이터 없음" : storage.user[result.cipOfendUser].userName;

	disDate = dateDis(result.saleDate);
	saleDate = dateFnc(disDate);

	disDate = dateDis(result.delivered);
	delivered = dateFnc(disDate);

	employee2 = (result.employee2 == 0 || result.employee2 === null) ? "데이터 없음" : storage.customer[result.employee2].name;

	disDate = dateDis(result.startOfPaidMaintenance);
	startOfPaidMaintenance = dateFnc(disDate);

	disDate = dateDis(result.endOfPaidMaintenance);
	endOfPaidMaintenance = dateFnc(disDate);
	
	contractAmount = (result.contractAmount == 0 || result.contractAmount === null) ? 0 : numberFormat(result.contractAmount);
	taxInclude = (result.title === null || result.title === "") ? "데이터 없음" : result.taxInclude;
	profit = (result.profit == 0 || result.profit === null) ? 0 : numberFormat(result.profit);
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;

	dataArray = [
		{
			"title": "등록구분",
			"radioValue": [
				{
					"key": "10247",
					"value": "판매계약",
				},
				{
					"key": "10248",
					"value": "유지보수",
				},
			],
			"type": "radio",
			"elementName": "contractType",
		},
		{
			"title": "계약명",
			"value": title,
			"elementId": "title",
		},
		{
			"title": "계약번호",
			"value": result.no,
			"dataKeyup": "user",
			"elementId": "no",

		},
		{
			"title": "영업기회",
			"value": result.sopp,
			"dataKeyup": "customer",
			"elementId": "sopp",
		},
		{
			"title": "담당자",
			"value": employee,
			"dataKeyup": "user",
			"elementId": "employee",
		},
		{
			"title": "판매방식",
			"value": salesType,
			"dataKeyup": "customer",
			"elementId": "salesType",
		},
		{
			"title": "매출처",
			"value": customer,
			"elementId": "customer",
		},
		{
			"title": "매출처 담당자",
			"value": cipOfCustomer,
			"elementId": "cipOfCustomer",
		},
		{
			"title": "엔드유저",
			"value": endUser,
			"elementId": "endUser",
		},
		{
			"title": "엔드유저 담당자",
			"value": cipOfendUser,
			"elementId": "cipOfendUser",
		},
		{
			"title": "발주일자",
			"value": saleDate,
			"elementId": "saleDate",
		},
		{
			"title": "검수일자",
			"value": delivered,
			"elementId": "delivered",
		},
		{
			"title": "(부)담당자",
			"value": employee2,
			"elementId": "employee2",
		},
		{
			"title": "유지보수일자 시작일",
			"value": startOfPaidMaintenance,
			"elementId": "startOfPaidMaintenance",
		},
		{
			"title": "유지보수일자 종료일",
			"value": endOfPaidMaintenance,
			"elementId": "endOfPaidMaintenance",
		},
		{
			"title": "계약금액",
			"value": contractAmount,
			"elementId": "contractAmount",
		},
		{
			"title": "VAT 포함여부",
			"value": taxInclude,
			"elementId": "taxInclude",
		},
		{
			"title": "매출이익",
			"value": profit,
			"elementId": "profit",
		},
		{
			"title": "내용",
			"value": detail,
			"type": "textarea",
			"elementId": "detail",
		},
	];

	html = createCrudForm(dataArray);

	
	modal.show();
	modal.headTitle.text("상세보기");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("수정");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "contractUpdateForm(" + result.no + ");");
	
	setTimeout(() => {
		tinymce.activeEditor.mode.set("readonly");
		$(document).find("[name='contractType'][value='" + result.contractType + "']").prop("checked" ,true);
	}, 300);
}

function contractErrorView(){
	alert("에러");
}