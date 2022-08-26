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



function noticeSuccessList(result) {
	storage.noticeList = result;
	window.setTimeout(drawNoticeList, 200);
}

function noticeErrorList() {
	alert("에러");
}

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



///글 제목 눌렀을때 상세 조회하는 페이지 그리기 
function getDetailView(no) {

	let testForm = storage.formList[0].form;
	let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showAppModal()'>결재하기</button>" +
		"<button type='button'>결재선 수정</button>" +
		"<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>문서 수정</button></div>" +
		"<div class='detailReport'><div class='selectedReportview'></div><div class='comment'></div></div>"


	$(".listPageDiv").html(detailHtml);
	$(".selectedReportview").html(testForm);


	let tabHtml = "<div class='reportInfoTab'>" +
		"<label id='lineInfo' onclick='changeTab(this)'>결재정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
		"<div class='tabDetail'></div>"
	$(".comment").html(tabHtml);
	toReadMode();
	drawCommentLine();

}

// 탭 누를때마다의 이벤트 주기 
function changeTab(obj) {

	$(obj).css("background-color", "#332E85");
	$(obj).css("color", "white");
	$(obj).css("border", "none");

	if (obj.id == 'lineInfo') {

		$("#changeInfo").css("background-color", "white");
		$("#changeInfo").css("color", "#332E85");
		$("#changeInfo").css("border-bottom", "2px solid #332E85");
		drawCommentLine();

	} else if (obj.id = 'changeInfo') {
		$("#lineInfo").css("background-color", "white");
		$("#lineInfo").css("color", "#332E85");
		$("#lineInfo").css("border-bottom", "2px solid #332E85");
		drawChangeInfo();

	}
}



// 결재정보 탭 눌렀을때 결재정보 그리는 함수 
function drawCommentLine() {

	let target = $(".tabDetail");

	// 임시 데이터 ----------------------------------------------------

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

	// 임시 데이터 ---------------------------------------------------- 


	let detail = "<div class='tapLine'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
	let lineDetailHtml = "";
	let approvalDetailHtml = "";


	for (let i = 0; i < examine.length; i++) {
		lineDetailHtml += "<div class='tapLine examineLine'><div>검토</div><div>" + examine[i].name + "</div><div>" + examine[i].status + "</div><div>" + examine[i].approved + "</div><div>" + examine[i].comment + "</div></div>";
	}
	for (let i = 0; i < approval.length; i++) {
		approvalDetailHtml += "<div class='tapLine approvalLine'><div>결재</div><div>" + approval[i].name + "</div><div>" + approval[i].status + "</div><div>" + approval[i].approved + "</div><div>" + approval[i].comment + "</div></div>";
	}

	lineDetailHtml += approvalDetailHtml;
	detail += lineDetailHtml;
	target.html(detail);

}


//  문서 정보 그리는 함수  
function drawChangeInfo() {
	let target = $(".tabDetail");
	// 임시 데이터 ----------------------------------------------------


	let changeData = [{
		"type": "검토",
		"name": "구민주",
		"modifyDate": "22-08-18",
		"modCause": " 거래처 수정 "
	},
	{
		"type": "검토",
		"name": "이송현",
		"modifyDate": "22-08-19",
		"modCause": "수량 수정 했습니다 테스트로 수정 했습니다  "
	}]

	// 임시 데이터 ---------------------------------------------------- 

	let detail = "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
	let changeHtml = "";


	for (let i = 0; i < changeData.length; i++) {
		changeHtml += "<div class='tapLineB changeDataLine'>" +
			"<div class='changeType'>" + changeData[i].type + "</div><div class='changeName' >" + changeData[i].name + "</div><div class='changeDate'>" + changeData[i].modifyDate + "</div><div class='changeCause'>" + changeData[i].modCause + "</div>" +
			"</div>"
	}


	detail += changeHtml;
	target.html(detail);

}



// 결재하기 모달 함수
function closeModal(obj) {
	$(".modal-wrap").hide();
	// 체크된 것 초기화 
	$("input:radio[name='type']").prop("checked", false);

}

function showAppModal() {
	$(".modal-wrap").show();
	$("input:radio[name='type']").prop("checked", false);

}


function createConfirmBtn(obj) {
	let div = document.getElementsByClassName("mainBtnDiv")
	if (div[0].childElementCount < 4) {
		$(".mainBtnDiv").append("<button type='button' onclick='toReadMode(); this.remove()' >수정완료 </button>");
	}

}