$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getNoticeList();
});

function getNoticeList() {
	let url;
	let noticeHeaderArray = [
		{
			"title" : "번호",
			"padding" : false,
		},
		{
			"title" : "제목",
			"padding" : true,
		},
		{
			"title" : "작성자",
			"padding" : false,
		},
		{
			"title" : "등록일",
			"padding" : false,
		}
	];
	
	url = apiServer + "/api/notice";

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
				id = "gridNoticeList";
				createGrid(id, type, noticeHeaderArray, jsonData);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	});
}