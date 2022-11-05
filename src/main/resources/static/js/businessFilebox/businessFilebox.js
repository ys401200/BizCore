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
	method ="get";
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, fileBoxSuccessList, fileBoxErrorList);
	
} // End of getFileBoxList()

function drawFileBoxList() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.fileBoxList === undefined) {
		msg.set("등록된 자료가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.fileBoxList;
		}else{
			jsonData = storage.searchDatas;
		}
	}
	
	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridFileBoxList");

	header = [
		{
			"title": "등록일",
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
			setDate = dateFnc(disDate, "mm-dd");
			let userName = storage.user[jsonData[i].writer].userName;
	
			str = [
				{
					"setData": setDate,
				},
				{
					"setData": jsonData[i].title,
				},
				{
					"setData": userName,
				},
			]
	
			fnc = "fileBoxDetailView(this)";
			ids.push(jsonData[i].no);
			data.push(str);
		}

		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawFileBoxList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	createGrid(container, header, data, ids, job, fnc);
}// End of drawFileBoxList()

function fileBoxDetailView(e) {// 선택한 그리드의 글 번호 받아오기 
	let id, url, method, data, type;
	storage.gridContent = $(e);
	storage.attachedFlag = false;

	id = $(e).data("id");
	url = "/api/board/filebox/" + id;
	method = "get";
	data = "";
	type = "detail";

	crud.defaultAjax(url, method, data, type, fileBoxSuccessView, fileBoxErrorView);
} // End of fileBoxDetailView()

function fileBoxSuccessList(result){
	storage.fileBoxList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawFileBoxList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawFileBoxList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function fileBoxErrorList(){
	msg.set("에러");
}

function fileBoxSuccessView(result){
	let html = "", fileHtml = "", title, content, writer, dataArray, disDate, setDate, downloadApiPath, btnHtml = "";
	storage.formList = result;
	storage.fileBoxNo = result.no;
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
			"col": 2,
		},
		{
			"title": "등록일",
			"element": "created",
			"value": setDate,
			"type": "date",
			"col": 2,
		},
		{
			"title": "제목(*)",
			"elementId": "title",
			"value": title,
			"col": 4,
		},
		{
			"title": "내용(*)",
			"elementId": "content",
			"value": content,
			"type": "textarea",
			"col": 4,
		},
	];

	html += detailBoardForm(dataArray);
	
	if(result.attached !== undefined){
		if(result.attached.length > 0){
			downloadApiPath = "/api/board/filebox/" + storage.fileBoxNo + "/";
			fileHtml = "<div class=\"defaultFormLine\" style=\"grid-column: span 4\">";
			fileHtml += "<div class=\"defaultFormSpanDiv\">";
			fileHtml += "<span class=\"defaultFormSpan\">첨부파일</span>";
			fileHtml += "</div>"
			fileHtml += "<div class=\"defaultFormContent\" style=\"display: block\">";
		
			for(let i = 0; i < result.attached.length; i++){
				fileHtml += "<div style=\"padding: 5px; font-size: 0.8rem;\"><a class=\"fileDownloadBtn\" href='" + downloadApiPath + encodeURI(result.attached[i].ognName) + "'>" + result.attached[i].ognName + "</a></div>";
			}

			fileHtml += "</div>";
		}
	}

	detailBoardContainerHide();
	storage.gridContent.after(html);

	if(storage.my == result.writer){
		btnHtml += "<button type=\"button\" class=\"updateBtn\" onclick=\"fileBoxUpdateForm();\">수정</button>";
		btnHtml += "<button type=\"button\" onclick=\"fileBoxDelete();\">삭제</button>";
	}

	btnHtml += "<button type='button' onclick='detailBoardContainerHide();'><i class=\"fa-solid fa-xmark\"></i></button>";
	
	$(".detailBtns").html(btnHtml);
	$(".detailContents .defaultFormContainer").append(fileHtml);

	setTimeout(() => {
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100)
}

function fileBoxErrorView(){
	msg.set("에러");
}

function fileBoxInsertForm(){
	let html, dataArray;

	storage.attachedFlag = false;
	fileDataArray = [];

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
			"col": 2,
		},
		{
			"title": "첨부파일",
			"elementId": "attached",
			"elementName": "attached[]",
			"type": "file",
			"col": 2,
		},
		{
			"title": "제목(*)",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용(*)",
			"elementId": "content",
			"type": "textarea",
			"disabled": false,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text("자료 등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "fileBoxInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		let my;
		my = storage.my;
		$("#writer").val(storage.user[my].userName);
		$(".defaultFormContainer .defaultFormLine").eq(1).after("<div class=\"filePreview\"></div>");
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function fileBoxUpdateForm(){
	let title, content, writer, dataArray, html = "";

	title = (storage.formList.title === null || storage.formList.title === "") ? "" : storage.formList.title;
	content = (storage.formList.content === null || storage.formList.content === "") ? "" : storage.formList.content;
	writer = (storage.formList.writer == 0 || storage.formList.writer === null) ? "" : storage.user[storage.formList.writer].userName;

	dataArray = [
		{
			"title": "담당자",
			"elementId": "writer",
			"dataKeyup": "user",
			"value": writer,
			"col": 2,
		},
		{
			"title": "첨부파일",
			"elementId": "attached",
			"elementName": "attached[]",
			"type": "file",
			"col": 2,
		},
		{
			"title": "제목(*)",
			"elementId": "title",
			"value": title,
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용(*)",
			"elementId": "content",
			"value": content,
			"type": "textarea",
			"col": 4,
		},
	];

	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text(title);
	modal.body.html(html);
	modal.confirm.text("수정완료");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "fileBoxUpdate();");
	modal.close.attr("onclick", "modal.hide();");

	defaultFormLine = $(".defaultFormLine");
	defaultFormLine.eq(1).after("<div class=\"filePreview\"></div>");
	
	html = "";

	if(storage.formList.attached !== undefined && storage.formList.attached.length > 0){
		for(let i = 0; i < storage.formList.attached.length; i++){
			fileDataArray.push(storage.formList.attached[i].ognName);
			html += "<div><span>" + storage.formList.attached[i].ognName + "</span><button type='button' id='fileDataDelete' data-index='" + i + "' onclick='fileViewDelete(this);'>삭제</button></div>";
			$(".filePreview").html(html);
		}
	}

	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function fileBoxInsert(){
	if($("#title").val() === ""){
		msg.set("제목을 입력해주세요.");
		$("#title").focus();
		return false;
	}else{
		let title, content, writer, data;
	
		title = $("#title").val();
		content = CKEDITOR.instances.content.getData().replaceAll("\n", "");
		writer = $("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());
		
		url = "/api/board/filebox";
		method = "post";
		data = {
			"title": title,
			"content": content,
			"writer": writer,
			"files": fileDataArray,
		}
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, fileBoxSuccessInsert, fileBoxErrorInsert);
	}
}

function fileBoxSuccessInsert(){
	msg.set("등록완료");
	location.reload();
}

function fileBoxErrorInsert(){
	msg.set("등록에러");
}

function fileBoxUpdate(){
	if($("#title").val() === ""){
		msg.set("제목을 입력해주세요.");
		$("#title").focus();
		return false;
	}else{
		let title, content, writer;

		title = $("#title").val();
		content = CKEDITOR.instances.content.getData().replaceAll("\n", "");
		writer = $("#writer");
		writer = dataListFormat(writer.attr("id"), writer.val());

		url = "/api/board/filebox/" + storage.fileBoxNo;
		method = "put";
		data = {
			"title": title,
			"content": content,
			"writer": writer,
			"addFiles": updateDataArray,
			"removeFiles": removeDataArray,
		}
		type = "update";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, fileBoxSuccessUpdate, fileBoxErrorUpdate);
	}
}

function fileBoxSuccessUpdate(){
	msg.set("수정완료");
	location.reload();
}

function fileBoxErrorUpdate(){
	msg.set("수정에러");
}

function fileBoxDelete(){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/board/filebox/" + storage.fileBoxNo;
		method = "delete";
		data = "";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, fileBoxSuccessDelete, fileBoxErrorDelete);
	}else{
		return false;
	}
}

function fileBoxSuccessDelete(){
	msg.set("삭제완료");
	location.reload();
}

function fileBoxErrorDelete(){
	msg.set("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput, tempArray;
	searchAllInput = $("#searchAllInput").val();
	tempArray = searchDataFilter(storage.fileBoxList, searchAllInput, "input");

	if(tempArray.length > 0){
		storage.searchDatas = tempArray;
	}else{
		storage.searchDatas = "";
	}

	drawFileBoxList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.fileBoxList.length; i++){
		let no, title, writer, disDate, setDate;
		no = storage.fileBoxList[i].no;
		title = storage.fileBoxList[i].title;
		writer = (storage.fileBoxList[i].writer === null || storage.fileBoxList[i].writer == 0) ? "" : storage.user[storage.fileBoxList[i].writer].userName;
		disDate = dateDis(storage.fileBoxList[i].created, storage.fileBoxList[i].modified);
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
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = searchDataFilter(storage.fileBoxList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.fileBoxList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.fileBoxList;
	}
	
	drawFileBoxList();
}