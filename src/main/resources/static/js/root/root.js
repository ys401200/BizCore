document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	contMonthTotal();
	goalList();

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined || storage.monthTarget === undefined){
		window.setTimeout(gridWidget, 1000);
	}else{
		window.setTimeout(gridWidget, 200);
	}
}

window.onload = () => {
	$('.theme-loader').delay(2300).fadeOut("slow");
}

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
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"370\" width=\"465\"></canvas>";
			}else if(splitStr[1] == 1){
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"370\" width=\"400\"></canvas>";
			}else if(splitStr[1] == 4){
				html += "<canvas id=\"" + splitStr[0] + "_" + splitStr[1] + "\" height=\"300\" width=\"280\"></canvas>";
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

	getNoticeList();
	getScheduleList();
	getSoppList();
	getContractList();
	chartDefaultTotalSet();
	addChart();
}

function addChart(){
	addChart_1();
	addChart_2();
	addChart_3();
	addChart_4();
	addChart_5();
}

function contMonthTotal(){
	axios.get("/api/category").then((response) => {
		if (response.data.result === "ok") {
			let result;
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);
			storage.custCategoryList = result;
		}
	}).catch((error) => {
		msg.set("카테고리 데이터 에러입니다.\n" + error);
		console.log(error);
	});

	axios.get("/api/cont/calMonthTotal").then((response) => {
		if (response.data.result === "ok") {
			let result;
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);
			storage.contMonthTotal = result;
		}
	}).catch((error) => {
		msg.set("계약별 집계 데이터를 가져오는 중 에러가 발생했습니다.\n" + error);
		console.log(error);
	});

	axios.get("/api/cont/calContTypeTotal").then((response) => {
		if (response.data.result === "ok") {
			storage.contTypeTotal = [];
			let result;
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);

			for(let i = 0; i < result.length; i++){
				let item = result[i];
				let setDatas = {};
				setDatas.contType = storage.code.etc[item.contType];
				setDatas.getCount = item.getCount;
				storage.contTypeTotal.push(setDatas);
			}

		}
	}).catch((error) => {
		msg.set("계약별 집계 데이터를 가져오는 중 에러가 발생했습니다.\n" + error);
		console.log(error);
	});

	axios.get("/api/cont/calContractTypeTotal").then((response) => {
		if (response.data.result === "ok") {
			let result;
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);
			console.log(result);
			storage.contractTypeTotal = result;
		}
	}).catch((error) => {
		msg.set("계약별 집계 데이터를 가져오는 중 에러가 발생했습니다.\n" + error);
		console.log(error);
	});
}

function chartDefaultTotalSet(){
	let goalList = storage.rootGoalList;
	let contList = storage.contMonthTotal;
	let contTypeList = storage.contractTypeTotal;
	let goalMonthTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let goalMonthCalTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let contMonthTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let contMonthCalTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let contTypeMonthTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	storage.contCategoryList = [];

	for(let i = 0; i < storage.custCategoryList.length; i++){
		let item = storage.custCategoryList[i];
		let total = 0;
		let datas = {};
		let nowDate = new Date().getFullYear();
		nowDate = new Date(nowDate + "-01-01").getTime();

		for(let t = 0; t < storage.contract.length; t++){
			let secondItem = storage.contract[t];
			let dateTime = new Date(secondItem.regDatetime).getTime();

			if(secondItem.categories !== null && secondItem.categories.indexOf(item.custCategoryName) > -1 && nowDate <= dateTime){
				total += secondItem.contAmt;
			}
		}
		
		datas.label = item.custCategoryName;
		datas.value = total;

		storage.contCategoryList.push(datas);
	}

	for(let i = 0; i < goalList.length; i++){
		let item = goalList[i];
		goalMonthTotal[0] += item.mm01;
		goalMonthTotal[1] += item.mm02;
		goalMonthTotal[2] += item.mm03;
		goalMonthTotal[3] += item.mm04;
		goalMonthTotal[4] += item.mm05;
		goalMonthTotal[5] += item.mm06;
		goalMonthTotal[6] += item.mm07;
		goalMonthTotal[7] += item.mm08;
		goalMonthTotal[8] += item.mm09;
		goalMonthTotal[9] += item.mm10;
		goalMonthTotal[10] += item.mm11;
		goalMonthTotal[11] += item.mm12;
	}

	for(let i = 0; i < goalMonthTotal.length; i++){
		let item = goalMonthTotal[i];
		
		if(i == 0) goalMonthCalTotal[i] = item;
		else goalMonthCalTotal[i] = goalMonthCalTotal[i - 1] + item;
	}

	for(let i = 0; i < contList.length; i++){
		let item = contList[i];
		let splitDate = item.calDateMonth.split("-");

		contMonthTotal[parseInt(splitDate[1]) - 1] = item.calAmtTotal;
	}

	for(let i = 0; i < contMonthTotal.length; i++){
		let item = contMonthTotal[i];
		
		if(i == 0) contMonthCalTotal[i] = item;
		else contMonthCalTotal[i] = contMonthCalTotal[i - 1] + item;
	}

	for(let i = 0; i < contTypeList.length; i++){
		let item = contTypeList[i];
		let splitDate = item.calDateMonth.split("-");

		contTypeMonthTotal[parseInt(splitDate[1]) - 1] = item.calAmtTotal;
	}

	storage.goalMonthTotal = goalMonthTotal;
	storage.goalMonthCalTotal = goalMonthCalTotal;
	storage.contMonthTotal = contMonthTotal;
	storage.contMonthCalTotal = contMonthCalTotal;
	storage.contTypeMonthTotal = contTypeMonthTotal;
}

// function addChart_1(){
// 	let now, url, method, data, type, chart_0_body;
// 	chart_0_body = document.getElementsByClassName("chart_0_body");

// 	if(chart_0_body !== undefined){
// 		now = new Date();
// 		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
// 		url = "/api/accounting/statistics/sales/" + now;
// 		method = "get";
// 		type = "detail";
	
// 		crud.defaultAjax(url, method, data, type, chartSuccess_1, chartError_1);
// 	}
// }

// function chartSuccess_1(result){
// 	let chart_0, dataArray = [], temp = 0, salesArray = [];
// 	chart_0 = document.getElementById('chart_0').getContext('2d');

// 	for(let i = 0; i < 12; i++){
// 		if(result[i] === undefined){
// 			dataArray.push(0);
// 		}else{
// 			dataArray.push(result[i].sales);
// 		}
// 	}

// 	for(let i = 0; i < dataArray.length; i++){
// 		temp += dataArray[i] / 10;
// 		salesArray.push(temp);
// 	}

// 	new Chart(chart_0, {
// 		type: "bar",
// 		data: {
// 			labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
// 			datasets: [
// 				{
// 					type: "line",
// 					label: "누적목표",
// 					data: storage.accMonthTarget,
// 					fill: false,
// 					lineTension: 0,
// 					backgroundColor: "#A566FF",
// 					borderColor: "#A566FF",
// 				},
// 				{
// 					type: "line",
// 					label: "누적매출",
// 					data: salesArray,
// 					fill: false,
// 					lineTension: 0,
// 					backgroundColor: "#F15F5F",
// 					borderColor: "#F15F5F",
// 				},
// 				{
// 					label: "월별목표",
// 					data: storage.monthTarget,
// 					backgroundColor: "#5f46c6", 
// 					borderColor: "#5f46c6",
// 					borderWidth: 3,
// 					radius: 0,
// 				},
// 				{
// 					label: "월별매출",
// 					data: dataArray,
// 					backgroundColor: "#76e3f1",
// 					borderColor: "#76e3f1",
// 					borderWidth: 3,
// 					radius: 0,
// 				},
// 			],
// 		},
// 		options: {	
// 			responsive: false,
// 			scales: {
// 			  	yAxes: [{
// 					ticks: {
// 						beginAtZero: true,
// 						callback: function(value, index) {
// 							if(value.toString().length > 8){
// 								return (Math.floor(value / 100000000)).toLocaleString("ko-KR") + " (억원)";
// 							}else if(value.toString().length > 4){
// 								return (Math.floor(value / 10000)).toLocaleString("ko-KR") + " (만원)";
// 							}else{
// 								return value.toLocaleString("ko-KR"); 
// 							}
// 						}
// 					},
// 				}]
// 		  	},
// 			tooltips: { 
// 				callbacks: { 
// 					label: function(tooltipItem, data) {
// 						if(tooltipItem.datasetIndex == 2 || tooltipItem.datasetIndex == 3){
// 							return " " + (tooltipItem.yLabel * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
// 						}else{
// 							return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
// 						}
// 					} 
// 				 },
// 			},
// 		}
// 	});
// }

function addChart_1(){
	let chart_0;
	chart_0 = document.getElementById('chart_0').getContext('2d');
	// for(let i = 0; i < 12; i++){
	// 	if(result[i] === undefined){
	// 		dataArray.push(0);
	// 	}else{
	// 		dataArray.push(result[i].sales);
	// 	}
	// }

	// for(let i = 0; i < dataArray.length; i++){
	// 	temp += dataArray[i] / 10;
	// 	salesArray.push(temp);
	// }

	new Chart(chart_0, {
		type: "bar",
		data: {
			labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			datasets: [
				{
					type: "line",
					label: "누적목표",
					data: storage.goalMonthCalTotal,
					yAxisID: "y-left",
					fill: false,
					lineTension: 0,
					backgroundColor: "#A566FF",
					borderColor: "#A566FF",
				},
				{
					type: "line",
					label: "누적매출",
					data: storage.contMonthCalTotal,
					yAxisID: "y-left",
					fill: false,
					lineTension: 0,
					backgroundColor: "#F15F5F",
					borderColor: "#F15F5F",
				},
				{
					label: "월별목표",
					data: storage.goalMonthTotal,
					yAxisID: "y-right",
					backgroundColor: "#5f46c6", 
					borderColor: "#5f46c6",
					borderWidth: 3,
					radius: 0,
				},
				{
					label: "월별매출",
					data: storage.contMonthTotal,
					yAxisID: "y-right",
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
			  	yAxes: [
					{
						id: "y-left",
						position: "right",
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
					},
					{
						id: "y-right",
						position: "left",
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
					},
				]
		  	},
			tooltips: { 
				mode: 'index',
				callbacks: { 
					label: function(tooltipItem, data) {
						// if(tooltipItem.datasetIndex == 2 || tooltipItem.datasetIndex == 3){
						// 	return " " + (tooltipItem.yLabel * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						// }else{
						// 	return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						// }

						return " " + (tooltipItem.yLabel).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
					} 
				 },
			},
		}
	});
}

function chartError_1(){
	alert("첫번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

// function addChart_2(){
// 	let now, url, method, data, type, chart_1_body;
// 	chart_1_body = document.getElementsByClassName("chart_1_body");
	
// 	if(chart_1_body !== undefined){
// 		now = new Date();
// 		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
// 		url = "/api/accounting/statistics/sales/" + now;
// 		method = "get";
// 		type = "detail";
	
// 		crud.defaultAjax(url, method, data, type, chartSuccess_2, chartError_2);
// 	}
// }

// function chartSuccess_2(result){
// 	let chart_1, infoHtml = "", nowDate, month, monthTarget;
// 	chart_1 = document.getElementById('chart_1').getContext('2d');
// 	nowDate = new Date();
// 	month = nowDate.getMonth();
// 	monthTarget = (result[month] === undefined) ? 0 : result[month].sales;

// 	new Chart(chart_1, {
// 		type: "doughnut",
// 		data: {
// 			labels: ["달성률", "미달성률"],
// 			datasets: [
// 				{
// 					data: [0, 100],
// 					backgroundColor: [
// 						"#ff5377",
// 						"#95c1e6"
// 					],
// 					radius:0,
// 					borderWidth: 1,
// 				},
// 			],
// 		},
// 		options: {
// 			scales: {
// 				y: {
// 					beginAtZero: true
// 				}
// 			},
// 		},
// 	});

// 	infoHtml = "<div>목표 0</div>";
// 	infoHtml += "<div>매출 0</div>";
// 	infoHtml += "<div>달성률 0.00%<div>";
// 	infoHtml += "<hr />";
// 	infoHtml += "<div>-0</div>";
// 	chart_1.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
// }

// function addChart_2(){
// 	let chart_1, infoHtml = "", nowMonth;
// 	chart_1 = document.getElementById('chart_1').getContext('2d');
// 	nowMonth = new Date().getMonth();
// 	let attainPercent = (storage.contMainMonthTotal[nowMonth] / storage.goalMonthTotal[nowMonth] * 100).toFixed(2);
// 	let notAttainPercent = (100 - attainPercent).toFixed(2);

// 	new Chart(chart_1, {
// 		type: "doughnut",
// 		data: {
// 			labels: ["달성률", "미달성률"],
// 			datasets: [
// 				{
// 					data: [attainPercent, notAttainPercent],
// 					backgroundColor: [
// 						"#ff5377",
// 						"#95c1e6"
// 					],
// 					radius:0,
// 					borderWidth: 1,
// 				},
// 			],
// 		},
// 		options: {
// 			scales: {
// 				y: {
// 					beginAtZero: true
// 				}
// 			},
// 		},
// 	});

// 	infoHtml = "<div>목표 0</div>";
// 	infoHtml += "<div>매출 0</div>";
// 	infoHtml += "<div>달성률 0.00%<div>";
// 	infoHtml += "<hr />";
// 	infoHtml += "<div>-0</div>";
// 	chart_1.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
// }

function addChart_2(){
	let chart_1;
	chart_1 = document.getElementById('chart_1').getContext('2d');
	// for(let i = 0; i < 12; i++){
	// 	if(result[i] === undefined){
	// 		dataArray.push(0);
	// 	}else{
	// 		dataArray.push(result[i].sales);
	// 	}
	// }

	// for(let i = 0; i < dataArray.length; i++){
	// 	temp += dataArray[i] / 10;
	// 	salesArray.push(temp);
	// }

	new Chart(chart_1, {
		type: "horizontalBar",
		data: {
			labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			datasets: [
				{
					label: "월별 유지보수 매출",
					data: storage.contTypeMonthTotal,
					backgroundColor: "#5f46c6",
					borderColor: "#5f46c6",
					borderWidth: 3,
					radius: 0,
				},
			],
		},
		options: {
			responsive: false,
			scales: {
			  	xAxes: [
					{
						position: "bottom",
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
					}
				]
		  	},
			tooltips: { 
				callbacks: { 
					label: function(tooltipItem, data) {
						// if(tooltipItem.datasetIndex == 2 || tooltipItem.datasetIndex == 3){
						// 	return " " + (tooltipItem.yLabel * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						// }else{
						// 	return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						// }

						return " " + (tooltipItem.xLabel).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
					} 
				 },
			},
		}
	});
}

function chartError_2(){
	alert("두번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

// function addChart_3(){
// 	let now, url, method, data, type, chart_2_body;
// 	chart_2_body = document.getElementsByClassName("chart_2_body");
	
// 	if(chart_2_body !== undefined){
// 		now = new Date();
// 		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
// 		url = "/api/accounting/statistics/sales/" + now;
// 		method = "get";
// 		type = "detail";
	
// 		crud.defaultAjax(url, method, data, type, chartSuccess_3, chartError_3);
// 	}
// }

// function chartSuccess_3(result){
// 	let chart_2, infoHtml = "", nowDate, month, monthTarget;
// 	chart_2 = document.getElementById('chart_2').getContext('2d');
// 	nowDate = new Date();
// 	month = nowDate.getMonth();
// 	monthTarget = (result[month] === undefined) ? 0 : result[month].sales;

// 	let data1 = isNaN((monthTarget / storage.monthTarget[month] * 100).toFixed(2)) ? 0 : (monthTarget / storage.monthTarget[month] * 100).toFixed(2);
// 	let data2 = isNaN((100 - (monthTarget / storage.monthTarget[month] * 100).toFixed(2))) ? 100 : (100 - (monthTarget / storage.monthTarget[month] * 100).toFixed(2));

// 	new Chart(chart_2, {
// 		type: "doughnut",
// 		data: {
// 			labels: ["달성률", "미달성률"],
// 			datasets: [
// 				{
// 					data: [data1, data2],
// 					backgroundColor: [
// 						"#31cca2",
// 						"#95c1e6"
// 					],
// 					radius:0,
// 					borderWidth: 1,
// 				},
// 			],
// 		},
// 		options: {
// 			scales: {
// 				y: {
// 					beginAtZero: true
// 				}
// 			},
// 		},
// 	});

// 	infoHtml = "<div>목표 " + (parseInt(storage.monthTarget[month])).toLocaleString("en-US") + "</div>";
// 	infoHtml += "<div>매출 " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";

// 	if(isNaN((monthTarget / storage.monthTarget[month] * 100).toFixed(2))){
// 		infoHtml += "<div>달성률 0.00%<div>";
// 	}else{
// 		infoHtml += "<div>달성률 " + (monthTarget / storage.monthTarget[month] * 100).toFixed(2) + "%<div>";
// 	}

// 	infoHtml += "<hr />";
// 	infoHtml += "<div>-" + parseInt(storage.monthTarget[month] - monthTarget).toLocaleString("en-US") + "</div>";
// 	chart_2.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
// }

function addChart_3(){
	let chart_2, infoHtml = "", nowDate, month, monthTarget;
	chart_2 = document.getElementById('chart_2').getContext('2d');
	nowMonth = new Date().getMonth();
	// nowMonth = 11;
	
	let attainPercent = (isNaN((storage.contMonthTotal[nowMonth] / (storage.goalMonthTotal[nowMonth] * 100)).toFixed(2)) || !isFinite((storage.contMonthTotal[nowMonth] / (storage.goalMonthTotal[nowMonth] * 100)))) ? 0 : (storage.contMonthTotal[nowMonth] / (storage.goalMonthTotal[nowMonth] * 100)).toFixed(2);
	let notAttainPercent = (100 - attainPercent).toFixed(2);
	notAttainPercent = (notAttainPercent > 100) ? 100 : notAttainPercent;

	new Chart(chart_2, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [attainPercent, notAttainPercent],
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

	attainPercent = isNaN(attainPercent) ? 0 : attainPercent;

	infoHtml = "<div>목표 " + (parseInt(storage.goalMonthTotal[nowMonth])).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>매출 " + parseInt(storage.contMonthTotal[nowMonth]).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>달성률 " + attainPercent + "%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>" + parseInt(storage.contMonthTotal[nowMonth] - storage.goalMonthTotal[nowMonth]).toLocaleString("en-US") + "</div>";
	chart_2.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_3(){
	alert("세번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

// function addChart_4(){
// 	let now, url, method, data, type, chart_3_body;
// 	chart_3_body = document.getElementsByClassName("chart_3_body");
	
// 	if(chart_3_body !== undefined){
// 		now = new Date();
// 		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
// 		url = "/api/accounting/statistics/sales/" + now;
// 		method = "get";
// 		type = "detail";
	
// 		crud.defaultAjax(url, method, data, type, chartSuccess_4, chartError_4);
// 	}
// }

// function chartSuccess_4(result){
// 	let chart_3, infoHtml = "", dataArray = [], monthTarget = 0;
// 	chart_3 = document.getElementById('chart_3').getContext('2d');

// 	for(let i = 0; i < 12; i++){
// 		if(result[i] === undefined){
// 			dataArray.push(0);
// 		}else{
// 			dataArray.push(result[i].sales);
// 		}
// 	}

// 	for(let i = 0; i < dataArray.length; i++){
// 		monthTarget += dataArray[i];
// 	}

// 	let data1 = isNaN((monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2)) ? 0 : (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2);
// 	let data2 = isNaN((100 - (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2))) ? 100 : (100 - (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2));

// 	new Chart(chart_3, {
// 		type: "doughnut",
// 		data: {
// 			labels: ["달성률", "미달성률"],
// 			datasets: [
// 				{
// 					data: [data1, data2],
// 					backgroundColor: [
// 						"#31cca2",
// 						"#95c1e6"
// 					],
// 					radius:0,
// 					borderWidth: 1,
// 				},
// 			],
// 		},
// 		options: {
// 			scales: {
// 				y: {
// 					beginAtZero: true
// 				}
// 			},
// 		},
// 	});

// 	infoHtml = "<div>목표 " + (parseInt(storage.accMonthTarget[11] * 10)).toLocaleString("en-US") + "</div>";
// 	infoHtml += "<div>매출 " + parseInt(monthTarget).toLocaleString("en-US") + "</div>";

// 	if(isNaN((monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2))){
// 		infoHtml += "<div>달성률 0.00%<div>";
// 	}else{
// 		infoHtml += "<div>달성률 " + (monthTarget / (storage.accMonthTarget[11] * 10) * 100).toFixed(2) + "%<div>";
// 	}

// 	infoHtml += "<hr />";
// 	infoHtml += "<div>-" + parseInt((storage.accMonthTarget[11] * 10) - monthTarget).toLocaleString("en-US") + "</div>";
// 	chart_3.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
// }

// function addChart_4(){
// 	let now, url, method, data, type, chart_3_body;
// 	chart_3_body = document.getElementsByClassName("chart_3_body");
	
// 	if(chart_3_body !== undefined){
// 		now = new Date();
// 		now = now.toISOString().substring(0, 10).replaceAll("-", "");
	
// 		url = "/api/accounting/statistics/sales/" + now;
// 		method = "get";
// 		type = "detail";
	
// 		crud.defaultAjax(url, method, data, type, chartSuccess_4, chartError_4);
// 	}
// }

function addChart_4(){
	let chart_3, infoHtml = "", dataArray = [], monthTarget = 0;
	chart_3 = document.getElementById('chart_3').getContext('2d');
	nowMonth = new Date().getMonth();
	// nowMonth = 11;
	let attainPercent = (isNaN((storage.contMonthCalTotal[nowMonth] / (storage.goalMonthCalTotal[nowMonth] * 100)).toFixed(2)) || !isFinite((storage.contMonthCalTotal[nowMonth] / (storage.goalMonthCalTotal[nowMonth] * 100)))) ? 0 : (storage.contMonthCalTotal[nowMonth] / (storage.goalMonthCalTotal[nowMonth] * 100)).toFixed(2);
	let notAttainPercent = (100 - attainPercent).toFixed(2);
	notAttainPercent = (notAttainPercent > 100) ? 100 : notAttainPercent;

	new Chart(chart_3, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [attainPercent, notAttainPercent],
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

	attainPercent = isNaN(attainPercent) ? 0 : attainPercent;

	infoHtml = "<div>목표 " + parseInt(storage.goalMonthCalTotal[nowMonth]).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>매출 " + parseInt(storage.contMonthCalTotal[nowMonth]).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>달성률 " + attainPercent + "%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>" + parseInt(storage.contMonthCalTotal[nowMonth] - storage.goalMonthCalTotal[nowMonth]).toLocaleString("en-US") + "</div>";
	chart_3.canvas.parentNode.getElementsByClassName("chartInfo")[0].innerHTML = infoHtml;
}

function chartError_4(){
	alert("네번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

// function addChart_5(){
// 	let chart_4;
// 	chart_4 = document.getElementById('chart_4').getContext('2d');
// 	let labelDatas = [];
// 	let datas = [];

// 	for(let i = 0; i < storage.contTypeTotal.length; i++){
// 		let item = storage.contTypeTotal[i];
// 		labelDatas.push(item.contType);
// 		datas.push(item.getCount);
// 	}

// 	new Chart(chart_4, {
// 		type: "pie",
// 		data: {
// 			labels: labelDatas,
// 			datasets: [
// 				{
// 					data: datas,
// 					backgroundColor: [
// 						"#29cea6",
// 						"#2795f7",
// 						"#f7d766",
// 						"#ff5377",
// 						"#7952e9",
// 						"#d9d9d9",
// 					]
// 				},
// 			],
// 		},
// 		options: {
// 			responsive: false,
// 			layout:{
// 				padding: {
// 					top: 50,
// 				}
// 			},
// 			scales: {
// 				y: {
// 					beginAtZero: true
// 				}
// 			}
// 		},
// 	});
// }

function addChart_5(){
	let chart_4;
	chart_4 = document.getElementById('chart_4').getContext('2d');
	let labelDatas = [];
	let datas = [];
	let colors = [];

	for(let i = 0; i < storage.contCategoryList.length; i++){
		let item = storage.contCategoryList[i];
		
		if(item.value > 0) {
			labelDatas.push(item.label);
			datas.push(item.value)
		}
	}

	for(let i = 0; i < labelDatas.length; i++){
		let randomColor = "#" + Math.round(Math.random() * 0xffffff).toString(16);
		colors.push(randomColor);
	}

	if(labelDatas.length == 0){
		labelDatas.push("조회된 데이터 없음");
		datas.push(1);
	}

	new Chart(chart_4, {
		type: "pie",
		data: {
			labels: labelDatas,
			datasets: [
				{
					data: datas,
					backgroundColor: colors,
				},
			],
		},
		options: {
			responsive: false,
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
	container = document.getElementsByClassName("notice_container")[0];
	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc = "", dataJob, data = [], disDate, setDate, dataFunc = [];
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
						"align" : "center",
					},
					{
						"title" : "작성자",
						"align" : "center",
					},
				];

				
				if (result === "" || result.length == 0) {
					str = [
						{
							"setData": undefined,
							"align": "center",
							"col": 3,
						},
					];
					
					data.push(str);
				} else {
					if(result.length < gridListLength){
						gridListLength = result.length;
					}

					for (let i = 0; i < gridListLength; i++) {
						disDate = CommonDatas.dateDis(new Date(result[i].regDate).getTime());
						setDate = CommonDatas.dateFnc(disDate, "mm-dd");
	
						str = [
							{
								"setData": setDate,
								"align" : "center",
							},
							{
								"setData": result[i].noticeTitle,
								"align" : "left",
							},
							{
								"setData": storage.user[result[i].userNo].userName,
								"align" : "center",
							},
						];
	
						dataFunc.push("rootDetailView(\"notice\", this);");
						ids.push(result[i].noticeNo);
						data.push(str);
					}
	
				}

				CommonDatas.createGrid(container, header, data, ids, dataJob, dataFunc, idName);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	});
}

function getScheduleList() {
	let url, container, idName, gridListLength = 8, date;
	
	idName = "schedule_body";
	container = document.getElementsByClassName("schedule_container")[0];
	date = new Date().getTime();
	url = "/api/schedule/calendar";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [], dataFunc = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);
				result = result.sort(function(a, b){return new Date(b.regDatetime).getTime() - new Date(a.regDatetime).getTime();});

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
						"align" : "center",
					},
					{
						"title" : "일정설명",
						"align" : "center",
					},
					{
						"title" : "담당자",
						"align" : "center",
					},
				];

				if (result === "" || result.length == 0) {
					str = [
						{
							"setData": undefined,
							"align": "center",
							"col": 6,
						},
					];
					
					data.push(str);
				} else {
					if(result.length < gridListLength){
						gridListLength = result.length;
					}
	
					for (let i = 0; i < gridListLength; i++) {
						let title, userName, fromDate, fromSetDate, toDate, toSetDate, desc, disDate;
						
						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "없음" : result[i].title;
						userName = (result[i].userNo == 0 || result[i].userNo === null || result[i].userNo === undefined) ? "없음" : storage.user[result[i].userNo].userName;
						desc = (result[i].desc === null || result[i].desc === "" || result[i].desc === undefined) ? "없음" : result[i].desc;
						desc = desc.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<br />", "");
	
						disDate = CommonDatas.dateDis(new Date(result[i].regDatetime).getTime());
						disDate = CommonDatas.dateFnc(disDate, "mm-dd");
						
						fromDate = CommonDatas.dateDis(new Date(result[i].schedFrom).getTime());
						fromSetDate = CommonDatas.dateFnc(fromDate, "mm-dd");
						
						toDate = CommonDatas.dateDis(new Date(result[i].schedTo).getTime());
						toSetDate = CommonDatas.dateFnc(toDate, "mm-dd");
				
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
								"setData": storage.code.etc[result[i].schedType],
								"align" : "center",
							},
							{
								"setData": title,
								"align" : "left",
							},
							{
								"setData": desc,
								"align" : "left",
							},
							{
								"setData": userName,
								"align" : "center",
							},
						];
						
						dataFunc.push("rootDetailView(\"schedule\", this);");
						ids.push(result[i].no);
						dataJob.push(storage.code.etc[result[i].schedType]);
						data.push(str);
					}
				}

				CommonDatas.createGrid(container, header, data, ids, dataJob, dataFunc, idName);
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
// 						let job, title, userNo, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "sales" : "영업일정";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
// 						userNo = (result[i].userNo == 0 || result[i].userNo === null || result[i].userNo === undefined) ? "없음" : storage.user[result[i].userNo].userName;
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
// 								"setData": userNo,
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
// 						let job, title, userNo, fromDate, fromSetDate, toDate, toSetDate, content;
						
// 						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "tech" : "기술지원";
						
// 						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
// 						userNo = (result[i].userNo == 0 || result[i].userNo === null || result[i].userNo === undefined) ? "없음" : storage.user[result[i].userNo].userName;
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
// 								"setData": userNo,
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
	container = document.getElementsByClassName("sopp_container")[0];
	url = "/api/sopp";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [], dataFunc = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);
				
				for(let i = 0; i < result.length; i++){
					let item = result[i];

					for(let key in item){
						if(key === "soppStatus"){
							item[key] = Number(item[key])
						}
					}
				}

				storage.rootSoppAllList = result;
				storage.rootSoppList = [];
				
				CommonDatas.disListSet(storage.rootSoppAllList, storage.rootSoppList, 3, "regDatetime");

				header = [
					{
						"title" : "등록일",
						"align" : "center",
					},
					{
						"title" : "영업기회명",
						"align" : "center",
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
						"align" : "center",
					},
					{
						"title" : "진행단계",
						"align" : "center",
					},
				];

				if(storage.rootSoppList.length < gridListLength){
					gridListLength = storage.rootSoppList.length;
				}

				for (let i = 0; i < gridListLength; i++) {
					let soppType, cntrctMth, soppTitle, custName, endUser, userName, soppTargetAmt, soppStatus;
					
					disDate = CommonDatas.dateDis(new Date(storage.rootSoppList[i].regDatetime).getTime());
					setDate = CommonDatas.dateFnc(disDate, "mm-dd");

					soppType = (storage.rootSoppList[i].soppType === null || storage.rootSoppList[i].soppType === "") ? "없음" : storage.code.etc[storage.rootSoppList[i].soppType];
					cntrctMth = (storage.rootSoppList[i].cntrctMth === null || storage.rootSoppList[i].cntrctMth === "") ? "없음" : storage.code.etc[storage.rootSoppList[i].cntrctMth];
					soppTitle = (storage.rootSoppList[i].soppTitle === null || storage.rootSoppList[i].soppTitle === "") ? "제목 없음" : storage.rootSoppList[i].soppTitle;
					custName = (storage.rootSoppList[i].custNo === null || storage.rootSoppList[i].custNo == 0) ? "없음" : storage.customer[storage.rootSoppList[i].custNo].custName;
					buyrName = (storage.rootSoppList[i].buyrNo === null || storage.rootSoppList[i].buyrNo == 0) ? "없음" : storage.customer[storage.rootSoppList[i].buyrNo].custName;
					userName = (storage.rootSoppList[i].userNo === null || storage.rootSoppList[i].userNo == 0) ? "없음" : storage.user[storage.rootSoppList[i].userNo].userName;
					soppTargetAmt = (storage.rootSoppList[i].soppTargetAmt === null || storage.rootSoppList[i].soppTargetAmt == 0) ? 0 : CommonDatas.numberFormat(storage.rootSoppList[i].soppTargetAmt);
					soppStatus = (storage.rootSoppList[i].soppStatus === null || storage.rootSoppList[i].soppStatus === "") ? "없음" : storage.code.etc[storage.rootSoppList[i].soppStatus];
			
					str = [
						{
							"setData": setDate,
							"align" : "center",
						},
						{
							"setData": soppTitle,
							"align" : "left",
						},
						{
							"setData": userName,
							"align" : "center",
						},
						{
							"setData": soppType,
							"align" : "center",
						},
						{
							"setData": cntrctMth,
							"align" : "center",
						},
						{
							"setData": custName,
							"align" : "center",
						},
						{
							"setData": buyrName,
							"align" : "center",
						},
						{
							"setData": soppTargetAmt,
							"align" : "right",
						},
						{
							"setData": soppStatus,
							"align" : "center",
						},
					];

					dataFunc.push("rootDetailView(\"sopp\", this);");
					ids.push(storage.rootSoppList[i].soppNo);
					data.push(str);
				}
				CommonDatas.createGrid(container, header, data, ids, dataJob, dataFunc, idName);
			} else {
				msg.set("등록된 영업기회가 없습니다");
			}
		}
	});
}

function getContractList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "contract_body";
	container = document.getElementsByClassName("contract_container")[0];
	url = "/api/cont";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let header, str, ids = [], fnc, dataJob = [], data = [], dataFunc = [];
			if (result.result === "ok") {
				result = cipher.decAes(result.data);
				result = JSON.parse(result);
				storage.rootContAllList = result;
				storage.rootContList = [];
				
				CommonDatas.disListSet(storage.rootContAllList, storage.rootContList, 3, "regDatetime");

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
						"align" : "center",
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
						"align" : "center",
					},
					{
						"title" : "매출이익",
						"align" : "center",
					},
					{
						"title" : "발주일자",
						"align" : "center",
					},
				];

				if(storage.rootContList.length < gridListLength){
					gridListLength = storage.rootContList.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					let contType, cntrctMth, contTitle, buyrName, contAmt, net_profit, userName, startMaintenance, endMaintenance, contOrddate, setDate;
		
					contType = (storage.rootContList[i].contType === null || storage.rootContList[i].contType === "") ? "없음" : storage.code.etc[storage.rootContList[i].contType];
					cntrctMth = (storage.rootContList[i].cntrctMth === null || storage.rootContList[i].cntrctMth === "") ? "없음" : storage.code.etc[storage.rootContList[i].cntrctMth];
					contTitle = (storage.rootContList[i].contTitle === null || storage.rootContList[i].contTitle === "") ? "제목 없음" : storage.rootContList[i].contTitle;
					buyrName = (storage.rootContList[i].buyrNo === null || storage.rootContList[i].buyrNo == 0) ? "없음" : storage.customer[storage.rootContList[i].buyrNo].custName;
					contAmt = (storage.rootContList[i].contAmt == 0 || storage.rootContList[i].contAmt === null) ? 0 : CommonDatas.numberFormat(storage.rootContList[i].contAmt);
					net_profit = (storage.rootContList[i].net_profit == 0 || storage.rootContList[i].net_profit === null) ? 0 : CommonDatas.numberFormat(storage.rootContList[i].net_profit);
					userName = (storage.rootContList[i].userName === null || storage.rootContList[i].userName == 0) ? "없음" : storage.user[storage.rootContList[i].userNo].userName;
					
					if(cntrctMth === "유지보수"){
						disDate = CommonDatas.dateDis(new Date(storage.rootContList[i].paymaintSdate).getTime());
						startMaintenance = (storage.rootContList[i].paymaintSdate === null || storage.rootContList[i].paymaintSdate === "") ? "" : CommonDatas.dateFnc(disDate, "yy-mm-dd");
				
						disDate = CommonDatas.dateDis(new Date(storage.rootContList[i].paymaintEdate).getTime());
						endMaintenance = (storage.rootContList[i].paymaintEdate === null || storage.rootContList[i].paymaintEdate === "") ? "" : CommonDatas.dateFnc(disDate, "yy-mm-dd");
					}else{
						disDate = CommonDatas.dateDis(new Date(storage.rootContList[i].freemaintSdate).getTime());
						startMaintenance = (storage.rootContList[i].freemaintSdate === null || storage.rootContList[i].freemaintSdate === "") ? "" : CommonDatas.dateFnc(disDate, "yy-mm-dd");
				
						disDate = CommonDatas.dateDis(new Date(storage.rootContList[i].freemaintEdate).getTime());
						endMaintenance = (storage.rootContList[i].freemaintEdate === null || storage.rootContList[i].freemaintEdate === "") ? "" : CommonDatas.dateFnc(disDate, "yy-mm-dd");
					}
					
					disDate = CommonDatas.dateDis(storage.rootContList[i].contOrddate);
					contOrddate = CommonDatas.dateFnc(disDate, "mm-dd");

					disDate = CommonDatas.dateDis(new Date(storage.rootContList[i].regDatetime).getTime());
					setDate = CommonDatas.dateFnc(disDate, "mm-dd");

					str = [
						{
							"setData": setDate,
							"align" : "center",
						},
						{
							"setData": startMaintenance + " ~ " + endMaintenance,
							"align" : "center",
						},
						{
							"setData": contTitle,
							"align" : "left",
						},
						{
							"setData": userName,
							"align" : "center",
						},
						{
							"setData": contType,
							"align" : "center",
						},
						{
							"setData": cntrctMth,
							"align" : "center",
						},
						{
							"setData": buyrName,
							"align" : "center",
						},
						{
							"setData": contAmt,
							"align" : "right",
						},
						{
							"setData": net_profit,
							"align" : "right",
						},
						{
							"setData": contOrddate,
							"align" : "center",
						},
					];

					dataFunc.push("rootDetailView(\"cont\", this);");
					ids.push(storage.rootContList[i].contNo);
					data.push(str);
				}
				CommonDatas.createGrid(container, header, data, ids, dataJob, dataFunc, idName);
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
	// let nowDate, nowYear;
	// nowDate = new Date();
	// nowYear = nowDate.getFullYear();

	// $.ajax({
	// 	url: "/api/system/goal/" + nowYear,
	// 	method: "get",
	// 	dataType: "json",
	// 	contentType: "text/plain",
	// 	success: (result) => {
	// 		let temp = 0;
	// 		result = cipher.decAes(result.data);
	// 		result = JSON.parse(result);
	// 		storage.monthTarget = result.all;
	// 		storage.accMonthTarget = [];

	// 		for(let i = 0; i < storage.monthTarget.length; i++){
	// 			temp += storage.monthTarget[i] / 10;
	// 			storage.accMonthTarget.push(temp);
	// 		}
	// 	}
	// });

	axios.get("/api/sales/goal").then((response) => {
		if (response.data.result === "ok") {
			storage.rootGoalList = [];
			let result;
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);

			for(let i = 0; i < result.length; i++){
				let item = result[i];

				if(item.targetYear != null){
					storage.rootGoalList.push(item);
				}else{
					let datas = {
						"userNo": item.userNo,
						"compNo": item.compNo,
						"mm01": 0,
						"mm02": 0,
						"mm03": 0,
						"mm04": 0,
						"mm05": 0,
						"mm06": 0,
						"mm07": 0,
						"mm08": 0,
						"mm09": 0,
						"mm10": 0,
						"mm11": 0,
						"mm12": 0,
					}

					storage.rootGoalList.push(datas);
				}
			}
		}
	}).catch((error) => {
		msg.set("영업목표 데이터 에러 입니다.\n" + error);
		console.log(error);
	})
}