$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSalesList();
});

function getSalesList() {
	let url;
	
	url = apiServer + "/api/sales";

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
				storage.salesList = jsonData;
				window.setTimeout(drawSalesList, 200);
			} else {
				msg.set("등록된 영업활동이 없습니다");
			}
		}
	});
} // End of getScheduleList()

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
			"title" : "등록일",
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
			"align" : "left",
		},
		{
			"title" : "엔드유저",
			"align" : "left",
		},
		{
			"title" : "영업설명",
			"align" : "left",
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
			}
		];

		fnc = "scheduleDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSalesList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()