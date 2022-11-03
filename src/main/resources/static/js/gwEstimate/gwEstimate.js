
let estmNo = 'VTEK202210_0001';

prepareForm();
init();



function prepareForm() {
  let aesKey, aesIv;

  // 보안 키 세팅
  aesKey = localStorage.getItem("aesKey");
  aesIv = localStorage.getItem("aesIv");
  if (aesKey !== undefined && aesKey !== null) cipher.aes.key = aesKey;
  if (aesIv !== undefined && aesIv !== null) cipher.aes.iv = aesIv;
  getProductList();
  getEstmVerList(estmNo);
 
  ckeditor.config.readOnly = false;
  window.setTimeout(setEditor, 100);
} // End of prepare()


function getProductList() {
  let url;
  url = apiServer + "/api/estimate/item"

  $.ajax({
    "url": url,
    "method": "get",
    "dataType": "json",
    "cache": false,
    success: (data) => {
      let list, x;
      if (data.result === "ok") {
        list = data.data;
        list = cipher.decAes(list);
        list = JSON.parse(list);
        storage.productList = list;

      } else {
        console.log(data.msg);
      }
    }
  });
} // End of getEstimateList()


// 견적 데이터 가져오는 함수 
function getEstmVerList(estmNo) {
  let url;
  url = apiServer + "/api/estimate/" + estmNo;

  $.ajax({
    "url": url,
    "method": "get",
    "dataType": "json",
    "cache": false,
    success: (data) => {
      let list, x;
      if (data.result === "ok") {
        list = data.data;
        list = cipher.decAes(list);
        list = JSON.parse(list);
        for (x = 0; x < list.length; x++)	list[x].doc = cipher.decAes(list[x].doc);
        storage.estmVerList = list;
        setEstData();
        getSavedLine();
      
      } else {
        console.log(data.msg);
      }
    }
  });

  
} // End of getEstimateList()


//데이터 리스트 셋하는 함수 
function setEstData() {
  let formId = "doc_Form_SalesReport";

  $.ajax({
    url: "/api/sopp",
    type: "get",
    dataType: "json",
    success: (result) => {
      if (result.result == "ok") {
        let jsondata;
        jsondata = cipher.decAes(result.data);
        jsondata = JSON.parse(jsondata);
        storage.soppList = jsondata;
        setSoppList(formId);

      } else {
        alert("에러");
      }
    },
  });

  let html = $(".infoContentlast")[0].innerHTML;
  let x;
  let dataListHtml = "";

  // 거래처 데이터 리스트 만들기
  dataListHtml = "<datalist id='_infoCustomer'>";
  for (x in storage.customer) {
    dataListHtml +=
      "<option data-value='" +
      x +
      "' value='" +
      storage.customer[x].name +
      "'></option> ";
  }
  dataListHtml += "</datalist>";
  html += dataListHtml;
  $(".infoContentlast")[0].innerHTML = html;
  $("#" + formId + "_infoCustomer").attr("list", "_infoCustomer");
  $("#" + formId + "_endCustName").attr("list", "_infoCustomer");

  let data = storage.estmVerList[storage.estmVerList.length - 1];

  let writer = data.writer;
  $("#" + formId + "_writer").val(storage.user[writer].userName);
  $("#" + formId + "_created").val(getYmdSlash());
  let total = data.total.toLocaleString();
  $("#" + formId + "_soppTargetAmt").val(total + "원");
 let cip = storage.estmVerList[3].related.estimate.cip; 

  // 매입 매출의 항목 세팅 
  let items = storage.estmVerList[3].related.estimate.items;
  let inSumTarget = $(".inSum");
  let outSumTarget = $(".outSum");
  let inHtml = "";
  let outHtml = "";

  for (let i = 0; i < items.length; i++) {

    //매입데이터셋 
    inHtml = inSumTarget.html();
    inHtml += "<div class='detailcontentDiv'><input value='매입' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  class='inputs doc_Form_SalesReport_type'></input>"
    inHtml += "<input type='date' data-detail='' onchange='this.dataset.detail=this.value;' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_date'></input>"
    inHtml += "<input type='text'   data-detail='' onkeyup='this.dataset.detail=this.value'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + items[i].supplier + "' value='" + items[i].supplier + "' class='inputs doc_Form_SalesReport_customer'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'    data-detail='" + items[i].product + "' value='" + items[i].product + "' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_product'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs doc_Form_SalesReport_price'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs doc_Form_SalesReport_quantity'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs doc_Form_SalesReport_amount'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs doc_Form_SalesReport_tax'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inTotal inputs doc_Form_SalesReport_total'></input>"
    inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark'></input>"
    inHtml += "<div class='detailcontentbox'><input type='checkbox' class='detailBox'></div></div>"
    //매출데이터셋 


    let outAmount, outTax, outTotal;
    outAmount = Number(items[i].quantity) * Number(items[i].price);
    if (items[0].vat == true) {
      outTax = Number(items[i].quantity) * Number(items[i].price) * 0.1;
    }
    outTotal = outAmount + outTax;
    outHtml = outSumTarget.html();
    outHtml += "<div class='detailcontentDiv'><input value='매출' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_type'></input>"
    outHtml += "<input type='date' onchange='this.dataset.detail=this.value;' data-detail='' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_date'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value'  class='inputs doc_Form_SalesReport_customer'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='' onkeyup='this.dataset.detail=this.value'  data-detail='' value='" + items[i].product + "' class='inputs doc_Form_SalesReport_product'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail=''  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='' value='" + items[i].price + "' class='inputs doc_Form_SalesReport_price'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail=''  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='' value='" + items[i].quantity + "' class='inputs doc_Form_SalesReport_quantity'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='' value='" + outAmount.toLocaleString() + "'  class='inputs doc_Form_SalesReport_amount'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='' value='" + outTax.toLocaleString() + "'  class='inputs doc_Form_SalesReport_tax'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='' value='" + outTotal.toLocaleString() + "' class='outTotal inputs doc_Form_SalesReport_total'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark'></input>"
    outHtml += "<div class='detailcontentbox'><input type='checkbox' class='detailBox'></div></div>"


  }
  inSumTarget.html(inHtml);
  outSumTarget.html(outHtml);

  setCusDataList();
  setProductData();
  let target = $(".mainDiv")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].dataset.detail = inputsArr[i].value
    }
  }

  getTotalCount();

}




function reportInsert() {
  let title, content, readable, formId, appDoc, dept;
  let appLine = [];
 
  formId = "doc_Form_SalesReport";


////////// sopp 
  let soppVal = $("#" + formId + "_sopp").val();
  let customerVal = $("#" + formId + "_infoCustomer").val();
  let soppResult = "";
  for (let x in storage.soppList) {
    if (storage.soppList[x].title == soppVal) {
      soppResult = storage.soppList[x].no + "";
    }
  }

  let cusResult = "";
  for (let x in storage.customer) {
    if (storage.customer[x].name == customerVal) {
      cusResult = storage.customer[x].no + "";
    }
  }

  title = $("#" + formId + "_title").val();

  //content = CKEDITOR.instances[formId + "_content"].getData();
  $("#" + formId + "_content").attr("data-detail", content);
  // content = $("#" + formId + "_content").val();
  readable = $("input[name=authority]:checked").val();
  appDoc = $(".reportInsertForm").html();
  appDoc = appDoc
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("\t", "")
    .replaceAll('"', '\\"');
  let my = storage.my;
  dept = storage.user[my].deptId[0];

  let temp;
  if (storage.reportDetailData != undefined) {
    temp = storage.reportDetailData.docNo;
  } else {
    temp = null;
  }

  for (let i = 0; i < $("." + formId + "_examine").length; i++) {
    appLine.push([0, $("." + formId + "_examine")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_agree").length; i++) {
    appLine.push([1, $("." + formId + "_agree")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_approval").length; i++) {
    appLine.push([2, $("." + formId + "_approval")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_conduct").length; i++) {
    appLine.push([3, $("." + formId + "_conduct")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_refer").length; i++) {
    appLine.push([4, $("." + formId + "_refer")[i].dataset.detail]);
  }



  let data = {
    title: title,
    sopp: soppResult,
    dept: dept,
    customer: cusResult,
    attached: storage.attachedList === undefined ? [] : storage.attachedList,
    content: content,
    appLine: appLine,
    appDoc: appDoc,
    formId: formId,
    readable: readable,
    temp: temp,
    // related: related,
  };
  console.log(data);
  data = JSON.stringify(data);
  data = cipher.encAes(data);

  if ($(".createLineBtn").css("display") == "none") {
    alert("결재 문서 양식을 선택하세요");
  } else if (
    formId != "doc_Form_Pur" &&
    detailType == undefined &&
    formId != "doc_Form_Dip" &&
    detailType == undefined &&
    formId != "doc_Form_leave" &&
    detailType == undefined &&
    formId != "doc_Form_extension" &&
    detailType == undefined &&
    formId != "doc_Form_SalesReport" &&
    detailType == undefined
  ) {
    alert("결재문서 상세 타입을 선택하세요");
  } else if (title == "") {
    alert("제목을 입력하세요");
  } else if ($("#" + formId + "_line").html() == "결재선") {
    alert("결재선을 생성하세요");
  } else if (
    (formId == "doc_Form_leave" || formId == "doc_Form_extension") &&
    $("#" + formId + "_type").val() == ""
  ) {
    alert("종류를 선택하세요");
  } else if (
    (formId == "doc_Form_leave" || formId == "doc_Form_extension") &&
    ($("#" + formId + "_from").val() == "" ||
      $("#" + formId + "_to").val() == "" ||
      $("#" + formId + "_fromTime").val() == "" ||
      $("#" + formId + "_toTime").val() == "")
  ) {
    alert("기간을 설정하세요");
  } else {
    $.ajax({
      url: "/api/gw/app/doc",
      method: "post",
      data: data,
      dataType: "json",
      contentType: "text/plain",
      success: (result) => {
        if (result.result === "ok") {
          alert("기안 완료");
          location.href = "/gw/mydraft";
        } else {
          alert(result.msg);
        }
      },
    });
  }
}























function getTotalCount() {


  let totalCount = Number(0);
  for (let i = 0; i < $(".inTotal").length; i++) {
    if ($(".inTotal")[i].dataset.detail != undefined) {
      totalCount += Number($(".inTotal")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
    } else {
      totalCount += 0;
    }
  }

  $(".inSumAllTotal").val(Number(totalCount).toLocaleString() + "원");
  $(".inSumAllTotal").attr("data-detail", Number(totalCount).toLocaleString() + "원");


  let totalCount2 = Number(0);
  for (let i = 0; i < $(".outTotal").length; i++) {
    if ($(".inTotal")[i].dataset.detail != undefined) {
      totalCount2 += Number($(".outTotal")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
    } else {
      totalCount2 += 0;
    }

  }

  $(".outSumAllTotal").val(Number(totalCount2).toLocaleString() + "원");
  $(".outSumAllTotal").attr("data-detail", Number(totalCount2).toLocaleString() + "원");



  let profit, profitper;
  if ($(".outSumAllTotal").val() != "" && $(".inSumAllTotal").val() != "") {
    profit = Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "")) - Number($(".inSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
    profitper = (profit / Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""))) * 100;
    $(".doc_Form_SalesReport_profit").val(Number(profit).toLocaleString() + "원");
    $(".doc_Form_SalesReport_profit").attr("data-detail", Number(profit).toLocaleString() + "원");
    $(".doc_Form_SalesReport_profitper").val(Number(profitper).toLocaleString() + "%");
    $(".doc_Form_SalesReport_profitper").attr("data-detail", Number(profitper).toLocaleString() + "%");
  }

}
//거래처 데이더리스트 가져오는 함수 
function setCusDataList() {
  let id = "doc_Form_SalesReport";

  let target = $("." + id + "_customer");
  for (let i = 0; i < target.length; i++) {
    let html = $("." + id + "_customer")[i].innerHTML;
    let x;
    let dataListHtml = "";

    // 거래처 데이터 리스트 만들기
    dataListHtml = "<datalist id='_customer'>";
    for (x in storage.customer) {
      dataListHtml +=
        "<option data-value='" +
        x +
        "' value='" +
        storage.customer[x].name +
        "'></option> ";
    }
    dataListHtml += "</datalist>";
    html += dataListHtml;
    $("." + id + "_customer")[i].innerHTML = html;
    $("." + id + "_customer").attr("list", "_customer");
  }
}

//자주쓰는 결재선 데이터 가져옴 
function getSavedLine() {
  $.ajax({
    url: "/api/gw/app/savedLine/" + storage.my,
    method: "get",
    dataType: "json",
    cache: false,
    success: (result) => {
      let savedLine;
      if (result.result == "ok") {
        savedLine = cipher.decAes(result.data);
        savedLine = JSON.parse(savedLine);
        storage.estsavedLine = savedLine;
        setSavedLinedata();
      } else {
        alert("자주쓰는 결재선을 가져오는데 실패함 ");
      }
    },
  });
}


function setSavedLinedata() {
  let target = $(".savedLineContainer");
  let savedLine = storage.estsavedLine;
  let html =
    "<select name='saveLineSelect'><option value='null'>-선택-</option>";
  for (let i = 0; i < savedLine.length; i++) {
    html +=
      "<option value='" +
      savedLine[i].no +
      "'>" +
      savedLine[i].title +
      "</option>";
  }
  html += "</select>";
  target.html(html);
}


// 항목 데이터 셋 하는 함수 
function setProductData() {
  let formId = "doc_Form_SalesReport";
  let targetHtml = $("." + formId + "_product")[0].innerHTML;
  let y;
  let productListhtml = "";
  productListhtml = "<datalist id='_product'>";
  for (y in storage.productList) {
    productListhtml +=
      "<option data-value='" +
      storage.productList[y].no +
      "' value='" +
      storage.productList[y].product +
      "'></option> ";
  }

  targetHtml += productListhtml;
  $("." + formId + "_product")[0].innerHTML = targetHtml;
  $("." + formId + "_product").attr("list", "_product");


}

// 영업기회 데이터 리스트 셋하는 함수 
function setSoppList(formId) {
  let soppTarget = $(".infoContent")[3];
  let soppHtml = soppTarget.innerHTML;
  let soppListHtml = "";

  soppListHtml = "<datalist id='_infoSopp'>";

  for (let i = 0; i < storage.soppList.length; i++) {
    soppListHtml +=
      "<option data-value='" +
      storage.soppList[i].no +
      "' value='" +
      storage.soppList[i].title +
      "'></option> ";
  }

  soppListHtml += "</datalist>";
  soppHtml += soppListHtml;
  soppTarget.innerHTML = soppHtml;
  $("#" + formId + "_sopp").attr("list", "_infoSopp");


  if (formId == "doc_Form_Resolution" && $(".btnDiv").children.length == 2) {
    $(".btnDiv").append(
      "<button onclick='getCardDetails()'>법인카드 내역</button>"
    );
  }

}


function createLine() {
  let formId = "doc_Form_SalesReport";

  let no = $("select[name='saveLineSelect']").val();
  let savedLineData = storage.estsavedLine;
  let appLine;
  for (let i = 0; i < savedLineData.length; i++) {
    if (savedLineData[i].no == no) {
      appLine = savedLineData[i].appLine;
    }
  }
  let typeLine = [[], [], [], [], []];

  for (let i = 0; i < typeLine.length; i++) {
    for (let j = 0; j < appLine.length; j++) {
      if (i == appLine[j][0]) {
        typeLine[i].push(appLine[j][1]);
      }
    }
  }

  console.log(typeLine);

  let data = storage.estmVerList[storage.estmVerList.length - 1];
  let writer = data.writer;

  // line grid container 안 닫음 
  let lineData = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작 성</div>" +
    "<div class='lineSet'>" +
    "<div class='twoBorder'><input disabled class='inputsAuto' style='text-align:center' value ='" +
    storage.userRank[storage.user[writer].rank][0] +
    "'></div>" +
    "<div class='twoBorder'><input class='inputsAuto " +
    formId +
    "_writer' style='text-align:center' disabled type='text'  data-detail='" +
    writer +
    "' value='" +
    storage.user[writer].userName +
    "'></div>" +
    "<div class='twoBorder'><input disabled class='inputsAuto " +
    formId +
    "_writer_status' style='text-align:center'  data-detail='' type='text' ></div>" +
    "<div class='dateBorder'><input disabled class='inputsAuto " +
    formId +
    "_writer_approved'  data-detail='' type='text' value=''></div></div></div>";
  let titleArr = ["검 토", "결 재", "수 신", "참 조"];
  let titleId = ["examine", "approval", "conduct", "refer"];
  let testHtml2 = "<div class='lineGridContainer'>";

  for (let i = 0; i < typeLine.length; i++) {
    if (typeLine[i].length != 0 && i < 2) {
      lineData +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
    } else if (typeLine[i].length != 0 && i == 2) {
      testHtml2 +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";

    }

    for (let j = 0; j < typeLine[i].length; j++) {
      // 수신인 경우 
      if (i == 2) {
        testHtml2 +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[typeLine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[typeLine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[typeLine[i][j]].userName +
          "' data-detail='" +
          storage.user[typeLine[i][j]].userNo +
          "'/></div>" +
          "<div class='twoBorder'><input type='text'  disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_approved" +
          "' value='' data-detail=''/></div></div>";
      } else {
        lineData +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled  style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[typeLine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[typeLine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[typeLine[i][j]].userName +
          "' data-detail='" +
          storage.user[typeLine[i][j]].userNo +
          "'/></div>" +
          "<div class='twoBorder'><input type='text'disabled style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' disabled  style='text-align:center' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_approved" +
          "' value='' data-detail=''/></div></div>";
      }
    }

    if (typeLine[i].length != 0 && i < 2) {
      lineData += "</div>";
    } else if (typeLine[i].length != 0 && i == 2) {
      testHtml2 += "</div>";
    }
  }

  lineData += "</div>";
  testHtml2 += "</div>";

  lineData += testHtml2;
  let lineTarget = $("#" + formId + "_line");
  lineTarget.html(lineData);


}

////////////////////////////////날짜 표기 관련 함수 
function getYmdSlash() {
  let d = new Date();
  return (
    (d.getFullYear() % 100) +
    "/" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "/" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
  );
}

