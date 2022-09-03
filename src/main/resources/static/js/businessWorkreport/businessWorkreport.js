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

	url = "/api/schedule/workreport/personal/";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function drawWorkReportList() {
	let workReportContent, jsonData, html = "", header, disDate, start, end, week, getLastDate, getNextDate;
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

    disDate = dateDis(jsonData.start);
    start = dateFnc(disDate);

    disDate = dateDis(jsonData.end);
    end = dateFnc(disDate);

    getLastDate = calDays(start, "last");
    getNextDate = calDays(start, "next");

    html = "<div class='reportBtns'>";
    html += "<div class='reportBtnPrev'>";
    html += "<button type='button' data-date='" + getLastDate + "' onclick='workReportWeekBtn(this);'>이전</button>";
    html += "</div>";
    html += "<div class='reportBtnNext'>";
    html += "<button type='button' data-date='" + getNextDate + "' onclick='workReportWeekBtn(this);'>다음</button>";
    html += "</div>";
    html += "</div>";

    html += "<div class='reportContents'>";
    html += "<div class='reportHeader'>";

    for(let i = 0; i < header.length; i++){
        if(i == 2 || i == 3){
            html += "<div style='justify-content: left;'>" + header[i].title + "</div>";
        }else{
            html += "<div style='justify-content: center;'>" + header[i].title + "</div>";
        }
    }

    html += "</div>";
    
    html += "<div class='reportContent'>";
    
    if(jsonData.workReport !== null){
        html += "<div style='grid-row: span " + jsonData.workReport.schedules.length + "; justify-content: center;'>" + jsonData.week + "</div>";
        
        for(let i = 0; i < jsonData.workReport.schedules.length; i++){
            week = calWeekDay(jsonData.workReport.schedules[i].date);
            html += "<div style='justify-content: center;'>" + week + "</div>";
            html += "<div style='justify-content: left;'>" + jsonData.workReport.schedules[i].title + "</div>";
            html += "<div style='justify-content: left;'>" + jsonData.workReport.schedules[i].content + "</div>";
            html += "<div style='justify-content: center;'>" + start + "</div>";
            html += "<div style='justify-content: center;'>" + end + "</div>";
            html += "<div style='justify-content: center;'><input type='checkbox'></div>"; 
        }
        html += "<div style='justify-content: center;'>추가기재사항</div>";
        html += "<div style='grid-column: span 5'>";
        html += "<textarea style='width: -webkit-fill-available;'></textarea>";
        html += "</div>";
        html += "<div style='justify-content: center;'><input type='checkbox'></div>"; 
    }else{
        alert("데이터가 없습니다.");
    }

    html += "</div>";
    html += "</div>";

    workReportContent.html(html);
    setTiny();
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
    let url, method, data, type, getDate;

    getDate = $(e).data("date");

    url = "/api/schedule/workreport/personal/" + getDate;
    console.log(url);
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}
