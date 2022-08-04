$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	drawCommonList();
	//drawhrForm();
	//addedHoursform();
	//selectForm();
	//drawCoeForm()

});



///////////////////////////////////////////////////////////////////////////지출결의서에 필요한 함수 ///////////////////////////////////// 
function drawCommonList() {
	let title = $(".title");
	title.html("지출결의서");
	let reportForm = 'expenditure_resolution';
	let infoTarget = $(".info");

	let infoTitle = ['번호', '작성자', '작성일', '영업기회', '거래처'];
	let infoTitleng = ['no', 'writer', 'regdate', 'sopp', 'customer']

	drawBasicDocInfoTablenone(infoTitle, reportForm, infoTitleng, infoTarget);

	let contentTarget = $(".insertedContent")

	drawBasicDocContentTablenone(reportForm, contentTarget);

	let detailTarget = $(".insertedData");

	let insertedDataTitle = ['거래일자', '거래처', '항목', '단가', '수량', '부가세액', '금액', '적요'];

	let btnhtml = "<div class='btnDiv'><button class='insertbtn' onclick='insertData()'>추가</button><button class='deletebtn' onclick='deleteData()'>삭제</button></div>"


	let dataTitlehtml = "<div class='detailDiv'>";


	for (let i = 0; i < insertedDataTitle.length; i++) {
		if (i < insertedDataTitle.length - 1) {
			dataTitlehtml += "<div class='datailTitle'>" + insertedDataTitle[i] + "</div>"

		} else {
			dataTitlehtml += "<div class='datailTitlelast'>" + insertedDataTitle[i] + "</div>"

		}
	}
	dataTitlehtml += "</div>";
	btnhtml += dataTitlehtml;
	detailTarget.html(btnhtml);
}


//입력 데이터 만드는 함수 
function insertData() {
	let countlow = 0;
	let target = $(".insertedDataList");
	let dataNoneForm = "<div class='detailcontentDiv'>";
	let title = ['data', 'customer', 'product', 'price', 'quantity', 'tax', 'total', 'remark'];
	let reportForm = 'expenditure_resolution';

	for (let i = 0; i < title.length; i++) {
		countlow = $(".detailcontentDiv").length
		if (i < title.length - 1) {
			if (i == 0) {
				dataNoneForm += "<div id='child' class ='countRow detailcontent'><input type='date'class='outlineNonedata' id='doc_Form_" + reportForm + '_' + title[i] + "_" + countlow + "'/></div>"
			} else {
				dataNoneForm += "<div id='child' class ='countRow detailcontent'><input type='text'class='outlineNonedata' onkeyup='keyUpFunction(this)' id='doc_Form_" + reportForm + '_' + title[i] + "_" + countlow + "'/></div>"
			}
		} else
			dataNoneForm += "<div id='child' class ='countRow detailcontentlast'><input type='text'class='outlineNonedata' onkeyup='keyUpFunction(this)' id='doc_Form_" + reportForm + '_' + title[i] + "_" + countlow + "'/></div>"

	}

	// 크기상 21개까지만 데이터 추가 가능 
	dataNoneForm += "</div>"
	if ($(".detailcontentDiv").length < 21) {
		target.append(dataNoneForm);
	}

}

function deleteData() {
	let target = $(".insertedDataList");
	target.children(':last').remove();
}


function keyUpFunction(obj) {
	let idString = obj.id;
	let idArr = idString.split('_');
	let quantityhtml = "";
	let taxhtml = "";
	let pricehtml = "";
	let totalhtml = "";
	//가격에 키업 된 경우 
	if (idArr[4] == 'price') {
		for (let i = 0; i < idArr.length; i++) {
			if (i == 4) {
				quantityhtml += 'quantity_'
				taxhtml += 'tax_'
				totalhtml += 'total_'
			} else if (i == idArr.length - 1) {
				quantityhtml += idArr[i];
				taxhtml += idArr[i];
				totalhtml += idArr[i];
			} else {
				quantityhtml += idArr[i] + '_';
				taxhtml += idArr[i] + '_';
				totalhtml += idArr[i] + '_';
			}
		}
		$("#" + quantityhtml + "").val(0);

		let priceVal = $("#" + idString + "").val(); // 단가 
		let quantityVal = $("#" + quantityhtml + "").val(); // 

		$("#" + totalhtml + "").val(quantityVal * priceVal * 1.1); // 금액 
		$("#" + taxhtml + "").val(quantityVal * priceVal * 0.1); // 부가세 
	}

	//수량에 키업된 경우 
	if (idArr[4] == 'quantity') {
		for (let i = 0; i < idArr.length; i++) {
			if (i == 4) {
				taxhtml += 'tax_'
				pricehtml += 'price_'
				totalhtml += 'total_'
			} else if (i == idArr.length - 1) {
				taxhtml += idArr[i];
				pricehtml += idArr[i];
				totalhtml += idArr[i];
			} else {
				taxhtml += idArr[i] + '_';
				pricehtml += idArr[i] + '_';
				totalhtml += idArr[i] + '_';

			}
			let quantityVal = $("#" + idString + "").val(); // 수량 
			let priceVal = $("#" + pricehtml + "").val(); // 단가

			$("#" + totalhtml + "").val(quantityVal * priceVal * 1.1); // 금액 
			$("#" + taxhtml + "").val(quantityVal * priceVal * 0.1); // 부가세 

		}
	}

} ///////////////////////////////////////////// //    지출결의서용 함수 ///////////////////////////////////////////////////////////////////////////////////////


// ******** 비어있는 테이블 만드는 함수 ********** // 
function drawBasicDocInfoTablenone(title, reportForm, titleeng, target) {


	let infoHtml = "";
	for (let i = 0; i < title.length; i++) {
		if (i < title.length - 1) {
			infoHtml += "<div class='infoDiv'><div class='infoTitle'>" + title[i] + "</div><div class='infoContent'><input  id='doc_Form_" + reportForm + '_' + titleeng[i] + "' class='outlineNone' type='text' /></div></div>";
		} else if (i == title.length - 1) {
			infoHtml += "<div class='infoDiv'><div class='infoTitlelast'>" + title[i] + "</div><div class='infoContentlast'><input  id='doc_Form_" + reportForm + '_' + titleeng[i] + "' class='outlineNone' type='text'/></div></div>";
		}

	}
	target.html(infoHtml);

}


//******** 제목 내용 입력 form 만드는 함수 ******** 
function drawBasicDocContentTablenone(reportForm, target) {

	let infoHtml = "";
	for (let i = 0; i < 2; i++) {
		if (i < 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitle'>제목</div><div class='infoContent'><input  id='doc_Form_" + reportForm + "_title' class='outlineNone' type='text' /></div></div>";
		} else if (i == 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitlelast'>내용</div><div class='infoContentlast'><textarea  id='doc_Form_" + reportForm + "_content' class='outlineNone' ></textarea></div></div>";
		}
	}
	target.html(infoHtml);

}

//////휴가원 만드는 함수 /////// 

function drawhrForm() {
	let title = $(".title");
	title.html("휴가원");
	let reportForm = 'leaveApplication';
	let infoTitle = ['문서번호', '작성자', '작성일'];
	let infoTitleeng = ['no', 'writer', 'regdate'];
	let infoTarget = $(".info");
	let insertedContentTarget = $(".insertedData");
	let dateFormTarget = $(".insertedContent");
	let dataTitle = ['휴가 종류', '휴가 기간', '휴가 사유'];
	let dataTitleeng = ['leaveTitle', 'leaveLength', 'leaveCause'];
	drawBasicDocInfoTablenone(infoTitle, reportForm, infoTitleeng, infoTarget);
	drawDateForm(dataTitle, reportForm, dataTitleeng, dateFormTarget)
	drawBasicDocContentTablenone(reportForm, insertedContentTarget);

}


function drawDateForm(dataTitle, reportForm, dataTitleeng, dateFormTarget) {

	let infoHtml = "";
	for (let i = 0; i < dataTitle.length; i++) {
		if (i < dataTitle.length - 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitle'>" + dataTitle[i] + "</div><div class='infoContent'><input  id='doc_Form_" + reportForm + '_' + dataTitleeng[i] + "' class='outlineNone' type='text' /></div></div>";
		} else if (i == dataTitle.length - 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitlelast'>" + dataTitle[i] + "</div><div class='infoContentlast'><input  id='doc_Form_" + reportForm + '_' + dataTitleeng[i] + "' class='outlineNone' type='text' /></div></div>";
		}
	}
	dateFormTarget.html(infoHtml);

} ////////////////////////////////////// 휴가원 만드는 함수 끝 ///////////////////////////// 


//////////////////////////////// 연장근로 만드는 함수 ////////////////////////////////////// 
function addedHoursform() {
	let title = $(".title");
	title.html("연장 근무");
	let reportForm = 'addedHours';
	let infoTitle = ['문서번호', '작성자', '작성일'];
	let infoTitleeng = ['no', 'writer', 'regdate'];
	let infoTarget = $(".info");
	let insertedContentTarget = $(".insertedData");
	let dateFormTarget = $(".insertedContent");
	let dataTitle = ['근무 종류', '근무 기간', '근무 사유'];
	let dataTitleeng = ['addedHoursTitle', 'addedHoursLength', 'addedHoursCause'];
	drawBasicDocInfoTablenone(infoTitle, reportForm, infoTitleeng, infoTarget);
	drawBasicDocDataTable(dataTitle, reportForm, dataTitleeng, dateFormTarget)
	drawBasicDocContentTablenone(reportForm, insertedContentTarget);

}

function drawBasicDocDataTable(dataTitle, reportForm, dataTitleeng, dateFormTarget) {

	let infoHtml = "";
	for (let i = 0; i < dataTitle.length; i++) {
		if (i < dataTitle.length - 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitle'>" + dataTitle[i] + "</div><div class='infoContent'><input  id='doc_Form_" + reportForm + '_' + dataTitleeng[i] + "' class='outlineNone' type='text' /></div></div>";
		} else if (i == dataTitle.length - 1) {
			infoHtml += "<div class='contentDiv'><div class='infoTitlelast'>" + dataTitle[i] + "</div><div class='infoContentlast'><input  id='doc_Form_" + reportForm + '_' + dataTitleeng[i] + "' class='outlineNone' type='text' /></div></div>";
		}
	}
	dateFormTarget.html(infoHtml);

}


//////////////////////////////////////////// 재직증명서 만드는 함수 /////////////////////////////////////////////


function drawCoeForm() {
	let title = $(".title");
	title.html("재직증명서");
	let reportForm = 'coe';
	let infoTitle = ['문서번호', '기안자', '기안일'];
	let infoTitleeng = ['no', 'writer', 'regdate'];
	let infoTarget = $(".info");
	let dateFormTarget = $(".insertedContent");
	let dataTitle = ['성명', '주민번호', '주소', '소속', '직위', '재직기간'];
	let dataTitleeng = ['name', 'idNum', 'address', 'org', 'position', 'employLength'];
	drawBasicDocInfoTablenone(infoTitle, reportForm, infoTitleeng, infoTarget);
	drawBasicDocDataTable(dataTitle, reportForm, dataTitleeng, dateFormTarget);
	dateFormTarget.append("<p>위와 같이 재직하고 있음을 증명합니다</p>")
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	let date = today.getDate();

	$(".list_comment").html( year + '년' + month + '월' + date +"일");
}


