$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  getformList();
});

function getformList() {


  $(".ContentDiv").html("<div class='gwWriteBtns'></div><div class='selector'>d</div><div class='selector'>d</div><div class='selector'>d</div>");

  $(".gwWriteBtns").html("<button type='button'>기안 하기</button> <button type='button' >임시 저장</button> <button type='button'>인쇄 미리보기</button>");

  // 기본설정


  $(".selector:first").html("<div>기본 설정</div><div class='formDetail'><div>결재양식</div><div class='formListDiv'></div><button type='button' class='formSelectbtn' onclick='selectForm()'>선택</button><input type='hidden' class='formNumHidden'/></div>"
    + "<div class='formDetail'><div>열람권한</div><div><label><input type='radio' name='authority' value='dept' />기안자 소속 부서 포함</label><label><input type='radio' name='authority' value='none' checked />권한 설정 없음</label></div></div>");

  $(".selector:first").next().html("<div>결재선 <button class='createLineBtn' onclick='showModal()'>결재선생성</button></div><div class='modal-wrap'><div class='gwModal'></div></div>");


  let lastHtml = "<div>상세 입력</div><div class='insertedDetail'><div class='reportInsertForm'></div><div class='referContainer'><div>참조</div></div><div class='fileDetail'>";


  lastHtml += "<div>파일첨부</div><div class='filebtnContainer'><input type='file' class='gwFileInput' onchange='drawSelectedFileList(this)' /><div class='insertedFileList'></div></div></div></div>"


  $(".selector:first").next().next().html(lastHtml);


  let url = "/api/gw/form";

  $.ajax({
    url: url,
    type: "get",
    dataType: "json",
    success: (result) => {
      if (result.result == "ok") {
        let jsondata;
        jsondata = cipher.decAes(result.data);
        jsondata = JSON.parse(jsondata);
        storage.formList = jsondata;
        drawFormList();
      } else {
        alert("에러");
      }
    },
  });

  $(".modal-wrap").hide()
  $(".insertedDetail").hide();
  $(".createLineBtn").hide();

  // let previewWidth = document.getElementsByClassName("reportInsertForm")[0];
  // previewWidth = previewWidth.clientWidth;
  // let target = $(".reportInsertForm");
  // target.css("height", Math.ceil(previewWidth / 210 * 297));

}

function drawFormList() {
  let data = storage.formList;
  let titles = new Array();
  let nums = new Array();
  let ids = new Array();

  let target = $(".formListDiv");
  let targetHtml = "";

  for (let i = 0; i < data.length; i++) {
    titles.push(data[i].title);
    ids.push(data[i].id);
    nums.push(data[i].no);
  }
  console.log(data);

  targetHtml += "<select class='formSelector'>";
  for (let i = 0; i < titles.length; i++) {
    targetHtml += "<option value='" + nums[i] + "'>" + titles[i] + "</option>"

  }

  targetHtml += "</select>"

  target.html(targetHtml);

}

// 결재양식 선택에서 양식 선택 버튼 눌렀을 때 함수 
function selectForm() {
  let data = storage.formList;
  let selectedFormNo = $(".formSelector").val();
  selectedFormTitle = data[selectedFormNo].title;

  $(".lineDetail").show();
  $(".createLineBtn").show();
  $(".reportInsertForm").html(data[selectedFormNo].form);
  $(".insertedDetail").show();


  //작성자 작성일 자동 입력
  let my = storage.my;
  let writer = storage.user[my].userName;
  let formId = data[selectedFormNo].id;
  $("#" + formId + "_writer").val(writer);

  let date = getYmdHyphen();
  $("#" + formId + "_created").val(date);
  $(".testClass").prop('checked', false);
  $(".typeContainer").html("")
  $(".inputsAuto").prop("disabled", "true");
  $(".inputsAuto").css("text-align", "center")
  $(".inputsAuto").eq(0).css("text-align", "left");
  $(".inputsAuto").eq(1).css("text-align", "left");
  $(".inputsAuto").eq(2).css("text-align", "left");

}




// 결재선 생성 버튼 눌렀을 때 모달 띄움 
function showModal() {

  let setGwModalHtml = "<div class='gwModal'>" +
    "<div class='modal-title'>결재선 생성</div>" +
    "<div class='lineDetail'>" +
    "<div class='lineTop'>" +
    "<div class='innerDetail' id='lineLeft'></div>" +
    "<div class='innerDetail' id='lineCenter'>" +
    "<button onclick='check(this.value)' value='examine'>검토 ></button>" +
    "<button onclick='check(this.value)' value='agree'>합의 ></button>" +
    "<button onclick='check(this.value)' value='approval'>결재 ></button>" +
    " <button onclick='check(this.value)' value='conduct'>수신 ></button>" +
    "<button onclick='check(this.value)' value='refer'>참조 ></button></div>" +
    "<div class='innerDetail' id='lineRight'>" +
    "<div><select onchange='setSavedLine(this)'><option value=''>자주 쓰는 결재선</option><option value='basic'>대표</option><option value='middle'>구민주 과장-대표</option><</select></div>" +
    "<div><div>검토</div>" +
    "<div class='typeContainer' id='examine'></div>" +
    "</div>" +
    "<div><div>합의</div>" +
    "<div class='typeContainer' id='agree'></div></div>" +
    "<div><div>결재</div>" +
    "<div class='typeContainer' id='approval'></div></div>" +
    "<div><div>수신</div>" +
    "<div class='typeContainer' id='conduct'></div></div>" +
    "<div><div>참조</div>" +
    "<div class='typeContainer' id='refer'></div></div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='close-wrap'>" +
    " <button id='close' onclick='closeGwModal(this)'>취소</button>" +
    " <button id='create' onclick='closeGwModal(this)'>생성</button>" +
    "</div>" +
    "</div>" +
    "</div>";
  $(".modal-wrap").html(setGwModalHtml);



  let orgChartTarget = $("#lineLeft");
  let userData = new Array();

  let x;
  for (x in storage.user) userData.push(x);

  let innerHtml = "";
  for (let i = 0; i < userData.length; i++) {
    innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + i + "' name='userNames' value='" + userData[i] + "'><label for='cb'>" + storage.user[userData[i]].userName + "</label></div>"
    orgChartTarget.html(innerHtml);
  }

  $(".modal-wrap").show();

}

// 결재선 모달 취소 생성 
function closeGwModal(obj) {
  if (obj.id == 'close') {
    $(".modal-wrap").hide();
  } else {
    createLine();
    $(".inputsAuto").prop("disabled", "true");
    $(".inputsAuto").css("text-align", "center")
    $(".inputsAuto").eq(0).css("text-align", "left");
    $(".inputsAuto").eq(1).css("text-align", "left");
    $(".inputsAuto").eq(2).css("text-align", "left");
    $(".modal-wrap").hide();
  }
}

////조직도에서 결재 타입 선택 함수 
function check(name) {
  let inputLength = $(".testClass");
  let target = $("#" + name);
  let html = target.html();
  let selectHtml = "";

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);


  for (let i = 0; i < inputLength.length; i++) {
    if ($("#cb" + i).prop('checked')) {
      if (document.getElementById("linedata" + i) == null)
        selectHtml += "<div class='lineDataContainer' id='lineContainer_" + i + "'><label id='linedata" + i + "'>" + storage.user[data[i]].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + i + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    }

  }
  html += selectHtml;
  target.html(html)

  $(".testClass").prop('checked', false);
} //End of check(name) 


//// 조직도 결재 순서 
function upClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent = parent.parentElement;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = 0; i < numArr.length; i++) {
    if (obj.value == numArr[i] && i != 0) {
      let temp = numArr[i];
      numArr[i] = numArr[i - 1];
      numArr[i - 1] = temp;
    }
  }

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);
  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
  }

  target.html(selectHtml);
}// End of upClick(obj); 


function downClick(obj) {
  let parent;
  parent = obj.parentNode;
  parent = parent.parentNode;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = numArr.length - 1; i >= 0; i--) {
    if (obj.value == numArr[i] && i != numArr.length - 1) {
      let temp = numArr[i];
      numArr[i] = numArr[i + 1];
      numArr[i + 1] = temp;
    }
  }

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);
  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
  }

  target.html(selectHtml);
} // End of downClick(obj) 


function deleteClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent.remove();
} // End of deleteClign(obj); 


// 결재선 그리기 + 작성자 추가 
function createLine() {

  let selectedFormNo = $(".formSelector").val();
  let formId = storage.formList[selectedFormNo].id;
  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");
  let my = storage.my;
  let today = getYmdSlash();
  let testHtml = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' value='직급'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' value='" + storage.user[my].userName + "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' value='승인'></div>" +
    "<div class='dateBorder'><input type='text' class='inputsAuto'value='" + getYmdSlash() + "'></div></div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
  let referHtml = "<div>참조</div>";
  let target = $(".typeContainer"); // 결재선 생성 모달에서 결재 타입 각각의 container 
  let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];
  let titleId = ["examine", "agree", "approval", "conduct", " read", "refer"]


  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);


  for (let i = 0; i < target.length; i++) {
    if (target[i].children.length != 0 && i < 3) { // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우 
      testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    } else if (target[i].children.length != 0 && i == 3) { // 결재타입이 수신인 경우 
      testHtml2 += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    }



    for (let j = 0; j < target[i].children.length; j++) {
      let id = target[i].children[j].id;
      id = id.split('_');
      id = id[1];


      // 수신 
      if (i == 3) {
        testHtml2 += "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='직급' data-detail='직급'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[data[id]].userName + "' data-detail='" + storage.user[data[id]].userName + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
      }

      // else if (j == target[i].children.length - 1) {
      //   testHtml += "<div class='lineSet'><div class='twoBorderLast " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorderLast  " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      // }

      // else if (i == 2) {
      //   testHtml += "<div class='lineSet'><div class='twoBorder " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      // } else if (i == 3) {
      //   testHtml2 += "<div class='lineSet'><div class='twoBorder " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      // } 

      // 참조 
      else if (i == 4) {
        referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "' data-detail='" + storage.user[data[id]].userName + "'>직급 " + storage.user[data[id]].userName + "</div>";
      }

      // 검토 합의 결재 
      else {
        testHtml += "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='직급' data-detail='직급'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[data[id]].userName + "' data-detail='" + storage.user[data[id]].userName + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
      }

    }

    if (target[i].children.length != 0 && i < 3) {
      testHtml += "</div>";
    } else if (target[i].children.length != 0 && i == 3) {
      testHtml2 += "</div>";
    }

  }

  testHtml += "</div>";
  testHtml2 += "</div>";

  testHtml += testHtml2;
  lineTarget.html(testHtml);

  $(".referContainer").html(referHtml);

} // End of createLine(); 



// 날짜 변환 함수 
function getYmdHyphen() {
  let d = new Date();
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}

function getYmdSlash() {
  let d = new Date();
  return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}




let fileNamesArr = new Array();


function drawSelectedFileList(obj) {

  let fileName = obj.value.split("\\");
  let fileListHtml = "";


  fileName = fileName[fileName.length - 1];
  fileNamesArr.push(fileName);

  for (let i = 0; i < fileNamesArr.length; i++) {
    fileListHtml += "<div >" + fileNamesArr[i] + "<button type='button' value='" + i + "' onclick='deleteFile(this)'>x</button></div></div>"
  }


  $(".insertedFileList").html(fileListHtml);
  $(".gwFileInput").val(""); // 선택된 파일 초기화 
}


//arr splice 
function deleteFile(obj) {

  let fileNo = obj.value;
  fileNamesArr.splice(fileNo, 1);
  let fileListHtml = "";
  for (let i = 0; i < fileNamesArr.length; i++) {
    fileListHtml += "<div value='" + i + "'>" + fileNamesArr[i] + "<button type='button' onclick='deleteFile(this)'>x</button></div></div>"
  }

  $(".insertedFileList").html(fileListHtml);
  $(".gwFileInput").val("");
}



//for(let i = 0 ; i < 3; i ++) {arr.push($(".doc_Form_Consult_date")[i].dataset.detail)}
// let formId = "doc_Form_Consult_date"
// $("."+formId)[0].dataset.detail; 


// 자주쓰는 결재선 선택시 설정 
function setSavedLine(obj) {
  let val = obj.value;
  if (val == 'middle') {
    $("#examine").html("<div class='lineDataContainer' id='lineContainer_4'><label id='linedata4'>구민주</label><button value='4' onclick='upClick(this)'>▲</button><button  value='4'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#approval").html("<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#agree").html("");
    $("#conduct").html("");
    $("#refer").html("");
  } else if (val == 'basic') {
    $("#approval").html("<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#agree").html("");
    $("#examine").html("");
    $("#conduct").html("");
    $("#refer").html("");
  }

}


let formId = "doc_Form_Consult"

function reportInsert(formId) {
  let writer, created, sopp, infoCustomer, title, content;
  let examine = new Array(); let examine_status = new Array(); let examine_approved = new Array();
  let approval = new Array(); let approval_status = new Array(); let approval_approved = new Array();
  let agree = new Array(); let agree_status = new Array(); let agree_approved = new Array();
  let receive = new Array(); let receive_status = new Array(); let receive_approved = new Array();
  let refer, files = new Array();
  let date = new Array(); let customer = new Array(); let price = new Array();
  let product = new Array(); let quantity = new Array();
  let amount = new Array(); let tax = new Array();
  let total = new Array(); let remark = new Array();

  writer = $("#" + formId + '_writer');
  created = $("#" + formId + '_created');
  sopp = $("#" + formId + '_sopp');
  infoCustomer = $("#" + formId + '_infoCustomer');
  title = $("#" + formId + '_title');



  for (let i = 0; i < $("." + formId + "_examine").length; i++) {
    examine.push($("." + formId + "_examine")[i].dataset.detail);
    examine_status.push($("." + formId + "_examine_status")[i].dataset.detail);
    examine_approved.push($("." + formId + "_examine_approved")[i].dataset.detail);
  }
  for (let i = 0; i < $("." + formId + "_approval").length; i++) {
    approval.push($("." + formId + "_approval")[i].dataset.detail);
    approval_status.push($("." + formId + "_approval_status")[i].dataset.detail);
    approval_approved.push($("." + formId + "_approval_approved")[i].dataset.detail);
  }

  for (let i = 0; i < $("." + formId + "_agree").length; i++) {
    agree.push($("." + formId + "_agree")[i].dataset.detail);
    agree_status.push($("." + formId + "_agree_status")[i].dataset.detail);
    agree_approved.push($("." + formId + "_agree_approved")[i].dataset.detail);
  }
  for (let i = 0; i < $("." + formId + "_receive").length; i++) {
    receive.push($("." + formId + "_receive")[i].dataset.detail);
    receive_status.push($("." + formId + "_receive_status")[i].dataset.detail);
    receive_approved.push($("." + formId + "_receive_approved")[i].dataset.detail);
  }

  for (let i = 0; i < $(".detailcontentDiv").length; i++) {
    date.push($("." + formId + "_date")[i].dataset.detail);
    customer.push($("." + formId + "_customer")[i].dataset.detail);
    price.push($("." + formId + "_price")[i].dataset.detail);
    product.push($("." + formId + "_product")[i].dataset.detail);
    quantity.push($("." + formId + "_quantity")[i].dataset.detail);
    amount.push($("." + formId + "_amount")[i].dataset.detail);
    tax.push($("." + formId + "_tax")[i].dataset.detail);
    total.push($("." + formId + "_total")[i].dataset.detail);
    remark.push($("." + formId + "_remark")[i].dataset.detail);
  }


  let url = "/app/doc";
  let method = "post";
  let data = {
    "writer": writer,
    "created": created,
    "sopp": sopp,
    "infoCustomer": infoCustomer,
    "title": title,
    "content": content,
    "approvalData": {
      "approval": approval,
      "approval_status": approval_status,
      "approval_approved": approval_approved
    },
    "examineData": {
      "examine": examine,
      "examine_status": examine_status,
      "examine_approved": examine_approved
    },
    "agreeData": {
      "agree": agree,
      "agree_status": agree_status,
      "agree_approved": agree_approved
    },
    "receiveData": {
      "receive": receive,
      "receive_status": receive_status,
      "receive_approved": receive_approved
    },
    "detailData": {
      "date": date,
      "customer": customer,
      "product": product,
      "price": price,
      "quantity": quantity,
      "amount": amount,
      "tax": tax,
      "total": total,
      "remark": remark
    }

  }

  console.log(data.detailData.customer);
  let type = "insert";

  //crud.defaultAjax(url, method, data, type, appSuccessInsert, appErrorInsert);

}

function appSuccessInsert() {
  alert("등록완료");
  location.reload();
}

function appErrorInsert() {
  alert("등록에러");
}