$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getContList();
});

function getContList() {
	let url;
	
	url = apiServer + "/api/cont";

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
				storage.contList = jsonData;
				window.setTimeout(drawContList, 200);
			} else {
				msg.set("등록된 계약이 없습니다");
			}
		}
	});
} // End of getScheduleList()

function drawContList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.contList === undefined) {
		msg.set("등록된 계약이 없습니다");
	}
	else {
		jsonData = storage.contList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridSalesList");

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
			"title" : "계약방식",
			"align" : "center",
		},
		{
			"title" : "계약명",
			"align" : "left",
		},
		{
			"title" : "매출처",
			"align" : "left",
		},
		{
			"title" : "계약금액",
			"align" : "right",
		},
		{
			"title" : "매출이익",
			"align" : "right",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "유지보수 시작일",
			"align" : "center",
		},
        {
			"title" : "유지보수 만료일",
			"align" : "center",
		},
        {
			"title" : "계산서 발행일",
			"align" : "center",
		},
        {
			"title" : "계산서 발행일",
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
			},
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].no,
			}
		];

		fnc = "scheduleDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawContList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()