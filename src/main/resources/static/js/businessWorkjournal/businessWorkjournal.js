$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
    
    setTimeout(() => {
        getworkJournal();
    }, 500);
});

function getworkJournal(){
    let workJournalContent, html = "";
    workJournalContent = $(".workJournalContainer .workJournalContent");

    $(document).find("#absBtn").hide();

    html += "<div class='journalUserHeader'>";
    html += "<div><span class='journalSpans'>성명</span></div>";
    html += "<div><span class='journalSpans'>선택</span></div>";
    html += "</div>";
    
    html += "<div class='journalPreviewHeader'><span>미리보기</span></div>";
    
    html += "<div class='journalUserBody'>";
    
    for(let key in storage.user){
        html += "<div>" + storage.user[key].userName + "</div>";
        html += "<div><input type='checkbox'></div>"; 
    }

    html += "</div>";

    html += "<div class='journalPreviewBody' style='text-align:center;'>";
    html += "<div class='journalBodyContent' id='journalBodyContent' style='border: 1px solid #000;'>";

    html += "<div class='journalBodyContent_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000;'>일자: 8/22 ~ 8/26 </div>";
    html += "<div style='border: 1px solid #000;'>담당: 이장희</div>";
    html += "</div>";

    html += "<div class='journalBodyContent_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000;'>지난주 진행사항</div>";
    html += "<div style='border: 1px solid #000;'>이번주 예정사항</div>";
    html += "</div>";

    html += "<div class='journalBodyContent_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";

    html += "<div class='journalBodyContent_3_last' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000;'>월</div>";
    html += "<div style='border: 1px solid #000;'>test1</div>";
    html += "<div style='border: 1px solid #000;'>화</div>";
    html += "<div style='border: 1px solid #000;'>test2</div>";
    html += "<div style='border: 1px solid #000;'>수</div>";
    html += "<div style='border: 1px solid #000;'>test3</div>";
    html += "<div style='border: 1px solid #000;'>목</div>";
    html += "<div style='border: 1px solid #000;'>test4</div>";
    html += "<div style='border: 1px solid #000;'>금</div>";
    html += "<div style='border: 1px solid #000;'>test5</div>";
    html += "</div>";

    html += "<div class='journalBodyContent_3_this' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000;'>월</div>";
    html += "<div style='border: 1px solid #000;'>test6</div>";
    html += "<div style='border: 1px solid #000;'>화</div>";
    html += "<div style='border: 1px solid #000;'>test7</div>";
    html += "<div style='border: 1px solid #000;'>수</div>";
    html += "<div style='border: 1px solid #000;'>test8</div>";
    html += "<div style='border: 1px solid #000;'>목</div>";
    html += "<div style='border: 1px solid #000;'>test9</div>";
    html += "<div style='border: 1px solid #000;'>금</div>";
    html += "<div style='border: 1px solid #000;'>test10</div>";
    html += "</div>";

    html += "</div>";

    html += "<div class='journalBodyContent_4' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
    html += "<div style='border: 1px solid #000;'>기재사항 지난주</div>";
    html += "<div style='border: 1px solid #000;'>기재사항 이번주</div>";
    html += "</div>";

    html += "</div>";

    html += "<div class='journalBodyContentHide' id='journalBodyContentHide'>";
    
    for(let i = 1; i <= 10; i++){
        html += "<div class='journalBodyContentHide_1' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
        html += "<div style='border: 1px solid #000;'>일자: 8/22 ~ 8/26 </div>";
        html += "<div style='border: 1px solid #000;'>담당: 이장희</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContentHide_2' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
        html += "<div style='border: 1px solid #000;'>지난주 진행사항</div>";
        html += "<div style='border: 1px solid #000;'>이번주 예정사항</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContentHide_3' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
    
        html += "<div class='journalBodyContentHide_3_last' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
        html += "<div style='border: 1px solid #000;'>월</div>";
        html += "<div style='border: 1px solid #000;'>test1</div>";
        html += "<div style='border: 1px solid #000;'>화</div>";
        html += "<div style='border: 1px solid #000;'>test2</div>";
        html += "<div style='border: 1px solid #000;'>수</div>";
        html += "<div style='border: 1px solid #000;'>test3</div>";
        html += "<div style='border: 1px solid #000;'>목</div>";
        html += "<div style='border: 1px solid #000;'>test4</div>";
        html += "<div style='border: 1px solid #000;'>금</div>";
        html += "<div style='border: 1px solid #000;'>test5</div>";
        html += "</div>";
    
        html += "<div class='journalBodyContentHide_3_this' style='display: grid; grid-template-columns: repeat(2, 1fr);'>";
        html += "<div style='border: 1px solid #000;'>월</div>";
        html += "<div style='border: 1px solid #000;'>test6</div>";
        html += "<div style='border: 1px solid #000;'>화</div>";
        html += "<div style='border: 1px solid #000;'>test7</div>";
        html += "<div style='border: 1px solid #000;'>수</div>";
        html += "<div style='border: 1px solid #000;'>test8</div>";
        html += "<div style='border: 1px solid #000;'>목</div>";
        html += "<div style='border: 1px solid #000;'>test9</div>";
        html += "<div style='border: 1px solid #000;'>금</div>";
        html += "<div style='border: 1px solid #000;'>test10</div>";
        html += "</div>";
    
        html += "</div>";
    
        html += "<div class='journalBodyContentHide_4' style='page-break-after: always; display: grid; grid-template-columns: repeat(2, 1fr);'>";
        html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
        html += "<div style='border: 1px solid #000;'>추가기재사항</div>";
        html += "<div style='border: 1px solid #000;'>기재사항 지난주</div>";
        html += "<div style='border: 1px solid #000;'>기재사항 이번주</div>";
        html += "</div>";
    }
    
    html += "</div>";
    html += "</div>";

    workJournalContent.html(html);

    $(document).find(".journalBodyContentHide").hide();
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
