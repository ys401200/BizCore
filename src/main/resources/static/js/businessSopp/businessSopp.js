$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSoppList();
});

function getSoppList() {
	let url;
	
	url = apiServer + "/api/sopp";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let jsonData;
			if (data.result === "ok") {
				jsonData = cipher.decAes(data.data);
				jsonData = JSON.parse(jsonData);
				storage.soppList = jsonData;
				window.setTimeout(drawSoppList, 200);
			} else {
				msg.set("등록된 영업기회가 없습니다");
			}
		}
	});
} // End of getScheduleList()

function drawSoppList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.soppList === undefined) {
		msg.set("등록된 영업기회가 없습니다");
	}
	else {
		jsonData = storage.soppList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridSoppList");

	header = [
		{
			"title" : "등록일",
			"align" : "center",
		},
		{
			"title" : "판매방식",
			"align" : "center",
		},
		{
			"title" : "계약구분",
			"align" : "center",
		},
		{
			"title" : "영업기회명",
			"align" : "left",
		},
		{
			"title" : "매출처",
			"align" : "left",
		},
		{
			"title" : "엔드유저",
			"align" : "left",
		},
		{
			"title" : "담당사원",
			"align" : "center",
		},
		{
			"title" : "예상매출액",
			"align" : "right",
		},
		{
			"title" : "진행단계",
			"align" : "center",
		},
        {
			"title" : "매출예정일",
			"align" : "center",
		}
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		str = [
			{
				"setData": setDate,
			},
			{
				"setData": jsonData[i].job,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": jsonData[i].from,
			},
			{
				"setData": jsonData[i].cust,
			},
			{
				"setData": jsonData[i].user,
			},
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].sopp,
			},
			{
				"setData": jsonData[i].detail,
			},
			{
				"setData": jsonData[i].no,
			}
		];

		fnc = "soppDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSoppList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()


function soppDetailView(e){
	let id, url, method, data;

	id = $(e).data("id");
	url = "/api/sopp/" + id;
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, soppSuccess, soppError);
}

function soppSuccess(result){
	let html = "", title, userName, customer, customerUser, endUser, progress, disDate, expectedSales, detail;

	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	userName = (result.employee == 0 || result.employee === null) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	customerUser = (result.picOfCustomer == 0 || result.picOfCustomer === null) ? "데이터 없음" : storage.user[result.picOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.customer[result.endUser].name;
	progress = (result.progress === null || result.progress === "") ? "데이터 없음" : result.progress + "%";
	expectedSales = (result.expectedSales === null || result.expectedSales === "") ? "데이터 없음" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);

	html = "<table class='defaultTable'>";
	html += "<tr>";
	html += "<th>영업기회명</th>";
	html += "<td>" + result.title + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>담당자</th>";
	html += "<td>" + userName + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>매출처</th>";
	html += "<td>" + customer + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>매출처 담당자</th>";
	html += "<td>" + customerUser + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>엔드유저</th>";
	html += "<td>" + endUser + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>진행단계</th>";
	html += "<td>" + result.status + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>가능성</th>";
	html += "<td>" + progress + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>계약구분</th>";
	html += "<td>" + result.contType + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>매출예정일</th>";
	html += "<td>" + targetDate + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>판매방식</th>";
	html += "<td>" + result.soppType + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>예상매출</th>";
	html += "<td>" + expectedSales + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>내용</th>";
	html += "<td>" + detail + "</td>";
	html += "</tr>";
	html += "</table>";

	modal.show();
	modal.headTitle.text("상세보기");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.hide();
	modal.close.text("취소");
	modal.close.css("width", "100%");
}

function soppError(){
	alert("에러");
}