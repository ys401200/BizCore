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

	url = "/api/sales";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, salesSuccessList, salesErrorList);
}

function salesSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/sales";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#salesSearchCategory").val();
	searchText = $(document).find("#salesSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, salesSuccessList, salesErrorList);
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
		endUser = (jsonData[i].endUser == 0 || jsonData[i].endUser === null) ? "없음" : storage.customer[jsonData[i].endUser].name;

		if(jsonData[i].sopp > 0){
			$.ajax({
				url: "/api/sopp/" + jsonData[i].sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(soppData) => {
					let resultJson;
					resultJson = cipher.decAes(soppData.data);
					resultJson = JSON.parse(resultJson);
			
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
							"setData": resultJson.title,
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
				}
			});
		}else{
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
					"setData": "데이터 없음",
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
			
		}
		
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
	}else{
		window.setTimeout(drawSalesList, 200);
	}
}

function salesErrorList(){
	alert("에러");
}

function salesDetailView(e){
	let id, url, method, data, type;
	contentTopBtn("bodyContent");

	id = $(e).data("id");
	url = "/api/sales/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, salesSuccessView, salesErrorView);
} 

function salesSuccessView(result){
	let html, disDate, from, place, type, userName, customer, endUser, title, detail, dataArray;

	place = (result.place === null || result.place === "") ? "" : result.place;
	type = (result.type === null || result.type === "") ? "데이터 없음" : storage.code.etc[result.type];
	userName = (result.user == 0 || result.user === null) ? "" : storage.user[result.user].userName;
	customer = (result.customer == 0 || result.customer === null) ? "" : storage.customer[result.customer].name;
	endUser = (result.endUser == 0 || result.endUser === null) ? "" : storage.user[result.endUser].userName;
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
			"dataKeyup": "user",
		},
		{
			"title": "영업기회",
			"value": result.sales,
		},
		{
			"title": "매출처",
			"value": customer,
			"dataKeyup": "customer",
		},
		{
			"title": "엔드유저",
			"value": endUser,
			"dataKeyup": "customer",
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
			"title": "활동시작일",
			"elementId": "from",
			"type": "date",
			"disabled": false,
		},
		{
			"title": "활동종료일",
			"elementId": "to",
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
			"title": "담당자",
			"disabled": false,
			"elementId": "user",
			"dataKeyup": "user",
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
			"elementId": "endUser",
			"dataKeyup": "customer",
		},
		{
			"title": "제목",
			"elementId": "title",
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
	let from, to, place, salesType, user, sopp, customer, endUser, title, detail, url, method, data, type;

	from = $(document).find("#from").val();
	from = new Date(from).getTime();
	to = $(document).find("#to").val();
	to = new Date(to).getTime();
	place = $(document).find("#place").val();
	salesType = $(document).find("#type").val();
	user = $(document).find("#user");
	user = dataListFormat(user.attr("id"), user.val());
	sopp = $(document).find("#sopp");
	sopp = dataListFormat(sopp.attr("id"), sopp.val());
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	title = $(document).find("#title").val();
	detail = tinymce.activeEditor.getContent();

	url = "/api/sales";
	method = "post";
	data = {
		"from": from,
		"to": to,
		"place": place,
		"type": salesType,
		"user": user,
		"sopp": sopp,
		"customer": customer,
		"endUser": endUser,
		"title": title,
		"detail": detail,
	}
	type = "insert";

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

function salesUpdate(no){
	let from, to, place, salesType, user, sopp, customer, endUser, title, detail, url, method, data, type;

	from = $(document).find("#from").val();
	from = new Date(from).getTime();
	to = $(document).find("#to").val();
	to = new Date(to).getTime();
	place = $(document).find("#place").val();
	salesType = $(document).find("#type").val();
	user = $(document).find("#user");
	user = dataListFormat(user.attr("id"), user.val());
	sopp = $(document).find("#sopp");
	sopp = dataListFormat(sopp.attr("id"), sopp.val());
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	title = $(document).find("#title").val();
	detail = tinymce.activeEditor.getContent();

	url = "/api/sales/" + no;
	method = "put";
	data = {
		"from": from,
		"to": to,
		"place": place,
		"type": salesType,
		"user": user,
		"sopp": sopp,
		"customer": customer,
		"endUser": endUser,
		"title": title,
		"detail": detail,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, salesSuccessUpdate, salesErrorUpdate);
}

function salesSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function salesErrorUpdate(){
	alert("수정에러");
}

function salesDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/sales/" + no;
		method = "delete";
		data = "";
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
	alert("삭제에러");
}