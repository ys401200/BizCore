$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getEstList();
});

function getEstList() {
	let url, dataArray = [], headerArray, container, pageContainer;
	
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridEstList");
	headerArray = [
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
	
	url = apiServer + "/api/schedule";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list, disDate, setDate, str, ids = [], fnc;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				let jsonData = JSON.parse(list);
				storage.scheduleList = jsonData;

				for(let i = 0; i < jsonData.length; i++){
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

					fnc = "estDetailView(this);";
					ids.push(jsonData[i].no);
					dataArray.push(str);
				}

				var pageNation = createPaging(pageContainer[0], 50, "testClick");
				pageContainer[0].innerHTML = pageNation;
				createGrid(container, headerArray, dataArray, ids, fnc);
			} else {
				msg.set("등록된 데이터가 없습니다");
			}
		}
	});
} // End of getScheduleList()