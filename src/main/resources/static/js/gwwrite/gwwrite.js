$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);
    drawSearchForm();
});



function drawSearchForm() {


    let target = $(".searchForm");
    let html = "<div class='outerDiv' style='display:grid;grid-template-columns:45% 10% 45%'><div class='firstDiv'><label for='highCategory'>결재문서 종류</label><select id='highCategory' onchange='setlowCategory(this.value)'><option value='지출품의서'>지출품의서</option>" +
        "<option value='지출결의서'>지출결의서</option><option value='외부문서'>외부문서</option></select></div>" +
        "<div class='lowCategory'><select id='formData'><option value='선택'>선택</option><option value='구매요청서'>구매요청서</option>" +
        "<option value='지출품의서'>지출품의서</option>" +
        "<option value='수주서'>수주서</option>" +
        "<option value='검토요청서'>검토요청서</option>" +
        "<option value='공문서확인요청서'>공문서 확인 요청서</option></select></div>" +
        "<div><button type='button' class='createForm' onclick='drawWriteForm()'>결재 양식 생성</button></div></div>";
    target.html(html);

}



function setlowCategory(value) {

    let lowCate = $(".lowCategory");
    let html;
    console.log(value);
    if (value == '지출품의서') {
        html = "<select id='formData'><option value='선택'>선택</option><option value='구매요청서'>구매요청서</option>" +
            "<option value='지출품의서'>지출품의서</option>" +
            "<option value='수주서'>수주서</option>" +
            "<option value='검토요청서'>검토요청서</option>" +
            "<option value='공문서확인요청서'>공문서 확인 요청서</option></select>";
    }

    else if (value == '지출결의서') {
        html = "<select id='formData'><option value='선택'>선택</option><option value='비용청구'>비용청구</option>" +
            "<option value='세금공과금'>세금공과금</option>" +
            "<option value='외상매입금'>외상매입금</option>" +
            "<option value='급여'>급여</option></select>";
    }

    else if (value == '외부문서') {
        html = "<select id='formData'><option value='선택'>선택</option><option value='발주서'>발주서</option>" +
            "<option value='공문서'>공문서</option></select>"
    }

    lowCate.html(html);

}



function drawWriteForm() {
    let formData = $("#formData option:selected").val();
    if (formData == '선택') {
        modal.alert("알림", "하위카테고리를 선택하세요");
    } else {
        setWriteForm(formData);
    }

}


function setWriteForm(formData) {
    let targetTitle = $(".writeFormTitle");
    let targetInfo = $(".writeFormInfo");
    let targetInput = $(".writeFormInput");
    let targetData = $(".writeFormData");
    let infoHtml = "";
    let InputHtml = "";
    //선택 문서 양식 제목
    targetTitle.html("<div class='writeFormtitle'>" + formData + "</div>");


    // 선택 문서 정보 
    let title = ["문서번호", "작성일자", "작성자"];
    let content = ["vtek220729", "2022-07-29", "김송현"];
    for (let i = 0; i < 3; i++) {
        infoHtml += "<div>" + title[i] + "</div><div>" + content[i] + "</div>"
    }
    targetInfo.html(infoHtml);

    // 선택 문서 입력 form

    inputHtml = "<div style='display:grid;grid-template-columns:10% 90%'><label>제목</label><input type='text'/></div>" +
        "<div style='display:grid;grid-template-columns:10% 90%' ><label>내용</label><textarea></textarea></div>"
    targetInput.html(inputHtml);

    // 입력 form 
    let item = ["거래일자", "거래처", "결재항목", "자동결재", "단가", "수량", "공급가액", "부가세액", "금액", "적요", "등록"];
    let titleitem = "<div class='itemTitle'>";
    for (let i = 0; i < item.length; i++) {
        titleitem += "<div>" + item[i] + "</div>"
    }
    titleitem += "</div>"
    targetData.html(titleitem);
    





















    // let writeFormArray = [
    //     {

    //         "title": "구매요청서",
    //         "form": writeFormFrame

    //     },
    //     {


    //         "title": "지출품의서",
    //         "form": writeFormFrame

    //     },
    //     {


    //         "title": "수주서",
    //         "form": writeFormFrame

    //     }
    // ];


    // for (let i = 0; i < writeFormArray.length; i++) {
    //     if (formData == writeFormArray[i].title) {
    //         target.html(writeFormArray[i].form);
    //     }

    // }







}






