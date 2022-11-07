$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getWorkReport();
});

function getWorkReport() {
	let url, method, data, type;

	url = "/api/schedule/workreport/personal/";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function drawWorkReportList() {
	let workReportContent, jsonData, html = "", header, disDate, start, end, week, getLastDate, getNextDate, nowDate;
    
    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

	workReportContent = document.getElementsByClassName("workReportContent")[0];

    header = [
        {
            "title": "주차"
        },
        {
            "title": "요일"
        },
        {
            "title": "일정제목"
        },
        {
            "title": "일정내용"
        },
        {
            "title": "일정시작"
        },
        {
            "title": "일정종료"
        },
        {
            "title": "업무일지반영"
        },
    ];

    start = new Date(storage.workReportList.start);
    start = new Date(start.getTime() + 86400000 * 7);
    disDate = dateDis(start);
    start = dateFnc(disDate);

    getLastDate = calDays(start, "last");
    getNextDate = calDays(start, "next");

    html = "<div class='reportBtns'>";
    html += "<div class='reportBtnPrev'>";
    html += "<button type='button' data-date='" + getLastDate + "' onclick='workReportWeekBtn(this);'>이전</button>";
    html += "</div>";
    html += "<div class='reportBtnNext'>";
    html += "<button type='button' data-date='" + getNextDate + "' onclick='workReportWeekBtn(this);'>다음</button>";
    html += "</div>";
    html += "</div>";

    html += "<div class='reportContents'>";
    html += "<div class='reportHeader'>";

    for(let i = 0; i < header.length; i++){
        if(i == 2 || i == 3){
            html += "<div style='justify-content: left;'>" + header[i].title + "</div>";
        }else{
            html += "<div style='justify-content: center;'>" + header[i].title + "</div>";
        }
    }

    html += "</div>";
    
    html += "<div class='reportContent'>";
    
    scheduleDatas = jsonData.schedules.sort(function(a, b){return a.date - b.date;});

    let rowLength = 0;
    for(let i = 0; i < scheduleDatas.length; i++){
        let date = new Date(scheduleDatas[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            rowLength++;
        }
    }

    html += "<div style='grid-row: span " + (rowLength + 1) + "; justify-content: center;'>" + storage.workReportList.week + "</div>";
    
    for(let i = 0; i < scheduleDatas.length; i++){
        let date = new Date(scheduleDatas[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            week = calWeekDay(scheduleDatas[i].date);
            html += "<div class=\"rowSpanColumn\" style='justify-content: center;'>" + week + "</div>";
            html += "<div style='justify-content: left;'>" + "<a href=\"#\" data-id=\"" + scheduleDatas[i].no + "\" data-job=\"" + scheduleDatas[i].job + "\" onclick=\"reportDetailView(this);\">" + scheduleDatas[i].title + "</a></div>";
            html += "<div style='justify-content: left;'>" + scheduleDatas[i].content + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            
            if(scheduleDatas[i].report){
                html += "<div style='justify-content: center;'><input class='schedCheck' type='checkbox' data-id='" + scheduleDatas[i].no + "' data-job='" + scheduleDatas[i].job + "' checked></div>"; 
            }else{
                html += "<div style='justify-content: center;'><input class='schedCheck' type='checkbox' data-id='" + scheduleDatas[i].no + "' data-job='" + scheduleDatas[i].job + "'></div>";
            }
        }
    }
    html += "<div style='justify-content: center;'>추가기재사항</div>";
    html += "<div style='grid-column: span 4'>";
    html += "<textarea id='currentWeek' style='width: -webkit-fill-available;'>" + jsonData.previousWeek + "</textarea>";
    html += "</div>";

    if(jsonData.previousWeekCheck){
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck' checked></div>"; 
    }else{
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck'></div>";
    }

    html += "</div>";
    html += "</div>";

    workReportContent.style.display = "none";
    workReportContent.innerHTML = html;
    gridSetRowSpan("rowSpanColumn");
    workReportContent.style.display = "block";

    nowDate = new Date();
    nowDate = nowDate.toISOString().substring(0, 10).replaceAll("-", "");

    if($("#reportInsertBtn").attr("onclick") === undefined){
        $("#reportInsertBtn").attr("onclick", "reportInsert(" + nowDate + ")");
    }

    ckeditor.config.readOnly = false;
    window.setTimeout(setEditor, 100);
}

function reportDetailView(e){
	let id, job, url, method, data, type;

	id = $(e).data("id");
	job = $(e).data("job");
	url = "/api/schedule/" + job + "/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, reportSuccessView, reportErrorView);
}

function reportSuccessView(result){
	let html, title, dataArray, notIdArray, datas, defaultFormLine;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	dataArray = reportUpdateForm(result.job, result);
	html = detailViewForm(dataArray, "modal");
	
	modal.show();
	modal.content.css("min-width", "70%").css("max-width", "70%");
	modal.headTitle.text(title);
	modal.body.html(html);
	notIdArray = ["writer"];

	if(storage.my == result.writer){
		modal.confirm.text("수정");
		modal.confirm.attr("onclick", "enableDisabled(this, \"reportUpdate();\", \"" + notIdArray + "\");");
		defaultFormLine = $(".defaultFormLine");
		defaultFormLine.eq(0).append("<button type=\"button\" class=\"modalDeleteBtn\" onclick=\"reportDelete();\">삭제</button>");
	}else{
		modal.confirm.hide();
	}

	modal.close.text("취소");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$("[name='job'][value='" + result.job + "']").attr("checked", true).removeAttr("onclick");
		if(result.job === "sales"){
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			datas = ["sopp", "writer", "customer", "partner"];
			$("#type option[value='" + type + "']").attr("selected", true);
		}else if(result.job === "tech"){
			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
			datas = ["sopp", "writer", "customer", "partner", "cipOfCustomer", "contract"];

			$("[name='contractMethod'][value='" + contractMethod + "']").attr("checked", true);
			$("#type option[value='" + type + "']").attr("selected", true);
			$("#supportStep option[value='" + supportStep + "']").attr("selected", true);
		}else{
			datas = ["sopp", "writer", "customer"];
		}

		let jobArray = $("input[name=\"job\"]");

		for(let i = 0; i < jobArray.length; i++){
			if(!$(jobArray[i]).is(":checked")){
				$(jobArray[i]).hide();
				$(jobArray[i]).next().hide();
			}
		}

		detailTrueDatas(datas);
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function reportErrorView(){
	msg.set("에러");
}

function reportUpdateForm(value, result){
	let dataArray; 

	if(value === "sales"){
		detailSetFormList(result);
		let from, to, place, writer, sopp, customer, partner, title, content;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
        sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
        }

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		
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
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "활동시작일(*)",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "활동종료일(*)",
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
				"title": "활동형태(*)",
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
				"title": "담당자(*)",
				"elementId": "writer",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": writer,				
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "매출처",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": customer,
			},
			{
				"title": "엔드유저",
				"elementId": "partner",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": partner,
			},
			{
				"type": "",
			},
			{
				"title": "제목(*)",
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
		detailSetFormList(result);
		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
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

        contract = "";
        for(let key in storage.contract){
            if(storage.contract[key].no == result.contract){
                contract = storage.contract[key].title;
            }
        }

		cipOfCustomer = "";
        for(let key in storage.cip){
            if(storage.contract[key].no == cipOfCustomer){
                cipOfCustomer = storage.cip[key].name;
            }
        }

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
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "등록구분(*)",
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
				"col": 4,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "계약",
				"elementId": "contract",
				"complete": "contract",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": contract,
			},
			{
				"title": "매출처",
				"elementId": "partner",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": partner,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"elementId": "cipOfCustomer",
				"value": cipOfCustomer,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
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
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"elementId": "writer",
				"value": writer,
			},
			{
				"title": "지원일자 시작일(*)",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "지원일자 종료일(*)",
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
				"title": "",
			},
			{
				"title": "기술지원명(*)",
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
		detailSetFormList(result);
		let from, to, disDate, place, sopp, customer, writer, title, content;

		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
        }

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

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
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "일정시작일(*)",
				"type": "date",
				"elementId": "from",
				"value": from,
			},
			{
				"title": "일정종료일(*)",
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
				"title": "영업기회",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": writer,
			},
			{
				"title": "매출처",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": customer,
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

function workReportSuccessList(result){
	storage.workReportList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawWorkReportList, 600);
	}else{
		window.setTimeout(drawWorkReportList, 200);
	}
}

function workReportErrorList(){
	alert("에러");
}

function workReportWeekBtn(e){
    let url, method, data, type, getDate;

    getDate = $(e).data("date");
    $("#reportInsertBtn").attr("onclick", "reportInsert(" + getDate + ")");

    url = "/api/schedule/workreport/personal/" + getDate;
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function reportInsert(date){
    let url, method, data, type, jsonData, dataArray = [], schedCheck;
    schedCheck = document.getElementsByClassName("schedCheck");

    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

    for(let i = 0; i < schedCheck.length; i++){
        let item = schedCheck[i];
        let temp = {
            "no": $(item).data("id").toString(),
            "job": $(item).data("job"),
            "report": ($(item).is(":checked") == true) ? true : false,
        }
        dataArray.push(temp);
    }

    url = "/api/schedule/workreport/personal/" + date;
    method = "post";
    data = {
        "currentWeek": jsonData.currentWeek,
        "currentWeekCheck": jsonData.currentWeekCheck,
        "previousWeek": CKEDITOR.instances.currentWeek.getData().replaceAll("\n", ""),
        "previousWeekCheck": ($("#previousWeekCheck").is(":checked") == true) ? true : false,
        "schedule": dataArray,
    };
    type = "insert";

    data = JSON.stringify(data);
    data = cipher.encAes(data);

    crud.defaultAjax(url, method, data, type, workReportSuccessInsert, workReportErrorInsert);
}

function workReportSuccessInsert(){
    alert("등록완료");
    location.reload();
}

function workReportErrorInsert(){
    alert("에러");
}

function reportUpdate(){
	let url, method, data, type, job;

	job = $("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + storage.formList.no;
	method = "put";
	type = "update";

	if(job === "sales"){
		if($("#from").val() === ""){
			msg.set("활동시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("활동종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			msg.set("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() !== "" && !validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			$("#partner").focus();
			return false;
		}
	}else if(job === "tech"){
		if($("#title").val() === ""){
			msg.set("기술요청명을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() === ""){
			msg.set("영업기회를 선택해주세요.");
			$("#sopp").focus();
			return false;
		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
			$("#contract").focus();
			return false;
		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#partner").focus();
			return false;
		}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
			$("#cipOfCustomer").focus();
			return false;
		}else if($("#customer").val() === ""){
			msg.set("엔드유저를 선택해주세요.");
			$("#customer").focus();
			return false;
		}else if(!validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}else if($("#from").val() === ""){
			msg.set("지원시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("지원종료일을 선택해주세요.");
			$("#title").focus();
			return false;
		}
	}else{
		if($("#from").val() === ""){
			msg.set("일정시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("일정종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			msg.set("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() !== "" && !validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}
	}

	formDataSet();
	data = storage.formList;
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, reportSuccessUpdate, reportErrorUpdate);
}

function reportSuccessUpdate(){
	location.reload();
	msg.set("수정완료");
}

function reportErrorUpdate(){
	msg.set("에러");
}

function reportDelete(){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + storage.formList.job + "/" + storage.formList.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, reportSuccessDelete, reportErrorDelete);
	}else{
		return false;
	}
}

function reportSuccessDelete(){
	location.reload();
	msg.set("삭제완료");
}

function reportErrorDelete(){
	msg.set("에러");
}