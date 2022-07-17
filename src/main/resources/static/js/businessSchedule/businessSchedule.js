$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getScheduleList();
});

function getScheduleList() {
	let url, dataArray = [], headerArray, container;
	
	container = document.getElementsByClassName("gridScheduleList");
	headerArray = [
		{
			"title" : "등록일",
			"padding" : false,
		},
		{
			"title" : "일정구분",
			"padding" : false,
		},
		{
			"title" : "일정제목",
			"padding" : true,
		},
		{
			"title" : "일정",
			"padding" : false,
		},
		{
			"title" : "고객사",
			"padding" : false,
		},
		{
			"title" : "담당자",
			"padding" : true,
		},
		{
			"title" : "장소",
			"padding" : false,
		},
		{
			"title" : "활동형태",
			"padding" : false,
		},
		{
			"title" : "일정설명",
			"padding" : true,
		}
		
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
						}
					];

					fnc = "scheduleDetailView(this);";
					ids.push(jsonData[i].no);
					dataArray.push(str);
				}
				createGrid(container, headerArray, dataArray, fnc);
			} else {
				msg.set("등록된 일정이 없습니다");
			}
		}
	});
}