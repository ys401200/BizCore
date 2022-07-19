$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	$(".calendarList").hide();

	createCalendar();
	getScheduleList();
});

function getScheduleList() {
	let url, dataArray = [], headerArray, container, pageContainer;
	
	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridScheduleList");
	headerArray = [
		{
			"title" : "등록일",
			"padding" : false,
		},
		{
			"title" : "일정구분",
			"padding" : false,
		},
		{
			"title" : "일정제목",
			"padding" : true,
		},
		{
			"title" : "일정",
			"padding" : false,
		},
		{
			"title" : "고객사",
			"padding" : false,
		},
		{
			"title" : "담당자",
			"padding" : true,
		},
		{
			"title" : "장소",
			"padding" : false,
		},
		{
			"title" : "활동형태",
			"padding" : false,
		},
		{
			"title" : "일정설명",
			"padding" : true,
		}
		
	];
	
	url = apiServer + "/api/schedule";

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
							"setData": jsonData[i].user,
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
					dataArray.push(str);
				}

				var pageNation = createPaging(pageContainer[0], 50, "testClick");
				pageContainer[0].innerHTML = pageNation;
				createGrid(container, headerArray, dataArray, ids, fnc);
			} else {
				msg.set("등록된 일정이 없습니다");
			}
		}
	});
}

function createCalendar(year, month){
	let date, day, nowDate, nowDay, last, lastDate, row, calendar, dNum, tdClass, calendarBody;

	calendarBody = $(".calendarList table tbody");

	if(year === undefined || month === undefined){
		date = new Date();
		year = date.getFullYear();
		month = date.getMonth();
		day = date.getDate();
		nowDate = new Date(year, month, 1);
		nowDay = nowDate.getDay();
	}else{
		nowDate = new Date(year, month, 1);
		nowDay = nowDate.getDay();
	}

	
	last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if(year % 4 && year % 100 != 0 || year % 400 == 0){
		lastDate = last[1] = 29;
	}

	lastDate = last[month];
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
	let getYear, getMonth, setYear, setMonth;

	getYear = $(".calendarYear");
	getMonth = $(".calendarMonth");
	setYear = parseInt(getYear.html());
	setMonth = parseInt(getMonth.html());

	if(setMonth == 12){
		setYear = setYear + 1;
		setMonth = 0;
		createCalendar(setYear, 1);
	}else{
		createCalendar(setYear, setMonth);
	}

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
	
	if(setMonth == 1){
		setYear = setYear - 1;
		setMonth = 13;
		createCalendar(setYear, 12);
	}else{
		createCalendar(setYear, setMonth);
	}

	setMonth = setMonth - 1;
	
	getYear.html(setYear);
	getMonth.html(setMonth);
}

function listChange(event){
	let tableList = $(".gridScheduleList");
	let calendarList = $(".calendarList");
	let pageContainer = $(".pageContainer");

	console.log($(event).data("type"));
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