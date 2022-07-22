$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	drawFileForm();
});



function drawFileForm() {
	let target, html, fileInput;
	target = $(".fileboxList");

	html = "<div style='display:grid;grid-template-columns:10% 90%'><label class='labelClass'>제목</label><input type='text' class='titleClass'/></div>" +
		"<div style='display:grid;grid-template-columns:10% 90%' class='contentDiv'><label class='labelClass'>내용</label><textarea style='resize : none;'  class='contentClass' ></textarea></div>" +
		"<div style='display:grid;grid-template-columns:10% 90%'><label class='labelClass'>첨부파일</label><input type='file' multiple class='fileClass'/></div>" +
		"<div class='attachedFileName'></div>" +
		"<div class='buttonDiv'><button type='button' class='uploadFileBoard' onclick='uploadFileBoard()'>등록</button><button type='button'>취소</button></div>";

	target.html(html);

	fileInput = document.getElementsByClassName('fileClass');
	fileInput[0].addEventListener('change', getInputTag);
}



//파일 db에 파일 올리는 함수 // 제일 최근에 올린 파일을 게시글에 첨부? 
function getInputTag() {

	let fileInput, input, file = null;

	fileInput = document.getElementsByClassName('fileClass');
	input = fileInput[0];
	if (input !== undefined && input !== null) file = input.files[0];
	getfileBinary(file);


} //End of getInputTag(); 


function getfileBinary(file) {
	let reader;

	if (file !== undefined && file !== null) {
		reader = new FileReader();

		reader.onload = (e) => {
			let fileData = e.target.result;
			fileData = cipher.encAes(fileData);
			let fullData = (file.name + "\r\n" + fileData); // 파일 제목과 파일 내용 

			console.log(fullData);
			submitFile(fullData)
		}

		reader.readAsBinaryString(file);
	}

}//End of getfileBinary(file); 





////////////// 파일 다중 선택한 경우 ? 

// function getMultipleFileBinary(file) {
//     let reader ; 

//     for(let i = 0 ; i < file.length; i ++) {
//        reader = new FileReader(); 
//        reader.onload = (e) => {
//        let filedata = e.target.result;
//        let title = file[i].name;
//        console.log(title + filedata+"////////////"); 
//        }

//        reader.readAsBinaryString(file[i]);

//     } 

// }






// 첨부파일 임시로 올리는 함수 
function submitFile(fullData) {
	let url, target, title, fullDataSplit;
	url = apiServer + "/api/board/filebox/attached";
	target = $(".attachedFileName");

	fullDataSplit = fullData.split("\r\n");
	title = fullDataSplit[0];

	$.ajax({
		"url": url,
		"method": "post",
		"data": fullData,
		"contentType": "text/plain",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			if (result.result === "ok") {
				drawTempFileList(title);
			} else {
				modal.alert("파일 업로드를 실패했습니다.");
			}
		}
	})
}// End of submitFile(fileData); 






//임시로 올라간 첨부파일 목록 그리는 함수 
function drawTempFileList(title) {
	let target, html, titleSplit, format, img;

	target = $(".attachedFileName");
	html = target.html();
	titleSplit = title.split(".");
	format = titleSplit[1];

	if (format === 'xls' || format === 'xlsx') {
		//img = "<img src='/images/xls.jpg'/>";
	}
	else if (format === 'hwp') {
		//img = "<img src='/images/hwp.jpg'/>";
	}
	else if (format === 'pdf') {
		//img = "<img src='/images/pdf.jpg'/>";
	}
	else if (format === 'jpg' || format === 'jpeg' || format === 'png' || format === 'bmp') {
		//	img = "<img src='/images/image.jpg'/>";
	}
	else if (format === 'txt') {
		//img = "<img src='/images/text.jpg'/>";
	}
	else if (format === 'ppt') {
		//img = "<img src='/images/ppt.jpg'/>";
	}
	else if (format === 'zip') {
		//img ="<img src='/images/zip.jpg'/>";
	}

	html += ("<div style='display:grid;grid-template-columns: 10% 45% 45%' class='eachFileDiv'>" + img + "<div>" + title + "</div><button type='button' class='fileDelete' onclick='deleteParentDiv(this)'>×</button></div>");

	target.html(html);


} // End of drawTempFileList(title);






//delete 버튼 눌러서 목록에서 지우는 함수 
function deleteParentDiv(obj) {
	let parent;
	parent = obj.parentNode;
	parent.remove();

}




// 자료실 글 insert 하는 함수 
function uploadFileBoard() {
	let url, title, content ,data;
	let fileDivs = [];
	title = $(".titleClass").val();
	content = $(".contentClass").val();

	if (title === null || title === "" || title === undefined) {
		modal.alert("알림", "제목을 입력하세요");

	} else if (content === null || content === "" || content === undefined) {
		modal.alert("알림", "내용을 입력하세요");
	}


	 gettempFileListArr(fileDivs);

	url = apiServer + "/api/board/filebox";


    data = {
			"title": title,
			"content": content,
			"files": fileDivs
		};
		data=JSON.stringify(data)
		data = cipher.encAes(data);
		///////////// JSON
//JSON.stringify(data) application/json          data text/plain 
	$.ajax({

		"url": url,
		"method": "post",
		"data": data,
		"contentType" : "application/json " ,
		"dataType": "json",
		"cache": false,
		success: (result) => {
			if (result.result === "ok") {
				modal.alert("알림","자료실 글을 등록하는데 성공 했습니다 ");
			} else {
				modal.alert("알림","자료실 글을 등록하는데 실패했습니다 ");
			}
		}
	})


} // End of uploadFileBoard(); 



// 자료실 게시글과 같이(올릴 첨부파일 목록 배열 만드는 함수 
function gettempFileListArr(fileDivs) {
	let target = $(".eachFileDiv");
	let title;
	for (let i = 0; i < target.length; i++) {
		title = target[i].children[0].innerText;
		fileDivs.push(title);
	}

}// End of gettempFileListArr(fileDivs);



