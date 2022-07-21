$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getTechList();
});

function getTechList() {
	let url, dataArray = [], headerArray, container, pageContainer;
	
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridTechList");
	headerArray = [
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

					fnc = "techDetailView(this);";
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