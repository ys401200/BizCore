$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getContractList();
});

function getContractList() {
	let url, method, data, type;

	url = "/api/contract";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, contractSuccessList, contractErrorList);
}

function contractSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/contract";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#contractSearchCategory").val();
	searchText = $(document).find("#contractSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, contractSuccessList, contractErrorList);
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
		let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate;
		
		salesType = (jsonData[i].salesType === null || jsonData[i].salesType === "") ? "없음" : storage.code.etc[jsonData[i].salesType];
		contractType = (jsonData[i].contractType === null || jsonData[i].contractType === "") ? "없음" : storage.code.etc[jsonData[i].contractType];
		title = (jsonData[i].title === null || jsonData[i].title === "") ? "제목 없음" : jsonData[i].title;
		endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "없음" : storage.customer[jsonData[i].endUser].name;
		contractAmount = (jsonData[i].contractAmount == 0 || jsonData[i].contractAmount === null) ? 0 : numberFormat(jsonData[i].contractAmount);
		profit = (jsonData[i].profit == 0 || jsonData[i].profit === null) ? 0 : numberFormat(jsonData[i].profit);
		employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "없음" : storage.user[jsonData[i].employee].userName;
		
		if(contractType === "유지보수"){
			disDate = dateDis(jsonData[i].startOfPaidMaintenance);
			startMaintenance = dateFnc(disDate);
	
			disDate = dateDis(jsonData[i].endOfPaidMaintenance);
			endMaintenance = dateFnc(disDate);
		}else{
			disDate = dateDis(jsonData[i].startOfFreeMaintenance);
			startMaintenance = dateFnc(disDate);
	
			disDate = dateDis(jsonData[i].endOfFreeMaintenance);
			endMaintenance = dateFnc(disDate);
		}

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
				"setData": startMaintenance,
			},
			{
				"setData": endMaintenance,
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
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/contract/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, contractSuccessView, contractErrorView);
}

function contractSuccessList(result){
	storage.contractList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawContractList, 600);
	}else{
		window.setTimeout(drawContractList, 200);
	}
}

function contractErrorList(){
	alert("에러");
}

function contractSuccessView(result){
	let html, title, employee, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, disDate, dataArray;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	employee = (result.employee == 0 || result.employee === null) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	cipOfCustomer = (result.cipOfCustomer == 0 || result.cipOfCustomer === null) ? "데이터 없음" : storage.user[result.cipOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.customer[result.endUser].name;
	cipOfendUser = (result.cipOfendUser == 0 || result.cipOfendUser === null) ? "데이터 없음" : storage.user[result.cipOfendUser].userName;

	disDate = dateDis(result.saleDate);
	saleDate = dateFnc(disDate);

	disDate = dateDis(result.delivered);
	delivered = dateFnc(disDate);

	employee2 = (result.employee2 == 0 || result.employee2 === null) ? "데이터 없음" : storage.user[result.employee2].userName;

	disDate = dateDis(result.startOfFreeMaintenance);
	startOfFreeMaintenance = dateFnc(disDate);

	disDate = dateDis(result.endOfFreeMaintenance);
	endOfFreeMaintenance = dateFnc(disDate);

	disDate = dateDis(result.startOfPaidMaintenance);
	startOfPaidMaintenance = dateFnc(disDate);

	disDate = dateDis(result.endOfPaidMaintenance);
	endOfPaidMaintenance = dateFnc(disDate);
	
	contractAmount = (result.contractAmount == 0 || result.contractAmount === null) ? 0 : numberFormat(result.contractAmount);
	taxInclude = (result.taxInclude === null || result.taxInclude === "" || result.taxInclude === "N") ? false : true;
	profit = (result.profit == 0 || result.profit === null) ? 0 : numberFormat(result.profit);
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;

	$.ajax({
		url: "/api/sopp/" + result.sopp,
		method: "get",
		dataType: "json",
		success:(resultData) => {
			let resultJson;
			resultJson = cipher.decAes(resultData.data);
			resultJson = JSON.parse(resultJson);

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
					"onClick": "contractRadioClick(this);",
				},
				{
					"title": "계약명",
					"value": title,
					"elementId": "title",
				},
				{
					"title": "계약번호",
					"value": result.no,
					"elementId": "no",
				},
				{
					"title": "영업기회",
					"value": resultJson.title,
					"elementId": "sopp",
					"dataKeyup": "sopp",
				},
				{
					"title": "담당자",
					"value": employee,
					"dataKeyup": "user",
					"elementId": "employee",
				},
				{
					"title": "판매방식",
					"selectValue": [
						{
							"key": "10173",
							"value": "조달직판",
						},
						{
							"key": "10174",
							"value": "조달간판",
						},
						{
							"key": "10175",
							"value": "조달대행",
						},
						{
							"key": "10176",
							"value": "직접판매",
						}
					],
					"elementId": "salesType",
					"type": "select",
				},
				{
					"title": "매출처",
					"value": customer,
					"dataKeyup": "customer",
					"elementId": "customer",
				},
				{
					"title": "매출처 담당자",
					"value": cipOfCustomer,
					"dataKeyup": "user",
					"elementId": "cipOfCustomer",
				},
				{
					"title": "엔드유저",
					"value": endUser,
					"dataKeyup": "customer",
					"elementId": "endUser",
				},
				{
					"title": "엔드유저 담당자",
					"value": cipOfendUser,
					"dataKeyup": "user",
					"elementId": "cipOfendUser",
				},
				{
					"title": "발주일자",
					"value": saleDate,
					"elementId": "saleDate",
					"type": "date",
				},
				{
					"title": "검수일자",
					"value": delivered,
					"elementId": "delivered",
					"type": "date",
				},
				{
					"title": "(부)담당자",
					"value": employee2,
					"dataKeyup": "user",
					"elementId": "employee2",
				},
				{
					"title": "무상 유지보수일자 시작일",
					"elementId": "startOfFreeMaintenance",
					"value": startOfFreeMaintenance,
					"type": "date",
				},
				{
					"title": "무상유지보수일자 종료일",
					"elementId": "endOfFreeMaintenance",
					"value": endOfFreeMaintenance,
					"type": "date",
				},
				{
					"title": "유상 유지보수일자 시작일",
					"elementId": "startOfPaidMaintenance",
					"value": startOfPaidMaintenance,
					"type": "date",
				},
				{
					"title": "유상 유지보수일자 종료일",
					"elementId": "endOfPaidMaintenance",
					"value": endOfPaidMaintenance,
					"type": "date",
				},
				{
					"title": "계약금액",
					"value": contractAmount,
					"elementId": "contractAmount",
					"keyup": "inputNumberFormat(this);",
				},
				{
					"title": "VAT 포함여부",
					"selectValue": [
						{
							"key": true,
							"value": "Y",
						},
						{
							"key": false,
							"value": "N",
						},
					],
					"type": "select",
					"elementId": "taxInclude",
				},
				{
					"title": "매출이익",
					"value": profit,
					"elementId": "profit",
					"keyup": "inputNumberFormat(this);",
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
			modal.content.css("width", "1200px");
			modal.body.html(html);
			modal.body.css("max-height", "800px");
			modal.confirm.text("수정");
			modal.close.text("취소");
			modal.confirm.attr("onclick", "contractUpdateForm(" + result.no + ");");
			modal.close.attr("onclick", "modal.hide();");
			
			setTimeout(() => {
				tinymce.activeEditor.mode.set("readonly");
				$(document).find("[name='contractType'][value='" + result.contractType + "']").prop("checked" ,true);
				$(document).find("#salesType option[value='" + result.salesType + "']").prop("selected" ,true);
				$(document).find("#taxInclude option[value='" + taxInclude + "']").prop("selected" ,true);
			}, 300);
		},
		error:() => {
			msg.set("영업기회를 찾을 수 없습니다.");
		}
	});
}

function contractErrorView(){
	alert("에러");
}

function contractInsertForm(){
	let html, dataArray;

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
			"disabled": false,
			"onClick": "contractRadioClick(this);",
		},
		{
			"title": "계약명",
			"elementId": "title",
			"disabled": false,
		},
		{
			"title": "영업기회",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"disabled": false,
		},
		{
			"title": "담당자",
			"dataKeyup": "user",
			"elementId": "employee",
			"disabled": false,
			"dataKeyup": "user",
		},
		{
			"title": "판매방식",
			"selectValue": [
				{
					"key": "10173",
					"value": "조달직판",
				},
				{
					"key": "10174",
					"value": "조달간판",
				},
				{
					"key": "10175",
					"value": "조달대행",
				},
				{
					"key": "10176",
					"value": "직접판매",
				}
			],
			"elementId": "salesType",
			"type": "select",
			"disabled": false,
		},
		{
			"title": "매출처",
			"elementId": "customer",
			"disabled": false,
			"dataKeyup": "customer",
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"disabled": false,
			"dataKeyup": "user",
		},
		{
			"title": "엔드유저",
			"elementId": "endUser",
			"disabled": false,
			"dataKeyup": "customer",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"disabled": false,
			"dataKeyup": "user",
		},
		{
			"title": "발주일자",
			"elementId": "saleDate",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "검수일자",
			"elementId": "delivered",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "(부)담당자",
			"elementId": "employee2",
			"disabled": false,
			"dataKeyup": "user",
		},
		{
			"title": "무상 유지보수일자 시작일",
			"elementId": "startOfFreeMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "무상유지보수일자 종료일",
			"elementId": "endOfFreeMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "유상 유지보수일자 시작일",
			"elementId": "startOfPaidMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "유상 유지보수일자 종료일",
			"elementId": "endOfPaidMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "계약금액",
			"elementId": "contractAmount",
			"disabled": false,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "VAT 포함여부",
			"selectValue": [
				{
					"key": true,
					"value": "Y",
				},
				{
					"key": false,
					"value": "N",
				},
			],
			"type": "select",
			"elementId": "taxInclude",
			"disabled": false,
		},
		{
			"title": "매출이익",
			"elementId": "profit",
			"disabled": false,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "detail",
		},
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("계약등록");
	modal.content.css("width", "1200px");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "contractInsert();");
	modal.close.attr("onclick", "modal.hide();");
}

function contractUpdateForm(no){
	let defaultFormContainer;

	defaultFormContainer = $(document).find(".defaultFormContainer");

	defaultFormContainer.find("input, select").prop("disabled", false);
	tinymce.activeEditor.mode.set("design");

	modal.confirm.text("수정완료");
	modal.close.text("삭제");
	modal.confirm.attr("onclick", "contractUpdate(" + no + ")");
	modal.close.attr("onclick", "contractDelete(" + no + ")");
}

function contractInsert(){
	let contractType, title, sopp, employee, salesType, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, url, method, data, type;

	contractType = $(document).find("[name='contractType']:checked").val();
	title = $(document).find("#title").val();
	sopp = $(document).find("#sopp");
	sopp = dataListFormat(sopp.attr("id"), sopp.val());
	employee = $(document).find("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	salesType = $(document).find("#salesType").val();
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	cipOfCustomer = $(document).find("#cipOfCustomer");
	cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	cipOfendUser = $(document).find("#cipOfendUser");
	cipOfendUser = dataListFormat(cipOfendUser.attr("id"), cipOfendUser.val());
	saleDate = $(document).find("#saleDate").val();
	saleDate = new Date(saleDate).getTime();
	delivered = $(document).find("#delivered").val();
	delivered = new Date(delivered).getTime();
	employee2 = $(document).find("#employee2");
	employee2 = dataListFormat(employee2.attr("id"), employee2.val());
	startOfFreeMaintenance = $(document).find("#startOfFreeMaintenance").val();
	endOfFreeMaintenance = $(document).find("#endOfFreeMaintenance").val();
	startOfPaidMaintenance = $(document).find("#startOfPaidMaintenance").val();
	endOfPaidMaintenance = $(document).find("#endOfPaidMaintenance").val();

	startOfFreeMaintenance = new Date(startOfFreeMaintenance).getTime();
	endOfFreeMaintenance = new Date(endOfFreeMaintenance).getTime();
	startOfPaidMaintenance = new Date(startOfPaidMaintenance).getTime();
	endOfPaidMaintenance = new Date(endOfPaidMaintenance).getTime();
	
	contractAmount = $(document).find("#contractAmount").val().replaceAll(",", "");
	taxInclude = $(document).find("#taxInclude").val();
	profit = $(document).find("#profit").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/contract";
	method = "post";
	data = {
		"contractType": contractType,
		"title": title,
		"sopp": sopp,
		"employee": employee,
		"salesType": salesType,
		"customer": customer,
		"cipOfCustomer": cipOfCustomer,
		"endUser": endUser,
		"cipOfendUser": cipOfendUser,
		"saleDate": saleDate,
		"delivered": delivered,
		"employee2": employee2,
		"startOfFreeMaintenance": startOfFreeMaintenance,
		"endOfFreeMaintenance": endOfFreeMaintenance,
		"startOfPaidMaintenance": startOfPaidMaintenance,
		"endOfPaidMaintenance": endOfPaidMaintenance,
		"contractAmount": contractAmount,
		"taxInclude": taxInclude,
		"profit": profit,
		"detail": detail
	}
	type = "insert";

	data = JSON.stringify(data);
	console.log(data);
	data = cipher.encAes(data);


	crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);
}

function contractSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function contractErrorInsert(){
	alert("등록에러");
}

function contractUpdate(no){
	let contractType, title, sopp, employee, salesType, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, url, method, data, type;

	contractType = $(document).find("[name='contractType']:checked").val();
	title = $(document).find("#title").val();
	sopp = $(document).find("#sopp");
	sopp = dataListFormat(sopp.attr("id"), sopp.val());
	employee = $(document).find("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	salesType = $(document).find("#salesType").val();
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	cipOfCustomer = $(document).find("#cipOfCustomer");
	cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	cipOfendUser = $(document).find("#cipOfendUser");
	cipOfendUser = dataListFormat(cipOfendUser.attr("id"), cipOfendUser.val());
	saleDate = $(document).find("#saleDate").val();
	saleDate = new Date(saleDate).getTime();
	delivered = $(document).find("#delivered").val();
	delivered = new Date(delivered).getTime();
	employee2 = $(document).find("#employee2");
	employee2 = dataListFormat(employee2.attr("id"), employee2.val());
	startOfFreeMaintenance = $(document).find("#startOfFreeMaintenance").val();
	endOfFreeMaintenance = $(document).find("#endOfFreeMaintenance").val();
	startOfPaidMaintenance = $(document).find("#startOfPaidMaintenance").val();
	endOfPaidMaintenance = $(document).find("#endOfPaidMaintenance").val();

	startOfFreeMaintenance = new Date(startOfFreeMaintenance).getTime();
	endOfFreeMaintenance = new Date(endOfFreeMaintenance).getTime();
	startOfPaidMaintenance = new Date(startOfPaidMaintenance).getTime();
	endOfPaidMaintenance = new Date(endOfPaidMaintenance).getTime();

	contractAmount = $(document).find("#contractAmount").val().replaceAll(",", "");
	taxInclude = $(document).find("#taxInclude").val();
	profit = $(document).find("#profit").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/contract/" + no;
	method = "put";
	data = {
		"contractType": contractType,
		"title": title,
		"sopp": sopp,
		"employee": employee,
		"salesType": salesType,
		"customer": customer,
		"cipOfCustomer": cipOfCustomer,
		"endUser": endUser,
		"cipOfendUser": cipOfendUser,
		"saleDate": saleDate,
		"delivered": delivered,
		"employee2": employee2,
		"startOfFreeMaintenance": startOfFreeMaintenance,
		"endOfFreeMaintenance": endOfFreeMaintenance,
		"startOfPaidMaintenance": startOfPaidMaintenance,
		"endOfPaidMaintenance": endOfPaidMaintenance,
		"contractAmount": contractAmount,
		"taxInclude": taxInclude,
		"profit": profit,
		"detail": detail
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, contractSuccessUpdate, contractErrorUpdate);
}

function contractSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function contractErrorUpdate(){
	alert("수정에러");
}

function contractDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/contract/" + no;
		method = "delete";
		data = "";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, contractSuccessDelete, contractErrorDelete);
	}else{
		return false;
	}
}

function contractSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function contractErrorDelete(){
	alert("삭제에러");
}

function contractRadioClick(e){
	let value, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance;

	value = $(e).val();
	startOfFreeMaintenance = $(document).find("#startOfFreeMaintenance").parents(".defaultFormLine");
	endOfFreeMaintenance = $(document).find("#endOfFreeMaintenance").parents(".defaultFormLine");
	startOfPaidMaintenance = $(document).find("#startOfPaidMaintenance").parents(".defaultFormLine");
	endOfPaidMaintenance = $(document).find("#endOfPaidMaintenance").parents(".defaultFormLine");

	if(value === "10247"){
		startOfFreeMaintenance.show();
		endOfFreeMaintenance.show();
		startOfPaidMaintenance.hide();
		endOfPaidMaintenance.hide();

		startOfPaidMaintenance.val(null);
		endOfPaidMaintenance.val(null);
	}else{
		startOfPaidMaintenance.show();
		endOfPaidMaintenance.show();
		startOfFreeMaintenance.hide();
		endOfFreeMaintenance.hide();

		startOfFreeMaintenance.val(null);
		endOfFreeMaintenance.val(null);
	}
}