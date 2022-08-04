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
	let html, title, userName, customer, customerUser, endUser, status, progress, contType, soppType, disDate, expectedSales, detail, dataArray;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	userName = (result.employee == 0 || result.employee === null) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	customerUser = (result.picOfCustomer == 0 || result.picOfCustomer === null) ? "데이터 없음" : storage.user[result.picOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.customer[result.endUser].name;
	status = (result.status === null || result.status === "") ? "데이터 없음" : storage.code.etc[result.status];
	progress = (result.progress === null || result.progress === "") ? "데이터 없음" : result.progress + "%";
	contType = (result.contType === null || result.contType === "") ? "데이터 없음" : storage.code.etc[result.contType];
	soppType = (result.soppType === null || result.soppType === "") ? "데이터 없음" : storage.code.etc[result.soppType];
	expectedSales = (result.expectedSales === null || result.expectedSales === "") ? "데이터 없음" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "영업기회명",
			"value": title,
		},
		{
			"title": "담당자",
			"value": userName,
			"dataKeyup": "user",
		},
		{
			"title": "매출처",
			"value": customer,
			"dataKeyup": "customer",
		},
		{
			"title": "매출처 담당자",
			"value": customerUser,
			"dataKeyup": "user",
		},
		{
			"title": "엔드유저",
			"value": endUser,
			"dataKeyup": "customer",
		},
		{
			"title": "진행단계",
			"value": status,
		},
		{
			"title": "가능성",
			"value": progress,
		},
		{
			"title": "계약구분",
			"value": contType,
		},
		{
			"title": "매출예정일",
			"value": targetDate,
		},
		{
			"title": "판매방식",
			"value": soppType,
		},
		{
			"title": "예상매출",
			"value": expectedSales,
			"keyup": "inputNumberFormat(this)",
		},
		{
			"title": "내용",
			"value": detail,
			"type": "textarea",
		},
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("상세보기");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("수정");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "soppUpdateForm(" + result.no + ");");
	
	setTimeout(() => {
		tinymce.activeEditor.mode.set("readonly");
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
			"disabled": false,
		},
		{
			"title": "담당자",
			"dataKeyup": "user",
			"disabled": false,
		},
		{
			"title": "매출처",
			"dataKeyup": "customer",
			"disabled": false,
		},
		{
			"title": "매출처 담당자",
			"dataKeyup": "user",
			"disabled": false,
		},
		{
			"title": "엔드유저",
			"dataKeyup": "customer",
			"disabled": false,
		},
		{
			"title": "진행단계",
			"disabled": false,
		},
		{
			"title": "가능성",
			"disabled": false,
		},
		{
			"title": "계약구분",
			"disabled": false,
		},
		{
			"title": "매출예정일",
			"disabled": false,
		},
		{
			"title": "판매방식",
			"disabled": false,
		},
		{
			"title": "예상매출",
			"disabled": false,
			"keyup": "inputNumberFormat(this)",
		},
		{
			"title": "내용",
			"type": "textarea",
		},
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("영업기회등록");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "soppInsert();");
}

function soppUpdateForm(no){
	let defaultFormContainer;

	defaultFormContainer = $(document).find(".defaultFormContainer");

	defaultFormContainer.find("input").prop("disabled", false);
	tinymce.activeEditor.mode.set("design");

	modal.confirm.text("수정완료");
	modal.close.text("삭제");
	modal.confirm.attr("onclick", "soppUpdate(" + no + ")");
	modal.close.attr("onclick", "soppDelete(" + no + ")");
}

function soppInsert(){
	location.reload();
}


function soppUpdate(){
	location.reload();
}

function soppDelete(){
	location.reload();
}