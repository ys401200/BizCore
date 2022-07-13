$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getNoticeList();
});

// API 서버에서 공지사항 리스트를 가져오는 함수
function getNoticeList() {
	let url;

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
				listjson = JSON.parse(list);
				drawNoticeList(listjson);
				console.log(listjson);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	})
} // End of getNoticeList()


// API 서버에서 가져온 공지사항의 리스트를 화면에 그리는 함수
function drawNoticeList(listjson) {

	let html, target, header, style;


	target = $("#bodyContent");
	style = "display:grid;grid-template-columns:20% 40% 20% 20%";
	header = "<div style=\"" + style + "\"><div>번호</div><div>제목</div><div>작성자</div><div>등록일</div></div>";
	body = "<div style=\"" + style + "\">";
	html= "";
	
	for (let i in listjson) {

		let no = listjson[i].no
		let title = listjson[i].title;
		let writer = listjson[i].writer;
		let created = listjson[i].created;
		body += ("<div>" + no + "</div>" + "<div>" + title + "</div>" + "<div>" + writer + "</div>" + "<div>" + created + "</div>");
	}

	body += "</div>"
	html = (header + body)
	if (target !== undefined && target !== undefined) target.html(html);
}; // End of drawNoticeList()