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

	let url, method, data, type;
	url = "/api/notice";
	method = "get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, waitSuccessList, waitErrorList);
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



	$(".searchContainer").show();
	$(".listPageDiv").show();


}

function drawNoticeApproval() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

	if (storage.noticeList === undefined) {
		msg.set("등록된 공지사항이 없습니다");
	}
	else {
		jsonData = storage.noticeList;
	}

	result = paging(jsonData.length, storage.currentPage, 8);

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
				"setData": userName,
			},
			{
				"setData": userName,
			},
			{
				"setData": userName,
			},
			{
				"setData": userName,
			},
			{
				"setData": userName,
			},
			{
				"setData": "<input type='checkbox' class='thisCheck' data-id='" + jsonData[i].no + "'>",
			}
		]

		fnc = "waitDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeApproval", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);



	// 전체선택 전체 해제  
	$(".thisAllcheck").click(function () {
		if ($(".thisAllcheck").prop("checked")) {
			$(":checkbox").prop("checked", true);
		} else {
			$(":checkbox").prop("checked", false);
		}

	});
}// End of drawNoticeApproval()



function waitSuccessList(result) {
	storage.noticeList = result;
	window.setTimeout(drawNoticeApproval, 200);
}

function waitErrorList() {
	alert("에러");
}

function waitDetailView(event) {// 선택한 그리드의 글 번호 받아오기 

	$(".searchContainer").hide();
	let target = $(".container");
	let no = event.dataset.id;

	// 전자결재 문서 번호를 가지고 상세 조회 그림  

	target.html();
	getDetailView(no);

} // End of noticeDetailView();



///글 제목 눌렀을때 상세 조회하는 페이지 그리기 
function getDetailView(no) {

	let testForm = storage.formList[0].form;
	let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showAppModal()'>결재하기</button>" +
		"<button type='button' onclick='showGwModal()'>결재선 수정</button>" +
		"<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>문서 수정</button></div>" +
		"<div class='detailReport'><div class='selectedReportview'></div><div class='comment'></div></div>"


	$(".listPageDiv").html(detailHtml);



	let selectedFileView = "<div class='selectedFileField'><label>첨부파일<input type='file'/></label><div></div></div>"
	testForm += selectedFileView;


	$(".selectedReportview").html(testForm);
	$(":file").css("display", "none");// 첨부파일 버튼 숨기기 
	let tabHtml = "<div class='reportInfoTab'>" +
		"<label id='lineInfo' onclick='changeTab(this)'>결재정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
		"<div id='tabDetail'></div><div id='tabDetail2'></div>"
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



// 결재정보 그리는 함수 
function drawCommentLine() {

	let target = $("#tabDetail");

	// 임시 데이터 ----------------------------------------------------

	let examine = [{
		"name": "이송현",
		"status": "",
		"approved": "",
		"comment": ""
	},
	{
		"name": "구민주",
		"status": "",
		"approved": "",
		"comment": ""
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
		"<div class='modal-title'>결재선 수정</div>" +
		"<div class='lineDetail'>" +
		"<div class='lineTop'>" +
		"<div class='innerDetail' id='lineLeft'></div>" +
		"<div class='innerDetail' id='lineCenter'>" +
		"<button onclick='check(this.value)' value='examine'>검토 ></button>" +
		"<button onclick='check(this.value)' value='agree'>합의 ></button>" +
		"<button onclick='check(this.value)' value='approval'>결재 ></button>" +
		" <button onclick='check(this.value)' value='conduct'>수신 ></button>" +
		"<button onclick='check(this.value)' value='refer'>참조 ></button></div>" +
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
		" <button id='close' onclick='closeModal(this)'>취소</button>" +
		" <button id='create' onclick='closeGwModal(this)'>수정</button>" +
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
		orgChartTarget.html(innerHtml);
	}
	$(".modal-wrap").show();

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





// 결재선 그리기 
function createLine() {
	let formTypeName = $(".formNumHidden").val();
	let formId = storage.formList[formTypeName].id;
	let lineTarget = $(".infoline")[0].children[1];
	lineTarget = $("#" + lineTarget.id);
	lineTarget.html("");
	lineTarget.css("display", "block");
	let testHtml = "<div class='lineGridContainer'>";
	let testHtml2 = "<div class='lineGridContainer'>";
	let readHtml = "<div>열람</div>";
	let referHtml = "<div>참조</div>";
	let target = $(".typeContainer");
	let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];
	let titleId = ["examine", "agree", "approval", "conduct", " read", "refer"]


	let data = new Array();
	let x;
	for (x in storage.user) data.push(x);


	for (let i = 0; i < target.length; i++) {
		if (target[i].children.length != 0 && i < 3) {
			testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
		} else if (target[i].children.length != 0 && i == 3) {
			testHtml2 += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
		}

		for (let j = 0; j < target[i].children.length; j++) {
			let id = target[i].children[j].id;
			id = id.split('_');
			id = id[1];


			/// class 이름 , css 수정 
			if (i < 2 && j < target[i].children.length - 1) {
				testHtml += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
			} else if (i < 2 && j == target[i].children.length - 1) {
				testHtml += "<div class='lineSet'><div class='twoBorderLast'>직급</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorderLast  " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
			} else if (i == 2) {
				testHtml += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
			} else if (i == 3) {
				testHtml2 += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
			} else if (i == 4) {
				readHtml += "<div class='appendName " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div>";
			} else if (i == 5) {
				referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div>";
			}

		}

		if (target[i].children.length != 0 && i < 3) {
			testHtml += "</div>";
		} else if (target[i].children.length != 0 && i == 3) {
			testHtml2 += "</div>";
		}


	}

	testHtml += "</div>";
	testHtml2 += "</div>";


	testHtml += testHtml2;
	lineTarget.html(testHtml);


	$(".readContainer").html(readHtml);
	$(".referContainer").html(referHtml);


} // End of createLine(); 


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

}


function getYmdHyphen() {
	let d = new Date();
	return (d.getFullYear() % 100) + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) + "&nbsp" + d.getHours().toString() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString();
}




