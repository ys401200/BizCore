$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getNoticeList();
});

// API 서버에서 공지사항 리스트를 가져오는 함수
function getNoticeList() {
	let url, method, data, type; 
	url = "/api/notice";
	method ="get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, noticeSuccessList, noticeErrorList);
} // End of getNoticeList()

function drawNoticeList() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.noticeList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.noticeList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridNoticeList");

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

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 4,
			},
		];
		
		data.push(str);
	}else{
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
	
			fnc = "noticeDetailView(this)";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	createGrid(container, header, data, ids, job, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "noticeInsertForm();"
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

	if(path[3] !== undefined && jsonData !== null){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		noticeDetailView(content);
	}

	plusMenuSelect(menu);
}// End of drawNoticeList()

function noticeDetailView(e) {// 선택한 그리드의 글 번호 받아오기 
	let id, url, method, data, type;
	storage.gridContent = $(e);

	id = $(e).data("id");
	url = "/api/notice/" + id;
	method = "get";
	data = "";
	type = "detail";

	crud.defaultAjax(url, method, data, type, noticeSuccessView, noticeErrorView);
} // End of noticeDetailView()

function noticeSuccessList(result){
	storage.noticeList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawNoticeList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawNoticeList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function noticeErrorList(){
	alert("에러");
}

function noticeSuccessView(result){
	let html = "", title, content, writer, dataArray, disDate, setDate, notIdArray;
	storage.detailNoticeNo = result.no;

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
			"col": 4,
		},
		{
			"title": "내용",
			"elementId": "content",
			"value": content,
			"type": "textarea",
			"col": 4,
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
				"onclick": "noticeInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"noticeUpdate();\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "noticeDelete(" + result.no + ");"
			},
		];

		plusMenuSelect(menu);
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();
	}, 100)
}

function noticeErrorView(){
	alert("에러");
}

function noticeInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
			"col": 4,
		},
		{
			"title": "제목",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용",
			"elementId": "content",
			"type": "textarea",
			"col": 4,
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("공지사항등록");
	modal.content.css("width", "70%");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "noticeInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my;
		my = storage.my;

		$("#writer").val(storage.user[my].userName);
	}, 100);
}

function noticeInsert(){
	let title, content, writer, data;

	title = $("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/notice";
	method = "post";
	data = {
		"title": title,
		"content": content,
		"writer": writer
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, noticeSuccessInsert, noticeErrorInsert);
}

function noticeSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function noticeErrorInsert(){
	alert("등록에러");
}

function noticeUpdate(){
	let title, content, writer;

	title = $("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/notice/" + storage.detailNoticeNo;
	method = "put";
	data = {
		"title": title,
		"content": content,
		"writer": writer,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, noticeSuccessUpdate, noticeErrorUpdate);
}

function noticeSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function noticeErrorUpdate(){
	alert("수정에러");
}

function noticeDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/notice/" + no;
		method = "delete";
		data = "";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, noticeSuccessDelete, noticeErrorDelete);
	}else{
		return false;
	}
}

function noticeSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function noticeErrorDelete(){
	alert("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.noticeList, searchAllInput, "input");
	drawNoticeList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.noticeList.length; i++){
		let no, title, writer, disDate, setDate;
		no = storage.noticeList[i].no;
		title = storage.noticeList[i].title;
		writer = (storage.noticeList[i].writer === null || storage.noticeList[i].writer == 0) ? "" : storage.user[storage.noticeList[i].writer].userName;
		disDate = dateDis(storage.noticeList[i].created, storage.noticeList[i].modified);
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
			let tempArray = searchDataFilter(storage.noticeList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.noticeList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawNoticeList();
}