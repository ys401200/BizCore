$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	drawGwDiv();
	waitDefault();
});





let waitList = [
	{
		"title": "예산 증액 관련 협조 요청",
		"type": "외상매입금",
		"writer": "구민주",
		"created": "2202-07-18"
	},
	{
		"title": "업무 기안 진행바랍니다",
		"type": "발주서",
		"writer": "구민주",
		"created": "2202-06-18"
	},
	{
		"title": "재가 바랍니다",
		"type": "발주서",
		"writer": "구민주",
		"created": "2202-06-18"
	},
	{
		"title": "그룹웨어 시스템 구매 예산 재가",
		"type": "발주서",
		"writer": "구민주",
		"created": "2202-06-18"
	},
	{
		"title": "디자인 진흥원",
		"type": "발주서",
		"writer": "구민주",
		"created": "2202-06-18"
	}
	,
	{
		"title": "디자인 진흥원",
		"type": "발주서",
		"writer": "구민주",
		"created": "2202-06-18"
	}

]



function drawGwDiv() {
	let target = $(".waitDiv");
	let gwHtml = "";

	for (let i = 0; i < waitList.length; i++) {
		gwHtml += "<div class='waitCard'><div>" + waitList[i].title + "</div>" +
			"<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" + waitList[i].type + "</div></div>" +
			"<div class='writer'><div>기안자</div><div>" + waitList[i].writer + "</div></div>" +
			"<div class='created'><div>작성일</div><div>" + waitList[i].created + "</div></div></div>" + "<div><button type='button'>결재하기</button></div></div>";
	}

	target.html(gwHtml);


}




function waitDefault() {


	let url, method, data, type;
	url = "/api/notice";
	method = "get"
	data = "";
	type = "list";
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

	result = paging(jsonData.length, storage.currentPage, 5);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".listDiv");

	header = [

		{
			"title": "문서번호",
			"align": "center",
		},
		{
			"title": "문서종류",
			"align": "center",
		},
		{
			"title": "거래처",
			"align": "center",
		},
		{
			"title": "제목",
			"align": "center",
		},
		{
			"title": "금액",
			"align": "center",
		},
		{
			"title": "기안자",
			"align": "center",
		},
		{
			"title": "진행상태",
			"align": "center",
		}
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		let userName = storage.user[jsonData[i].writer].userName;

		str = [

			{
				"setData": jsonData[i].title,
			},
			{
				"setData": userName,
			},
			{
				"setData": setDate,
			},
			{
				"setData": setDate,
			},
			{
				"setData": setDate,
			},
			{
				"setData": setDate,
			},
			{
				"setData": setDate,
			}
		]

		fnc = "noticeDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}


	createGrid(container, header, data, ids, fnc);


	// 전체선택 전체 해제  
	$(".thisAllcheck").click(function () {
		if ($(".thisAllcheck").prop("checked")) {
			$(":checkbox").prop("checked", true);
		} else {
			$(":checkbox").prop("checked", false);
		}

	});
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

function noticeSuccessList(result) {
	storage.noticeList = result;
	window.setTimeout(drawNoticeList, 200);
}

function noticeErrorList() {
	alert("에러");
}

