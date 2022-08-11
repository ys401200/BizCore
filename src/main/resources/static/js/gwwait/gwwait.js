$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	waitDefault();
});


function waitDefault() {


	let url, method, data, type; 
	url = "/api/notice";
	method ="get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, noticeSuccessList, noticeErrorList);
	


	//오른쪽에 상세내용 출력 
	let previewWidth = document.getElementsByClassName("form")[0];
	previewWidth = previewWidth.clientWidth;
	let targetForm = $(".form");
	targetForm.css("height", Math.ceil(previewWidth / 210 * 297))
	let targetTable=$(".table");
	targetTable.css("height", Math.ceil(Math.ceil((previewWidth / 210 * 297 )* 0.2)))
	

}

function drawNoticeList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.noticeList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		jsonData = storage.noticeList;
	}

	result = paging(jsonData.length, storage.currentPage, 10);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".listDiv");

	header = [
		{
			"title": "기안일",
			"align": "center",
		},
		{
			"title": "제목",
			"align": "left",
		},
		{
			"title": "기안자",
			"align": "center",
		},
		{
			"title": "상태",
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

function noticeSuccessList(result){
	storage.noticeList = result;
	window.setTimeout(drawNoticeList, 200);
}

function noticeErrorList(){
	alert("에러");
}
