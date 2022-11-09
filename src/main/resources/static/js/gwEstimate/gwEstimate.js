// let soppNo = 10005548;
let soppNo = "10005635";
init();
prepareForm();




function prepareForm() {
  let aesKey, aesIv;

  // 보안 키 세팅
  aesKey = localStorage.getItem("aesKey");
  aesIv = localStorage.getItem("aesIv");
  if (aesKey !== undefined && aesKey !== null) cipher.aes.key = aesKey;
  if (aesIv !== undefined && aesIv !== null) cipher.aes.iv = aesIv;
  // getProductList();
  // getEstmVerList(estmNo);
  getSoppDetailData(soppNo);
  ckeditor.config.readOnly = false;
  window.setTimeout(setEditor, 100);
  getSavedLine();
} // End of prepare()



function getSoppDetailData(soppNo) {
  let url;
  url = apiServer + "/api/sopp/" + soppNo;

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
        storage.soppDetailData = list;
        window.setTimeout(setEstData, 500);

      } else {
        console.log(data.msg);
      }
    }
  });
}





// function getProductList() {
//   let url;
//   url = apiServer + "/api/estimate/item"

//   $.ajax({
//     "url": url,
//     "method": "get",
//     "dataType": "json",
//     "cache": false,
//     success: (data) => {
//       let list, x;
//       if (data.result === "ok") {
//         list = data.data;
//         list = cipher.decAes(list);
//         list = JSON.parse(list);
//         storage.productList = list;

//       } else {
//         console.log(data.msg);
//       }
//     }
//   });
// } // End of getEstimateList()


// function getSoppData() {

//   let soppNo = storage.estmVerList[storage.estmVerList.length - 1].related.parent.split(":")[1] * 1;
//   $.ajax({
//     "url": "/api/sopp/" + soppNo,
//     "method": "get",
//     "dataType": "json",
//     "cache": false,
//     success: (data) => {
//       let list, x;
//       if (data.result === "ok") {
//         list = data.data;
//         list = cipher.decAes(list);
//         list = JSON.parse(list);
//         storage.soppDetail = list;

//       } else {
//         console.log(data.msg);
//       }
//     }

//   })
// }



// // 견적 데이터 가져오는 함수 
// function getEstmVerList(estmNo) {
//   let url;
//   url = apiServer + "/api/estimate/" + estmNo;

//   $.ajax({
//     "url": url,
//     "method": "get",
//     "dataType": "json",
//     "cache": false,
//     success: (data) => {
//       let list, x;
//       if (data.result === "ok") {
//         list = data.data;
//         list = cipher.decAes(list);
//         list = JSON.parse(list);
//         for (x = 0; x < list.length; x++)	list[x].doc = cipher.decAes(list[x].doc);
//         storage.estmVerList = list;
//         setEstData();
//         getSavedLine();
//         getSoppData();

//       } else {
//         console.log(data.msg);
//       }
//     }
//   });

// } // End of getEstimateList()


//데이터 리스트 셋하는 함수 
function setEstData() {


  //기본 정보 세팅 
  let formId = "doc_Form_SalesReport";

  let soppDetail = storage.soppDetailData;
  let writer, created, sopp, infoCustomer, title, picOfCustomer, endUser, status, progress, contType, targetDate, soppType, expectedSales;

  writer = storage.my;
  created = getYmdSlash();
  sopp = (soppDetail.title === null || soppDetail.title === undefined || soppDetail.title === "") ? "" : soppDetail.title;
  infoCustomer = (soppDetail.customer === null || soppDetail.customer === undefined || soppDetail.customer === "" || soppDetail.customer === 0) ? "" : soppDetail.customer;
  title = (soppDetail.title === null || soppDetail.title === undefined || soppDetail.title === "") ? "" : soppDetail.title;
  picOfCustomer = (soppDetail.picOfCustomer === null || soppDetail.picOfCustomer == 0 || soppDetail.picOfCustomer === "") ? "" : soppDetail.picOfCustomer;
  endUser = (soppDetail.endUser === null || soppDetail.endUser == 0 || soppDetail.endUser === "") ? "" : storage.customer[soppDetail.endUser].name;
  status = (soppDetail.status === null || soppDetail.status === "") ? "" : soppDetail.status;
  progress = (soppDetail.progress === null || soppDetail.progress === "") ? "" : soppDetail.progress + "%";
  contType = (soppDetail.contType === null || soppDetail.contType === "") ? "" : soppDetail.contType;
  soppType = (soppDetail.soppType === null || soppDetail.soppType === "") ? "" : soppDetail.soppType;
  expectedSales = (soppDetail.expectedSales === null || soppDetail.expectedSales === "") ? "" : soppDetail.expectedSales.toLocaleString() + "원"


  $("#" + formId + "_writer").val(storage.user[writer].userName);
  $("#" + formId + "_created").val(getYmdSlash());
  $("#" + formId + "_sopp").val(sopp);
  $("#" + formId + "_infoCustomer").val(storage.customer[infoCustomer].name);
  $("#" + formId + "_title").val(title + " 수주판매 보고");
  $("#" + formId + "_custmemberName").val(picOfCustomer);
  $("#" + formId + "_endCustName").val(endUser);
  $("#" + formId + "_soppStatus").val(status);
  $("#" + formId + "_soppRate").val(progress);
  $("#" + formId + "_cntrctMtn").val(contType);

  if (soppDetail.targetDate != null || soppDetail.targetDate != "" || soppDetail.targetDate != 0) {
    $("#" + formId + "_targetDate").val(getYmdHypen(soppDetail.targetDate));
  }

  $("#" + formId + "_soppType").val(soppType);
  $("#" + formId + "_soppTargetAmt").val(expectedSales);

  // 매입 매출의 항목 세팅 
  let items = storage.soppDetailData.trades;
  let inSumTarget = $(".inSum");
  let outSumTarget = $(".outSum");
  let inHtml = "";
  let outHtml = "";

  for (let i = 0; i < items.length; i++) {
    if (items[i].type == '1101') {
      inHtml = inSumTarget.html();
      inHtml += "<div class='detailcontentDiv'><input value='매입' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  class='inputs doc_Form_SalesReport_type'></input>"
      inHtml += "<input type='date'  onchange='this.dataset.detail=this.value;' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' data-detail='" + getYmdHypen(items[i].created) + "' value='" + getYmdHypen(items[i].created) + "'  class='inputs doc_Form_SalesReport_date'></input>"
      inHtml += "<input type='text'  onkeyup='this.dataset.detail=this.value'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + storage.customer[items[i].customer].name + "' value='" + storage.customer[items[i].customer].name + "' class='inputs inCus doc_Form_SalesReport_customer'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='" + items[i].title + "' value='" + items[i].title + "' onkeyup='this.dataset.detail=this.value' class='inputs inProduct doc_Form_SalesReport_product'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].netPrice.toLocaleString() + "' value='" + items[i].netPrice.toLocaleString() + "'onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inPrice doc_Form_SalesReport_price'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].quantity.toLocaleString() + "' value='" + items[i].quantity.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inQuantity doc_Form_SalesReport_quantity'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].amount.toLocaleString() + "' value='" + items[i].amount.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs doc_Form_SalesReport_amount'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].tax.toLocaleString() + "' value='" + items[i].tax.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inTax doc_Form_SalesReport_tax'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail='" + items[i].total.toLocaleString() + "' value='" + items[i].total.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inTotal inputs doc_Form_SalesReport_total'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark' data-detail='" + items[i].remark + "' value='" + items[i].remark + "'></input>"
      inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_vatSerial' data-detail='" + items[i].vatSerial + "' value='" + items[i].vatSerial + "'></input></div>"

    } else {
      outHtml = outSumTarget.html();
      outHtml += "<div class='detailcontentDiv'><input value='매출' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_type'></input>"
      outHtml += "<input type='date' onchange='this.dataset.detail=this.value;' data-detail='" + getYmdHypen(items[i].created) + "' value='" + getYmdHypen(items[i].created) + "'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_date'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + storage.customer[items[i].customer].name + "' value='" + storage.customer[items[i].customer].name + "' onkeyup='this.dataset.detail=this.value'  class='outCus inputs doc_Form_SalesReport_customer'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + items[i].title + "' value='" + items[i].title + "' onkeyup='this.dataset.detail=this.value'  data-detail='' value='" + items[i].product + "' class='inputs outProduct doc_Form_SalesReport_product'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail='" + items[i].netPrice.toLocaleString() + "' value='" + items[i].netPrice.toLocaleString() + "'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  class='inputs outPrice doc_Form_SalesReport_price'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].quantity.toLocaleString() + "' value='" + items[i].quantity.toLocaleString() + "'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs outQuantity doc_Form_SalesReport_quantity'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  data-detail='" + items[i].amount.toLocaleString() + "' value='" + items[i].amount.toLocaleString() + "'  class='inputs outAmount doc_Form_SalesReport_amount'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='" + items[i].tax.toLocaleString() + "' value='" + items[i].tax.toLocaleString() + "'  class='outTax inputs  doc_Form_SalesReport_tax'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='" + items[i].total.toLocaleString() + "' value='" + items[i].total.toLocaleString() + "' class='outTotal inputs doc_Form_SalesReport_total'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark'  data-detail='" + items[i].remark + "' value='" + items[i].remark + "'></input>"
      outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_vatSerial' data-detail='" + items[i].vatSerial + "' value='" + items[i].vatSerial + "'></input></div>"

    }

  }
  inSumTarget.html(inHtml);
  outSumTarget.html(outHtml);

  let target = $(".mainDiv")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].dataset.detail = inputsArr[i].value
    }
  }

  getTotalCount();

  // 일정 데이터 셋팅 
  let techHtml = $(".techSche").html();
  let salesHtml = $(".salesSche").html();
  let sche = storage.soppDetailData.schedules;
  for (let i = 0; i < sche.length; i++) {
    if (sche[i].job == "tech") {
      techHtml += "<div class='insertedTechSche'>";
      techHtml += "<input type='date' class='techDate'  data-detail='" + getYmdHypen(sche[i].created) + "' value='" + getYmdHypen(sche[i].created) + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      techHtml += "<input type='text' class='techType' data-detail='" + storage.code.etc[sche[i].type] + "' value='" + storage.code.etc[sche[i].type] + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      techHtml += "<input type='text' class='techTitle' data-detail='" + sche[i].title + "' value='" + sche[i].title + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      techHtml += "<input type='text' class='techContent' data-detail='" + sche[i].content + "' value='" + sche[i].content + "'  style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      techHtml += "<input type='text' class='techWriter' data-detail='" + storage.user[sche[i].writer].userName + "' value='" + storage.user[sche[i].writer].userName + "'  style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      techHtml += "<input type='text' class='techPlace' data-detail='" + sche[i].place + "' value='" + sche[i].place + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";
    } else {
      salesHtml += "'<div class='insertedSalesSche'>";
      salesHtml += "<input type='date' class='salesDate'  data-detail='" + getYmdHypen(sche[i].created) + "' value='" + getYmdHypen(sche[i].created) + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      salesHtml += "<input type='text' class='salesType' data-detail='" + storage.code.etc[sche[i].type] + "' value='" + storage.code.etc[sche[i].type] + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      salesHtml += "<input type='text' class='salesTitle' data-detail='" + sche[i].title + "' value='" + sche[i].title + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      salesHtml += "<input type='text' class='salesContent' data-detail='" + sche[i].content + "' value='" + sche[i].content + "'  style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      salesHtml += "<input type='text' class='salesWriter' data-detail='" + storage.user[sche[i].writer].userName + "' value='" + storage.user[sche[i].writer].userName + "'  style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
      salesHtml += "<input type='text' class='salesPlace' data-detail='" + sche[i].place + "' value='" + sche[i].place + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";
    }
  }

  $(".techSche").html(techHtml);
  $(".salesSche").html(salesHtml);

  // 파일 데이터 셋팅 

  // let files = storage.soppDetailData.attached;
  // if(files.length !=0 ) {
  //   for(let i = 0 ; i <files.length; i++) {

  //   }
  // }


  $(".inputs").attr("disabled", "disabled");

}




//기안하기 
function reportInsert() {

  let title, content, readable, formId, appDoc, dept;
  let appLine = [];

  formId = "doc_Form_SalesReport";

  // ////////// sopp 
  // let soppVal = $("#" + formId + "_sopp").val();
  // let customerVal = $("#" + formId + "_infoCustomer").val();
  // let soppResult = "";
  // for (let x in storage.soppList) {
  //   if (storage.soppList[x].title == soppVal) {
  //     soppResult = storage.soppList[x].no + "";
  //   }
  // }

  // let cusResult = "";
  // for (let x in storage.customer) {
  //   if (storage.customer[x].name == customerVal) {
  //     cusResult = storage.customer[x].no + "";
  //   }
  // }

  title = $("#" + formId + "_title").val();

  content = CKEDITOR.instances[formId + "_content"].getData();
  $("#" + formId + "_content").attr("data-detail", content);
  // content = $("#" + formId + "_content").val();
  readable = "dept";
  appDoc = $(".estDiv").html();
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


  // let inItems = [];
  // let outItems = [];
  // let outProductNo;


  // for (let j = 0; j < $(".outProduct").length; j++) {

  //   for (let i = 0; i < storage.productList.length; i++) {
  //     if (storage.productList[i].product == $(".outProduct")[j].value) {
  //       outProductNo = storage.productList[i].no;
  //     }
  //   }

  //   let tt = {
  //     "outCustomer": storage.soppDetail.customer,
  //     "outProduct": outProductNo * 1,
  //     "outPrice": $(".outPrice")[j].value * 1,
  //     "outQuantity": $(".outQuantity")[j].value * 1,
  //     "tax": $(".outTax")[j].value * 1
  //   };
  //   outItems.push(tt);
  // }

  // for (let j = 0; j < $(".inProduct").length; j++) {
  //   for (let i = 0; i < storage.productList.length; i++) {
  //     if (storage.productList[i].product == $(".inProduct")[j].value) {
  //       outProductNo = storage.productList[i].no;
  //     }
  //   }

  //   let customer;
  //   for (let x in storage.customer) {
  //     if (storage.customer[x].name == storage.estmVerList[3].related.estimate.items[j].supplier) {
  //       customer = storage.customer[x].no + "";
  //     }
  //   }

  //   let tt = {
  //     "inCustomer": customer,
  //     "inProduct": outProductNo * 1,
  //     "inPrice": $(".outPrice")[j].value * 1,
  //     "inQuantity": $(".inQuantity")[j].value * 1,
  //     "inTax": $(".outTax")[j].value * 1
  //   };
  //   inItems.push(tt);
  // }


  let related = {
    "next": "",
    "parent": "",
    "previous": "sopp:" + soppNo + "",
    // "outSumAllTotal": $(".outSumAllTotal").val() * 1,
    // "profit": $("." + formId + "_profit").val() * 1,
    // "outItems": outItems,
    // "inItems": inItems
  }

  related = JSON.stringify(related);

  let data = {
    title: title,
    sopp: soppNo,
    dept: dept,
    customer: storage.soppDetailData.customer + "",
    attached: storage.attachedList === undefined ? [] : storage.attachedList,
    content: content,
    appLine: appLine,
    appDoc: appDoc,
    formId: formId,
    readable: readable,
    temp: temp,
    related: related,
  };

  console.log(data);
  data = JSON.stringify(data);
  data = cipher.encAes(data);

  let target = $(".mainDiv")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].dataset.detail = inputsArr[i].value;
    }
  }

  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.dataset.detail = textAreaArr.value;

  if (target.getElementsByTagName("select").length > 0) {
    let selectArr = target.getElementsByTagName("select")[0];
    selectArr.dataset.detail = selectArr.value;
  }


  if (title == "") {
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
          window.close('/gw/estimate');
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
    if (Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "")) != 0) {
      profitper = (profit / Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""))) * 100;
    } else {
      profitper = 0;
    }

    console.log(profit);
    console.log(profitper + "확인");
    $(".doc_Form_SalesReport_profit").val(Number(profit).toLocaleString() + "원");
    $(".doc_Form_SalesReport_profit").attr("data-detail", Number(profit).toLocaleString() + "원");
    $(".doc_Form_SalesReport_profitper").val(Number(profitper) + "%");
    $(".doc_Form_SalesReport_profitper").attr("data-detail", Number(profitper) + "%");
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

  //영업기회 정보 세팅 


  $("#" + formId + "_sopp").val(storage.soppDetail.title); // 영업기회 
  $("#" + formId + "_infoCustomer").val(storage.customer[storage.soppDetail.customer].name); // 매출처 
  if (storage.cip[storage.soppDetail.picOfCustomer] != undefined) {
    $("#" + formId + "_custmemberName").val(storage.cip[storage.soppDetail.picOfCustomer].name);//매출처 담당자 
  }

  $("#" + formId + "_endCustName").val(storage.customer[storage.soppDetail.endUser].name); // 엔드유저 
  $("#" + formId + "_soppStatus").val(storage.soppDetail.status); // 진행단계 
  $("#" + formId + "_soppRate").val(storage.soppDetail.progress + "%"); // 가능성 
  $("#" + formId + "_cntrctMtn").val(storage.soppDetail.contType);//계약 구분 
  if (storage.cip[storage.soppDetail.targetDate] != undefined) {
    $("#" + formId + "_targetDate").val(getYmdHypen(storage.soppDetail.targetDate)); // 매출 예정일 
  }
  $("#" + formId + "_soppType").val(storage.soppDetail.soppType); // 판매방식 
  $("#" + formId + "_soppTargetAmt").val(storage.soppDetail.expectedSales.toLocaleString() + "원"); // 예상매출 
  $("#" + formId + "_title").val(storage.soppDetail.title + " 수주판매보고");
  $(".outCus").val(storage.customer[storage.soppDetail.customer].name);



  let target = $(".mainDiv")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].dataset.detail = inputsArr[i].value
    }
  }
  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.dataset.detail = textAreaArr.value;
  if (target.getElementsByTagName("select").length > 0) {
    for (let i = 0; i < target.getElementsByTagName("select").length; i++) {
      let selectArr = target.getElementsByTagName("select")[i];
      selectArr.dataset.detail = selectArr.value;
    }
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


  let writer = storage.my;

  // line grid container 안 닫음 
  let lineData = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작 성</div>" +
    "<div class='lineSet'>" +
    "<div class='twoBorder'><input disabled class='inputsAuto' style='text-align:center' value ='" +
    storage.userRank[storage.user[storage.my].rank][0] +
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

function getYmdHypen(date) {
  let d = new Date(date);
  return (
    (d.getFullYear()) +
    "-" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "-" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
  );
}