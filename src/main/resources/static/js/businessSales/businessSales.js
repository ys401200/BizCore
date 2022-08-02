$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSalesList();
});

function getSalesList() {
	let url, method, data;

	url = "/api/sales";
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, salesSuccessList, salesErrorList);
}

function salesSearchList(){
	let searchCategory, searchText, url, method, data;

	url = "/api/sales";
	method = "get";
	data = "";

	searchCategory = $(document).find("#salesSearchCategory").val();
	searchText = $(document).find("#salesSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, salesSuccessList, salesErrorList);
}

function drawSalesList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.salesList === undefined) {
		msg.set("등록된 영업활동이 없습니다");
	}
	else {
		jsonData = storage.salesList;
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
			"title" : "영업활동명",
			"align" : "left",
		},
		{
			"title" : "영업활동(시작)",
			"align" : "center",
		},
		{
			"title" : "영업활동(끝)",
			"align" : "center",
		},
		{
			"title" : "영업기회명",
			"align" : "left",
		},
		{
			"title" : "담당자",
			"align" : "center",
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
			"title" : "등록일",
			"align" : "center",
		}
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let fromDate, toDate, fromSetDate, toSetDate, user, customer, endUser;

		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		fromDate = dateDis(jsonData[i].from);
		fromSetDate = dateFnc(fromDate);

		toDate = dateDis(jsonData[i].to);
		toSetDate = dateFnc(toDate);

		user = (jsonData[i].user == 0 || jsonData[i].user === null) ? "없음" : storage.user[jsonData[i].user].userName;
		customer = (jsonData[i].customer == 0 || jsonData[i].customer === null) ? "없음" : storage.customer[jsonData[i].customer].name;
		endUser = (jsonData[i].endUser == 0 || jsonData[i].endUser === null) ? "없음" : storage.user[jsonData[i].endUser].userName;

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": fromSetDate,
			},
			{
				"setData": toSetDate,
			},
			{
				"setData": jsonData[i].sales,
			},
			{
				"setData": user,
			},
			{
				"setData": customer,
			},
			{
				"setData": endUser,
			},
			{
				"setData": setDate,
			}
		];

		fnc = "salesDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSalesList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()

function salesSuccessList(result){
	storage.salesList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawSalesList, 600);
	}
}

function salesErrorList(){
	alert("에러");
}

function salesDetailView(e){
	let id, url, method, data;

	id = $(e).data("id");
	url = "/api/sales/" + id;
	method = "get";

	crud.defaultAjax(url, method, data, salesSuccessView, salesErrorView);
}

function salesSuccessView(result){
	let html, disDate, from, place, type, userName, customer, endUser, title, detail, dataArray;

	place = (result.place === null || result.place === "") ? "데이터 없음" : result.place;
	type = (result.type === null || result.type === "") ? "데이터 없음" : storage.code.etc[result.type];
	userName = (result.user == 0 || result.user === null) ? "데이터 없음" : storage.user[result.user].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.user[result.endUser].userName;
	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;

	disDate = dateDis(result.from);
	from = dateFnc(disDate);

	dataArray = [
		{
			"title": "활동일",
			"value": from,
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
			"value": userName,
		},
		{
			"title": "영업기회",
			"value": result.sales,
		},
		{
			"title": "매출처",
			"value": customer,
		},
		{
			"title": "엔드유저",
			"value": endUser,
		},
		{
			"title": "제목",
			"value": title,
		},
		{
			"title": "내용",
			"value": detail,
			"type": "textarea",
		}
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("상세보기");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("수정");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "salesUpdateForm(" + result.no + ");");

	setTimeout(() => {
		tinymce.activeEditor.mode.set("readonly");
	}, 300);
}

function salesErrorView(){
	alert("에러");
}

function salesInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "활동일",
			"disabled": false,
		},
		{
			"title": "장소",
			"disabled": false,
		},
		{
			"title": "활동형태",
			"disabled": false,
		},
		{
			"title": "담당자",
			"disabled": false,
		},
		{
			"title": "영업기회",
			"disabled": false,
		},
		{
			"title": "매출처",
			"disabled": false,
		},
		{
			"title": "엔드유저",
			"disabled": false,
		},
		{
			"title": "제목",
			"disabled": false,
		},
		{
			"title": "내용",
			"type": "textarea",
		}
	];

	html = createCrudForm(dataArray);

	modal.show();
	modal.headTitle.text("영업활동등록");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "salesInsert();");
}

function salesUpdateForm(no){
	let defaultFormContainer;

	defaultFormContainer = $(document).find(".defaultFormContainer");

	defaultFormContainer.find("input").prop("disabled", false);
	tinymce.activeEditor.mode.set("design");

	modal.confirm.text("수정완료");
	modal.close.text("삭제");
	modal.confirm.attr("onclick", "salesUpdate(" + no + ")");
	modal.close.attr("onclick", "salesDelete(" + no + ")");
}

function salesInsert(){
	location.reload();
}

function salesUpdate(){
	location.reload();
}

function salesDelete(){
	location.reload();
}