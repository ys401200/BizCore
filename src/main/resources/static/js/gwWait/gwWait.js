$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	waitDefault();

});

function waitDefault() {
	$(".modal-wrap").hide();



	let checkHref = location.href;
	checkHref = checkHref.split("//");
	checkHref = checkHref[1];
	let splitArr = checkHref.split("/");

	// 전자결재 홈 화면에서 들어오는 경우 , 상세조회 
	if (splitArr.length > 3) {
		$.ajax({
			"url": apiServer + "/api/gw/app/doc/" + splitArr[3],
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
	} else {
		// 리스트 보기 
		let url, method, data, type;
		url = "/api/gw/app/wait";
		method = "get"
		data = "";
		type = "list";
		crud.defaultAjax(url, method, data, type, waitSuccessList, waitErrorList);


		$(".listPageDiv").show();
	}

}

function waitSuccessList(result) {
	storage.waitList = result;
	window.setTimeout(drawNoticeApproval, 200);
}

function waitErrorList() {
	alert("에러");
}

function drawNoticeApproval() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.waitList === undefined) {
		msg.set("등록된 문서가 없습니다");
	}
	else {
		jsonData = storage.waitList.wait;
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
			}, {
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


	let testForm = storage.reportDetailData.doc;


	let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showAppModal()'>결재하기</button>" +
		"<button type='button' onclick='showGwModal()'>결재선 수정</button>" +
		"<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>문서 수정</button></div>" +
		"<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div><div class='comment'></div></div>"


	$(".listPageDiv").html(detailHtml);



	let selectedFileView = "<div class='selectedFileField'><label>첨부파일</label><div><div class='selectedFileDiv'><input class='inputFile' type='file' onchange='setSelectedFiles()'/></div></div></div>"


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



	let target = $(".seletedForm")[0];
	let inputsArr = target.getElementsByTagName("input");

	for (let i = 0; i < inputsArr.length; i++) {
		if (inputsArr[i].dataset.detail !== undefined) {
			inputsArr[i].value = inputsArr[i].dataset.detail;
		}
	}

	let textAreaArr = target.getElementsByTagName("textarea")[0];
	textAreaArr.value = textAreaArr.dataset.detail;

	let formId = storage.reportDetailData.formId;

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

}



// 파일 다운로드 
function getFileArr() {
	let fileList = storage.reportDetailData.fileList;
	let no = storage.reportDetailData.no;
	let target = $(".selectedFileDiv");
	for (let i = 0; i < fileList.length; i++) {
		target.append("<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(fileList[i].fileName) + "'>" + fileList[i].fileName + "</a></div>");
	}

}

// 파일 수정 삭제 
function getFileModArr() {
	let fileList = storage.reportDetailData.fileList;
	let no = storage.reportDetailData.no;
	let target = $(".selectedFileDiv");
	target.html("");
	for (let i = 0; i < fileList.length; i++) {
		target.append("<div><div>" + fileList[i].fileName + "<button type='button' onclick='fileRemove(this)'>x</button></div></div>")
	}
}

function fileRemove(obj) {
	obj.parentElement.remove();
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
		$("#tabDetail2").hide();
		$("#tabDetail").show();
		drawCommentLine();

	} else if (obj.id = 'changeInfo') {
		$("#lineInfo").css("background-color", "white");
		$("#lineInfo").css("color", "#332E85");
		$("#lineInfo").css("border-bottom", "2px solid #332E85");
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
	// $("input:radio[name='type']").prop("checked", false);
	let selectVal = $(":radio[name='type']:checked").val();
	let approvalComment = $(".approvalComment").val();
	$(".modal-wrap").hide();
}


//결재선 수정 모달 
function showGwModal() {

	let setGwModalHtml = "<div class='gwModal'>" +
		"<div class='modal-title'>결재선 생성</div>" +
		"<div class='lineDetail'>" +
		"<div class='lineTop'>" +
		"<div class='innerDetail' id='lineLeft'></div>" +
		"<div class='innerDetail' id='lineCenter'>" +
		"<button onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
		"<button onclick='check(this.value)' value='agree'>합의 &gt;</button>" +
		"<button onclick='check(this.value)' value='approval'>결재 &gt;</button>" +
		" <button onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
		"<button onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
		"<div class='innerDetail' id='lineRight'>" +
		"<div><select onchange='setSavedLine(this)'><option value=''>자주 쓰는 결재선</option><option value='basic'>대표</option><option value='middle'>구민주 과장-대표</option><</select></div>" +
		"<div><div>검토</div>" +
		"<div class='typeContainer' id='examine'></div>" +
		"</div>" +
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
	for (x in storage.user) userData.push(x);

	let innerHtml = "";
	for (let i = 0; i < userData.length; i++) {
		innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + i + "' name='userNames' value='" + userData[i] + "'><label for='cb'>" + storage.user[userData[i]].userName + "</label></div>"

	}
	orgChartTarget.html(innerHtml);
	$(".modal-wrap").show();

}

function closeGwModal(obj) {
	let id = obj.id;
	if (id == "close") {
		$(".modal-wrap").hide();
	} else if (id == 'modify') {
		$(".modal-wrap").hide();
	}
}

function check(name) {
	let inputLength = $(".testClass");
	let target = $("#" + name);
	let html = target.html();
	let selectHtml = "";

	let data = new Array();
	let x;
	for (x in storage.user) data.push(x);

	for (let i = 0; i < inputLength.length; i++) {
		if ($("#cb" + i).prop('checked')) {
			if (document.getElementById("linedata" + i) == null)
				selectHtml += "<div class='lineDataContainer' id='lineContainer_" + i + "'><label id='linedata" + i + "'>" + storage.user[data[i]].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + i + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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
	for (x in storage.user) data.push(x);
	let selectHtml = "";
	for (let i = 0; i < numArr.length; i++) {
		selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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
	for (x in storage.user) data.push(x);
	let selectHtml = "";
	for (let i = 0; i < numArr.length; i++) {
		selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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


// 문서 수정 완료 모달 
function showModifyModal(obj) {
	let setModifyModalHtml = "<div class='setModifyModal'>" +
		"<div class='modal-title'>문서 수정하기 </div>" +
		"<div class='modal-body'>" +
		"<label>수정 내용<textarea class='modifyComment'></textarea></label>" +
		"</div>" +
		"<div class='close-wrap'>" +
		"<button  onclick='closeModal(this)'>취소</button>" +
		"<button id='set' onclick='reportModify(this)'>수정</button>" +
		"</div></div>";
	$(".modal-wrap").html(setModifyModalHtml);
	$(".modal-wrap").show();


}

// 문서 수정 취소 함수 
function quitModify() {
	$("button[name='modConfirm']:last-child").remove();
	$("button[name='modConfirm']:last-child").remove();
	toReadMode();
	$(":file").css("display", "none");
}


// 문서 수정시 변경이력에 반영 
function reportModify(obj) {
	let comment = $(".modifyComment").val();
	let modCommentHtml = "<div class='tapLineB changeDataLine'><div class='changeType'>" + "테스트" + "</div><div class='changeName' >" + storage.user[storage.my].userName + "</div><div class='changeDate'>" + getYmdHyphen() + "</div><div class='changeCause'>" + comment + "</div></div>";
	let origin = $("#tabDetail2").html();
	origin += modCommentHtml;
	$("#tabDetail2").html(origin);
	$(".modal-wrap").hide();
	$("button[name='modConfirm']:last-child").remove();
	$("button[name='modConfirm']:last-child").remove();
	toReadMode();
	$(":file").css("display", "none");
}



//문서 수정 버튼 누르면 수정 완료 버튼 생성 
function createConfirmBtn(obj) {
	//변경이력 보이기 
	$("#changeInfo").css("background-color", "#332E85");
	$("#changeInfo").css("color", "white");
	$("#changeInfo").css("border", "none");
	$("#lineInfo").css("background-color", "white");
	$("#lineInfo").css("color", "#332E85");
	$("#lineInfo").css("border-bottom", "2px solid #332E85");
	$("#tabDetail").hide();
	$("#tabDetail2").show();
	drawChangeInfo();

	let div = document.getElementsByClassName("mainBtnDiv")
	if (div[0].childElementCount < 4) {
		$(".mainBtnDiv").append("<button type='button'name='modConfirm' onclick='showModifyModal()' >수정완료 </button>" +
			"<button type='button'name='modConfirm' onclick='quitModify()'>수정취소 </button>");
	}

	getFileModArr();
	$(":file").css("display", "inline");
}


function getYmdSlash(date) {
	let d = new Date(date);
	return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) + "&nbsp" + (d.getHours() > 9 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + (d.getMinutes() > 9 ? d.getMinutes().toString() : "0" + d.getMinutes().toString()) + ":" + (d.getSeconds() > 9 ? d.getSeconds().toString() : "0" + d.getSeconds().toString());
}




