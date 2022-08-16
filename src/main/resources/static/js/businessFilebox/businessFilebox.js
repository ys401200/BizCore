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
		url = "/api/fileBox/" + no;
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
	let url, method, data, type, attached;
	attached = $(document).find("[name='attached[]']")[0].files;

	for(let i = 0; i < attached.length; i++){
		console.log(i);
		let reader = new FileReader();

		reader.onload = (e) => {
			
			let fileData = e.target.result;
			fileData = cipher.encAes(fileData);
			let fullData = (attached[i].name + "\r\n" + fileData); // 파일 제목과 파일 내용 
			fullData = cipher.encAes(fullData); 
			
			url = "/api/board/filebox/attached";
			method = "post";
			data = fullData;
			type = "insert";
			
			crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
		}

		reader.readAsBinaryString(attached[i]);
	}
}
// $(document).ready(() => {
// 	init();

// 	setTimeout(() => {
// 		$("#loadingDiv").hide();
// 		$("#loadingDiv").loading("toggle");
// 	}, 300);
// 	drawFileForm();
// });



// function drawFileForm() {
// 	let target, html, fileInput;
// 	target = $(".fileboxList");

// 	html = "<div style='display:grid;grid-template-columns:10% 90%'><label class='labelClass'>제목</label><input type='text' class='titleClass'/></div>" +
// 		"<div style='display:grid;grid-template-columns:10% 90%' class='contentDiv'><label class='labelClass'>내용</label><textarea style='resize : none;'  class='contentClass' id='contentClass' ></textarea></div>" +
// 		"<div style='display:grid;grid-template-columns:10% 5% 85%'><label class='labelClass'>첨부파일</label><label for='fileClass' id='fileClassLabel'>첨부파일</label><input type='file' multiple class='fileClass' id='fileClass'/></div>" +
// 		"<div class='attachedFileName'></div>" +
// 		"<div class='buttonDiv'><button type='button' class='uploadFileBoard' onclick='uploadFileBoard()'>등록</button><button type='button'>취소</button></div>";

// 	target.html(html);

// 	fileInput = document.getElementsByClassName('fileClass');
// 	fileInput[0].addEventListener('change', getInputTag);
// }



// //파일 db에 파일 올리는 함수 // 제일 최근에 올린 파일을 게시글에 첨부? 
// function getInputTag() {

// 	let fileInput, input, file = null;

// 	fileInput = document.getElementsByClassName('fileClass');
// 	input = fileInput[0];
// 	if (input !== undefined && input !== null) file = input.files[0];
// 	getfileBinary(file);


// } //End of getInputTag(); 


// function getfileBinary(file) {
// 	let reader;

// 	if (file !== undefined && file !== null) {
// 		reader = new FileReader();

// 		reader.onload = (e) => {
// 			let fileData = e.target.result;
// 			fileData = cipher.encAes(fileData);
// 			let fullData = (file.name + "\r\n" + fileData); // 파일 제목과 파일 내용 

// 			console.log(fullData);
// 			submitFile(fullData)
// 		}

// 		reader.readAsBinaryString(file);
// 	}

// }//End of getfileBinary(file); 





// ////////////// 파일 다중 선택한 경우 ? 

// // function getMultipleFileBinary(file) {
// //     let reader ; 

// //     for(let i = 0 ; i < file.length; i ++) {
// //        reader = new FileReader(); 
// //        reader.onload = (e) => {
// //        let filedata = e.target.result;
// //        let title = file[i].name;
// //        console.log(title + filedata+"////////////"); 
// //        }

// //        reader.readAsBinaryString(file[i]);

// //     } 

// // }

function submitFileSuccess(){
	alert("성공");
}

function submitFileError(){
	return false;
}

// //임시로 올라간 첨부파일 목록 그리는 함수 
// function drawTempFileList(title) {
// 	let target, html, titleSplit, format, img;

// 	target = $(".attachedFileName");
// 	html = target.html();
// 	titleSplit = title.split(".");
// 	format = titleSplit[1];
// 	console.log(format);

// 	if (format === 'avi' || format === 'doc' || format === 'gif' || format === 'iso' || format === 'jpg' || format === 'pdf'
// 		|| format === 'png' || format === 'ppt' || format === 'pptx' || format === 'ps' || format === 'psd' || format === 'rar'
// 		|| format === 'txt' || format === 'xlsx' || format === 'zip') {
// 		img = format;
// 	}
// 	else {
// 		img = "default";
// 	}

// 	html += ("<div style='display:grid;grid-template-columns: 10% 45% 45%' class='eachFileDiv'><img src='../../images/icons/" + img + ".png'><div>" + title + "</div><button type='button' class='fileDelete' onclick='deleteParentDiv(this)'>×</button></div>");

// 	target.html(html);


// } // End of drawTempFileList(title);



// //delete 버튼 눌러서 목록에서 지우는 함수 
// function deleteParentDiv(obj) {
// 	let parent;
// 	parent = obj.parentNode;
// 	parent.remove();

// }




// // 자료실 글 insert 하는 함수 
// function uploadFileBoard() {
// 	let url, title, content, data;
// 	let fileDivs = [];
// 	title = $(".titleClass").val();


// //에디터에 입력된 내용 가져오는 것 
// 	content = tinyMCE.get("contentClass").getContent();


// 	if (title === null || title === "" || title === undefined) {
// 		modal.alert("알림", "제목을 입력하세요");

// 	} else if (content === null || content === "" || content === undefined) {
// 		modal.alert("알림", "내용을 입력하세요");

// 	}



// 	gettempFileListArr(fileDivs);

// 	url = apiServer + "/api/board/filebox";


// 	data = {
// 		"title": title,
// 		"content": content,
// 		"files": fileDivs
// 	};
// 	data = JSON.stringify(data)
// 	data = cipher.encAes(data);
// 	///////////// JSON
// 	//JSON.stringify(data) application/json          data text/plain 
// 	$.ajax({

// 		"url": url,
// 		"method": "post",
// 		"data": data,
// 		"contentType": "application/json ",
// 		"dataType": "json",
// 		"cache": false,
// 		success: (result) => {
// 			if (result.result === "ok") {
// 				modal.alert("알림", "자료실 글을 등록하는데 성공 했습니다 ");
// 			} else {
// 				modal.alert("알림", "자료실 글을 등록하는데 실패했습니다 ");
// 			}
// 		}
// 	})


// } // End of uploadFileBoard(); 



// // 자료실 게시글과 같이(올릴 첨부파일 목록 배열 만드는 함수 
// function gettempFileListArr(fileDivs) {
// 	let target = $(".eachFileDiv");
// 	let title;
// 	for (let i = 0; i < target.length; i++) {
// 		title = target[i].children[0].innerText;
// 		fileDivs.push(title);
// 	}

// }// End of gettempFileListArr(fileDivs);



