$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSoppList();
});

function getSoppList() {
	let url, method, data, type;

	url = "/api/sopp";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, soppSuccessList, soppErrorList);
}

function drawSoppList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.soppList === undefined) {
		msg.set("등록된 영업기회가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.soppList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridSoppList");

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
			"title" : "계약구분",
			"align" : "center",
		},
		{
			"title" : "영업기회명",
			"align" : "left",
		},
		{
			"title" : "매출처",
			"align" : "center",
		},
		{
			"title" : "엔드유저",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "예상매출액",
			"align" : "right",
		},
		{
			"title" : "진행단계",
			"align" : "center",
		},
        {
			"title" : "등록일",
			"align" : "center",
		}
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let soppType, contType, title, customer, endUser, employee, expectedSales, status;
		
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		soppType = (jsonData[i].soppType === null || jsonData[i].soppType === "") ? "" : storage.code.etc[jsonData[i].soppType];
		contType = (jsonData[i].contType === null || jsonData[i].contType === "") ? "" : storage.code.etc[jsonData[i].contType];
		title = (jsonData[i].title === null || jsonData[i].title === "") ? "" : jsonData[i].title;
		customer = (jsonData[i].customer === null || jsonData[i].customer == 0) ? "" : storage.customer[jsonData[i].customer].name;
		endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "" : storage.customer[jsonData[i].endUser].name;
		employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "" : storage.user[jsonData[i].employee].userName;
		expectedSales = (jsonData[i].expectedSales === null || jsonData[i].expectedSales == 0) ? 0 : numberFormat(jsonData[i].expectedSales);
		status = (jsonData[i].status === null || jsonData[i].status === "") ? "" : storage.code.etc[jsonData[i].status];
  
		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": soppType,
			},
			{
				"setData": contType,
			},
			{
				"setData": title,
			},
			{
				"setData": customer,
			},
			{
				"setData": endUser,
			},
			{
				"setData": employee,
			},
			{
				"setData": expectedSales,
			},
			{
				"setData": status,
			},
			{
				"setData": setDate,
			}
		];

		fnc = "soppDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSoppList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "soppInsertForm();"
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

	if(path[3] !== undefined){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		soppDetailView(content);
	}

	plusMenuSelect(menu);
}

function soppDetailView(e){
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/sopp/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, soppSuccessView, soppErrorView);
}

function soppSuccessList(result){
	storage.soppList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawSoppList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawSoppList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function soppErrorList(){
	alert("에러");
}

function soppSuccessView(result){
	let html, title, userName, customer, picOfCustomer, endUser, status, progress, contType, disDate, expectedSales, detail, dataArray;
	$(".searchContainer").hide();

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	userName = (result.employee == 0 || result.employee === null || result.employee === undefined) ? "" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
	picOfCustomer = (result.picOfCustomer == 0 || result.picOfCustomer === null || result.picOfCustomer === undefined) ? "" : result.picOfCustomer;
	endUser = (result.endUser == 0 || result.endUser === null || result.endUser === undefined) ? "" : storage.customer[result.endUser].name;
	status = (result.status === null || result.status === "" || result.status === undefined) ? "" : storage.code.etc[result.status];
	progress = (result.progress === null || result.progress === "" || result.progress === undefined) ? "" : result.progress + "%";
	contType = (result.contType === null || result.contType === "" || result.contType === undefined) ? "" : storage.code.etc[result.contType];
	soppType = (result.soppType === null || result.soppType === "" || result.soppType === undefined) ? "" : storage.code.etc[result.soppType];
	expectedSales = (result.expectedSales === null || result.expectedSales === "" || result.expectedSales === undefined) ? "" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "" || result.detail === undefined) ? "" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "담당자",
			"elementId": "employee",
			"dataKeyup": "user",
			"value": userName,
		},
		{
			"title": "매출처",
			"elementId": "customer",
			"dataKeyup": "customer",
			"value": customer,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "customerUser",
			"elementId": "picOfCustomer",
			"value": picOfCustomer,
		},
		{
			"title": "엔드유저",
			"dataKeyup": "customer",
			"elementId": "endUser",
			"value": endUser,
		},
		{
			"title": "진행단계",
			"selectValue": [
				{
					"key": "10178",
					"value": "영업정보파악",
				},
				{
					"key": "10179",
					"value": "초기접촉",
				},
				{
					"key": "10180",
					"value": "제안서제출 및 PT",
				},
				{
					"key": "10181",
					"value": "견적서제출",
				},
			],
			"type": "select",
			"elementId": "status",
		},
		{
			"title": "가능성",
			"elementId": "progress",
			"value": progress,
		},
		{
			"title": "계약구분",
			"selectValue": [
				{
					"key": "10247",
					"value": "판매계약",
				},
				{
					"key": "10248",
					"value": "유지보수",
				},
				{
					"key": "10254",
					"value": "임대계약",
				}
			],
			"type": "select",
			"elementId": "contType",
		},
		{
			"title": "매출예정일",
			"type": "date",
			"elementId": "targetDate",
			"value": targetDate,
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
				},
				{
					"key": "10218",
					"value": "간접판매",
				},
				{
					"key": "10255",
					"value": "기타",
				}
			],
			"type": "select",
			"elementId": "soppType",
		},
		{
			"title": "예상매출",
			"elementId": "expectedSales",
			"value": expectedSales,
			"keyup": "inputNumberFormat(this)",
		},
		{
			"title": "영업기회명",
			"elementId": "title",
			"value": title,
			"col": 3,
		},
		{
			"title": "내용",
			"elementId": "detail",
			"value": detail,
			"type": "textarea",
			"col": 3,
		},
	];

	html = "<div class='tabs'>";
	html += "<input type='radio' id='tabAll' name='tabItem' data-content-id='tabContentAll' onclick='tabItemClick(this)' checked>";
	html += "<label class='tabItem' for='tabAll'>기본정보</label>";
	html += "<input type='radio' id='tabTrade' name='tabItem' data-content-id='tabTradeList' onclick='tabItemClick(this)'>";
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
	conTitleChange("containerTitle", "<a href='#' onclick='detailViewContainerHide(\"영업기회조회\");'>뒤로가기</a>");
	$(".detailContents").html(html);
	notIdArray = ["employee"];
	
	storage.attachedList = result.attached;
	storage.attachedNo = result.no;
	storage.attachedType = "sopp";
	storage.attachedFlag = true;

	createTabFileList();
	createTabTechList(result.schedules);
	createTabSalesList(result.schedules);

	$(".detailContents").show();
	
	detailTabHide("tabContentAll");

	setTimeout(() => {
		$("#status option[value='" + result.status + "']").prop("selected" ,true);
		$("#contType option[value='" + result.contType + "']").prop("selected" ,true);
		$("#soppType option[value='" + result.soppType + "']").prop("selected" ,true);

		let menu = [
			{
				"keyword": "add",
				"onclick": "soppInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"soppUpdate();\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "soppDelete(" + result.no + ");"
			},
		];

		plusMenuSelect(menu);
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();
	}, 100);
}

function soppErrorView(){
	alert("에러");
}

function soppInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "employee",
			"dataKeyup": "user",
		},
		{
			"title": "매출처",
			"elementId": "customer",
			"dataKeyup": "customer",
			"disabled": false,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "customerUser",
			"elementId": "picOfCustomer",
			"disabled": false,
		},
		{
			"title": "엔드유저",
			"dataKeyup": "customer",
			"elementId": "endUser",
			"disabled": false,
		},
		{
			"title": "진행단계",
			"selectValue": [
				{
					"key": "10178",
					"value": "영업정보파악",
				},
				{
					"key": "10179",
					"value": "초기접촉",
				},
				{
					"key": "10180",
					"value": "제안서제출 및 PT",
				},
				{
					"key": "10181",
					"value": "견적서제출",
				},
			],
			"type": "select",
			"disabled": false,
			"elementId": "status",
		},
		{
			"title": "가능성",
			"elementId": "progress",
			"disabled": false,
		},
		{
			"title": "계약구분",
			"selectValue": [
				{
					"key": "10247",
					"value": "판매계약",
				},
				{
					"key": "10248",
					"value": "유지보수",
				},
				{
					"key": "10254",
					"value": "임대계약",
				}
			],
			"type": "select",
			"elementId": "contType",
			"disabled": false,
		},
		{
			"title": "매출예정일",
			"type": "date",
			"elementId": "targetDate",
			"disabled": false,
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
				},
				{
					"key": "10218",
					"value": "간접판매",
				},
				{
					"key": "10255",
					"value": "기타",
				}
			],
			"type": "select",
			"elementId": "soppType",
			"disabled": false,
		},
		{
			"title": "예상매출",
			"disabled": false,
			"elementId": "expectedSales",
			"keyup": "inputNumberFormat(this)",
		},
		{
			"title": "영업기회명",
			"elementId": "title",
			"disabled": false,
		},
		{
			"title": "내용",
			"elementId": "detail",
			"type": "textarea",
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("영업기회등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "soppInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my = storage.my, nowDate;
		nowDate = new Date();
		nowDate = nowDate.toISOString().substring(0, 10);

		$("#employee").val(storage.user[my].userName);
		$("#targetDate").val(nowDate);
	}, 100);
}

function soppInsert(){
	let title, employee, customer, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales, detail, data;

	title = $("#title").val();
	employee = $("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	customer = $("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	picOfCustomer = $("#picOfCustomer");
	picOfCustomer = dataListFormat(picOfCustomer.attr("id"), picOfCustomer.val());
	endUser = $("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	status = $("#status").val();
	progress = $("#progress").val();
	contType = $("#contType").val();
	targetDate = $("#targetDate").val();
	targetDate = new Date(targetDate).getTime();
	soppType = $("#soppType").val();
	expectedSales = $("#expectedSales").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/sopp";
	method = "post";
	data = {
		"title": title,
		"employee": employee,
		"customer": customer,
		"picOfCustomer": picOfCustomer,
		"endUser": endUser,
		"status": status,
		"progress": progress,
		"contType": contType,
		"targetDate": targetDate,
		"soppType": soppType,
		"expectedSales": expectedSales,
		"detail": detail,
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, soppSuccessInsert, soppErrorInsert);
}

function soppSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function soppErrorInsert(){
	alert("등록에러");
}

function soppUpdate(){
	let title, employee, customer, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales, detail;

	title = $("#title").val();
	employee = $("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	customer = $("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	picOfCustomer = $("#picOfCustomer");
	picOfCustomer = dataListFormat(picOfCustomer.attr("id"), picOfCustomer.val());
	endUser = $("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	status = $("#status").val();
	progress = $("#progress").val().replaceAll("%", "");
	contType = $("#contType").val();
	targetDate = $("#targetDate").val();
	targetDate = new Date(targetDate).getTime();
	soppType = $("#soppType").val();
	expectedSales = $("#expectedSales").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/sopp/" + storage.attachedNo;
	method = "put";
	data = {
		"title": title,
		"employee": employee,
		"customer": customer,
		"picOfCustomer": picOfCustomer,
		"endUser": endUser,
		"status": status,
		"progress": progress,
		"contType": contType,
		"targetDate": targetDate,
		"soppType": soppType,
		"expectedSales": expectedSales,
		"detail": detail,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, soppSuccessUpdate, soppErrorUpdate);
}

function soppSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function soppErrorUpdate(){
	alert("수정에러");
}

function soppDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/sopp/" + no;
		method = "delete";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, soppSuccessDelete, soppErrorDelete);
	}else{
		return false;
	}
}

function soppSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function soppErrorDelete(){
	alert("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.soppList, searchAllInput, "input");
	drawSoppList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.soppList.length; i++){
		let no, soppType, contType, title, customer, endUser, employee, expectedSales, status, disDate, setDate;
		no = storage.soppList[i].no;
		soppType = storage.code.etc[storage.soppList[i].soppType];
		contType = storage.code.etc[storage.soppList[i].contType];
		title = storage.soppList[i].title;
		customer = (storage.soppList[i].customer === null || storage.soppList[i].customer == 0) ? "" : storage.customer[storage.soppList[i].customer].name;
		endUser = (storage.soppList[i].endUser === null || storage.soppList[i].endUser == 0 || storage.soppList[i].endUser == 104571) ? "" : storage.customer[storage.soppList[i].endUser].name;
		employee = (storage.soppList[i].employee === null || storage.soppList[i].employee == 0) ? "" : storage.user[storage.soppList[i].employee].userName;
		expectedSales = storage.soppList[i].expectedSales;
		status = storage.code.etc[storage.soppList[i].status];
		disDate = dateDis(storage.soppList[i].created, storage.soppList[i].modified);
		setDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + employee + "#" + customer + "#" + title + "#" + soppType + "#" + contType + "#" + status + "#" + endUser + "#" + expectedSales + "#created" + setDate);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchEmployee, searchCustomer, searchTitle, searchSoppType, searchContType, searchStatus, searchCreatedFrom;

	searchEmployee = $("#searchEmployee").val();
	searchCustomer = $("#searchCustomer").val();
	searchTitle = $("#searchTitle").val();
	searchSoppType = $("#searchSoppType").val();
	searchContType = $("#searchContType").val();
	searchStatus = $("#searchStatus").val();
	searchCreatedFrom = ($("#searchCreatedFrom").val() === "") ? "" : $("#searchCreatedFrom").val().replaceAll("-", "") + "#created" + $("#searchCreatedTo").val().replaceAll("-", "");
	
	let searchValues = [searchEmployee, searchCustomer, searchTitle, searchSoppType, searchContType, searchStatus, searchCreatedFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== ""){
			let tempArray = searchDataFilter(storage.soppList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.soppList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawSoppList();
}