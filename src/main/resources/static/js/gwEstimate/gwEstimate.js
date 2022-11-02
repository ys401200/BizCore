
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
    "<div class='twoBorder'><input class='inputsAuto' value ='" +
    storage.userRank[storage.user[writer].rank][0] +
    "'></div>" +
    "<div class='twoBorder'><input class='inputsAuto " +
    formId +
    "_writer' type='text'  data-detail='" +
    writer +
    "' value='" +
    storage.user[writer].userName +
    "'></div>" +
    "<div class='twoBorder'><input class='inputsAuto " +
    formId +
    "_writer_status'  data-detail='' type='text' ></div>" +
    "<div class='dateBorder'><input class='inputsAuto " +
    formId +
    "_writer_approved'  data-detail='' type='text' value=''></div></div></div>";
    let titleArr = ["검 토", "결 재", "수 신", "참 조"];
    let titleId = ["examine", "approval", "conduct", "refer"];
    let testHtml2 = "<div class='lineGridContainer'>";

 for(let i = 0 ; i < typeLine.length; i ++) {
  if(typeLine[i].length != 0 && i < 2) {
    lineData += 
    "<div class='lineGrid'><div class='lineTitle'>" +
    titleArr[i] +
    "</div>";
  } else if (typeLine[i].length !=0 && i == 2) {
    testHtml2 +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";

  }

  for( let j = 0 ; j < typeLine[i].length ; j++) {
   // 수신인 경우 
    if (i == 2) {
      testHtml2 +=
        "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
        formId +
        "_" +
        titleId[i] +
        "_position" +
        "' value='" +
        storage.userRank[storage.user[typeLine[i][j]].rank][0] +
        "' data-detail='" +
        storage.user[typeLine[i][j]].rank +
        "'/></div>" +
        "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
        formId +
        "_" +
        titleId[i] +
        "' value='" +
        storage.user[typeLine[i][j]].userName +
        "' data-detail='" +
        storage.user[typeLine[i][j]].userNo +
        "'/></div>" +
        "<div class='twoBorder'><input type='text'  disabled class='inputsAuto " +
        formId +
        "_" +
        titleId[i] +
        "_status' value='' data-detail=''/></div>" +
        "<div class='dateBorder'><input type='text' disabled class='inputsAuto " +
        formId +
        "_" +
        titleId[i] +
        "_approved" +
        "' value='' data-detail=''/></div></div>";
    } else {
      lineData += 
      "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
      formId +
      "_" +
      titleId[i] +
      "_position" +
      "' value='" +
      storage.userRank[storage.user[typeLine[i][j]].rank][0] +
      "' data-detail='" +
      storage.user[typeLine[i][j]].rank +
      "'/></div>" +
      "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
      formId +
      "_" +
      titleId[i] +
      "' value='" +
      storage.user[typeLine[i][j]].userName +
      "' data-detail='" +
      storage.user[typeLine[i][j]].userNo +
      "'/></div>" +
      "<div class='twoBorder'><input type='text'disabled class='inputsAuto " +
      formId +
      "_" +
      titleId[i] +
      "_status' value='' data-detail=''/></div>" +
      "<div class='dateBorder'><input type='text' disabled  class='inputsAuto " +
      formId +
      "_" +
      titleId[i] +
      "_approved" +
      "' value='' data-detail=''/></div></div>";
    }
  }

  if (typeLine[i].length != 0 && i < 2) {
    lineData+= "</div>";
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

