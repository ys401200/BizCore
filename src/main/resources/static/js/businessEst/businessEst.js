$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getEstList();
});

function getEstList() {
	let url;
	
	url = apiServer + "/api/est";

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
				storage.estList = jsonData;
				window.setTimeout(drawEstList, 200);
			} else {
				msg.set("등록된 견적이 없습니다");
			}
		}
	});
} // End of getScheduleList()

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
			"align" : "left",
		},
		{
			"title" : "공급가",
			"align" : "right",
		},
		{
			"title" : "부가세",
			"align" : "right",
		},
		{
			"title" : "합계",
			"align" : "rigth",
		},
		{
			"title" : "적요",
			"align" : "left",
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

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSoppList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()