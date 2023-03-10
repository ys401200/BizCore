let R = {};
$(document).ready(() => {
  estInit();
  prepareForm();
});


function estInit() {
  cipher.aes.iv = localStorage.getItem("aesIv");
  cipher.aes.key = localStorage.getItem("aesKey");
  cipher.rsa.public.modulus = localStorage.getItem("rsaModulus");
  cipher.rsa.public.exponent = localStorage.getItem("rsaExponent");

  msg.cnt = document.getElementsByClassName("msg_cnt")[0];

  getCommonCode();
  getUserMap();
  getDeptMap();
  getBasicInfo();
  getCustomer();
  getUserRank();
  getPersonalize();
  noteLiveUpdate();
  getStorageList();

}




function prepareForm() {
  let aesKey, aesIv;
  // 보안 키 세팅
  aesKey = localStorage.getItem("aesKey");
  aesIv = localStorage.getItem("aesIv");
  if (aesKey !== undefined && aesKey !== null) cipher.aes.key = aesKey;
  if (aesIv !== undefined && aesIv !== null) cipher.aes.iv = aesIv;
  getSoppDetailData();
  getSavedLine();
  getEsimateNo();
  getItem();
  getNextContNo();
  ckeditor.config.readOnly = false;
  window.setTimeout(setEditor(document.getElementsByClassName("sopp-desc")[0]), 100);



} // End of prepare()


function getSoppDetailData() {

  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  let url;
  url = apiServer + "/api/project/sopp/" + splitArr[3];


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
        window.setTimeout(setEstData, 1000);
        console.log("확인");
      } else {
        console.log(data.msg);
        console.log("실패");
      }
    }
  });





  // fetch(apiServer + "/api/project/sopp/" + splitArr[3])
  //   .catch((error) => console.log("error:", error))
  //   .then(response => response.json())
  //   .then(response => {
  //     let data;
  //     if (response.result === "ok") {
  //       data = response.data;
  //       data = cipher.decAes(data);
  //       data = JSON.parse(data);
  //       R.sopp = new Sopp2(data.sopp);
  //       R.sopp.getSchedule();
  //     } else {
  //       console.log(response.msg);
  //     }
  //   });

}


function getItem() {
  let url;
  url = apiServer + "/api/estimate/item";

  $.ajax({
    "url": url,
    "method": "get",
    "dataType": "json",
    "cache": false,
    success: (data) => {
      let list;
      if (data.result === "ok") {
        list = data.data;
        list = cipher.decAes(list);
        list = JSON.parse(list);
        storage.item = list;

      } else {
        console.log(data.msg);
      }
    }
  });
} // End of getItem();


//데이터 리스트 셋하는 함수 
function setEstData() {
  R.sopp = opener.window.sopp;

  //기본 정보 세팅 
  let formId = "doc_Form_SalesReport";

  let soppDetail = storage.soppDetailData.sopp;
  let writer, sopp, infoCustomer, partner, title, expectedDate, expectedSales;

  writer = storage.my;
  created = getYmdSlash();
  sopp = (soppDetail.title === null || soppDetail.title === undefined || soppDetail.title === "") ? "" : soppDetail.title;
  infoCustomer = (soppDetail.customer === null || soppDetail.customer === undefined || soppDetail.customer === "" || soppDetail.customer === 0) ? "" : storage.customer[soppDetail.customer].name;
  partner = R.sopp.partner === undefined ? "" : storage.customer[R.sopp.parter].name;
  title = (soppDetail.title === null || soppDetail.title === undefined || soppDetail.title === "") ? "" : soppDetail.title;
  expectedSales = (soppDetail.expectedSales === null || soppDetail.expectedSales === "") ? "" : soppDetail.expectedSales.toLocaleString() + "원"
  expectedDate = (soppDetail.expectedDate === undefined || soppDetail.expectedDate === "" || soppDetail.expectedDate == 0) ? "" : getYmdHypen(soppDetail.expectedDate);

  $("#" + formId + "_writer").val(storage.user[writer].userName);
  $("#" + formId + "_created").val(getYmdSlash());
  $("#" + formId + "_sopp").val(sopp);
  $("#" + formId + "_infoCustomer").val(infoCustomer);
  $("#" + formId + "_title").val(title + " 수주판매 보고");

  if (soppDetail.expectedDate != null && soppDetail.expectedDate != "" && soppDetail.expectedDate != 0 && soppDetail.expectedDate != undefined) {
    $("#" + formId + "_expectedDate").val(expectedDate);
  }

  $("#" + formId + "_soppTargetAmt").val(expectedSales);


  // 매입 매출의 항목 세팅 
  let items = storage.items;
  let inSumTarget = $(".inSum");
  let outSumTarget = $(".outSum");
  let inHtml = "";
  let outHtml = "";

  let itemNos = [];
  for (let k = 0; k < storage.item.length; k++) {
    itemNos.push([storage.item[k].no, storage.item[k].product]);
  }

  for (let i = 0; i < storage.items.length; i++) {
    // if (items[i].type == "purchase") {
    //   inHtml = inSumTarget.html();
    //   inHtml += "<div class='detailcontentDiv'><input value='매입' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  class='inputs doc_Form_SalesReport_type'></input>"
    //   inHtml += "<input type='date'  onchange='this.dataset.detail=this.value;' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' data-detail='" + getYmdHypen(items[i].created) + "' value='" + getYmdHypen(items[i].created) + "'  class='inputs doc_Form_SalesReport_date'></input>"
    //   inHtml += "<input type='text'  onkeyup='this.dataset.detail=this.value'  style='text-overflow:ellipsis;padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + storage.customer[items[i].customer].name + "' value='" + storage.customer[items[i].customer].name + "' class='inputs inCus doc_Form_SalesReport_customer'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='" + items[i].title + "' value='" + items[i].title + "' onkeyup='this.dataset.detail=this.value' class='inputs inProduct doc_Form_SalesReport_product'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].price.toLocaleString() + "' value='" + items[i].price.toLocaleString() + "'onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inPrice doc_Form_SalesReport_price'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].qty.toLocaleString() + "' value='" + items[i].qty.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inQuantity doc_Form_SalesReport_quantity'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + (items[i].price * items[i].qty).toLocaleString() + "' value='" + (items[i].price * items[i].qty).toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inAmount inputs doc_Form_SalesReport_amount'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].vat.toLocaleString() + "' value='" + items[i].vat.toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs inTax doc_Form_SalesReport_tax'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail='" + ((items[i].price * items[i].qty) + items[i].vat).toLocaleString() + "' value='" + ((items[i].price * items[i].qty) + items[i].vat).toLocaleString() + "' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inTotal inputs doc_Form_SalesReport_total'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark' data-detail='" + items[i].remark + "' value='" + items[i].remark + "'></input>"
    //   inHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_vatSerial' data-detail='" + items[i].taxbill + "' value='" + items[i].taxbill + "'></input></div>"
    //   inSumTarget.html(inHtml);
    // } else {
    let vat, itemTitle;

    if (items[i].vat == "true") {
      vat = items[i].price * items[i].quantity * 0.1;
    } else {
      vat = 0;
    }



    if (isNaN(storage.items[i].item * 1)) { // NaN인 경우 무조건 텍스트 그대로 입력함 
      itemTitle = storage.items[i].item;
    } else {// 문자열인 경우 
      itemTitle = storage.items[i].item;
      for (let x = 0; x < itemNos.length; x++) {
        if (itemNos[x][0] == storage.items[i].item * 1) {
          itemTitle = itemNos[x][1];
        }

      }
    }


    outHtml = outSumTarget.html();
    outHtml += "<div class='detailcontentDiv'><input value='매출' disabled style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_type'></input>"
    // outHtml += "<input type='date' onchange='this.dataset.detail=this.value;' data-detail='" + items[i].remark + "' value='" + items[i].remark + "'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_SalesReport_date'></input>"
    outHtml += "<input type='text' style='text-overflow:ellipsis;padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + storage.soppDetailData.sopp.customer + "' value='" + storage.customer[storage.soppDetailData.sopp.customer].name + "' onkeyup='this.dataset.detail=this.value'  class='outCus inputs doc_Form_SalesReport_customer'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'  data-detail='" + items[i].item + "' value='" + itemTitle + "' onkeyup='this.dataset.detail=this.value'  data-detail='' value='" + items[i].item + "' class='inputs outProduct doc_Form_SalesReport_product'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'oninput='setNum(this)' data-detail='" + items[i].price.toLocaleString() + "' value='" + items[i].price.toLocaleString() + "'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  class='inputs outPrice doc_Form_SalesReport_price'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='" + items[i].quantity.toLocaleString() + "' value='" + items[i].quantity.toLocaleString() + "'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' class='inputs outQuantity doc_Form_SalesReport_quantity'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  data-detail='" + (items[i].price * items[i].quantity).toLocaleString() + "' value='" + (items[i].price * items[i].quantity).toLocaleString() + "'  class='inputs outAmount doc_Form_SalesReport_amount'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='" + vat.toLocaleString() + "' value='" + vat.toLocaleString() + "'  class='outTax inputs  doc_Form_SalesReport_tax'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' oninput='setNum(this)' data-detail='' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' data-detail='" + ((items[i].price * items[i].quantity) + vat).toLocaleString() + "' value='" + ((items[i].price * items[i].quantity) + vat).toLocaleString() + "' class='outTotal inputs doc_Form_SalesReport_total'></input>"
    outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_remark'  data-detail='" + items[i].remark + "' value='" + items[i].remark + "'></input>"
    // outHtml += "<input type='text' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;'   data-detail='' onkeyup='this.dataset.detail=this.value' class='inputs doc_Form_SalesReport_vatSerial' data-detail='' value=''></input>"
    outHtml += "<div class='detailcontentbox'><input type='checkbox' class='detailBox'></div></div>";
    outSumTarget.html(outHtml);
    // }

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

  if (target.getElementsByTagName("select").length > 0) {
    let selectArr = target.getElementsByTagName("select");
    for (let i = 0; i < selectArr.length; i++) {
      selectArr[i].dataset.detail = selectArr[i].value;
    }

  }

  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.dataset.detail = textAreaArr.value;



  getTotalCount2();

  let scheduleList = R.sopp.schedules;

  let html = "";
  for (let i = 0; i <= scheduleList.length - 1; i++) {
    let from, type, to, title, content, writer, place, schedule;
    schedule = scheduleList[i];
    title = (schedule.title === null || schedule.title === undefined || schedule.title === "") ? "" : schedule.title;
    from = (schedule.from === null || schedule.from === undefined || schedule.from === "" || schedule.from == "0") ? "" : getYmdHypen(schedule.from);
    to = (schedule.to === null || schedule.to === undefined || schedule.to === "" || schedule.to == "0") ? "" : getYmdHypen(schedule.to);
    type = (schedule.type === null || schedule.type === undefined || schedule.type === "") ? "" : schedule.type;
    type = (type == "outside") ? "외근" : "내근";
    content = (schedule.content === null || schedule.content === undefined || schedule.content === "") ? "" : schedule.content;
    writer = (schedule.writer === null || schedule.writer === undefined || schedule.writer === "") ? "" : schedule.writer;
    place = (schedule.related.place == null || schedule.related.place == undefined || schedule.related.place == "") ? "" : schedule.related.place;
    if (place == "customer") {
      place = "고객사";
    } else if (place == "partner") {
      place = "협력사";
    } else if (place == "office") {
      place = "사무실";
    } else {
      place = "기타";
    }


    html += "<div class='insertedTechSche'>";
    html += "<div class='techDate'  data-detail='" + from + "~" + to + "' value='" + from + "~" + to + "' style='display:flex;align-items:center;justify-content:center;font-size: 0.6rem;text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'>" + from + "~" + to + "</div>";
    //html += "<input type='date' class='inputs techDate'  data-detail='" + from + "' value='" + from + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    html += "<input type='text' class='inputs techType' data-detail='" + type + "' value='" + type + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    html += "<input type='text' class='inputs techTitle' data-detail='" + title + "' value='" + title + "' style='text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    html += "<div class='techContent' data-detail='" + content + "' value='" + content + "'  style='overflow:hidden; white-space:nowrap;text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'>" + content + "</div>";
    html += "<input type='text' class='inputs techWriter' data-detail='" + storage.user[writer].userName + "' value='" + storage.user[writer].userName + "'  style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    html += "<input type='text' class='inputs techPlace' data-detail='" + place + "' value='" + place + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";

  }

  $(".techSche").html(html);



  let mtnc = opener.window.mtncData;
  let mtncHtml = "";
  let mtnctitle, product, customer, startDate, endDate, engineer, amount, note;

  for (let i = 0; i < mtnc.length; i++) {
    for (let x in storage.product) {
      if (storage.product[x].no == mtnc[i].product) {
        product = storage.product[x].name
      }
    }
    mtnctitle = mtnc[i].title;
    customer = storage.customer[mtnc[i].customer].name;
    engineer = storage.user[mtnc[i].engineer].userName;
    startDate = mtnc[i].startDate == "검수일" ? "" : mtnc[i].startDate;
    endDate = mtnc[i].startDate == "검수일" ? "" : mtnc[i].endDate;
    amount = mtnc[i].amount.toLocaleString();
    note = mtnc[i].startDate == "검수일" ? ("기간 :" + mtnc[i].endDate) : "";

    mtncHtml += "<div class='insertedMtncData'>";
    mtncHtml += "<input type='text' class='inputs mtnc-title' data-detail='" + mtnctitle + "' value='" + mtnctitle + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='text' class='inputs mtnc-product' data-detail='" + product + "' value='" + product + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='text' class='inputs mtnc-customer' data-detail='" + customer + "' value='" + customer + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='date' class='inputs mtnc-startDate' data-detail='" + startDate + "' value='" + startDate + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='date' class='inputs mtnc-endDate' data-detail='" + endDate + "' value='" + endDate + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='text' class='inputs mtnc-engineer' data-detail='" + engineer + "' value='" + engineer + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='text' class='inputs mtnc-amount' data-detail='" + amount + "' value='" + amount + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
    mtncHtml += "<input type='text' class='inputs mtnc-note' data-detail='" + note + "' value='" + note + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";

  }


  $(".mtncData").html(mtncHtml);


  // let schecreated, scheType, scheTitle, scheContent, schePlace;
  // // 일정 데이터 셋팅 
  // let techHtml = $(".techSche").html();
  // let salesHtml = $(".salesSche").html();
  // let sche = storage.soppDetailData.schedules;
  // for (let i = 0; i < sche.length; i++) {
  //   schecreated = (sche[i].created === null || sche[i].created === undefined || sche[i].created === "") ? "" : getYmdHypen(sche[i].created);
  //   scheType = (sche[i].type === null || sche[i].type === undefined || sche[i].type === "") ? "" : storage.code.etc[sche[i].type];
  //   scheTitle = (sche[i].title === null || sche[i].title === undefined || sche[i].title === "") ? "" : sche[i].title;
  //   scheContent = (sche[i].content === null || sche[i].content === undefined || sche[i].content === "") ? "" : sche[i].content;
  //   schePlace = (sche[i].place === null || sche[i].place === undefined || sche[i].place === "") ? "" : sche[i].place;


  //   if (sche[i].job == "tech") {
  //     techHtml += "<div class='insertedTechSche'>";
  //     techHtml += "<input type='date' class='techDate'  data-detail='" + schecreated + "' value='" + schecreated + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     techHtml += "<input type='text' class='techType' data-detail='" + scheType + "' value='" + scheType + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     techHtml += "<input type='text' class='techTitle' data-detail='" + scheTitle + "' value='" + scheTitle + "' style='text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     techHtml += "<input type='text' class='techContent' data-detail='" + scheContent + "' value='" + scheContent + "'  style='text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     techHtml += "<input type='text' class='techWriter' data-detail='" + storage.user[sche[i].writer].userName + "' value='" + storage.user[sche[i].writer].userName + "'  style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     techHtml += "<input type='text' class='techPlace' data-detail='" + schePlace + "' value='" + schePlace + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";
  //   } else {
  //     salesHtml += "'<div class='insertedSalesSche'>";
  //     salesHtml += "<input type='date' class='salesDate'  data-detail='" + schecreated + "' value='" + schecreated + "' style='padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     salesHtml += "<input type='text' class='salesType' data-detail='" + scheType + "' value='" + scheType + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     salesHtml += "<input type='text' class='salesTitle' data-detail='" + scheTitle + "' value='" + scheTitle + "' style='text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     salesHtml += "<input type='text' class='salesContent' data-detail='" + scheContent + "' value='" + scheContent + "'  style='text-overflow:ellipsis;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     salesHtml += "<input type='text' class='salesWriter' data-detail='" + storage.user[sche[i].writer].userName + "' value='" + storage.user[sche[i].writer].userName + "'  style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/>";
  //     salesHtml += "<input type='text' class='salesPlace' data-detail='" + schePlace + "' value='" + schePlace + "' style='text-align:center;padding:0.3em; border-bottom: 1px solid black; border-right: 1px solid black;'/></div>";
  //   }
  // }

  // $(".techSche").html(techHtml);
  // $(".salesSche").html(salesHtml);

  // 파일 데이터 셋팅 

  // let files = storage.soppDetailData.attached;
  // if(files.length !=0 ) {
  //   for(let i = 0 ; i <files.length; i++) {

  //   }
  // }


  // $(".inputs").attr("disabled", "disabled");

  let inputsArrs = target.getElementsByTagName("input");
  for (let i = 0; i < inputsArrs.length; i++) {
    let tt = inputsArrs[i]
    // $(tt).attr("disabled", "disabled");
    $(tt).css("color", "black");
  }
  let selectArrs = target.getElementsByTagName("select");
  for (let i = 0; i < selectArrs.length; i++) {
    let tt = selectArrs[i];
    $(tt).css("color", "black");
  }

  toReadMode();
  $("select[name='saveLineSelect']").attr("disabled", false);
}



// sopp번호로 견적에 있는 매출 가져옴 

function getEsimateNo() {


  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  let url;
  url = apiServer + "/api/estimate/sopp/" + splitArr[3];

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
        storage.estimate = list;
        storage.estimateNo = storage.estimate[storage.estimate.length - 1].no;
        getEstimateItems();

      } else {
        console.log(data.msg);
      }
    }
  });
} // End of getEstimateNo();


function getEstimateItems() {

  let url;
  url = apiServer + "/api/estimate/" + storage.estimateNo

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
        storage.estimateDetail = list;
        storage.items = storage.estimateDetail[storage.estimateDetail.length - 1].related.estimate.items;
      } else {
        console.log(data.msg);
      }
    }
  });
}


//기안하기 , 기안 완료되면 바로 계약 생성하기 
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
  appDoc = appDoc.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll('\\"', '"',);
  // appDoc = appDoc.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll('"', '\\"');
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


  let related = {
    "next": "",
    "parent": "",
    "previous": "sopp:" + storage.soppDetailData.sopp.no + "",
    "maintenance": opener.window.mtncData,
  }

  related = JSON.stringify(related);


  let cntrctRelated = {
    parent: "sopp:" + storage.soppDetailData.sopp.no,
  }


  let ctrtData = {
    employee: storage.my,
    customer: storage.soppDetailData.sopp.customer,
    title: storage.soppDetailData.sopp.title + "계약",
    amount: storage.soppDetailData.sopp.expectedSales,
    related: JSON.stringify(cntrctRelated),

  }

  ctrtData = JSON.stringify(ctrtData);

  let data = {
    title: title,
    sopp: storage.soppDetailData.sopp.no + "",
    dept: dept,
    customer: storage.soppDetailData.sopp.customer + "",
    attached: storage.attachedList === undefined ? [] : storage.attachedList,
    content: content,
    appLine: appLine,
    appDoc: appDoc,
    formId: formId,
    readable: readable,
    temp: temp,
    related: related,
    contract: ctrtData,
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
          console.log(storage.soppDetailData.sopp.no);

          drawDetailCont(storage.soppDetailData.sopp.no);


        } else {
          alert(result.msg);
        }
      },
    });
  }
}


function drawDetailCont(soppNo) {
  opener.window.drawDetail(soppNo);
  window.close('/gw/estimate/' + storage.soppDetailData.sopp.no);
} // End of drawDetail()


function createContract(ctrtData) {
  $.ajax({
    url: "/api/contract",
    method: "post",
    data: ctrtData,
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.result === "ok") {
        console.log("계약 자동 생성 완료");

      } else {
        console.log("계약 자동 생성 실패");
      }

    }
  })

}

function createMtnc(mtncData) {
  $.ajax({
    url: "/api/maintenance",
    method: "post",
    data: mtncData,
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.result === "ok") {
        console.log("유지보수 생성 완료");
      } else {
        console.log("유지보수 생성 실패");
      }
    }
  })
}


function getTotalCount2() {

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
    if ($(".outTotal")[i].dataset.detail != undefined) {
      totalCount2 += Number($(".outTotal")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
    } else {
      totalCount2 += 0;
    }

  }

  $(".outSumAllTotal").val(Number(totalCount2).toLocaleString() + "원");
  $(".outSumAllTotal").attr("data-detail", Number(totalCount2).toLocaleString() + "원");


  // let inAmountCount = Number(0);
  // let outAmountCount = Number(0);

  // for (let i = 0; i < $(".inAmount").length; i++) {
  //   if ($(".inAmount")[i].dataset.detail != undefined) {
  //     inAmountCount += Number($(".inAmount")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
  //     console.log("확인2");
  //   } else {
  //     console.log("확인3");
  //     inAmountCount += 0;
  //   }
  // }


  // for (let i = 0; i < $(".outAmount").length; i++) {
  //   if ($(".outAmount")[i].dataset.detail != undefined) {
  //     outAmountCount += Number($(".outAmount")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
  //   } else {
  //     outAmountCount += 0;
  //   }
  // }
  // $(".inAmountTotal").val(Number(inAmountCount).toLocaleString() + "원");
  // $(".inAmountTotal").attr("data-detail", Number(inAmountCount).toLocaleString() + "원");
  // $(".outAmountTotal").val(Number(outAmountCount).toLocaleString() + "원");
  // $(".outAmountTotal").attr("data-detail", Number(outAmountCount).toLocaleString() + "원");


  // let profit, profitper;
  // if ($(".outAmountTotal").val() != "" && $(".inAmountTotal").val() != "") {
  //   profit = Number($(".outAmountTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "")) - Number($(".inAmountTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
  //   if (Number($(".outAmountTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "")) != 0) {
  //     profitper = (profit / Number($(".outAmountTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""))) * 100;
  //     profitper = Math.round(profitper * 10) / 10;
  //   } else {
  //     profitper = 0;
  //   }

  //   console.log(profit);
  //   console.log(profitper + "확인");
  //   $(".doc_Form_SalesReport_profit").val(Number(profit).toLocaleString() + "원");
  //   $(".doc_Form_SalesReport_profit").attr("data-detail", Number(profit).toLocaleString() + "원");
  //   $(".doc_Form_SalesReport_profitper").val(Number(profitper) + "%");
  //   $(".doc_Form_SalesReport_profitper").attr("data-detail", Number(profitper) + "%");
  // }

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
  if (storage.cip[storage.soppDetail.expectedDate] != undefined) {
    $("#" + formId + "_expectedDate").val(getYmdHypen(storage.soppDetail.expectedDate)); // 매출 예정일 
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
    storage.user[writer].userName +
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


function getNextContNo() {

  $.ajax({
    url: "/api/contract/nextContNo",
    method: "get",
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.result === "ok") {
        let data;
        data = cipher.decAes(result.data);
        storage.nextContNo = data;
      } else {
        console.log("다음 계약 번호를 가져오는 것을 실패함")
      }

    }

  });

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