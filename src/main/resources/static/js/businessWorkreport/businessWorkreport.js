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
	let workReportContent, jsonData, html = "", header, disDate, start, end, week, getLastDate, getNextDate, nowDate;
    
    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

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

    start = new Date(storage.workReportList.start);
    start = new Date(start.getTime() + 86400000 * 7);
    disDate = dateDis(start);
    start = dateFnc(disDate);

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
    
    let rowLength = 0;
    for(let i = 0; i < jsonData.schedules.length; i++){
        let date = new Date(jsonData.schedules[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            rowLength++;
        }
    }

    html += "<div style='grid-row: span " + rowLength + "; justify-content: center;'>" + storage.workReportList.week + "</div>";
    
    for(let i = 0; i < jsonData.schedules.length; i++){
        let date = new Date(jsonData.schedules[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            week = calWeekDay(jsonData.schedules[i].date);
            html += "<div style='justify-content: center;'>" + week + "</div>";
            html += "<div style='justify-content: left;'>" + jsonData.schedules[i].title + "</div>";
            html += "<div style='justify-content: left;'>" + jsonData.schedules[i].content + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            html += "<div style='justify-content: center;'><input type='checkbox' id='schedCheck' data-id='" + jsonData.schedules[i].no + "' data-job='" + jsonData.schedules[i].job + "' checked></div>"; 
        }
    }
    html += "<div style='justify-content: center;'>추가기재사항</div>";
    html += "<div style='grid-column: span 5'>";
    html += "<textarea id='currentWeek' style='width: -webkit-fill-available;'>" + jsonData.previousWeek + "</textarea>";
    html += "</div>";

    if(jsonData.previousWeekCheck == true){
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck' checked></div>"; 
    }else{
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck'></div>";
    }

    html += "</div>";
    html += "</div>";

    workReportContent.html(html);

    nowDate = new Date();
    nowDate = nowDate.toISOString().substring(0, 10).replaceAll("-", "");

    if($("#reportInsertBtn").attr("onclick") === undefined){
        $("#reportInsertBtn").attr("onclick", "reportInsert(" + nowDate + ")");
    }

    tinymce.remove();
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
    $("#reportInsertBtn").attr("onclick", "reportInsert(" + getDate + ")");

    url = "/api/schedule/workreport/personal/" + getDate;
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function reportInsert(date){
    let url, method, data, type, jsonData, dataArray = [];

    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

    $("#schedCheck").each((index, item) => {
        let temp = 
            {
                "no": $(item).data("id").toString(),
                "job": $(item).data("job"),
                "report": ($(item).is(":checked") == true) ? true : false,
            };

        dataArray.push(temp);
    });

    console.log(dataArray);

    url = "/api/schedule/workreport/personal/" + date;
    method = "post";
    data = {
        "currentWeek": jsonData.currentWeek,
        "currentWeekCheck": jsonData.currentWeekCheck,
        "previousWeek": tinymce.activeEditor.getContent(),
        "previousWeekCheck": ($("#previousWeekCheck").is(":checked") == true) ? true : false,
        "schedule": dataArray,
    };
    type = "insert";

    console.log(data);

    data = JSON.stringify(data);
    data = cipher.encAes(data);

    crud.defaultAjax(url, method, data, type, workReportSuccessInsert, workReportErrorInsert);
}

function workReportSuccessInsert(){
    alert("등록완료");
    location.reload();
}

function workReportErrorInsert(){
    alert("에러");
}
