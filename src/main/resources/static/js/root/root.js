$(document).ready(() => {
	init();
	goalList();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined || storage.monthTarget === undefined){
		window.setTimeout(gridWidget, 1000);
	}else{
		window.setTimeout(gridWidget, 200);
	}
});

function gridWidget(){
	let widgetContainer, html = "";
	widgetContainer = $("#widgetContainer");
	
	for(let i = 0; i < storage.widget.set.length; i++){
		let splitStr = storage.widget.set[i].split("/");

		if(storage.widget[splitStr[0]][splitStr[1]].size[0] > 1){
			if(storage.widget[splitStr[0]][splitStr[1]].size[1] > 1){
				html += "<div id=\"" + splitStr[0] + "_body" + "\" style=\"grid-column: span " + storage.widget[splitStr[0]][splitStr[1]].size[0] + "; grid-row: span " + storage.widget[splitStr[0]][splitStr[1]].size[1] + ";\">";
			}else{
				html += "<div id=\"" + splitStr[0] + "_body" + "\" style=\"grid-column: span " + storage.widget[splitStr[0]][splitStr[1]].size[0] + ";\">";
			}
		}else{
			if(storage.widget[splitStr[0]][splitStr[1]].size[1] > 1){
				html += "<div id=\"" + splitStr[0] + "_body" + "\" style=\"grid-row: span " + storage.widget[splitStr[0]][splitStr[1]].size[1] + ";\">";
			}else{
				html += "<div id=\"" + splitStr[0] + "_body" + "\">";
			}
		}

		html += "<hr />";
		html += "<span>" + storage.widget[splitStr[0]][splitStr[1]].title + "</span>";

		if(splitStr[0] === "chart"){
			html += "<div class=\"" + splitStr[0] + "_container" + "\">";

			if(splitStr[1] == 0){
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"400vh\"></canvas>";
			}else if(splitStr[1] == 4){
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"15vh\"></canvas>";
			}else{
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\"></canvas>";
			}
			
			if(storage.widget[splitStr[0]][splitStr[1]].info){
				html += "<br />";
				html += "<div class=\"chartInfo\"></div>"
			}

			html += "</div>"
		}else{
			html += "<div class=\"" + splitStr[0] + "_container" + "\"></div>";
		}

		html += "</div>";
	}

	widgetContainer.html(html);

	addChart();
	getNoticeList();
	getScheduleList();
	getSoppList();
	getContractList();
}

function addChart(){
	addChart_1();
	addChart_2();
	addChart_3();
	addChart_4();
	addChart_5();
}

function addChart_1(){
	let now, url, method, data, type, chart_0_body;
	chart_0_body = document.getElementsByClassName("chart_0_body");

	if(chart_0_body !== undefined){
		now = new Date();
		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
		url = "/api/accounting/statistics/sales/" + now;
		method = "get";
		type = "detail";
	
		crud.defaultAjax(url, method, data, type, chartSuccess_1, chartError_1);
	}
}

function chartSuccess_1(result){
	let chart_0, dataArray = [], temp = 0, salesArray = [];
	chart_0 = document.getElementById('chart_0').getContext('2d');

	for(let i = 0; i < 12; i++){
		if(result[i] === undefined){
			dataArray.push(0);
		}else{
			dataArray.push(result[i].sales);
		}
	}

	for(let i = 0; i < dataArray.length; i++){
		temp += dataArray[i] / 10;
		salesArray.push(temp);
	}

	new Chart(chart_0, {
		type: "bar",
		data: {
			labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			datasets: [
				{
					label: "월별목표",
					data: storage.monthTarget,
					backgroundColor: "#5f46c6", 
					borderColor: "#5f46c6",
					borderWidth: 3,
					radius: 0,
				},
				{
					label: "월별매출",
					data: dataArray,
					backgroundColor: "#76e3f1",
					borderColor: "#76e3f1",
					borderWidth: 3,
					radius: 0,
				},
				{
					type: "line",
					label: "누적목표",
					data: storage.accMonthTarget,
					fill: false,
					order: true,
					lineTension: 0,
					backgroundColor: "#A566FF",
					borderColor: "#A566FF",
				},
				{
					type: "line",
					label: "누적매출",
					data: salesArray,
					fill: false,
					order: true,
					lineTension: 0,
					backgroundColor: "#F15F5F",
					borderColor: "#F15F5F",
				},
			],
		},
		options: {
			responsive: false,
			scales: {
			  	yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function(value, index) {
							if(value.toString().length > 8){
								return (Math.floor(value / 100000000)).toLocaleString("ko-KR") + " (억원)";
							}else if(value.toString().length > 4){
								return (Math.floor(value / 10000)).toLocaleString("ko-KR") + " (만원)";
							}else{
								return value.toLocaleString("ko-KR"); 
							}
						}
					},
				}]
		  	},
			tooltips: { 
				callbacks: { 
					label: function(tooltipItem, data) {
						if(tooltipItem.datasetIndex == 2 || tooltipItem.datasetIndex == 3){
							return " " + (tooltipItem.yLabel * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						}else{
							return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						}
					} 
				 },
			},
		}
	});
}

function chartError_1(){
	alert("첫번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_2(){
	let now, url, method, data, type, chart_1_body;
	chart_1_body = document.getElementsByClassName("chart_1_body");
	
	if(chart_1_body !== undefined){
		now = new Date();
		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
		url = "/api/accounting/statistics/sales/" + now;
		method = "get";
		type = "detail";
	
		crud.defaultAjax(url, method, data, type, chartSuccess_2, chartError_2);
	}
}

function chartSuccess_2(result){
	let chart_1, infoHtml = "", nowDate, month, monthTarget;
	chart_1 = document.getElementById('chart_1').getContext('2d');
	nowDate = new Date();
	month = nowDate.getMonth();
	monthTarget = (result[month] === undefined) ? 0 : result[month].sales;

	new Chart(chart_1, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [100, 0],
					backgroundColor: [
						"#ff5377",
						"#95c1e6"
					],
					radius:0,
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
		},
	});

	infoHtml = "<div>목표 0</div>";
	infoHtml += "<div>매출 0</div>";
	infoHtml += "<div>달성률 0.00%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-0</div>";
	chart_1.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_2(){
	alert("두번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_3(){
	let now, url, method, data, type, chart_2_body;
	chart_2_body = document.getElementsByClassName("chart_2_body");
	
	if(chart_2_body !== undefined){
		now = new Date();
		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
		url = "/api/accounting/statistics/sales/" + now;
		method = "get";
		type = "detail";
	
		crud.defaultAjax(url, method, data, type, chartSuccess_3, chartError_3);
	}
}

function chartSuccess_3(result){
	let chart_2, infoHtml = "", nowDate, month, monthTarget;
	chart_2 = document.getElementById('chart_2').getContext('2d');
	nowDate = new Date();
	month = nowDate.getMonth();
	monthTarget = (result[month] === undefined) ? 0 : result[month].sales;

	new Chart(chart_2, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [(monthTarget / storage.monthTarget[month] * 100).toFixed(2), (100 - (monthTarget / storage.monthTarget[month] * 100).toFixed(2))],
					backgroundColor: [
						"#31cca2",
						"#95c1e6"
					],
					radius:0,
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
		},
	});

	infoHtml = "<div>목표 " + (parseInt(storage.monthTarget[month])).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>매출 " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>달성률 " + (monthTarget / storage.monthTarget[month] * 100).toFixed(2) + "%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-" + parseInt(storage.monthTarget[month] - monthTarget).toLocaleString("en-US") + "</div>";
	chart_2.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_3(){
	alert("두번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_4(){
	let now, url, method, data, type, chart_3_body;
	chart_3_body = document.getElementsByClassName("chart_3_body");
	
	if(chart_3_body !== undefined){
		now = new Date();
		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
		url = "/api/accounting/statistics/sales/" + now;
		method = "get";
		type = "detail";
	
		crud.defaultAjax(url, method, data, type, chartSuccess_4, chartError_4);
	}
}

function chartSuccess_4(result){
	let chart_3, infoHtml = "", dataArray = [], monthTarget = 0;
	chart_3 = document.getElementById('chart_3').getContext('2d');

	for(let i = 0; i < 12; i++){
		if(result[i] === undefined){
			dataArray.push(0);
		}else{
			dataArray.push(result[i].sales);
		}
	}

	for(let i = 0; i < dataArray.length; i++){
		monthTarget += dataArray[i];
	}

	new Chart(chart_3, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [(monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2), (100 - (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2))],
					backgroundColor: [
						"#31cca2",
						"#95c1e6"
					],
					radius:0,
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
		},
	});

	infoHtml = "<div>목표 " + (parseInt(storage.accMonthTarget[11] * 10)).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>매출 " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>달성률 " + (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2) + "%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-" + parseInt((storage.accMonthTarget[11] * 10) - monthTarget).toLocaleString("en-US") + "</div>";
	chart_3.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_4(){
	alert("세번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_5(){
	let chart_4;
	chart_4 = document.getElementById('chart_4').getContext('2d');

	new Chart(chart_4, {
		type: "pie",
		data: {
			labels: ["조달직판", "조달간판", "조달대행", "직접판매", "간접판매", "기타"],
			datasets: [
				{
					data: [310, 200, 110, 220, 100, 50],
					backgroundColor: [
						"#29cea6",
						"#2795f7",
						"#f7d766",
						"#ff5377",
						"#7952e9",
						"#d9d9d9",
					]
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	});
}

function getNoticeList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "notice_body";
	container = $(".notice_container");
	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc = "", dataJob, data = [], disDate, setDate;
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);

				header = [
					{
						"title" : "등록일",
						"align" : "center",
					},
					{
						"title" : "제목",
						"align" : "left",
					},
					{
						"title" : "작성자",
						"align" : "center",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					disDate = dateDis(result[i].created, result[i].modified);
					setDate = dateFnc(disDate, "mm-dd");

					str = [
						{
							"setData": setDate,
						},
						{
							"setData": result[i].title,
						},
						{
							"setData": storage.user[result[i].writer].userName,
						},
					];

					fnc = "rootDetailView(\"notice\", this);";
					ids.push(result[i].no);
					data.push(str);
				}

				if(data.length > 0){
					createGrid(container, header, data, ids, dataJob, fnc, idName);
				}
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	});
}

function getScheduleList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "schedule_body";
	container = $(".schedule_container");
	url = "/api/schedule/calendar/company";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);
				result = result.sort(function(a, b){return b.created - a.created;});

				header = [
					{
						"title" : "등록일",
						"align" : "center",
					},
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
						"title" : "일정설명",
						"align" : "left",
					},
					{
						"title" : "담당자",
						"align" : "center",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}

				for (let i = 0; i < gridListLength; i++) {
					let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content, disDate;
					
					job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "" : result[i].job;

					if(job === "sales"){
						job = "영업일정";
					}else if(job === "tech"){
						job = "기술지원";
					}else{
						job = "기타일정";
					}

					title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
					writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
					content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
					content = content.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br />", "");

					disDate = dateDis(result[i].created, result[i].created);
					disDate = dateFnc(disDate, "mm-dd");
					
					fromDate = dateDis(result[i].from);
					fromSetDate = dateFnc(fromDate, "mm-dd");
					
					toDate = dateDis(result[i].to);
					toSetDate = dateFnc(toDate, "mm-dd");
			
					str = [
						{
							"setData": disDate,
						},
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
							"setData": content,
						},
						{
							"setData": writer,
						},
					];

					fnc = "rootDetailView(\"schedule\", this);";
					ids.push(result[i].no);
					dataJob.push(result[i].job);
					data.push(str);
				}

				if(data.length > 0){
					createGrid(container, header, data, ids, dataJob, fnc, idName);
				}
			} else {
				msg.set("등록된 일정이 없습니다");
			}
		}
	});
}

// function getSalesList() {
// 	let url, container, idName, gridListLength = 8;
	
// 	idName = "bodySales";
// 	container = $(".gridSalesList");
// 	url = "/api/schedule/calendar/personal";

// 	$.ajax({
// 		"url": url,
// 		"method": "get",
// 		"dataType": "json",
// 		"cache": false,
// 		success: (result) => {
// 			let header, str, ids = [], fnc, dataJob = [], data = [];
// 			if (result.result === "ok") {
// 				result = cipher.decAes(result.data);
// 				result = JSON.parse(result);

// 				header = [
// 					{
// 						"title" : "번호",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정구분",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정제목",
// 						"align" : "left",
// 					},
// 					{
// 						"title" : "일정",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "담당자",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정설명",
// 						"align" : "left",
// 					},
// 				];

// 				if(result.length < gridListLength){
// 					gridListLength = result.length;
// 				}
			
// 				for (let i = 0; i < gridListLength; i++) {
// 					if(result[i].job === "sales"){
// 						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "sales" : "영업일정";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
// 						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
// 						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
						
// 						fromDate = dateDis(result[i].from);
// 						fromSetDate = dateFnc(fromDate);
						
// 						toDate = dateDis(result[i].to);
// 						toSetDate = dateFnc(toDate);
				
// 						str = [
// 							{
// 								"setData": result[i].no,
// 							},
// 							{
// 								"setData": job,
// 							},
// 							{
// 								"setData": title,
// 							},
// 							{
// 								"setData": fromSetDate + " ~ " + toSetDate,
// 							},
// 							{
// 								"setData": writer,
// 							},
// 							{
// 								"setData": content,
// 							},
// 						];
				
// 						fnc = "rootDetailView(\"sales\", this);";
// 						ids.push(result[i].no);
// 						dataJob.push(result[i].job);
// 						data.push(str);
// 					}
// 				}
// 				createGrid(container, header, data, ids, dataJob, fnc, idName);
// 			} else {
// 				msg.set("등록된 영업활동 일정이 없습니다");
// 			}
// 		}
// 	});
// }

// function getTechList() {
// 	let url, container, idName, gridListLength = 8;
	
// 	idName = "bodyTech";
// 	container = $(".gridTechList");
// 	url = "/api/schedule/calendar/personal";

// 	$.ajax({
// 		"url": url,
// 		"method": "get",
// 		"dataType": "json",
// 		"cache": false,
// 		success: (result) => {
// 			let header, str, ids = [], fnc, dataJob = [], data = [];
// 			if (result.result === "ok") {
// 				result = cipher.decAes(result.data);
// 				result = JSON.parse(result);

// 				header = [
// 					{
// 						"title" : "번호",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정구분",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정제목",
// 						"align" : "left",
// 					},
// 					{
// 						"title" : "일정",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "담당자",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "일정설명",
// 						"align" : "left",
// 					},
// 				];

// 				if(result.length < gridListLength){
// 					gridListLength = result.length;
// 				}
			
// 				for (let i = 0; i < gridListLength; i++) {
// 					if(result[i].job === "tech"){
// 						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "tech" : "기술지원";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
// 						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
// 						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
						
// 						fromDate = dateDis(result[i].from);
// 						fromSetDate = dateFnc(fromDate);
						
// 						toDate = dateDis(result[i].to);
// 						toSetDate = dateFnc(toDate);
				
// 						str = [
// 							{
// 								"setData": result[i].no,
// 							},
// 							{
// 								"setData": job,
// 							},
// 							{
// 								"setData": title,
// 							},
// 							{
// 								"setData": fromSetDate + " ~ " + toSetDate,
// 							},
// 							{
// 								"setData": writer,
// 							},
// 							{
// 								"setData": content,
// 							},
// 						];
				
// 						fnc = "rootDetailView(\"tech\", this);";
// 						ids.push(result[i].no);
// 						dataJob.push(result[i].job);
// 						data.push(str);
// 					}
// 				}
// 				createGrid(container, header, data, ids, dataJob, fnc, idName);
// 			} else {
// 				msg.set("등록된 기술지원 일정이 없습니다");
// 			}
// 		}
// 	});
// }

function getSoppList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "sopp_body";
	container = $(".sopp_container");
	url = "/api/sopp";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);

				header = [
					{
						"title" : "등록일",
						"align" : "center",
					},
					{
						"title" : "영업기회명",
						"align" : "left",
					},
					{
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "판매방식",
						"align" : "center",
					},
					{
						"title" : "계약구분",
						"align" : "center",
					},
					{
						"title" : "매출처",
						"align" : "center",
					},
					{
						"title" : "엔드유저",
						"align" : "center",
					},
					{
						"title" : "예상매출액",
						"align" : "right",
					},
					{
						"title" : "진행단계",
						"align" : "center",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}

				for (let i = 0; i < gridListLength; i++) {
					let soppType, contType, title, customer, endUser, employee, expectedSales, status;
					
					disDate = dateDis(result[i].created, result[i].modified);
					setDate = dateFnc(disDate, "mm-dd");

					soppType = (result[i].soppType === null || result[i].soppType === "") ? "없음" : storage.code.etc[result[i].soppType];
					contType = (result[i].contType === null || result[i].contType === "") ? "없음" : storage.code.etc[result[i].contType];
					title = (result[i].title === null || result[i].title === "") ? "제목 없음" : result[i].title;
					customer = (result[i].customer === null || result[i].customer == 0) ? "없음" : storage.customer[result[i].customer].name;
					endUser = (result[i].endUser === null || result[i].endUser == 0) ? "없음" : storage.customer[result[i].endUser].name;
					employee = (result[i].employee === null || result[i].employee == 0) ? "없음" : storage.user[result[i].employee].userName;
					expectedSales = (result[i].expectedSales === null || result[i].expectedSales == 0) ? 0 : numberFormat(result[i].expectedSales);
					status = (result[i].status === null || result[i].status === "") ? "없음" : storage.code.etc[result[i].status];
			
					str = [
						{
							"setData": setDate,
						},
						{
							"setData": title,
						},
						{
							"setData": employee,
						},
						{
							"setData": soppType,
						},
						{
							"setData": contType,
						},
						{
							"setData": customer,
						},
						{
							"setData": endUser,
						},
						{
							"setData": expectedSales,
						},
						{
							"setData": status,
						},
						
					];

					fnc = "rootDetailView(\"sopp\", this);";
					ids.push(result[i].no);
					data.push(str);
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("등록된 영업기회가 없습니다");
			}
		}
	});
}

function getContractList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "contract_body";
	container = $(".contract_container");
	url = "/api/contract";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);

				header = [
					{
						"title" : "등록일",
						"align" : "center",
					},
					{
						"title" : "유지보수일자",
						"align" : "center",
					},
					{
						"title" : "계약명",
						"align" : "left",
					},
					{
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "판매방식",
						"align" : "center",
					},
					{
						"title" : "계약방식",
						"align" : "center",
					},
					{
						"title" : "엔드유저",
						"align" : "center",
					},
					{
						"title" : "계약금액",
						"align" : "right",
					},
					{
						"title" : "매출이익",
						"align" : "right",
					},
					{
						"title" : "발주일자",
						"align" : "center",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate, setCreated;
		
					salesType = (result[i].salesType === null || result[i].salesType === "") ? "없음" : storage.code.etc[result[i].salesType];
					contractType = (result[i].contractType === null || result[i].contractType === "") ? "없음" : storage.code.etc[result[i].contractType];
					title = (result[i].title === null || result[i].title === "") ? "제목 없음" : result[i].title;
					endUser = (result[i].endUser === null || result[i].endUser == 0) ? "없음" : storage.customer[result[i].endUser].name;
					contractAmount = (result[i].contractAmount == 0 || result[i].contractAmount === null) ? 0 : numberFormat(result[i].contractAmount);
					profit = (result[i].profit == 0 || result[i].profit === null) ? 0 : numberFormat(result[i].profit);
					employee = (result[i].employee === null || result[i].employee == 0) ? "없음" : storage.user[result[i].employee].userName;
					
					if(contractType === "유지보수"){
						disDate = dateDis(result[i].startOfPaidMaintenance);
						startMaintenance = dateFnc(disDate, "yy-mm-dd");
				
						disDate = dateDis(result[i].endOfPaidMaintenance);
						endMaintenance = dateFnc(disDate, "yy-mm-dd");
					}else{
						disDate = dateDis(result[i].startOfFreeMaintenance);
						startMaintenance = dateFnc(disDate, "yy-mm-dd");
				
						disDate = dateDis(result[i].endOfFreeMaintenance);
						endMaintenance = dateFnc(disDate, "yy-mm-dd");
					}
					
					disDate = dateDis(result[i].saleDate);
					saleDate = dateFnc(disDate, "mm-dd");

					disDate = dateDis(result[i].created, result[i].modified);
					setCreated = dateFnc(disDate, "mm-dd");

					str = [
						{
							"setData": setCreated,
						},
						{
							"setData": startMaintenance + " ~ " + endMaintenance,
						},
						{
							"setData": title,
						},
						{
							"setData": employee,
						},
						{
							"setData": salesType,
						},
						{
							"setData": contractType,
						},
						{
							"setData": endUser,
						},
						{
							"setData": contractAmount,
						},
						{
							"setData": profit,
						},
						{
							"setData": saleDate,
						},
					];

					fnc = "rootDetailView(\"contract\", this);";
					ids.push(result[i].no);
					data.push(str);
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("등록된 계약이 없습니다");
			}
		}
	});
}

function rootDetailView(page, e){
	let id = $(e).data("id");
	location.href = apiServer + "/business/" + page + "/" + id;
}

function goalList(){
	let nowDate, nowYear;
	nowDate = new Date();
	nowYear = nowDate.getFullYear();

	$.ajax({
		url: "/api/system/goal/" + nowYear,
		method: "get",
		dataType: "json",
		contentType: "text/plain",
		success: (result) => {
			let temp = 0;
			result = cipher.decAes(result.data);
			result = JSON.parse(result);
			storage.monthTarget = result.all;
			storage.accMonthTarget = [];

			for(let i = 0; i < storage.monthTarget.length; i++){
				temp += storage.monthTarget[i] / 10;
				storage.accMonthTarget.push(temp);
			}
		}
	});
}