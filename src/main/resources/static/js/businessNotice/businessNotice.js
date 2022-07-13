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

			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	})
} // End of getNoticeList()


// API 서버에서 가져온 공지사항의 리스트를 화면에 그리는 함수
function drawNoticeList(listjson) {

	let html, target, header, subHeader, body, footer, headerstyle, bodystyle;


	target = $("#bodyContent");
	headerstyle = "display:grid;grid-template-columns:85% 5% 5% 5%";
	bodystyle = "display:grid;grid-template-columns:20% 40% 20% 20%";
	header = "<div style=\"" + headerstyle + "\"><div>공지사항 조회</div><button>펼치기</button><button>초기화</button><button>검색</button></div>"
	subHeader = "<div>show" + "<select><option value=\"" + 20 + "\">20</option><option value=\"" + 40 + "\">40</option></select>" + "entries</div>";
	body = "<div style=\"" + bodystyle + "\"><div>번호</div><div>제목</div><div>작성자</div><div>등록일</div></div>";
	body += "<div style=\"" + bodystyle + "\">";
	footer = "<div>현재 # 건</div>"
	html = "";

	for (let i in listjson) {

		let no = listjson[i].no
		let title = listjson[i].title;
		let writer = listjson[i].writer;
		let created = listjson[i].created;
		created = new Date(created);
		created = (created.getYear() + 1900 + "년" + "\n") + (created.getMonth() + 1 + "월" + "\n") + (created.getDate() + "일");
		body += ("<div>" + no + "</div>" + "<div><a onclick=\"" + getNoticeDetail(no) + "\"; return false;>\"" + title + "\"</a> </div>" + "<div>" + writer + "</div>" + "<div>" + created + "</div>");

 




		console.log("글 번호 값 확인 로그 :" + no);
	}


	body += "</div>";
	html = (header + subHeader + body + footer);
	console.log(html);
	if (target !== undefined && target !== null) target.html(html);




}; // End of drawNoticeList()


function getNoticeDetail(no) {
	let url, target, data;

	url = apiServer + "/api/notice/" + no;
	target = $("#bodyContent");
	console.log("온클릭 함수 적용 확인 "+no);
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {

			if (result.result === "ok") {
				data = result.data;
				target.html("확인!");
			} else {
				msg.set("공지사항 상세 조회 실패");
			}
		}
	})



}





