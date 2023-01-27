document.addEventListener("DOMContentLoaded", () => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSchedule2List();
});

//새로운 스케쥴 리스트 통신 함수
function getSchedule2List(){
	let date = new Date().getTime();
	let scheduleRange = document.getElementsByClassName("scheduleRange")[0].value;
	axios.get("/api/schedule2/" + scheduleRange + "/" + date).then((response) => {
		let result = response.data.data;
		result = cipher.decAes(result);
		result = JSON.parse(result);
		storage.scheduleList = result;
		
		if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
			window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
		}else{
			window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
		}
	});
}

// // function getScheduleList() {
// // 	let url, method, data, type, scheduleRange;
// // 	scheduleRange = document.getElementsByClassName("scheduleRange")[0].value;
// // 	url = "/api/schedule/calendar/" + scheduleRange;
// // 	method = "get";
// // 	data = "";
// // 	type = "list";

// // 	crud.defaultAjax(url, method, data, type, scheduleSuccessList, scheduleErrorList);
// // } // End of getScheduleList()

// function drawScheduleList() {
// 	let container, dataJob = [], result, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, hideArr, showArr;
	
// 	if (storage.scheduleList === undefined) {
// 		msg.set("등록된 일정이 없습니다");
// 	}
// 	else {
// 		if(storage.searchDatas === undefined){
// 			jsonData = storage.scheduleList.sort(function(a, b){return b.created - a.created;});
// 		}else{
// 			jsonData = storage.searchDatas.sort(function(a, b){return b.created - a.created;});
// 		}
// 	}

// 	hideArr = ["calendarList", "detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "searchContainer", "listSearchInput", "crudAddBtn"];
// 	showArr = [
// 		{element: "gridList", display: "grid"},
// 		{element: "pageContainer", display: "flex"},
// 		{element: "listRange", display: "block"},
// 		{element: "scheduleRange", display: "block"},
// 		{element: "listChangeBtn", display: "block"},
// 	];
	
// 	result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
// 	containerTitle = document.getElementById("containerTitle");
// 	pageContainer = document.getElementsByClassName("pageContainer");
// 	container = document.getElementsByClassName("gridList")[0];

// 	header = [
// 		{
// 			"title" : "등록일",
// 			"align" : "center",
// 		},
// 		{
// 			"title" : "일정",
// 			"align" : "center",
// 		},
// 		{
// 			"title" : "일정제목",
// 			"align" : "center",
// 		},
// 		{
// 			"title" : "일정설명",
// 			"align" : "center",
// 		},
// 		{
// 			"title" : "담당자",
// 			"align" : "center",
// 		},
// 	];

// 	if(jsonData === ""){
// 		str = [
// 			{
// 				"setData": undefined,
// 				"col": 5,
// 			},
// 		];
		
// 		data.push(str);
// 	}else{
// 		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
// 			// let job, title, customer, writer, fromDate, fromSetDate, toDate, toSetDate, place, content, type, disDate;
			
// 			// job = (jsonData[i].job === null || jsonData[i].job === "" || jsonData[i].job === undefined) ? "" : jsonData[i].job;
			
// 			// if(job === "sales"){
// 			// 	job = "영업일정";
// 			// }else if(job === "tech"){
// 			// 	job = "기술지원";
// 			// }else{
// 			// 	job = "기타일정";
// 			// }
	
// 			// title = (jsonData[i].title === null || jsonData[i].title === "" || jsonData[i].title === undefined) ? "" : jsonData[i].title;
// 			// customer = (jsonData[i].customer == 0 || jsonData[i].customer === null || jsonData[i].customer === undefined) ? "" : storage.customer[jsonData[i].customer].name;
// 			// writer = (jsonData[i].writer == 0 || jsonData[i].writer === null || jsonData[i].writer === undefined) ? "" : storage.user[jsonData[i].writer].userName;
// 			// place = (jsonData[i].place === null || jsonData[i].place === "" || jsonData[i].place === undefined) ? "" : jsonData[i].place;
// 			// content = (jsonData[i].content === null || jsonData[i].content === "" || jsonData[i].content === undefined) ? "" : jsonData[i].content;
// 			// content = content.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br />", "");
// 			// type = (jsonData[i].type === null || jsonData[i].type === "" || jsonData[i].type === undefined) ? "" : storage.code.etc[jsonData[i].type];
			
// 			fromDate = CommonDatas.dateDis(jsonData[i].from);
// 			fromSetDate = CommonDatas.dateFnc(fromDate, "mm-dd");
			
// 			toDate = CommonDatas.dateDis(jsonData[i].to);
// 			toSetDate = CommonDatas.dateFnc(toDate, "mm-dd");

// 			disDate = CommonDatas.dateDis(jsonData[i].created, jsonData[i].modified);
// 			disDate = CommonDatas.dateFnc(disDate, "mm-dd");
	
// 			str = [
// 				{
// 					"setData": disDate,
// 					"align": "center",
// 				},
// 				{
// 					"setData": fromSetDate + " ~ " + toSetDate,
// 					"align": "center",
// 				},
// 				{
// 					"setData": jsonData[i].title,
// 					"align": "left",
// 				},
// 				{
// 					"setData": jsonData[i].content,
// 					"align": "left",
// 				},
// 				{
// 					"setData": storage.user[jsonData[i].writer].userName,
// 					"align": "center",
// 				},
// 			];
	
// 			fnc = "scheduleDetailView(this);";
// 			ids.push(jsonData[i].no);
// 			dataJob.push(jsonData[i].job);
// 			data.push(str);
// 		}
// 		let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "drawScheduleList", result[0]);
// 		pageContainer[0].innerHTML = pageNation;
// 	}

// 	containerTitle.innerHTML = "일정조회";
// 	CommonDatas.createGrid(container, header, data, ids, dataJob, fnc);
// 	CommonDatas.setViewContents(hideArr, showArr);
// }// End of drawNoticeList()

// // function drawCalendar(container){
// // 	if(storage.currentYear === undefined)   storage.currentYear = (new Date()).getFullYear();
// //     if(storage.currentMonth === undefined)  storage.currentMonth = (new Date()).getMonth() + 1;
// //     const Monthly = new MonthlyCalendar(storage.currentYear, storage.currentMonth, container);
// // 	Monthly.drawForSopp();
// // 	for(let i = 0; i < storage.scheduleList.length; i++){
// // 		let item = storage.scheduleList[i];
// // 		Monthly.addSchedule(item);
// // 	}
// // 	Monthly.drawScheduleInSopp();
// // } // End of drawCalendar()

// // 일정 캘린더를 만드는 함수
// function drawCalendar(container){
//     let calArr, slot, html, startDate, endDate, tempDate, tempArr, current, x1, x2, x3, t, now, pageContainer, hideArr, showArr;
//     calArr = [];
//     tempDate = [];
//     if(storage.currentYear === undefined)   storage.currentYear = (new Date()).getFullYear();
//     if(storage.currentMonth === undefined)  storage.currentMonth = (new Date()).getMonth() + 1;

// 	hideArr = ["gridList", "pageContainer", "listRange", "listSearchInput", "searchContainer", "detailBackBtn", "crudAddBtn"];
// 	showArr = [
// 		{element: "calendarList", display: "block"},
// 		{element: "scheduleRange", display: "flex"},
// 		{element: "listChangeBtn", display: "flex"},
// 	];

// 	document.getElementsByClassName("calendarYear")[0].innerText = storage.currentYear;
// 	document.getElementsByClassName("calendarMonth")[0].innerText = storage.currentMonth;
// 	pageContainer = document.getElementsByClassName("pageContainer");

//     startDate = new Date(storage.currentYear, storage.currentMonth - 1 , 1);
//     endDate = new Date(new Date(storage.currentYear, storage.currentMonth, 1).getTime() - 86400000);

//     // 시작하는 날짜 잡기
//     startDate = new Date(startDate.getTime() - startDate.getDay() * 86400000);

//     // 말일 찾기
//     endDate = new Date(endDate.getTime() + (6 - endDate.getDay()) * 86400000);    

//     // 만들어진 달력 날짜에 해당하는 일정이 있는 경우 담아두기
//     for(x1 = 0 ; x1 <= (endDate.getTime() - startDate.getTime()) / 86400000 ; x1++){
//         current = (startDate.getTime() + (86400000 * x1));
//         calArr[x1] = {};
//         calArr[x1].date = new Date(current);
//         calArr[x1].schedule = [];
//         for(x2 = 0 ; x2 < storage.scheduleList.length ; x2++){
//             if(current + 86400000 > storage.scheduleList[x2].from && current <= storage.scheduleList[x2].to)    calArr[x1].schedule.push(x2);
//         }
//     }
    
//     // 최대 일정 수량 잡기
//     slot = 0;
//     for(x1 = 0 ; x1 < calArr.length ; x1++){
//         if(calArr[x1].schedule.length > slot)   slot = calArr[x1].schedule.length;
//     }

//     // slot 최소값 설정하고 날짜에 slot 미리 설정학
//     slot = slot < 5 ? 5 : slot;
//     for(x1 = 0 ; x1 < calArr.length ; x1++) calArr[x1].slot = new Array(slot);

//     // 슬롯에 일정 추가하기
//     for(x1 = 0 ; x1 < calArr.length ; x1++){
//         for(x2 = 0 ; x2 < calArr[x1].schedule.length ; x2++){
//             for(x3 = 0 ; x3 < slot ; x3++){
//                 if(calArr[x1].slot[x3] === undefined){
//                     calArr[x1].slot[x3] = calArr[x1].schedule[x2];
//                     break;
//                 }
//             }
//         }
//     }

//     // 연속된 일정에 대한 슬롯 번호 맞추기
//     for(x1 = 1 ; x1 < calArr.length ; x1++){
//         tempArr = calArr[x1].slot; // 임시 변수에 당일 슬롯 데이터를 옮기고 당일 슬롯을 초기화 함
//         calArr[x1].slot = new Array(slot);
//         for(x2 = 0 ; x2 < tempArr.length ; x2++){ // 당일 데이터를 순회하며 전일 데이터와 맞추고 임시변수에서 지움
//             if(tempArr[x2] === undefined)   break;
//             t = calArr[x1 - 1].slot.indexOf(tempArr[x2]);
//             if(t > 0){
//                 calArr[x1].slot[t] = tempArr[x2];
//                 tempArr[x2] = undefined;
//             }
//         }
//         for(x2 = 0 ; x2 < tempArr.length ; x2++){ // 전일 데이터와 맞추지않은 데이터들에 대해 비어있는 상위 슬롯으로 데이터를 넣어줌
//             if(tempArr[x2] === undefined)   continue;
//             for(x3 = 0 ; x3 < calArr[x1].slot.length ; x3++){
//                 if(calArr[x1].slot[x3] === undefined){
//                     calArr[x1].slot[x3] = tempArr[x2];
//                     break;
//                 }
//             }
//         }
//     }
    
//     html = "<div class=\"calendar_header\">일</div>";
// 	html += "<div class=\"calendar_header\">월</div>";
// 	html += "<div class=\"calendar_header\">화</div>";
// 	html += "<div class=\"calendar_header\">수</div>";
// 	html += "<div class=\"calendar_header\">목</div>";
// 	html += "<div class=\"calendar_header\">금</div>";
// 	html += "<div class=\"calendar_header\">토</div>";
	
//     for(x1 = 0 ; x1 < calArr.length ; x1++){
// 		tempDate = calArr[x1].date; // 해당 셀의 날짜 객체를 가져 옮
//         t = tempDate.getFullYear();
//         t += (tempDate.getMonth() < 9 ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1);
//         t += (tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate()); // 셀에 저장해 둘 날짜 문자열 생성
// 		let year, month, day;
// 		year = tempDate.getFullYear();
// 		month = tempDate.getMonth()+1;
// 		day = tempDate.getDate();

// 		if(month < 10){
// 			month = "0" + month;
// 		}

// 		if(day < 10){
// 			day = "0" + day;
// 		}

// 		now = year + "-" + month + "-" + day;
//         html += "<div class=\"calendar_cell" + (storage.currentMonth === tempDate.getMonth() + 1 ? "" : " calendar_cell_blur") + "\" data-date=\"" + now + "\">"; // start row / 해당월이 아닌 날짜의 경우 calendar_cell_blue 클래스명을 셀에 추가 지정함
//         html += "<div class=\"calendar_date\">" + (calArr[x1].date.getDate()) + "</div>"; // 셀 안 최상단에 날짜 아이템을 추가함
//         for(x2 = 0 ; x2 < slot ; x2++){
// 			x3 = [];
// 			if(x1 > 0){ // 전일 데이터와 비교, 일정의 연속성에대해 확인함
// 				x3[0] = calArr[x1 - 1].slot[x2] === calArr[x1].slot[x2];
// 			}
// 			if(x1 < calArr.length - 1){ // 익일 데이터와 비교, 일정의 연속성에대해 확인함
// 				x3[1] = calArr[x1 + 1].slot[x2] === calArr[x1].slot[x2];
// 			}
//             t = calArr[x1].slot[x2] === undefined ? undefined : storage.scheduleList[calArr[x1].slot[x2]] ; //임시변수에 스케줄 아이템을 담아둠
			
// 			if(x2 > 2){
// 				html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " data-id=" + (t === undefined ? '' : t.no) + " data-job=" + (t === undefined ? '' : t.job) + " onclick='" + (t === undefined ? '' : 'eventStop();calendarDetailView(this);') + "' data-sort=" + (t === undefined ? 0 : 1) + " style='display:none;'>" + (t === undefined ? "" : storage.user[t.writer].userName + " : " + t.title) + "</div>";
// 			}else{
// 				html += "<div class=\"calendar_item" + (t === undefined ? " calendar_item_empty" : "") + (x3[0] ? " calendar_item_left" : "") + (x3[1] ? " calendar_item_right" : "") + "\"" + (t === undefined ? "" : "") + " data-id=" + (t === undefined ? '' : t.no) + " data-job=" + (t === undefined ? '' : t.job) + " onclick='" + (t === undefined ? '' : 'eventStop();calendarDetailView(this);') + "' data-sort=" + (t === undefined ? 0 : 1) + "style='display:block;z-index:99;'>" + (t === undefined ? "" : storage.user[t.writer].userName + " : " + t.title) + "</div>";
// 			}
//         }

//         html += "</div>";
//     }
//     container.innerHTML = html;

// 	setTimeout(() => {
// 		let calendar_cell = document.getElementsByClassName("calendar_cell");

// 		for(let i = 0; i < calendar_cell.length; i++){
// 			if($(calendar_cell[i]).children().not(".calendar_item_empty").length > 4){
// 				$(calendar_cell[i]).append("<div class=\"calendar_span_empty\"><span data-flag=\"false\" onclick=\"eventStop();calendarMore(this);\">more(" + parseInt($(calendar_cell[i]).children().not(".calendar_item_empty").length-1) + ") →</span></div>");
// 			}
// 		}
// 	}, 100);
	
// 	CommonDatas.setViewContents(hideArr, showArr);

// 	let path = location.pathname.split("/");

// 	if(path[3] !== undefined){
// 		drawScheduleList();
// 		document.getElementsByClassName("calendarList")[0].style.display = "none";
// 		let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
// 		console.log(content);
// 		scheduleDetailView(content);
// 	}

//     return true;
// } // End of drawCalendar()

// function scheduleDetailView(e){
// 	let thisEle = e;
// 	let no = thisEle.dataset.id;

// 	for(let i = 0; i < storage.scheduleList.length; i++){
// 		let item = storage.scheduleList[i];

// 		if(item.no == no){
// 			storage.detailData = item;
// 		}
// 	}

// 	const ScheduleClass = new Schedule(storage.detailData);
// 	ScheduleClass.scheduleDetailDataSet();
// 	// let id, job, url, method, data, type;

// 	// id = $(e).data("id");
// 	// job = $(e).data("job");
// 	// url = "/api/schedule/" + job + "/" + id;
// 	// method = "get";
// 	// type = "detail";

// 	// crud.defaultAjax(url, method, data, type, scheduleSuccessView, scheduleErrorView);
// }

// // function scheduleSuccessView(result){
// // 	let html, dataArray, notIdArray, gridList, containerTitle, datas, crudUpdateBtn, crudDeleteBtn, detailBackBtn, hideArr, showArr;
// // 	notIdArray = ["writer"];
// // 	gridList = $(".gridList");
// // 	containerTitle = $("#containerTitle");
// // 	crudUpdateBtn = $(".crudUpdateBtn");
// // 	crudDeleteBtn = $(".crudDeleteBtn");
// // 	detailBackBtn = $(".detailBackBtn");
// // 	dataArray = scheduleRadioUpdate(result.job, result);
// // 	html = detailViewForm(dataArray);
// // 	containerTitle.html(result.title);
// // 	gridList.after(html);
// // 	hideArr = ["gridList", "calendarList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
// // 	showArr = ["defaultFormContainer"];
// // 	setViewContents(hideArr, showArr);

// // 	if(storage.my == result.writer){
// // 		crudUpdateBtn.attr("onclick", "enableDisabled(this, \"scheduleUpdate();\", \"" + notIdArray + "\");");
// // 		crudUpdateBtn.css("display", "flex");
// // 		crudDeleteBtn.css("display", "flex");
// // 	}else{
// // 		crudUpdateBtn.css("display", "none");
// // 		crudDeleteBtn.css("display", "none");
// // 	}
	
// // 	detailBackBtn.css("display", "flex");

// // 	setTimeout(() => {
// // 		$("[name='job'][value='" + result.job + "']").attr("checked", true).removeAttr("onclick");
// // 		if(result.job === "sales"){
// // 			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
// // 			datas = ["sopp", "writer", "customer", "partner"];

// // 			$("#type option[value='" + type + "']").attr("selected", true);
// // 		}else if(result.job === "tech"){
// // 			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
// // 			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
// // 			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
// // 			datas = ["sopp", "writer", "customer", "partner", "cipOfCustomer", "contract"];

// // 			$("[name='contractMethod'][value='" + contractMethod + "']").attr("checked", true);
// // 			$("#type option[value='" + type + "']").attr("selected", true);
// // 			$("#supportStep option[value='" + supportStep + "']").attr("selected", true);
// // 		}else{
// // 			datas = ["sopp", "writer", "customer"];
// // 		}

// // 		let jobArray = $("input[name=\"job\"]");

// // 		for(let i = 0; i < jobArray.length; i++){
// // 			if(!$(jobArray[i]).is(":checked")){
// // 				$(jobArray[i]).hide();
// // 				$(jobArray[i]).next().hide();
// // 			}
// // 		}

// // 		detailTrueDatas(datas);
// // 		ckeditor.config.readOnly = true;
// // 		window.setTimeout(setEditor, 100);
// // 	}, 100);
// // }

// // function scheduleErrorView(){
// // 	msg.set("에러");
// // }

// function calendarDetailView(e){
// 	let thisEle = e;
// 	let no = thisEle.dataset.id;

// 	for(let i = 0; i < storage.scheduleList.length; i++){
// 		let item = storage.scheduleList[i];
		
// 		if(item.no == no){
// 			storage.detailData = item;
// 		}
// 	}

// 	const ScheduleClass = new Schedule(storage.detailData);
// 	ScheduleClass.calendarDetailDataSet();

// 	// let id, job, url, method, data, type;

// 	// id = $(e).data("id");
// 	// job = $(e).data("job");
// 	// url = "/api/schedule/" + job + "/" + id;
// 	// method = "get";
// 	// type = "detail";

// 	// crud.defaultAjax(url, method, data, type, calendarSuccessView, calendarErrorView);
// }

// // function calendarSuccessView(result){
// // 	let html, title, dataArray, notIdArray, datas, defaultFormLine;

// // 	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
// // 	dataArray = scheduleRadioUpdate(result.job, result);
// // 	html = detailViewForm(dataArray, "modal");
	
	
// // 	modal.show();
// // 	modal.content.css("min-width", "70%");
// // 	modal.content.css("max-width", "70%");
// // 	modal.headTitle.text(title);
// // 	modal.body.html(html);
// // 	notIdArray = ["writer"];

// // 	// if(storage.my == result.writer){
// // 	// 	modal.confirm.text("수정");
// // 	// 	modal.confirm.attr("onclick", "enableDisabled(this, \"scheduleUpdate();\", \"" + notIdArray + "\");");
// // 	// 	defaultFormLine = $(".defaultFormLine");
// // 	// 	defaultFormLine.eq(0).append("<button type=\"button\" class=\"modalDeleteBtn\" onclick=\"scheduleDelete();\">삭제</button>");
// // 	// }else{
// // 	// 	modal.confirm.hide();
// // 	// }
// // 	modal.confirm.hide();
// // 	modal.close.text("취소");
// // 	modal.close.attr("onclick", "modal.hide();");

// // 	setTimeout(() => {
// // 		$("[name='job'][value='" + result.job + "']").attr("checked", true).removeAttr("onclick");
// // 		if(result.job === "sales"){
// // 			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
// // 			datas = ["sopp", "writer", "customer", "partner"];
// // 			$("#type option[value='" + type + "']").attr("selected", true);
// // 		}else if(result.job === "tech"){
// // 			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
// // 			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
// // 			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
// // 			datas = ["sopp", "writer", "customer", "partner", "cipOfCustomer", "contract"];

// // 			$("[name='contractMethod'][value='" + contractMethod + "']").attr("checked", true);
// // 			$("#type option[value='" + type + "']").attr("selected", true);
// // 			$("#supportStep option[value='" + supportStep + "']").attr("selected", true);
// // 		}else{
// // 			datas = ["sopp", "writer", "customer"];
// // 		}

// // 		let jobArray = $("input[name=\"job\"]");

// // 		for(let i = 0; i < jobArray.length; i++){
// // 			if(!$(jobArray[i]).is(":checked")){
// // 				$(jobArray[i]).hide();
// // 				$(jobArray[i]).next().hide();
// // 			}
// // 		}

// // 		detailTrueDatas(datas);
// // 		ckeditor.config.readOnly = true;
// // 		window.setTimeout(setEditor, 100);
// // 	}, 100);

// // 	setTimeout(() => {
// // 		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
// // 	}, 300);
// // }

// // function calendarErrorView(){
// // 	msg.set("에러");
// // }

// function eventStop(){
// 	if(event.stopattragation){
// 		event.stopattragation();
// 	}
// 	event.cancelBubble = true;
// }

// function calendarNext(){
// 	let getYear, getMonth, setYear, setMonth;

// 	getYear = document.getElementsByClassName("calendarYear")[0];
// 	getMonth = document.getElementsByClassName("calendarMonth")[0];
// 	setYear = parseInt(getYear.innerHTML);
// 	setMonth = parseInt(getMonth.innerHTML);
	
// 	if(setMonth == 12){
// 		setYear = setYear + 1;
// 		setMonth = 0;
// 	}
	
// 	setMonth = setMonth + 1;

// 	getYear.innerHTML = setYear;
// 	getMonth.innerHTML = setMonth;

// 	if(setMonth < 10){
// 		setMonth = "0" + setMonth;
// 	}

// 	storage.currentlongDate = new Date(setYear + "-" + setMonth + "-01").getTime();
// 	storage.currentYear = setYear;
// 	storage.currentMonth = setMonth;

// 	scheduleCalendarAjax();
// }

// function calendarPrev(){
// 	let getYear, getMonth, setYear, setMonth;

// 	getYear = document.getElementsByClassName("calendarYear")[0];
// 	getMonth = document.getElementsByClassName("calendarMonth")[0];
// 	setYear = parseInt(getYear.innerHTML);
// 	setMonth = parseInt(getMonth.innerHTML);
// 	type = "prev";

// 	if(setMonth == 1){
// 		setYear = setYear - 1;
// 		setMonth = 13;
// 	}

// 	setMonth = setMonth - 1;
	
// 	getYear.innerHTML = setYear;
// 	getMonth.innerHTML = setMonth;

// 	if(setMonth < 10){
// 		setMonth = "0" + setMonth;
// 	}

// 	storage.currentlongDate = new Date(setYear + "-" + setMonth + "-01").getTime();
// 	storage.currentYear = setYear;
// 	storage.currentMonth = setMonth;

// 	scheduleCalendarAjax();
// }

// function scheduleCalendarAjax(){
// 	let scheduleRange, url;
// 	scheduleRange = document.getElementsByClassName("scheduleRange")[0].value;

// 	if(scheduleRange === "dept"){
// 		url = "/api/schedule2/" + scheduleRange + "/" + storage.user[storage.my].deptId[0] + "/" + storage.currentlongDate;
// 	} else if(scheduleRange === "employee"){
// 		url = "/api/schedule2/" + scheduleRange + "/" + storage.my + "/" + storage.currentlongDate;
// 	} else {
// 		url = "/api/schedule2/" + scheduleRange + "/" + storage.currentlongDate;
// 	}

// 	axios.get(url).then((response) => {
// 		let jsonData;
// 		jsonData = cipher.decAes(response.data.data);
// 		jsonData = JSON.parse(jsonData);
		
// 		if(jsonData.length > 0){
// 			storage.scheduleList = jsonData;
// 			window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
// 		}else{
// 			msg.set("데이터가 없습니다.");
// 		}
// 	});
// }

// function listChange(event){
// 	if(event.dataset.type === "table"){
// 		event.dataset.type = "calendar";
// 		event.innerHTML = "<i class=\"fa-solid fa-list-ol fa-xl\"></i>";
// 		drawCalendar(document.getElementsByClassName("calendar_container")[0]);
// 	}else{
// 		event.dataset.type = "table";
// 		event.innerHTML = "<i class=\"fa-regular fa-calendar-check fa-xl\"></i>";
// 		drawScheduleList();
// 	}
// }

// function scheduleSuccessList(result){
// 	storage.scheduleList = result;

// 	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
// 		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
// 	}else{
// 		window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
// 	}
// }

// function scheduleErrorList(){
// 	msg.set("에러");
// }

// function scheduleInsertForm(getDate){
// 	let html, dataArray;
// 	dataArray = scheduleRadioInsert("sales", getDate);
// 	html = detailViewForm(dataArray, "modal");

// 	modal.show();
// 	modal.content.css("min-width", "70%");
// 	modal.content.css("max-width", "70%");
// 	modal.headTitle.text("일정등록");
// 	modal.body.html(html);
// 	modal.confirm.text("등록");
// 	modal.close.text("취소");
// 	modal.confirm.attr("onclick", "scheduleInsert();");
// 	modal.close.attr("onclick", "modal.hide();");

// 	setTimeout(() => {
// 		$("[name='job'][value='sales']").attr("checked", true);
// 		$("#writer").attr("data-change", true);

// 		if(getDate === undefined){
// 			let nowDate = new Date().toISOString().substring(0, 10);
// 			$("#from").val(nowDate + "T09:00");
// 			$("#to").val(nowDate + "T18:00");
// 		}else{
// 			$("#from").val(getDate + "T09:00");
// 			$("#to").val(getDate + "T18:00");
// 		}
// 		ckeditor.config.readOnly = false;
// 		window.setTimeout(setEditor, 100);
// 	}, 100);

// 	setTimeout(() => {
// 		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
// 	}, 300);
// }

// function scheduleRadioClick(e){
// 	let html, dataArray, tempFrom, tempTo, value = $(e).val();
	
// 	tempFrom = $("#from").val();
// 	tempTo = $("#to").val();

// 	dataArray = scheduleRadioInsert(value);
// 	html = detailViewForm(dataArray, "modal");
	
// 	modal.show();
// 	modal.headTitle.text("일정등록");
// 	modal.body.html(html);
// 	modal.confirm.text("등록");
// 	modal.close.text("취소");
// 	modal.confirm.attr("onclick", "scheduleInsert();");
// 	modal.close.attr("onclick", "modal.hide();");

// 	setTimeout(() => {
// 		$("[name='job'][value='" + value + "']").attr("checked", true);
// 		$("#from").val(tempFrom);
// 		$("#to").val(tempTo);
// 		$("#writer").attr("data-change", true);
// 		ckeditor.config.readOnly = false;
// 		window.setTimeout(setEditor, 100);
// 	}, 100);

// 	setTimeout(() => {
// 		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
// 	}, 300);
// }

// function scheduleRadioInsert(value, date){
// 	let dataArray, myName, my, now;

// 	my = storage.my;
// 	myName = storage.user[my].userName;

// 	if(date === undefined){
// 		now = new Date();
// 		date = now.toISOString().slice(0, 10);
// 	}

// 	if(value === "sales"){
// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"type": "radio",
// 				"elementName": "job",
// 				"disabled": false,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "활동시작일(*)",
// 				"elementId": "from",
// 				"value": date,
// 				"type": "datetime",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "활동종료일(*)",
// 				"elementId": "to",
// 				"value": date,
// 				"type": "datetime",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "활동형태(*)",
// 				"selectValue": [
// 					{
// 						"key": "10170",
// 						"value": "회사방문",
// 					},
// 					{
// 						"key": "10171",
// 						"value": "기술지원",
// 					},
// 					{
// 						"key": "10221",
// 						"value": "제품설명",
// 					},
// 					{
// 						"key": "10222",
// 						"value": "시스템데모",
// 					},
// 					{
// 						"key": "10223",
// 						"value": "제품견적",
// 					},
// 					{
// 						"key": "10224",
// 						"value": "계약건 의사결정지원",
// 					},
// 					{
// 						"key": "10225",
// 						"value": "계약",
// 					},
// 					{
// 						"key": "10226",
// 						"value": "사후처리",
// 					},
// 					{
// 						"key": "10227",
// 						"value": "기타",
// 					},
// 					{
// 						"key": "10228",
// 						"value": "협력사요청",
// 					},
// 					{
// 						"key": "10229",
// 						"value": "협력사문의",
// 					},
// 					{
// 						"key": "10230",
// 						"value": "교육",
// 					},
// 					{
// 						"key": "10231",
// 						"value": "전화상담",
// 					},
// 					{
// 						"key": "10232",
// 						"value": "제조사업무협의",
// 					},
// 					{
// 						"key": "10233",
// 						"value": "외부출장",
// 					},
// 					{
// 						"key": "10234",
// 						"value": "제안설명회",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "type",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"elementId": "writer",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": myName,
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "매출처",
// 				"disabled": false,
// 				"elementId": "customer",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 			},
// 			{
// 				"title": "엔드유저",
// 				"disabled": false,
// 				"elementId": "partner",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 			},
// 			{
// 				"title": "제목(*)",
// 				"elementId": "title",
// 				"disabled": false,
// 				"col": 4,
// 			},
// 			{
// 				"title": "내용",
// 				"elementId": "content",
// 				"type": "textarea",
// 				"disabled": false,
// 				"col": 4,
// 			}
// 		];

// 		storage.formList = {
// 			"job" : "",
// 			"from" : "",
// 			"to" : "",
// 			"place" : "",
// 			"type" : "",
// 			"writer" : storage.my,
// 			"sopp" : 0,
// 			"customer" : 0,
// 			"partner" : 0,
// 			"title" : "",
// 			"content" : "",
// 			"report" : 1,
// 		};
// 	}else if(value === "tech"){
// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "job",
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"disabled": false,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "등록구분(*)",
// 				"radioValue": [
// 					{
// 						"key": "10247",
// 						"value": "신규영업지원",
// 					},
// 					{
// 						"key": "10248",
// 						"value": "유지보수",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "contractMethod",
// 				"elementId": ["contractMethodNew", "contractMethodOld"],
// 				"col": 4,
// 				"disabled": false,
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "계약",
// 				"elementId": "contract",
// 				"complete": "contract",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "매출처",
// 				"disabled": false,
// 				"elementId": "partner",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 			},
// 			{
// 				"title": "매출처 담당자",
// 				"complete": "cip",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"elementId": "cipOfCustomer",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "엔드유저(*)",
// 				"elementId": "customer",
// 				"disabled": false,
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 			},
// 			{
// 				"title": "모델",
// 				"elementId": "supportModel",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "버전",
// 				"elementId": "supportVersion",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "단계",
// 				"selectValue": [
// 					{
// 						"key": "10213",
// 						"value": "접수단계",
// 					},
// 					{
// 						"key": "10214",
// 						"value": "출동단계",
// 					},
// 					{
// 						"key": "10215",
// 						"value": "미계약에 따른 보류",
// 					},
// 					{
// 						"key": "10253",
// 						"value": "처리완료",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "supportStep",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "지원형태",
// 				"selectValue": [
// 					{
// 						"key": "10187",
// 						"value": "전화상담",
// 					},
// 					{
// 						"key": "10208",
// 						"value": "현장방문",
// 					},
// 					{
// 						"key": "10209",
// 						"value": "원격지원",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "type",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"elementId": "writer",
// 				"value": myName,
// 			},
// 			{
// 				"title": "지원 시작일(*)",
// 				"elementId": "from",
// 				"value": date,
// 				"disabled": false,
// 				"type": "datetime",
// 			},
// 			{
// 				"title": "지원 종료일(*)",
// 				"elementId": "to",
// 				"value": date,
// 				"disabled": false,
// 				"type": "datetime",
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "기술지원명(*)",
// 				"elementId": "title",
// 				"disabled": false,
// 				"col": 3,
// 			},
// 			{
// 				"title": "내용",
// 				"type": "textarea",
// 				"elementId": "content",
// 				"disabled": false,
// 				"col": 4,
// 			},
// 		];

// 		storage.formList = {
// 			"job" : "",
// 			"contractMethod" : "",
// 			"sopp" : 0,
// 			"contract" : 0,
// 			"partner" : 0,
// 			"cipOfCustomer" : 0,
// 			"customer" : 0,
// 			"supportModel" : "",
// 			"supportVersion" : "",
// 			"supportStep" : "",
// 			"type" : "",
// 			"place" : "",
// 			"writer" : storage.my,
// 			"from" : "",
// 			"to" : "",
// 			"title" : "",
// 			"content" : "",
// 			"report" : 1,
// 		};
// 	}else{
// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "job",
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"disabled": false,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "일정시작일(*)",
// 				"type": "datetime",
// 				"value": date,
// 				"elementId": "from",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "일정종료일(*)",
// 				"type": "datetime",
// 				"value": date,
// 				"elementId": "to",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"disabled": false,
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"elementId": "writer",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": myName,
// 			},
// 			{
// 				"title": "매출처",
// 				"disabled": false,
// 				"elementId": "customer",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 			},
// 			{
// 				"title": "제목(*)",
// 				"elementId": "title",
// 				"disabled": false,
// 				"col": 2,
// 			},
// 			{
// 				"title": "내용",
// 				"elementId": "content",
// 				"type": "textarea",
// 				"disabled": false,
// 				"col": 4,
// 			},
// 		];

// 		storage.formList = {
// 			"job" : "",
// 			"from" : "",
// 			"to" : "",
// 			"place" : "",
// 			"sopp" : 0,
// 			"writer" : storage.my,
// 			"customer" : 0,
// 			"title" : "",
// 			"content" : "",
// 			"report" : 1,
// 		};
// 	}

// 	return dataArray;
// }

// function scheduleInsert(){
// 	let url, method, data, type, job;

// 	job = $("[name='job']:checked").val();

// 	url = "/api/schedule/" + job;
// 	method = "post";
// 	type = "insert";

// 	if(job === "sales"){
// 		if($("#from").val() === ""){
// 			msg.set("활동시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("활동종료일을 선택해주세요.");
// 			return false;
// 		}else if($("#title").val() === ""){
// 			msg.set("제목을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
// 			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
// 			$("#partner").focus();
// 			return false;
// 		}
// 	}else if(job === "tech"){
// 		if($("#title").val() === ""){
// 			msg.set("기술요청명을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
// 			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
// 			$("#contract").focus();
// 			return false;
// 		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#partner").focus();
// 			return false;
// 		}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
// 			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
// 			$("#cipOfCustomer").focus();
// 			return false;
// 		}else if($("#customer").val() === ""){
// 			msg.set("엔드유저를 선택해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if($("#from").val() === ""){
// 			msg.set("지원시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("지원종료일을 선택해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}
// 	}else{
// 		if($("#from").val() === ""){
// 			msg.set("일정시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("일정종료일을 선택해주세요.");
// 			return false;
// 		}else if($("#title").val() === ""){
// 			msg.set("제목을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}
// 	}

// 	formDataSet();
// 	data = storage.formList;
// 	data = JSON.stringify(data);
// 	data = cipher.encAes(data);

// 	crud.defaultAjax(url, method, data, type, scheduleSuccessInsert, scheduleErrorInsert);
// }

// function scheduleSuccessInsert(){
// 	location.reload();
// 	msg.set("등록완료");
// }

// function scheduleErrorInsert(){
// 	msg.set("등록에러");

// }

// function scheduleRadioUpdate(value, result){
// 	let dataArray; 

// 	if(value === "sales"){
// 		detailSetFormList(result);
// 		let from, to, place, writer, sopp, customer, partner, title, content;
		
// 		disDate = dateDis(result.from);
// 		from = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		disDate = dateDis(result.to);
// 		to = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
// 		sopp = "";
// 		for(let key in storage.sopp){
// 			if(storage.sopp[key].no === result.sopp){
// 				sopp = storage.sopp[key].title;
// 			}
// 		}

// 		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "" : storage.user[result.writer].userName;
// 		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
// 		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
// 		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
// 		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		
// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "job",
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "활동시작일(*)",
// 				"elementId": "from",
// 				"type": "datetime",
// 				"value": from,
// 			},
// 			{
// 				"title": "활동종료일(*)",
// 				"elementId": "to",
// 				"type": "datetime",
// 				"value": to,
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"value": place,
// 			},
// 			{
// 				"title": "활동형태(*)",
// 				"selectValue": [
// 					{
// 						"key": "10170",
// 						"value": "회사방문",
// 					},
// 					{
// 						"key": "10171",
// 						"value": "기술지원",
// 					},
// 					{
// 						"key": "10221",
// 						"value": "제품설명",
// 					},
// 					{
// 						"key": "10222",
// 						"value": "시스템데모",
// 					},
// 					{
// 						"key": "10223",
// 						"value": "제품견적",
// 					},
// 					{
// 						"key": "10224",
// 						"value": "계약건 의사결정지원",
// 					},
// 					{
// 						"key": "10225",
// 						"value": "계약",
// 					},
// 					{
// 						"key": "10226",
// 						"value": "사후처리",
// 					},
// 					{
// 						"key": "10227",
// 						"value": "기타",
// 					},
// 					{
// 						"key": "10228",
// 						"value": "협력사요청",
// 					},
// 					{
// 						"key": "10229",
// 						"value": "협력사문의",
// 					},
// 					{
// 						"key": "10230",
// 						"value": "교육",
// 					},
// 					{
// 						"key": "10231",
// 						"value": "전화상담",
// 					},
// 					{
// 						"key": "10232",
// 						"value": "제조사업무협의",
// 					},
// 					{
// 						"key": "10233",
// 						"value": "외부출장",
// 					},
// 					{
// 						"key": "10234",
// 						"value": "제안설명회",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "type",
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"elementId": "writer",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": writer,				
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": sopp,
// 			},
// 			{
// 				"title": "매출처",
// 				"elementId": "customer",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": customer,
// 			},
// 			{
// 				"title": "엔드유저",
// 				"elementId": "partner",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": partner,
// 			},
// 			{
// 				"type": "",
// 			},
// 			{
// 				"title": "제목(*)",
// 				"elementId": "title",
// 				"value": title,
// 				"col": 4,
// 			},
// 			{
// 				"title": "내용",
// 				"elementId": "content",
// 				"type": "textarea",
// 				"value": content,
// 				"col": 4,
// 			}
// 		];
// 	}else if(value === "tech"){
// 		detailSetFormList(result);
// 		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion;
		
// 		disDate = dateDis(result.from);
// 		from = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		disDate = dateDis(result.to);
// 		to = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
// 		sopp = "";
// 		for(let key in storage.sopp){
// 			if(storage.sopp[key].no === result.sopp){
// 				sopp = storage.sopp[key].title;
// 			}
// 		}

// 		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
// 		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
// 		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
// 		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
// 		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
// 		supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
// 		supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;
// 		cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer === 0 || result.cipOfCustomer === undefined) ? "" : storage.cip[result.cipOfCustomer].name;
// 		contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : storage.code.etc[result.contractMethod];
// 		supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "" : storage.code.etc[result.supportStep];
// 		type = (result.type === "" || result.type === null || result.type === undefined) ? "" : storage.code.etc[result.type]; 

// 		contract = "";
// 		for(let key in storage.contract){
// 			if(storage.contract[key].no === result.contract){
// 				contract = storage.contract[key].title;
// 			}
// 		}


// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "job",
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "등록구분(*)",
// 				"radioValue": [
// 					{
// 						"key": "10247",
// 						"value": "신규영업지원",
// 					},
// 					{
// 						"key": "10248",
// 						"value": "유지보수",
// 					},
// 				],
// 				"type": "radio",
// 				"elementId": "contractMethod",
// 				"elementName": "contractMethod",
// 				"col": 4,
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": sopp,
// 			},
// 			{
// 				"title": "계약",
// 				"elementId": "contract",
// 				"complete": "contract",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": contract,
// 			},
// 			{
// 				"title": "매출처",
// 				"elementId": "partner",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": partner,
// 			},
// 			{
// 				"title": "매출처 담당자",
// 				"complete": "cip",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"elementId": "cipOfCustomer",
// 				"value": cipOfCustomer,
// 			},
// 			{
// 				"title": "엔드유저(*)",
// 				"elementId": "customer",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": customer,
// 			},
// 			{
// 				"title": "모델",
// 				"elementId": "supportModel",
// 				"value": supportModel,
// 			},
// 			{
// 				"title": "버전",
// 				"elementId": "supportVersion",
// 				"value": supportVersion,
// 			},
// 			{
// 				"title": "단계",
// 				"selectValue": [
// 					{
// 						"key": "10213",
// 						"value": "접수단계",
// 					},
// 					{
// 						"key": "10214",
// 						"value": "출동단계",
// 					},
// 					{
// 						"key": "10215",
// 						"value": "미계약에 따른 보류",
// 					},
// 					{
// 						"key": "10253",
// 						"value": "처리완료",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "supportStep",
// 			},
// 			{
// 				"title": "지원형태",
// 				"selectValue": [
// 					{
// 						"key": "10187",
// 						"value": "전화상담",
// 					},
// 					{
// 						"key": "10208",
// 						"value": "현장방문",
// 					},
// 					{
// 						"key": "10209",
// 						"value": "원격지원",
// 					}
// 				],
// 				"type": "select",
// 				"elementId": "type",
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"elementId": "writer",
// 				"value": writer,
// 			},
// 			{
// 				"title": "지원일자 시작일(*)",
// 				"elementId": "from",
// 				"type": "datetime",
// 				"value": from,
// 			},
// 			{
// 				"title": "지원일자 종료일(*)",
// 				"elementId": "to",
// 				"type": "datetime",
// 				"value": to,
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"value": place,
// 			},
// 			{
// 				"title": "기술지원명(*)",
// 				"elementId": "title",
// 				"value": title,
// 				"col": 3,
// 			},
// 			{
// 				"title": "내용",
// 				"type": "textarea",
// 				"elementId": "content",
// 				"value": content,
// 				"col": 4,
// 			},
// 		];
// 	}else{
// 		detailSetFormList(result);
// 		let from, to, disDate, place, sopp, customer, writer, title, content;

// 		disDate = dateDis(result.from);
// 		from = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		disDate = dateDis(result.to);
// 		to = dateFnc(disDate, "yyyy-mm-dd T HH:mm");

// 		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
// 		sopp = "";
// 		for(let key in storage.sopp){
// 			if(storage.sopp[key].no === result.sopp){
// 				sopp = storage.sopp[key].title;
// 			}
// 		}

// 		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
// 		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
// 		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
// 		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

// 		dataArray = [
// 			{
// 				"title": undefined,
// 				"radioValue": [
// 					{
// 						"key": "sales",
// 						"value": "영업일정",
// 					},
// 					{
// 						"key": "tech",
// 						"value": "기술일정",
// 					},
// 					{
// 						"key": "schedule",
// 						"value": "기타일정",
// 					},
// 				],
// 				"type": "radio",
// 				"elementName": "job",
// 				"radioType": "tab",
// 				"elementId": ["jobSales", "jobTech", "jobSchedule"],
// 				"col": 4,
// 				"onClick": "scheduleRadioClick(this);",
// 			},
// 			{
// 				"title": "일정시작일(*)",
// 				"type": "datetime",
// 				"elementId": "from",
// 				"value": from,
// 			},
// 			{
// 				"title": "일정종료일(*)",
// 				"type": "datetime",
// 				"elementId": "to",
// 				"value": to,
// 			},
// 			{
// 				"title": "장소",
// 				"elementId": "place",
// 				"value": place,
// 			},
// 			{
// 				"title": "영업기회(*)",
// 				"elementId": "sopp",
// 				"complete": "sopp",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": sopp,
// 			},
// 			{
// 				"title": "담당자(*)",
// 				"elementId": "writer",
// 				"complete": "user",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": writer,
// 			},
// 			{
// 				"title": "매출처",
// 				"elementId": "customer",
// 				"complete": "customer",
// 				"keyup": "addAutoComplete(this);",
// 				"onClick": "addAutoComplete(this);",
// 				"value": customer,
// 			},
// 			{
// 				"title": "제목(*)",
// 				"elementId": "title",
// 				"value": title,
// 				"col": 2,
// 			},
// 			{
// 				"title": "내용",
// 				"elementId": "content",
// 				"value": content,
// 				"type": "textarea",
// 				"col": 4,
// 			},
// 		];
// 	}

// 	return dataArray;
// }

// function scheduleUpdate(){
// 	let url, method, data, type, job;

// 	job = $("[name='job']:checked").val();

// 	url = "/api/schedule/" + job + "/" + storage.formList.no;
// 	method = "put";
// 	type = "update";

// 	if(job === "sales"){
// 		if($("#from").val() === ""){
// 			msg.set("활동시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("활동종료일을 선택해주세요.");
// 			return false;
// 		}else if($("#title").val() === ""){
// 			msg.set("제목을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
// 			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
// 			$("#partner").focus();
// 			return false;
// 		}
// 	}else if(job === "tech"){
// 		if($("#title").val() === ""){
// 			msg.set("기술요청명을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
// 			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
// 			$("#contract").focus();
// 			return false;
// 		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#partner").focus();
// 			return false;
// 		}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
// 			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
// 			$("#cipOfCustomer").focus();
// 			return false;
// 		}else if($("#customer").val() === ""){
// 			msg.set("엔드유저를 선택해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}else if($("#from").val() === ""){
// 			msg.set("지원시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("지원종료일을 선택해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}
// 	}else{
// 		if($("#from").val() === ""){
// 			msg.set("일정시작일을 선택해주세요.");
// 			return false;
// 		}else if($("#to").val() === ""){
// 			msg.set("일정종료일을 선택해주세요.");
// 			return false;
// 		}else if($("#title").val() === ""){
// 			msg.set("제목을 입력해주세요.");
// 			$("#title").focus();
// 			return false;
// 		}else if($("#sopp").val() === ""){
// 			msg.set("영업기회를 선택해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
// 			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
// 			$("#sopp").focus();
// 			return false;
// 		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
// 			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
// 			$("#customer").focus();
// 			return false;
// 		}
// 	}

// 	formDataSet();
// 	data = storage.formList;
// 	console.log(data);
// 	data = JSON.stringify(data);
// 	data = cipher.encAes(data);

// 	crud.defaultAjax(url, method, data, type, scheduleSuccessUpdate, scheduleErrorUpdate);
// }

// function scheduleSuccessUpdate(){
// 	location.reload();
// 	msg.set("수정완료");
// }

// function scheduleErrorUpdate(){
// 	msg.set("에러");
// }

// function scheduleDelete(){
// 	if(confirm("삭제하시겠습니까??")){
// 		let url, method, data, type;

// 		url = "/api/schedule/" + storage.formList.job + "/" + storage.formList.no;
// 		method = "delete";
// 		type = "delete";

// 		crud.defaultAjax(url, method, data, type, scheduleSuccessDelete, scheduleErrorDelete);
// 	}else{
// 		return false;
// 	}
// }

// function scheduleSuccessDelete(){
// 	location.reload();
// 	msg.set("삭제완료");
// }

// function scheduleErrorDelete(){
// 	msg.set("에러");
// }

// function scheduleSelectChange(){
//     let scheduleRange, url;
//     scheduleRange = document.getElementsByClassName("scheduleRange")[0].value;
	
// 	if(scheduleRange === "dept"){
// 		url = "/api/schedule2/" + scheduleRange + "/" + storage.user[storage.my].deptId[0];
// 	}else{
// 		url = "/api/schedule2/" + scheduleRange;
// 	}

// 	axios.get(url).then((response) => {
// 		let result = response.data.data;
// 		result = cipher.decAes(result);
// 		result = JSON.parse(result);

// 		if(result.length > 0){
// 			storage.scheduleList = result;
	
// 			if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
// 				window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
// 			}else{
// 				window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
// 			}
// 		}else{
// 			msg.set("데이터가 없습니다.");
// 		}
// 	})
// }

// function scheduleSelectSuccess(result){
//     storage.scheduleList = result;

//     if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
//         window.setTimeout(drawScheduleList, 600);
//         window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 600);
//     }else{
//         window.setTimeout(drawScheduleList, 200);
//         window.setTimeout(drawCalendar(document.getElementsByClassName("calendar_container")[0]), 200);
//     }
// }

// function scheduleSelectError(){
//     msg.set("에러");
// }

// function calendarMore(e){
// 	let thisEle, moreContentBody, html = "", calendarMoreContent, moreContentTitle;
// 	thisEle = $(e);
// 	setItemParents = thisEle.parents(".calendar_cell");
// 	calendarMoreContent = $(".calendarMoreContent");
// 	moreContentTitle = $(".moreContentTitle");
// 	calendarMoreContent.find(".moreContentBody").remove();
// 	calendarMoreContent.css("width", parseInt(setItemParents.innerWidth() - 20) + "px");
// 	calendarMoreContent.css("left", setItemParents.position().left + "px");
// 	calendarMoreContent.css("top", setItemParents.position().top + "px");
// 	calendarMoreContent.append("<div class=\"moreContentBody\"></div>");
	
// 	html = setItemParents.html();

// 	moreContentBody = $(".moreContentBody");
// 	moreContentBody.html(html);
// 	moreContentBody.children().not(".calendar_item").remove();
// 	moreContentBody.find(".calendar_item_empty").remove();
// 	moreContentBody.children().show();
// 	moreContentTitle.html(thisEle.parents(".calendar_cell").data("date"));
// 	calendarMoreContent.show();
// 	calendarMoreContent.draggable();
// }

// function moreContentClose(){
// 	let calendarMoreContent = $(".calendarMoreContent");
// 	calendarMoreContent.hide();
// }

// function searchInputKeyup(){
// 	let searchAllInput, pageContainer;
// 	searchAllInput = $("#searchAllInput").val();
// 	pageContainer = $(".pageContainer");
// 	tempArray = searchDataFilter(storage.scheduleList, searchAllInput, "input");

// 	if(tempArray.length > 0){
// 		storage.searchDatas = tempArray;
// 	}else{
// 		storage.searchDatas = "";
// 	}

// 	drawScheduleList();
// 	pageContainer.show();
// }

// function addSearchList(){
// 	storage.searchList = [];

// 	for(let i = 0; i < storage.scheduleList.length; i++){
// 		let no, writer, customer, job, type, from, to, disDate, setCreated;
// 		no = storage.scheduleList[i].no;
// 		writer = (storage.scheduleList[i].writer === null || storage.scheduleList[i].writer == 0 || storage.scheduleList[i].writer === undefined) ? "" : storage.user[storage.scheduleList[i].writer].userName;
// 		customer = (storage.scheduleList[i].customer === null || storage.scheduleList[i].customer == 0 || storage.scheduleList[i].customer === undefined) ? "" : storage.customer[storage.scheduleList[i].customer].name;
// 		title = storage.scheduleList[i].title;
// 		job = storage.scheduleList[i].job;
		
// 		if(job === "sales"){
// 			job = "영업일정";
// 		}else if(job === "tech"){
// 			job = "기술지원";
// 		}else{
// 			job = "기타일정";
// 		}

// 		type = storage.code.etc[storage.scheduleList[i].type];
// 		disDate = dateDis(storage.scheduleList[i].from);
// 		from = parseInt(dateFnc(disDate).replaceAll("-", ""));
// 		disDate = dateDis(storage.scheduleList[i].to);
// 		to = parseInt(dateFnc(disDate).replaceAll("-", ""));
// 		disDate = dateDis(storage.scheduleList[i].created, storage.scheduleList[i].modified);
// 		setCreated = parseInt(dateFnc(disDate).replaceAll("-", ""));
// 		storage.searchList.push("#" + no + "#" + writer + "#" + customer + "#" + title + "#" + job + "#" + type + "#from" + from + "#to" + to + "#created" + setCreated);
// 	}
// }

// function searchSubmit(){
// 	let dataArray = [], resultArray, eachIndex = 0, searchWriter, searchCustomer, searchJob, searchType, searchDateFrom, pageContainer;

// 	searchWriter = $("#searchWriter").val();
// 	searchCustomer = $("#searchCustomer").val();
// 	searchJob = $("#searchJob").val();
// 	searchType = $("#searchType").val();
// 	searchDateFrom = ($("#searchDateFrom").val() === "") ? "" : $("#searchDateFrom").val().replaceAll("-", "") + "#from" + $("#searchDateTo").val().replaceAll("-", "");
// 	pageContainer = $(".pageContainer");
// 	let searchValues = [searchWriter, searchCustomer, searchJob, searchType, searchDateFrom];

// 	for(let i = 0; i < searchValues.length; i++){
// 		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
// 			let tempArray = searchDataFilter(storage.scheduleList, searchValues[i], "multi");
			
// 			for(let t = 0; t < tempArray.length; t++){
// 				dataArray.push(tempArray[t]);
// 			}

// 			eachIndex++;
// 		}
// 	}

// 	resultArray = searchMultiFilter(eachIndex, dataArray, storage.scheduleList);
	
// 	storage.searchDatas = resultArray;

// 	if(storage.searchDatas.length == 0){
// 		msg.set("찾는 데이터가 없습니다.");
// 		storage.searchDatas = storage.scheduleList;
// 	}
	
// 	drawScheduleList();
// 	pageContainer.show();
// }
