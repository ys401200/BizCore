$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  getformList();


});

function getformList() {
  let dept = (storage.dept.dept[storage.user[storage.my].deptId].deptName).split(" ")[1];
  $(".setWriter").html(dept + "&nbsp" + storage.user[storage.my].userName)

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

  $(".modal-wrap").hide();
  $(".insertedDetail").hide();
  $(".createLineBtn").hide();
  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  if (splitArr.length > 3) {
    $.ajax({
      url: apiServer + "/api/gw/app/temp/" + splitArr[3],
      method: "get",
      dataType: "json",
      cache: false,
      success: (data) => {
        let detailData;
        if (data.result === "ok") {
          detailData = cipher.decAes(data.data);
          detailData = JSON.parse(detailData);
          detailData.doc = cipher.decAes(detailData.doc);
          detailData.doc = detailData.doc.replaceAll('\\"', '"');
          storage.reportDetailData = detailData;
          setTempReport();
        } else {
          alert("임시 저장 문서 정보를 가져오는 데 실패했습니다");
        }
      },
    });
  }
  // let previewWidth = document.getElementsByClassName("reportInsertForm")[0];
  // previewWidth = previewWidth.clientWidth;
  // let target = $(".reportInsertForm");
  // target.css("height", Math.ceil((previewWidth / 210) * 297));
}

function setTempReport() {
  if (storage.reportDetailData != undefined) {
    let formId = storage.reportDetailData.formId;
    $(".guide").remove();
    $(".lineDetail").show();
    $(".createLineBtn").show();
    $(".reportInsertForm").html(storage.reportDetailData.doc);
    $(".insertedDetail").show();

    //작성자 작성일 자동 입력
    $(".testClass").prop("checked", false);
    $(".typeContainer").html("");
    $(".inputsAuto").prop("disabled", "true");
    $(".inputsAuto").css("text-align", "center");
    $(".inputsAuto").eq(0).css("text-align", "left");
    $(".inputsAuto").eq(1).css("text-align", "left");
    $(".inputsAuto").eq(2).css("text-align", "left");

    $(".saveBtn").prop("disabled", false);
    $(".previewBtn").prop("disabled", false);

    let target = $(".reportInsertForm")[0];
    let inputsArr = target.getElementsByTagName("input");

    for (let i = 0; i < inputsArr.length; i++) {
      if (inputsArr[i].dataset.detail !== undefined) {
        inputsArr[i].value = inputsArr[i].dataset.detail;
      }
    }

    let textAreaArr = target.getElementsByTagName("textarea")[0];
    textAreaArr.value = textAreaArr.dataset.detail;

    // 이름 , 직급 한글로 설정하기
    let subTitlesArr = ["_examine", "_approval", "_agree", "_conduct"];
    for (let i = 0; i < subTitlesArr.length; i++) {
      if ($("." + formId + subTitlesArr[i]).val() != undefined) {
        for (let j = 0; j < $("." + formId + subTitlesArr[i]).length; j++) {
          $("." + formId + subTitlesArr[i])[j].value =
            storage.user[$("." + formId + subTitlesArr[i])[j].value].userName;
          $("." + formId + subTitlesArr[i] + "_position")[j].value =
            storage.userRank[
            $("." + formId + subTitlesArr[i] + "_position")[j].value
            ][0];
        }
      }
    }

    // 상세타입 체크하게 하기
    let rd = $("input[name='" + formId + "_RD']");
    for (let i = 0; i < rd.length; i++) {
      if (rd[i].dataset.detail == "on") {
        $("#" + rd[i].id).prop("checked", true);
      }
    }
    $("input[name='" + formId + "_RD']").prop("disabled", false);
  }
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
    targetHtml += "<option value='" + nums[i] + "'>" + titles[i] + "</option>";
  }

  targetHtml += "</select>";

  target.html(targetHtml);
}

// 결재양식 선택에서 양식 선택 버튼 눌렀을 때 함수
function selectForm() {
  let data = storage.formList;
  let selectedFormNo = $(".formSelector").val();
  $(".formNumHidden").val(selectedFormNo);
  selectedFormTitle = data[$(".formNumHidden").val()].title;

  $(".guide").remove();

  let tt = $(".lineBtnContainer");
  //$(tt[0]).addClass("lineBtnContainerB");
  $(".lineDetail").show();
  $(".createLineBtn").show();
  $(".reportInsertForm").html(data[$(".formNumHidden").val()].form);
  $(".insertedDetail").show();

  //작성자 작성일 자동 입력
  let my = storage.my;
  let writer = storage.user[my].userName;
  let formId = data[$(".formNumHidden").val()].id;
  $("#" + formId + "_writer").val(writer);
  $("#" + formId + "_writer").attr("data-detail", writer);

  let date = getYmdHyphen();
  $("#" + formId + "_created").attr("data-detail", date);
  $("#" + formId + "_created").val(date);
  $(".testClass").prop("checked", false);
  $(".typeContainer").html("");
  $(".inputsAuto").prop("disabled", "true");
  $(".inputsAuto").css("text-align", "center");
  $(".inputsAuto").eq(0).css("text-align", "left");
  $(".inputsAuto").eq(1).css("text-align", "left");
  $(".inputsAuto").eq(2).css("text-align", "left");

  $(".saveBtn").prop("disabled", false);
  $(".previewBtn").prop("disabled", false);

  //영업기회 데이터 리스트 만들기

  if (formId != "doc_Form_leave" && formId != "doc_Form_extension") {
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

    // 거래처 데이터 리스트

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
  }
  // let previewWidth = document.getElementsByClassName("reportInsertForm")[0];
  // previewWidth = previewWidth.clientWidth;
  // let target = $(".reportInsertForm");
  // target.css("height", Math.ceil((previewWidth / 210) * 297));
}

// 영업기회 데이터 리스트 가져오는 함수
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

  // let setGwModalHtml =
  //   "<div class='gwModal'>" +
  //   "<div class='modal-title'>결재선 생성</div>" +
  //   "<div class='lineDetail'>" +
  //   "<div class='lineTop'>" +
  //   "<div class='innerDetail' id='lineLeft'></div>" +
  //   "<div class='innerDetail' id='lineCenter'>" +
  //   "<button onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
  //   "<button onclick='check(this.value)' value='agree'>합의 &gt;</button>" +
  //   "<button onclick='check(this.value)' value='approval'>결재 &gt;</button>" +
  //   " <button onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
  //   "<button onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
  //   "<div class='innerDetail' id='lineRight'>" +
  //   "<div><select name='saveLineSelect' ><option value=''>자주 쓰는 결재선</option><option value='basic'>대표</option><option value='middle'>구민주 과장-대표</option><</select><button type='button' onclick='setSavedLine()'>불러오기</button><button type='button'>삭제하기</button><button type='button'>저장하기</button></div>" +
  //   "<div><div>검토</div>" +
  //   "<div class='typeContainer' id='examine'></div>" +
  //   "</div>" +
  //   "<div><div>합의</div>" +
  //   "<div class='typeContainer' id='agree'></div></div>" +
  //   "<div><div>결재</div>" +
  //   "<div class='typeContainer' id='approval'></div></div>" +
  //   "<div><div>수신</div>" +
  //   "<div class='typeContainer' id='conduct'></div></div>" +
  //   "<div><div>참조</div>" +
  //   "<div class='typeContainer' id='refer'></div></div>" +
  //   "</div>" +
  //   "</div>" +
  //   "</div>" +
  //   "<div class='close-wrap'>" +
  //   " <button id='close' onclick='closeGwModal(this)'>취소</button>" +
  //   " <button id='create' onclick='closeGwModal(this)'>생성</button>" +
  //   "</div>" +
  //   "</div>" +
  //   "</div>";
  // $(".modal-wrap").html(setGwModalHtml);

  // let orgChartTarget = $("#lineLeft");
  // let userData = new Array();

  // let x;
  // let my = storage.my;
  // //나는 결재선에 노출 안 되게 함
  // for (x in storage.user) {
  //   if (x != my && storage.user[x].resign != true) {
  //     userData.push(x);
  //   }
  // }

  // let innerHtml = "";
  // for (let i = 0; i < userData.length; i++) {
  //   innerHtml +=
  //     "<div><input class='testClass' type ='checkbox' id='cb" +
  //     userData[i] +
  //     "' name='userNames' value='" +
  //     userData[i] +
  //     "'><label for='cb" +
  //     userData[i] +
  //     "'>" +
  //     storage.user[userData[i]].userName +
  //     "</label></div>";
  // }
  // orgChartTarget.html(innerHtml);
  // $(".modal-wrap").hide();

  setModalhtml();
}

// 결재선 생성 버튼 눌렀을 때 모달 띄움
function showModal() {

  $(".modal-wrap").show();
}



function setModalhtml() {
  let setGwModalHtml =
    "<div class='gwModal'>" +
    "<div class='modal-title'>결재선 생성</div>" +
    "<div class='lineDetail'>" +
    "<div class='lineTop'>" +
    "<div class='innerDetail' id='lineLeft'></div>" +
    "<div class='innerDetail' id='lineCenter'>" +
    "<button onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
    // "<button onclick='check(this.value)' value='agree'>합의 &gt;</button>" +
    "<button onclick='check(this.value)' value='approval'>결재 &gt;</button>" +
    " <button onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
    "<button onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
    "<div class='innerDetail' id='lineRight'>" +
    "<div><select name='saveLineSelect' ><option value=''>자주 쓰는 결재선</option><option value='basic'>대표</option><option value='middle'>구민주 과장-대표</option><</select><button type='button' onclick='setSavedLine()'>불러오기</button><button type='button'>삭제하기</button><button type='button'>저장하기</button></div>" +
    "<div><div>검토</div>" +
    "<div class='typeContainer' id='examine'></div>" +
    "</div>" +
    // "<div><div>합의</div>" +
    // "<div class='typeContainer' id='agree'></div></div>" +
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
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함
  for (x in storage.user) {
    if (x != my && storage.user[x].resign != true) {
      userData.push(x);
    }
  }

  let innerHtml = "";
  for (let i = 0; i < userData.length; i++) {
    innerHtml +=
      "<div><input class='testClass' type ='checkbox' id='cb" +
      userData[i] +
      "' name='userNames' value='" +
      userData[i] +
      "'><label for='cb" +
      userData[i] +
      "'>" +
      storage.user[userData[i]].userName +
      "</label></div>";
  }
  orgChartTarget.html(innerHtml);

}








// 결재선 모달 취소 생성
function closeGwModal(obj) {
  if (obj.id == "close") {
    $(".modal-wrap").hide();
  } else {
    if ($("#approval").html() == "") {
      alert("결재자를 설정하세요");
    } else {
      createLine();
      $(".inputsAuto").prop("disabled", "true");
      $(".inputsAuto").css("text-align", "center");
      $(".inputsAuto").eq(0).css("text-align", "left");
      $(".inputsAuto").eq(1).css("text-align", "left");
      $(".inputsAuto").eq(2).css("text-align", "left");
      $(".modal-wrap").hide();
    }
  }
}

////조직도에서 결재 타입 선택 함수
function check(name) {

  let inputLength = $(".testClass");
  let target = $("#" + name);

  let html = target.html();
  let x;
  let my = storage.my;

  let data = new Array();
  // 본인 
  for (x in storage.user) {
    if (x != my && storage.user[x].resign == false) {
      data.push(x);
    }
  }
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if ($("#cb" + data[i]).prop("checked")) {
      count++;
    }
  }


  if (name == "approval" && html != "" || name == "approval" && count > 1) {
    alert("결재자는 한 명만 선택할 수 있습니다");
  } else {
    let selectHtml = "";



    for (let i = 0; i < inputLength.length; i++) {
      if ($("#cb" + data[i]).prop("checked")) {
        let id = inputLength[i].id.substring(2, inputLength[i].id.length);
        if (document.getElementById("linedata_" + id) == null) {
          selectHtml +=
            "<div class='lineDataContainer' id='lineContainer_" +
            id +
            "'><label id='linedata_" +
            id +
            "'>" +
            storage.user[id].userName +
            "</label><button value='" +
            id +
            "' onclick='upClick(this)'>▲</button><button  value='" +
            id +
            "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
        }
      }
    }
    html += selectHtml;
    target.html(html);

    $(".testClass").prop("checked", false);
  }
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

  /// 사번 배열을 만든다

  for (let i = 0; i < numArr.length; i++) {
    if (obj.value == numArr[i] && i != 0) {
      let temp = numArr[i];
      numArr[i] = numArr[i - 1];
      numArr[i - 1] = temp;
    }
  }

  // 순서 바꾸는 것

  let data = new Array();
  let x;
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함
  for (x in storage.user) {
    if (x != my && storage.user[x].resign != true) {
      data.push(x);
    }
  }

  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml +=
      "<div class='lineDataContainer' id='lineContainer_" +
      numArr[i] +
      "'><label id='linedata" +
      numArr[i] +
      "'>" +
      storage.user[numArr[i]].userName +
      "</label><button value='" +
      numArr[i] +
      "' onclick='upClick(this)'>▲</button><button  value='" +
      numArr[i] +
      "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
  }

  target.html(selectHtml);
} // End of upClick(obj);

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
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함
  for (x in storage.user) {
    if (x != my && storage.user[x].resign != true) {
      data.push(x);
    }
  }

  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml +=
      "<div class='lineDataContainer' id='lineContainer_" +
      numArr[i] +
      "'><label id='linedata" +
      numArr[i] +
      "'>" +
      storage.user[numArr[i]].userName +
      "</label><button value='" +
      numArr[i] +
      "' onclick='upClick(this)'>▲</button><button  value='" +
      numArr[i] +
      "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
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
  $("select[name='saveLineSelect']")[0].value = "";
  let selectedFormNo = $(".formSelector").val();
  let formId = storage.formList[selectedFormNo].id;
  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");
  let my = storage.my;
  let testHtml =
    "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' value='" +
    storage.userRank[storage.user[my].rank][0] +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto " +
    formId +
    "_writer' value='" +
    storage.user[my].userName +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto " +
    formId +
    "_writer_status' value=''></div>" +
    "<div class='dateBorder'><input type='text' class='inputsAuto " +
    formId +
    "_writer_approved''value=''></div></div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
  let referHtml = "<div>참조</div>";
  let target = $(".typeContainer"); // 결재선 생성 모달에서 결재 타입 각각의 container
  let titleArr = ["검토", "결재", "수신", "참조"];
  let titleId = ["examine", "approval", "conduct", "refer"];
  let simpleHtml = "";
  let data = new Array();
  let x;
  //나는 결재선에 노출 안 되게 함
  for (x in storage.user) {
    if (x != my && storage.user[x].resign == false) {
      data.push(x);
    }
  }

  for (let i = 0; i < target.length; i++) {
    if (target[i].children.length != 0 && i < 2) {
      // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우
      testHtml +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
      simpleHtml += "[" + titleArr[i] + "]";
    } else if (target[i].children.length != 0 && i == 2) {
      // 결재타입이 수신인 경우
      testHtml2 +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
      simpleHtml += "[" + titleArr[i] + "]";
    } else if (target[i].children.length != 0 && i == 3) {
      simpleHtml += "[" + titleArr[i] + "]";
    }

    for (let j = 0; j < target[i].children.length; j++) {
      let id = target[i].children[j].id;
      id = id.split("_");
      id = id[1];

      // 수신
      if (i == 2) {

        if (j != 0) {
          simpleHtml += "-" + storage.user[id].userName;
        } else {
          simpleHtml += storage.user[id].userName;
        }
        testHtml2 +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[id].rank][0] +
          "' data-detail='" +
          storage.user[id].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[id].userName +
          "' data-detail='" +
          storage.user[id].userNo +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_approved" +
          "' value='' data-detail=''/></div></div>";
      }

      // 참조
      else if (i == 3) {
        if (j != 0) {
          simpleHtml += "-" + storage.user[id].userName;
        } else {
          simpleHtml += storage.user[id].userName;
        }
        referHtml +=
          "<div class='appendName " +
          formId +
          "_" +
          titleId[i] +
          "' data-detail='" +
          storage.user[id].userNo +
          "'>" +
          storage.userRank[storage.user[id].rank][0] +
          "&nbsp" +
          storage.user[id].userName +
          "</div>";
      }

      // 검토 합의 결재
      else {
        if (j != 0) {
          simpleHtml += "-" + storage.user[id].userName;
        } else {
          simpleHtml += storage.user[id].userName;
        }
        testHtml +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[id].rank][0] +
          "' data-detail='" +
          storage.user[id].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[id].userName +
          "' data-detail='" +
          storage.user[id].userNo +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_approved" +
          "' value='' data-detail=''/></div></div>";
      }
    }

    if (target[i].children.length != 0 && i < 2) {
      testHtml += "</div>";
      simpleHtml += "  ";
    } else if (target[i].children.length != 0 && i == 2) {
      testHtml2 += "</div>";
      simpleHtml += "  ";
    } else if (target[i].children.length != 0 && i == 3) {
      simpleHtml += "  ";
    }
  }

  testHtml += "</div>";
  testHtml2 += "</div>";

  testHtml += testHtml2;
  lineTarget.html(testHtml);

  $(".referContainer").html(referHtml);
  $(".simpleAppLine").html(simpleHtml);


  let infoLength = document.getElementsByClassName("info")[0];
  infoLength = infoLength.clientWidth;
  let lgcTotal = 0;
  let lineGrid = document.getElementsByClassName("lineGrid");

  if (lineGrid.length > 3) {
    for (let i = 0; i < 3; i++) {
      lgcTotal += lineGrid[i].clientWidth;
    }
    if (lgcTotal < lineGrid[3].clientWidth) {
      lgcTotal = lineGrid[3].clientWidth;
    }




  } else {
    for (let i = 0; i < lineGrid.length; i++) {
      lgcTotal += lineGrid[i].clientWidth;
    }

  }

  if (lgcTotal > infoLength) {
    for (let i = 0; i < lineGrid.length; i++) {
      let tt = lineGrid[i];
      let kk = lineGrid[0]
      kk = $(kk).css("margin-right");
      kk = kk.split("p")[0];
      $(tt).css("width", ((lineGrid[i].clientWidth) * (infoLength / (lgcTotal + (kk * 4)))));
    }
  }

} // End of createLine();



// 날짜 변환 함수
function getYmdHyphen() {
  let d = new Date();
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "-" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
  );
}

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


// 자주쓰는 결재선 선택시 설정
function setSavedLine() {
  let val = $("select[name='saveLineSelect']")[0].value;
  if (val == "middle") {
    // 구민주 검토 이승우 결재
    $("#examine").html(
      "<div class='lineDataContainer' id='lineContainer_10017'><label id='linedata_10017'>구민주</label><button value='10017' onclick='upClick(this)'>▲</button><button  value='10017'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#approval").html(
      "<div class='lineDataContainer' id='lineContainer_10002'><label id='linedata_10002'>이승우</label><button value='10002' onclick='upClick(this)'>▲</button><button  value='10002'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#agree").html("");
    $("#conduct").html("");
    $("#refer").html("");
  } else if (val == "basic") {
    // 이승우 결재
    $("#approval").html(
      "<div class='lineDataContainer' id='lineContainer_10002'><label id='linedata0'>이승우</label><button value='10002' onclick='upClick(this)'>▲</button><button  value='10002'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#agree").html("");
    $("#examine").html("");
    $("#conduct").html("");
    $("#refer").html("");
  }
}


//기안하기 버튼 함수 
function reportInsert() {
  let title, content, readable, formId, appDoc, dept;
  let appLine = [];
  let selectedFormNo = $(".formSelector").val();
  formId = storage.formList[selectedFormNo].id;
  let detailType = $("input[name='" + formId + "_RD']:checked").attr("id");

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
  content = $("#" + formId + "_content").val();
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


  let fnc, type, start, end;


  if (formId == "doc_Form_leave") {
    fnc = "hr"
    type = "leave"
    start = new Date($("#" + formId + "_from").val() + " " + $("#" + formId + "_fromTime").val());
    end = new Date($("#" + formId + "_to").val() + " " + $("#" + formId + "_toTime").val());
  } else if (formId == "doc_Form_extension") {
    fnc = "hr"
    start = new Date($("#" + formId + "_from").val() + " " + $("#" + formId + "_fromTime").val());
    end = new Date($("#" + formId + "_to").val() + " " + $("#" + formId + "_toTime").val());

    if ($("#" + formId + "_type").val() == "연장근무") {
      type = "overTime";
    } else if ($("#" + formId + "_type").val() == "휴일근무") {
      type = "holidayWork";
    }
  }


  let related = {
    "fnc": fnc,
    "type": type,
    "start": start,
    "end": end,
    "parent": null,
    "prev": null,
    "next": null,
    "children": null
  }



  let data = {
    "title": title,
    "sopp": soppResult,
    "dept": dept,
    "customer": cusResult,
    "attached": storage.attachedList === undefined ? [] : storage.attachedList,
    "content": content,
    "appLine": appLine,
    "appDoc": appDoc,
    "formId": formId,
    "readable": readable,
    "temp": temp,
    "related": related
  };
  console.log(data);
  data = JSON.stringify(data);
  data = cipher.encAes(data);

  if ($(".createLineBtn").css("display") == "none") {
    alert("결재 문서 양식을 선택하세요");
  } else if (
    formId != "doc_Form_Pur" && detailType == undefined && formId != "doc_Form_Dip" && detailType == undefined &&
    formId != "doc_Form_leave" && detailType == undefined && formId != "doc_Form_extension" && detailType == undefined
  ) {
    alert("결재문서 상세 타입을 선택하세요");
  } else if (title == "") {
    alert("제목을 입력하세요");
  } else if ($("#" + formId + "_line").html() == "결재선") {
    alert("결재선을 생성하세요");
  } else if ((formId == "doc_Form_leave" || formId == "doc_Form_extension") && $("#" + formId + "_type").val() == "") {
    alert("종류를 선택하세요");
  } else if ((formId == "doc_Form_leave" || formId == "doc_Form_extension") && (($("#" + formId + "_from").val() == "" || $("#" + formId + "_to").val() == "" || $("#" + formId + "_fromTime").val() == "" || $("#" + formId + "_toTime").val() == ""))) {
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





// 파일 첨부 버튼 누를 때 마다 반영
function docFileChange() {
  let method, data, type, attached;
  attached = $(document).find("[name='attached[]']")[0].files;

  if (storage.attachedList === undefined || storage.attachedList <= 0) {
    storage.attachedList = [];
  }

  let fileDataArray = storage.attachedList;
  for (let i = 0; i < attached.length; i++) {
    let reader = new FileReader();
    let fileName;

    fileName = attached[i].name;
    // 파일 중복 등록 제거
    if (!fileDataArray.includes(fileName)) {
      storage.attachedList.push(fileName);

      reader.onload = (e) => {
        let binary,
          x,
          fData = e.target.result;
        const bytes = new Uint8Array(fData);
        binary = "";
        for (x = 0; x < bytes.byteLength; x++)
          binary += String.fromCharCode(bytes[x]);
        let fileData = cipher.encAes(btoa(binary));
        let fullData = fileName + "\r\n" + fileData;

        let url = "/api/attached/docapp";
        url = url;
        method = "post";
        data = fullData;
        type = "insert";

        crud.defaultAjax(
          url,
          method,
          data,
          type,
          submitFileSuccess,
          submitFileError
        );
      };

      reader.readAsArrayBuffer(attached[i]);
    }
  }

  let html = "";

  for (let i = 0; i < fileDataArray.length; i++) {
    html +=
      "<div data-detail='" +
      fileDataArray[i] +
      "'>" +
      fileDataArray[i] +
      "<button type='button' onclick='deleteFile(this)'>x</button></div></div>";
    $(".filePreview").html(html);
  }

  // 파일목록 수정의 경우 추가해야함
}

//파일 삭제 
function deleteFile(obj) {
  let value = obj.parentElement.dataset.detail;
  storage.attachedList = storage.attachedList.filter(
    (element) => element != value
  );
  obj.parentElement.remove();
}

// 입력된 총 합계 구하는 함수
function getTotalCount() {
  let totalCount = Number(0);
  for (let i = 0; i < $(".doc_Form_Consult_total").length; i++) {
    totalCount += Number(
      $(".doc_Form_Consult_total")[i].dataset.detail.replace(",", "")
    );
  }
  return totalCount;
}

// 기안 시 금액이 입력되지 않은 공백 칸 제거해서 폼 올리기
function deleteGap() {
  for (let i = $(".doc_Form_Consult_total").length - 1; i >= 0; i--) {
    if (
      $(".doc_Form_Consult_total")[i].dataset.detail == "" ||
      $(".doc_Form_Consult_total")[i].dataset.detail == undefined ||
      $(".doc_Form_Consult_total")[i].dataset.detail == "null"
    ) {
      $(".doc_Form_Consult_total")[i].parentElement.parentElement.remove();
    }
  }
}

function tempSave() {
  let dept,
    title,
    readable,
    formId,
    appDoc,
    appLine = [];
  let my = storage.my;
  dept = storage.user[my].deptId[0];
  if ($(".formNumHidden").val() == "") {
    formId = storage.reportDetailData.formId;
  } else {
    formId = storage.formList[$(".formNumHidden").val()].id;
  }

  title = $("#" + formId + "_title").val();
  appDoc = $(".reportInsertForm").html();
  readable = $("input[name=authority]:checked").val();

  let soppVal = $("#" + formId + "_sopp").val();
  let customerVal = $("#" + formId + "_infoCustomer").val();
  let soppResult;
  for (let x in storage.soppList) {
    if (soppVal != "" || storage.soppList[x].title === soppVal) {
      soppResult = storage.soppList[x].no + "";
    } else {
      soppResult = "";
    }
  }
  let cusResult;
  for (let x in storage.customer) {
    if (customerVal != "" || storage.customer[x].title === customerVal) {
      cusResult = storage.customer[x].no + "";
    } else {
      cusResult = "";
    }
  }
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

  if (appLine.length == 0) {
    appLine = null;
  }

  let data = {
    dept: dept,
    title: title,
    sopp: soppResult,
    readable: readable,
    formId: formId,
    customer: cusResult,
    appDoc: appDoc,
    appLine: appLine,
    temp: temp,
  };
  console.log(data);
  if (title == "") {
    alert("제목을 입력하세요");
  } else {
    data = JSON.stringify(data);
    data = cipher.encAes(data);

    $.ajax({
      url: "/api/gw/app/temp",
      method: "post",
      data: data,
      dataType: "json",
      contentType: "text/plain",
      success: (result) => {
        if (result.result === "ok") {
          alert("임시 저장 되었습니다");
        } else {
          alert(result.msg);
        }
      },
    });
  }
}
