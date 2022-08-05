$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);
   
    getformList();

});



function getformList() {
    let url = "/api/gw/form";
    let formlist;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: (result) => {
            if (result.result == 'ok') {
                let jsondata;
                jsondata = cipher.decAes(result.data)
                jsondata = JSON.parse(jsondata);
                storage.formList = jsondata;
                drawFormList()
            }
        }
    })




}




function drawFormList() {
    let data = storage.formList;
    let titles= new Array();
    let nums = new Array();
    let target=$(".formListDiv"); 
    let targetHtml =""; 


    for (let i = 0; i < data.length; i++) {
      titles.push(data[i].title);
      nums.push(data[i].no);
    } 


    for(let i = 0 ; i <titles.length; i++) {
        targetHtml += "<button type='button' id='doc_form'+"+nums[i]+">"+titles[i]+"</button>";
    }

    target.html(targetHtml);


    
   


   


}






// 받아온 작성 양식 form을 오른쪽에 그리는 함수 
function drawSelectedForm() {

    let drawTarget = $(".showSeletedFormDiv");
    // 선택된 양식 이름
    let selectedform = $(".selectedForm").html();

    // ajax ~ 
    drawTarget.html(selectedform);


}


// function drawForm() {

//     let formDetail = $(".formDetail");
//     let detailhtml = "<div class='formSearchContainer'> <div class='formSearchText'> <input type='text' id='formSearchValue'></div><div class='formSearchBtn'><button type='button' onclick='formSearchList();'>검색</button></div></div>"


//     formDetail.html(detailhtml);
//     let approvalLineDetail = $(".approvalLineDetail");
//     let linehtml = "<div class='lineSearchContainer'> <div class='lineSearchText'> <input type='text' id='lineSearchValue'></div><div class='lineSearchBtn'><button type='button' onclick='lineSearchList();'>검색</button></div></div>"
//     approvalLineDetail.html(linehtml);

// }