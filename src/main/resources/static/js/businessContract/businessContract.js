let R = {};

$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	R.contract = new Contracts(location.origin, document.getElementsByClassName("container")[0]);
	getContractList();
});

function getContractList() {

	let url, method, data, type;

	url = "/api/contract";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, contractSuccessList, contractErrorList);


	let checkHref = location.href;
	checkHref = checkHref.split("//");
	checkHref = checkHref[1];
	let splitArr = checkHref.split("/"); // 전자결재 문서 번호로 들어오는 경우 

	// 전자결재 홈 화면에서 들어오는 경우 , 상세조회
	if (splitArr.length > 3) {
		$.ajax({
			url: apiServer + "/api/gw/app/doc/" + splitArr[3],
			method: "get",
			dataType: "json",
			cache: false,
			success: (data) => {
				let detailData;
				if (data.result === "ok") {
					detailData = cipher.decAes(data.data);
					detailData = JSON.parse(detailData);
					detailData.doc = cipher.decAes(detailData.doc);
					detailData.doc = detailData.doc.replaceAll('\\"', '"');
					storage.reportDetailData = detailData;
					//	contractInsertForm();
					getEstimateData();

				} else {
					alert("문서 정보를 가져오는 데 실패했습니다");
				}
			},
		});
	}

}

function drawContractList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc, pageContainer, containerTitle, hideArr, showArr;

	if (storage.contractList === undefined) {
		msg.set("등록된 계약 없습니다");
	}
	else {
		if (storage.searchDatas === undefined) {
			jsonData = storage.contractList;
		} else {
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn"];
	showArr = ["gridList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "listSearchInput"];
	containerTitle = $("#containerTitle");
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridList");

	header = [
		{
			"title": "등록일",
			"align": "center",
		},
		{
			"title": "계약명",
			"align": "center",
		},
		{
			"title": "담당자",
			"align": "center",
		},
		{
			"title": "판매방식",
			"align": "center",
		},
		{
			"title": "계약방식",
			"align": "center",
		},
		{
			"title": "엔드유저",
			"align": "center",
		},
		{
			"title": "계약금액",
			"align": "center",
		},
		{
			"title": "매출이익",
			"align": "center",
		},
		{
			"title": "발주일자",
			"align": "center",
		},
	];

	if (jsonData === "") {
		str = [
			{
				"setData": undefined,
				"col": 11,
			},
		];

		data.push(str);
	} else {
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate, setCreated;
			let related = jsonData[i].related;
			related = JSON.parse(related);

			// salesType = (jsonData[i].salesType === null || jsonData[i].salesType === "") ? "" : storage.code.etc[jsonData[i].salesType];
			// contractType = (jsonData[i].contractType === null || jsonData[i].contractType === "") ? "" : storage.code.etc[jsonData[i].contractType];
			salesType = (related.salesType === null || related.salesType === "") ? "" : storage.code.etc[related.salesType];
			contractType = (related.contractType === null || related.contractType === "") ? "" : storage.code.etc[related.contractType];
			title = (jsonData[i].title === null || jsonData[i].title === "") ? "" : jsonData[i].title;
			endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "" : storage.customer[jsonData[i].endUser].name;
			contractAmount = (jsonData[i].contractAmount == 0 || jsonData[i].contractAmount === null) ? 0 : numberFormat(jsonData[i].contractAmount);
			profit = (jsonData[i].profit == 0 || jsonData[i].profit === null) ? 0 : numberFormat(jsonData[i].profit);
			employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "" : storage.user[jsonData[i].employee].userName;

			if (contractType === "유지보수") {
				disDate = dateDis(jsonData[i].startOfPaidMaintenance);
				startMaintenance = dateFnc(disDate, "yy-mm-dd");

				disDate = dateDis(jsonData[i].endOfPaidMaintenance);
				endMaintenance = dateFnc(disDate, "yy-mm-dd");
			} else {
				disDate = dateDis(jsonData[i].startOfFreeMaintenance);
				startMaintenance = dateFnc(disDate, "yy-mm-dd");

				disDate = dateDis(jsonData[i].endOfFreeMaintenance);
				endMaintenance = dateFnc(disDate, "yy-mm-dd");
			}

			disDate = dateDis(jsonData[i].saleDate);
			saleDate = dateFnc(disDate, "mm-dd");

			disDate = dateDis(jsonData[i].created, jsonData[i].modified);
			setCreated = dateFnc(disDate, "mm-dd");

			str = [
				{
					"setData": setCreated,
					"align": "center",
				},
				{
					"setData": title,
					"align": "left",
				},
				{
					"setData": employee,
					"align": "center",
				},
				{
					"setData": salesType,
					"align": "center",
				},
				{
					"setData": contractType,
					"align": "center",
				},
				{
					"setData": endUser,
					"align": "center",
				},
				{
					"setData": contractAmount,
					"align": "right",
				},
				{
					"setData": profit,
					"align": "right",
				},
				{
					"setData": saleDate,
					"align": "center",
				}
			];

			fnc = "contractDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}

		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawContractList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.html("계약조회");
	createGrid(container, header, data, ids, job, fnc);
	setViewContents(hideArr, showArr);

	let path = $(location).attr("pathname").split("/");
	if (path[3] !== undefined && jsonData !== "") {
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		contractDetailView(content);
	}
}

function contractDetailView(e) {
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

	id = $(e).data("id");
	url = "/api/contract/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, contractSuccessView, contractErrorView);





}

function contractSuccessList(result) {
	storage.contractList = result;

	if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined) {
		window.setTimeout(drawContractList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	} else {
		window.setTimeout(drawContractList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function contractErrorList() {
	msg.set("에러");
}

function contractSuccessView(result) {
	storage.contractDetail = result;
	let notIdArray, datas, sopp, html, htmlSecond, contractType, title, employee, customer, salesType, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, disDate, dataArray, gridList, containerTitle, detailBackBtn, crudUpdateBtn, crudDeleteBtn;
	detailSetFormList(result);
	let related;
	gridList = $(".gridList");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	detailSecondTabs = $(".detailSecondTabs");
	crudUpdateBtn = $(".crudUpdateBtn");
	crudDeleteBtn = $(".crudDeleteBtn");
	datas = ["employee", "customer", "cipOfCustomer", "endUser", "cipOfendUser", "sopp", "employee2"];
	notIdArray = ["employee"];
	related = JSON.parse(result.related);
	sopp = (related.parent.split(":")[1] == 0 || related.parent.split(":")[1] === null || related.parent.split(":")[1] === undefined || related.parent.split(":")[1] === "") ? "" : related.parent.split(":")[1];
	contractType = (related.contractType == 0 || related.contractType === null || related.contractType === undefined || related.contractType === "") ? "" : related.contractType;
	salesType = (related.salesType == 0 || related.salesType === null || related.salesType === undefined || related.salesType === "") ? "" : related.salesType;
	// contractType = (result.contractType === null || result.contractType === "" || result.contractType === undefined) ? "" : storage.code.etc[result.contractType];
	// salesType = (result.salesType === null || result.salesType === "" || result.salesType === undefined) ? "" : storage.code.etc[result.salesType];

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	employee = (result.employee == 0 || result.employee === null || result.employee === undefined) ? "" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;

	cipOfCustomer = (result.cipOfCustomer == 0 || result.cipOfCustomer === null || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
	endUser = (result.endUser == 0 || result.endUser === null || result.endUser === undefined) ? "" : storage.customer[result.endUser].name;
	cipOfendUser = (result.cipOfendUser == 0 || result.cipOfendUser === null || result.cipOfendUser === undefined) ? "" : result.cipOfendUser;

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

	if (cipOfCustomer !== "") {
		cipOfCustomer = storage.cip[cipOfCustomer].name;
	}

	if (cipOfendUser !== "") {
		cipOfendUser = storage.cip[cipOfendUser].name;
	}


	if (sopp !== "") {
		for (let key in storage.sopp) {
			if (storage.sopp[key].no == sopp) {
				sopp = storage.sopp[key].title;
			}
		}
	}

	dataArray = [

		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"complete": "sopp",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": sopp,
		},
		{
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "employee",
			"value": employee,
		},
		{
			"title": "(부)담당자",
			"elementId": "employee2",
			"value": employee2,
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
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
		},
		{
			"title": "매출처(*)",
			"elementId": "customer",
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": customer,
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"value": cipOfCustomer,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저(*)",
			"elementId": "endUser",
			"value": endUser,
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"value": cipOfendUser,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
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
			"title": "VAT 포함여부",
			"selectValue": [
				{
					"key": true,
					"value": "포함",
				},
				{
					"key": false,
					"value": "미포함",
				},
			],
			"type": "select",
			"elementId": "taxInclude",
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
			"title": "",
			"col": 3,
		},
		{
			"title": "계약명(*)",
			"elementId": "title",
			"value": title,
			"col": 4,
		},
		{
			"title": "내용",
			"type": "textarea",
			"value": detail,
			"elementId": "detail",
			"col": 4,
		},
	];

	html = detailViewForm(dataArray);
	htmlSecond = "<div class='tabs'>";
	htmlSecond += "<input type='radio' id='tabTrade' name ='tabItem' data-content-id='tabTradeList' onclick='tabItemClick(this)' checked>";
	htmlSecond += "<label class='tabItem' for='tabTrade'></label>";
	htmlSecond += "<input type='radio' id='tabFile' name='tabItem' data-content-id='tabFileList' data-id='" + result.no + "' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='tabFile'></label>";
	htmlSecond += "<input type='radio' id='tabTech' name='tabItem' data-content-id='tabTechList' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='tabTech'></label>";
	htmlSecond += "<input type='radio' id='tabSales' name='tabItem' data-content-id='tabSalesList' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='tabSales'></label>";
	htmlSecond += "</div>";
	detailSecondTabs.append(htmlSecond);
	containerTitle.html(title);
	gridList.after(html);
	setTabsLayOutMenu();

	if (storage.my == result.employee) {
		crudUpdateBtn.attr("onclick", "enableDisabled(this, \"contractUpdate();\", \"" + notIdArray + "\");");
		crudUpdateBtn.css("display", "flex");
		crudDeleteBtn.css("display", "flex");
	} else {
		crudUpdateBtn.css("display", "none");
		crudDeleteBtn.css("display", "none");
	}

	detailBackBtn.css("display", "flex");
	storage.attachedList = result.attached;
	storage.attachedNo = result.no;
	storage.attachedType = "contract";
	storage.attachedFlag = true;

	createTabTradeList(result.trades);
	createTabFileList();
	createTabTechList(result.schedules);
	createTabSalesList(result.schedules);
	detailTabHide("tabTradeList");
	detailTrueDatas(datas);







	setTimeout(() => {
		$("[name='contractType'][value='" + result.contractType + "']").prop("checked", true);
		$("#salesType option[value='" + result.salesType + "']").prop("selected", true);
		$("#taxInclude option[value='" + taxInclude + "']").prop("selected", true);

		if (contractType === "판매계약") {
			$("#startOfFreeMaintenance").parents(".defaultFormLine").show();
			$("#endOfFreeMaintenance").parents(".defaultFormLine").show();
			$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
			$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();

			$("#startOfPaidMaintenance").val(null);
			$("#endOfPaidMaintenance").val(null);
		} else {
			$("#startOfFreeMaintenance").parents(".defaultFormLine").hide();
			$("#endOfFreeMaintenance").parents(".defaultFormLine").hide();
			$("#startOfPaidMaintenance").parents(".defaultFormLine").show();
			$("#endOfPaidMaintenance").parents(".defaultFormLine").show();

			$("#startOfFreeMaintenance").val(null);
			$("#endOfFreeMaintenance").val(null);
		}

		hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		showArr = ["defaultFormContainer", "detailSecondTabs"];
		setViewContents(hideArr, showArr);
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);


	let maintenance = storage.contractDetail.maintenance;
	if (maintenance != undefined) {
		maintenance = JSON.parse(maintenance);
	} else {
		maintenance = [];
	}
	setMaintenanceTab(maintenance);




}

function contractErrorView() {
	msg.set("에러");
}

function contractInsertForm() {
	let html, dataArray;

	dataArray = [

		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"complete": "sopp",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"disabled": false,
		},
		{
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "employee",
		},
		{
			"title": "(부)담당자",
			"elementId": "employee2",
			"disabled": false,
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
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
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"disabled": false,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저(*)",
			"elementId": "endUser",
			"disabled": false,
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"disabled": false,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
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
					"value": "포함",
				},
				{
					"key": false,
					"value": "미포함",
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
			"title": "",
		},
		{
			"title": "계약명(*)",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "detail",
			"disabled": false,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray, "modal");
	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text("계약등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "contractInsert();");
	modal.close.attr("onclick", "modal.hide();");

	storage.formList = {
		"contractType": "",
		"sopp": 0,
		"employee": storage.my,
		"salesType": "",
		"customer": 0,
		"cipOfCustomer": 0,
		"endUser": 0,
		"cipOfendUser": 0,
		"saleDate": "",
		"delivered": "",
		"employee2": 0,
		"startOfFreeMaintenance": "",
		"endOfFreeMaintenance": "",
		"startOfPaidMaintenance": "",
		"endOfPaidMaintenance": "",
		"contractAmount": 0,
		"taxInclude": "",
		"profit": 0,
		"title": "",
		"detail": ""
	};

	setTimeout(() => {
		let my = storage.my, nowDate;
		nowDate = new Date().toISOString().substring(0, 10);
		$("[name='contractType']").eq(0).prop("checked", true);
		$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#employee").val(storage.user[my].userName);
		$("#employee").attr("data-change", true);
		$("#saleDate, #delivered, #startOfFreeMaintenance, #endOfFreeMaintenance, #startOfPaidMaintenance, #endOfPaidMaintenance").val(nowDate);
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function contractInsert() {
	if ($("#title").val() === "") {
		msg.set("계약명을 입력해주세요.");
		$("#title").focus();
		return false;
	} else if ($("#sopp").val() === "") {
		msg.set("영업기회를 입력해주세요.");
		$("#sopp").focus();
		return false;
	} else if (!validateAutoComplete($("#sopp").val(), "sopp")) {
		msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
		$("#sopp").focus();
		return false;
	} else if ($("#employee").val() === "") {
		msg.set("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	} else if ($("#customer").val() === "") {
		msg.set("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")) {
		msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfCustomer").focus();
		return false;
	} else if (!validateAutoComplete($("#customer").val(), "customer")) {
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#endUser").val() === "") {
		msg.set("엔드유저를 입력해주세요.");
		$("#endUser").focus();
		return false;
	} else if ($("#cipOfendUser").val() !== "" && !validateAutoComplete($("#cipOfendUser").val(), "cip")) {
		msg.set("조회된 엔드유저 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfendUser").focus();
		return false;
	} else if (!validateAutoComplete($("#endUser").val(), "customer")) {
		msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
		$("#endUser").focus();
		return false;
	} else {
		let url, method, data, type;


		formDataSet();
		// 수주판매보고양식에서 계약 등록하는 경우 구분 

		let checkHref = location.href;
		checkHref = checkHref.split("//");
		checkHref = checkHref[1];
		let splitArr = checkHref.split("/");
		if (splitArr.length > 3) {
			console.log("확인");
			setFormListDefaultData();
		}

		console.log(storage.formList);

		url = "/api/contract";
		method = "post";
		data = storage.formList;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);
	}
}

function contractSuccessInsert() {
	msg.set("등록완료");
	location.href = "/business/contract";
}

function contractErrorInsert() {
	msg.set("등록에러");
}

function contractUpdate() {
	if ($("#title").val() === "") {
		msg.set("계약명을 입력해주세요.");
		$("#title").focus();
		return false;
	} else if ($("#sopp").val() === "") {
		msg.set("영업기회를 입력해주세요.");
		$("#sopp").focus();
		return false;
	} else if (!validateAutoComplete($("#sopp").val(), "sopp")) {
		msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
		$("#sopp").focus();
		return false;
	} else if ($("#employee").val() === "") {
		msg.set("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	} else if ($("#customer").val() === "") {
		msg.set("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")) {
		msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfCustomer").focus();
		return false;
	} else if (!validateAutoComplete($("#customer").val(), "customer")) {
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#endUser").val() === "") {
		msg.set("엔드유저를 입력해주세요.");
		$("#endUser").focus();
		return false;
	} else if ($("#cipOfendUser").val() !== "" && !validateAutoComplete($("#cipOfendUser").val(), "cip")) {
		msg.set("조회된 엔드유저 담당자가 없습니다.\n다시 확인해주세요.");
		$("#cipOfendUser").focus();
		return false;
	} else if (!validateAutoComplete($("#endUser").val(), "customer")) {
		msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
		$("#endUser").focus();
		return false;
	} else {
		let url, method, data, type;

		formDataSet();

		url = "/api/contract/" + storage.formList.no;
		method = "put";
		data = storage.formList;
		type = "update";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, contractSuccessUpdate, contractErrorUpdate);
	}
}

function contractSuccessUpdate() {
	msg.set("수정완료");
	location.reload();

}

function contractErrorUpdate() {
	msg.set("수정에러");
}

function contractDelete() {
	let url, method, data, type;

	if (confirm("정말로 삭제하시겠습니까??")) {
		url = "/api/contract/" + storage.formList.no;
		method = "delete";
		data = "";
		type = "delete";

		crud.defaultAjax(url, method, data, type, contractSuccessDelete, contractErrorDelete);
	} else {
		return false;
	}
}

function contractSuccessDelete() {
	msg.set("삭제완료");
	location.reload();
}

function contractErrorDelete() {
	msg.set("삭제에러");
}

function contractRadioClick(e) {
	let value = $(e).val(), nowDate;
	nowDate = new Date().toISOString().substring(0, 10);

	if (value === "10247") {
		$("#startOfFreeMaintenance").parents(".defaultFormLine").show();
		$("#endOfFreeMaintenance").parents(".defaultFormLine").show();
		$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#startOfPaidMaintenance").val(nowDate);
		$("#endOfPaidMaintenance").val(nowDate);
	} else {
		$("#startOfFreeMaintenance").parents(".defaultFormLine").hide();
		$("#endOfFreeMaintenance").parents(".defaultFormLine").hide();
		$("#startOfPaidMaintenance").parents(".defaultFormLine").show();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").show();
		$("#startOfFreeMaintenance").val(nowDate);
		$("#endOfFreeMaintenance").val(nowDate);
	}
}

function searchInputKeyup() {
	let searchAllInput, tempArray;
	searchAllInput = $("#searchAllInput").val();
	tempArray = searchDataFilter(storage.contractList, searchAllInput, "input");

	if (tempArray.length > 0) {
		storage.searchDatas = tempArray;
	} else {
		storage.searchDatas = "";
	}

	drawContractList();
}

function addSearchList() {
	storage.searchList = [];

	for (let i = 0; i < storage.contractList.length; i++) {
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
		disDate = dateDis(storage.contractList[i].created, storage.contractList[i].modified);
		setCreated = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + customer + "#" + endUser + "#" + title + "#" + contractType + "#" + salesType + "#" + employee + "#startOfFreeMaintenance" + startOfFreeMaintenance + "#startOfPaidMaintenance" + startOfPaidMaintenance + "#saleDate" + saleDate + "#created" + setCreated);
	}
}

function searchSubmit() {
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

	for (let i = 0; i < searchValues.length; i++) {
		if (searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null) {
			let tempArray = searchDataFilter(storage.contractList, searchValues[i], "multi");

			for (let t = 0; t < tempArray.length; t++) {
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.contractList);

	storage.searchDatas = resultArray;

	if (storage.searchDatas.length == 0) {
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.contractList;
	}

	drawContractList();
}



// 견적데이터 가져오기 
function getEstimateData() {
	let related = storage.reportDetailData.related;
	let estimate = related.previous.split(":")[1];
	let url;
	url = apiServer + "/api/estimate/" + estimate;

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
				for (x = 0; x < list.length; x++)	list[x].doc = cipher.decAes(list[x].doc);
				storage.estmVerList = list;
				getSoppData();
				getProductList();
				window.setTimeout(setSalesReportData, 700);
			} else {
				console.log(data.msg);
			}
		}
	});

}
// 수주판매보고양식에서 계약 등록으로 온 경우 데이터 자동 세팅 
function setSalesReportData() {

	let related, contractAmount, profit, soppNo, soppData;
	let customer, salesType, endUser, contTitle, contType, tax;
	related = storage.reportDetailData.related;

	// 영업기회 
	contractAmount = related.outSumAllTotal;  // 계약금액 
	profit = related.profit;// 매출이익
	soppNo = storage.reportDetailData.sopp; // 영업기회 번호 
	soppData = storage.soppDetail; // 
	customer = soppData.customer; // 매출처
	endUser = soppData.endUser; // 엔드유저
	salesType = soppData.soppType; // 판매방식 
	contTitle = soppData.title; // 계약 제목
	contType = soppData.contType; // 계약타입
	cipOfCustomer = soppData.picOfCustomer; // 매출처 담당자 
	tax = related.tax;

	let today = new Date();
	let startDate = new Date(today.setDate(today.getDate() + 1)).getTime();
	let endDate = new Date(today.setDate(today.getDate() + 364)).getTime();

	// 유지보수이면 유상 유지보수에 date 넣으면 됨 


	if (contType == 10247) {
		storage.formList = {
			"contractType": contType,
			"sopp": storage.reportDetailData.sopp,
			"employee": storage.my,
			"salesType": soppData.soppType,
			"customer": soppData.customer,
			"cipOfCustomer": soppData.picOfCustomer,
			"endUser": soppData.endUser,
			"cipOfendUser": 0,
			"saleDate": null,
			"delivered": null,
			"employee2": 0,
			"startOfFreeMaintenance": startDate,
			"endOfFreeMaintenance": endDate,
			"startOfPaidMaintenance": null,
			"endOfPaidMaintenance": null,
			"contractAmount": related.outSumAllTotal,
			"taxInclude": related.tax,
			"profit": storage.reportDetailData.related.profit,
			"title": storage.reportDetailData.sopp,
			"detail": ""
		};
	} else {
		storage.formList = {
			"contractType": contType,
			"sopp": storage.reportDetailData.sopp,
			"employee": storage.my,
			"salesType": soppData.soppType,
			"customer": soppData.customer,
			"cipOfCustomer": soppData.picOfCustomer,
			"endUser": soppData.endUser,
			"cipOfendUser": 0,
			"saleDate": null,
			"delivered": null,
			"employee2": 0,
			"startOfFreeMaintenance": null,
			"endOfFreeMaintenance": null,
			"startOfPaidMaintenance": startDate,
			"endOfPaidMaintenance": endDate,
			"contractAmount": related.outSumAllTotal,
			"taxInclude": related.tax,
			"profit": storage.reportDetailData.related.profit,
			"title": storage.reportDetailData.sopp,
			"detail": ""
		};
	}
	// 계약 생성 
	url = "/api/contract";
	method = "post";
	data = storage.formList;
	type = "insert";
	data = JSON.stringify(data);
	data = cipher.encAes(data);
	crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);



	; cipher.decAes

	// 매입 데이터 insert 
	for (let i = 0; i < storage.reportDetailData.related.inItems.length; i++) {
		let product;
		for (let i = 0; i < storage.productList.length; i++) {
			if (storage.productList[i].no == storage.reportDetailData.related.inItems[0].inProduct) {
				product = storage.productList[i].product;
			}
		}
		let inData = {
			"belongTo": "sopp:" + storage.reportDetailData.sopp + "",
			"writer": storage.my,
			"type": "purchase", // 매입인지 매출인지 
			"product": storage.reportDetailData.related.inItems[0].inProduct, // 상품번호
			"customer": storage.reportDetailData.related.inItems[0].inCus * 1,
			"title": "",
			"qty": storage.reportDetailData.related.inItems[0].inQuantity,//수량
			"price": storage.reportDetailData.related.inItems[0].inPrice, // 단가
			"vat": storage.reportDetailData.related.inItems[0].tax,// 부가세액
		}

		console.log(inData);
		url = "/api/trade"
		method = "post"
		data = inData;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);

	}
	// 매출 데이터 insert 
	for (let i = 0; i < storage.reportDetailData.related.outItems.length; i++) {
		let product;
		for (let i = 0; i < storage.productList.length; i++) {
			if (storage.productList[i].no == storage.reportDetailData.related.inItems[0].inProduct) {
				product = storage.productList[i].product;
			}
		}
		let outData = {
			"belongTo": "sopp:" + storage.reportDetailData.sopp + "",
			"writer": storage.my,
			"type": "sale", // 매입인지 매출인지 
			"product": storage.reportDetailData.related.outItems[0].outProduct, // 상품번호
			"customer": storage.reportDetailData.related.outItems[0].outCus * 1,
			"title": "",
			"qty": storage.reportDetailData.related.outItems[0].outQuantity,//수량
			"price": storage.reportDetailData.related.outItems[0].outPrice, // 단가
			"vat": storage.reportDetailData.related.outItems[0].tax,// 부가세액
		}



		console.log(outData);
		url = "/api/trade"
		method = "post"
		data = outData;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, contractSuccessInsert, contractErrorInsert);

	}


}



//해당된 번호의 soppdetail 가져옴 
function getSoppData() {

	let soppNo = storage.estmVerList[storage.estmVerList.length - 1].related.parent.split(":")[1] * 1;
	$.ajax({
		"url": "/api/sopp/" + soppNo,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list, x;
			if (data.result === "ok") {
				list = data.data;
				list = cipher.decAes(list);
				list = JSON.parse(list);
				storage.soppDetail = list;
				setSalesReportData();
			} else {
				console.log(data.msg);
			}
		}
	})
}

// 항목 리스트 가져옴 
function getProductList() {
	let url;
	url = apiServer + "/api/estimate/item"

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
				storage.productList = list;

			} else {
				console.log(data.msg);
			}
		}
	});
} // End of getEstimateList()





function setMaintenanceTab(maintanence) {

	$(".tabItem").css("width", "20%");



	let index = 10;
	let leftPadding = 0;
	for (let i = 0; i < $(".tabItem").length; i++) {
		let tt = $(".tabItem")[i];
		$(tt).css("z-index", index);
		$(tt).css("padding-left", leftPadding + "%");
		leftPadding += 20;
		index = (index - 2);
	}

	// let tabsHtml = $(".tabs").html();
	// let detailSecondTabsHtml = $(".detailSecondTabs").html();
	$(".tabs").append("<input type='radio' id='tabMaintenance' name='tabItem' data-content-id='tabMaintenanceList' onclick='tabItemClick(this)'><label class='tabItem' for='tabMaintenance' style='z-index: 2; width: 20%; padding-left: 80%;'>유지보수 내역(0)</label>");
	$(".detailSecondTabs").append("<div class='tabMaintenanceList' id='tabMaintenanceList' style='display: none;'><div class='gridHeader grid_default_header_item'><div class='gridHeaderItem grid_default_text_align_center'>유지보수 기간</div><div class='gridHeaderItem grid_default_text_align_center'>제목</div><div class='gridHeaderItem grid_default_text_align_center'>고객사</div><div class='gridHeaderItem grid_default_text_align_center'>항목</div><div class='gridHeaderItem grid_default_text_align_center'>담당자</div></div></div>");
	let maintenanceData = "";
	let startDate, endDate, title, customer, product, engineer;
	$(".tabItem")[4].innerHTML = "유지보수 내역(" + maintanence.length + ")";
	for (let i = 0; i < maintanence.length; i++) {
		startDate = (maintanence[i].startDate == null || maintanence[i].startDate == undefined) ? "" : getYmd(maintanence[i].startDate);
		endDate = (maintanence[i].endDate == null || maintanence[i].endDate == undefined) ? "" : getYmd(maintanence[i].endDate);
		title = (maintanence[i].title == null || maintanence[i].title == undefined) ? "" : maintanence[i].title;
		customer = (maintanence[i].customer == null || maintanence[i].customer == undefined || maintanence[i].customer == 0) ? "" : storage.customer[maintanence[i].customer].name;
		product = (maintanence[i].product == null || maintanence[i].product == undefined || maintanence[i].product == "") ? "" : maintanence[i].prodcut;
		for (let i = 0; i < storage.product.length; i++) {
			if (storage.product[i].no == product) {
				prodcut = storage.product[i].name;
			}
		}
		engineer = (maintanence[i].engineer == null || maintanence[i].engineer == undefined) ? "" : storage.user[maintanence[i].engineer].userName;





		maintenanceData += "<div id='tabMaintenanceList_" + i + "' class='gridContent grid_default_body_item' data-drag='true' data-id='' data-job='' onclick=''>" +
			"<div class='gridContentItem grid_default_text_align_center'><span class='textNumberFormat'>" + startDate + "  ~  " + endDate + "</span></div>" +
			"<div class='gridContentItem grid_default_text_align_left'><span class='textNumberFormat'></span></div>" +
			"<div class='gridContentItem grid_default_text_align_center'><span class='textNumberFormat'>" + customer + "</span></div>" +
			"<div class='gridContentItem grid_default_text_align_center'><span class='textNumberFormat'>" + product + "</span></div>" +
			"<div class='gridContentItem grid_default_text_align_center'><span class='textNumberFormat'>" + engineer + "</span></div></div>"
	}
	$(".tabMaintenanceList").append(maintenanceData);


}


function getYmd(date) {
	let d = new Date(date);
	return (
		(d.getFullYear() % 100) +
		"-" +
		(d.getMonth() + 1 > 9
			? (d.getMonth() + 1).toString()
			: "0" + (d.getMonth() + 1)) +
		"-" +
		(d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
	);
}











// //////////////////////////////기존 데이터 테이블 바꾸기 //////////////////////////
let count = 0;

function mtncArrSet() {
	let cnt = storage.contract;


	let contNo = cnt[count].no;
	$.ajax({
		url: "/api/system/maintanence/" + contNo,
		method: "get",
		dataType: "json",
		cache: false,
		contentType: "text/plain",
		success: (result) => {
			if (result.data != "ok") {
				count++;
				if (count < storage.contract.length) {

					mtncArrSet();
				}

			} else {
				count++;
				if (count < storage.contract.length) {

					mtncArrSet();
				}
			}

		}
	});


}




class Contracts {
	// 생성자 
	constructor(_server) {
		this.list = [];
		fetch(_server + "/api/contract/fullContract")
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, arr, x;
				if (response.result !== "ok") console.log(response.msg);
				else {
					data = cipher.decAes(response.data);
					storage.datas = data;
					arr = JSON.parse(data);
					for (x = 0; x < arr.length; x++) {
						R.contract.addContract(new Contract(arr[x]));
					} 
				}
			});
	}



	addContract(ctr) {this.list.push(ctr);
	}
}


class Contract {
	constructor(each) {
		this.employee = each.employee == undefined ? null : each.employee;
		this.coWorker = each.coWorker == undefined ? null : each.coWorker;
		this.customer = each.customer == undefined ? null : each.customer;
		this.cipOfCustomer = each.cipOfCustomer == undefined ? null : each.cipOfCustomer;
		this.detail = each.detail == undefined ? null : each.detail;
		this.endUser = each.endUser == undefined ? null : each.endUser;
		this.cipOfendUser = each.cipOfendUser == undefined ? null : each.cipOfendUser;
		this.supplier = each.supplier == undefined ? null : each.supplier;
		this.cipOfSupplier = each.cipOfSupplier == undefined ? null : each.cipOfSupplie;
		this.supplied = each.supplied == undefined ? null : each.supplied;
		this.delivered = each.delivered == undefined ? null : each.delivered;
		this.taxInclude = each.taxInclude == undefined ? null : each.taxInclude;
		this.profit = each.profit == undefined ? null : each.profit;
	}
}





