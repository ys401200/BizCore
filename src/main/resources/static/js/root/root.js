$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(getNoticeList, 1000);
		window.setTimeout(getScheduleList, 1000);
		window.setTimeout(getSalesList, 1000);
		window.setTimeout(getTechList, 1000);
		window.setTimeout(getSoppList, 1000);
		window.setTimeout(getContractList, 1000);
		window.setTimeout(addChart(), 1000);
	}else{
		window.setTimeout(getNoticeList, 200);
		window.setTimeout(getScheduleList, 200);
		window.setTimeout(getSalesList, 200);
		window.setTimeout(getTechList, 200);
		window.setTimeout(getSoppList, 200);
		window.setTimeout(getContractList, 200);
		window.setTimeout(addChart(), 200);
	}

	// setTimeout(() => {
	// 	enableDragSort("gridNoticeList");
	// }, 300);
});

function getNoticeList() {
	let url, dataArray = [], headerArray, container, idName, gridListLength = 8;
	
	idName = "bodyNotice";
	container = $(".gridNoticeList");
	headerArray = [
		{
			"title" : "번호",
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
		{
			"title" : "등록일",
			"align" : "center",
		}
	];

	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list, disDate, setDate, str, ids = [], fnc;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				let result = JSON.parse(list);
				for(let i = 0; i < 8; i++){
					disDate = dateDis(result[i].created, result[i].modified);
					setDate = dateFnc(disDate);
					str = [
						{
							"setData": result[i].no,
						},
						{
							"setData": result[i].title,
						},
						{
							"setData": storage.user[result[i].writer].userName,
						},
						{
							"setData": setDate,
						}
					];

					fnc = "noticeDetailView(this);";
					ids.push(result[i].no);
					dataArray.push(str);
				}
				
				createGrid(container, headerArray, dataArray, ids, fnc, idName);
			} else {
				msg.set("등록된 공지사항이 없습니다");
			}
		}
	});

}

function getScheduleList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "bodySched";
	container = $(".gridScheduleList");
	url = "/api/schedule/calendar/personal";

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
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "일정설명",
						"align" : "left",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					if(result[i].job === "schedule"){
						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "schedule" : "기타일정";
				
						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
						
						fromDate = dateDis(result[i].from);
						fromSetDate = dateFnc(fromDate);
						
						toDate = dateDis(result[i].to);
						toSetDate = dateFnc(toDate);
				
						str = [
							{
								"setData": result[i].no,
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
								"setData": writer,
							},
							{
								"setData": content,
							},
						];

						fnc = "scheduleDetailView(this);";
						ids.push(result[i].no);
						dataJob.push(result[i].job);
						data.push(str);
					}
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

function getSalesList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "bodySales";
	container = $(".gridSalesList");
	url = "/api/schedule/calendar/personal";

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
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "일정설명",
						"align" : "left",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					if(result[i].job === "sales"){
						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "sales" : "영업일정";
						
						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
						
						fromDate = dateDis(result[i].from);
						fromSetDate = dateFnc(fromDate);
						
						toDate = dateDis(result[i].to);
						toSetDate = dateFnc(toDate);
				
						str = [
							{
								"setData": result[i].no,
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
								"setData": writer,
							},
							{
								"setData": content,
							},
						];
				
						fnc = "scheduleDetailView(this);";
						ids.push(result[i].no);
						dataJob.push(result[i].job);
						data.push(str);
					}
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("등록된 영업활동 일정이 없습니다");
			}
		}
	});
}

function getTechList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "bodyTech";
	container = $(".gridTechList");
	url = "/api/schedule/calendar/personal";

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
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "일정설명",
						"align" : "left",
					},
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}
			
				for (let i = 0; i < gridListLength; i++) {
					if(result[i].job === "tech"){
						let job, title, writer, fromDate, fromSetDate, toDate, toSetDate, content;
						
						job = (result[i].job === null || result[i].job === "" || result[i].job === undefined) ? "tech" : "기술지원";
						
						title = (result[i].title === null || result[i].title === "" || result[i].title === undefined) ? "제목 없음" : result[i].title;
						writer = (result[i].writer == 0 || result[i].writer === null || result[i].writer === undefined) ? "없음" : storage.user[result[i].writer].userName;
						content = (result[i].content === null || result[i].content === "" || result[i].content === undefined) ? "내용 없음" : result[i].content;
						
						fromDate = dateDis(result[i].from);
						fromSetDate = dateFnc(fromDate);
						
						toDate = dateDis(result[i].to);
						toSetDate = dateFnc(toDate);
				
						str = [
							{
								"setData": result[i].no,
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
								"setData": writer,
							},
							{
								"setData": content,
							},
						];
				
						fnc = "scheduleDetailView(this);";
						ids.push(result[i].no);
						dataJob.push(result[i].job);
						data.push(str);
					}
				}
				createGrid(container, header, data, ids, dataJob, fnc, idName);
			} else {
				msg.set("등록된 기술지원 일정이 없습니다");
			}
		}
	});
}

function getSoppList() {
	let url, container, idName, gridListLength = 8;
	
	idName = "bodySopp";
	container = $(".gridSoppList");
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
						"title" : "번호",
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
						"title" : "영업기회명",
						"align" : "left",
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
						"title" : "담당자",
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
					{
						"title" : "등록일",
						"align" : "center",
					}
				];

				if(result.length < gridListLength){
					gridListLength = result.length;
				}

				for (let i = 0; i < gridListLength; i++) {
					let soppType, contType, title, customer, endUser, employee, expectedSales, status;
					
					disDate = dateDis(result[i].created, result[i].modified);
					setDate = dateFnc(disDate);

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
							"setData": result[i].no,
						},
						{
							"setData": soppType,
						},
						{
							"setData": contType,
						},
						{
							"setData": title,
						},
						{
							"setData": customer,
						},
						{
							"setData": endUser,
						},
						{
							"setData": employee,
						},
						{
							"setData": expectedSales,
						},
						{
							"setData": status,
						},
						{
							"setData": setDate,
						}
					];

					fnc = "soppDetailView(this);";
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
	
	idName = "bodyContract";
	container = $(".gridContractList");
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
						"title" : "번호",
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
						"title" : "계약명",
						"align" : "left",
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
						"title" : "담당자",
						"align" : "center",
					},
					{
						"title" : "유지보수시작일",
						"align" : "center",
					},
					{
						"title" : "유지보수종료일",
						"align" : "center",
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
					let salesType, contractType, title, endUser, contractAmount, profit, employee, startMaintenance, endMaintenance, saleDate;
		
					salesType = (result[i].salesType === null || result[i].salesType === "") ? "없음" : storage.code.etc[result[i].salesType];
					contractType = (result[i].contractType === null || result[i].contractType === "") ? "없음" : storage.code.etc[result[i].contractType];
					title = (result[i].title === null || result[i].title === "") ? "제목 없음" : result[i].title;
					endUser = (result[i].endUser === null || result[i].endUser == 0) ? "없음" : storage.customer[result[i].endUser].name;
					contractAmount = (result[i].contractAmount == 0 || result[i].contractAmount === null) ? 0 : numberFormat(result[i].contractAmount);
					profit = (result[i].profit == 0 || result[i].profit === null) ? 0 : numberFormat(result[i].profit);
					employee = (result[i].employee === null || result[i].employee == 0) ? "없음" : storage.user[result[i].employee].userName;
					
					if(contractType === "유지보수"){
						disDate = dateDis(result[i].startOfPaidMaintenance);
						startMaintenance = dateFnc(disDate);
				
						disDate = dateDis(result[i].endOfPaidMaintenance);
						endMaintenance = dateFnc(disDate);
					}else{
						disDate = dateDis(result[i].startOfFreeMaintenance);
						startMaintenance = dateFnc(disDate);
				
						disDate = dateDis(result[i].endOfFreeMaintenance);
						endMaintenance = dateFnc(disDate);
					}

					disDate = dateDis(result[i].saleDate);
					saleDate = dateFnc(disDate);

					str = [
						{
							"setData": result[i].no,
						},
						{
							"setData": salesType,
						},
						{
							"setData": contractType,
						},
						{
							"setData": title,
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
							"setData": employee,
						},
						{
							"setData": startMaintenance,
						},
						{
							"setData": endMaintenance,
						},
						{
							"setData": saleDate,
						}
					];

					fnc = "contractDetailView(this);";
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