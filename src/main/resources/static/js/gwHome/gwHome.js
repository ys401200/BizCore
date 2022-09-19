$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	drawGwDiv();
});

function drawGwDiv() {

	$.ajax({
		"url": "/api/gw/app/wait",
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				storage.waitList = list;
				let waitList = storage.waitList.wait;
				drawWaitCard(waitList);
			} else {
				// msg.set("양식 정보를 가져오지 못했습니다.");
			}
		}
	})


}



function drawWaitCard(waitList) {
	let target = $(".waitDiv");

	let gwHtml = "";
	for (let i = 0; i < waitList.length; i++) {
		gwHtml += "<div class='waitCard' value='" + waitList[i].no + "'><div>" + waitList[i].title + "</div>" +
			"<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" + waitList[i].form + "</div></div>" +
			"<div class='writer'><div>기안자</div><div>" + storage.user[waitList[i].writer].userName + "</div></div>" +
			"<div class='created'><div>작성일</div><div>" + getYmdSlash(waitList[i].created) + "</div></div></div></div>";
	}

	target.html(gwHtml);
}



function drawNoticeList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.waitList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		jsonData = storage.waitList.due; 
	}

	result = paging(jsonData.length, storage.currentPage, 5);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".dueDiv");

	header = [

		{
			"title": "번호",
			"align": "center",
		},
        {
			"title": "결재 타입",
			"align": "center",
		},
		{
			"title": "문서 종류",
			"align": "center",
		},
		{
			"title": "제목",
			"align": "center",
		},
		{
			"title": "작성자",
			"align": "center",
		},
		{
			"title": "작성일",
			"align": "center",
		},
		
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		let userName = storage.user[jsonData[i].writer].userName;
		let appType = jsonData[i].appType;
        if (appType == '0') {
			appType = "검토";
		} else if (appType == '1') {
			appType = "합의";

		} else if (appType == '2') {
			appType = "결재";
		} else if (appType == '3') {
			appType = "수신";
		} else {
			appType = "참조";

		}
        str = [

			{
				"setData": jsonData[i].no,
			},{
				"setData": appType,
			},
			{
				"setData": jsonData[i].form,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": userName,
			},
			{
				"setData": setDate,
			},
			
			// {
			// 	"setData": "<input type='checkbox' class='thisCheck' data-id='" + jsonData[i].no + "'>",
			// }
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


function showWaitReport() { }


function getYmdSlash() {
	let d = new Date();
	return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}
