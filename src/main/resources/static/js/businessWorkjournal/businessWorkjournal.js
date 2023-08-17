$(document).ready(() => {
    init();
    // prevReportAjax();
    
	// setTimeout(() => {
	// 	$("#loadingDiv").hide();
	// 	$("#loadingDiv").loading("toggle");
    //     getworkJournal();
	// }, 300);
    let workJournalSet = new WorkJournalSet();
    workJournalSet.getWorkJournalUsers();
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
    let workJournalContent, html = "", startDate, endDate, parent;
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
    
    html += "<div class='journalUserBody' style=\"height: 40px; font-size: 0.8rem; border-top: 1px solid #ededed;\">";

    if(storage.workJournalList.workReports !== null){
        for(let key in storage.workJournalList.workReports){
            html += "<div class='userBodyFirst' onclick='journalTitleClick(" + key + ");'>" + storage.user[key].userName + "</div>";
            html += "<div><input type='checkbox' class='userBodyCheck' data-no='" + key + "' checked></div>"; 
        }
    }

    html += "</div>";
    
    for(let key in storage.workJournalList.workReports){
        let scheduleDatas = storage.workJournalList.workReports[key].schedules.sort(function(a, b){return a.date - b.date;});

        html += "<div class='journalPreviewBody_" + key + "' data-no=\"" + key + "\" id=\"journalPreview\" style='page-break-after: always; display: none; font-size: 0.8rem;'>";
        html += "<div class='journalBodyContent' id='journalBodyContent'>";
    
        html += "<div class='journalBodyContent_1' style='display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid #ededed; border-bottom: 1px solid #ededed; border-left: 1px solid #ededed;'>";
        html += "<div style='text-align:center;'>일자: " + startDate + " ~ " + endDate + "</div>";
        html += "<div style='text-align:center; border-left: 1px solid #ededed;'>담당: " + storage.user[key].userName + "</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContent_2' style='display: grid; grid-template-columns: repeat(2, 1fr); border-bottom: 1px solid #ededed; border-left: 1px solid #ededed;'>";
        html += "<div style='text-align:center;'>지난주 진행사항</div>";
        html += "<div style='text-align:center; border-left: 1px solid #ededed;'>이번주 예정사항</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContent_3' style='display: grid; grid-template-columns: repeat(2, 1fr); border-left: 1px solid #ededed;'>";
        html += "<div class='journalBodyContent_3_last' style='display: grid; grid-template-columns: 10% 90%;'>";
    
        if(scheduleDatas.length > 0){
            for(let index in scheduleDatas){
                let date = new Date(scheduleDatas[index].date);
                let dateStart = new Date(storage.workJournalList.start);
                console.log(scheduleDatas);
                if(dateStart.getTime() + 86400000 * 7 > date.getTime() && scheduleDatas[index].report){
                    let week = calWeekDay(scheduleDatas[index].date);

                    html += "<div class=\"rowSpanColumn\" style='text-align:center; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed;'>" + week + "</div>";
                    html += "<div style='padding-left: 10px; border-bottom: 1px solid #ededed;'><span style='font-weight: 600;'>" + scheduleDatas[index].title + "</span><br /><span>" + scheduleDatas[index].content.replaceAll("<p>", "").replaceAll("</p>", "") + "<span></div>";
                }
            }
        }
        
        html += "</div>";
        html += "<div class='journalBodyContent_3_this' style='display: grid; grid-template-columns: 10% 90%; border-left: 1px solid #ededed;'>";

        if(scheduleDatas.length > 0){
            for(let index in scheduleDatas){
                let date = new Date(scheduleDatas[index].date);
                let dateStart = new Date(storage.workJournalList.start);
                if(dateStart.getTime() + 86400000 * 7 < date.getTime() && scheduleDatas[index].report){
                    let week = calWeekDay(scheduleDatas[index].date);

                    html += "<div class=\"rowSpanColumn\" style='text-align:center; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed;'>" + week + "</div>";
                    html += "<div style='padding-left: 10px; border-bottom: 1px solid #ededed;'><span style='font-weight: 600;'>" + scheduleDatas[index].title + "</span><br /><span>" + scheduleDatas[index].content.replaceAll("<p>", "").replaceAll("</p>", "") + "<span></div>";
                }
            }
        }
    
        html += "</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContent_4' style='display: grid; grid-template-columns: repeat(2, 1fr); border-left: 1px solid #ededed;'>";
        html += "<div style='display: flex; align-items: center; justify-content: center; text-align:center; border-bottom: 1px solid #ededed;'>추가기재사항 지난주</div>";
        html += "<div style='display: flex; align-items: center; justify-content: center; text-align:center; border-bottom: 1px solid #ededed; border-left: 1px solid #ededed;'>추가기재사항 이번주</div>";
    
        if(storage.workJournalList.workReports[key].currentWeekCheck){
            html += "<div style='display: flex; align-items: center; padding-left: 10px; font-weight: 600; border-bottom: 1px solid #ededed;'>" + storage.workJournalList.workReports[key].currentWeek.replaceAll("<p>", "").replaceAll("</p>", "") + "</div>";
        }else{
            html += "<div style='display: flex; align-items: center; justify-content: center; font-weight: 600; border-bottom: 1px solid #ededed;'>지난주 추가기재사항이 없습니다.</div>";
        }
        
        if(storage.workJournalList.workReports[key].previousWeekCheck){
            html += "<div style='display: flex; align-items: center; padding-left: 10px; font-weight: 600; border-bottom: 1px solid #ededed; border-left: 1px solid #ededed;'>" + storage.workJournalList.workReports[key].previousWeek.replaceAll("<p>", "").replaceAll("</p>", "") + "</div>";
        }else{
            html += "<div style='display: flex; align-items: center; justify-content: center; font-weight: 600; border-bottom: 1px solid #ededed; border-left: 1px solid #ededed;'>이번주 추가기재사항이 없습니다.</div>";
        }
        
        html += "</div>";
        html += "</div>";
        html += "</div>";
    }

    html += "</div>";

    workJournalContent.hide();
    workJournalContent.html(html);
    parent = ["journalBodyContent_3_last", "journalBodyContent_3_this"];
    gridSetRowSpan("rowSpanColumn", parent);
    $("[class^=journalPreviewBody_]").eq(0).show();
    
    if($(".journalBodyContent_3_last").html() === ""){
        $(".journalBodyContent_3_last").append("<div style='grid-column: span 2; font-weight: 600; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ededed;'>지난주 데이터가 없습니다.</div>");
    }
    
    if($(".journalBodyContent_3_this").html() === ""){
        $(".journalBodyContent_3_last").append("<div style='grid-column: span 2; font-weight: 600; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #ededed;'>이번주 데이터가 없습니다.</div>");
    }

    $("#solPdf").attr("onclick", "solPdf(" + $("[class^=journalPreviewBody_]").eq(0).data("no") + ");")
    workJournalContent.show();
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
      html2canvas: { scale: 10 },
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