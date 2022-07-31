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
	let url, method, data; 
	url = "/api/notice";
	method ="get"
	data= "";
	crud.defaultAjax(url, method, data, noticeSuccessList, noticeErrorList);
	
} // End of getNoticeList()

function noticeSearchList(){
	let searchCategory, searchText, url, method, data;

	url = "/api/notice";
	method = "get";
	data = "";

	searchCategory = $(document).find("#noticeSearchCategory").val();
	searchText = $(document).find("#noticeSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, noticeSuccessList, noticeErrorList);
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

function noticeDetailView(event) {// 선택한 그리드의 글 번호 받아오기 
	let no = event.dataset.id;
	let url;
	url = apiServer + "/api/notice/" + no;

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
				drawNoticeContent(jsonData);
			} else {
				modal.alert("공지사항 상세조회에 실패했습니다.");
			}
		}
	})

} // End of noticeDetailView()

function drawNoticeContent(jsonData) { // 공지사항 본문 보이게 하는 함수 
	let title = jsonData.title;
	let content = jsonData.content;
	let html = "";
	let headerDiv;
	let contentDiv;

	headerDiv = "<div class='headerDiv' style='display:grid;grid-template-columns:80% 20%' onclick='deleteNoticeContent()'><div>" + title + "</div><div class='deleteButton'>X</div></div>";
	contentDiv = "<div class='contentDiv' style='display:grid'>" + content + "</div>";
	html += (headerDiv + contentDiv);
	$(".noticeContent").html(html);
	$(".noticeContent").show();


}// End of drawNoticeContent()


function deleteNoticeContent() { // 공지사항 본문 지우는 함수 
	$(".noticeContent").hide();
}


function noticeSuccessList(result){
	storage.noticeList = result;
	window.setTimeout(drawNoticeList, 200);
}

function noticeErrorList(){
	alert("에러");
}
