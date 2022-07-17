$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getNoticeList();
});

function getNoticeList() {
	let url, dataArray = [], headerArray, container;
	
	container = document.getElementsByClassName("gridNoticeList");
	headerArray = [
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
			let list, disDate, setDate, str, ids = [], fnc;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				let jsonData = JSON.parse(list);
				for(let i = 0; i < jsonData.length; i++){
					disDate = dateDis(jsonData[i].created, jsonData[i].modified);
					setDate = dateFnc(disDate);
					str = [
						{
							"setData": jsonData[i].no,
						},
						{
							"setData": jsonData[i].title,
						},
						{
							"setData": jsonData[i].writer,
						},
						{
							"setData": setDate,
						}
					];

					fnc = "noticeDetailView(this);";
					ids.push(jsonData[i].no);
					dataArray.push(str);
				}
				
				createGrid(container, headerArray, dataArray, ids, fnc);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	});

}

function noticeDetailView(event){
	modal.show();
}