$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
        getworkJournal();
	}, 300);
    
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

    html += "<div class='journalPreviewBody'>";

    html += "<div class='journalBody'>";
    html += "<div>일자: 8/22 ~ 8/26 </div>";
    html += "<div>담당: 이장희</div>";
    html += "<div>지난주 진행사항</div>";
    html += "<div>이번주 예정사항</div>";
    html += "</div>";

    html += "</div>";

    workJournalContent.html(html);
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
// 	let workJournalContent, jsonData, html = "", header;
//     jsonData = storage.workJournalList;

// 	workJournalContent = $(".workJournalContainer .workJournalContent");

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

//     workJournalContent.html(html);
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
