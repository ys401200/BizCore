$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	waitDefault();
	$(".modal-wrap").hide();
});


function waitDefault() {


	let url, method, data, type;
	url = "/api/notice";
	method = "get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, noticeSuccessList, noticeErrorList);
	let url2 = "/api/gw/form";

	$.ajax({
		url: url2,
		type: "get",
		dataType: "json",
		success: (result) => {
			if (result.result == "ok") {
				let jsondata;
				jsondata = cipher.decAes(result.data);
				jsondata = JSON.parse(jsondata);
				storage.formList = jsondata;

			} else {
				alert("에러");
			}
		},
	});


	// //오른쪽에 상세내용 출력 
	// let previewWidth = document.getElementsByClassName("forForm")[0];
	// previewWidth = previewWidth.clientWidth;
	// let targetForm = $(".forForm");
	// targetForm.css("height", Math.ceil(previewWidth / 210 * 297));
	// let targetTable = $(".forTable");
	// targetTable.css("height", Math.ceil(Math.ceil((previewWidth / 210 * 297) * 0.1)));
	// let targetButtons = $(".forButtons");
	// targetButtons.css("height", Math.ceil(Math.ceil((previewWidth / 210 * 297) * 0.025)));

	// let buttonsHtml = "<button>상신취소</button><button>인쇄</button>";
	// targetButtons.html(buttonsHtml);
	// drawCommonmylist();

	let searchDiv = $(".waitSearchContainer").show();
	let listDiv = $(".listPageDiv").show();


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
		},
		{
			"title": "<input type='checkbox' class='thisAllcheck'>",
			"align": "center",
		},
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
			},
			{
				"setData": "<input type='checkbox' class='thisCheck' data-id='" + jsonData[i].no + "'>",
			}
		]

		fnc = "noticeDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeList", result[0]);
	pageContainer[0].innerHTML = pageNation;
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
	// let no = event.dataset.id;
	// let url;
	// url = apiServer + "/api/notice/" + no;

	// $.ajax({
	// 	"url": url,
	// 	"method": "get",
	// 	"dataType": "json",
	// 	"cache": false,
	// 	success: (result) => {
	// 		let jsonData;
	// 		if (result.result === "ok") {
	// 			jsonData = cipher.decAes(result.data);
	// 			jsonData = JSON.parse(jsonData);
	// 			drawNoticeContent(jsonData);
	// 		} else {
	// 			modal.alert("공지사항 상세조회에 실패했습니다.");
	// 		}
	// 	}
	// })
	let searchDiv = $(".waitSearchContainer").hide();

	let target = $(".container");
	let no = event.dataset.id;


	// 전자결재 문서 번호를 가지고 상세 조회 그림  

	target.html();

	getDetailView(no);







} // End of noticeDetailView()




function getDetailView(no) {

	let testForm = storage.formList[0].form;
	let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showAppModal()'>결재하기</button><button type='button'>문서 수정</button></div><div class='detailReport'><div class='selectedReportview'></div><div class='comment'></div></div>"
	$(".listPageDiv").html(detailHtml);
	$(".selectedReportview").html(testForm);


	drawCommentLine();

}


function noticeSuccessList(result) {
	storage.noticeList = result;
	window.setTimeout(drawNoticeList, 200);
}

function noticeErrorList() {
	alert("에러");
}






function drawCommentLine() {
	let examine = [{
		"name": "이송현",
		"status": "승인",
		"approved": "2022-08-19",
		"comment": "확인"
	},
	{
		"name": "구민주",
		"status": "승인",
		"approved": "2022-08-19",
		"comment": "확인했습니다 인했습니다인했습니다인했습니다인했습니다인했습니다인했습니다인했습니다"
	}]



	let approval = [{
		"name": "이승우",
		"status": "",
		"approved": "",
		"comment": ""
	}]

	let target = $(".comment");


	let examineHtml = "<div class='reportInfoTab'>" +
		"<label id='lineInfo' onclick='changeTab(this)'>결재선</label><label id='reportInfo' onclick='changeTab(this)'>문서정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
		"<div class='tabDetail'></div>"
	target.html(examineHtml);



	let lineDetailHtml = ""
	for (let i = 0; i < examine.length; i++) {
		lineDetailHtml += "<div class='examineLine'><div>검토</div><div>" + examine[i].name + "</div><div>" + examine[i].status + "</div><div>" + examine[i].approved + "</div><div>" + examine[i].comment + "</div></div>";
	}



	let approvalDetailHtml = ""

	for (let i = 0; i < approval.length; i++) {
		approvalDetailHtml += "<div class='approvalLine'><div>결재</div><div>" + approval[i].name + "</div><div>" + approval[i].status + "</div><div>" + approval[i].approved + "</div><div>" + approval[i].comment + "</div></div>";
	}

	lineDetailHtml += approvalDetailHtml;

	$(".tabDetail").html(lineDetailHtml);



}



function changeTab(obj) {

	$(obj).css("background-color", "#332E85");
	$(obj).css("color", "white");
	$(obj).css("border", "none");

	if (obj.id == 'lineInfo') {
		$("#reportInfo").css("background-color", "white");
		$("#reportInfo").css("color", "#332E85");
		$("#reportInfo").css("border-bottom", "2px solid #332E85");
		$("#changeInfo").css("background-color", "white");
		$("#changeInfo").css("color", "#332E85");
		$("#changeInfo").css("border-bottom", "2px solid #332E85");
	} else if (obj.id == 'reportInfo') {
		$("#lineInfo").css("background-color", "white");
		$("#lineInfo").css("color", "#332E85");
		$("#lineInfo").css("border-bottom", "2px solid #332E85");
		$("#changeInfo").css("background-color", "white");
		$("#changeInfo").css("color", "#332E85");
		$("#changeInfo").css("border-bottom", "2px solid #332E85");
	} else if (obj.id = 'changeInfo') {
		$("#lineInfo").css("background-color", "white");
		$("#lineInfo").css("color", "#332E85");
		$("#lineInfo").css("border-bottom", "2px solid #332E85");
		$("#reportInfo").css("background-color", "white");
		$("#reportInfo").css("color", "#332E85");
		$("#reportInfo").css("border-bottom", "2px solid #332E85");
	}
}




function closeModal(obj) {
	$(".modal-wrap").hide();
}

function showAppModal() {
	$(".modal-wrap").show();
}