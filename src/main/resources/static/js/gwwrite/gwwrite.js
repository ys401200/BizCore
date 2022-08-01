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
    let html =
        "<div class='outerDiv' style='display:grid;grid-template-columns:45% 10% 45%'><div class='firstDiv'><label for='highCategory'>결재문서 종류</label><select id='highCategory' onchange='setlowCategory(this.value)'><option value='지출품의서'>지출품의서</option>" +
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
    if (value == "지출품의서") {
        html =
            "<select id='formData'><option value='선택'>선택</option><option value='구매요청서'>구매요청서</option>" +
            "<option value='지출품의서'>지출품의서</option>" +
            "<option value='수주서'>수주서</option>" +
            "<option value='검토요청서'>검토요청서</option>" +
            "<option value='공문서확인요청서'>공문서 확인 요청서</option></select>";
    } else if (value == "지출결의서") {
        html =
            "<select id='formData'><option value='선택'>선택</option><option value='비용청구'>비용청구</option>" +
            "<option value='세금공과금'>세금공과금</option>" +
            "<option value='외상매입금'>외상매입금</option>" +
            "<option value='급여'>급여</option></select>";
    } else if (value == "외부문서") {
        html =
            "<select id='formData'><option value='선택'>선택</option><option value='발주서'>발주서</option>" +
            "<option value='공문서'>공문서</option></select>";
    }

    lowCate.html(html);
}

function drawWriteForm() {
    let formData = $("#formData option:selected").val();
    if (formData == "선택") {
        modal.alert("알림", "하위카테고리를 선택하세요");
    } else {
        setWriteForm(formData);

        let highformData = $("#highCategory option:selected").val();
        if (highformData == '지출품의서') {
            drawWriteForm2();
            $(".insertedData").html("");


        }


    }
}

function setWriteForm(formData) {
    let targetTitle = $(".writeFormTitle");
    let targetInfo = $(".writeFormInfo");
    let targetInput = $(".writeFormInput");

    let infoHtml = "";
    let inputHtml = "";
    //선택 문서 양식 제목
    targetTitle.html("<div class='writeFormtitle'>" + formData + "</div>");

    // 선택 문서 정보
    let title = ["문서번호", "영업기회", "거래처", "작성일자", "작성자"];
    let content = ["vtek220729", "테스트 영업기회", " 테스트 거래처", "2022-07-29", "김송현"];

    for (let i = 0; i < 5; i++) {
        if (i != 1 && i != 2) {
            infoHtml += "<div>" + title[i] + "</div><div>" + content[i] + "</div>";
        }
        else if (i == 1) {
            infoHtml += "<div>" + title[i] + "</div><div><input type='text' id='salesopportunities' readonly/></div>";
        } else if (i == 2) {
            infoHtml += "<div>" + title[i] + "</div><div><input type='text' readonly/></div>";
        }
    }
    targetInfo.html(infoHtml);

    // 선택 문서 입력 form

    inputHtml =
        "<div style='display:grid;grid-template-columns:10% 90%'><label>제목</label><input type='text'/></div>" +
        "<div style='display:grid;grid-template-columns:10% 90%'><label>내용</label><textarea></textarea></div>";
    targetInput.html(inputHtml);
    
   

    $(".buttonField").html("<div><button type='button'>등록</button></div>")




}




function drawWriteForm2() {
    // 입력 form


    let targetData = $(".writeFormData");
    let item = [
        "거래일자",
        "거래처",
        "결재항목",
        "자동결재",
        "단가",
        "수량",
        "공급가액",
        "부가세액",
        "금액",
        "적요",
        "등록",
    ];
    let titleitem =
        "<div style='display:grid;grid-template-columns:10% 10% 10% 10% 10% 5% 10% 10% 10% 10% 5%'>";
    for (let i = 0; i < item.length; i++) {
        titleitem += "<div>" + item[i] + "</div>";
    }
    titleitem += "</div>";

    targetData.html(titleitem);

    let html =
        "<div style='display:grid;grid-template-columns:10% 10% 10% 10% 10% 5% 10% 10% 10% 10% 5%'>" +
        "<div><input type='date'class='accountDate'/></div>" +
        "<div><input type='text'class='account'></div>" +
        "<div><input type='text' class='paymentItem'/></div>" +
        "<div><select><option value='자동계산'>자동계산</option><option value='직접입력'>직접입력</option></select></div>" +
        "<div><input type='text' class='price'></div>" +
        "<div><input type='text' class='quantity' onkeyup='calculate()'/></div>" +
        "<div><input type='text'class='supply' readonly/></div>" +
        "<div><input type='text' class='vat'/ readonly></div>" +
        "<div><input type='text'class='total'/ readonly></div>" +
        "<div><input type='text' class='dataRemark'/></div>" +
        "<div><button type='button' onclick='drawInsertedData()'>추가</button></div></div>";

    titleitem += html;

    let inserteditem = [
        "거래일자",
        "거래처",
        "결재항목",
        "단가",
        "수량",
        "공급가액",
        "부가세액",
        "금액",
        "적요",
        "등록",
    ];

    let title2 = "";

    for (let i = 0; i < 10; i++) {
        title2 += "<div>" + inserteditem[i] + "</div>";
    }
    let html2 =
        "<div style='display:grid;grid-template-columns:10% 10% 10% 10% 10% 10% 10% 10% 10% 10%'>";

    html2 += title2;

    titleitem += html2;

    targetData.html(titleitem);


}






function drawInsertedData() {
    let target = $(".insertedData");

    let accountDate = $(".accountDate").val();
    let account = $(".account").val();
    let paymentItem = $(".paymentItem").val();
    let price = $(".price").val();
    let quantity = $(".quantity").val();
    let supply = $(".supply").val();
    let vat = $(".vat").val();
    let total = $(".total").val();
    let dataRemark = $(".dataRemark").val();

    //입력된 데이터 배열
    let insertedDataArray = [
        {
            title: "accountDate",
            data: accountDate,
        },
        {
            title: "account",
            data: account,
        },
        {
            title: "paymentItem",
            data: paymentItem,
        },
        {
            title: "price",
            data: price,
        },
        {
            title: "quantity",
            data: quantity,
        },
        {
            title: "supply",
            data: supply,
        },
        {
            title: "vat",
            data: vat,
        },
        {
            title: "total",
            data: total,
        },
        {
            title: "dataRemark",
            data: dataRemark,
        },
    ];

    let insertedhtml =
        "<div style='display:grid;grid-template-columns:10% 10% 10% 10% 10% 10% 10% 10% 10% 10%'>";
    for (let i = 0; i < insertedDataArray.length; i++) {
        insertedhtml += "<div>" + insertedDataArray[i].data + "</div>";
    }

    insertedhtml += "<button type='button' onclick='deleteInsertedData(this)'>삭제</button></div>";
    targets = target.html();
    targets += insertedhtml;
    target.html(targets);
}







// 삭제 버튼 누르면 입력 데이터 삭제되는 함수 
function deleteInsertedData(obj) {
    let parent;
    parent = obj.parentNode;
    parent.remove();
}


// 공급가액 부가세액 금액 자동 입력 함수 
function calculate() {

    let price = $(".price").val();
    let quantity = $(".quantity").val();
    $(".supply").val(price * quantity);
    $(".vat").val(price * quantity / 10);
    $(".total").val(price * quantity + (price * quantity / 10));

}















