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
	let url, method, data, type, scheduleType, scheduleRange;

	scheduleType = $(document).find("#scheduleType").val();
	scheduleRange = $(document).find("#scheduleRange").val();

	if(scheduleType === undefined || scheduleRange === undefined){
		url = "/api/schedule";
	}else{
		url = "/api/schedule/" + scheduleType + "/" + scheduleRange;
	}

	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
} // End of getScheduleList()

function scheduleSearchList(){
	let searchCategory, searchText, url, method, data, type, scheduleType, scheduleRange;

	scheduleType = $(document).find("#scheduleType").val();
	scheduleRange = $(document).find("#scheduleRange").val();

	if(scheduleType === undefined || scheduleRange === undefined){
		url = "/api/schedule";
	}else{
		url = "/api/schedule" + scheduleType + "/" + scheduleRange;
	}
	
	method = "get";
	data = "";
	type = "list";

	searchCategory = $(document).find("#scheduleSearchCategory").val();
	searchText = $(document).find("#scheduleSearchValue").val();
	
	localStorage.setItem("searchList", true);
	localStorage.setItem("searchCategory", searchCategory);
	localStorage.setItem("searchText", searchText);

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
}

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
			"title" : "번호",
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
			"title" : "매출처",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
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
		},
		{
			"title" : "등록일",
			"align" : "center",
		}
		
	];

	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
		let job, title, customer, userName, fromDate, fromSetDate, toDate, toSetDate, place, detail;

		disDate = dateDis(jsonData[i].created, jsonData[i].modified);
		setDate = dateFnc(disDate);

		job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "없음" : jsonData[i].job;

		if(job === "sales"){
			job = "영업일정";
		}else if(job === "tech"){
			job = "기술지원";
		}else{
			job = "기타일정";
		}

		title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "제목 없음" : jsonData[i].title;
		customer = (jsonData[i].cust == 0 || jsonData[i].cust === null || jsonData[i].cust === undefined) ? "없음" : storage.customer[jsonData[i].cust].name;
		userName = (jsonData[i].user == 0 || jsonData[i].user === null || jsonData[i].user === undefined) ? "없음" : storage.user[jsonData[i].user].userName;
		place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "없음" : jsonData[i].place;
		detail = (jsonData[i].detail === null || jsonData[i].detail === "" || jsonData[i].detail === undefined) ? "내용 없음" : jsonData[i].detail;
		
		fromDate = dateDis(jsonData[i].from);
		fromSetDate = dateFnc(fromDate);
		
		toDate = dateDis(jsonData[i].to);
		toSetDate = dateFnc(toDate);

		str = [
			{
				"setData": jsonData[i].no,
			},
			{
				"setData": job,
			},
			{
				"setData": title,
			},
			{
				"setData": fromSetDate + " ~ " + toSetDate,
			},
			{
				"setData": customer,
			},
			{
				"setData": userName,
			},
			{
				"setData": place,
			},
			{
				"setData": jsonData[i].sopp,
			},
			{
				"setData": detail,
			},
			{
				"setData": setDate,
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

	$(document).find(".calendarYear").text(storage.currentYear);
	$(document).find(".calendarMonth").text(storage.currentMonth);

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
        html += "<div class=\"calendar_cell" + (storage.currentMonth === tempDate.getMonth() + 1 ? "" : " calendar_cell_blur") + "\" data-date=\"" + t + "\" onclick='scheduleInsertForm();'>"; // start row / 해당월이 아닌 날짜의 경우 calendar_cell_blue 클래스명을 셀에 추가 지정함
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
            html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " onclick='eventStop();scheduleSuccessView(this);'>" + (t === undefined ? "" : storage.user[t.user].userName + " : " + t.title) + "</div>";
        }
        html += "</div>";
    }
    container.innerHTML = html;
    return true;
} // End of drawCalendar()

function scheduleDetailView(e){
	let id, job, url, method, data, type;

	id = $(e).data("id");
	job = $(e).data("job");
	url = "/api/schedule/" + job + "/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, scheduleSuccessView, scheduleErrorView);
}

function scheduleSuccessView(result){
	let detailView, html = "", dataArray;

	detailView = $(document).find(".detailContainer");
	detailView.hide();

	dataArray = [
		{
			"title": "일정시작일",
			"value": "test 일정시작일",
		},
		{
			"title": "일정종료일",
			"value": "test 일정종료일",
		},
		{
			"title": "장소",
			"value": "test 장소",
		},
		{
			"title": "계약",
			"value": "test 계약",
		},
		{
			"title": "영업기회",
			"value": "test 영업기회",
		},
		{
			"title": "담당자",
			"value": "test 담당자",
		},
		{
			"title": "매출처",
			"value": "test 매출처",
		},
		{
			"title": "엔드유저",
			"value": "test 엔드유저",
		},
		{
			"title": "활동형태",
			"value": "test 활동형태",
		},
		{
			"title": "제목",
			"value": "test 제목",
		},
		{
			"title": "내용",
			"value": "test 내용",
		}
	];
	
	detailView.find(".detailMainSpan").text("테스트");
	detailView.find(".detailBtns").html("<button type='button' onclick='scheduleUpdateForm(" + JSON.stringify(result) + ")'>수정</button><button type='button' onclick='scheduleDelete(" + result.no + ")'>삭제</button><button type='button' onclick='detailContainerHide();'>닫기</button>");
	html = detailViewForm(dataArray);
	detailView.find(".detailContent").html(html);
	detailView.show();
}

function scheduleErrorView(){
	alert("에러");
}

function eventStop(){
	if(event.stopPropagation){
		event.stopPropagation();
	}
	event.cancelBubble = true;
}

//
// function createCalendar(year, month, type){
// 	let date, day, nowDate, nowDay, last, lastDate, row, calendar, dNum, tdClass, calendarBody;

// 	calendarBody = $(".calendarList table tbody");

// 	if(year === undefined || month === undefined){
// 		date = new Date();
// 		year = date.getFullYear();
// 		month = date.getMonth();
// 		day = date.getDate();
// 	}
	
// 	if(type === "prev"){
// 		nowDate = new Date(year, month-1, 1);
// 		nowDay = nowDate.getDay();
// 	}else{
// 		nowDate = new Date(year, month, 1);
// 		nowDay = nowDate.getDay();
// 	}
	
// 	last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 	if(year % 4 && year % 100 != 0 || year % 400 == 0){
// 		lastDate = last[1] = 29;
// 	}

// 	if(month == 12){
// 		lastDate = last[month-1];
// 	}else{
// 		lastDate = last[month];
// 	}

// 	row = Math.ceil((nowDay + lastDate)/7);
// 	dNum = 1;

// 	for(let i = 1; i <= row; i++){
// 		calendar += "<tr>";
// 		for(let k = 1; k <= 7; k++){
// 			if(i == 1 && k <= nowDay || dNum > lastDate){
// 				calendar += "<td>&nbsp;</td>";
// 			}else{
// 				tdClass = "";

// 				if(dNum == day){
// 					tdClass = "today";
// 				}else{
// 					tdClass = "";
// 				}

// 				if(k == 1){
// 					tdClass += "sun";
// 				}else if(k == 7){
// 					tdClass += "sat";
// 				}

// 				calendar += "<td class='"+tdClass+"'>" + "<strong class='date'>" + dNum + "</strong></td>";
// 				dNum++;
// 			}
// 		}
// 		calendar += "</tr>";
// 	}

// 	calendarBody.html(calendar);
// }

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
	
	setMonth = setMonth + 1;

	getYear.html(setYear);
	getMonth.html(setMonth);

	storage.currentYear = setYear;
	storage.currentMonth = setMonth;

	scheduleCalendarAjax();
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
	
	getYear.html(setYear);
	getMonth.html(setMonth);

	storage.currentYear = setYear;
	storage.currentMonth = setMonth;

	scheduleCalendarAjax();
}

function scheduleCalendarAjax(){
	let url, method, scheduleType, scheduleRange;

	scheduleType = $(document).find("#scheduleType").val();
	scheduleRange = $(document).find("#scheduleRange").val();

	if(scheduleType === undefined || scheduleRange === undefined){
		url = "/api/schedule";
	}else{
		url = "/api/schedule" + scheduleType + "/" + scheduleRange + "/" + storage.currentYear + storage.currentMonth;
	}

	method = "get",

	$.ajax({
		url: url,
		method: method,
		dataType: "json",
		success:(result) => {
			storage.scheduleList = result;
			window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
		}
	});
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

function scheduleSuccessList(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawScheduleList, 600);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
	}else{
		window.setTimeout(drawScheduleList, 200);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
	}
}

function scheduleErrorList(){
	alert("에러");
}

// function scheduleSuccessView(result){
// 	let job, title, customer, userName, fromDate, fromSetDate, toDate, toSetDate, place, detail;

// 	disDate = dateDis(result.created, result.modified);
// 	setDate = dateFnc(disDate);

// 	job = (result.job === null || result.job === "") ? "없음" : result.job;
// 	title = (result.title === null || result.title === "") ? "제목 없음" : result.title;
// 	customer = (result.cust == 0 || result.cust === null) ? "없음" : storage.customer[result.cust].name;
// 	userName = (result.user == 0 || result.user === null) ? "없음" : storage.user[result.user].userName;
// 	place = (result.place === null || result.place === "") ? "없음" : result.place;
// 	detail = (result.detail === null || result.detail === "") ? "내용 없음" : result.detail;

// 	fromDate = dateDis(result.from);
// 	fromSetDate = dateFnc(fromDate);
	
// 	toDate = dateDis(result.to);
// 	toSetDate = dateFnc(toDate);

// 	html = "<table class='defaultTable'>";
// 	html += "<tr>";
// 	html += "<th>번호</th>";
// 	html += "<td>" + result.no + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>일정구분</th>";
// 	html += "<td>" + job + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>일정제목</th>";
// 	html += "<td>" + title + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>일정</th>";
// 	html += "<td>" + fromSetDate + " ~ " + toSetDate + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>매출처</th>";
// 	html += "<td>" + customer + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>담당자</th>";
// 	html += "<td>" + userName + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>장소</th>";
// 	html += "<td>" + place + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>활동형태</th>";
// 	html += "<td>" + result.sopp + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>일정설명</th>";
// 	html += "<td>" + detail + "</td>";
// 	html += "</tr>";
// 	html += "<tr>";
// 	html += "<th>등록일</th>";
// 	html += "<td>" + setDate + "</td>";
// 	html += "</tr>";
// 	html += "</table>";

// 	modal.show();
// 	modal.headTitle.text("상세보기");
// 	modal.content.css("width", "800px");
// 	modal.body.html(html);
// 	modal.confirm.hide();
// 	modal.close.text("취소");
// 	modal.close.css("width", "100%");
// }

// function scheduleErrorView(){
// 	alert("에러");
// }

function scheduleInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "일정선택",
			"radioValue": [
				{
					"key": "sales",
					"value": "영업일정",
				},
				{
					"key": "tech",
					"value": "기술일정",
				},
				{
					"key": "etc",
					"value": "기타일정",
				},
			],
			"type": "radio",
			"elementName": "scheduleType",
			"disabled": false,
			"onClick": "scheduleRadioClick(this);",
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("일정등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleInser();");
	modal.close.attr("onclick", "modal.hide();");
}

function scheduleInser(){
	let title, employee, customer, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales, detail, data;

	title = $(document).find("#title").val();
	employee = $(document).find("#employee");
	employee = dataListFormat(employee.attr("id"), employee.val());
	customer = $(document).find("#customer");
	customer = dataListFormat(customer.attr("id"), customer.val());
	picOfCustomer = customer
	endUser = $(document).find("#endUser");
	endUser = dataListFormat(endUser.attr("id"), endUser.val());
	status = $(document).find("#status").val();
	progress = $(document).find("#progress").val();
	contType = $(document).find("#contType").val();
	targetDate = $(document).find("#targetDate").val();
	targetDate = new Date(targetDate).getTime();
	soppType = $(document).find("#soppType").val();
	expectedSales = $(document).find("#expectedSales").val().replaceAll(",", "");
	detail = tinymce.activeEditor.getContent();

	url = "/api/sopp";
	method = "post";
	data = {
		"title": title,
		"employee": employee,
		"customer": customer,
		"picOfCustomer": picOfCustomer,
		"endUser": endUser,
		"status": status,
		"progress": progress,
		"contType": contType,
		"targetDate": targetDate,
		"soppType": soppType,
		"expectedSales": expectedSales,
		"detail": detail,
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, scheduleSuccessInsert, scheduleErrorInsert);
}

function scheduleSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function scheduleErrorInsert(){
	alert("에러");
}

function scheduleUpdateForm(result){
	let html, title, userName, customer, customerUser, endUser, progress, disDate, expectedSales, detail, dataArray;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
	userName = (result.employee == 0 || result.employee === null || result.employee === undefined) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "데이터 없음 " : storage.customer[result.customer].name;
	customerUser = (result.picOfCustomer == 0 || result.picOfCustomer === null || result.picOfCustomer === undefined) ? "데이터 없음" : storage.user[result.picOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null || result.endUser === undefined) ? "데이터 없음" : storage.customer[result.endUser].name;
	status = (result.status === null || result.status === "" || result.status === undefined) ? "없음" : storage.code.etc[result.status];
	progress = (result.progress === null || result.progress === "" || result.progress === undefined) ? "데이터 없음" : result.progress;
	contType = (result.contType === null || result.contType === "" || result.contType === undefined) ? "없음" : storage.code.etc[result.contType];
	soppType = (result.soppType === null || result.soppType === "" || result.soppType === undefined) ? "데이터 없음" : storage.code.etc[result.soppType];
	expectedSales = (result.expectedSales === null || result.expectedSales === "" || result.expectedSales === undefined) ? "데이터 없음" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "" || result.detail === undefined) ? "내용 없음" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);

	dataArray = [
		{
			"title": "일정선택",
			"radioValue": [
				{
					"key": "sales",
					"value": "영업일정",
				},
				{
					"key": "tech",
					"value": "기술일정",
				},
				{
					"key": "etc",
					"value": "기타일정",
				},
			],
			"type": "radio",
			"elementName": "scheduleType",
			"disabled": false,
			"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text(title);
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("수정완료");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "soppUpdate(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");
}

function scheduleRadioClick(e, result){
	let html, value, title, userName, customer, customerUser, endUser, progress, disDate, expectedSales, detail, dataArray;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
	userName = (result.employee == 0 || result.employee === null || result.employee === undefined) ? "데이터 없음" : storage.user[result.employee].userName;
	customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "데이터 없음 " : storage.customer[result.customer].name;
	customerUser = (result.picOfCustomer == 0 || result.picOfCustomer === null || result.picOfCustomer === undefined) ? "데이터 없음" : storage.user[result.picOfCustomer].userName;
	endUser = (result.endUser == 0 || result.endUser === null || result.endUser === undefined) ? "데이터 없음" : storage.customer[result.endUser].name;
	status = (result.status === null || result.status === "" || result.status === undefined) ? "없음" : storage.code.etc[result.status];
	progress = (result.progress === null || result.progress === "" || result.progress === undefined) ? "데이터 없음" : result.progress;
	contType = (result.contType === null || result.contType === "" || result.contType === undefined) ? "없음" : storage.code.etc[result.contType];
	soppType = (result.soppType === null || result.soppType === "" || result.soppType === undefined) ? "데이터 없음" : storage.code.etc[result.soppType];
	expectedSales = (result.expectedSales === null || result.expectedSales === "" || result.expectedSales === undefined) ? "데이터 없음" : numberFormat(result.expectedSales);
	detail = (result.detail === null || result.detail === "" || result.detail === undefined) ? "내용 없음" : result.detail;
	
	disDate = dateDis(result.targetDate);
	targetDate = dateFnc(disDate);
	value = $(e).val();

	if(value === "sales"){
		dataArray = [
			{
				"title": "일정선택",
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "etc",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "scheduleType",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "활동시작일",
				"elementId": "from",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "활동종료일",
				"elementId": "to",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "place",
				"disabled": false,
			},
			{
				"title": "활동형태",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
				"disabled": false,
			},
			{
				"title": "담당자",
				"disabled": false,
				"elementId": "user",
				"dataKeyup": "user",
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "customer",
				"dataKeyup": "customer",
			},
			{
				"title": "엔드유저",
				"disabled": false,
				"elementId": "endUser",
				"dataKeyup": "customer",
			},
			{
				"title": "제목",
				"elementId": "title",
				"disabled": false,
			},
			{
				"title": "내용",
				"type": "textarea",
			}
		];
	}else if(value === "tech"){
		dataArray = [
			{
				"title": "일정선택",
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "etc",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "scheduleType",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "등록구분",
				"radioValue": [
					{
						"key": "NEW",
						"value": "신규영업지원",
					},
					{
						"key": "ING",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementName": "contractType",
				"disabled": false,
				"onClick": "techRadioClick(this);",
			},
			{
				"title": "기술지원 요청명(*)",
				"elementId": "techdTitle",
				"disabled": false,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "endUser",
				"disabled": false,
				"dataKeyup": "customer",
			},
			{
				"title": "엔드유저 담당자",
				"elementId": "cipOfendUser",
				"disabled": false,
				"dataKeyup": "user",
			},
			{
				"title": "모델",
				"disabled": false,
			},
			{
				"title": "버전",
				"disabled": false,
			},
			{
				"title": "장소",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"dataKeyup": "user",
				"elementId": "employee",
				"dataKeyup": "user",
			},
			{
				"title": "지원일자 시작일",
				"disabled": false,
				"type": "date",
			},
			{
				"title": "지원일자 종료일",
				"disabled": false,
				"type": "date",
			},
			{
				"title": "지원형태(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10187",
						"value": "전화상담",
					},
					{
						"key": "10208",
						"value": "현장방문",
					},
					{
						"key": "10209",
						"value": "원격지원",
					}
				],
				"elementId": "salesType",
				"type": "select",
				"disabled": false,
			},
			{
				"title": "지원단계(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10213",
						"value": "접수단계",
					},
					{
						"key": "10214",
						"value": "출동단계",
					},
					{
						"key": "10215",
						"value": "미계약에 따른 보류",
					},
					{
						"key": "10253",
						"value": "처리완료",
					}
				],
				"elementId": "salesType",
				"type": "select",
				"disabled": false,
			},
			{
				"title": "설명",
				"type": "textarea",
				"elementId": "detail",
			},
		];
	}else{
		dataArray = [
			{
				"title": "일정선택",
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "etc",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "scheduleType",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "일정시작일",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "일정종료일",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "장소",
				"disabled": false,
			},
			{
				"title": "계약",
				"disabled": false,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"dataKeyup": "user",
				"elementId": "employee",
				"dataKeyup": "user",
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "customer",
				"dataKeyup": "customer",
			},
			{
				"title": "엔드유저",
				"disabled": false,
				"elementId": "endUser",
				"dataKeyup": "customer",
			},
			{
				"title": "일정구분",
				"selectValue": [
					{
						"key": "",
						"value": "기타일정",
					},
				],
				"elementId": "salesType",
				"type": "select",
				"disabled": false,
			},
			{
				"title": "활동형태",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
				"disabled": false,
			},
			{
				"title": "제목",
				"elementId": "title",
				"disabled": false,
			},
			{
				"title": "내용",
				"type": "textarea",
			},
		];
	}

	html = detailViewFormModal(dataArray);
	modal.body.html(html);

	setTimeout(() => {
		$(document).find("[name='scheduleType'][value='" + value + "']").attr("checked", true);
	}, 100);
}

function scheduleSelectChange(){
	let url, method, data, type, scheduleType, scheduleRange;

	scheduleType = $(document).find("#scheduleType").val();
	scheduleRange = $(document).find("#scheduleRange").val();
	url = "/api/schedule" + scheduleType + "/" + scheduleRange;
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSelectSuccess, scheduleSelectError);
}

function scheduleSelectSuccess(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawScheduleList, 600);
	}else{
		window.setTimeout(drawScheduleList, 200);
	}
}

function scheduleSelectError(){
	alert("에러");
}