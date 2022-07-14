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
	let noticeHeaderArray = ["번호", "제목", "작성자", "등록일"];
	
	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			let listjson;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				let jsonData = JSON.parse(list);
				createGrid("gridNoticeList", noticeHeaderArray, jsonData);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	})
}