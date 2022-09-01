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

	url = "/api/schedule/workreport/personal/20220718";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function drawWorkReportList() {
	let workReportContent, jsonData, html = "", header, disDate, start, end, week;
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

    html += "<div class='reportContents'>";
    html += "<div class='reportHeader'>";

    for(let i = 0; i < header.length; i++){
        html += "<div>" + header[i].title + "</div>";
    }

    html += "</div>";
    
    disDate = dateDis(jsonData.start);
    start = dateFnc(disDate);

    disDate = dateDis(jsonData.end);
    end = dateFnc(disDate);

    html += "<div class='reportContent'>";
    html += "<div style='grid-row: span 5'>" + jsonData.week + "</div>";

    for(let i = 0; i < jsonData.workReport.schedules.length; i++){
        week = calWeekDay(jsonData.workReport.schedules[i].date);
        html += "<div>" + week + "</div>";
        html += "<div>" + jsonData.workReport.schedules[i].title + "</div>";
        html += "<div>" + jsonData.workReport.schedules[i].content + "</div>";
        html += "<div>" + start + "</div>";
        html += "<div>" + end + "</div>";
        html += "<div><input type='checkbox'></div>"; 
    }

    html += "</div>";
    html += "</div>";

    workReportContent.html(html);
}

function workReportSuccessList(result){
    console.log(result);
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
