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

function noticeSearchList(){
	let searchCategory, searchText, url, method, data, type;

	url = "/api/notice";
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#noticeSearchCategory").val();
	searchText = $(document).find("#noticeSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, noticeSuccessList, noticeErrorList);
}

function drawNoticeList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.noticeList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		jsonData = storage.noticeList;
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
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()

function noticeDetailView(e) {// 선택한 그리드의 글 번호 받아오기 
	let id, url, method, data, type;

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
	}else{
		window.setTimeout(drawNoticeList, 200);
	}
}

function noticeErrorList(){
	alert("에러");
}

function noticeSuccessView(result){
	let html = "", title, content, writer, dataArray, disDate, setDate, detailContainer;

	detailContainer = $(document).find(".detailContainer");
	detailContainer.hide();

	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
	content = (result.content === null || result.content === "" || result.content === undefined) ? "내용 없음" : result.content;
	writer = (result.writer == 0 || result.writer === null || result.writer === undefined) ? "데이터 없음" : storage.user[result.writer].userName;
	disDate = dateDis(result.created, result.modified);
	setDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "번호",
			"value": result.no,
		},
		{
			"title": "제목",
			"value": title,
		},
		{
			"title": "내용",
			"value": content,
			"type": "textarea",
		},
		{
			"title": "작성자",
			"value": writer,
		},
		{
			"title": "등록일",
			"value": setDate,
		},
	];

	html += detailViewForm(dataArray);
	detailContainer.find("span").text(title);
	detailContainer.find(".detailContent").html(html);
	detailContainer.find(".detailBtns").html("");
	detailContainer.find(".detailBtns").append("<button type='button' onclick='noticeUpdateForm(" + JSON.stringify(result) + ");'>수정</button><button type='button' onclick='noticeDelete(" + result.no + ");'>삭제</button><button type='button' onclick='detailContainerHide();'>닫기</button>");
	detailContainer.show();
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
	modal.confirm.attr("onclick", "noticeInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my;
		my = storage.my;

		$(document).find("#writer").val(storage.user[my].userName);
	}, 100);
}

function noticeUpdateForm(result){
	let html, title, content, writer, detail, dataArray;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	content = (result.content === null || result.content === "") ? "내용 없음" : result.content;
	writer = (result.writer == 0 || result.writer === null) ? "데이터 없음" : storage.user[result.writer].userName;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"value": writer,
		},
		{
			"title": "제목",
			"elementId": "title",
			"value": title,
			"disabled": false,
		},
		{
			"title": "내용",
			"elementId": "content",
			"value": content,
			"type": "textarea",
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text(title);
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("수정완료");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "noticeUpdate(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");
}

function noticeInsert(){
	let title, content, writer, data;

	title = $(document).find("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $(document).find("#writer");
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

function noticeUpdate(no){
	let title, content, writer;

	title = $(document).find("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $(document).find("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/notice/" + no;
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