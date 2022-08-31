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
	let url, method, data, type, scheduleRange;

	scheduleRange = $(document).find("#scheduleRange").val();

	
	url = "/api/schedule/calendar/" + scheduleRange;
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
} // End of getScheduleList()

function scheduleSearchList(){
	let searchCategory, searchText, url, method, data, type, scheduleRange;

	scheduleRange = $(document).find("#scheduleRange").val();

	url = "/api/schedule/calendar/" + scheduleRange;
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
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc;
	
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
	];

	setTimeout(() => {
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content;
			
			job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "없음" : jsonData[i].job;
			
			if(job === "sales"){
				job = "영업일정";
			}else if(job === "tech"){
				job = "기술지원";
			}else{
				job = "기타일정";
			}

			title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "제목 없음" : jsonData[i].title;
			customer = (jsonData[i].customer == 100002 || jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "없음" : storage.customer[jsonData[i].customer].name;
			writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "없음" : storage.user[jsonData[i].writer].userName;
			place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "없음" : jsonData[i].place;
			content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "내용 없음" : jsonData[i].content;
			
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
					"setData": writer,
				},
				{
					"setData": place,
				},
				{
					"setData": jsonData[i].sopp,
				},
				{
					"setData": content,
				},
			];
	
			fnc = "scheduleDetailView(this);";
			ids.push(jsonData[i].no);
			dataJob.push(jsonData[i].job);
			data.push(str);
		}
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawScheduleList", result[0]);
		pageContainer[0].innerHTML = pageNation;
		createGrid(container, header, data, ids, dataJob, fnc);
	}, 200);

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
		let now, year, month, day;
		year = tempDate.getFullYear();
		month = tempDate.getMonth()+1;
		day = tempDate.getDate();

		if(month < 10){
			month = "0" + month;
		}

		if(day < 10){
			day = "0" + day;
		}

		now = year + "-" + month + "-" + day;
        html += "<div class=\"calendar_cell" + (storage.currentMonth === tempDate.getMonth() + 1 ? "" : " calendar_cell_blur") + "\" data-date=\"" + t + "\">"; // start row / 해당월이 아닌 날짜의 경우 calendar_cell_blue 클래스명을 셀에 추가 지정함
        html += "<div class=\"calendar_date\" onclick='eventStop();scheduleInsertForm(\"" + now + "\");'>" + (calArr[x1].date.getDate()) + "</div>"; // 셀 안 최상단에 날짜 아이템을 추가함
        for(x2 = 0 ; x2 < slot ; x2++){
			x3 = [];
			if(x1 > 0){ // 전일 데이터와 비교, 일정의 연속성에대해 확인함
				x3[0] = calArr[x1 - 1].slot[x2] === calArr[x1].slot[x2];
			}
			if(x1 < calArr.length - 1){ // 익일 데이터와 비교, 일정의 연속성에대해 확인함
				x3[1] = calArr[x1 + 1].slot[x2] === calArr[x1].slot[x2];
			}
            t = calArr[x1].slot[x2] === undefined ? undefined : storage.scheduleList[calArr[x1].slot[x2]] ; //임시변수에 스케줄 아이템을 담아둠
            html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " data-id=" + (t === undefined ? '' : t.no) + " data-job=" + (t === undefined ? '' : t.job) + " onclick='" + (t === undefined ? 'eventStop();scheduleInsertForm("' + now + '");' : 'eventStop();scheduleDetailView(this);') + "'>" + (t === undefined ? "" : t.writer + " : " + t.title) + "</div>";
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
	let detailView, html = "", dataArray, job;

	job = (result.job === null || result.job === "" || result.job === undefined) ? "" : result.job;
	
	detailView = $(document).find(".detailContainer");
	detailView.hide();
	
	if(job === "sales"){
		let from, to, place, writer, sopp, customer, partner, title, content;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "없음" : result.place;

		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					sopp = resultData.title;
				}
			});
		}else{
			sopp = "없음";
		}

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "없음" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "없음" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "없음" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "내용 없음" : result.content;

		dataArray = [
			{
				"title": "일정시작일",
				"value": from,
			},
			{
				"title": "일정종료일",
				"value": to,
			},
			{
				"title": "장소",
				"value": place,
			},
			{
				"title": "담당자",
				"value": writer,
			},
			{
				"title": "영업기회",
				"value": sopp,
			},
			{
				"title": "매출처",
				"value": customer,
			},
			{
				"title": "엔드유저",
				"value": partner,
			},
			{
				"title": "제목",
				"value": title,
			},
			{
				"title": "내용",
				"value": content,
			}
		];
	}else if(job === "tech"){
		let from, to, place, writer, sopp, customer, partner, title, content, supportModel, supportVersion;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "없음" : result.place;
		
		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					sopp = resultData.title;
				}
			});
		}else{
			sopp = "없음";
		}

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "없음" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "없음" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "없음" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "내용 없음" : result.content;
		supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "없음" : result.supportModel;
		supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "없음" : result.supportVersion;

		dataArray = [
			{
				"title": "기술요청명",
				"value": title,
			},
			{
				"title": "영업기회",
				"value": sopp,
			},
			{
				"title": "엔드유저",
				"value": partner,
			},
			{
				"title": "모델",
				"value": supportModel,
			},
			{
				"title": "버전",
				"value": supportVersion,
			},
			{
				"title": "장소",
				"value": place,
			},
			{
				"title": "담당자",
				"value": writer,
			},
			{
				"title": "지원시작일",
				"value": from,
			},
			{
				"title": "지원종료일",
				"value": to,
			},
			{
				"title": "내용",
				"value": content,
			}
		];
	}else{
		let from, to, disDate, place, sopp, customer, writer, title, content;

		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "없음" : result.place;
		
		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					sopp = resultData.title;
				}
			});
		}else{
			sopp = "없음";
		}

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "없음" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "없음" : storage.customer[result.customer].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "내용 없음" : result.content;

		dataArray = [
			{
				"title": "일정시작일",
				"value": from,
			},
			{
				"title": "일정종료일",
				"value": to,
			},
			{
				"title": "장소",
				"value": place,
			},
			{
				"title": "영업기회",
				"value": sopp,
			},
			{
				"title": "담당자",
				"value": writer,
			},
			{
				"title": "매출처",
				"value": customer,
			},
			{
				"title": "제목",
				"value": title,
			},
			{
				"title": "내용",
				"value": content,
			}
		];
	}

	detailView.find(".detailMainSpan").text("테스트");
	detailView.find(".detailBtns").html("<button type='button' onclick='scheduleUpdateForm(" + JSON.stringify(result) + ")'>수정</button><button type='button' onclick='scheduleDelete(" + JSON.stringify(result) +")'>삭제</button><button type='button' onclick='detailContainerHide();'>닫기</button>");
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

	if(setMonth < 10){
		setMonth = "0" + setMonth;
	}

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

	if(setMonth < 10){
		setMonth = "0" + setMonth;
	}

	storage.currentYear = setYear;
	storage.currentMonth = setMonth;

	scheduleCalendarAjax();
}

function scheduleCalendarAjax(){
	let url, method, scheduleRange;

	scheduleRange = $(document).find("#scheduleRange").val();
	url = "/api/schedule/calendar/" + scheduleRange + "/" + storage.currentYear + "/" + storage.currentMonth;
	method = "get",

	$.ajax({
		url: url,
		method: method,
		dataType: "json",
		success:(result) => {
			let jsonData;
			jsonData = cipher.decAes(result.data);
			jsonData = JSON.parse(jsonData);
			storage.scheduleList = jsonData;
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

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
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

function scheduleInsertForm(getDate){
	let html, dataArray;

	dataArray = scheduleRadioInsert("sales", getDate);

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("일정등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$(document).find("[name='job'][value='sales']").prop("checked", true);
	}, 100);
}

function scheduleUpdateForm(result){
	let html, title, dataArray;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "제목 없음" : result.title;

	dataArray = scheduleRadioUpdate(result.job, result);

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text(title);
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("수정완료");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleUpdate(" + result.no + ");");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$(document).find("[name='job'][value='" + result.job + "']").prop("checked", true);
	}, 100);
}

function scheduleRadioClick(e, result){
	let html, dataArray, tempFrom, tempTo, value = $(e).val();
	
	tempFrom = $(document).find("#from").val();
	tempTo = $(document).find("#to").val();
	
	modal.hide();

	if(result === undefined){
		dataArray = scheduleRadioInsert(value);
		html = detailViewFormModal(dataArray);

		modal.show();
		modal.headTitle.text("일정등록");
		modal.content.css("width", "50%");
		modal.body.html(html);
		modal.body.css("max-height", "800px");
		modal.confirm.text("등록");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "scheduleInsert();");
		modal.close.attr("onclick", "modal.hide();");
	}else{
		dataArray = scheduleRadioUpdate(value, result);
		html = detailViewFormModal(dataArray);

		modal.show();
		modal.headTitle.text(result.title);
		modal.content.css("width", "50%");
		modal.body.html(html);
		modal.body.css("max-height", "800px");
		modal.confirm.text("수정완료");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "scheduleUpdate(" + result.no + ");");
		modal.close.attr("onclick", "modal.hide();");
	}

	setTimeout(() => {
		$(document).find("[name='job'][value='" + value + "']").prop("checked", true);
		$(document).find("#from").val(tempFrom);
		$(document).find("#to").val(tempTo);
	}, 100);
}

function scheduleRadioInsert(value, date){
	let dataArray, myName, my, now;

	my = storage.my;
	myName = storage.user[my].userName;

	if(date === undefined){
		now = new Date();
		date = now.toISOString().slice(0, 10);
	}

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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "활동시작일(*)",
				"elementId": "from",
				"value": date,
				"type": "date",
				"disabled": false,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "to",
				"value": date,
				"type": "date",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "place",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"value": myName,
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
				"elementId": "partner",
				"dataKeyup": "customer",
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "content",
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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "기술지원 요청명(*)",
				"elementId": "title",
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
				"elementId": "partner",
				"disabled": false,
				"dataKeyup": "customer",
			},
			{
				"title": "모델",
				"elementId": "supportModel",
				"disabled": false,
			},
			{
				"title": "버전",
				"elementId": "supportVersion",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "place",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"dataKeyup": "user",
				"elementId": "writer",
				"value": myName,
			},
			{
				"title": "지원 시작일(*)",
				"elementId": "from",
				"value": date,
				"disabled": false,
				"type": "date",
			},
			{
				"title": "지원 종료일(*)",
				"elementId": "to",
				"value": date,
				"disabled": false,
				"type": "date",
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "content",
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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "일정시작일(*)",
				"type": "date",
				"value": date,
				"elementId": "from",
				"disabled": false,
			},
			{
				"title": "일정종료일",
				"type": "date",
				"value": date,
				"elementId": "to",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "place",
				"disabled": false,
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"dataKeyup": "user",
				"value": myName,
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "customer",
				"dataKeyup": "customer",
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "content",
				"type": "textarea",
			},
		];
	}

	return dataArray;
}

function scheduleInsert(){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job;
	method = "post";
	type = "insert";

	if(job === "sales"){
		if($(document).find("#from").val() === ""){
			alert("활동시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("활동종료일을 선택해주세요.");
			return false;
		}else if($(document).find("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content;

			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $(document).find("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();

			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"partner": partner,
				"title": title,
				"content": content,
			};
		}
	}else if(job === "tech"){
		if($(document).find("#title").val() === ""){
			alert("기술요청명을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else if($(document).find("#sopp").val() === ""){
			alert("영업기회를 선택해주세요.");
			$(document).find("#sopp").focus();
			return false;
		}else if($(document).find("#partner").val() === ""){
			alert("엔드유저를 선택해주세요.");
			$(document).find("#partner").focus();
			return false;
		}else if($(document).find("#from").val() === ""){
			alert("지원시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("지원종료일을 선택해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content, supportModel, supportVersion;

			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $(document).find("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();
			supportModel = $(document).find("#supportModel").val();
			supportVersion = $(document).find("#supportVersion").val();

			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"partner": partner,
				"title": title,
				"content": content,
				"supportModel": supportModel,
				"supportVersion": supportVersion,
			};
		}
	}else{
		if($(document).find("#from").val() === ""){
			alert("일정시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("일정종료일을 선택해주세요.");
			return false;
		}else if($(document).find("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, title, content;
	
			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();
	
			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"title": title,
				"content": content,
			};
		}
	}

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, scheduleSuccessInsert, scheduleErrorInsert);
}

function scheduleSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function scheduleErrorInsert(){
	alert("등록에러");

}

function scheduleRadioUpdate(value, result){
	let dataArray; 

	if(value === "sales"){
		let from, to, place, writer, sopp, customer, partner, title, content;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		$.ajax({
			url: "/api/sopp/" + result.sopp,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				sopp = (resultData.no == 0) ? "" : resultData.title;
			}
		});

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "활동시작일",
				"elementId": "from",
				"type": "date",
				"disabled": false,
				"value": from,
			},
			{
				"title": "활동종료일",
				"elementId": "to",
				"type": "date",
				"disabled": false,
				"value": to,
			},
			{
				"title": "장소",
				"elementId": "place",
				"disabled": false,
				"value": place,
			},
			{
				"title": "담당자",
				"elementId": "writer",
				"value": writer,				
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
				"value": sopp,
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "customer",
				"dataKeyup": "customer",
				"value": customer,
			},
			{
				"title": "엔드유저",
				"disabled": false,
				"elementId": "partner",
				"dataKeyup": "customer",
				"value": partner,
			},
			{
				"title": "제목",
				"elementId": "title",
				"disabled": false,
				"value": title,
			},
			{
				"title": "내용",
				"type": "textarea",
				"value": content,
			}
		];
	}else if(value === "tech"){
		let from, to, place, writer, sopp, partner, title, content, supportModel, supportVersion;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		$.ajax({
			url: "/api/sopp/" + result.sopp,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				sopp = (resultData.no == 0) ? "" : resultData.title;
			}
		});

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
		supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;

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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "기술지원 요청명(*)",
				"elementId": "techdTitle",
				"disabled": false,
				"value": title,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
				"value": sopp,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "partner",
				"disabled": false,
				"dataKeyup": "customer",
				"value": partner,
			},
			{
				"title": "모델",
				"disabled": false,
				"value": supportModel,
			},
			{
				"title": "버전",
				"disabled": false,
				"value": supportVersion,
			},
			{
				"title": "장소",
				"disabled": false,
				"value": place,
			},
			{
				"title": "담당자(*)",
				"dataKeyup": "user",
				"elementId": "employee",
				"value": writer,
			},
			{
				"title": "지원일자 시작일",
				"disabled": false,
				"type": "date",
				"value": from,
			},
			{
				"title": "지원일자 종료일",
				"disabled": false,
				"type": "date",
				"value": to,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "content",
				"value": content,
			},
		];
	}else{
		let from, to, disDate, place, sopp, customer, writer, title, content;

		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		$.ajax({
			url: "/api/sopp/" + result.sopp,
			method: "get",
			async: false,
			dataType: "json",
			success:(resultData) => {
				sopp = (resultData.no == 0) ? "" : resultData.title;
			}
		});

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

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
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"disabled": false,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "일정시작일",
				"type": "date",
				"disabled": false,
				"value": from,
			},
			{
				"title": "일정종료일",
				"type": "date",
				"disabled": false,
				"value": to,
			},
			{
				"title": "장소",
				"disabled": false,
				"value": place,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
				"value": sopp,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"dataKeyup": "user",
				"value": writer,
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "customer",
				"dataKeyup": "customer",
				"value": customer,
			},
			{
				"title": "제목",
				"elementId": "title",
				"disabled": false,
				"value": title,
			},
			{
				"title": "내용",
				"elementId": "content",
				"value": content,
				"type": "textarea",
			},
		];
	}

	return dataArray;
}

function scheduleUpdate(no){
	let url, method, data, type, job;

	job = $(document).find("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + no;
	method = "put";
	type = "update";

	if(job === "sales"){
		if($(document).find("#from").val() === ""){
			alert("활동시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("활동종료일을 선택해주세요.");
			return false;
		}else if($(document).find("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content;

			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $(document).find("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();

			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"partner": partner,
				"title": title,
				"content": content,
			};
		}
	}else if(job === "tech"){
		if($(document).find("#title").val() === ""){
			alert("기술요청명을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else if($(document).find("#sopp").val() === ""){
			alert("영업기회를 선택해주세요.");
			$(document).find("#sopp").focus();
			return false;
		}else if($(document).find("#partner").val() === ""){
			alert("엔드유저를 선택해주세요.");
			$(document).find("#partner").focus();
			return false;
		}else if($(document).find("#from").val() === ""){
			alert("지원시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("지원종료일을 선택해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content, supportModel, supportVersion;

			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $(document).find("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();
			supportModel = $(document).find("#supportModel").val();
			supportVersion = $(document).find("#supportVersion").val();

			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"partner": partner,
				"title": title,
				"content": content,
				"supportModel": supportModel,
				"supportVersion": supportVersion,
			};
		}
	}else{
		if($(document).find("#from").val() === ""){
			alert("일정시작일을 선택해주세요.");
			return false;
		}else if($(document).find("#to").val() === ""){
			alert("일정종료일을 선택해주세요.");
			return false;
		}else if($(document).find("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$(document).find("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, title, content;
	
			from = $(document).find("#from").val();
			from = new Date(from).getTime();
			to = $(document).find("#to").val();
			to = new Date(to).getTime();
			place = $(document).find("#place").val();
			writer = $(document).find("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $(document).find("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $(document).find("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			title = $(document).find("#title").val();
			content = tinymce.activeEditor.getContent();
	
			data = {
				"job": job,
				"from": from,
				"to": to,
				"place": place,
				"writer": writer,
				"sopp": sopp,
				"customer": customer,
				"title": title,
				"content": content,
			};
		}
	}

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, scheduleSuccessUpdate, scheduleErrorUpdate);
}

function scheduleSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function scheduleErrorUpdate(){
	alert("에러");
}

function scheduleSelectChange(){
	let url, method, data, type, scheduleRange;

	scheduleRange = $(document).find("#scheduleRange").val();
	url = "/api/schedule/calendar/" + scheduleRange;
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSelectSuccess, scheduleSelectError);
}

function scheduleSelectSuccess(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawScheduleList, 600);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
	}else{
		window.setTimeout(drawScheduleList, 200);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
	}
}

function scheduleSelectError(){
	alert("에러");
}

function scheduleDelete(result){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + result.job + "/" + result.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, scheduleSuccessDelete, scheduleErrorDelete);
	}else{
		return false;
	}
}

function scheduleSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function scheduleErrorDelete(){
	alert("에러");
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