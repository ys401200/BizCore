$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getCustomerList();
});

// API 서버에서 공지사항 리스트를 가져오는 함수
function getCustomerList() {
	let url, method, data, type; 
	url = "/api/system/customer";
	method ="get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, customerSuccessList, customerErrorList);
} // End of getCustomerList()

function drawCustomerList() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.customerList === undefined) {
		msg.set("등록된 거래처가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.customerList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridCustomerList");

	header = [
		{
			"title": "번호",
			"align": "center",
		},
		{
			"title": "제목",
			"align": "left",
		},
		{
			"title": "작성자",
			"align": "center",
		},
		{
			"title": "등록일",
			"align": "center",
		}
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		let userName = storage.user[jsonData[i].writer].userName;

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": userName,
			},
			{
				"setData": setDate,
			}
		]

		fnc = "customerDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawCustomerList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "customerInsertForm();"
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
		customerDetailView(content);
	}

	plusMenuSelect(menu); rr
}// End of drawCustomerList()

function customerDetailView(e) {// 선택한 그리드의 글 번호 받아오기 
	let id, url, method, data, type;
	storage.gridContent = $(e);

	id = $(e).data("id");
	url = "/api/customer/" + id;
	method = "get";
	data = "";
	type = "detail";

	crud.defaultAjax(url, method, data, type, customerSuccessView, customerErrorView);
} // End of customerDetailView()

function customerSuccessList(result){
	storage.customerList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawCustomerList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawCustomerList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function customerErrorList(){
	alert("에러");
}

function customerSuccessView(result){
	let html = "", title, content, writer, dataArray, disDate, setDate, notIdArray;
	storage.detailCustomerNo = result.no;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
	writer = (result.writer == 0 || result.writer === null || result.writer === undefined) ? "" : storage.user[result.writer].userName;
	disDate = dateDis(result.created, result.modified);
	setDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "작성자",
			"elementId": "writer",
			"dataKeyup": "user",
			"value": writer,
		},
		{
			"title": "등록일",
			"value": setDate,
			"elementId": "created",
			"type": "date",
		},
		{
			"title": "제목",
			"elementId": "title",
			"value": title,
			"col": 3,
		},
		{
			"title": "내용",
			"elementId": "content",
			"value": content,
			"type": "textarea",
			"col": 3,
		},
	];

	html += detailBoardForm(dataArray);
	detailBoardContainerHide();
	storage.gridContent.after(html);
	notIdArray = ["writer", "created"];
	$(".detailBtns").html("<button type='button' onclick='detailBoardContainerHide();'><i class=\"fa-solid fa-xmark fa-xl\"></i></button>");

	setTimeout(() => {
		let menu = [
			{
				"keyword": "add",
				"onclick": "customerInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"customerUpdate();\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "customerDelete(" + result.no + ");"
			},
		];

		plusMenuSelect(menu);
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();
	}, 100)
}

function customerErrorView(){
	alert("에러");
}

function customerInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
		},
		{
			"title": "제목",
			"elementId": "title",
			"disabled": false,
		},
		{
			"title": "내용",
			"elementId": "content",
			"type": "textarea",
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("공지사항등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "customerInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my;
		my = storage.my;

		$("#writer").val(storage.user[my].userName);
	}, 100);
}

function customerInsert(){
	let title, content, writer, data;

	title = $("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/customer";
	method = "post";
	data = {
		"title": title,
		"content": content,
		"writer": writer
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, customerSuccessInsert, customerErrorInsert);
}

function customerSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function customerErrorInsert(){
	alert("등록에러");
}

function customerUpdate(){
	let title, content, writer;

	title = $("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/customer/" + storage.detailCustomerNo;
	method = "put";
	data = {
		"title": title,
		"content": content,
		"writer": writer,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, customerSuccessUpdate, customerErrorUpdate);
}

function customerSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function customerErrorUpdate(){
	alert("수정에러");
}

function customerDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/customer/" + no;
		method = "delete";
		data = "";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, customerSuccessDelete, customerErrorDelete);
	}else{
		return false;
	}
}

function customerSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function customerErrorDelete(){
	alert("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.customerList, searchAllInput, "input");
	drawCustomerList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.customerList.length; i++){
		let no, title, writer, disDate, setDate;
		no = storage.customerList[i].no;
		title = storage.customerList[i].title;
		writer = (storage.customerList[i].writer === null || storage.customerList[i].writer == 0) ? "" : storage.user[storage.customerList[i].writer].userName;
		disDate = dateDis(storage.customerList[i].created, storage.customerList[i].modified);
		setDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + title + "#" + writer + "#created" + setDate);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchTitle, searchCreatedFrom;

	searchTitle = $("#searchTitle").val();
	searchWriter = $("#searchWriter").val();
	searchCreatedFrom = ($("#searchCreatedFrom").val() === "") ? "" : $("#searchCreatedFrom").val().replaceAll("-", "") + "#created" + $("#searchCreatedTo").val().replaceAll("-", "");
	
	let searchValues = [searchTitle, searchWriter, searchCreatedFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== ""){
			let tempArray = searchDataFilter(storage.customerList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.customerList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawCustomerList();
}