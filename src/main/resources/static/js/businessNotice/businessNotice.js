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
	let url;


	url = apiServer + "/api/notice"
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
				storage.noticeList = jsonData;
				drawNoticeList();
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	})
} // End of getNoticeList()

function drawNoticeList() {
	let container;
	let jsonData;
	let header =[];
	let data = [];
	let ids = [];
	let disDate, setDate, str, fnc;

	if (storage.noticeList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		jsonData = storage.noticeList;
	}
	if (storage.currentPage === undefined) storage.currentPage = 1;
	if (storage.articlePerPage === undefined) storage.articlePerPage = 20;

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridNoticeList");


	header = [
		{
			"title" : "번호",
			"padding" : false,
		},
		{
			"title" : "제목",
			"padding" : true,
		},
		{
			"title" : "작성자",
			"padding" : false,
		},
		{
			"title" : "등록일",
			"padding" : false,
		}
	];

	for (let i = 0; i < jsonData.length; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": jsonData[i].writer,
			},
			{
				"setData": setDate,
			}
		]

		fnc = "noticeDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	} 
	// 페이징 처리하기 
	let pageNation = createPaging(pageContainer[0], jsonData.length/20 +1, "pageMove");
	pageContainer[0].innerHTML = pageNation;
	//표 만들기 
	createGrid(container, header, data, ids, fnc);
}

function noticeDetailView(event) {
	// 선택한 그리드의 글 번호 받아오기 
	let no = event.dataset.id; 
	let url ;
	url = apiServer + "/api/notice/" + no; 


	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let jsonData;
			if (result.result === "ok") {
				jsonData= cipher.decAes(result.data);
				jsonData = JSON.parse(jsonData);
				drawNoticeContent(jsonData);
			} else {
				modal.alert("공지사항 상세조회에 실패했습니다.");
			}
		}
	})

}

function drawNoticeContent(jsonData) {
	let content = jsonData.content; 
	$(".noticeContent").html(content);

}