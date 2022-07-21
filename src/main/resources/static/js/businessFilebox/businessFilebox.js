$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	drawFileForm();
});



function drawFileForm() {
     let target , html, fileInput;

     target = $(".fileboxList"); 

     html="<div style='display:grid;grid-template-columns:10% 90%'><label class='labelClass'>제목</label><input type='text' class='titleClass'/></div>"+
     "<div style='display:grid;grid-template-columns:10% 90%' class='contentDiv'><label class='labelClass'>내용</label><textarea style='resize : none;' class='contentClass'></textarea></div>"+
     "<div style='display:grid;grid-template-columns:10% 90%'><label class='labelClass'>첨부파일</label><input type='file' multiple class='fileClass'/></div>"+
     "<div class='attachedFileName'></div>"+
     "<div class='buttonDiv'><button type='button'>등록</button><button type='button'>취소</button></div>";
    
    target.html(html);  

    fileInput = document.getElementsByClassName('fileClass');
    fileInput[0].addEventListener('change',getInputTag);
}



//파일 db에 파일 올리는 함수 // 제일 최근에 올린 파일을 게시글에 첨부? 
function getInputTag() {

let fileInput, input , file  =  null;

	fileInput = document.getElementsByClassName('fileClass');
    input = fileInput[0];
    if(input !== undefined && input !== null) file = input.files[0];
   getfileBinary(file); 
   
        
} //End of getInputTag(); 


function getfileBinary(file) {
let reader;

if(file !== undefined && file !== null) {
            reader = new FileReader();

            reader.onload = (e) => {
                let fileData = e.target.result;
                fileData= cipher.encAes(fileData);
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


function submitFile(fullData){
    let url , target ;
    target = $(".attachedFileName");
	url = apiServer + "/api/board/filebox/attached";

	$.ajax({
		"url": url,
		"method": "post",
		"data" : fullData,
        "contentType" : "text/plain",
        "dataType" : "json",
		"cache": false,
		success: (result) => {
			if (result.result === "ok") {
				target.html(result.msg); 
				
			} else {
				modal.alert("파일 업로드를 실패했습니다.");
			}
		}
	})



}// End of submitFile(fileData); 


function getFileBoardList() {
let url; 
url = apiServer + "/api/board/filebox" ; 
let fileBoardList ; 
$.ajax({
    "url": url,
    "method": "get",
    "dataType" : "json",
    "cache": false,
    success: (result) => {
        if (result.result === "ok") {
        
        } else {
            modal.alert("자료실 글을 읽어오는데 실패했습니다 "); 
        }
    }
})





}




  






















// function getAttachedFileNames() {
// let target = $(".attachedFileName");
// let html ="";
// 	let fileInput = document.getElementsByClassName('fileClass');
// 	for ( let i = 0; i < fileInput.length ; i++ ) {
// 		if(fileInput[i].files.length >0) {
// 			for(let j = 0; j <fileInput[i].files.length; j++){
// 				console.log(fileInput[i].files[j].name);
// 				html += ( (j+1)+"번 파일 :"+ fileInput[i].files[j].name +",");
// 			}
// 		}
// 	}
    



//     function getFileDetail(){
//       let fileData;  let file, fileEl, reader;
// 	  let fileInput = document.getElementsByClassName('inputClass');
//         fileEl = fileInput[0];
//         if(fileEl !== undefined && fileEl !== null) file = fileEl.files[0];

//         if(file !== undefined && file !== null){
//             reader = new FileReader();
//             reader.onload = (e) => {
//                 fileData = e.target.result;

// 				console.log(fileData);
//                 $('.fileDetail').html(fileData);
//             }
//             reader.readAsBinaryString(file);
//         }
//     }



// // API 서버에서 공지사항 리스트를 가져오는 함수
// function getFileboxList() {
// 	let url;
// 	url = apiServer + "/api/filebox"
// 	$.ajax({
// 		"url": url,
// 		"method": "get",
// 		"dataType": "json",
// 		"cache": false,
// 		success: (data) => {
// 			let jsonData;
// 			if (data.result === "ok") {
// 				jsonData = cipher.decAes(data.data);
// 				jsonData = JSON.parse(jsonData);
// 				storage.fileboxList = jsonData;
// 				window.setTimeout(drawFileboxList, 200);
// 			} else {
// 				modal.alert("등록된 자료가 없습니다");
// 			}
// 		}
// 	})
// } // End of getFileboxList()

// function drawFileboxList() {
// 	let container;
// 	let jsonData;
// 	let header = [];
// 	let data = [];
// 	let ids = [];
// 	let disDate, setDate, str, fnc;
// 	let totalNotice, currentPage, articlePerPage, max;
// 	let lastPageNotice; 
// 	if (storage.fileboxList === undefined) {
// 		modal.alert("등록된 자료가 없습니다");
// 	}
// 	else {
// 		jsonData = storage.fileboxList;
// 	}
// 	if (storage.currentPage === undefined) storage.currentPage = 1;
// 	if (storage.articlePerPage === undefined) storage.articlePerPage = 5;

// 	currentPage = storage.currentPage;
// 	articlePerPage = storage.articlePerPage;
// 	totalNotice = jsonData.length;
// 	max = Math.ceil(totalNotice / articlePerPage);

// 	pageContainer = document.getElementsByClassName("pageContainer");
// 	container = $(".gridNoticeList");


// 	header = [
// 		{
// 			"title": "번호",
// 			"padding": false,
// 		},
// 		{
// 			"title": "제목",
// 			"padding": true,
// 		},
// 		{
// 			"title": "작성자",
// 			"padding": false,
// 		},
// 		{
// 			"title": "등록일",
// 			"padding": false,
// 		}
// 	];
   
// 	lastPageNotice =currentPage*articlePerPage;

// 	//마지막 페이지인 경우 게산 
// 	if(currentPage==max && totalNotice%articlePerPage !==0){
// 		lastPageNotice = (max-1)*articlePerPage + totalNotice%articlePerPage;
// 	}

// 	for (let i = (currentPage-1)*articlePerPage; i < lastPageNotice; i++) { 
		
// 		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
// 		setDate = dateFnc(disDate);
// 		let userName = storage.user[jsonData[i].writer].userName;

// 		str = [
// 			{
// 				"setData": jsonData[i].no,
// 			},
// 			{
// 				"setData": jsonData[i].title,
// 			},
// 			{
// 				"setData": userName,
// 			},
// 			{
// 				"setData": setDate,
// 			}
// 		]

// 		fnc = "fileboxDetailView(this)";
// 		ids.push(jsonData[i].no);
// 		data.push(str);

		
// 	}

// 	let pageNation = createPaging(pageContainer[0], max, "pageMove", currentPage);
// 	pageContainer[0].innerHTML = pageNation;
// 	//표 만들기 
// 	createGrid(container, header, data, ids, fnc);


// }// End of drawFileboxList()


// function pageMove(page) {
// 	let selectedPage = parseInt(page);
// 	storage.currentPage = selectedPage;
// 	drawFileboxList();
	
// }



// function fileboxDetailView(event) {// 선택한 그리드의 글 번호 받아오기 
// 	let no = event.dataset.id;
// 	let url;
// 	url = apiServer + "/api/filebox/" + no;


// 	$.ajax({
// 		"url": url,
// 		"method": "get",
// 		"dataType": "json",
// 		"cache": false,
// 		success: (result) => {
// 			let jsonData;
// 			if (result.result === "ok") {
// 				jsonData = cipher.decAes(result.data);
// 				jsonData = JSON.parse(jsonData);
// 				drawFileboxContent(jsonData);
// 			} else {
// 				modal.alert("자료 상세조회에 실패했습니다.");
// 			}
// 		}
// 	})

// } // End of noticeDetailView()

// function drawFileboxContent(jsonData) { // 공지사항 본문 보이게 하는 함수 
// 	let title = jsonData.title;
// 	let content = jsonData.content;
// 	let html = "";
// 	let headerDiv;
// 	let contentDiv;

// 	headerDiv = "<div class='headerDiv' style='display:grid;grid-template-columns:80% 20%' onclick='deleteNoticeContent()'><div>" + title + "</div><div class='deleteButton'>X</div></div>";
// 	contentDiv = "<div class='contentDiv' style='display:grid'>" + content + "</div>";
// 	html += (headerDiv + contentDiv);
// 	$(".fileboxContent").html(html);
// 	$(".fileboxContent").show();


// }// End of drawNoticeContent()


// function deleteNoticeContent() { // 공지사항 본문 지우는 함수 
// 	$(".fileboxContent").hide();}
