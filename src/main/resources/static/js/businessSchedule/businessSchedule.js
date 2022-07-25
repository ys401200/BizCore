$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	$(".calendarList").hide();

	getScheduleList();
});

function getScheduleList() {
	let url;
	
	url = apiServer + "/api/schedule";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let jsonData;
			if (data.result === "ok") {
				jsonData = cipher.decAes(data.data);
				jsonData = JSON.parse(jsonData);
				storage.scheduleList = jsonData;
				window.setTimeout(drawScheduleList, 200);
				drawCalendar(document.getElementsByClassName("calendar_container")[0]);
			} else {
				msg.set("등록된 일정이 없습니다");
			}
		}
	});
} // End of getScheduleList()

function drawScheduleList() {
	let container, result, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc;
	
	if (storage.scheduleList === undefined) {
		msg.set("등록된 일정이 없습니다");
	}
	else {
		jsonData = storage.scheduleList;
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridScheduleList");

	header = [
		{
			"title" : "등록일",
			"align" : "center",
		},
		{
			"title" : "일정구분",
			"align" : "center",
		},
		{
			"title" : "일정제목",
			"align" : "left",
		},
		{
			"title" : "일정",
			"align" : "center",
		},
		{
			"title" : "고객사",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "left",
		},
		{
			"title" : "장소",
			"align" : "center",
		},
		{
			"title" : "활동형태",
			"align" : "center",
		},
		{
			"title" : "일정설명",
			"align" : "left",
		}
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);
		let userName = storage.user[jsonData[i].user].userName;

		str = [
			{
				"setData": setDate,
			},
			{
				"setData": jsonData[i].job,
			},
			{
				"setData": jsonData[i].title,
			},
			{
				"setData": jsonData[i].from,
			},
			{
				"setData": jsonData[i].cust,
			},
			{
				"setData": userName,
			},
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": jsonData[i].sopp,
			},
			{
				"setData": jsonData[i].detail,
			}
		];

		fnc = "scheduleDetailView(this);";
		ids.push(jsonData[i].no);
		data.push(str);
	}

	let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawScheduleList", result[0]);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, fnc);
}// End of drawNoticeList()

// 일정 캘린더를 만드는 함수
function drawCalendar(container){
    let calArr, slot, html, startDate, endDate, tempDate, tempArr, current, x1, x2, x3, t;

    calArr = [];
    tempDate = [];
    if(storage.currentYear === undefined)   storage.currentYear = (new Date()).getFullYear();
    if(storage.currentMonth === undefined)  storage.currentMonth = (new Date()).getMonth() + 1;

    startDate = new Date(storage.currentYear, storage.currentMonth - 1 , 1);
    endDate = new Date(storage.currentYear, storage.currentMonth - 1 , 28);

    // 시작하는 날짜 잡기
    while(startDate.getDay() != 0){
        startDate = new Date(startDate.getTime() - 86400000);
    }

    // 말일 찾기
    while(endDate.getDate() != 1){
        endDate = new Date(endDate.getTime() + 86400000);
    }
    endDate = new Date(endDate.getTime() - 86400000);

    // 종료일 잡기
    while(endDate.getDate() != 6){
        endDate = new Date(endDate.getTime() + 86400000);
    }

    // 만들어진 달력 날짜에 해당하는 일정이 있는 경우 담아두기
    for(x1 = 0 ; x1 <= (endDate.getTime() - startDate.getTime()) / 86400000 ; x1++){
        current = (startDate.getTime() + (86400000 * x1));
        calArr[x1] = {};
        calArr[x1].date = new Date(current);
        calArr[x1].schedule = [];
        for(x2 = 0 ; x2 < storage.scheduleList.length ; x2++){
            if(current + 86400000 > storage.scheduleList[x2].from && current <= storage.scheduleList[x2].to)    calArr[x1].schedule.push(x2);
        }
    }
    
    // 최대 일정 수량 잡기
    slot = 0;
    for(x1 = 0 ; x1 < calArr.length ; x1++){
        if(calArr[x1].schedule.length > slot)   slot = calArr[x1].schedule.length;
    }

    // slot 최소값 설정하고 날짜에 slot 미리 설정학
    slot = slot < 5 ? 5 : slot;
    for(x1 = 0 ; x1 < calArr.length ; x1++) calArr[x1].slot = new Array(slot);

    // 슬롯에 일정 추가하기
    for(x1 = 0 ; x1 < calArr.length ; x1++){
        for(x2 = 0 ; x2 < calArr[x1].schedule.length ; x2++){
            for(x3 = 0 ; x3 < slot ; x3++){
                if(calArr[x1].slot[x3] === undefined){
                    calArr[x1].slot[x3] = calArr[x1].schedule[x2];
                    break;
                }
            }
        }
    }

    // 연속된 일정에 대한 슬롯 번호 맞추기
    for(x1 = 1 ; x1 < calArr.length ; x1++){
        tempArr = calArr[x1].slot; // 임시 변수에 당일 슬롯 데이터를 옮기고 당일 슬롯을 초기화 함
        calArr[x1].slot = new Array(slot);
        for(x2 = 0 ; x2 < tempArr.length ; x2++){ // 당일 데이터를 순회하며 전일 데이터와 맞추고 임시변수에서 지움
            if(tempArr[x2] === undefined)   break;
            t = calArr[x1 - 1].slot.indexOf(tempArr[x2]);
            if(t > 0){
                calArr[x1].slot[t] = tempArr[x2];
                tempArr[x2] = undefined;
            }           
        }
        for(x2 = 0 ; x2 < tempArr.length ; x2++){ // 전일 데이터와 맞추지않은 데이터들에 대해 비어있는 상위 슬롯으로 데이터를 넣어줌
            if(tempArr[x2] === undefined)   continue;
            for(x3 = 0 ; x3 < calArr[x1].slot.length ; x3++){
                if(calArr[x1].slot[x3] === undefined){
                    calArr[x1].slot[x3] = tempArr[x2];
                    break;
                }
            }
        }
    }
    
    html = "<div class=\"calendar_header\">일</div>";
	html += "<div class=\"calendar_header\">월</div>";
	html += "<div class=\"calendar_header\">화</div>";
	html += "<div class=\"calendar_header\">수</div>";
	html += "<div class=\"calendar_header\">목</div>";
	html += "<div class=\"calendar_header\">금</div>";
	html += "<div class=\"calendar_header\">토</div>";

    for(x1 = 0 ; x1 < calArr.length ; x1++){
        tempDate = calArr[x1].date; // 해당 셀의 날짜 객체를 가져 옮
        t = tempDate.getFullYear();
        t += (tempDate.getMonth() < 9 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1);
        t += (tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate()); // 셀에 저장해 둘 날짜 문자열 생성
        html += "<div class=\"calendar_cell" + (storage.currentMonth === tempDate.getMonth() + 1 ? "" : " calendar_cell_blur") + "\" data-date=\"" + t + "\">"; // start row / 해당월이 아닌 날짜의 경우 calendar_cell_blue 클래스명을 셀에 추가 지정함
        html += "<div class=\"calendar_date\">" + (calArr[x1].date.getDate()) + "</div>"; // 셀 안 최상단에 날짜 아이템을 추가함
        for(x2 = 0 ; x2 < slot ; x2++){
			x3 = [];
			if(x1 > 0){ // 전일 데이터와 비교, 일정의 연속성에대해 확인함
				x3[0] = calArr[x1 - 1].slot[x2] === calArr[x1].slot[x2];
			}
			if(x1 < calArr.length - 1){ // 익일 데이터와 비교, 일정의 연속성에대해 확인함
				x3[1] = calArr[x1 + 1].slot[x2] === calArr[x1].slot[x2];
			}
            t = calArr[x1].slot[x2] === undefined ? undefined : storage.scheduleList[calArr[x1].slot[x2]] ; //임시변수에 스케줄 아이템을 담아둠
            html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : " data-id=\"" + calArr[x1].slot[x2] + "\"") + ">" + (t === undefined ? "" : storage.user[t.user].userName + " : " + t.title) + "</div>";
        }
        html += "</div>";
    }
    container.innerHTML = html;
    return true;
} // End of drawCalendar()

// ==============================================
function createCalendar(year, month, type){
	let date, day, nowDate, nowDay, last, lastDate, row, calendar, dNum, tdClass, calendarBody;

	calendarBody = $(".calendarList table tbody");

	if(year === undefined || month === undefined){
		date = new Date();
		year = date.getFullYear();
		month = date.getMonth();
		day = date.getDate();
	}
	
	if(type === "prev"){
		nowDate = new Date(year, month-1, 1);
		nowDay = nowDate.getDay();
	}else{
		nowDate = new Date(year, month, 1);
		nowDay = nowDate.getDay();
	}
	
	last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if(year % 4 && year % 100 != 0 || year % 400 == 0){
		lastDate = last[1] = 29;
	}

	if(month == 12){
		lastDate = last[month-1];
	}else{
		lastDate = last[month];
	}

	row = Math.ceil((nowDay + lastDate)/7);
	dNum = 1;

	for(let i = 1; i <= row; i++){
		calendar += "<tr>";
		for(let k = 1; k <= 7; k++){
			if(i == 1 && k <= nowDay || dNum > lastDate){
				calendar += "<td>&nbsp;</td>";
			}else{
				tdClass = "";

				if(dNum == day){
					tdClass = "today";
				}else{
					tdClass = "";
				}

				if(k == 1){
					tdClass += "sun";
				}else if(k == 7){
					tdClass += "sat";
				}

				calendar += "<td class='"+tdClass+"'>" + "<strong class='date'>" + dNum + "</strong></td>";
				dNum++;
			}
		}
		calendar += "</tr>";
	}

	calendarBody.html(calendar);
}

function calendarNext(event){
	let getYear, getMonth, setYear, setMonth, type;

	getYear = $(".calendarYear");
	getMonth = $(".calendarMonth");
	setYear = parseInt(getYear.html());
	setMonth = parseInt(getMonth.html());
	type = "next";
	
	if(setMonth == 12){
		setYear = setYear + 1;
		setMonth = 0;
	}
	
	createCalendar(setYear, setMonth, type);
	
	setMonth = setMonth + 1;

	getYear.html(setYear);
	getMonth.html(setMonth);
}

function calendarPrev(event){
	let getYear, getMonth, setYear, setMonth;

	getYear = $(".calendarYear");
	getMonth = $(".calendarMonth");
	setYear = parseInt(getYear.html());
	setMonth = parseInt(getMonth.html());
	type = "prev";

	if(setMonth == 1){
		setYear = setYear - 1;
		setMonth = 13;
	}

	setMonth = setMonth - 1;
	
	createCalendar(setYear, setMonth, type);
	
	getYear.html(setYear);
	getMonth.html(setMonth);
}

function listChange(event){
	let tableList = $(".gridScheduleList");
	let calendarList = $(".calendarList");
	let pageContainer = $(".pageContainer");

	if($(event).data("type") === "table"){
		tableList.hide();
		pageContainer.hide();
		calendarList.show();
		$(event).data("type", "calendar");
		$(event).text("테이블로 표시");
	}else{
		tableList.show();
		pageContainer.show();
		calendarList.hide();
		$(event).data("type", "table");
		$(event).text("달력으로 표시");
	}
}

function insertScheduleForm(){
	let html = "";

	html = "<form class='defaultForm' id='insertScheduleForm'>";
	html += "<div class='formDefaultTitle'><span>일정일자<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>장소<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>계약관련<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>영업기회<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>담당자<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>매출처<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>엔드유저<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>일정구분<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>활동형태<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>제목<span></div>";
	html += "<div class='formDefaultContent'><input type='text'></div>";
	html += "<div class='formDefaultTitle'><span>내용<span></div>";
	html += "<div class='formDefaultContent'><textarea></textarea></div>";
	html += "</form>";
	
	modal.show();
	modal.headTitle.text("일정 등록");
	modal.content.css("width", "800px");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
}