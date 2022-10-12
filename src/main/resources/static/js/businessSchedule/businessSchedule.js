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
	scheduleRange = $("#scheduleRange").val();
	url = "/api/schedule/calendar/" + scheduleRange;
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
} // End of getScheduleList()

function drawScheduleList() {
	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, detailBackBtn;
	
	if (storage.scheduleList === undefined) {
		msg.set("등록된 일정이 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.scheduleList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	containerTitle = $("#containerTitle");
	pageContainer = document.getElementsByClassName("pageContainer");
	detailBackBtn = $(".detailBackBtn");
	container = $(".gridList");

	header = [
		{
			"title" : "일정",
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

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 9,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content, type;
			
			job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "" : jsonData[i].job;
			
			if(job === "sales"){
				job = "영업일정";
			}else if(job === "tech"){
				job = "기술지원";
			}else{
				job = "기타일정";
			}
	
			title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "" : jsonData[i].title;
			customer = (jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "" : storage.customer[jsonData[i].customer].name;
			writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "" : storage.user[jsonData[i].writer].userName;
			place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "" : jsonData[i].place;
			content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "" : jsonData[i].content;
			content = content.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br />", "");
			type = (jsonData[i].type === null || jsonData[i].type === "" || jsonData[i].type === undefined) ? "" : storage.code.etc[jsonData[i].type];
			
			fromDate = dateDis(jsonData[i].from);
			fromSetDate = dateFnc(fromDate, "mm-dd");
			
			toDate = dateDis(jsonData[i].to);
			toSetDate = dateFnc(toDate, "mm-dd");
	
			str = [
				{
					"setData": fromSetDate + " ~ " + toSetDate,
				},
				{
					"setData": job,
				},
				{
					"setData": title,
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
					"setData": type,
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
	}

	containerTitle.html("일정조회");
	$(pageContainer).children().show();
	detailBackBtn.hide();
	createGrid(container, header, data, ids, dataJob, fnc);

	let path = $(location).attr("pathname").split("/");
	let menu = [
		{
			"keyword": "add",
			"onclick": "scheduleInsertForm();"
		},
		{
			"keyword": "notes",
			"onclick": ""
		},
		{
			"keyword": "set",
			"onclick": ""
		},
	];

	if(path[3] !== undefined && jsonData !== ""){
		let content = $(".gridContent[data-id=\"" + path[3] + "\"]");
		scheduleDetailView(content);
	}

	plusMenuSelect(menu);

}// End of drawNoticeList()

// 일정 캘린더를 만드는 함수
function drawCalendar(container){
    let calArr, slot, html, startDate, endDate, tempDate, tempArr, current, x1, x2, x3, t, now;

    calArr = [];
    tempDate = [];
    if(storage.currentYear === undefined)   storage.currentYear = (new Date()).getFullYear();
    if(storage.currentMonth === undefined)  storage.currentMonth = (new Date()).getMonth() + 1;

	$(".calendarYear").text(storage.currentYear);
	$(".calendarMonth").text(storage.currentMonth);

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
		let year, month, day;
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
			
			if(x2 > 2){
				html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " data-id=" + (t === undefined ? '' : t.no) + " data-job=" + (t === undefined ? '' : t.job) + " onclick='" + (t === undefined ? 'eventStop();scheduleInsertForm("' + now + '");' : 'eventStop();calendarDetailView(this);') + "' data-sort=" + (t === undefined ? 0 : 1) + " style='display:none;'>" + (t === undefined ? "" : storage.user[t.writer].userName + " : " + t.title) + "</div>";
			}else{
				html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " data-id=" + (t === undefined ? '' : t.no) + " data-job=" + (t === undefined ? '' : t.job) + " onclick='" + (t === undefined ? 'eventStop();scheduleInsertForm("' + now + '");' : 'eventStop();calendarDetailView(this);') + "' data-sort=" + (t === undefined ? 0 : 1) + ">" + (t === undefined ? "" : storage.user[t.writer].userName + " : " + t.title) + "</div>";
			}
        }

        html += "</div>";
    }
    container.innerHTML = html;

	setTimeout(() => {
		$(".calendar_cell").each((index, item) => {
			if($(item).children().not(".calendar_item_empty").length > 4){
				$(item).append("<div class=\"calendar_span_empty\" onclick=\"eventStop();scheduleInsertForm(" + now + ");\"><span data-flag=\"false\" onclick=\"eventStop();calendarMore(this);\">more →</span></div>");
			}
		});
	}, 100);

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
	let html, dataArray, notIdArray, gridList, searchContainer, containerTitle, detailBackBtn;
	gridList = $(".gridList");
	searchContainer = $(".searchContainer");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	dataArray = scheduleRadioUpdate(result.job, result);
	html = detailViewForm(dataArray);
	containerTitle.html(result.title);
	gridList.html("");
	searchContainer.hide();
	gridList.html(html);
	gridList.show();
	notIdArray = ["employee"];

	setTimeout(() => {
		$("[name='job'][value='" + result.job + "']").prop("checked", true).removeAttr("onclick");
		detailBackBtn.css("display", "flex");
		detailBackBtn.attr("onclick", "drawScheduleList();");

		if(result.job === "sales"){
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;

			$("#type option[value='" + type + "']").prop("selected", true);
		}else if(result.job === "tech"){
			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;

			$("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
			$("#type option[value='" + type + "']").prop("selected", true);
			$("#supportStep option[value='" + supportStep + "']").prop("selected", true);
		}

		let jobArray = $("input[name=\"job\"]");
		let menu = [
			{
				"keyword": "add",
				"onclick": "scheduleInsertForm();"
			},
			{
				"keyword": "edit",
				"onclick": "enableDisabled(this, \"scheduleUpdate(" + result.no + ");\", \"" + notIdArray + "\");"
			},
			{
				"keyword": "delete",
				"onclick": "scheduleDelete(" + JSON.stringify(result) + ");"
			},
		];

		for(let i = 0; i < jobArray.length; i++){
			if(!$(jobArray[i]).is(":checked")){
				$(jobArray[i]).hide();
				$(jobArray[i]).next().hide();
			}
		}

		plusMenuSelect(menu);
		setTiny();
		tinymce.activeEditor.mode.set('readonly');
		inputDataList();
	}, 100);
}

function scheduleErrorView(){
	alert("에러");
}

function calendarDetailView(e){
	let id, job, url, method, data, type;

	id = $(e).data("id");
	job = $(e).data("job");
	url = "/api/schedule/" + job + "/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, calendarSuccessView, calendarErrorView);
}

function calendarSuccessView(result){
	let html, title, dataArray, notIdArray;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	dataArray = scheduleRadioUpdate(result.job, result);
	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.headTitle.text(title);
	modal.body.html(html);
	modal.confirm.text("수정");
	modal.close.text("삭제");
	notIdArray = ["writer"];
	modal.confirm.attr("onclick", "enableDisabled(this, \"scheduleUpdate(" + result.no + ");\", \"" + notIdArray + "\");");
	modal.close.attr("onclick", "scheduleDelete(" + JSON.stringify(result) + ");");

	setTimeout(() => {
		$("[name='job'][value='" + result.job + "']").prop("checked", true).removeAttr("onclick");

		if(result.job === "sales"){
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			$("#type option[value='" + type + "']").prop("selected", true);
		}else if(result.job === "tech"){
			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;

			$("[name='contractMethod'][value='" + contractMethod + "']").prop("checked", true);
			$("#type option[value='" + type + "']").prop("selected", true);
			$("#supportStep option[value='" + supportStep + "']").prop("selected", true);
		}

		let jobArray = $("input[name=\"job\"]");

		for(let i = 0; i < jobArray.length; i++){
			if(!$(jobArray[i]).is(":checked")){
				$(jobArray[i]).hide();
				$(jobArray[i]).next().hide();
			}
		}

		setTiny();
		tinymce.activeEditor.mode.set('readonly');
	}, 100);
}

function calendarErrorView(){
	alert("에러");
}

function eventStop(){
	if(event.stopPropagation){
		event.stopPropagation();
	}
	event.cancelBubble = true;
}

function calendarNext(){
	let getYear, getMonth, setYear, setMonth;

	getYear = $(".calendarYear");
	getMonth = $(".calendarMonth");
	setYear = parseInt(getYear.html());
	setMonth = parseInt(getMonth.html());
	
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

function calendarPrev(){
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

	scheduleRange = $("#scheduleRange").val();
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
	let tableList = $(".gridList");
	let calendarList = $(".calendarList");
	let pageContainer = $(".pageContainer");

	if($(event).data("type") === "table"){
		tableList.hide();
		pageContainer.hide();
		calendarList.show();
		$(event).data("type", "calendar");
		$(event).html("<i class=\"fa-solid fa-list-ol fa-xl\"></i>");
		$(".searchContainer").hide();
	}else{
		tableList.show();
		pageContainer.show();
		calendarList.hide();
		$(event).data("type", "table");
		$(event).html("<i class=\"fa-regular fa-calendar-check fa-xl\"></i>");
		$(".searchContainer").show();
	}
}

function scheduleSuccessList(result){
	storage.scheduleList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(drawScheduleList, 600);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
		window.setTimeout(addSearchList, 800);
		window.setTimeout(searchContainerSet, 800);
	}else{
		window.setTimeout(drawScheduleList, 200);
		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
		window.setTimeout(addSearchList, 400);
		window.setTimeout(searchContainerSet, 400);
	}
}

function scheduleErrorList(){
	alert("에러");
}

function scheduleInsertForm(getDate){
	let html, dataArray;

	dataArray = scheduleRadioInsert("sales", getDate);

	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.headTitle.text("일정등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "scheduleInsert();");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$("[name='job'][value='sales']").prop("checked", true);
	}, 100);
}

function scheduleRadioClick(e, result){
	let html, dataArray, tempFrom, tempTo, value = $(e).val(), notIdArray;
	
	tempFrom = $("#from").val();
	tempTo = $("#to").val();

	modal.hide();
	
	if(result === undefined){
		dataArray = scheduleRadioInsert(value);
		html = detailViewForm(dataArray, "modal");
		
		modal.show();
		modal.headTitle.text("일정등록");
		modal.body.html(html);
		modal.confirm.text("등록");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "scheduleInsert();");
		modal.close.attr("onclick", "modal.hide();");
	}else{
		dataArray = scheduleRadioUpdate(value, result);
		html = detailViewForm(dataArray, "modal");

		modal.show();
		modal.headTitle.text(result.title);
		modal.body.html(html);
		modal.confirm.text("수정");
		modal.close.text("삭제");
		notIdArray = ["writer"];
		modal.confirm.attr("onclick", "enableDisabled(this, \"scheduleUpdate(" + result.no + ");\", \"" + notIdArray + "\");");
		modal.close.attr("onclick", "scheduleDelete(" + JSON.stringify(result) + ");");
	}

	setTimeout(() => {
		$("[name='job'][value='" + value + "']").prop("checked", true);
		$("#from").val(tempFrom);
		$("#to").val(tempTo);
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
				"title": undefined,
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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
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
				"title": "담당자(*)",
				"elementId": "writer",
				"dataKeyup": "user",
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
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"type": "textarea",
				"col": 4,
			}
		];
	}else if(value === "tech"){
		dataArray = [
			{
				"title": undefined,
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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"disabled": false,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "등록구분",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementName": "contractMethod",
				"elementId": ["contractMethodNew", "contractMethodOld"],
				"col": 4,
				"disabled": false,
			},
			{
				"title": "기술지원 요청명(*)",
				"elementId": "title",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"disabled": false,
			},
			{
				"title": "계약",
				"elementId": "contract",
				"dataKeyup": "contract",
				"disabled": false,
			},
			{
				"title": "매출처",
				"disabled": false,
				"elementId": "partner",
				"dataKeyup": "customer",
			},
			{
				"title": "매출처 담당자",
				"dataKeyup": "customerUser",
				"elementId": "cipOfCustomer",
				"disabled": false,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "customer",
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
				"title": "단계",
				"selectValue": [
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
				"type": "select",
				"elementId": "supportStep",
				"disabled": false,
			},
			{
				"title": "지원형태",
				"selectValue": [
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
				"type": "select",
				"elementId": "type",
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
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "content",
				"col": 4,
			},
		];
	}else{
		dataArray = [
			{
				"title": undefined,
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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
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
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"type": "textarea",
				"col": 4,
			},
		];
	}

	return dataArray;
}

function scheduleInsert(){
	let url, method, data, type, job;

	job = $("[name='job']:checked").val();

	url = "/api/schedule/" + job;
	method = "post";
	type = "insert";

	if(job === "sales"){
		if($("#from").val() === ""){
			alert("활동시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("활동종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content, type;

			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $("#title").val();
			content = tinymce.activeEditor.getContent();
			type = $("#type").val();

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
				"type": type,
			};
		}
	}else if(job === "tech"){
		if($("#title").val() === ""){
			alert("기술요청명을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() === ""){
			alert("영업기회를 선택해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#partner").val() === ""){
			alert("엔드유저를 선택해주세요.");
			$("#partner").focus();
			return false;
		}else if($("#from").val() === ""){
			alert("지원시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("지원종료일을 선택해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep, type;

			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $("#title").val();
			content = tinymce.activeEditor.getContent();
			supportModel = $("#supportModel").val();
			supportVersion = $("#supportVersion").val();
			contract = $("#contract");
			contract = dataListFormat(contract.attr("id"), contract.val()); 
			contractMethod = $("[name='contractMethod']:checked").val();
			cipOfCustomer = $("#cipOfCustomer");
			cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
			supportStep = $("#supportStep").val();
			type = $("#type").val();

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
				"contract": contract,
				"contractMethod": contractMethod,
				"cipOfCustomer": cipOfCustomer,
				"supportStep": supportStep,
				"type": type,
			};
		}
	}else{
		if($("#from").val() === ""){
			alert("일정시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("일정종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, title, content;
	
			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			title = $("#title").val();
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
		
		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					let jsonData;
					jsonData = cipher.decAes(resultData.data);
					jsonData = JSON.parse(jsonData);
					sopp = jsonData.title;
				}
			});
		}else{
			sopp = 0;
		}

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "" : storage.user[result.writer].userName;
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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "활동시작일",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "활동종료일",
				"elementId": "to",
				"type": "date",
				"value": to,
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
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
			},
			{
				"title": "담당자",
				"elementId": "writer",
				"dataKeyup": "user",
				"value": writer,				
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"value": sopp,
			},
			{
				"title": "매출처",
				"elementId": "customer",
				"dataKeyup": "customer",
				"value": customer,
			},
			{
				"title": "엔드유저",
				"elementId": "partner",
				"dataKeyup": "customer",
				"value": partner,
			},
			{
				"type": "",
			},
			{
				"title": "제목",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"type": "textarea",
				"value": content,
				"col": 4,
			}
		];
	}else if(value === "tech"){
		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					let jsonData;
					jsonData = cipher.decAes(resultData.data);
					jsonData = JSON.parse(jsonData);
					sopp = jsonData.title;
				}
			});
		}else{
			sopp = 0;
		}

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
		supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;
		cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer === "" || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
		contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : storage.code.etc[result.contractMethod];
		supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "" : storage.code.etc[result.supportStep];
		type = (result.type === "" || result.type === null || result.type === undefined) ? "" : storage.code.etc[result.type]; 

		if(result.contract > 0){
			$.ajax({
				url: "/api/contract/" + result.contract,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					let jsonData;
					jsonData = cipher.decAes(resultData.data);
					jsonData = JSON.parse(jsonData);
					contract = jsonData.title;
				}
			});
		}else{
			contract = "";
		}

		if(cipOfCustomer !== ""){
			$.ajax({
				url: "/api/system/cip/" + cipOfCustomer,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					let jsonData;
					jsonData = cipher.decAes(resultData.data);
	
					cipOfCustomer = jsonData;
				}
			});
		}

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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "등록구분",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementId": "contractMethod",
				"elementName": "contractMethod",
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
				"value": sopp,
			},
			{
				"title": "계약",
				"elementId": "contract",
				"dataKeyup": "contract",
				"value": contract,
			},
			{
				"title": "매출처",
				"elementId": "partner",
				"dataKeyup": "customer",
				"value": partner,
			},
			{
				"title": "매출처 담당자",
				"dataKeyup": "customerUser",
				"elementId": "cipOfCustomer",
				"value": cipOfCustomer,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "customer",
				"dataKeyup": "customer",
				"value": customer,
			},
			{
				"title": "모델",
				"elementId": "supportModel",
				"value": supportModel,
			},
			{
				"title": "버전",
				"elementId": "supportVersion",
				"value": supportVersion,
			},
			{
				"title": "단계",
				"selectValue": [
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
				"type": "select",
				"elementId": "supportStep",
			},
			{
				"title": "지원형태",
				"selectValue": [
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
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
			},
			{
				"title": "담당자(*)",
				"dataKeyup": "user",
				"elementId": "writer",
				"value": writer,
			},
			{
				"title": "지원일자 시작일",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "지원일자 종료일",
				"elementId": "to",
				"type": "date",
				"value": to,
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "기술지원 요청명(*)",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "content",
				"value": content,
				"col": 4,
			},
		];
	}else{
		let from, to, disDate, place, sopp, customer, writer, title, content;

		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		if(result.sopp > 0){
			$.ajax({
				url: "/api/sopp/" + result.sopp,
				method: "get",
				async: false,
				dataType: "json",
				success:(resultData) => {
					let jsonData;
					jsonData = cipher.decAes(resultData.data);
					jsonData = JSON.parse(jsonData);
					sopp = jsonData.title;
				}
			});
		}else{
			sopp = 0;
		}

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
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this, " + JSON.stringify(result) + ");",
			},
			{
				"title": "일정시작일",
				"type": "date",
				"elementId": "from",
				"value": from,
			},
			{
				"title": "일정종료일",
				"type": "date",
				"elementId": "to",
				"value": to,
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"dataKeyup": "sopp",
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
				"elementId": "customer",
				"dataKeyup": "customer",
				"value": customer,
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "제목",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"value": content,
				"type": "textarea",
				"col": 4,
			},
		];
	}

	return dataArray;
}

function scheduleUpdate(no){
	let url, method, data, type, job;

	job = $("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + no;
	method = "put";
	type = "update";

	if(job === "sales"){
		if($("#from").val() === ""){
			alert("활동시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("활동종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, partner, title, content, type;

			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $("#title").val();
			content = tinymce.activeEditor.getContent();
			type = $("#type").val();

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
				"type": type,
			};
		}
	}else if(job === "tech"){
		if($("#title").val() === ""){
			alert("기술요청명을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() === ""){
			alert("영업기회를 선택해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#customer").val() === ""){
			alert("엔드유저를 선택해주세요.");
			$("#customer").focus();
			return false;
		}else if($("#from").val() === ""){
			alert("지원시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("지원종료일을 선택해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion, supportStep, type;

			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			partner = $("#partner");
			partner = dataListFormat(partner.attr("id"), partner.val());
			title = $("#title").val();
			content = tinymce.activeEditor.getContent();
			supportModel = $("#supportModel").val();
			supportVersion = $("#supportVersion").val();
			contract = $("#contract");
			contract = dataListFormat(contract.attr("id"), contract.val()); 
			contractMethod = $("[name='contractMethod']:checked").val();
			cipOfCustomer = $("#cipOfCustomer");
			cipOfCustomer = dataListFormat(cipOfCustomer.attr("id"), cipOfCustomer.val());
			supportStep = $("#supportStep").val();
			type = $("#type").val();

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
				"contract": contract,
				"contractMethod": contractMethod,
				"cipOfCustomer": cipOfCustomer,
				"supportStep": supportStep,
				"type": type,
			};
		}
	}else{
		if($("#from").val() === ""){
			alert("일정시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			alert("일정종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else{
			let from, to, place, writer, sopp, customer, title, content;
	
			from = $("#from").val();
			from = new Date(from).getTime();
			to = $("#to").val();
			to = new Date(to).getTime();
			place = $("#place").val();
			writer = $("#writer");
			writer = dataListFormat(writer.attr("id"), writer.val());
			sopp = $("#sopp");
			sopp = dataListFormat(sopp.attr("id"), sopp.val());
			customer = $("#customer");
			customer = dataListFormat(customer.attr("id"), customer.val());
			title = $("#title").val();
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
				"type": job,
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

	scheduleRange = $("#scheduleRange").val();
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

function calendarMore(e){
	if(!$(e).data("flag")){
		$(e).text("← close");
		$(e).data("flag", true);
	}else{
		$(e).text("more →");
		$(e).data("flag", false);
	}

	$(e).parents(".calendar_cell").children(".calendar_item").not(".calendar_item_empty").each((index, item) => {
		console.log($(item).css("display"));
		if($(item).css("display") === "none"){
			$(item).css("display", "flex");
		}else if($(item).css("display") === "flex"){
			$(item).css("display", "none");
		}
	});
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.scheduleList, searchAllInput, "input");
	drawScheduleList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.scheduleList.length; i++){
		let no, writer, customer, job, type, from, to, disDate;
		no = storage.scheduleList[i].no;
		writer = (storage.scheduleList[i].writer === null || storage.scheduleList[i].writer == 0) ? "" : storage.user[storage.scheduleList[i].writer].userName;
		customer = (storage.scheduleList[i].customer === null || storage.scheduleList[i].customer == 0) ? "" : storage.customer[storage.scheduleList[i].customer].name;
		title = storage.scheduleList[i].title;
		job = storage.scheduleList[i].job;
		
		if(job === "sales"){
			job = "영업일정";
		}else if(job === "tech"){
			job = "기술지원";
		}else{
			job = "기타일정";
		}

		type = storage.code.etc[storage.scheduleList[i].type];
		disDate = dateDis(storage.scheduleList[i].from);
		from = parseInt(dateFnc(disDate).replaceAll("-", ""));
		disDate = dateDis(storage.scheduleList[i].to);
		to = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + writer + "#" + customer + "#" + title + "#" + job + "#" + type + "#from" + from + "#to" + to);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchWriter, searchCustomer, searchJob, searchType, searchDateFrom, searchDateTo, searchCreatedFrom;

	searchWriter = $("#searchWriter").val();
	searchCustomer = $("#searchCustomer").val();
	searchJob = $("#searchJob").val();
	searchType = $("#searchType").val();
	searchDateFrom = ($("#searchDateFrom").val() === "") ? "" : $("#searchDateFrom").val().replaceAll("-", "") + "#from" + $("#searchDateTo").val().replaceAll("-", "");
	
	let searchValues = [searchWriter, searchCustomer, searchJob, searchType, searchDateFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== ""){
			let tempArray = searchDataFilter(storage.scheduleList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.scheduleList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawScheduleList();
}