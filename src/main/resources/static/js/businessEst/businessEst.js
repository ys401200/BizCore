$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getEstList();
});

function getEstList() {
	let url, method, data;

	url = "/api/est";
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, estSuccessList, estErrorList);
}

function estSearchList(){
	let searchCategory, searchText, url, method, data;

	url = "/api/est";
	method = "get";
	data = "";

	searchCategory = $(document).find("#estSearchCategory").val();
	searchText = $(document).find("#estSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, estSuccessList, estErrorList);
}

function drawEstList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.estList === undefined) {
		msg.set("등록된 견적이 없습니다");
	}
	else {
		jsonData = storage.estList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridEstList");

	header = [
		{
			"title" : "견적일자",
			"align" : "center",
		},
		{
			"title" : "작성자",
			"align" : "center",
		},
		{
			"title" : "견적번호",
			"align" : "center",
		},
		{
			"title" : "견적명",
			"align" : "left",
		},
		{
			"title" : "거래처",
			"align" : "center",
		},
		{
			"title" : "공급가합계",
			"align" : "right",
		},
		{
			"title" : "부가세합계",
			"align" : "right",
		},
		{
			"title" : "금액",
			"align" : "right",
		},
		{
			"title" : "적요",
			"align" : "left",
		}
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let soppType, contType, title, customer, endUser, employee, expectedSales, status;
		
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		soppType = (jsonData[i].soppType === null || jsonData[i].soppType === "") ? "없음" : storage.code.etc[jsonData[i].soppType];
		contType = (jsonData[i].contType === null || jsonData[i].contType === "") ? "없음" : storage.code.etc[jsonData[i].contType];
		title = (jsonData[i].title === null || jsonData[i].title === "") ? "제목 없음" : jsonData[i].title;
		customer = (jsonData[i].customer === null || jsonData[i].customer == 0) ? "없음" : storage.customer[jsonData[i].customer].name;
		endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0) ? "없음" : storage.customer[jsonData[i].endUser].name;
		employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "없음" : storage.user[jsonData[i].employee].userName;
		expectedSales = (jsonData[i].expectedSales === null || jsonData[i].expectedSales == 0) ? 0 : numberFormat(jsonData[i].expectedSales);
		status = (jsonData[i].status === null || jsonData[i].status === "") ? "없음" : storage.code.etc[jsonData[i].status];
 
		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": soppType,
			},
			{
				"setData": contType,
			},
			{
				"setData": title,
			},
			{
				"setData": customer,
			},
			{
				"setData": endUser,
			},
			{
				"setData": employee,
			},
			{
				"setData": expectedSales,
			},
			{
				"setData": status,
			},
		];

		fnc = "estDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawEstList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}

function estDetailView(e){
	let id, url, method, data;

	id = $(e).data("id");
	url = "/api/est/" + id;
	method = "get";
	data = "";

	crud.defaultAjax(url, method, data, estSuccessView, estErrorView);
}

function estSuccessList(result){
	storage.estList = result;
	window.setTimeout(drawEstList, 200);
}

function estErrorList(){
	alert("에러");
}

function estSuccessView(result){
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
	html += "<td>" + result.EstType + "</td>";
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

function estErrorView(){
	alert("에러");
}