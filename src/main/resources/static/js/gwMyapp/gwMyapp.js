$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	waitDefault();

});

function waitDefault() {

	$("#gwSubTabTitle").html("결재 문서함");

	// 리스트 보기 
	let url, method, data, type;
	url = "/api/gw/app/approved";
	method = "get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, waitSuccessList, waitErrorList);


	$(".listPageDiv").show();


}

function waitSuccessList(result) {
	storage.approvedList = result;
	window.setTimeout(drawNoticeApproval, 200);
}

function waitErrorList() {
	alert("에러");
}

function drawNoticeApproval() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.approvedList === undefined || storage.approvedList.length == 0) {
		alert("결재 문서가 없습니다");
	}
	else {
		jsonData = storage.approvedList;
	}

	result = paging(jsonData.length, storage.currentPage, 8);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".listDiv");

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
			"align": "left",
		},
		{
			"title": "작성자",
			"align": "center",
		},
		{
			"title": "작성일",
			"align": "center",
		},
		{
			"title": "상태",
			"align": "center"
		}


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
				"setData": jsonData[i].docNo,
			},
			{
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
			}, {
				"setData": jsonData[i].status
			}

		]

		fnc = "waitDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeApproval", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);




}// End of drawNoticeApproval()




function waitDetailView(obj) {// 선택한 그리드의 글 번호 받아오기 


	let no = obj.dataset.id;
	let docNo;

	let searchList = storage.waitList.wait;

	for (let i = 0; i < searchList.length; i++) {
		if (searchList[i].no == no) { docNo = searchList[i].docNo }
	}


	$.ajax({
		"url": apiServer + "/api/gw/app/doc/" + docNo,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let detailData;
			if (data.result === "ok") {
				detailData = cipher.decAes(data.data);
				detailData = JSON.parse(detailData);
				detailData.doc = cipher.decAes(detailData.doc);
				detailData.doc = detailData.doc.replaceAll("\\\"", "\"");
				storage.reportDetailData = detailData;
				showReportDetail();
			} else {
				alert("문서 정보를 가져오는 데 실패했습니다");
			}
		}
	})

} // End of noticeDetailView();






/* 상세 화면 그리기 */
function showReportDetail() {





	let formId = storage.reportDetailData.formId;
	let testForm = storage.reportDetailData.doc;


	let detailHtml = "<div class='mainBtnDiv'><button type='button' name='approvalBtn' onclick='showAppModal()'>결재하기</button>" +
		"<button type='button' onclick='showGwModal()'>결재선 수정</button>" +
		"<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>문서 수정</button></div>" +
		"<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='referDiv'><label>참조</label><div class='selectedRefer'></div></div><div class='selectedFile'></div></div><div class='comment'></div></div>"


	$(".listPageDiv").html(detailHtml);



	let selectedFileView = "<label>첨부파일</label><div><div><input class='inputFile' multiple name='attached[]'type='file' onchange='setSelectedFiles()'/></div><div class='selectedFileDiv'></div></div>"


	$(".seletedForm").html(testForm);
	$(".selectedFile").html(selectedFileView);
	$(":file").css("display", "none");// 첨부파일 버튼 숨기기 



	let tabHtml = "<div class='reportInfoTab'>" +
		"<label id='lineInfo' onclick='changeTab(this)'>문서정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
		"<div id='tabDetail'></div><div id='tabDetail2'></div>"
	$(".comment").html(tabHtml);


	toReadMode();
	drawCommentLine();
	getFileArr();

	// 참조 데이터 추가 
	let referArr = new Array();

	for (let i = 0; i < storage.reportDetailData.appLine.length; i++) {
		if (storage.reportDetailData.appLine[i].appType == '4') {
			referArr.push(storage.reportDetailData.appLine[i]);
		}
	}



	let referTarget = $(".selectedRefer");
	let referHtml = "";
	for (let i = 0; i < referArr.length; i++) {
		let id = referArr[i].employee;
		referHtml += "<div class='appendName " + formId + "_refer' data-detail='" + storage.user[id].userNo + "'>" + storage.userRank[storage.user[id].rank][0] + "&nbsp" + storage.user[id].userName + "</div>";

	}

	referTarget.html(referHtml);



	// dataset > input value 적용 
	let target = $(".seletedForm")[0];
	let inputsArr = target.getElementsByTagName("input");

	for (let i = 0; i < inputsArr.length; i++) {
		if (inputsArr[i].dataset.detail !== undefined) {
			inputsArr[i].value = inputsArr[i].dataset.detail;
		}
	}

	let textAreaArr = target.getElementsByTagName("textarea")[0];
	textAreaArr.value = textAreaArr.dataset.detail;



	// 상세타입 체크하게 하기
	let rd = $("input[name='" + formId + "_RD']");
	for (let i = 0; i < rd.length; i++) {
		if (rd[i].dataset.detail == "on") {
			$("#" + rd[i].id).prop("checked", true);
		}
	}
	$("input[name='" + formId + "_RD']").prop("disabled", true);



	// 이름 , 직급 한글로 설정하기 
	let subTitlesArr = ["_examine", "_approval", "_agree", "_conduct"];
	for (let i = 0; i < subTitlesArr.length; i++) {
		if ($("." + formId + subTitlesArr[i]).val() != undefined) {
			for (let j = 0; j < $("." + formId + subTitlesArr[i]).length; j++) {
				$("." + formId + subTitlesArr[i])[j].value = storage.user[$("." + formId + subTitlesArr[i])[j].value].userName;
				$("." + formId + subTitlesArr[i] + "_position")[j].value = storage.userRank[$("." + formId + subTitlesArr[i] + "_position")[j].value][0];

			}
		}
	}





	storage.oriCbContainer = $("input[name='" + formId + "_RD']:checked").attr("id");
	storage.oriInsertedContent = $(".insertedContent").html();
	storage.oriInsertedDataList = $(".insertedDataList").html();
	storage.oriInfoData = $(".info").html();


	// 영업기회 리스트 가져옴 
	$.ajax({
		url: "/api/sopp",
		type: "get",
		dataType: "json",
		success: (result) => {
			if (result.result == "ok") {
				let jsondata;
				jsondata = cipher.decAes(result.data);
				jsondata = JSON.parse(jsondata);
				storage.soppList = jsondata;
			} else {
				alert("에러");
			}
		},
	});



}



//결재정보 추가 
// function setOriginLineData() {s
// 	let originLineData = storage.reportDetailData.appLine;
// 	let appTitle = ["examine", "agree", "approval", "conduct"];
// 	let appContainer = [[], [], [], [], []];

// 	for (let i = 0; i < originLineData.length; i++) {
// 		if (originLineData[i] == 0) {
// 			appContainer[0].push(originLineData[i]);
// 		} else if (originLineData[i] == 1) {
// 			appContainer[1].push(originLineData[i]);
// 		} else if (originLineData[i] == 2) {
// 			appContainer[2].push(originLineData[i]);
// 		} else if (originLineData[i] == 3) {
// 			appContainer[3].push(originLineData[i]);
// 		} else if (originLineData[i] == 4) {
// 			appContainer[4].push(originLineData[i]);
// 		}
// 	}



// 	for (let i = 1; i < originLineData.length; i++) {
// 		for (let j = 0; j < appTitle.length; j++) {
// 			if (originLineData[i].appType == j) {
// 				if (originLineData[i].approved != null) {

// 				}


// 			}
// 		}


// 	}

// }






// 첨부파일 다운로드  
function getFileArr() {
	let target = $(".selectedFileDiv");
	let html = "";
	let originFileList = [];
	let no = storage.reportDetailData.no;
	let fileList = storage.reportDetailData.fileList;
	if (storage.newFileData == undefined) {

		for (let i = 0; i < fileList.length; i++) {
			html += "<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(fileList[i].fileName) + "'>" + fileList[i].fileName + "</a></div>";
		}
		target.html(html);
	} else {
		for (let i = 0; i < storage.newFileData.length; i++) {
			for (let j = 0; j < fileList.length; j++) {
				originFileList.push(fileList[j].fileName);
			}
			if (originFileList.includes(storage.newFileData[i])) {
				html += "<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(storage.newFileData[i]) + "'>" + storage.newFileData[i] + "</a></div>";
			} else {
				html += "<div style='color:navy'>" + storage.newFileData[i] + "</div>";
			}

		}
		target.html(html);
	}


}

// 문서 수정시 첨부파일목록 수정 
function getFileModArr() {
	let target = $(".selectedFileDiv");
	let html = ""
	if (storage.newFileData == undefined || storage.newFileData.length == 0) {
		let fileList = storage.reportDetailData.fileList;

		for (let i = 0; i < fileList.length; i++) {
			html += "<div><div class='files' data-detail='" + fileList[i].fileName + "'>" + fileList[i].fileName + "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
		}
		target.html(html);
	} else {
		for (let i = 0; i < storage.newFileData.length; i++) {
			html += "<div><div class='files' data-detail='" + storage.newFileData[i] + "'>" + storage.newFileData[i] + "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
		}
		target.html(html);
	}


}

function fileRemove(obj) {
	let value = obj.parentElement.dataset.detail;
	storage.newFileData = storage.newFileData.filter((element) => element != value);
	obj.parentElement.remove();
}



// 탭 누를때마다의 이벤트 주기 
function changeTab(obj) {

	$(obj).css("background-color", "#62a6ad");
	$(obj).css("color", "#fff");
	$(obj).css("border-top-left", "14px");
	//$(obj).css("border-bottom", "2px solid #5298d5");

	if (obj.id == 'lineInfo') {

		$("#changeInfo").css("background-color", "#dddddd");
		$("#changeInfo").css("color", "#5c5c5c");
		$("#changeInfo").css("border-bottom-left-radius", "20px");
		$("#tabDetail2").hide();
		$("#tabDetail").show();
		if (storage.newAppLine == undefined) {
			drawCommentLine();
		} else {
			drawNewCommentLine();
		}


	} else if (obj.id = 'changeInfo') {
		$("#lineInfo").css("background-color", "#dddddd");
		$("#lineInfo").css("color", "#5c5c5c");
		$("#lineInfo").css("border-bottom-right-radius", "20px");
		$("#tabDetail").hide();
		$("#tabDetail2").show();

		drawChangeInfo();

	}
}


// 문서 정보 그리는 함수 
function drawCommentLine() {

	let target = $("#tabDetail");
	let appLine = storage.reportDetailData.appLine;
	let appLineArr = new Array();
	let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"]
	for (let i = 1; i < appLine.length; i++) {
		let date, status, comment;

		if (appLine[i].approved == null && appLine[i].rejected == null) {
			if (appLine[i].read != null) {
				date = appLine[i].read;
				date = getYmdSlash(date);
				status = "조회";
			} else if (appLine[i].read == null) {
				date = "";
				status = "";
			}

		} else if (appLine[i].approved != null) {
			date = appLine[i].approved;
			date = getYmdSlash(date);
			status = "승인";
		} else if (appLine[i].rejected != null) {
			date = appLine[i].rejected;
			date = getYmdSlash(date);
			status = "반려";
		}

		if (appLine[i].comment == "null") {
			comment = "";
		} else {
			comment = appLine[i].comment;
		}

		let data = {
			"appType": appTypeTitle[appLine[i].appType],
			"name": storage.user[appLine[i].employee].userName,
			"status": status,
			"date": date,
			"comment": comment,
		}

		appLineArr.push(data);

	}

	let html = "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled/>작성자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled/>열람 설정 없음</label></div></div>"
	let detail = "<div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
	let lineDetailHtml = "";
	for (let i = 0; i < appLineArr.length; i++) {
		lineDetailHtml += "<div class='tapLine examineLine'><div>" + appLineArr[i].appType + "</div><div>" + appLineArr[i].name + "</div><div>" + appLineArr[i].status + "</div><div>" + appLineArr[i].date + "</div><div>" + appLineArr[i].comment + "</div></div>";
	}

	detail += lineDetailHtml;

	html += detail;

	$(".tabLine").children(0).css("padding", "5em");

	target.html(html);


	// 열람 권한 체크하기 
	let readable = storage.reportDetailData.readable;
	if (readable == "dept") {
		$("#deptRd").prop("checked", true);
	} else if (readable == "none") {
		$("#noneRd").prop("checked", true);
	}


}


function drawNewCommentLine() {
	let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"];
	let appLine = storage.reportDetailData.appLine;
	let my = storage.my;
	let originAppLine = [];
	let appLineArr = [];

	for (let i = 0; i < appLine.length; i++) {
		if (appLine[i].employee == my) {
			originAppLine = appLine.slice(0, (i + 1));
			myIndex = i;
		}
	}



	for (let i = 0; i < originAppLine.length; i++) {
		let date, status, comment;

		if (appLine[i].approved == null && appLine[i].rejected == null) {
			if (appLine[i].read != null) {
				date = appLine[i].read;
				date = getYmdSlash(date);
				status = "조회";
			} else if (appLine[i].read == null) {
				date = "";
				status = "";
			}

		} else if (appLine[i].approved != null) {
			date = appLine[i].approved;
			date = getYmdSlash(date);
			status = "승인";
		} else if (appLine[i].rejected != null) {
			date = appLine[i].rejected;
			date = getYmdSlash(date);
			status = "반려";
		}

		if (appLine[i].comment == "null") {
			comment = "";
		} else {
			comment = appLine[i].comment;
		}

		let data = {
			"appType": appTypeTitle[appLine[i].appType],
			"name": storage.user[appLine[i].employee].userName,
			"status": status,
			"date": date,
			"comment": comment,
		}

		appLineArr.push(data);

	}
	let newData = storage.newAppLine;



	for (let i = originAppLine.length; i < newData.length; i++) {
		let data = {
			"appType": appTypeTitle[newData[i][0]],
			"name": storage.user[newData[i][1]].userName,
			"status": "",
			"date": "",
			"comment": "",
		}
		appLineArr.push(data);
	}

	console.log(appLineArr);

	let html = "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled/>작성자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled/>열람 설정 없음</label></div></div>"
	let detail = "<div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
	let lineDetailHtml = "";
	for (let i = 0; i < appLineArr.length; i++) {
		lineDetailHtml += "<div class='tapLine examineLine'><div>" + appLineArr[i].appType + "</div><div>" + appLineArr[i].name + "</div><div>" + appLineArr[i].status + "</div><div>" + appLineArr[i].date + "</div><div>" + appLineArr[i].comment + "</div></div>";
	}
	detail += lineDetailHtml;
	html += detail;
	// 열람 권한 체크하기 

	$("#tabDetail").html(html);
	let readable = storage.reportDetailData.readable;
	if (readable == "dept") {
		$("#deptRd").prop("checked", true);
	} else if (readable == "none") {
		$("#noneRd").prop("checked", true);
	}


}



//  변경이력 그리는 함수 ajax로 변경 이력 받아옴 
function drawChangeInfo() {
	let target = $("#tabDetail2");
	// 임시 데이터 ----------------------------------------------------


	let changeData = [{
		"type": "검토",
		"name": "구민주",
		"modifyDate": "22-08-18 10:34:46",
		"modCause": " 거래처 수정 "
	},
	{
		"type": "검토",
		"name": "이송현",
		"modifyDate": "22-08-19 10:34:46",
		"modCause": "수정 완 "
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


// 모달별 버튼  
function closeModal(obj) {
	$(".modal-wrap").hide();
	$("input:radio[name='type']").prop("checked", false);
}


//결재하기 모달 
function showAppModal() {

	// 결재하기 누르면 결재정보 창으로 세팅되어서 추가하는 것 
	$("#lineInfo").css("background-color", "#332E85");
	$("#lineInfo").css("color", "white");
	$("#lineInfo").css("border", "none");

	$("#changeInfo").css("background-color", "white");
	$("#changeInfo").css("color", "#332E85");
	$("#changeInfo").css("border-bottom", "2px solid #332E85");
	$("#tabDetail").show();
	$("#tabDetail2").hide();

	let setAppModalHtml = "<div class='setApprovalModal'>" +
		"<div class='modal-title'>결재하기</div>" +
		"<div class='modal-body'><div class='labelContainer'>" +
		"<label><input type='radio' name='type'  value='approve' checked>승인</label>" +
		"<label><input type='radio' name='type' value='reject'>반려</label></div>" +
		"<label>의견 <textarea class='approvalComment'></textarea></label></div>" +
		"<div class='close-wrap'>" +
		"<button id='quit' onclick='closeModal(this)'>취소</button>" +
		"<button id='set' onclick='approveBtnEvent()'>결재</button></div></div>";
	$(".modal-wrap").html(setAppModalHtml);
	$(".modal-wrap").show();

	// $(".setApprovalModal").show();
	// $(".setModifyModal").hide();

}


// 결재 타입 값 받아서 결재하기 
function approveBtnEvent() {
	let formId = storage.reportDetailData.formId;
	let selectVal = $(":radio[name='type']:checked").val();
	let comment = $(".approvalComment").val();
	$(".modal-wrap").hide();
	let type;
	let appLine = storage.reportDetailData.appLine;
	let ordered;


	for (let i = 0; i < appLine.length; i++) {
		if (appLine[i].employee == storage.my) {
			ordered = appLine[i].ordered;
			if (storage.newAppLine != undefined) {
				storage.newAppLine = storage.newAppLine.slice((i + 1), storage.newAppLine.length);
			} else {
				storage.newAppLine = null;
			}

		}
	}

	let slistid = "infoSopp";
	let soppVal = $("#" + formId + "_sopp").val();
	let soppResult = dataListFormat(slistid, soppVal) + "";

	let clistid = "infoCustomer";
	let customerVal = $("#" + formId + "_infoCustomer").val();
	let customerResult = dataListFormat(clistid, customerVal) + "";

	if (storage.reportDetailData.sopp == soppResult && storage.reportDetailData.customer == customerResult &&
		storage.oriCbContainer == $("input[name='" + formId + "_RD']:checked").attr("id") &&
		storage.oriInsertedContent == $(".insertedContent").html() &&
		storage.oriInsertedDataList == $(".insertedDataList").html()) {
		storage.newDoc = null;
	} else {
		storage.newDoc = $(".seletedForm").html();
	}


	if (storage.reportDetailData.sopp = soppResult) {
		soppResult = null;
	}

	if (storage.reportDetailData.customer == customerResult) {
		customerResult = null;
	}

	selectVal === "approve" ? type = 1 : type = 0;
	storage.newFileData == undefined ? storage.newFileData = null : storage.newFileData = storage.newFileData;

	let title = $("#" + formId + "_title").val();
	if (storage.reportDetailData.title == title) {
		title = null;
	}
	let data = {
		"doc": storage.newDoc,
		"comment": comment,
		"files": storage.newFileData,
		"appLine": storage.newAppLine,
		"sopp": soppResult,
		"customer": customerResult,
		"title": title
	}

	console.log(data);
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	$.ajax({
		url: apiServer + "/api/gw/app/proceed/" + storage.reportDetailData.docNo + "/" + ordered + "/" + type,
		method: "post",
		dataType: "json",
		data: data,
		contentType: "text/plain",
		cache: false,
		success: (data) => {
			if (data.result === "ok") {
				alert("결재 완료");
			} else {
				alert("결재 실패");
			}
		}
	})



}


//결재선 수정 모달 
function showGwModal() {

	let setGwModalHtml = "<div class='gwModal'>" +
		"<div class='modal-title'>결재선 수정( * 현재 결재 단계 이후만 추가/삭제 가능)</div>" +
		"<div class='lineDetail'>" +
		"<div class='lineTop'>" +
		"<div class='innerDetail' id='lineLeft'></div>" +
		"<div class='innerDetail' id='lineCenter'>" +
		"<button class='appTypeBtn'  onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
		"<button class='appTypeBtn'  onclick='check(this.value)' value='agree'>합의 &gt;</button>" +
		"<button class='appTypeBtn'  onclick='check(this.value)' value='approval'>결재 &gt;</button>" +
		"<button class='appTypeBtn'  onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
		"<button class='appTypeBtn'  onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
		"<div class='innerDetail' id='lineRight'>" +
		"<div></div>" +
		"<div><div>검토</div>" +
		"<div class='typeContainer' id='examine'></div></div>" +
		"<div><div>합의</div>" +
		"<div class='typeContainer' id='agree'></div></div>" +
		"<div><div>결재</div>" +
		"<div class='typeContainer' id='approval'></div></div>" +
		"<div><div>수신</div>" +
		"<div class='typeContainer' id='conduct'></div></div>" +
		"<div><div>참조</div>" +
		"<div class='typeContainer' id='refer'></div></div>" +
		"</div>" +
		"</div>" +
		"</div>" +
		"<div class='close-wrap'>" +
		" <button id='close' onclick='closeGwModal(this)'>취소</button>" +
		" <button id='modify' onclick='closeGwModal(this)'>생성</button>" +
		"</div>" +
		"</div>" +
		"</div>";
	$(".modal-wrap").html(setGwModalHtml);

	let orgChartTarget = $("#lineLeft");
	let userData = new Array();
	let x;
	let my = storage.my;
	//나는 결재선에 노출 안 되게 함 
	for (x in storage.user) {
		if (x != my) {
			userData.push(x);
		}
	}

	let innerHtml = "";
	for (let i = 0; i < userData.length; i++) {
		innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + userData[i] + "' name='userNames' value='" + userData[i] + "'><label for='cb" + userData[i] + "'>" + storage.user[userData[i]].userName + "</label></div>"
	}
	orgChartTarget.html(innerHtml);
	$(".modal-wrap").show();
	setDefaultModalData();

}


function setDefaultModalData() {
	let appLine = storage.reportDetailData.appLine;

	let x;
	let userData = new Array();
	let my;
	my = storage.my;
	//나는 결재선에 노출 안 되게 함 
	for (x in storage.user) {
		if (x != my) {
			userData.push(x);
		}
	}

	let myTurn;
	let myappType;
	for (let i = 0; i < appLine.length; i++) {
		if (appLine[i].employee == my) {
			myTurn = appLine[i].ordered;
			myappType = appLine[i].appType;
		}
	}

	//내 결재 권한 이후만 수정할 수 있음 
	let btns = $(".appTypeBtn");
	console.log(myappType);
	for (let i = btns.length - 1; i >= 0; i--) {
		if (i < myappType) {
			$(".appTypeBtn")[i].remove();
			$(".typeContainer")[i].parentElement.remove();
		}
	}

	let html = "";
	let html1 = "";
	let html2 = "";
	let html3 = "";
	let html4 = "";


	// 내 이후의 결재선만 출력함 
	for (let i = 1; i < appLine.length; i++) {
		if (Number(appLine[i].ordered) > Number(myTurn)) {
			if (appLine[i].appType == 0) {
				html += "<div class='lineDataContainer' id='lineContainer_" + appLine[i].employee + "'><label id='linedata_" + appLine[i].employee + "'>" + storage.user[appLine[i].employee].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + appLine[i].employee + "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
			} else if (appLine[i].appType == 1) {
				html1 += "<div class='lineDataContainer' id='lineContainer_" + appLine[i].employee + "'><label id='linedata_" + appLine[i].employee + "'>" + storage.user[appLine[i].employee].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + appLine[i].employee + "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
			} else if (appLine[i].appType == 2) {
				html2 += "<div class='lineDataContainer' id='lineContainer_" + appLine[i].employee + "'><label id='linedata_" + appLine[i].employee + "'>" + storage.user[appLine[i].employee].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + appLine[i].employee + "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
			} else if (appLine[i].appType == 3) {
				html3 += "<div class='lineDataContainer' id='lineContainer_" + appLine[i].employee + "'><label id='linedata_" + appLine[i].employee + "'>" + storage.user[appLine[i].employee].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + appLine[i].employee + "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
			} else if (appLine[i].appType == 4) {
				html4 += "<div class='lineDataContainer' id='lineContainer_" + appLine[i].employee + "'><label id='linedata_" + appLine[i].employee + "'>" + storage.user[appLine[i].employee].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + appLine[i].employee + "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
			}
			$(".typeContainer")[0].innerHTML = html;
			$(".typeContainer")[1].innerHTML = html1;
			$(".typeContainer")[2].innerHTML = html2;
			$(".typeContainer")[3].innerHTML = html3;
			$(".typeContainer")[4].innerHTML = html4;

		}


	}
}



function closeGwModal(obj) {
	let id = obj.id;
	if (id == "close") {
		$(".modal-wrap").hide();
	} else if (id == 'modify') {
		let appLine = storage.reportDetailData.appLine;
		let originLine;
		let my = storage.my;

		let myOrdered;
		for (let i = 0; i < appLine.length; i++) {
			if (appLine[i].employee == my) {
				myOrdered = appLine[i].ordered;
				originLine = appLine.slice(0, i + 1);
			}
		}


		let combineData = [];


		// 기존 데이터 넣기 
		for (let i = 0; i < appLine.length; i++) {
			if (appLine[i].ordered <= Number(myOrdered)) {
				combineData.push([appLine[i].appType, appLine[i].employee + ""]);
			}
		}

		let target = $(".typeContainer");


		for (let i = 0; i < target.length; i++) {

			for (let j = 0; j < target[i].children.length; j++) {
				let id = (target[i].children[j].id).split("_")[1];
				let targetId = target[i].id;

				if (targetId == "examine") {
					targetId = 0;

				} else if (targetId == "agree") {
					targetId = 1;
				} else if (targetId == "approval") {
					targetId = 2;

				}
				else if (targetId == "conduct") {
					targetId = 3;
				}
				else if (targetId == "refer") {
					targetId = 4;
				}

				combineData.push([targetId, id]);
			}

		}

		storage.newAppLine = combineData;

		$(".modal-wrap").hide();
		createNewLine();
		$(".inputsAuto").css("background-color", "white");
		drawNewCommentLine();
	}
}


function createNewLine() {
	let formId = storage.reportDetailData.formId;
	let lineTarget = $(".infoline")[0].children[1];
	lineTarget = $("#" + lineTarget.id);
	lineTarget.html("");
	lineTarget.css("display", "block");
	let newAppLine = storage.newAppLine;
	let newCombine = [[], [], [], [], []];

	for (let i = 0; i < newAppLine.length; i++) {
		for (let j = 0; j < newCombine.length; j++) {
			if (i > 0 && newAppLine[i][0] == j) {
				newCombine[j].push(newAppLine[i][1]);
			}
		}
	}


	let testHtml = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" + storage.userRank[storage.user[storage.newAppLine[0][1]].rank][0] + "'></div>" +
		"<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" + storage.user[storage.newAppLine[0][1]].userName + "'></div>" +
		"<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='승인'></div>" +
		"<div class='dateBorder'><input type='text' class='inputsAuto' disabled value='" + getYmdSlashShort(storage.reportDetailData.appLine[0].read) + "'></div></div></div>";
	let testHtml2 = "<div class='lineGridContainer'>";
	let referHtml = "";
	let titleArr = ["검토", "합의", "결재", "수신", "참조"];
	let titleId = ["examine", "agree", "approval", "conduct", "refer"]

	for (let i = 0; i < newCombine.length; i++) {
		if (newCombine[i].length != 0 && i < 3) { // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우 
			testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
		} else if (newCombine[i].length != 0 != 0 && i == 3) { // 결재타입이 수신인 경우 
			testHtml2 += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
		}


		for (let j = 0; j < newCombine[i].length; j++) {

			// 수신 
			if (i == 3) {
				testHtml2 += "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='" + storage.userRank[storage.user[newCombine[i][j]].rank][0] + "' data-detail='" + storage.user[newCombine[i][j]].rank + "'/></div>" +
					"<div class='twoBorder'><input type='text' disabled class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[newCombine[i][j]].userName + "' data-detail='" + storage.user[newCombine[i][j]].userNo + "'/></div>" +
					"<div class='twoBorder'><input type='text'  disabled class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
					"<div class='dateBorder'><input type='text' disabled class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
			}

			// 참조 
			else if (i == 4) {
				referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "' data-detail='" + storage.user[newCombine[i][j]].userNo + "'>" + storage.userRank[storage.user[newCombine[i][j]].rank][0] + "&nbsp" + storage.user[newCombine[i][j]].userName + "</div>";
			}

			// 검토 합의 결재 
			else {
				testHtml += "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='" + storage.userRank[storage.user[newCombine[i][j]].rank][0] + "' data-detail='" + storage.user[newCombine[i][j]].rank + "'/></div>" +
					"<div class='twoBorder'><input type='text' disabled class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[newCombine[i][j]].userName + "' data-detail='" + storage.user[newCombine[i][j]].userNo + "'/></div>" +
					"<div class='twoBorder'><input type='text'disabled class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
					"<div class='dateBorder'><input type='text' disabled  class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
			}

		}


		if (newCombine[i].length != 0 && i < 3) {
			testHtml += "</div>";
		} else if (newCombine[i].length != 0 && i == 3) {
			testHtml2 += "</div>";
		}
	}

	testHtml += "</div>";
	testHtml2 += "</div>";

	testHtml += testHtml2;
	lineTarget.html(testHtml);

	$(".selectedRefer").html(referHtml);


}

function check(name) {
	let inputLength = $(".testClass");
	let target = $("#" + name);
	let html = target.html();
	let selectHtml = "";

	let x;
	let userData = new Array();
	let my;
	my = storage.my;
	//나는 결재선에 노출 안 되게 함 
	for (x in storage.user) {
		if (x != my) {
			userData.push(x);
		}
	}

	for (let i = 0; i < inputLength.length; i++) {
		let id = (inputLength[i].id).substring(2, inputLength[i].id.length);
		if ($("#cb" + id).prop('checked')) {
			if (document.getElementById("linedata_" + id) == null) {
				selectHtml += "<div class='lineDataContainer' id='lineContainer_" + id + "'><label id='linedata_" + id + "'>" + storage.user[id].userName + "</label><button value='" + id + "' onclick='upClick(this)'>▲</button><button  value='" + id + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
			}
		}
	}

	html += selectHtml;
	target.html(html)

	$(".testClass").prop('checked', false);
} //End of check(name) 

//// 조직도 결재 순서 
function upClick(obj) {
	let parent;
	parent = obj.parentElement;
	parent = parent.parentElement;
	let target = $("#" + parent.id);
	let list = parent.children;

	let numArr = new Array();
	for (let i = 0; i < list.length; i++) {
		let id = list[i].id;
		let idArr = id.split("_");
		numArr.push(idArr[1]);
	}

	for (let i = 0; i < numArr.length; i++) {
		if (obj.value == numArr[i] && i != 0) {
			let temp = numArr[i];
			numArr[i] = numArr[i - 1];
			numArr[i - 1] = temp;
		}
	}

	let data = new Array();
	let x;
	let my = storage.my;
	//나는 결재선에 노출 안 되게 함 
	for (x in storage.user) {
		if (x != my) {
			data.push(x);
		}
	}

	let selectHtml = "";
	for (let i = 0; i < numArr.length; i++) {
		selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[numArr[i]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
	}

	target.html(selectHtml);
}// End of upClick(obj); 


function downClick(obj) {
	let parent;
	parent = obj.parentNode;
	parent = parent.parentNode;
	let target = $("#" + parent.id);
	let list = parent.children;

	let numArr = new Array();
	for (let i = 0; i < list.length; i++) {
		let id = list[i].id;
		let idArr = id.split("_");
		numArr.push(idArr[1]);
	}

	for (let i = numArr.length - 1; i >= 0; i--) {
		if (obj.value == numArr[i] && i != numArr.length - 1) {
			let temp = numArr[i];
			numArr[i] = numArr[i + 1];
			numArr[i + 1] = temp;
		}
	}

	let data = new Array();
	let x;
	let my = storage.my;
	//나는 결재선에 노출 안 되게 함 
	for (x in storage.user) {
		if (x != my) {
			data.push(x);
		}
	}

	let selectHtml = "";
	for (let i = 0; i < numArr.length; i++) {
		selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[numArr[i]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
	}

	target.html(selectHtml);
} // End of downClick(obj) 


function deleteClick(obj) {
	let parent;
	parent = obj.parentElement;
	parent.remove();
} // End of deleteClign(obj); 

function setSavedLine(obj) {
	let val = obj.value;
	if (val == 'middle') {
		$("#examine").html("<div class='lineDataContainer' id='lineContainer_4'><label id='linedata4'>구민주</label><button value='4' onclick='upClick(this)'>▲</button><button  value='4'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
		$("#approval").html("<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
		$("#agree").html("");
		$("#conduct").html("");
		$("#refer").html("");
	} else if (val == 'basic') {
		$("#approval").html("<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
		$("#agree").html("");
		$("#examine").html("");
		$("#conduct").html("")
		$("#refer").html("");
	}

}


// 문서 수정 취소 함수 
function quitModify() {

	let formId = storage.reportDetailData.formId;
	$("button[name='modConfirm']:last-child").remove();
	$("button[name='modConfirm']:last-child").remove();

	toReadMode();
	$(":file").css("display", "none");
	$("button[name='approvalBtn']")[0].disabled = false;
	$(".info").html(storage.oriInfoData);
	$("#" + storage.oriCbContainer).prop("checked", true);
	$(".insertedContent").html(storage.oriInsertedContent);
	$(".insertedDataList").html(storage.oriInsertedDataList);
	let target = $(".seletedForm")[0];
	let inputsArr = target.getElementsByTagName("input");

	for (let i = 0; i < inputsArr.length; i++) {
		if (inputsArr[i].dataset.detail !== undefined) {
			inputsArr[i].value = inputsArr[i].dataset.detail;
		}
	}

	let textAreaArr = target.getElementsByTagName("textarea")[0];
	textAreaArr.value = textAreaArr.dataset.detail;


	// 이름 , 직급 한글로 설정하기 
	let subTitlesArr = ["_examine", "_approval", "_agree", "_conduct"];
	for (let i = 0; i < subTitlesArr.length; i++) {
		if ($("." + formId + subTitlesArr[i]).val() != undefined) {
			for (let j = 0; j < $("." + formId + subTitlesArr[i]).length; j++) {
				$("." + formId + subTitlesArr[i])[j].value = storage.user[$("." + formId + subTitlesArr[i])[j].value].userName;
				$("." + formId + subTitlesArr[i] + "_position")[j].value = storage.userRank[$("." + formId + subTitlesArr[i] + "_position")[j].value][0];

			}
		}
	}


	let fileTarget = $(".selectedFileDiv");
	let html = "";
	let no = storage.reportDetailData.no;
	let fileList = storage.reportDetailData.fileList;

	for (let i = 0; i < fileList.length; i++) {
		html += "<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(fileList[i].fileName) + "'>" + fileList[i].fileName + "</a></div>";
	}

	fileTarget.html(html);





}


// 문서 수정시 변경이력에 반영 
function reportModify(obj) {
	$(".modal-wrap").hide();
	$("button[name='modConfirm']:last-child").remove();
	$("button[name='modConfirm']:last-child").remove();

	$(":file").css("display", "none");
	getFileArr();
	toReadMode();
	$("button[name='approvalBtn']")[0].disabled = false;


}


//문서 수정 버튼 누르면 수정 완료 버튼 생성 
function createConfirmBtn(obj) {
	let div = document.getElementsByClassName("mainBtnDiv")
	if (div[0].childElementCount < 4) {
		$(".mainBtnDiv").append("<button type='button'name='modConfirm' onclick='reportModify()' >수정완료 </button>" +
			"<button type='button'name='modConfirm' onclick='quitModify()'>문서 수정 초기화</button>");
	}
	$(":file").css("display", "inline");
	getFileModArr();

	storage.newFileData = [];
	for (let i = 0; i < $(".files").length; i++) {
		storage.newFileData.push($(".files")[i].dataset.detail);
	}

	///결재하기 버튼 disabled  

	$("button[name='approvalBtn']")[0].disabled = true;

}

function getYmdSlash(date) {
	let d = new Date(date);
	return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) + "&nbsp" + (d.getHours() > 9 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + (d.getMinutes() > 9 ? d.getMinutes().toString() : "0" + d.getMinutes().toString()) + ":" + (d.getSeconds() > 9 ? d.getSeconds().toString() : "0" + d.getSeconds().toString());
}


function getYmdSlashShort(date) {
	let d = new Date(date);
	return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}




function setSelectedFiles() {
	let method, data, type, attached;
	attached = $(document).find("[name='attached[]']")[0].files;

	if (storage.newFileData === undefined || storage.newFileData <= 0) {
		storage.newFileData = [];
	}


	let fileDataArray = storage.newFileData;
	for (let i = 0; i < attached.length; i++) {
		let reader = new FileReader();
		let fileName;

		fileName = attached[i].name;

		// 파일 중복 등록 제거 
		if (!storage.newFileData.includes(fileName)) {
			storage.newFileData.push(fileName);

			reader.onload = (e) => {
				let binary, x, fData = e.target.result;
				const bytes = new Uint8Array(fData);
				binary = "";
				for (x = 0; x < bytes.byteLength; x++) binary += String.fromCharCode(bytes[x]);
				let fileData = cipher.encAes(btoa(binary));
				let fullData = (fileName + "\r\n" + fileData);

				let url = "/api/attached/docapp"
				url = url;
				method = "post";
				data = fullData;
				type = "insert";

				crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
			}

			reader.readAsArrayBuffer(attached[i]);
		}
	}


	let html = "";

	for (let i = 0; i < fileDataArray.length; i++) {
		html += "<div><div class='files' data-detail='" + fileDataArray[i] + "'>" + fileDataArray[i] + "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
	}
	$(".selectedFileDiv").html(html);

}



function getSopp() {
	let formId = storage.reportDetailData.formId;
	let slistid = "infoSopp";
	let soppVal = $("#" + formId + "_sopp").val();
	let soppResult = dataListFormat(slistid, soppVal);
	storage.sopp = soppResult;
	let clistid = "infoCustomer";
	let customerVal = $("#" + formId + "_infoCustomer").val();
	let customerResult = dataListFormat(clistid, customerVal);
	storage.customer = customerResult;
}



