$(document).ready(() => {
    init();
    prevReportAjax();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
        getworkJournal();
	}, 300);
});

function prevReportAjax(){
    let getDate, prevDate;

    getDate = new Date();
    getDate = getDate.toISOString().substring(0, 10);
    prevDate = calDays(getDate, "last");

    $.ajax({
        url: "/api/schedule/workreport/company/" + prevDate,
        method: "get",
        dataType: "json",
        success:(resultData) => {
            let jsonData;
            jsonData = cipher.decAes(resultData.data);
            jsonData = JSON.parse(jsonData);
            
            storage.prevWorkJournalList = jsonData;
        }
    });
}

function getworkJournal(){
    let url, method, data, type;

    url = "/api/schedule/workreport/company/";
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
}

function drawWorkJournalList() {
    let workJournalContent, html = "", startDate, endDate;
    workJournalContent = $(".workJournalContainer .workJournalContent");

    $(document).find("#absBtn").hide();

    startDate = new Date(storage.workJournalList.start);
    startDate = new Date(startDate.getTime() + 86400000 * 7);
    disDate = dateDis(startDate);
    startDate = dateFnc(disDate);

    endDate = dateDis(storage.workJournalList.end);
    endDate = dateFnc(endDate);

    getLastDate = calDays(startDate, "last");

    html += "<div class='journalUserHeader' style='text-align: center; font-weight: 600;'>";
    html += "<div><span class='journalSpans'>성명</span></div>";
    html += "<div><span class='journalSpans'>선택</span></div>";
    html += "</div>";

    html += "<div class='journalPreviewHeader' style='text-align: center; font-weight: 600;'><span>미리보기</span></div>";
    html += "<div class='journalUserBody'>";
    html += "</div>";
    
    for(let setKey in storage.workJournalList.workReports){
            html += "<div class='journalPreviewBody_" + setKey + "' style='page-break-after: always; display: none;'>";
            html += "<div class='journalBodyContent' id='journalBodyContent' style='border: 1px solid #000;'>";
        
            html += "<div class='journalBodyContent_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
            html += "<div style='border: 1px solid #000; text-align:center'>일자: " + startDate + " ~ " + endDate + "</div>";
            html += "<div style='border: 1px solid #000; text-align:center'>담당: " + storage.user[setKey].userName + "</div>";
            html += "</div>";
        
            html += "<div class='journalBodyContent_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
            html += "<div style='border: 1px solid #000; text-align:center'>지난주 진행사항</div>";
            html += "<div style='border: 1px solid #000; text-align:center'>이번주 예정사항</div>";
            html += "</div>";
        
            html += "<div class='journalBodyContent_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
            html += "<div class='journalBodyContent_3_last' style='display: grid; grid-template-columns: 10% 90%; border: 1px solid #000; padding: 5px;'>";
        
            for(let key in storage.workJournalList.workReports){
                if(key === setKey){
                    if(storage.workJournalList.workReports[key].schedules.length > 0){
                        for(let index in storage.workJournalList.workReports[key].schedules){
                            let date = new Date(storage.workJournalList.workReports[key].schedules[index].date);
                            let dateStart = new Date(storage.workJournalList.start);
                            if(dateStart.getTime() + 86400000 * 7 > date.getTime() && storage.workJournalList.workReports[key].schedules[index].report){
                                let week = calWeekDay(storage.workJournalList.workReports[key].schedules[index].date);
            
                                html += "<div style='border: 1px solid #000; text-align:center; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;'>" + week + "</div>";
                                html += "<div style='border: 1px solid #000; padding-left: 10px; margin-bottom: 5px;'><span style='font-weight: 600;'>" + storage.workJournalList.workReports[key].schedules[index].title + "</span><br /><span>" + storage.workJournalList.workReports[key].schedules[index].content + "<span></div>";
                            }
                        }
                    }else{
                        html += "<div style='grid-column: span 2; font-weight: 600; border: 1px solid #000; display: flex; align-items: center; justify-content: center;'>지난주 데이터가 없습니다.</div>";
                    }
                }
            }
            
            html += "</div>";
            html += "<div class='journalBodyContent_3_this' style='display: grid; grid-template-columns: 10% 90%; border: 1px solid #000; padding: 5px;'>";

            for(let key in storage.workJournalList.workReports){
                if(key === setKey){
                    if(storage.workJournalList.workReports[key].schedules.length > 0){
                        for(let index in storage.workJournalList.workReports[key].schedules){
                            let date = new Date(storage.workJournalList.workReports[key].schedules[index].date);
                            let dateStart = new Date(storage.workJournalList.start);
                            if(dateStart.getTime() + 86400000 * 7 < date.getTime() && storage.workJournalList.workReports[key].schedules[index].report){
                                let week = calWeekDay(storage.workJournalList.workReports[key].schedules[index].date);
            
                                html += "<div style='border: 1px solid #000; text-align:center; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;'>" + week + "</div>";
                                html += "<div style='border: 1px solid #000; padding-left: 10px; margin-bottom: 5px;'><span style='font-weight: 600;'>" + storage.workJournalList.workReports[key].schedules[index].title + "</span><br /><span>" + storage.workJournalList.workReports[key].schedules[index].content + "<span></div>";
                            }
                        }
                    }else{
                        html += "<div style='grid-column: span 2; font-weight: 600; border: 1px solid #000; display: flex; align-items: center; justify-content: center;'>이번주 데이터가 없습니다.</div>";
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
        
            if(storage.workJournalList.workReports.currentWeekCheck){
                html += "<div style='border: 1px solid #000; padding-left: 10px; font-weight: 600;'>" + storage.workJournalList.workReports[key].currentWeek + "</div>";
            }else{
                html += "<div style='border: 1px solid #000; text-align: center; font-weight: 600;'>지난주 추가기재사항이 없습니다.</div>";
            }
            
            if(storage.workJournalList.workReports.nextWeekCheck){
                html += "<div style='border: 1px solid #000; padding-left: 10px; font-weight: 600;'>" + storage.workJournalList.workReports[key].nextWeek + "</div>";
            }else{
                html += "<div style='border: 1px solid #000; text-align: center; font-weight: 600;'>이번주 추가기재사항이 없습니다.</div>";
            }
            
            html += "</div>";
            html += "</div>";
            html += "</div>";
    }

    html += "</div>";

    workJournalContent.html(html);
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

function solPdf(no){
    let now, year, month, date, nowDate, element, title, workJournalContent, html = "";
    
    workJournalContent = $(".workJournalContainer .workJournalContent");
    html = "<div class='hideContainer' id='hideContainer'></div>";

    workJournalContent.append(html);

    $(".hideContainer").append("<div class='.journalPreviewBodyHide_" + no + "' style='page-break-after: always;'>" + $(".journalPreviewBody_" + no).html() + "</div>");

    title = $(".userBodyCheck[data-no='" + no + "']").parent().prev().html();
    
	now = new Date();
	year = now.getFullYear();
	month = parseInt(now.getMonth())+1;
	
	if(now.getDate() < 10){
		date = "0" + now.getDate();
	}else{
		date = now.getDate();
	}
	
	nowDate = year + "-" + month + "-" + date;
	element = document.getElementById("hideContainer");
    
	html2pdf().from(element).set({
	  margin: 10,
      filename: title + '(' + nowDate + ')' + '.pdf',
      html2canvas: { scale: 3 },
      jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
	}).save();

    setTimeout(() => {
        $(".hideContainer").remove();
    }, 100);
}

function solPrint(){
	window.onbeforeprint = function(){
		document.body.innerHTML = document.getElementById("journalPreview").innerHTML;
	}
	
	window.onafterprint = function(){
		location.href="/business/workjournal";
	}
	
	window.print();
}

function print_pdf(){
    let checkArray = [], element, workJournalContent, html = "";
    workJournalContent = $(".workJournalContainer .workJournalContent");

    $(".userBodyCheck").each((index, item) => {
        if($(item).is(":checked") == true){
            checkArray.push($(item).data("no"));
        }
    });

    html = "<div class='hideContainer' id='hideContainer'></div>";

    workJournalContent.append(html);
    
    if(checkArray.length > 0){
        for(let i = 0; i < checkArray.length; i++){
            $(".hideContainer").append("<div class='.journalPreviewBodyHide_" + checkArray[i] + "' style='page-break-after: always;'>" + $(".journalPreviewBody_" + checkArray[i]).html() + "</div>");
        }
    }
    
	element = document.getElementById("hideContainer");
	
	html2pdf().from(element).set({
	  margin: 10,
      filename: '주간업무일지.pdf',
      html2canvas: { scale: 3 },
      jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
	}).save();
    
    setTimeout(() => {
        $(".hideContainer").remove();
    }, 100);
}

function journalChangeBtn(e){
    let nowDate, nextDate, url, method, data, type;

    nowDate = new Date();
    nowDate = nowDate.toISOString().substring(0, 10);

    if($(e).data("change") === "bor"){
        $(e).text("업무일지(금주)");
        $(e).data("change", "abs");

        nextDate = calDays(nowDate, "next");
        url = "/api/schedule/workreport/company/" + nextDate;
        method = "get";
        type = "list";

        crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
    }else{
        $(e).text("업무일지(차주)");
        $(e).data("change", "bor");

        url = "/api/schedule/workreport/company";
        method = "get";
        type = "list";

        crud.defaultAjax(url, method, data, type, workJournalSuccessList, workJournalErrorList);
    }
}

function journalTitleClick(no){
    $(document).find("[class^='journalPreviewBody_']").each((index, item) => {
        $(item).hide();
    });

    $(document).find(".journalPreviewBody_" + no).show();
    localStorage.setItem("titleClickNo", no);
    $("#solPdf").attr("onclick", "solPdf(" + no + ")");
}