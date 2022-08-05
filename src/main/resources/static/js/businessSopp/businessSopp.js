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

function soppSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/sopp";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#soppSearchCategory").val();
	searchText = $(document).find("#soppSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, soppSuccessList, soppErrorList);
}

function drawSoppList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.soppList === undefined) {
		msg.set("등록된 영업기회가 없습니다");
	}
	else {
		jsonData = storage.soppList;
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

		soppType = (jsonData[i].soppType === null || jsonData[i].soppType === "") ? "없음" : storage.code.etc[jsonData[i].soppType];
		contType = (jsonData[i].contType === null || jsonData[i].contType === "") ? "없음" : storage.code.etc[jsonData[i].contType];
		title = (jsonData[i].title === null || jsonData[i].title === "") ? "제목 없음" : jsonData[i].title;
		customer = (jsonData[i].customer === null || jsonData[i].customer == 0) ? "없음" : storage.customer[jsonData[i].customer].name;
		endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "없음" : storage.customer[jsonData[i].endUser].name;
		employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "없음" : storage.user[jsonData[i].employee].userName;
		expectedSales = (jsonData[i].expectedSales === null || jsonData[i].expectedSales == 0) ? 0 : numberFormat(jsonData[i].expectedSales);
		status = (jsonData[i].status === null || jsonData[i].status === "") ? "없음" : storage.code.etc[jsonData[i].status];
 
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
	createGrid(container, header, data, ids, fnc);
}

function soppDetailView(e){
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/sopp/" + id;
	method = "get";
	data = "";
	type = "detail";

	crud.defaultAjax(url, method, data, type, soppSuccessView, soppErrorView);
}

function soppSuccessList(result){
	storage.soppList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawSoppList, 600);
	}
}

function soppErrorList(){
	alert("에러");
}

function soppSuccessView(result){
	let html, title, userName, customer, customerUser, endUser, progress, disDate, expectedSales, detail, dataArray;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	userName = (result.employee == 0 || result.employee === null) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	customerUser = (result.picOfCustomer == 0 || result.picOfCustomer === null) ? "데이터 없음" : storage.user[result.picOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.customer[result.endUser].name;
	progress = (result.progress === null || result.progress === "") ? "데이터 없음" : result.progress + "%";
	expectedSales = (result.expectedSales === null || result.expectedSales === "") ? "데이터 없음" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "영업기회",
			"elementId": "title",
			"value": title,
		},
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
			"dataKeyup": "user",
			"elementId": "picOfCustomer",
			"value": customerUser,
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
			"value": expectedSales,
			"elementId": "expectedSales",
			"keyup": "inputNumberFormat(this)",
		},
		{
			"title": "내용",
			"elementId": "detail",
			"value": detail,
			"type": "textarea",
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
	modal.confirm.attr("onclick", "soppUpdateForm(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");
	
	setTimeout(() => {
		tinymce.activeEditor.mode.set("readonly");
		$(document).find("#status option[value='" + result.status + "']").prop("selected" ,true);
		$(document).find("#contType option[value='" + result.contType + "']").prop("selected" ,true);
		$(document).find("#soppType option[value='" + result.soppType + "']").prop("selected" ,true);
	}, 300);
}

function soppErrorView(){
	alert("에러");
}

function soppInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "영업기회",
			"elementId": "title",
			"disabled": false,
		},
		{
			"title": "담당자",
			"elementId": "employee",
			"dataKeyup": "user",
			"disabled": false,
		},
		{
			"title": "매출처",
			"elementId": "customer",
			"dataKeyup": "customer",
			"disabled": false,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "user",
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
			"title": "내용",
			"elementId": "detail",
			"type": "textarea",
		},
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("영업기회등록");
	modal.content.css("width", "1200px");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "soppInsert();");
	modal.close.attr("onclick", "modal.hide();");
}

function soppUpdateForm(no){
	let defaultFormContainer;

	defaultFormContainer = $(document).find(".defaultFormContainer");

	defaultFormContainer.find("input, select").prop("disabled", false);
	tinymce.activeEditor.mode.set("design");

	modal.confirm.text("수정완료");
	modal.close.text("삭제");
	modal.confirm.attr("onclick", "soppUpdate(" + no + ")");
	modal.close.attr("onclick", "soppDelete(" + no + ")");
}

function soppInsert(){
	let title, employee, customer, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales, detail;

	title = $(document).find("#title").val();
	employee = $(document).find("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	picOfCustomer = $(document).find("#picOfCustomer");
	picOfCustomer = dataListFormat(picOfCustomer.attr("id"), picOfCustomer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	status = $(document).find("#status").val();
	progress = $(document).find("#progress").val();
	contType = $(document).find("#contType").val();
	targetDate = $(document).find("#targetDate").val();
	targetDate = new Date(targetDate).getTime();
	soppType = $(document).find("#soppType").val();
	expectedSales = $(document).find("#expectedSales").val().replaceAll(",", "");
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

function soppUpdate(no){
	let title, employee, customer, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales, detail;

	title = $(document).find("#title").val();
	employee = $(document).find("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	picOfCustomer = $(document).find("#picOfCustomer");
	picOfCustomer = dataListFormat(picOfCustomer.attr("id"), picOfCustomer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	status = $(document).find("#status").val();
	progress = $(document).find("#progress").val();
	contType = $(document).find("#contType").val();
	targetDate = $(document).find("#targetDate").val();
	targetDate = new Date(targetDate).getTime();
	soppType = $(document).find("#soppType").val();
	expectedSales = $(document).find("#expectedSales").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/sopp/" + no;
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
		data = "";
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