$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getFileboxList();
});

// API 서버에서 공지사항 리스트를 가져오는 함수
function getFileboxList() {
	let url;
	url = apiServer + "/api/filebox"
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let jsonData;
			if (data.result === "ok") {
				jsonData = cipher.decAes(data.data);
				jsonData = JSON.parse(jsonData);
				storage.fileboxList = jsonData;
				window.setTimeout(drawFileboxList, 200);
			} else {
				modal.alert("등록된 자료가 없습니다");
			}
		}
	})
} // End of getFileboxList()

function drawFileboxList() {
	let container;
	let jsonData;
	let header = [];
	let data = [];
	let ids = [];
	let disDate, setDate, str, fnc;
	let totalNotice, currentPage, articlePerPage, max;
	let lastPageNotice; 
	if (storage.fileboxList === undefined) {
		modal.alert("등록된 자료가 없습니다");
	}
	else {
		jsonData = storage.fileboxList;
	}
	if (storage.currentPage === undefined) storage.currentPage = 1;
	if (storage.articlePerPage === undefined) storage.articlePerPage = 5;

	currentPage = storage.currentPage;
	articlePerPage = storage.articlePerPage;
	totalNotice = jsonData.length;
	max = Math.ceil(totalNotice / articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridNoticeList");


	header = [
		{
			"title": "번호",
			"padding": false,
		},
		{
			"title": "제목",
			"padding": true,
		},
		{
			"title": "작성자",
			"padding": false,
		},
		{
			"title": "등록일",
			"padding": false,
		}
	];
   
	lastPageNotice =currentPage*articlePerPage;

	//마지막 페이지인 경우 게산 
	if(currentPage==max && totalNotice%articlePerPage !==0){
		lastPageNotice = (max-1)*articlePerPage + totalNotice%articlePerPage;
	}

	for (let i = (currentPage-1)*articlePerPage; i < lastPageNotice; i++) { 
		
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

		fnc = "fileboxDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);

		
	}

	let pageNation = createPaging(pageContainer[0], max, "pageMove", currentPage);
	pageContainer[0].innerHTML = pageNation;
	//표 만들기 
	createGrid(container, header, data, ids, fnc);


}// End of drawFileboxList()


function pageMove(page) {
	let selectedPage = parseInt(page);
	storage.currentPage = selectedPage;
	drawFileboxList();
	
}



function fileboxDetailView(event) {// 선택한 그리드의 글 번호 받아오기 
	let no = event.dataset.id;
	let url;
	url = apiServer + "/api/filebox/" + no;


	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let jsonData;
			if (result.result === "ok") {
				jsonData = cipher.decAes(result.data);
				jsonData = JSON.parse(jsonData);
				drawFileboxContent(jsonData);
			} else {
				modal.alert("자료 상세조회에 실패했습니다.");
			}
		}
	})

} // End of noticeDetailView()

function drawFileboxContent(jsonData) { // 공지사항 본문 보이게 하는 함수 
	let title = jsonData.title;
	let content = jsonData.content;
	let html = "";
	let headerDiv;
	let contentDiv;

	headerDiv = "<div class='headerDiv' style='display:grid;grid-template-columns:80% 20%' onclick='deleteNoticeContent()'><div>" + title + "</div><div class='deleteButton'>X</div></div>";
	contentDiv = "<div class='contentDiv' style='display:grid'>" + content + "</div>";
	html += (headerDiv + contentDiv);
	$(".fileboxContent").html(html);
	$(".fileboxContent").show();


}// End of drawNoticeContent()


function deleteNoticeContent() { // 공지사항 본문 지우는 함수 
	$(".fileboxContent").hide();
}