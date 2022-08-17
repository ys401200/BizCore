$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getFileBoxList();
});

// API 서버에서 자료 리스트를 가져오는 함수
function getFileBoxList() {
	let url, method, data, type; 
	url = "/api/board/filebox";
	method ="get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, fileBoxSuccessList, fileBoxErrorList);
	
} // End of getFileBoxList()

function drawFileBoxList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.fileBoxList === undefined) {
		msg.set("등록된 자료가 없습니다");
	}
	else {
		jsonData = storage.fileBoxList;
	}
	
	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridFileBoxList");

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

		fnc = "fileBoxDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawFileBoxList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawFileBoxList()

function fileBoxDetailView(e) {// 선택한 그리드의 글 번호 받아오기 
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/filebox/" + id;
	method = "get";
	data = "";
	type = "detail";

	crud.defaultAjax(url, method, data, type, fileBoxSuccessView, fileBoxErrorView);
} // End of fileBoxDetailView()

function fileBoxSuccessList(result){
	storage.fileBoxList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawFileBoxList, 600);
	}else{
		window.setTimeout(drawFileBoxList, 200);
	}
}

function fileBoxErrorList(){
	alert("에러");
}

function fileBoxSuccessView(result){
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
	detailContainer.find(".detailBtns").append("<button type='button' onclick='fileBoxUpdateForm(" + JSON.stringify(result) + ");'>수정</button><button type='button' onclick='fileBoxDelete(" + result.no + ");'>삭제</button><button type='button'>닫기</button>");
	detailContainer.show();
}

function fileBoxErrorView(){
	alert("에러");
}

function fileBoxInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
		},
		{
			"title": "첨부파일",
			"elementId": "attached",
			"elementName": "attached[]",
			"type": "file",
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
	modal.headTitle.text("자료 등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "fileBoxInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my;
		my = storage.my;

		$(document).find("#writer").val(storage.user[my].userName);
	}, 100);
}

function fileBoxUpdateForm(result){
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
	modal.confirm.attr("onclick", "fileBoxUpdate(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");
}

function fileBoxInsert(){
	let title, content, writer, attached, fileDatas = [], data;

	attached = $(document).find("[name='attached[]']")[0].files;
	title = $(document).find("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $(document).find("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());
	
	for(let i = 0; i < attached.length; i++){
		fileDatas.push(attached[i].name);
	}
	
	url = "/api/board/filebox";
	method = "post";
	data = {
		"title": title,
		"content": content,
		"writer": writer,
		"files": fileDatas,
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, fileBoxSuccessInsert, fileBoxErrorInsert);
}

function fileBoxSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function fileBoxErrorInsert(){
	alert("등록에러");
}

function fileBoxUpdate(no){
	let title, content, writer;

	title = $(document).find("#title").val();
	content = tinymce.activeEditor.getContent();
	writer = $(document).find("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());

	url = "/api/fileBox/" + no;
	method = "put";
	data = {
		"title": title,
		"content": content,
		"writer": writer,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, fileBoxSuccessUpdate, fileBoxErrorUpdate);
}

function fileBoxSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function fileBoxErrorUpdate(){
	alert("수정에러");
}

function fileBoxDelete(no){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/borad/fileBox/" + no;
		method = "delete";
		data = "";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, fileBoxSuccessDelete, fileBoxErrorDelete);
	}else{
		return false;
	}
}

function fileBoxSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function fileBoxErrorDelete(){
	alert("삭제에러");
}

function fileChange(){
	let url, method, data, type, attached, divHeight, fileData, fullData;
	attached = $(document).find("[name='attached[]']")[0].files;
	$(document).find("#attached").after("<div class='filePreview'></div>");

	for(let i = 0; i < attached.length; i++){
		let reader = new FileReader();

		reader.onload = (e) => {
			fileData = e.target.result;
			fileData = cipher.encAes(fileData);
			fullData = (attached[i].name + "\r\n" + fileData);
			
			url = "/api/board/filebox/attached";
			method = "post";
			data = fullData;
			type = "insert";
			
			crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
		}

		reader.readAsBinaryString(attached[i]);

		$(document).find(".filePreview").append("<div>" + (i+1) + ". " + attached[i].name + "</div>");
		divHeight = $(document).find(".filePreview").innerHeight();
		$(document).find("#attached").parent().parent().next().css("padding-top", divHeight);
	}
}

function submitFileSuccess(){
	return false;
}

function submitFileError(){
	alert("파일을 올리는 도중 에러가 생겼습니다.\n다시 시도해주세요.")
}