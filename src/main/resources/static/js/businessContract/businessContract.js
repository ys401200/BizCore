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
					contractInsertForm();
					getEstimateData();
				} else {
					alert("문서 정보를 가져오는 데 실패했습니다");
				}
			},
		});
	}









}

function drawContractList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput;

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

	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	listSearchInput = $(".listSearchInput");
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridList");

	header = [
		{
			"title": "등록일",
			"align": "center",
		},
		{
			"title": "유지보수일자",
			"align": "center",
		},
		{
			"title": "계약명",
			"align": "left",
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
			"align": "right",
		},
		{
			"title": "매출이익",
			"align": "right",
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

			salesType = (jsonData[i].salesType === null || jsonData[i].salesType === "") ? "" : storage.code.etc[jsonData[i].salesType];
			contractType = (jsonData[i].contractType === null || jsonData[i].contractType === "") ? "" : storage.code.etc[jsonData[i].contractType];
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
				},
				{
					"setData": startMaintenance + " ~ " + endMaintenance,
				},
				{
					"setData": title,
				},
				{
					"setData": employee,
				},
				{
					"setData": salesType,
				},
				{
					"setData": contractType,
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

	containerTitle.html("계약조회");
	$(pageContainer).children().show();
	detailBackBtn.hide();
	listSearchInput.show();
	createGrid(container, header, data, ids, job, fnc);

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
	let notIdArray, datas, sopp, html, htmlSecond, contractType, title, employee, customer, salesType, cipOfCustomer, endUser, cipOfendUser, saleDate, delivered, employee2, startOfFreeMaintenance, endOfFreeMaintenance, startOfPaidMaintenance, endOfPaidMaintenance, contractAmount, taxInclude, profit, detail, disDate, dataArray, gridList, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange, pageContainer, crudAddBtn, crudUpdateBtn, crudDeleteBtn;
	detailSetFormList(result);
	gridList = $(".gridList");
	searchContainer = $(".searchContainer");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	listSearchInput = $(".listSearchInput");
	detailSecondTabs = $(".detailSecondTabs");
	listRange = $(".listRange");
	pageContainer = $(".pageContainer");
	crudAddBtn = $(".crudAddBtn");
	crudUpdateBtn = $(".crudUpdateBtn");
	crudDeleteBtn = $(".crudDeleteBtn");
	datas = ["employee", "customer", "cipOfCustomer", "endUser", "cipOfendUser", "sopp", "employee2"];
	notIdArray = ["employee"];

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

	if (cipOfCustomer !== "") {
		cipOfCustomer = storage.cip[cipOfCustomer].name;
	}

	if (cipOfendUser !== "") {
		cipOfendUser = storage.cip[cipOfendUser].name;
	}


	if (sopp !== "") {
		for (let key in storage.sopp) {
			if (storage.sopp[key].no === result.sopp) {
				sopp = storage.sopp[key].title;
			}
		}
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
			"col": 4,
			"elementId": ["contractTypeNew", "contractTypeOld"],
			"onClick": "contractRadioClick(this);",
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
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "employee",
			"value": employee,
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
			"title": "(부)담당자",
			"elementId": "employee2",
			"value": employee2,
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
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
			"title": "무상 시작일",
			"elementId": "startOfFreeMaintenance",
			"value": startOfFreeMaintenance,
			"type": "date",
		},
		{
			"title": "무상 종료일",
			"elementId": "endOfFreeMaintenance",
			"value": endOfFreeMaintenance,
			"type": "date",
		},
		{
			"title": "유상 시작일",
			"elementId": "startOfPaidMaintenance",
			"value": startOfPaidMaintenance,
			"type": "date",
		},
		{
			"title": "유상 종료일",
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
			"title": "",
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

	pageContainer.hide();
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
	detailSecondTabs.show();
	containerTitle.html(title);
	gridList.html("");
	searchContainer.hide();
	gridList.html(html);
	setTabsLayOutMenu();
	crudAddBtn.hide();

	if (storage.my == result.employee) {
		crudUpdateBtn.attr("onclick", "enableDisabled(this, \"contractUpdate();\", \"" + notIdArray + "\");");
		crudUpdateBtn.css("display", "flex");
		crudDeleteBtn.css("display", "flex");
	}

	storage.attachedList = result.attached;
	storage.attachedNo = result.no;
	storage.attachedType = "contract";
	storage.attachedFlag = true;

	createTabTradeList(result.trades);
	createTabFileList();
	createTabTechList(result.schedules);
	createTabSalesList(result.schedules);
	detailTabHide("tabTradeList");
	gridList.show();
	detailTrueDatas(datas);
	$(".detailContents").show();

	setTimeout(() => {
		$("[name='contractType'][value='" + result.contractType + "']").prop("checked", true);
		$("#salesType option[value='" + result.salesType + "']").prop("selected", true);
		$("#taxInclude option[value='" + taxInclude + "']").prop("selected", true);
		detailBackBtn.css("display", "flex");
		listSearchInput.hide();
		listRange.hide();

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

		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);
}

function contractErrorView() {
	msg.set("에러");
}

function contractInsertForm() {
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
			"col": 4,
			"elementId": ["contractTypeNew", "contractTypeOld"],
			"elementName": "contractType",
			"disabled": false,
			"onClick": "contractRadioClick(this);",
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
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "employee",
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
			"title": "(부)담당자",
			"elementId": "employee2",
			"disabled": false,
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "무상 시작일",
			"elementId": "startOfFreeMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "무상 종료일",
			"elementId": "endOfFreeMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "유상 시작일",
			"elementId": "startOfPaidMaintenance",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "유상 종료일",
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
	} else if ($("#employee").val() === "") {
		msg.set("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	} else if ($("#customer").val() === "") {
		msg.set("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#endUser").val() === "") {
		msg.set("엔드유저를 입력해주세요.");
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
	} else if ($("#employee").val() === "") {
		msg.set("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	} else if ($("#customer").val() === "") {
		msg.set("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	} else if ($("#endUser").val() === "") {
		msg.set("엔드유저를 입력해주세요.");
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
	let customer, salesType, endUser, contTitle, contType;
	related = storage.reportDetailData.related;

	// 영업기회 
	contractAmount = related.outSumAllTotal;
	contractAmount = Number(contractAmount.split("원")[0]);
	profit = related.profit;
	profit = Number(profit.split("원")[0])

	soppNo = storage.estmVerList[storage.estmVerList.length - 1].related.parent.split(":")[1];

	for (let i = 0; i < storage.sopp.length; i++) {
		if (storage.sopp[i].no == soppNo) {
			soppData = storage.sopp[i];
		}
	}
	customer = soppData.customer;
	endUser = soppData.endUser;
	salesType = soppData.soppType;
	contTitle = soppData.title;
	contType = soppData.contType;



	$("#sopp").val(contTitle);
	$("#sopp").attr("disabled", "disabled");
	$("#salesType").val(salesType);
	$("#customer").val(storage.customer[customer].name);
	$("#customer").attr("disabled", "disabled");
	$("#endUser").val(storage.customer[endUser].name);
	$("#endUser").attr("disabled", "disabled");
	$("#contractAmount").val(contractAmount);
	$("#profit").val(profit);
	if ($("input[name=contractType]")[0].value == contType) {
		$("input[name=contractType]")[0].checked = "checked"
	} else {
		$("input[name=contractType]")[1].checked = "checked";
	}

}


function setFormListDefaultData() {
	let soppData, soppNo;

	soppNo = storage.reportDetailData.sopp;


	for (let i = 0; i < storage.sopp.length; i++) {
		if (storage.sopp[i].no == soppNo) {
			soppData = storage.sopp[i];
		}
	}



	customer = soppData.customer;
	endUser = soppData.endUser;
	soppNo = soppData.no;

	storage.formList.customer = customer;
	storage.formList.endUser = endUser;
	storage.formList.sopp = soppNo;
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