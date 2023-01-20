$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  drawList();
});

function drawList() {
  $(".modal-wrap").hide();

  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  // 전자결재 홈 화면에서 들어오는 경우 , 상세조회  
  if (splitArr.length > 3) {
    $.ajax({
      url: apiServer + "/api/gw/app/doc/" + splitArr[3],
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
          getDetailView();

        } else {
          alert("문서 정보를 가져오는 데 실패했습니다");
        }
      },
    });
  } else {
    // 리스트 보기
    let url, method, data, type;
    url = "/api/gw/app/wait";
    method = "get";
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, waitSuccessList, waitErrorList);

    $(".listPageDiv").show();

    $(".batchBtn").show();
  }
}

function waitSuccessList(result) {
  storage.waitList = result;
  window.setTimeout(drawNoticeApproval, 200);
}

function waitErrorList() {
  alert("에러");
}
// 결재 대기 문서 리스트 그리기 
function drawNoticeApproval() {

  let container,
    result,
    jsonData,
    job,
    header = [],
    data = [],
    ids = [],
    disDate,
    setDate,
    str,
    fnc;

  if (storage.waitList.wait == undefined || storage.waitList.wait.length == 0) {
    container = $(".listDiv");
    header = [
      {
        title: "작성일",
        align: "center",
      },
      {
        title: "결재 타입",
        align: "center",
      },
      {
        title: "문서 종류",
        align: "center",
      },
      {
        title: "제목",
        align: "left",
      },
      {
        title: "작성자",
        align: "center",
      },
      {
        title: "<input type='checkbox' name='batchBtns' class='allCb'>",
        align: "center",
      }

    ];

    createCheckGrid(container, header, data, ids, job, fnc);

    // container.append(
    //   "<div class='noListDefault'>결재 대기 문서가 없습니다</div>"
    // );
    container.append(
      "<div style='border:1px solid #e0e4e9;padding:8px;justify-content: center;background-color:white; text-align:center;grid-column :span 6'>결재 대기 문서가 없습니다</div>"
    );

   
  } else {

    let tt = [];
    for (let i = storage.waitList.wait.length - 1; i >= 0; i--) { tt.push(storage.waitList.wait[i]) };
    jsonData = tt;

    result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");

    header = [

      {
        title: "작성일",
        align: "center",
      },
      {
        title: "결재 타입",
        align: "center",
      },
      {
        title: "문서 종류",
        align: "center",
      },
      {
        title: "제목",
        align: "left",
      },
      {
        title: "작성자",
        align: "center",
      },
      {
        title: "<input type='checkbox'  onclick='allCbEvent(this)'>",
        align: "center",
      }

    ];
    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
      disDate = dateDis(jsonData[i].created, jsonData[i].modified);
      setDate = dateFnc(disDate);
      let userName = storage.user[jsonData[i].writer].userName;
      let appType = jsonData[i].appType;
      if (appType == "0") {
        appType = "검토";
      } else if (appType == "1") {
        appType = "합의";
      } else if (appType == "2") {
        appType = "결재";
      } else if (appType == "3") {
        appType = "수신";
      } else {
        appType = "참조";
      }




      let check = "<input type='checkbox'  name='batchBtns' data-detail='" + jsonData[i].docNo + "'>"
      str = [

        {
          "setData": setDate,
          "align": "center"
        },
        {
          "setData": appType,
          "align": "center"
        },
        {
          "setData": jsonData[i].form,
          "align": "center"
        },
        {
          "setData": jsonData[i].title,
          "align": "left",
        },
        {
          "setData": userName,
          "align": "center"
        },
        {
          "setData": check,
          "align": "center",
        }

      ];

      fnc = "waitDetailView(this)";
      ids.push(jsonData[i].docNo);
      data.push(str);
    }

    let pageNation = createPaging(
      pageContainer[0],
      result[3],
      "pageMove",
      "drawNoticeApproval",
      result[0]
    );
    pageContainer[0].innerHTML = pageNation;
    createCheckGrid(container, header, data, ids, job, fnc);

  }
} // End of drawNoticeApproval()



// 결재 대기 문서 상세 조회하기 
function waitDetailView(obj) {

  let docNo = $(obj).parent().attr("data-id");

  $.ajax({
    url: apiServer + "/api/gw/app/doc/" + docNo,
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
        getDetailView();

      } else {
        alert("문서 정보를 가져오는 데 실패했습니다");
        location.href = "/gw/wait";
      }
    },
  });
} // End of noticeDetailView();



function showList() {
  location.href = "/gw/wait";
}


// 문서 수정시 첨부파일목록 수정
function getFileModArr() {
  let target = $(".selectedFileDiv");
  let html = "";
  if (storage.newFileData == undefined || storage.newFileData.length == 0) {
    let fileList = storage.reportDetailData.fileList;

    for (let i = 0; i < fileList.length; i++) {
      html +=
        "<div><div class='files' data-detail='" +
        fileList[i].fileName +
        "'>" +
        fileList[i].fileName +
        "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
    }
    target.html(html);
  } else {
    for (let i = 0; i < storage.newFileData.length; i++) {
      html +=
        "<div><div class='files' data-detail='" +
        storage.newFileData[i] +
        "'>" +
        storage.newFileData[i] +
        "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
    }
    target.html(html);
  }
}

function fileRemove(obj) {
  let value = obj.parentElement.dataset.detail;
  storage.newFileData = storage.newFileData.filter(
    (element) => element != value
  );
  obj.parentElement.remove();
}

// 탭 누를때마다의 이벤트 주기
function changeTab(obj) {

  if (obj.id == "lineInfo") {
    $("#changeInfo").css("background-color", "#dddddd");
    $("#changeInfo").css("color", "#5c5c5c");
    $("#changeInfo").css("border-bottom-left-radius", "20px");
    $("#tabDetail2").hide();
    $("#tabDetail").show();
    if (storage.newAppLine == undefined) {
      drawCommentLine();
    } else {
      drawNewCommentLine();
    }
  } else if ((obj.id = "changeInfo")) {
    $("#lineInfo").css("background-color", "#dddddd");
    $("#lineInfo").css("color", "#5c5c5c");
    $("#lineInfo").css("border-bottom-right-radius", "20px");
    $("#tabDetail").hide();
    $("#tabDetail2").show();

    drawChangeInfo();
  }
}

// 모달별 버튼
function closeModal(obj) {
  $(".modal-wrap").hide();
  $("input:radio[name='type']").prop("checked", false);
}

//결재하기 모달
function showAppModal() {

  let setAppModalHtml =
    "<div class='setApprovalModal'>" +
    "<div class='modalHead'><span class='modalHeadTitle'>결재하기</span><span class='xClose' onclick='closeModal(this)'><i class='fa-solid fa-xmark'></i></span></div>" +
    "<div class='modal-body'><div class='labelContainer'>" +
    "<label><input type='radio' name='type'  value='approve' checked>승인</label>" +
    "<label><input type='radio' name='type' value='reject'>반려</label></div>" +
    "<div class='commentContainer'><label>의견 </label><textarea class='approvalComment'></textarea></div></div>" +
    "<div class='modalFoot'>" +
    "<button class='modalBtns close' id='quit' onclick='closeModal(this)'>취소</button>" +
    "<button class='modalBtns confirm' id='set' onclick='approveBtnEvent()'>결재</button></div></div>";
  $(".modal-wrap").html(setAppModalHtml);
  $(".modal-wrap").show();


}

//결재하기 버튼
function approveBtnEvent() {
  let formId = storage.reportDetailData.formId;
  let selectVal = $(":radio[name='type']:checked").val();
  let comment = $(".approvalComment").val();
  comment = comment.replaceAll("\n", "<br />");
  $(".modal-wrap").hide();
  let type;
  let appLine = storage.reportDetailData.appLine;
  let ordered;

  for (let i = 0; i < appLine.length; i++) {
    if (appLine[i].employee == storage.my) {
      ordered = appLine[i].ordered;
      if (storage.newAppLine != undefined) {
        storage.newAppLine = storage.newAppLine.slice(
          i + 1,
          storage.newAppLine.length
        );
      } else {
        storage.newAppLine = null;
      }
    }
  }

  let soppVal = $("#" + formId + "_sopp").val();
  let customerVal = $("#" + formId + "_infoCustomer").val();
  let soppResult = "";

  for (let x in storage.soppList) {
    if (storage.soppList[x].title == soppVal) {
      soppResult = storage.soppList[x].no;
    }
  }
  let cusResult = "";
  for (let x in storage.customer) {
    if (customerVal != "" && storage.customer[storage.customer[x].no].name == customerVal) {
      cusResult = storage.customer[x].no;
    }
  }



  if (formId != "doc_Form_leave" && formId != "doc_Form_extension") {
    if (
      ((storage.reportDetailData.sopp == null && soppResult == "") ||
        storage.reportDetailData.sopp == soppResult) &&
      ((storage.reportDetailData.customer == null && cusResult == "") ||
        storage.reportDetailData.customer == cusResult) &&
      storage.oriCbContainer == $("input[name='" + formId + "_RD']:checked").attr("id") &&
      storage.oriTitle == $("#" + formId + "_title").val() &&
      storage.oriContent == $("#" + formId + "_content").val() &&
      storage.oriInsertedDataList == $(".insertedDataList").html()
    ) {
      storage.newDoc = null;
    } else {
      storage.newDoc = $(".seletedForm").html();
    }
  } else {
    if (
      storage.oriTitle == $("#" + formId + "_title").val() &&
      storage.oriContent == $("#" + formId + "_content").val() &&
      storage.oriInsertedData == $(".insertedData").html()
    ) {
      storage.newDoc = null;
    } else {
      storage.newDoc = $(".seletedForm").html();
    }
  }

  selectVal === "approve" ? (type = 1) : (type = 0);
  storage.newFileData == undefined || storage.newFileData.length == 0
    ? (storage.newFileData = null)
    : (storage.newFileData = storage.newFileData);

  let title = $("#" + formId + "_title").val();
  if (storage.reportDetailData.title == title) {
    title = null;
  }

  let appDoc;
  if (
    storage.newAppLine != undefined ||
    (storage.newAppLine != null && storage.newAppLine.length > 0)
  ) {
    appDoc = $(".seletedForm").html();
  } else {
    storage.newAppLine = null;
    appDoc = null;
  }



  let maintenance = (storage.reportDetailData.related.maintenance == "" ||
    storage.reportDetailData.related.maintenance == undefined || storage.reportDetailData.related.maintenance == null) ? "" : storage.reportDetailData.related.maintenance;

  let related;
  if (formId.toString().includes("SalesReport")) {
    related = {
      "next": "",
      "parent": "",
      "previous": "sopp:" + storage.reportDetailData.sopp,
      "maintenance": maintenance,
    }
  } else {
    related = {
      "next": "",
      "parent": "",
      "previous": "",
    }
  }
  related = JSON.stringify(related);


  let data = {
    doc: storage.newDoc,
    comment: comment,
    files: storage.newFileData,
    appLine: storage.newAppLine,
    appDoc: appDoc,
    sopp: soppResult + "",
    customer: cusResult + "",
    title: title,
    related: related,
  };


  data = JSON.stringify(data);
  window.data = data;
  data = cipher.encAes(data);

  $.ajax({
    url:
      apiServer +
      "/api/gw/app/proceed/" +
      storage.reportDetailData.docNo +
      "/" +
      ordered +
      "/" +
      type,
    method: "post",
    dataType: "json",
    data: data,
    contentType: "text/plain",
    cache: false,
    success: (data) => {
      if (data.result === "ok") {
        alert("결재 완료");
        location.href = "/gw/wait";
      } else {
        alert("결재 실패");
      }
    },
  });
}


//결재선 수정 모달
function showGwModal() {
  let setGwModalHtml =
    "<div class='gwModal'>" +
    "<div class='modalHead'><span class='modalHeadTitle'>결재선 수정( * 현재 결재 단계 이후만 추가/삭제 가능)</span><span id='close' onclick='closeGwModal(this)' class='xClose'><i class='fa-solid fa-xmark'></i></span></div>" +
    "<div class='lineDetail'>" +
    "<div class='lineTop'>" +
    "<div class='innerDetail' id='lineLeft'></div>" +
    "<div class='innerDetail crudBtns' id='lineCenter'>" +
    "<button class='appTypeBtn'  onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
    "<button class='appTypeBtn'  onclick='check(this.value);setExamine();' value='approval'>결재 &gt;</button>" +
    "<button class='appTypeBtn'  onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
    "<button class='appTypeBtn'  onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
    "<div class='innerDetail' id='lineRight'>" +
    "<div></div>" +
    "<div><div class='defaultFormSpanDiv'>검토</div>" +
    "<div class='typeContainer' id='examine'></div></div>" +
    "<div><div class='defaultFormSpanDiv'>결재</div>" +
    "<div class='typeContainer' id='approval'></div></div>" +
    "<div><div class='defaultFormSpanDiv'>수신</div>" +
    "<div class='typeContainer' id='conduct'></div></div>" +
    "<div><div class='defaultFormSpanDiv'>참조</div>" +
    "<div class='typeContainer' id='refer'></div></div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='modalFoot'>" +
    " <button class='modalBtns close' id='reset' onclick='closeGwModal(this)'>초기화</button>" +
    // " <button  class='modalBtns close' id='close' onclick='closeGwModal(this)'>취소</button>" +
    " <button  class='modalBtns confirm' id='modify' onclick='closeGwModal(this)'>수정</button>" +
    "</div>" +
    "</div>" +
    "</div>";
  $(".modal-wrap").html(setGwModalHtml);

  let orgChartTarget = $("#lineLeft");
  let userData = new Array();
  let x;
  let my = storage.my;
  let appLine = storage.reportDetailData.appLine;
  // 내 앞의 결재선에 해당되는 사람은 출력하지 않음 !

  let disabledUser = [];

  for (let i = 0; i < storage.reportDetailData.appLine.length; i++) {
    disabledUser.push(storage.reportDetailData.appLine[i].employee);
    if (my == storage.reportDetailData.appLine[i].employee) {
      break;
    }
  }

  let gwTreeHtml = storage.dept.tree.getGwHtml();
  orgChartTarget.html(gwTreeHtml);
  $(".modal-wrap").show();
  setDefaultModalData();


}



function setExamine() {
  let appLine = storage.reportDetailData.appLine;
  let my = storage.my;
  let myTurn, myappType, cutNum;
  for (let i = 0; i < appLine.length; i++) {
    if (appLine[i].employee == my) {
      myappType = appLine[i].appType;
      cutNum = i;
    }
  }

  if (myappType == 2) {
    $(".appTypeBtn")[0].disabled = false;
  }


}

function setDefaultModalData() {
  let appLine = storage.reportDetailData.appLine;
  let my = storage.my;
  let myTurn, myappType, cutNum;
  for (let i = 0; i < appLine.length; i++) {
    if (appLine[i].employee == my) {
      myTurn = appLine[i].ordered;
      myappType = appLine[i].appType;
      cutNum = i;
    }
  }


  for (let j = 0; j <= cutNum; j++) {
    $("#cb" + appLine[j].employee).hide();
  }


  let examineHtml = "";
  let approvalHtml = "";
  let conductHtml = "";
  let referHtml = "";

  // 내 이후의 결재선만 출력함
  for (let i = 1; i < appLine.length; i++) {

    if (appLine[i].appType == 0) {
      if (appLine[i].ordered <= myTurn) {
        examineHtml +=
          "<div class='lineDataContainer' id='lineContainer_" +
          appLine[i].employee +
          "'><label id='linedata_" +
          appLine[i].employee +
          "'>" +
          storage.user[appLine[i].employee].userName +
          "</label></div>";
      } else {
        examineHtml +=
          "<div class='lineDataContainer' id='lineContainer_" +
          appLine[i].employee +
          "'><label id='linedata_" +
          appLine[i].employee +
          "'>" +
          storage.user[appLine[i].employee].userName +
          "</label><button value='" +
          i +
          "' onclick='upClick(this)'>▲</button><button  value='" +
          appLine[i].employee +
          "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
      }
    } else if (appLine[i].appType == 2) {
      if (appLine[i].ordered <= myTurn) {
        approvalHtml +=
          "<div class='lineDataContainer' id='lineContainer_" +
          appLine[i].employee +
          "'><label id='linedata_" +
          appLine[i].employee +
          "'>" +
          storage.user[appLine[i].employee].userName +
          "</label></div>";
      } else {
        approvalHtml +=
          "<div class='lineDataContainer' id='lineContainer_" +
          appLine[i].employee +
          "'><label id='linedata_" +
          appLine[i].employee +
          "'>" +
          storage.user[appLine[i].employee].userName +
          "</label><button value='" +
          i +
          "' onclick='upClick(this)'>▲</button><button  value='" +
          appLine[i].employee +
          "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
      }

    } else if (appLine[i].appType == 3) {
      conductHtml +=
        "<div class='lineDataContainer' id='lineContainer_" +
        appLine[i].employee +
        "'><label id='linedata_" +
        appLine[i].employee +
        "'>" +
        storage.user[appLine[i].employee].userName +
        "</label><button value='" +
        i +
        "' onclick='upClick(this)'>▲</button><button  value='" +
        appLine[i].employee +
        "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
    } else if (appLine[i].appType == 4) {
      referHtml +=
        "<div class='lineDataContainer' id='lineContainer_" +
        appLine[i].employee +
        "'><label id='linedata_" +
        appLine[i].employee +
        "'>" +
        storage.user[appLine[i].employee].userName +
        "</label><button value='" +
        i +
        "' onclick='upClick(this)'>▲</button><button  value='" +
        appLine[i].employee +
        "' onclick='downClick(this) '>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
    }

    // if (myappType == 0) {
    $("#examine").html(examineHtml);
    $("#approval").html(approvalHtml);
    $("#conduct").html(conductHtml);
    $("#refer").html(referHtml);
    // } else if (myappType == 2) {
    //   $("#conduct").html(conductHtml);
    //   $("#refer").html(referHtml);
    // } 


    if (myappType == 2) {
      let button = $(".appTypeBtn")[0];
      $(button).prop("disabled", "disabled");

    }
  }
}

function closeGwModal(obj) {
  let id = obj.id;
  if (id == "close") {
    $(".modal-wrap").hide();

    // ====================================================초기화
  } else if (id == "reset") {
    reset();
    setAppLineData();
  } else if (id == "modify") {
    // 내가 결재자이고 수정할때 아무것도 입력되지 않은 경우에 그냥 원래 결재정보로 그리는 것
    let appLine = storage.reportDetailData.appLine;
    let myType;
    let my = storage.my;
    for (let i = 0; i < appLine.length; i++) {
      if (appLine[i].employee == my + "") {
        myType = appLine[i].appType;
      }

    }

    //내 결재 타입이 검토인 경우 ========================================================================
    if (myType == 0) {
      if ($(".typeContainer")[1].children.length == 0) {
        alert("결재자를 선택하세요");
      } else {
        let appLine = storage.reportDetailData.appLine;
        let my = storage.my;
        let myOrdered;
        if (storage.newAppLine != undefined) {
          storage.newAppLine = undefined;
        }

        for (let i = 0; i < appLine.length; i++) {

          let combineData = [];

          combineData.push([appLine[0].appType, appLine[0].employee + ""]);
          let target = $(".typeContainer");

          for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < target[i].children.length; j++) {
              let id = target[i].children[j].id.split("_")[1];
              let targetId = target[i].id;

              if (targetId == "examine") {
                targetId = 0;
              } else if (targetId == "agree") {
                targetId = 1;
              } else if (targetId == "approval") {
                targetId = 2;
              } else if (targetId == "conduct") {
                targetId = 3;
              } else if (targetId == "refer") {
                targetId = 4;
              }

              combineData.push([targetId, id]);
            }
          }

          storage.newAppLine = combineData;




          $(".modal-wrap").hide();
          $(".inputsAuto").css("background-color", "white");
          createNewLine(); // 문서 안에서 결재선 그리는 것
          // 문서 정보에서 결재선 정보 그리는 것
          // }
        }

      }
    } else { // 내 결재 타입이 결재인 경우 ============================================================== 

      // let num = 0;
      // for (let i = 0; i < $(".typeContainer").length; i++) {
      //   if ($(".typeContainer")[i].innerHTML == "") {
      //     num++;
      //   }
      // }

      // if (num == 3) {
      //   $(".modal-wrap").hide();
      //   reset();
      //   setAppLineData();
      // } else {
      if ($(".typeContainer")[1].children.length == 0) {
        alert("결재자를 선택하세요");
      } else {
        let appLine = storage.reportDetailData.appLine;
        let my = storage.my;
        let myOrdered;
        if (storage.newAppLine != undefined) {
          storage.newAppLine = undefined;
        }

        for (let i = 0; i < appLine.length; i++) {

          let combineData = [];
          combineData.push([appLine[0].appType, appLine[0].employee + ""]);
          // 기존 데이터 넣기
          for (let i = 0; i < appLine.length; i++) {
            if (appLine[i].ordered <= Number(myOrdered)) {
              combineData.push([appLine[i].appType, appLine[i].employee + ""]);
            }
          }

          let target = $(".typeContainer");

          for (let i = 0; i < target.length; i++) {
            for (let j = 0; j < target[i].children.length; j++) {
              let id = target[i].children[j].id.split("_")[1];
              let targetId = target[i].id;

              if (targetId == "examine") {
                targetId = 0;
              } else if (targetId == "agree") {
                targetId = 1;
              } else if (targetId == "approval") {
                targetId = 2;
              } else if (targetId == "conduct") {
                targetId = 3;
              } else if (targetId == "refer") {
                targetId = 4;
              }

              combineData.push([targetId, id]);
            }
          }

          storage.newAppLine = combineData;
          console.log(storage.newAppLine + "확인 ++++++++++ㅇㅇㅇㅇㅇㅇ++++++++ㅇ+ㅇ+ㅇ+ㅇ+ㅇ++ㅇ+ㅇ+ ")
          $(".modal-wrap").hide();
          $(".inputsAuto").css("background-color", "white");
          createNewLine(); // 문서 안에서 결재선 그리는 것
          // 문서 정보에서 결재선 정보 그리는 것
        }
      }
    }
    // }
  }

  // }
}


//새 결재선 그리기 
function createNewLine() {
  let formId = storage.reportDetailData.formId;
  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");
  let newAppLine = storage.newAppLine;


  let newCombine = [[], [], [], [], []];

  //내 순서 확인하고 title 잘라버리기

  for (let i = 0; i < newAppLine.length; i++) {
    if (newAppLine[i][1] == storage.my) {
      myType = newAppLine[i][0];
    }
  }
  console.log(newAppLine + "확인하기 2 ");



  for (let i = 0; i < newCombine.length; i++) {
    for (let j = 0; j < newAppLine.length; j++) {
      if (j > 0 && i == newAppLine[j][0]) {
        newCombine[i].push(newAppLine[j][1]);
      }
    }
  }

  console.log(newCombine);





  console.log(newCombine + "새 결재선 조합 확인 ");


  let testHtml =
    "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" +
    storage.userRank[storage.user[storage.newAppLine[0][1]].rank][0] +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" +
    storage.user[storage.newAppLine[0][1]].userName +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='승인'></div>" +
    "<div class='dateBorder'><input type='text' class='inputsAuto' disabled value='" +
    getYmdSlashShort(storage.reportDetailData.appLine[0].read) +
    "'></div></div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
  // let referHtml = "";
  let titleArr = ["검토", "합의", "결재", "수신", "참조"];
  let titleId = ["examine", "agree", "approval", "conduct", "refer"];

  for (let i = 0; i < newCombine.length; i++) {
    if (newCombine[i].length != 0 && i < 3) {
      // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우
      testHtml +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
    } else if ((newCombine[i].length != 0) != 0 && i == 3) {
      // 결재타입이 수신인 경우
      testHtml2 +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
    }

    for (let j = 0; j < newCombine[i].length; j++) {
      // 수신
      if (i == 3) {
        testHtml2 +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[newCombine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[newCombine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[newCombine[i][j]].userName +
          "' data-detail='" +
          storage.user[newCombine[i][j]].userNo +
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
      }
      else if (i == 4) {
        console.log("참조구나");
      }

      // 검토 합의 결재
      else {
        testHtml +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[newCombine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[newCombine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[newCombine[i][j]].userName +
          "' data-detail='" +
          storage.user[newCombine[i][j]].userNo +
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

    if (newCombine[i].length != 0 && i < 3) {
      testHtml += "</div>";
    } else if (newCombine[i].length != 0 && i == 3) {
      testHtml2 += "</div>";
    }
  }

  testHtml += "</div>";
  testHtml2 += "</div>";

  testHtml += testHtml2;
  lineTarget.html(testHtml);


  drawNewCommentLine();
  for (let i = 0; i < newCombine.length; i++) {
    let titleId = ["examine", "agree", "approval", "conduct", "refer"];
    let formId = storage.reportDetailData.formId;
    for (let j = 0; j < newCombine[i].length; j++) {
      for (let k = 1; k < storage.reportDetailData.appLine.length; k++) {
        if (
          newCombine[i][j] ==
          storage.reportDetailData.appLine[k].employee + ""
        ) {
          let approved = "",
            status = "";
          if (storage.reportDetailData.appLine[k].approved != null) {
            approved = getYmdShortSlash(
              storage.reportDetailData.appLine[k].approved
            );
            status = "승인";
          } else if (storage.reportDetailData.appLine[k].rejected != null) {
            approved = getYmdShortSlash(
              storage.reportDetailData.appLine[k].rejected
            );
            status = "반려";
          }

          $("." + formId + "_" + titleId[i] + "_status")[j].value = status;
          $("." + formId + "_" + titleId[i] + "_approved")[j].value = approved;
        }
      }
    }
  }


}

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

  console.log(count + "체크박수 개수 확인 =============");

  let selectHtml = "";
  if ((name == "approval" && count == 1)) {
    $("#examine").append($("#" + name).html());
  }


  if (name == "approval" && count > 1) {
    alert("결재자는 한명만 설정할 수 있습니다");
  } else {
    for (let i = 0; i < inputLength.length; i++) {

      let id = inputLength[i].id.substring(2, inputLength[i].id.length);
      if ($("#cb" + id).prop("checked")) {
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
    if (name == "approval") {
      html = "";
    }
    html += selectHtml;
    target.html(html);

    $(".testClass").prop("checked", false);
  }


}
//End of check(name)


// 상단 버튼 관련 함수 ----------------------------------------------------------------------------------------------------------------------------------------------
// 문서 수정시 변경이력에 반영
function reportModify() {
  let formId = storage.reportDetailData.formId;
  let content = CKEDITOR.instances[formId + "_content"].getData();
  $(".modal-wrap").hide();
  $("button[name='modConfirm']:last-child").remove();
  $("button[name='modConfirm']:last-child").remove();
  $(".cke_editable").remove();

  $("button[name='approvalBtn']")[0].disabled = false;
  $("input[name='" + formId + "_RD']").prop("disabled", true);
  $("#" + formId + "_content").attr("data-detail", content);
  $("#" + formId + "_content").val(content);
  $("#" + formId + "_content").hide();
  $("." + formId + "_content").html(content);
  $("." + formId + "_content").show();
  $(":file").css("display", "none");
  getFileArr();
  toReadMode();

}

//문서 수정 버튼 누르면 수정 완료 버튼 생성
function createConfirmBtn() {
  let div = document.getElementsByClassName("mainBtnDiv");
  if (div[0].childElementCount < 6) {
    $(".mainBtnDiv").append(
      "<button type='button'name='modConfirm' onclick='reportModify()' >수정완료 </button>" +
      "<button type='button'name='modConfirm' onclick=' getDetailView()'>문서 수정 초기화</button>"
    );
  }
  $(":file").css("display", "inline");
  getFileModArr();

  storage.newFileData = [];
  for (let i = 0; i < $(".files").length; i++) {
    storage.newFileData.push($(".files")[i].dataset.detail);
  }

  ///결재하기 버튼 disabled

  $("button[name='approvalBtn']")[0].disabled = true;
  let formId = storage.reportDetailData.formId;
  $("." + formId + "_content").hide();
  $("#" + formId + "_content").val($("." + formId + "_content").html());
  $("#" + formId + "_content").attr("data-detail", $("." + formId + "_content").html());
  storage.editorArray = [formId + "_content"];
  ckeditor.config.readOnly = false;
  window.setTimeout(setEditor, 100);

  $("input[name='" + formId + "_RD']").prop("disabled", false);
  if (formId != "doc_Form_leave" && formId != "doc_Form_extension") {
    setSoppList();

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

    if (formId == "doc_Form_SalesReport") {
      $("#" + formId + "_endCustName").attr("list", "_infoCustomer");
    }
    setCusDataList();
    setProductData();
  }

}


function reset() {
  let formId = storage.reportDetailData.formId;
  let appLine = storage.reportDetailData.appLine;
  let testHtml =
    "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" +
    storage.userRank[storage.user[appLine[0].employee].rank][0] +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='" +
    storage.user[appLine[0].employee].userName +
    "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' disabled value='승인'></div>" +
    "<div class='dateBorder'><input type='text' class='inputsAuto' disabled value='" +
    getYmdSlashShort(appLine[0].read) +
    "'></div></div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
  //let referHtml = "";
  let titleArr = ["검토", "합의", "결재", "수신", "참조"];

  let titleId = ["examine", "agree", "approval", "conduct", "refer"];
  let newCombine = [[], [], [], []];

  for (let i = 1; i < appLine.length; i++) {
    for (let j = 0; j < newCombine.length; j++) {
      if (appLine[i].appType == j) {
        newCombine[j].push(appLine[i].employee);
      }
    }
  }

  for (let i = 0; i < newCombine.length; i++) {
    if (newCombine[i].length != 0 && i < 3) {
      // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우
      testHtml +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
    } else if ((newCombine[i].length != 0) != 0 && i == 3) {
      // 결재타입이 수신인 경우
      testHtml2 +=
        "<div class='lineGrid'><div class='lineTitle'>" +
        titleArr[i] +
        "</div>";
    }

    for (let j = 0; j < newCombine[i].length; j++) {
      // 수신
      if (i == 3) {
        testHtml2 +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[newCombine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[newCombine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[newCombine[i][j]].userName +
          "' data-detail='" +
          storage.user[newCombine[i][j]].userNo +
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
      }


      else if (i == 4) {
        console.log("참조");
      }

      // 검토 합의 결재
      else {
        testHtml +=
          "<div class='lineSet'><div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "_position" +
          "' value='" +
          storage.userRank[storage.user[newCombine[i][j]].rank][0] +
          "' data-detail='" +
          storage.user[newCombine[i][j]].rank +
          "'/></div>" +
          "<div class='twoBorder'><input type='text' disabled class='inputsAuto " +
          formId +
          "_" +
          titleId[i] +
          "' value='" +
          storage.user[newCombine[i][j]].userName +
          "' data-detail='" +
          storage.user[newCombine[i][j]].userNo +
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

    if (newCombine[i].length != 0 && i < 3) {
      testHtml += "</div>";
    } else if (newCombine[i].length != 0 && i == 3) {
      testHtml2 += "</div>";
    }
  }

  testHtml += "</div>";
  testHtml2 += "</div>";

  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");
  testHtml += testHtml2;
  lineTarget.html(testHtml);

  // $(".selectedRefer").html(referHtml);

  $(".modal-wrap").hide();

  drawCommentLine();


}



// 결재선 저장 관련 함수 ---------------------------------------------------------------------------------------------------------------------------------------------------
function setSavedLine(obj) {
  let val = obj.value;
  if (val == "middle") {
    $("#examine").html(
      "<div class='lineDataContainer' id='lineContainer_4'><label id='linedata4'>구민주</label><button value='4' onclick='upClick(this)'>▲</button><button  value='4'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#approval").html(
      "<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#agree").html("");
    $("#conduct").html("");
    $("#refer").html("");
  } else if (val == "basic") {
    $("#approval").html(
      "<div class='lineDataContainer' id='lineContainer_0'><label id='linedata0'>이승우</label><button value='0' onclick='upClick(this)'>▲</button><button  value='0'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    );
    $("#agree").html("");
    $("#examine").html("");
    $("#conduct").html("");
    $("#refer").html("");
  }
}


// 파일 관련 함수 ----------------------------------------------------------------------------------------------------------------------------------------------------------
function setSelectedFiles() {
  let method, data, type, attached;
  attached = $(document).find("[name='attached[]']")[0].files;

  if (storage.newFileData === undefined || storage.newFileData <= 0) {
    storage.newFileData = [];
  }

  let fileDataArray = storage.newFileData;
  for (let i = 0; i < attached.length; i++) {
    let reader = new FileReader();
    let fileName;

    fileName = attached[i].name;

    // 파일 중복 등록 제거
    if (!storage.newFileData.includes(fileName)) {
      storage.newFileData.push(fileName);

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
      "<div><div class='files' data-detail='" +
      fileDataArray[i] +
      "'>" +
      fileDataArray[i] +
      "<button type='button' onclick='fileRemove(this)'>x</button></div></div>";
  }
  $(".selectedFileDiv").html(html);
}




// 데이터 리스트 관련 함수 ---------------------------------------------------------------------------------------------------------------------------------------------------

function getSopp() {
  let formId = storage.reportDetailData.formId;
  let slistid = "infoSopp";
  let soppVal = $("#" + formId + "_sopp").val();
  let soppResult = dataListFormat(slistid, soppVal);
  storage.sopp = soppResult;
  let clistid = "infoCustomer";
  let customerVal = $("#" + formId + "_infoCustomer").val();
  let customerResult = dataListFormat(clistid, customerVal);
  storage.customer = customerResult;
}


// 추가할때.
function setCusDataList() {

  let id = storage.reportDetailData.formId;

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



function setSoppList() {
  let formId = storage.reportDetailData.formId;
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

  // //선택 후 수정하는 경우에
  if (formId == "doc_Form_Resolution") {
    $(".deletebtn").next().hide();
  }
}



function setProductData() {
  let data = storage.formList;

  let formId = storage.reportDetailData != undefined ? storage.reportDetailData.formId : data[$(".formNumHidden").val()].id;
  let targetHtml = $("." + formId + "_product")[0].innerHTML;
  let y;
  let productListhtml = "";
  productListhtml = "<datalist id='_product'>";
  for (let y = 0; y < storage.product.length; y++) {
    productListhtml +=
      "<option data-value='" +
      storage.product[y].no +
      "' value='" +
      storage.product[y].name +
      "'></option> ";
  }

  targetHtml += productListhtml;
  $("." + formId + "_product")[0].innerHTML = targetHtml;
  $("." + formId + "_product").attr("list", "_product");
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
// }









// 일괄 승인 관련 함수 Start -------------------------------------------------------------------------------------------------------------------------------------------------



function allCbEvent(obj) {

  if ($(obj).prop("checked")) {
    $("input[name='batchBtns']").prop("checked", "checked");
  } else {
    $("input[name='batchBtns']").prop("checked", "");
  }

}


let batchCount = 0;
function doBatchApproval() {
  if ($(".loading-overlay").css("display") == 'none') {
    $("#loadingDiv").loading("toggle");
  }
  let batchData = [];
  let insertData;
  let batchBtns = $("input[name='batchBtns']:checked");

  if (batchBtns.length == 0) {
    alert("승인/반려할 문서를 선택하세요");
  } else {
    for (let i = 0; i < batchBtns.length; i++) {
      batchData.push(batchBtns[i].dataset.detail);
    }

    insertData = batchData[batchCount];

    $.ajax({
      url: apiServer + "/api/gw/app/doc/" + insertData,
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

          let approveData, sopp, customer, related, appLine, ordered;
          sopp = (storage.reportDetailData.sopp == "" || storage.reportDetailData.sopp == null || storage.reportDetailData.sopp == undefined) ? "" : storage.reportDetailData.sopp;
          customer = (storage.reportDetailData.custmer == "" || storage.reportDetailData.custmer == null || storage.reportDetailData.custmer == undefined) ? "" : storage.reportDetailData.customer;
          related = storage.reportDetailData.related;
          related = JSON.stringify(related);
          appLine = storage.reportDetailData.appLine;
          for (let i = 0; i < appLine.length; i++) {
            if (appLine[i].employee == storage.my)
              ordered = appLine[i].ordered;
          }


          approveData = {
            doc: null,
            comment: null,
            files: null,
            appLine: null,
            appDoc: null,
            sopp: sopp,
            customer: customer,
            title: null,
            related: related,
          };

          approveData = JSON.stringify(approveData);
          console.log(approveData);
          approveData = cipher.encAes(approveData);
          $.ajax({
            url:
              apiServer +
              "/api/gw/app/proceed/" +
              storage.reportDetailData.docNo +
              "/" +
              ordered +
              "/1",
            method: "post",
            dataType: "json",
            data: approveData,
            contentType: "text/plain",
            cache: false,
            success: (data) => {
              if (data.result === "ok") {

                batchCount++;
                if (batchCount < batchData.length) {
                  doBatchApproval();
                } else {
                  $(".loading-overlay").hide();
                  msg.set("일괄 결재 완료");
                  location.href = "/gw/wait";

                }


              } else {
                console.log("결재 실패" + batchCount)
                batchCount++;
                if (batchCount < batchData.length) {
                  doBatchApproval();
                }

              }
            },
          });


        } else {
          console.log("상세조회에 실패함" + batchCount)
          batchCount++;
          if (batchCount < batchData.length) {
            doBatchApproval();
          }

        }
      },
    });
  }
}





function doBatchReject() {
  if ($(".loading-overlay").css("display") == 'none') {
    $("#loadingDiv").loading("toggle");
  }
  let batchData = [];
  let insertData;
  let batchBtns = $("input[name='batchBtns']:checked");

  if (batchBtns.length == 0) {
    alert("승인/반려할 문서를 선택하세요");
  } else {
    for (let i = 0; i < batchBtns.length; i++) {
      batchData.push(batchBtns[i].dataset.detail);
    }

    insertData = batchData[batchCount];

    $.ajax({
      url: apiServer + "/api/gw/app/doc/" + insertData,
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

          let approveData, customer, related, appLine, ordered;
          customer = (storage.reportDetailData.custmer == "" || storage.reportDetailData.custmer == null || storage.reportDetailData.custmer == undefined) ? "" : storage.reportDetailData.customer;
          related = storage.reportDetailData.related;
          related = JSON.stringify(related);
          appLine = storage.reportDetailData.appLine;
          for (let i = 0; i < appLine.length; i++) {
            if (appLine[i].employee == storage.my)
              ordered = appLine[i].ordered;
          }


          approveData = {
            doc: null,
            comment: null,
            files: null,
            appLine: null,
            appDoc: null,
            sopp: storage.reportDetailData.sopp + "",
            customer: storage.reportDetailData.customer + "",
            title: null,
            related: related,
          };

          approveData = JSON.stringify(approveData);
          approveData = cipher.encAes(approveData);
          $.ajax({
            url:
              apiServer +
              "/api/gw/app/proceed/" +
              storage.reportDetailData.docNo +
              "/" +
              ordered +
              "/0",
            method: "post",
            dataType: "json",
            data: approveData,
            contentType: "text/plain",
            cache: false,
            success: (data) => {
              if (data.result === "ok") {

                batchCount++;
                if (batchCount < batchData.length) {
                  doBatchReject();
                } else {
                  $(".loading-overlay").hide();
                  msg.set("일괄 결재 완료");
                  location.href = "/gw/wait";
                }


              } else {
                console.log("결재 실패" + batchCount)
                batchCount++;
                if (batchCount < batchData.length) {
                  doBatchReject();
                }

              }
            },
          });


        } else {
          console.log("상세조회에 실패함" + batchCount)
          batchCount++;
          if (batchCount < batchData.length) {
            doBatchReject();
          }

        }
      },
    });
  }
}


function getTotalCount() {
  let id = stroage.reportDetailData.formId;
  let totalCount = Number(0);
  for (let i = 0; i < $("." + id + "_total").length; i++) {
    if ($("." + id + "_total")[i].dataset.detail != undefined) {
      totalCount += Number(
        $("." + id + "_total")
        [i].dataset.detail.replace(",", "")
          .replace(",", "")
          .replace(",", "")
          .replace(",", "")
          .replace(",", "")
          .replace(",", "")
          .replace(",", "")
          .replace(",", "")
      );
    } else {
      totalCount += 0;
    }
  }
  $(".insertedTotal").val(Number(totalCount).toLocaleString() + "원");
  $(".insertedTotal")[0].dataset.detail = Number(totalCount).toLocaleString();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
