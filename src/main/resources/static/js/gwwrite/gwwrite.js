$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);
    drawForm();

});


function drawForm() {

    let formDetail = $(".formDetail");
    let datailhtml = "<div class='serchDiv'><input type='text' id='formSearchValue'><button type='button'onclick='formSearchList();'>검색</button></div><div class='formlist'>양식 목록 리스트</div>";
    formDetail.html(datailhtml);
    let approvalLineDetail = $(".approvalLineDetail");
    let linehtml = "<div class='serchDiv'><input type='text' id='lineSearchValue'><button type='button'onclick='lineSearchList();'>검색</button></div><div class='linelist'>결재선 리스트</div></div>"
    approvalLineDetail.html(linehtml);

}




// 받아온 작성 양식 form을 오른쪽에 그리는 함수 
function drawSelectedForm() {
    let drawTarget = $(".showSeletedFormDiv");
    // 선택된 양식 이름
    let selectedform = $(".selectedForm").html();

    // ajax ~ 
    drawTarget.html(selectedform);

}

