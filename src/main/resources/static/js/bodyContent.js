$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	
	$("#sideMenu").find("ul:not(#panel) li a").click(function(){
		if($(this).attr("class") !== "active"){
			$(this).next().attr("class", "active");
			$(this).find("#slideSpan").text("-");
			$(this).attr("class", "active");
		}else{
			$(this).removeAttr("class");
			$(this).next().removeAttr("class");
			$(this).find("#slideSpan").text("+");
		}
	});
	menuActive();
	getNoticeList();
} // End of init()

//페이징될 때 header, sideMenu active를 위한 함수
function menuActive(){
	let i = null, pathName = null, fullStr = null, firstStr = null, lastStr = null, strLength = null, sideMenu = null, mainTopMenu = null;
	
	pathName = $("#pathName").val();
	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");
	strLength = pathName.length;
	i = 0;

	if(pathName === "root"){
		mainTopMenu.find("ul li button").removeAttr("class");
		mainTopMenu.find("ul li button[data-keyword='business']").attr("class", "active");

		readyTopPageActive();
	}else{
		readyTopPageActive();

		while(i <= strLength){
			fullStr = pathName.charAt(i);
	
			if(fullStr == fullStr.toUpperCase()){
				firstStr = pathName.substring(0, i).toLowerCase();
				lastStr = pathName.substring(i, strLength).toLowerCase();
				
				mainTopMenu.find("ul li button").removeAttr("class");
				mainTopMenu.find("ul li button[data-keyword='"+firstStr+"']").attr("class", "active");

				sideMenu.find("ul[id='"+firstStr+"']").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").prev().attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").prev().find("#slideSpan").text("-");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").attr("class", "active");
				
				break;
			}
	
			i++;
		}
	}
}

//사이드 메뉴 클릭
function bodyTopPageClick(e){
	let id = $(e).attr("data-keyword");
	
	$("#mainTopMenu ul li button").removeAttr("class");
	$(e).attr("class", "active");
	
	$("#sideMenu").find("ul").not("#panel").removeAttr("class");
	$("#sideMenu").find("#" + id).attr("class", "active");
}

//header active 여부에 따라 사이드메뉴 active 적용
function readyTopPageActive(){
	let sideMenu = null, mainTopMenu = null;

	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");

	mainTopMenu.find("ul li button").each(function(index, item){
		if($(item).attr("class") === "active"){
			sideMenu.find("ul").not("[id='"+$(item).attr("data-keyword")+"']").removeAttr("class");
			sideMenu.find("ul[id='"+$(item).attr("data-keyword")+"']").attr("class", "active");
		}
	});
}

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
	body = "";
	html = "";

	for (let i in listjson) {
		let no = listjson[i].no;
		let title = listjson[i].title;
		let writer = listjson[i].writer;
		let created = listjson[i].created;
		body += ("<div style=\"" + style + "\">");
		body += ("<div>" + no + "</div>" + "<div>" + title + "</div>" + "<div>" + writer + "</div>" + "<div>" + created + "</div>");
		body += "</div>";
	}

	html = (header + body);
	if (target !== undefined && target !== undefined) target.html(html);
}; // End of drawNoticeList()

