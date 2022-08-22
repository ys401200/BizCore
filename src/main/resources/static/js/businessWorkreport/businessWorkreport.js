$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getWorkReport();
});

function getWorkReport() {
	let url, method, data, type;

	url = "/api/workreport";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function drawWorkReportList() {
	let workReportContent, jsonData, html = "", header;
    jsonData = storage.workReportList;

	workReportContent = $(".workReportContainer .workReportContent");

    header = [
        {
            "title": "주차"
        },
        {
            "title": "요일"
        },
        {
            "title": "일정제목"
        },
        {
            "title": "일정내용"
        },
        {
            "title": "일정시작"
        },
        {
            "title": "일정종료"
        },
        {
            "title": "업무일지반영"
        },
    ];

    html = "<div class='reportBtns'>";
    html += "<button type='button'>이전</button>";
    html += "<button type='button'>다음</button>";
    html += "</div>";

    html += "<div class='reportContent'>";

    for(let i = 0; i < header.length; i++){
        html += "<div>" + header[i].title + "</div>";
    }

    html += "<div>" + jsonData[i].data + "</div>";

    for(let i = 0; i < jsonData.length; i++){
        html += "<div>" + jsonData[i].data + "</div>";
        html += "<div>" + jsonData[i].data + "</div>";
        html += "<div>" + jsonData[i].data + "</div>";
        html += "<div>" + jsonData[i].data + "</div>";
        html += "<div>" + jsonData[i].data + "</div>";
        html += "<div><input type='checkbox'></div>";
    }

    html += "</div>";

    workReportContent.html(html);
}

function workReportSuccessList(result){
	storage.workReportList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawWorkReportList, 600);
	}else{
		window.setTimeout(drawWorkReportList, 200);
	}
}

function workReportErrorList(){
	alert("에러");
}

function workReportWeekBtn(e){
    let url, method, data, type;

    url = "/api/workReport" + $(e).data("week");
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}