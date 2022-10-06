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

function drawContractList() {
	let contractContainer, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc;
	
	if (storage.contractList === undefined) {
		msg.set("등록된 계약 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.contractList;
		}else{
			jsonData = storage.searchDatas;
		}
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

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 11,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate;
			
			salesType = (jsonData[i].salesType === null || jsonData[i].salesType === "") ? "" : storage.code.etc[jsonData[i].salesType];
			contractType = (jsonData[i].contractType === null || jsonData[i].contractType === "") ? "" : storage.code.etc[jsonData[i].contractType];
			title = (jsonData[i].title === null || jsonData[i].title === "") ? "" : jsonData[i].title;
			endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "" : storage.customer[jsonData[i].endUser].name;
			contractAmount = (jsonData[i].contractAmount == 0 || jsonData[i].contractAmount === null) ? 0 : numberFormat(jsonData[i].contractAmount);
			profit = (jsonData[i].profit == 0 || jsonData[i].profit === null) ? 0 : numberFormat(jsonData[i].profit);
			employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "" : storage.user[jsonData[i].employee].userName;
			
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
	}

	createGrid(contractContainer, header, data, ids, job, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "contractInsertForm();"
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
		contractDetailView(content);
	}

	plusMenuSelect(menu);
}

function contractDetailView(e){
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

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
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawContractList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function contractErrorList(){
	alert("에러");
}

function contractSuccessView(result){
	let notIdArray, sopp, html, contractType, title, employee, customer, salesType, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, disDate, dataArray;

	storage.contractNo = result.no;

	$("searchContainer").hide();

	contractType = (result.contractType === null || result.contractType === "" || result.contractType === undefined) ? "" : storage.code.etc[result.contractType];
	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	employee = (result.employee == 0 || result.employee === null || result.employee === undefined) ? "" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
	salesType = (result.salesType === null || result.salesType === "" || result.salesType === undefined) ? "" : storage.code.etc[result.salesType];
	cipOfCustomer = (result.cipOfCustomer == 0 || result.cipOfCustomer === null || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
	endUser = (result.endUser == 0 || result.endUser === null || result.endUser === undefined) ? "" : storage.customer[result.endUser].name;
	cipOfendUser = (result.cipOfendUser == 0 || result.cipOfendUser === null || result.cipOfendUser === undefined) ? "" : result.cipOfendUser;
	sopp = (result.sopp == 0 || result.sopp === null || result.sopp === undefined) ? "" : result.sopp;

	disDate = dateDis(result.saleDate);
	saleDate = dateFnc(disDate);

	disDate = dateDis(result.delivered);
	delivered = dateFnc(disDate);

	employee2 = (result.employee2 == 0 || result.employee2 === null || result.employee2 === undefined) ? "" : storage.user[result.employee2].userName;

	disDate = dateDis(result.startOfFreeMaintenance);
	startOfFreeMaintenance = dateFnc(disDate); 

	disDate = dateDis(result.endOfFreeMaintenance);
	endOfFreeMaintenance = dateFnc(disDate);

	disDate = dateDis(result.startOfPaidMaintenance);
	startOfPaidMaintenance = dateFnc(disDate);

	disDate = dateDis(result.endOfPaidMaintenance);
	endOfPaidMaintenance = dateFnc(disDate);
	
	contractAmount = (result.contractAmount == 0 || result.contractAmount === null || result.contractAmount === undefined) ? 0 : numberFormat(result.contractAmount);
	taxInclude = (result.taxInclude === null || result.taxInclude === "" || result.taxInclude === "N" || result.taxInclude === undefined) ? false : true;
	profit = (result.profit == 0 || result.profit === null || result.profit === undefined) ? 0 : numberFormat(result.profit);
	detail = (result.detail === null || result.detail === "" || result.detail === undefined) ? "" : result.detail;

	if(cipOfCustomer !== ""){
		$.ajax({
			url: "/api/system/cip/" + cipOfCustomer,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				let jsonData;
				jsonData = cipher.decAes(resultData.data);

				cipOfCustomer = jsonData;
			}
		});
	}

	if(cipOfendUser !== ""){
		$.ajax({
			url: "/api/system/cip/" + cipOfendUser,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				let jsonData;
				jsonData = cipher.decAes(resultData.data);

				cipOfendUser = jsonData;
			}
		});
	}

	if(sopp !== ""){
		$.ajax({
			url: "/api/sopp/" + result.sopp,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				let resultJson;
				resultJson = cipher.decAes(resultData.data);
				resultJson = JSON.parse(resultJson);
	
				sopp = resultJson.title;
			},
			error:() => {
				msg.set("영업기회를 찾을 수 없습니다.");
			}
		});
	}

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
			"title": "영업기회",
			"elementId": "sopp",
			"dataKeyup": "sopp",
			"value": sopp,
		},
		{
			"title": "담당자",
			"dataKeyup": "user",
			"elementId": "employee",
			"value": employee,
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
			"elementId": "customer",
			"dataKeyup": "customer",
			"value": customer,
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"value": cipOfCustomer,
			"dataKeyup": "customerUser",
		},
		{
			"title": "엔드유저",
			"elementId": "endUser",
			"value": endUser,
			"dataKeyup": "customer",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"value": cipOfendUser,
			"dataKeyup": "customerUser",
		},
		{
			"title": "발주일자",
			"elementId": "saleDate",
			"value": saleDate,
			"type": "date",
		},
		{
			"title": "검수일자",
			"elementId": "delivered",
			"value": delivered,
			"type": "date",
		},
		{
			"title": "(부)담당자",
			"elementId": "employee2",
			"value": employee2,
			"dataKeyup": "user",
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
			"title": "무상 유지보수일자 시작일",
			"elementId": "startOfFreeMaintenance",
			"value": startOfFreeMaintenance,
			"type": "date",
		},
		{
			"title": "무상 유지보수일자 종료일",
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
			"elementId": "contractAmount",
			"value": contractAmount,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "매출이익",
			"elementId": "profit",
			"value": profit,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "계약명",
			"elementId": "title",
			"value": title,
			"col": 3,
		},
		{
			"title": "내용",
			"type": "textarea",
			"value": detail,
			"elementId": "detail",
			"col": 3,
		},
	];

	html = "<div class='tabs'>";
	html += "<input type='radio' id='tabAll' name='tabItem' data-content-id='tabContentAll' onclick='tabItemClick(this)' checked>";
	html += "<label class='tabItem' for='tabAll'>기본정보</label>";
	html += "<input type='radio' id='tabTrade' name ='tabItem' data-content-id='tabTradeList' onclick='tabItemClick(this)'>";
	html += "<label class='tabItem' for='tabTrade'>매입매출내역</label>";
	// html += "<input type='radio' id='tabEst' name='tabItem' data-content-id='tabEstList' onclick='tabItemClick(this)'>";
	// html += "<label class='tabItem' for='tabEst'>견적내역</label>";
	html += "<input type='radio' id='tabFile' name='tabItem' data-content-id='tabFileList' data-id='" + result.no + "' onclick='tabItemClick(this)'>";
	html += "<label class='tabItem' for='tabFile'>파일첨부</label>";
	html += "<input type='radio' id='tabTech' name='tabItem' data-content-id='tabTechList' onclick='tabItemClick(this)'>";
	html += "<label class='tabItem' for='tabTech'>기술지원내역</label>";
	html += "<input type='radio' id='tabSales' name='tabItem' data-content-id='tabSalesList' onclick='tabItemClick(this)'>";
	html += "<label class='tabItem' for='tabSales'>영업활동내역</label>";
	html += "</div><br/>";
	html += detailViewForm(dataArray);
	html += createTabTradeList(result.trades);
	conTitleChange("containerTitle", "<a href='#' onclick='detailViewContainerHide(\"계약조회\");'>뒤로가기</a>");
	$(".detailContents").html(html);
	notIdArray = ["employee"];
	
	storage.attachedList = result.attached;
	storage.attachedNo = result.no;
	storage.attachedType = "contract";
	storage.attachedFlag = true;

	createTabFileList();
	createTabTechList(result.schedules);
	createTabSalesList(result.schedules);

	$(".detailContents").show();
	
	setTimeout(() => {
		$("[name='contractType'][value='" + result.contractType + "']").prop("checked" ,true);
		$("#salesType option[value='" + result.salesType + "']").prop("selected" ,true);
		$("#taxInclude option[value='" + taxInclude + "']").prop("selected" ,true);
		let menu = [
			{
				"keyword": "add",
				"onclick": "contractInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"contractUpdate();\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "contractDelete(" + result.no + ");"
			},
		];

		plusMenuSelect(menu);
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();

		if(contractType === "판매계약"){
			$("#startOfFreeMaintenance").parents(".detailViewContent").prev().show();
			$("#startOfFreeMaintenance").parents(".detailViewContent").show();
			$("#endOfFreeMaintenance").parents(".detailViewContent").prev().show();
			$("#endOfFreeMaintenance").parents(".detailViewContent").show();
			$("#startOfPaidMaintenance").parents(".detailViewContent").prev().hide();
			$("#startOfPaidMaintenance").parents(".detailViewContent").hide();
			$("#endOfPaidMaintenance").parents(".detailViewContent").prev().hide();
			$("#endOfPaidMaintenance").parents(".detailViewContent").hide();

			$("#startOfPaidMaintenance").val(null);
			$("#endOfPaidMaintenance").val(null);
		}else{
			$("#startOfFreeMaintenance").parents(".detailViewContent").prev().hide();
			$("#startOfFreeMaintenance").parents(".detailViewContent").hide();
			$("#endOfFreeMaintenance").parents(".detailViewContent").prev().hide();
			$("#endOfFreeMaintenance").parents(".detailViewContent").hide();
			$("#startOfPaidMaintenance").parents(".detailViewContent").prev().show();
			$("#startOfPaidMaintenance").parents(".detailViewContent").show();
			$("#endOfPaidMaintenance").parents(".detailViewContent").prev().show();
			$("#endOfPaidMaintenance").parents(".detailViewContent").show();

			$("#startOfFreeMaintenance").val(null);
			$("#endOfFreeMaintenance").val(null);
		}
	}, 100);

	detailTabHide("tabContentAll");
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
			"title": "계약명(*)",
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
			"title": "담당자(*)",
			"dataKeyup": "user",
			"elementId": "employee",
			"dataKeyup": "user",
		},
		{
			"title": "판매방식(*)",
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
			"title": "매출처(*)",
			"elementId": "customer",
			"disabled": false,
			"dataKeyup": "customer",
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"disabled": false,
			"dataKeyup": "customerUser",
		},
		{
			"title": "엔드유저(*)",
			"elementId": "endUser",
			"disabled": false,
			"dataKeyup": "customer",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"disabled": false,
			"dataKeyup": "customerUser",
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
			"title": "무상 유지보수일자 종료일",
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

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("계약등록");
	modal.content.css("width", "1200px");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "contractInsert();");
	modal.close.attr("onclick", "modal.hide();");
	
	setTimeout(() => {
		let my = storage.my;

		$("[name='contractType']").eq(0).prop("checked", true);
		$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#employee").val(storage.user[my].userName);
	}, 100);
}

function contractInsert(){
	if($("#title").val() === ""){
		alert("계약명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#sopp").val() === ""){
		alert("영업기회를 입력해주세요.");
		$("#sopp").focus();
		return false;
	}else if($("#employee").val() === ""){
		alert("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	}else if($("#customer").val() === ""){
		alert("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#endUser").val() === ""){
		alert("엔드유저를 입력해주세요.");
		$("#endUser").focus();
		return false;
	}else{
		let contractType, title, sopp, employee, salesType, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, url, method, data, type;
	
		contractType = $("[name='contractType']:checked").val();
		title = $("#title").val();
		sopp = $("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		employee = $("#employee");
		employee = dataListFormat(employee.attr("id"), employee.val());
		salesType = $("#salesType").val();
		customer = $("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		cipOfCustomer = $("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		endUser = $("#endUser");
		endUser = dataListFormat(endUser.attr("id"), endUser.val());
		cipOfendUser = $("#cipOfendUser");
		cipOfendUser = dataListFormat(cipOfendUser.attr("id"), cipOfendUser.val());
		saleDate = $("#saleDate").val();
		saleDate = new Date(saleDate).getTime();
		delivered = $("#delivered").val();
		delivered = new Date(delivered).getTime();
		employee2 = $("#employee2");
		employee2 = dataListFormat(employee2.attr("id"), employee2.val());
		startOfFreeMaintenance = $("#startOfFreeMaintenance").val();
		endOfFreeMaintenance = $("#endOfFreeMaintenance").val();
		startOfPaidMaintenance = $("#startOfPaidMaintenance").val();
		endOfPaidMaintenance = $("#endOfPaidMaintenance").val();
	
		if(contractType === "10247"){
			startOfFreeMaintenance = new Date(startOfFreeMaintenance).getTime();
			endOfFreeMaintenance = new Date(endOfFreeMaintenance).getTime();
		}else{
			startOfPaidMaintenance = new Date(startOfPaidMaintenance).getTime();
			endOfPaidMaintenance = new Date(endOfPaidMaintenance).getTime();
		}
		
		contractAmount = $("#contractAmount").val().replaceAll(",", "");
		taxInclude = $("#taxInclude").val();
		profit = $("#profit").val().replaceAll(",", "");
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
		data = cipher.encAes(data);
	
		crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);
	}
}

function contractSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function contractErrorInsert(){
	alert("등록에러");
}

function contractUpdate(){
	if($("#title").val() === ""){
		alert("계약명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#sopp").val() === ""){
		alert("영업기회를 입력해주세요.");
		$("#sopp").focus();
		return false;
	}else if($("#employee").val() === ""){
		alert("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	}else if($("#customer").val() === ""){
		alert("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#endUser").val() === ""){
		alert("엔드유저를 입력해주세요.");
		$("#endUser").focus();
		return false;
	}else{
		let contractType, title, sopp, employee, salesType, customer, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, url, method, data, type;
	
		contractType = $("[name='contractType']:checked").val();
		title = $("#title").val();
		sopp = $("#sopp");
		sopp = dataListFormat(sopp.attr("id"), sopp.val());
		employee = $("#employee");
		employee = dataListFormat(employee.attr("id"), employee.val());
		salesType = $("#salesType").val();
		customer = $("#customer");
		customer = dataListFormat(customer.attr("id"), customer.val());
		cipOfCustomer = $("#cipOfCustomer");
		cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
		endUser = $("#endUser");
		endUser = dataListFormat(endUser.attr("id"), endUser.val());
		cipOfendUser = $("#cipOfendUser");
		cipOfendUser = dataListFormat(cipOfendUser.attr("id"), cipOfendUser.val());
		saleDate = $("#saleDate").val();
		saleDate = new Date(saleDate).getTime();
		delivered = $("#delivered").val();
		delivered = new Date(delivered).getTime();
		employee2 = $("#employee2");
		employee2 = dataListFormat(employee2.attr("id"), employee2.val());
		startOfFreeMaintenance = $("#startOfFreeMaintenance").val();
		endOfFreeMaintenance = $("#endOfFreeMaintenance").val();
		startOfPaidMaintenance = $("#startOfPaidMaintenance").val();
		endOfPaidMaintenance = $("#endOfPaidMaintenance").val();

		if(contractType === "10247"){
			startOfFreeMaintenance = new Date(startOfFreeMaintenance).getTime();
			endOfFreeMaintenance = new Date(endOfFreeMaintenance).getTime();
		}else{
			startOfPaidMaintenance = new Date(startOfPaidMaintenance).getTime();
			endOfPaidMaintenance = new Date(endOfPaidMaintenance).getTime();
		}
	
		contractAmount = $("#contractAmount").val().replaceAll(",", "");
		taxInclude = $("#taxInclude").val();
		profit = $("#profit").val().replaceAll(",", "");
		detail = tinymce.activeEditor.getContent();
	
		url = "/api/contract/" + storage.contractNo;
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
	value = $(e).val();

	
	if(value === "10247"){
		console.log("무상실행");
		$("#startOfFreeMaintenance").parents(".defaultFormLine").show();
		$("#endOfFreeMaintenance").parents(".defaultFormLine").show();
		$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();

		$("#startOfPaidMaintenance").val("");
		$("#endOfPaidMaintenance").val("");
	}else{
		$("#startOfFreeMaintenance").parents(".defaultFormLine").hide();
		$("#endOfFreeMaintenance").parents(".defaultFormLine").hide();
		$("#startOfPaidMaintenance").parents(".defaultFormLine").show();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").show();
		
		console.log("유상실행");
		console.log($("#startOfFreeMaintenance"));
		console.log($("#startOfPaidMaintenance"));
		$("#startOfFreeMaintenance").val("");
		$("#endOfFreeMaintenance").val("");
	}
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.contractList, searchAllInput, "input");
	drawContractList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.contractList.length; i++){
		let no, customer, endUser, title, contractType, employee, salesType, disDate, startOfFreeMaintenance, startOfPaidMaintenance, saleDate;
		no = storage.contractList[i].no;
		customer = (storage.contractList[i].customer === null || storage.contractList[i].customer == 0 || storage.contractList[i].customer === undefined) ? "" : storage.customer[storage.contractList[i].customer].name;
		endUser = (storage.contractList[i].endUser === null || storage.contractList[i].endUser == 0 || storage.contractList[i].endUser === undefined) ? "" : storage.customer[storage.contractList[i].endUser].name;
		title = storage.contractList[i].title;
		contractType = storage.code.etc[storage.contractList[i].contractType];
		salesType = storage.code.etc[storage.contractList[i].salesType];
		employee = (storage.contractList[i].employee === null || storage.contractList[i].employee == 0) ? "" : storage.user[storage.contractList[i].employee].userName;
		disDate = dateDis(storage.contractList[i].startOfFreeMaintenance);
		startOfFreeMaintenance = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.contractList[i].startOfPaidMaintenance);
		startOfPaidMaintenance = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.contractList[i].saleDate);
		saleDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + customer + "#" + endUser + "#" + title + "#" + contractType + "#" + salesType + "#" + employee + "#startOfFreeMaintenance" + startOfFreeMaintenance + "#startOfPaidMaintenance" + startOfPaidMaintenance + "#saleDate" + saleDate);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchEmployee, searchCustomer, searchTitle, searchEndUser, searchSalesType, searchContractType, startOfFreeMaintenanceFrom, startOfPaidMaintenanceFrom, saleDateFrom;

	searchEmployee = $("#searchEmployee").val();
	searchCustomer = $("#searchCustomer").val();
	searchEndUser = $("#searchEndUser").val();
	searchTitle = $("#searchTitle").val();
	searchSalesType = $("#searchSalesType").val();
	searchContractType = $("#searchContractType").val();
	startOfFreeMaintenanceFrom = ($("#startOfFreeMaintenanceFrom").val() === "") ? "" : $("#startOfFreeMaintenanceFrom").val().replaceAll("-", "") + "#startOfFreeMaintenance" + $("#startOfFreeMaintenanceTo").val().replaceAll("-", "");
	startOfPaidMaintenanceFrom = ($("#startOfPaidMaintenanceFrom").val() === "") ? "" : $("#startOfPaidMaintenanceFrom").val().replaceAll("-", "") + "#startOfPaidMaintenance" + $("#startOfPaidMaintenanceTo").val().replaceAll("-", "");
	saleDateFrom = ($("#saleDateFrom").val() === "") ? "" : $("#saleDateFrom").val().replaceAll("-", "") + "#saleDate" + $("#saleDateTo").val().replaceAll("-", "");
	
	let searchValues = [searchEmployee, searchCustomer, searchEndUser, searchTitle, searchSalesType, searchContractType, startOfFreeMaintenanceFrom, startOfPaidMaintenanceFrom, saleDateFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== ""){
			let tempArray = searchDataFilter(storage.contractList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.contractList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawContractList();
}