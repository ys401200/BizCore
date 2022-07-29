$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSalesList();
});

function getSalesList() {
	let url, method, data;

	url = "/api/sales";
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, salesSuccessList, salesErrorList);
} // End of getSalesList()

function drawSalesList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.salesList === undefined) {
		msg.set("등록된 영업활동이 없습니다");
	}
	else {
		jsonData = storage.salesList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridSalesList");

	header = [
		{
			"title" : "번호",
			"align" : "center",
		},
		{
			"title" : "영업활동명",
			"align" : "left",
		},
		{
			"title" : "영업활동(시작)",
			"align" : "center",
		},
		{
			"title" : "영업활동(끝)",
			"align" : "center",
		},
		{
			"title" : "영업기회명",
			"align" : "left",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "매출처",
			"align" : "center",
		},
		{
			"title" : "엔드유저",
			"align" : "center",
		},
		{
			"title" : "등록일",
			"align" : "center",
		}
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let fromDate, toDate, fromSetDate, toSetDate, user, customer, endUser;

		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		fromDate = dateDis(jsonData[i].from);
		fromSetDate = dateFnc(fromDate);

		toDate = dateDis(jsonData[i].to);
		toSetDate = dateFnc(toDate);

		user = (jsonData[i].user == 0 || jsonData[i].user === null) ? "없음" : storage.user[jsonData[i].user].userName;
		customer = (jsonData[i].customer == 0 || jsonData[i].customer === null) ? "없음" : storage.customer[jsonData[i].customer].name;
		endUser = (jsonData[i].endUser == 0 || jsonData[i].endUser === null) ? "없음" : storage.user[jsonData[i].endUser].userName;

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": fromSetDate,
			},
			{
				"setData": toSetDate,
			},
			{
				"setData": jsonData[i].sopp,
			},
			{
				"setData": user,
			},
			{
				"setData": customer,
			},
			{
				"setData": endUser,
			},
			{
				"setData": setDate,
			}
		];

		fnc = "salesDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSalesList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()

function salesSuccessList(result){
	storage.salesList = result;
	window.setTimeout(drawSalesList, 200);
}

function salesErrorList(){
	alert("에러");
}

function salesDetailView(e){
	let id, url, method, data;

	id = $(e).data("id");
	url = "/api/sales/" + id;
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, salesSuccessView, salesErrorView);
}

function salesSuccessView(result){
	let html = "", disDate, from, place, userName, customer, endUser, title, detail;

	place = (result.place === null || result.place === "") ? "데이터 없음" : result.place;
	userName = (result.user == 0 || result.user === null) ? "데이터 없음" : storage.user[result.user].userName;
	customer = (result.customer == 0 || result.customer === null) ? "데이터 없음 " : storage.customer[result.customer].name;
	endUser = (result.endUser == 0 || result.endUser === null) ? "데이터 없음" : storage.user[result.endUser].userName;
	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;

	disDate = dateDis(result.from);
	from = dateFnc(disDate);
	 
	html = "<table class='defaultTable'>";
	html += "<tr>";
	html += "<th>활동일</th>";
	html += "<td>" + from + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>장소</th>";
	html += "<td>" + place + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>활동형태</th>";
	html += "<td>" + result.type + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>담당자</th>";
	html += "<td>" + userName + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>영업기회</th>";
	html += "<td>" + result.sopp + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>매출처</th>";
	html += "<td>" + customer + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>엔드유저</th>";
	html += "<td>" + endUser + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>제목</th>";
	html += "<td>" + title + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<th>내용</th>";
	html += "<td>" + detail + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "</table>";

	modal.show();
	modal.headTitle.text("상세보기");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.hide();
	modal.close.text("취소");
	modal.close.css("width", "100%");
}

function salesErrorView(){
	alert("에러");
}