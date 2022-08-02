$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);


	selectForm();
	
});


function selectForm() {

	let json = {
		"form": '지출결의서',

		"data": {
			"no": 2958,
			"writer": 10028,
			"title": "안드로이드/iOS/모듈 개발",
			"sopp": 10005197,
			"customer": 104742,
			"content": "<div>문서내용</div>",
			"amount": 8250000,
			"created": 16999999999,
			"Modified": 16999999999,
		},

		"detail": [{
			"date": 169999999999,
			"customer": "(주)엑스아이커뮤니케이션즈",
			"product": "웹용 REST API 서버 모듈",
			"price": 7500000,
			"quantity": 1,
			"tax": 750000,
			"total": 8250000,
			"remark": "웹용 REST API 개발건",
		},
		{
			"date": 1223231434,
			"customer": "(주)테스트 회사",
			"product": "테스트 항목",
			"price": 6890099,
			"quantity": 4,
			"tax": 445367677,
			"total": 6777657,
			"remark": "테스트 개발건",
		}

		]

	};

	let json2 = {
		"form": '휴일근무',
		"attendId": 2958,
		"userNo": 10028,
		"attType": 4,
		"attStatus": 5,
		"attStart": "2022-03-13 09:00:00.000",
		"attEnd": "2022-03-13 18:00:00.000",
		"attDesc": "<p>틸론 버그 지원 : 특정 계정 N:M 할당 VD 접속 불가 지원<br />&nbsp;<br />&gt;&gt; 해당 VD 문제로 추측, 해당 VD 삭제 후 정상 동작 확인</p>",
		"regDate": "2022-03-16 08:53:28.000",
		"modDate": "2022-03-16 20:20:53.000",
		"attrib": 100001
	}

	let json3 = {
		"form": "재직증명서",

		"data": {
			"no": 2958,
			"writer": 10028,
			"created": 2202 - 08 - 02,
		},

		"detail": {
			"name": '김주연',
			"idCardNumber": "880924-1111666",
			"address": '경기도 용인시 수지구 디지털벨리로',
			"org": '기술지원팀',
			"position": '부장',
			"joindate": '2015-03-02',
			"leavedate": '2021-11-01',
			"purpose": '학교 제출용'
		}


	};

	

	if (json.form == '지출결의서') {
		drawCommonmylist(json);
		drawEachList(json);
	} else (alert("뭐"));


	// if (json2.form == '휴일근무') {
	// 	drawHrform(json2);
	// }


	// if (json3.form == '재직증명서') {
	// 	coeForm(json3);
	// }


}

// 지출결의서 1 
function drawCommonmylist(json) {

	let testData = [
		{
			title: '번호',
			content: json.data.no

		}, {
			title: '작성자',
			content: json.data.writer
		}, {
			title: '작성일',
			content: json.data.created

		},
		{
			title: '영업기회',
			content: json.data.sopp
		}, {
			title: '거래처',
			content: json.data.customer

		},
		{
			title: '제목',
			content: json.data.title
		}, {
			title: '내용',
			content: json.data.content

		}
	];

	let title = $(".title");
	let formName = json.form;
	title.html(formName);


	let contentHtml = "";
	let info = $(".info");
	let insertedContent = $(".insertedContent");

	drawBasicDocInfoTable('지출결의서', info, 0, 5, testData);

	contentHtml += "<div class='contentDiv'><div class='infoTitle'>" + testData[5].title + "</div><div class='infoContent'><input id='doc_Form_" + formName + " +" + testData[5].title + "' class='outlineNone' type='text' readonly value='" + testData[5].content + "'/></div></div>"
	contentHtml += "<div class='contentDiv'><div class='infoTitlelast'>" + testData[6].title + "</div><div class='infoContentlast'><input id='doc_Form_" + formName + " +" + testData[6].title + "'class='outlineNone' type='text' readonly value='" + testData[6].content + "'/></div></div>"

	insertedContent.html(contentHtml);


	let target = $(".mylistbtn");
	target.length;

	alert(target.length);
	let comment = "<div>완료 / 반려의견</div><textarea></textarea><button class='commentbtn' type='button'>등록</button>"
	target.html(comment);


}  // End of drawCommonmylist(); 

//지출결의서 2 
function drawEachList(json) {
	let formName = json.form;

	let lowTestData = [
		{
			title: '거래일자',
			content: json.detail.date

		}, {
			title: '거래처',
			content: json.detail.customer

		}, {
			title: '항목',
			content: json.detail.product

		}, {
			title: '단가',
			content: json.detail.price
		},
		{
			title: '수량',
			content: json.detail.quantity

		}, {
			title: '부가세액',
			content: json.detail.tax

		},
		{
			title: '금액',
			content: json.detail.total

		}, {
			title: '적요',
			content: json.detail.remark

		}
	];


	let insertedData = $(".insertedData");
	let detailTitleHtml = "<div class='detailDiv'>";





	for (let i = 0; i < lowTestData.length; i++) {

		if (i == lowTestData.length - 1) {
			detailTitleHtml += "<div class='datailTitlelast'>" + lowTestData[i].title + "</div>";
		} else {
			detailTitleHtml += "<div class='datailTitle'>" + lowTestData[i].title + "</div>";
		}
	}
	detailTitleHtml += "</div>";



	for (let t = 0; t < json.detail.length; t++) {
		let lowTestData2 = [
			{
				title: '거래일자',
				content: json.detail[t].date

			}, {
				title: '거래처',
				content: json.detail[t].customer

			}, {
				title: '항목',
				content: json.detail[t].product

			}, {
				title: '단가',
				content: json.detail[t].price

			}, {
				title: '수량',
				content: json.detail[t].quantity

			}, {
				title: '부가세액',
				content: json.detail[t].tax

			}, {
				title: '금액',
				content: json.detail[t].total

			}, {
				title: '적요',
				content: json.detail[t].remark

			}
		];

		let html = "<div class='detailcontentDiv'>";


		let detailTitles = [];

		for (let t = 0; t < lowTestData2.length; t++) {
			detailTitles.push(lowTestData2[t].title);
		}

		for (let i = 0; i < lowTestData2.length; i++) {

			if (i == lowTestData2.length - 1) {
				html += "<div class='detailcontentlast' id='doc_Form_" + formName + "+" + detailTitles[i] + t + "'>" + lowTestData2[i].content + "</div>";
			} else {
				html += "<div class='detailcontent' id='doc_Form_" + formName + "+" + detailTitles[i] + t + "'>" + lowTestData2[i].content + "</div>";
			}
		}
		html += "</div>";

		detailTitleHtml += html;

	}
	let totalLine = "<div class='totalLine'><div class='detailcontent'>합계</div><div id='doc_Form_expenditureResolution_" + '총합계' + "' class='detailcontent'>" + json.data.amount + "</div><div class='detailcontentlast'></div></div>"
	detailTitleHtml += totalLine;
	insertedData.html(detailTitleHtml);


} // End of drawEachList(); 



function drawHrform(json) { // 연차 월차 휴일근무 연장근무 경조휴가 

	let title = $(".title");
	let formName = json.form;
	title.html(formName);


	let testData = [
		{
			title: '문서번호',
			content: json.attendId

		}, {
			title: '작성자',
			content: json.userNo
		}, {
			title: '작성일',
			content: json.regDate
		},
		{
			title: '종류',
			content: json.attType
		}, {
			title: '기간',
			content: json.attStart + "  -  " + json.attEnd
		},
		{
			title: '사유',
			content: json.attDesc
		}
	];


	let info = $(".info");
	drawBasicDocInfoTable(formName, info, 0, 3, testData);


	let insertedContent = $(".insertedContent");
	drawTitleContentTable(formName, insertedContent, 3, 6, testData);

	let target = $(".mylistbtn");
	target.length;
	let comment = "<div>완료 / 반려의견</div><textarea></textarea><button class='commentbtn' type='button'>등록</button>"
	target.html(comment);




}



//재직증명서 
function coeForm(json) {
	let title = $(".title");
	let formName = json.form
	title.html(formName);



	let testData = [
		{
			title: '문서번호',
			content: json.data.no

		},
		{
			title: '기안자',
			content: json.data.writer

		},
		{
			title: '기안일',
			content: json.data.created

		},
		{
			title: '성명',
			content: json.detail.name

		}, {
			title: '주민등록번호',
			content: json.detail.idCardNumber
		}, {
			title: '주소',
			content: json.detail.address

		}, {
			title: '소속',
			content: json.detail.org

		}, {
			title: '직위',
			content: json.detail.position

		}, {
			title: '재직기간',
			content: json.detail.joindate + "  -  " + json.detail.leavedate

		}

	];

	let target = $(".info");
	drawBasicDocInfoTable(formName, target, 0, 3, testData);
	let insertedContent = $(".insertedContent");
	drawTitleContentTable(formName, insertedContent, 3, 9, testData);

	let comment = $(".list_comment");
	comment.html('위와 같이 재직하고 있음을 증명합니다');


}











// 기본 정보 테이블



function drawBasicDocInfoTable(formType, target, start, end, testData) {


	let ids = [];
	for (let i = start; i < end; i++) {
		ids.push(testData[i].title);
	}

	let infoHtml = "";
	for (let i = start; i < end; i++) {
		if (i < end - 1) {
			infoHtml += "<div class='infoDiv'><div class='infoTitle'>" + testData[i].title + "</div><div class='infoContent'><input  id='doc_Form_" + formType + '_' + ids[i] + "' class='outlineNone' type='text' readonly value='" + testData[i].content + "'/></div></div>";
		} else if (i == end - 1) {
			infoHtml += "<div class='infoDiv'><div class='infoTitlelast'>" + testData[i].title + "</div><div class='infoContentlast'><input  id='doc_Form_" + formType + '_' + ids[i] + "' class='outlineNone' type='text' readonly value='" + testData[i].content + "'/></div></div>";
		}

	}
	target.html(infoHtml);

}


// 제목 내용 종류 기간 등 가로 테이블 

function drawTitleContentTable(formType, target, start, end, testData) {
	let html = "";

	let ids = [];

	for (let i = start; i < end; i++) {
		ids.push(testData[i].title);
	}

	for (let i = start; i < end; i++) {
		if (i < end - 1) {
			html += "<div class='contentDiv'><div class='infoTitle'>" + testData[i].title + "</div><div class='infoContent' id='doc_Form_" + formType + '_' + ids[i] + "' >" + testData[i].content + "</div></div>";
		} else if (i == end - 1) {
			html += "<div class='contentDiv'><div class='infoTitlelast'>" + testData[i].title + "</div><div class='infoContentlast' id='doc_Form_" + formType + '_' + ids[i] + "'> " + testData[i].content + "</div></div>";
		}
	}
	target.html(html);
}
























