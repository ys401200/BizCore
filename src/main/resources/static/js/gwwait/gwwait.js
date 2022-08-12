$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	waitDefault();
});


function waitDefault() {


	let url, method, data, type;
	url = "/api/notice";
	method = "get"
	data = "";
	type = "list";
	crud.defaultAjax(url, method, data, type, noticeSuccessList, noticeErrorList);



	//오른쪽에 상세내용 출력 
	let previewWidth = document.getElementsByClassName("forForm")[0];
	previewWidth = previewWidth.clientWidth;
	let targetForm = $(".forForm");
	targetForm.css("height", Math.ceil(previewWidth / 210 * 297));
	let targetTable = $(".forTable");
	targetTable.css("height", Math.ceil(Math.ceil((previewWidth / 210 * 297) * 0.1)));
	let targetButtons = $(".forButtons");
	targetButtons.css("height", Math.ceil(Math.ceil((previewWidth / 210 * 297) * 0.025)));





	let buttonsHtml = "<button>상신취소</button><button>인쇄</button>";
	targetButtons.html(buttonsHtml);
	drawCommonmylist();



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
			"title": "기안일",
			"align": "center",
		},
		{
			"title": "제목",
			"align": "left",
		},
		{
			"title": "기안자",
			"align": "center",
		},
		{
			"title": "상태",
			"align": "center",
		}
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		let userName = storage.user[jsonData[i].writer].userName;

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": userName,
			},
			{
				"setData": setDate,
			}
		]

		fnc = "noticeDetailView(this)";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawNoticeList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
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



function drawButtons() {

	let buttonsTarget = $(".forButtouns");
	let buttonsHtml = "<button>상신취소</button><button>인쇄</button>";

	buttonsTarget.html(buttonsHtml);



}





function drawCommonmylist() {

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
	
	   contentHtml += "<div class='contentDiv'><div class='infoTitle'>" + testData[5].title + "</div><div class='infoContent'><input id='doc_Form_" + formName + "_" + testData[5].title + "' class='outlineNone' type='text' readonly value='" + testData[5].content + "'/></div></div>"
	   contentHtml += "<div class='contentDiv'><div class='infoTitlelast'>" + testData[6].title + "</div><div class='infoContentlast'><input id='doc_Form_" + formName + "_" + testData[6].title + "'class='outlineNone' type='text' readonly value='" + testData[6].content + "'/></div></div>"
	
	   insertedContent.html(contentHtml);
	
	
	   let target = $(".forForm");
	   target.length;
	
	   
	   let comment = "<div>완료 / 반려의견</div><textarea></textarea><button class='commentbtn' type='button'>등록</button>"
	   target.html(comment);
	
	
	}  // End of drawCommonmylist(); 
	