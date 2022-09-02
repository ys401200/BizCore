$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
        getworkJournal();
	}, 300);
    
});

function getworkJournal(){
    let url, method, data, type;

    url = "/api/schedule/workreport/company/";
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
}

function drawWorkJournalList() {
    let workJournalContent, html = "", getDate, setDate, startDate, endDate, getLastDate, getNextDate;
    workJournalContent = $(".workJournalContainer .workJournalContent");

    $(document).find("#absBtn").hide();
    html += "<div class='journalUserHeader'>";
    html += "<div><span class='journalSpans'>성명</span></div>";
    html += "<div><span class='journalSpans'>선택</span></div>";
    html += "</div>";
    
    html += "<div class='journalPreviewHeader'><span>미리보기</span></div>";
    
    html += "<div class='journalUserBody'>";

    html += "<div style='display: flex; align-items: center; justify-content: center;'>" + storage.user[10021].userName + "</div>";
    html += "<div><input type='checkbox' checked></div>";

    getDate = storage.workJournalList.start;

    getDate = dateDis(getDate);
    setDate = dateFnc(getDate).replaceAll("-", "");

    if(storage.workJournalList.workReports !== null){
        for(let key in storage.workJournalList.workReports){
            if(key !== 10021){
                html += "<div style='display: flex; align-items: center; justify-content: center;'>" + storage.user[key].userName + "</div>";
                html += "<div><input type='checkbox' onclick='journalCheckClick('" + setDate + "') checked></div>"; 
            }
        }
    }

    html += "</div>";

    startDate = dateDis(storage.workJournalList.start);
    startDate = dateFnc(startDate);

    endDate = dateDis(storage.workJournalList.end);
    endDate = dateFnc(endDate);

    getLastDate = calDays(startDate, "last");
    getNextDate = calDays(startDate, "next");

    html += "<div class='journalPreviewBody_10021'>";
    html += "<div class='journalBodyContent' id='journalBodyContent' style='border: 1px solid #000;'>";

    html += "<div class='journalBodyContent_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000; text-align:center'>일자: " + startDate + " ~ " + endDate + "</div>";
    html += "<div style='border: 1px solid #000; text-align:center'>담당: " + storage.user[10044].userName + "</div>";
    html += "</div>";

    html += "<div class='journalBodyContent_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000; text-align:center'>지난주 진행사항</div>";
    html += "<div style='border: 1px solid #000; text-align:center'>이번주 예정사항</div>";
    html += "</div>";

    html += "<div class='journalBodyContent_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";

    html += "<div class='journalBodyContent_3_last' style='display: grid; grid-template-columns: 10% 90%;'>";

    $.ajax({
        url: "/api/schedule/workreport/company/" + getLastDate,
        method: "get",
        async: false,
        dataType: "json",
        success:(resultData) => {
            let jsonData, index = 0;
            jsonData = cipher.decAes(resultData.data);
            jsonData = JSON.parse(jsonData);
            
            for(let key in jsonData.workReports){
                if(key === "10044"){
                    for(let index in jsonData.workReports[key].schedules){
                        let week = calWeekDay(jsonData.workReports[key].schedules[index].date);
    
                        html += "<div style='border: 1px solid #000; text-align:center; display: flex; align-items: center; justify-content: center;'>" + week + "</div>";
                        html += "<div style='border: 1px solid #000; padding-left: 10px;'><span style='font-weight: 600;'>" + jsonData.workReports[key].schedules[index].title + "</span><br /><span>" + jsonData.workReports[key].schedules[index].content + "<span></div>";
                        index++;
                    }
                }
            }
        }
    });
    
    html += "</div>";


    $.ajax({
        url: "/api/schedule/workreport/company/",
        method: "get",
        async: false,
        dataType: "json",
        success:(resultData) => {
            let jsonData, index = 0;
            jsonData = cipher.decAes(resultData.data);
            jsonData = JSON.parse(jsonData);
            
            html += "<div class='journalBodyContent_3_this' style='display: grid; grid-template-columns: 10% 90%;'>";

            for(let key in jsonData.workReports){
                if(key === "10044"){
                    for(let index in jsonData.workReports[key].schedules){
                        let week = calWeekDay(jsonData.workReports[key].schedules[index].date);
    
                        html += "<div style='border: 1px solid #000; text-align:center; display: flex; align-items: center; justify-content: center;'>" + week + "</div>";
                        html += "<div style='border: 1px solid #000; padding-left: 10px;'><span style='font-weight: 600;'>" + jsonData.workReports[key].schedules[index].title + "</span><br /><span>" + jsonData.workReports[key].schedules[index].content + "<span></div>";
                        index++;
                    }
                }
            }

            html += "</div>";
            html += "</div>";

            html += "<div class='journalBodyContent_4' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
            html += "<div style='border: 1px solid #000; text-align:center'>추가기재사항</div>";
            html += "<div style='border: 1px solid #000; text-align:center'>추가기재사항</div>";
            html += "<div style='border: 1px solid #000; text-align:center'>기재사항 지난주</div>";
            html += "<div style='border: 1px solid #000; text-align:center'>기재사항 이번주</div>";

            if(jsonData.workReports[key].currentWeekCheck == true){
                html += "<div style='border: 1px solid #000; padding-left: 10px;'>" + jsonData.workReports[key].currentWeek + "</div>";
            }else{
                html += "<div style='border: 1px solid #000;'></div>";
            }
            
            if(jsonData.workReports[key].nextWeekCheck == true){
                html += "<div style='border: 1px solid #000; padding-left: 10px;'>" + jsonData.workReports[key].nextWeek + "</div>";
            }else{
                html += "<div style='border: 1px solid #000;'></div>";
            }
            
            html += "</div>";
        }
    });

    html += "</div>"; 

    // if(storage.workJournalList.workReports !== null){
    //     for(let key in storage.workJournalList.workReports){
    //         if(key !== 10021){
    //             html += "<div class='journalPreviewBody_" + key + "' style='text-align:center;'>";
    //             html += "<div class='journalBodyContent' id='journalBodyContent' style='border: 1px solid #000;'>";

    //             html += "<div class='journalBodyContent_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //             html += "<div style='border: 1px solid #000;'>일자: " + storage.workJournalList.start + " ~ " + storage.workJournalList.end + "</div>";
    //             html += "<div style='border: 1px solid #000;'>담당: " + storage.user[key].userName + "</div>";
    //             html += "</div>";

    //             html += "<div class='journalBodyContent_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //             html += "<div style='border: 1px solid #000;'>지난주 진행사항</div>";
    //             html += "<div style='border: 1px solid #000;'>이번주 예정사항</div>";
    //             html += "</div>";

    //             html += "<div class='journalBodyContent_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";

    //             html += "<div class='journalBodyContent_3_last' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //             html += "<div style='border: 1px solid #000;'>월</div>";
    //             html += "<div style='border: 1px solid #000;'>test1</div>";
    //             html += "<div style='border: 1px solid #000;'>화</div>";
    //             html += "<div style='border: 1px solid #000;'>test2</div>";
    //             html += "<div style='border: 1px solid #000;'>수</div>";
    //             html += "<div style='border: 1px solid #000;'>test3</div>";
    //             html += "<div style='border: 1px solid #000;'>목</div>";
    //             html += "<div style='border: 1px solid #000;'>test4</div>";
    //             html += "<div style='border: 1px solid #000;'>금</div>";
    //             html += "<div style='border: 1px solid #000;'>test5</div>";
    //             html += "</div>";

    //             html += "<div class='journalBodyContent_3_this' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //             html += "<div style='border: 1px solid #000;'>월</div>";
    //             html += "<div style='border: 1px solid #000;'>test6</div>";
    //             html += "<div style='border: 1px solid #000;'>화</div>";
    //             html += "<div style='border: 1px solid #000;'>test7</div>";
    //             html += "<div style='border: 1px solid #000;'>수</div>";
    //             html += "<div style='border: 1px solid #000;'>test8</div>";
    //             html += "<div style='border: 1px solid #000;'>목</div>";
    //             html += "<div style='border: 1px solid #000;'>test9</div>";
    //             html += "<div style='border: 1px solid #000;'>금</div>";
    //             html += "<div style='border: 1px solid #000;'>test10</div>";
    //             html += "</div>";

    //             html += "</div>";

    //             html += "<div class='journalBodyContent_4' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //             html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    //             html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    //             html += "<div style='border: 1px solid #000;'>기재사항 지난주</div>";
    //             html += "<div style='border: 1px solid #000;'>기재사항 이번주</div>";
    //             html += "</div>";

    //             html += "</div>"; 
    //         }
    //     }
    // }

    

    // html += "<div class='journalBodyContentHide' id='journalBodyContentHide'>";
    
    // for(let i = 1; i <= 10; i++){
    //     html += "<div class='journalBodyContentHide_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //     html += "<div style='border: 1px solid #000;'>일자: 8/22 ~ 8/26 </div>";
    //     html += "<div style='border: 1px solid #000;'>담당: 이장희</div>";
    //     html += "</div>";
    
    //     html += "<div class='journalBodyContentHide_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //     html += "<div style='border: 1px solid #000;'>지난주 진행사항</div>";
    //     html += "<div style='border: 1px solid #000;'>이번주 예정사항</div>";
    //     html += "</div>";
    
    //     html += "<div class='journalBodyContentHide_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    
    //     html += "<div class='journalBodyContentHide_3_last' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //     html += "<div style='border: 1px solid #000;'>월</div>";
    //     html += "<div style='border: 1px solid #000;'>test1</div>";
    //     html += "<div style='border: 1px solid #000;'>화</div>";
    //     html += "<div style='border: 1px solid #000;'>test2</div>";
    //     html += "<div style='border: 1px solid #000;'>수</div>";
    //     html += "<div style='border: 1px solid #000;'>test3</div>";
    //     html += "<div style='border: 1px solid #000;'>목</div>";
    //     html += "<div style='border: 1px solid #000;'>test4</div>";
    //     html += "<div style='border: 1px solid #000;'>금</div>";
    //     html += "<div style='border: 1px solid #000;'>test5</div>";
    //     html += "</div>";
    
    //     html += "<div class='journalBodyContentHide_3_this' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //     html += "<div style='border: 1px solid #000;'>월</div>";
    //     html += "<div style='border: 1px solid #000;'>test6</div>";
    //     html += "<div style='border: 1px solid #000;'>화</div>";
    //     html += "<div style='border: 1px solid #000;'>test7</div>";
    //     html += "<div style='border: 1px solid #000;'>수</div>";
    //     html += "<div style='border: 1px solid #000;'>test8</div>";
    //     html += "<div style='border: 1px solid #000;'>목</div>";
    //     html += "<div style='border: 1px solid #000;'>test9</div>";
    //     html += "<div style='border: 1px solid #000;'>금</div>";
    //     html += "<div style='border: 1px solid #000;'>test10</div>";
    //     html += "</div>";
    
    //     html += "</div>";
    
    //     html += "<div class='journalBodyContentHide_4' style='page-break-after: always; display: grid; grid-template-columns: repeat(2, 1fr);'>";
    //     html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    //     html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    //     html += "<div style='border: 1px solid #000;'>기재사항 지난주</div>";
    //     html += "<div style='border: 1px solid #000;'>기재사항 이번주</div>";
    //     html += "</div>";
    // }
    
    html += "</div>";
    html += "</div>";

    workJournalContent.html(html);

    $(document).find(".journalBodyContentHide").hide();
}

function workJournalSuccessList(result){
    storage.workJournalList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawWorkJournalList, 600);
	}else{
		window.setTimeout(drawWorkJournalList, 200);
	}
}

function workJournalErrorList(){
    alert("에러");
}

function solPdf(){
    let now, year, month, date, nowDate, element;
    
	now = new Date();
	year = now.getFullYear();
	month = parseInt(now.getMonth())+1;
	
	if(now.getDate() < 10){
		date = "0" + now.getDate();
	}else{
		date = now.getDate();
	}
	
	nowDate = year + "-" + month + "-" + date;
	element = document.getElementById("journalPreviewBody");
    
	html2pdf().from(element).set({
	  margin: 5,
      filename: "test" + '(' + nowDate + ')' + '.pdf',
      html2canvas: { scale: 3 },
      jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
	}).save();
}

function solPrint(){
	window.onbeforeprint = function(){
		//setSecondsr1();
		document.body.innerHTML = document.getElementById("journalPreviewBody").innerHTML;
	}
	
	window.onafterprint = function(){
		location.href="/business/workjournal";
	}
	
	window.print();
}

function print_pdf(){
    $(document).find(".journalBodyContentHide").show();

	let element = document.getElementById("journalBodyContentHide");
	
	html2pdf().from(element).set({
	  margin: 10,
      filename: '주간업무일지.pdf',
      html2canvas: { scale: 3 },
      jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
	}).save();

    setTimeout(() => {
        $(document).find(".journalBodyContentHide").hide();
    }, 100);
}

function journalChangeBtn(e){
    if($(e).attr("id") === "borBtn"){
        $(document).find("#borBtn").hide();
        $(document).find("#absBtn").show();
    }else{
        $(document).find("#borBtn").show();
        $(document).find("#absBtn").hide();
    }
}

function journalCheckClick(date){

}

// function getworkJournal() {
// 	let url, method, data, type;

// 	url = "/api/workjournal";
// 	method = "get";
// 	data = "";
// 	type = "list";

// 	crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
// }

// function drawWorkJournalList() {
// 	let workjournalBodyContent, jsonData, html = "", header;
//     jsonData = storage.workJournalList;

// 	workjournalBodyContent = $(".workJournalContainer .workjournalBodyContent");

//     header = [
//         {
//             "title": "주차"
//         },
//         {
//             "title": "요일"
//         },
//         {
//             "title": "일정제목"
//         },
//         {
//             "title": "일정내용"
//         },
//         {
//             "title": "일정시작"
//         },
//         {
//             "title": "일정종료"
//         },
//         {
//             "title": "업무일지반영"
//         },
//     ];

//     html = "<div class='reportBtns'>";
//     html += "<button type='button'>이전</button>";
//     html += "<button type='button'>다음</button>";
//     html += "</div>";

//     html += "<div class='reportContent'>";

//     for(let i = 0; i < header.length; i++){
//         html += "<div>" + header[i].title + "</div>";
//     }

//     html += "<div>" + jsonData[i].data + "</div>";

//     for(let i = 0; i < jsonData.length; i++){
//         html += "<div>" + jsonData[i].data + "</div>";
//         html += "<div>" + jsonData[i].data + "</div>";
//         html += "<div>" + jsonData[i].data + "</div>";
//         html += "<div>" + jsonData[i].data + "</div>";
//         html += "<div>" + jsonData[i].data + "</div>";
//         html += "<div><input type='checkbox'></div>";
//     }

//     html += "</div>";

//     workjournalBodyContent.html(html);
// }

// function workJournalSuccessList(result){
// 	storage.workJournalList = result;
	
// 	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
// 		window.setTimeout(drawWorkJournalList, 600);
// 	}else{
// 		window.setTimeout(drawWorkJournalList, 200);
// 	}
// }

// function workJournalErrorList(){
// 	alert("에러");
// }

// function workJournalWeekBtn(e){
//     let url, method, data, type;

//     url = "/api/workJournal" + $(e).data("week");
//     method = "get";
//     type = "list";

//     crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
// }
