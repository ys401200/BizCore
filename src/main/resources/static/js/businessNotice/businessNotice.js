$(document).ready(init)

// Initializing Page
function init() {
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getNoticeList();
} // End of init()

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
				drawNoticeList(list);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	})
} // End of getNoticeList()


// API 서버에서 가져온 공지사항의 리스트를 화면에 그리는 함수
function drawNoticeList(list) {

	let html, target, header, style;


	target = $("#bodyContent");
	style = "display:grid;grid-template-columns:20px 40px 20px 20px";
	header = "<div style=\"" + style + "\"><div>번호</div><div>제목</div><div>작성자</div><div>등록일</div></div>";
	
	for (let i in listjson) {

		let no = listjson[i].no
		let title = listjson[i].title;
		let writerName = listjson[i].writerName;
		let created = listjson[i].created;
		html = "<div>" + no + "</div>" + "<div>" + title + "</div>" + "<div>" + writerName + "</div>" + "<div>" + created + "</div>"
	}

	html = header + html;
	if (target !== undefined && target !== undefined) target.html(html);
}; // End of drawNoticeList()

