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
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"400\" width=\"550\"></canvas>";
			}else if(splitStr[1] == 4){
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"100\" width=\"100\"></canvas>";
			}else{
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" width=\"200\" height=\"200\"></canvas>";
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
			labels: ["1???", "2???", "3???", "4???", "5???", "6???", "7???", "8???", "9???", "10???", "11???", "12???"],
			datasets: [
				{
					type: "line",
					label: "????????????",
					data: storage.accMonthTarget,
					fill: false,
					lineTension: 0,
					backgroundColor: "#A566FF",
					borderColor: "#A566FF",
				},
				{
					type: "line",
					label: "????????????",
					data: salesArray,
					fill: false,
					lineTension: 0,
					backgroundColor: "#F15F5F",
					borderColor: "#F15F5F",
				},
				{
					label: "????????????",
					data: storage.monthTarget,
					backgroundColor: "#5f46c6", 
					borderColor: "#5f46c6",
					borderWidth: 3,
					radius: 0,
				},
				{
					label: "????????????",
					data: dataArray,
					backgroundColor: "#76e3f1",
					borderColor: "#76e3f1",
					borderWidth: 3,
					radius: 0,
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
								return (Math.floor(value / 100000000)).toLocaleString("ko-KR") + " (??????)";
							}else if(value.toString().length > 4){
								return (Math.floor(value / 10000)).toLocaleString("ko-KR") + " (??????)";
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
							return " " + (tooltipItem.yLabel * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "???"; 
						}else{
							return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "???"; 
						}
					} 
				 },
			},
		}
	});
}

function chartError_1(){
	alert("????????? ????????? ????????? ????????????.\n?????? ??????????????????.");
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
			labels: ["?????????", "????????????"],
			datasets: [
				{
					data: [0, 100],
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

	infoHtml = "<div>?????? 0</div>";
	infoHtml += "<div>?????? 0</div>";
	infoHtml += "<div>????????? 0.00%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-0</div>";
	chart_1.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_2(){
	alert("????????? ????????? ????????? ????????????.\n?????? ??????????????????.");
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

	let data1 = isNaN((monthTarget / storage.monthTarget[month] * 100).toFixed(2)) ? 0 : (monthTarget / storage.monthTarget[month] * 100).toFixed(2);
	let data2 = isNaN((100 - (monthTarget / storage.monthTarget[month] * 100).toFixed(2))) ? 100 : (100 - (monthTarget / storage.monthTarget[month] * 100).toFixed(2));

	new Chart(chart_2, {
		type: "doughnut",
		data: {
			labels: ["?????????", "????????????"],
			datasets: [
				{
					data: [data1, data2],
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

	infoHtml = "<div>?????? " + (parseInt(storage.monthTarget[month])).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>?????? " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";

	if(isNaN((monthTarget / storage.monthTarget[month] * 100).toFixed(2))){
		infoHtml += "<div>????????? 0.00%<div>";
	}else{
		infoHtml += "<div>????????? " + (monthTarget / storage.monthTarget[month] * 100).toFixed(2) + "%<div>";
	}

	infoHtml += "<hr />";
	infoHtml += "<div>-" + parseInt(storage.monthTarget[month] - monthTarget).toLocaleString("en-US") + "</div>";
	chart_2.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_3(){
	alert("????????? ????????? ????????? ????????????.\n?????? ??????????????????.");
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

	let data1 = isNaN((monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2)) ? 0 : (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2);
	let data2 = isNaN((100 - (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2))) ? 100 : (100 - (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2));

	new Chart(chart_3, {
		type: "doughnut",
		data: {
			labels: ["?????????", "????????????"],
			datasets: [
				{
					data: [data1, data2],
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

	infoHtml = "<div>?????? " + (parseInt(storage.accMonthTarget[11] * 10)).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>?????? " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";

	if(isNaN((monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2))){
		infoHtml += "<div>????????? 0.00%<div>";
	}else{
		infoHtml += "<div>????????? " + (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2) + "%<div>";
	}

	infoHtml += "<hr />";
	infoHtml += "<div>-" + parseInt((storage.accMonthTarget[11] * 10) - monthTarget).toLocaleString("en-US") + "</div>";
	chart_3.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_4(){
	alert("????????? ????????? ????????? ????????????.\n?????? ??????????????????.");
}

function addChart_5(){
	let chart_4;
	chart_4 = document.getElementById('chart_4').getContext('2d');

	new Chart(chart_4, {
		type: "pie",
		data: {
			labels: ["????????????", "????????????", "????????????", "????????????", "????????????", "??????"],
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
			layout:{
				padding: {
					top: 50,
				}
			},
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
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "??????",
						"align" : "center",
					},
					{
						"title" : "?????????",
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
							"align" : "center",
						},
						{
							"setData": result[i].title,
							"align" : "left",
						},
						{
							"setData": storage.user[result[i].writer].userName,
							"align" : "center",
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
				msg.set("????????? ??????????????? ????????????");
			}
		}
	});
}

function getScheduleList() {
	let url, container, idName, gridListLength = 8, date;
	
	idName = "schedule_body";
	container = $(".schedule_container");
	date = new Date().getTime();
	url = "/api/schedule2/company/" + date;

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
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "??????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "?????????",
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
						job = "????????????";
					}else if(job === "tech"){
						job = "????????????";
					}else{
						job = "????????????";
					}

					title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "?????? ??????" : result[i].title;
					writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "??????" : storage.user[result[i].writer].userName;
					content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "?????? ??????" : result[i].content;
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
							"align" : "center",
						},
						{
							"setData": fromSetDate + " ~ " + toSetDate,
							"align" : "center",
						},
						{
							"setData": job,
							"align" : "center",
						},
						{
							"setData": title,
							"align" : "left",
						},
						{
							"setData": content,
							"align" : "left",
						},
						{
							"setData": writer,
							"align" : "center",
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
				msg.set("????????? ????????? ????????????");
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
// 						"title" : "??????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "left",
// 					},
// 					{
// 						"title" : "??????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "?????????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "left",
// 					},
// 				];

// 				if(result.length < gridListLength){
// 					gridListLength = result.length;
// 				}
			
// 				for (let i = 0; i < gridListLength; i++) {
// 					if(result[i].job === "sales"){
// 						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "sales" : "????????????";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "?????? ??????" : result[i].title;
// 						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "??????" : storage.user[result[i].writer].userName;
// 						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "?????? ??????" : result[i].content;
						
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
// 				msg.set("????????? ???????????? ????????? ????????????");
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
// 						"title" : "??????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "left",
// 					},
// 					{
// 						"title" : "??????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "?????????",
// 						"align" : "center",
// 					},
// 					{
// 						"title" : "????????????",
// 						"align" : "left",
// 					},
// 				];

// 				if(result.length < gridListLength){
// 					gridListLength = result.length;
// 				}
			
// 				for (let i = 0; i < gridListLength; i++) {
// 					if(result[i].job === "tech"){
// 						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "tech" : "????????????";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "?????? ??????" : result[i].title;
// 						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "??????" : storage.user[result[i].writer].userName;
// 						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "?????? ??????" : result[i].content;
						
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
// 				msg.set("????????? ???????????? ????????? ????????????");
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
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "???????????????",
						"align" : "center",
					},
					{
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "???????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
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

					soppType = (result[i].soppType === null || result[i].soppType === "") ? "??????" : storage.code.etc[result[i].soppType];
					contType = (result[i].contType === null || result[i].contType === "") ? "??????" : storage.code.etc[result[i].contType];
					title = (result[i].title === null || result[i].title === "") ? "?????? ??????" : result[i].title;
					customer = (result[i].customer === null || result[i].customer == 0) ? "??????" : storage.customer[result[i].customer].name;
					endUser = (result[i].endUser === null || result[i].endUser == 0) ? "??????" : storage.customer[result[i].endUser].name;
					employee = (result[i].employee === null || result[i].employee == 0) ? "??????" : storage.user[result[i].employee].userName;
					expectedSales = (result[i].expectedSales === null || result[i].expectedSales == 0) ? 0 : numberFormat(result[i].expectedSales);
					status = (result[i].status === null || result[i].status === "") ? "??????" : storage.code.etc[result[i].status];
			
					str = [
						{
							"setData": setDate,
							"align" : "center",
						},
						{
							"setData": title,
							"align" : "left",
						},
						{
							"setData": employee,
							"align" : "center",
						},
						{
							"setData": soppType,
							"align" : "center",
						},
						{
							"setData": contType,
							"align" : "center",
						},
						{
							"setData": customer,
							"align" : "center",
						},
						{
							"setData": endUser,
							"align" : "center",
						},
						{
							"setData": expectedSales,
							"align" : "right",
						},
						{
							"setData": status,
							"align" : "center",
						},
					];

					fnc = "rootDetailView(\"sopp\", this);";
					ids.push(result[i].no);
					data.push(str);
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("????????? ??????????????? ????????????");
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
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "??????????????????",
						"align" : "center",
					},
					{
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "?????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
					{
						"title" : "????????????",
						"align" : "center",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate, setCreated;
		
					salesType = (result[i].salesType === null || result[i].salesType === "") ? "??????" : storage.code.etc[result[i].salesType];
					contractType = (result[i].contractType === null || result[i].contractType === "") ? "??????" : storage.code.etc[result[i].contractType];
					title = (result[i].title === null || result[i].title === "") ? "?????? ??????" : result[i].title;
					endUser = (result[i].endUser === null || result[i].endUser == 0) ? "??????" : storage.customer[result[i].endUser].name;
					contractAmount = (result[i].contractAmount == 0 || result[i].contractAmount === null) ? 0 : numberFormat(result[i].contractAmount);
					profit = (result[i].profit == 0 || result[i].profit === null) ? 0 : numberFormat(result[i].profit);
					employee = (result[i].employee === null || result[i].employee == 0) ? "??????" : storage.user[result[i].employee].userName;
					
					if(contractType === "????????????"){
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
							"align" : "center",
						},
						{
							"setData": startMaintenance + " ~ " + endMaintenance,
							"align" : "center",
						},
						{
							"setData": title,
							"align" : "left",
						},
						{
							"setData": employee,
							"align" : "center",
						},
						{
							"setData": salesType,
							"align" : "center",
						},
						{
							"setData": contractType,
							"align" : "center",
						},
						{
							"setData": endUser,
							"align" : "center",
						},
						{
							"setData": contractAmount,
							"align" : "right",
						},
						{
							"setData": profit,
							"align" : "right",
						},
						{
							"setData": saleDate,
							"align" : "center",
						},
					];

					fnc = "rootDetailView(\"contract\", this);";
					ids.push(result[i].no);
					data.push(str);
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("????????? ????????? ????????????");
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