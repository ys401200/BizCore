$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);


	drawmylist();

});


function drawmylist() {

	let json = {
		"form": "form0001",

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
			title: '수량',
			content: json.detail.quantity

		}, {
			title: '금액',
			content: json.detail.total

		}, {
			title: '적요',
			content: json.detail.remark

		}
	];


	let title = $(".title");
	title.html(json.form);

	let infoHtml = "";
	let contentHtml = "";
	let info = $(".info");
	let insertedContent = $(".insertedContent");

	// 기본 정보 
	for (let i = 0; i < 5; i++) {
		if (i < 4) {
			infoHtml += "<div class='infoDiv'><div class='infoTitle'>" + testData[i].title + "</div><div class='infoContent'><input class='outlineNone' type='text' readonly value='" + testData[i].content + "'/></div></div>";
		} else if (i == 4) {
			infoHtml += "<div class='infoDiv'><div class='infoTitlelast'>" + testData[i].title + "</div><div class='infoContentlast'><input class='outlineNone' type='text' readonly value='" + testData[i].content + "'/></div></div>";
		}
	}
	info.html(infoHtml);

	// 제목 내용 

	contentHtml += "<div class='contentDiv'><div class='infoTitle'>" + testData[5].title + "</div><div class='infoContent'><input class='outlineNone' type='text' readonly value='" + testData[5].content + "'/></div></div>"
	contentHtml += "<div class='contentDiv'><div class='infoTitlelast'>" + testData[6].title + "</div><div class='infoContentlast'><input class='outlineNone' type='text' readonly value='" + testData[6].content + "'/></div></div>"


	insertedContent.html(contentHtml);


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


	for (let i = 0; i < json.detail.length; i++) {
		let total;
		let lowTestData2 = [
			{
				title: '거래일자',
				content: json.detail[i].date

			}, {
				title: '거래처',
				content: json.detail[i].customer

			}, {
				title: '항목',
				content: json.detail[i].product

			}, {
				title: '수량',
				content: json.detail[i].quantity

			}, {
				title: '금액',
				content: json.detail[i].total

			}, {
				title: '적요',
				content: json.detail[i].remark

			}
		];
		total += json.detail[i].total + "";


		let html = "<div class='detailcontentDiv'>";

		for (let i = 0; i < lowTestData2.length; i++) {

			if (i == lowTestData2.length - 1) {
				html += "<div class='detailcontentlast'>" + lowTestData2[i].content + "</div>";
			} else {
				html += "<div class='detailcontent'>" + lowTestData2[i].content + "</div>";
			}
		}
		html += "</div>";

		detailTitleHtml += html;

		insertedData.html(detailTitleHtml);


	}


	let target = $(".mylistbtn");
	target.length;

	alert(target.length);
	let comment = "<div>완료 / 반려의견</div><textarea></textarea><button class='comentbtn' type='button'>등록</button>"
	target.html(comment);

}














































