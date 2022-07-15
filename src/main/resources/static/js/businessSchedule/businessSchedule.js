$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getScheduleList();
});

function getScheduleList() {
	let url;
	let scheduleHeaderArray = [
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
			let list, id, type;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				let jsonData = JSON.parse(list);
				id = "gridScheduleList";
				createGrid(id, type, scheduleHeaderArray, jsonData);
			} else {
				msg.set("등록된 일정이 없습니다");
			}
		}
	});
}