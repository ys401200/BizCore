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
		let status;
		if (jsonData[i].status == 1) {
			status = "진행 중";
		} else if (jsonData[i].status == 2) {
			status = "수신 대기 ";
		} else if (jsonData[i].status == 3) {
			status = "승인 완료";
		} else if (jsonData[i].status == -3) {
			status = "반려";
		}

		str = [

			{
				"setData": jsonData[i].docNo,
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
			{
				"setData": status
			}

		]

		fnc = "waitDetailView(this)";
		ids.push(jsonData[i].docNo);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeApproval", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);




}// End of drawNoticeApproval()




function waitDetailView(obj) {// 선택한 그리드의 글 번호 받아오기 


	let no = obj.dataset.id;



	$.ajax({
		"url": apiServer + "/api/gw/app/doc/" + no,
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


	let detailHtml = "<div class='mainBtnDiv'><button type='button'>목록보기</button>" +
		"<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>결재 취소</button></div>" +
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


	setAppLineData();

}







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





//  변경이력 그리는 함수 
function drawChangeInfo() {
	let target = $("#tabDetail2");

	let revisionData = storage.reportDetailData.revisionHistory;
	let changeData = new Array();
	if (revisionData.length > 0) {
		for (let i = 0; i < revisionData.length; i++) {
			let modCause = "";
			if (revisionData[i].content.doc == true) {
				modCause += "문서 수정 "
			}
			if (revisionData[i].content.files == true) {
				modCause += "첨부 파일 수정 "
			} if (revisionData[i].content.content == true) {
				modCause += "결재선 수정 "
			}

			revisionData[i].content.date
			revisionData[i].content.content


			let data = {
				"type": "",
				"name": storage.user[revisionData[i].employee].userName,
				"modifyDate": getYmdSlash(revisionData[i].date),
				"modCause": modCause
			}
			changeData.push(data);
		}
	}

	let detail = "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
	let changeHtml = "";

	if (changeData.length == 0) {
		changeHtml += "<div>변경 이력이 없습니다</div>";
	} else {
		for (let i = 0; i < changeData.length; i++) {
			changeHtml += "<div class='tapLineB changeDataLine'>" +
				"<div class='changeType'>" + changeData[i].type + "</div><div class='changeName' >" + changeData[i].name + "</div><div class='changeDate'>" + changeData[i].modifyDate + "</div><div class='changeCause'>" + changeData[i].modCause + "</div>" +
				"</div>"
		}
	}

	detail += changeHtml;
	target.html(detail);

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

function setAppLineData() {
	let appLine = storage.reportDetailData.appLine;
	let formId = storage.reportDetailData.formId;
	let appLineContainer = new Array();
	appLineContainer = [[], [], [], [], []];

	for (let i = 1; i < appLine.length; i++) {
		for (let j = 0; j < appLineContainer.length; j++) {
			if (appLine[i].appType == j) {
				appLineContainer[j].push(appLine[i]);
			}
		}
	}

	let appTypeTitles = ["_examine", "_agree", "_approval", "_conduct", "_refer"];

	for (let i = 0; i < appLineContainer.length; i++) {
		for (let j = 0; j < appLineContainer[i].length; j++) {
			if (appLineContainer[i][j].approved != null) {
				$("." + formId + appTypeTitles[i] + "_status")[j].value = "승인";
				$("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdShortSlash(appLineContainer[i][j].approved);
			} else if (appLineContainer[i][j].rejected != null) {
				$("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
				$("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdShortSlash(appLineContainer[i][j].rejected);
			}
		}
	}

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



function setAppLineData() {
	let appLine = storage.reportDetailData.appLine;
	let formId = storage.reportDetailData.formId;
	let appLineContainer = new Array();
	appLineContainer = [[], [], [], [], []];

	for (let i = 1; i < appLine.length; i++) {
		for (let j = 0; j < appLineContainer.length; j++) {
			if (appLine[i].appType == j) {
				appLineContainer[j].push(appLine[i]);
			}
		}
	}

	let appTypeTitles = ["_examine", "_agree", "_approval", "_conduct", "_refer"];

	for (let i = 0; i < appLineContainer.length; i++) {
		for (let j = 0; j < appLineContainer[i].length; j++) {
			if (appLineContainer[i][j].approved != null) {
				$("." + formId + appTypeTitles[i] + "_status")[j].value = "승인";
				$("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdSlashShort(appLineContainer[i][j].approved);
			} else if (appLineContainer[i][j].rejected != null) {
				$("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
				$("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdSlashShort(appLineContainer[i][j].rejected);
			}
		}
	}

}

