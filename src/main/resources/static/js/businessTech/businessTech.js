$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getTechList();
});

function getTechList() {
	let url;
	
	url = apiServer + "/api/tech";

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
				storage.techList = jsonData;
				window.setTimeout(drawTechList, 200);
			} else {
				msg.set("등록된 기술지원이 없습니다");
			}
		}
	});
} // End of getScheduleList()

function drawTechList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.techList === undefined) {
		msg.set("등록된 기술지원이 없습니다");
	}
	else {
		jsonData = storage.techList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridTechList");

	header = [
		{
			"title" : "등록일",
			"align" : "center",
		},
		{
			"title" : "등록구분",
			"align" : "center",
		},
		{
			"title" : "요청명",
			"align" : "left",
		},
		{
			"title" : "요청내용",
			"align" : "left",
		},
		{
			"title" : "매출처",
			"align" : "left",
		},
		{
			"title" : "진행단계",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "기술지원 시작일",
			"align" : "center",
		},
		{
			"title" : "기술지원 종료일",
			"align" : "center",
		},
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
		];

		fnc = "scheduleDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawTechList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()