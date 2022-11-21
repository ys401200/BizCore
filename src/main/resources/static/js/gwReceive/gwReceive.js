$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  referDefault();
});

// 참조 문서는 상세 조회가 가능하고 열람은 결재가 끝난 후에 참조/열람 문서함에서 열람 가능함
function referDefault() {










  $(".modal-wrap").hide();
  $("#gwSubTabTitle").html("결재 수신 문서");



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

    let url, method, data, type;
    url = "/api/gw/app/wait";
    method = "get";
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, successList, errorList);

    $(".searchContainer").show();
    $(".listPageDiv").show();
  }


}

function successList(result) {
  storage.receiveList = result;
  window.setTimeout(drawApproval, 200);
}

function errorList() {
  alert("에러");
}

function drawApproval() {
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

  if (
    storage.receiveList.receive === undefined ||
    storage.receiveList.receive.length == 0
  ) {
    container = $(".listDiv");

    header = [
      // {
      //   title: "번호",
      //   align: "center",
      // },
      {
        title: "작성일",
        align: "center",
      },
      {
        title: "결재 타입",
        align: "center",
      },
      {
        title: "문서종류",
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

    ];
    createGrid(container, header, data, ids, job, fnc);

    container.append(
      "<div class='noListDefault'>결재 수신 문서가 없습니다</div>"
    );
  } else {
    // jsonData = storage.receiveList.receive;
    let tt = [];
    for (let i = storage.receiveList.receive.length - 1; i >= 0; i--) { tt.push(storage.receiveList.receive[i]) };
    jsonData = tt;
    result = paging(jsonData.length, storage.currentPage, 5);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");
    header = [
      // {
      //   title: "번호",
      //   align: "center",
      // },
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
      str = [
        // {
        //   "setData": jsonData[i].docNo,
        //   "align" : "center"
        // },
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

      ];

      fnc = "detailView(this)";
      ids.push(jsonData[i].docNo);
      data.push(str);
    }

    let pageNation = createPaging(
      pageContainer[0],
      result[3],
      "pageMove",
      "drawApproval",
      result[0]
    );
    pageContainer[0].innerHTML = pageNation;
    createGrid(container, header, data, ids, job, fnc);
  }
} // End of drawNoticeApproval()

function detailView(obj) {
  // 선택한 그리드의 글 번호 받아오기
  let no;
  if (storage.reportDetailData == undefined) {
    no = obj.dataset.id;
  } else {
    no = storage.reportDetailData.docNo;
  }

  $.ajax({
    url: apiServer + "/api/gw/app/doc/" + no,
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
} // End of noticeDetailView();

///글 제목 눌렀을때 상세 조회하는 페이지 그리기
function getDetailView() {
  let testForm = storage.reportDetailData.doc;
  console.log(testForm);

  let detailHtml =
    "<div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button type='button'onclick='showAppModal()'>결재하기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button></div>" +
    "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div><div class='comment'></div></div>";
  //"<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='referDiv'><label>참조</label><div class='selectedRefer'></div></div><div class='selectedFile'></div></div><div class='comment'></div></div>";
  $(".listPageDiv").html(detailHtml);


  $(".seletedForm").html(testForm);
  $(":file").css("display", "none"); // 첨부파일 버튼 숨기기

  let tabHtml =
    "<div class='reportInfoTab tabs'>" +
    "<input type='radio' id='tablineInfo' name='tabItem' data-content-id='tabDetail' onclick='tabItemClick(this)' checked>" +
    "<label  class='tabItem' for='tablineInfo'  style='z-index:5; width:50% ; padding-left : 0%;'>문서정보</label>" +
    "<input type='radio' id='tabChangeInfo' name='tabItem' data-content-id='tabDetail2' onclick='tabItemClick(this)' >" +
    "<label  class='tabItem' for='tabChangeInfo' style='z-index:0; width:50% ; padding-left : 50%;' >변경이력</label></div>" +
    "<div class='tabDetail'id='tabDetail'></div><div class='tabDetail2' id='tabDetail2'></div>";
  $(".comment").html(tabHtml);

  toReadMode();
  drawCommentLine();
  drawChangeInfo();
  $(".tabDetail2").hide();
  getFileArr();

  let target = $(".seletedForm")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].value = inputsArr[i].dataset.detail;
    }
  }

  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.value = textAreaArr.dataset.detail;
  let selectArr = target.getElementsByTagName("select")[0];
  if (selectArr != undefined) {
    selectArr.value = selectArr.dataset.detail;
  }

  let formId = storage.reportDetailData.formId;

  // 상세타입 체크하게 하기
  let rd = $("input[name='" + formId + "_RD']");
  for (let i = 0; i < rd.length; i++) {
    if (rd[i].dataset.detail == "on") {
      $("#" + rd[i].id).prop("checked", true);
    }
  }
  $("input[name='" + formId + "_RD']").prop("disabled", true);

  // 기존 전자 결재 문서 가져온 경우
  if ($(".list_comment")[0].dataset.detail == "old") {
    let rd = $("input[name='" + formId + "_RD']");
    for (let i = 0; i < rd.length; i++) {
      if (rd[i].checked == true) {
        $("#" + rd[i].id).prop("checked", true);
      }
    }
    for (let i = 0; i < 3; i++) { let tt = $(".inputsAuto")[i]; $(tt).css("text-align", "left"); }

  } else {
    // 새문서 작성한 것 가져온 경우 구분
    let rd2 = $("input[name='" + formId + "_RD']");
    for (let i = 0; i < rd2.length; i++) {
      if (rd2[i].dataset.detail == "on") {
        $("#" + rd2[i].id).prop("checked", true);
      }
    }
  }

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

  storage.oriCbContainer = $("input[name='" + formId + "_RD']:checked").attr(
    "id"
  );
  storage.oriInsertedContent = $(".insertedContent").html();
  storage.oriInsertedDataList = $(".insertedDataList").html();
  storage.oriInfoData = $(".info").html();
  setAppLineData();

  $(".cke_editable").remove();
  $("." + formId + "_content").html($("#" + formId + "_content").attr("data-detail"));
  $("#" + formId + "_content").hide();
  $("." + formId + "_content").css("font-size", $("#" + formId + "_content").css("font-size"));
  $("." + formId + "_content").css("padding", "0.3em");
  if (storage.reportDetailData.confirmNo != 'null') {
    $("#" + formId + "_no").val(storage.reportDetailData.confirmNo);
    $("#" + formId + "_no").attr("data-detail", storage.reportDetailData.confirmNo);
    $("#" + formId + "_no").css("text-align", "left");

  }
}
function openPrintTab() {
  window.open("/gw/print/" + storage.reportDetailData.docNo, "인쇄하기", "width :210mm");
}



function showList() {
  location.href = "/gw/receive";
}

// 문서 정보 그리는 함수
function drawCommentLine() {
  let target = $("#tabDetail");

  let appLine = storage.reportDetailData.appLine;
  let appLineArr = new Array();
  let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"];
  for (let i = 1; i < appLine.length; i++) {
    let date, status, comment;

    if (appLine[i].approved == null && appLine[i].rejected == null) {
      if (appLine[i].read != null) {
        date = appLine[i].read;
        date = getYmdSlash(date);
        status = "조회";
      } else if (appLine[i].read == null) {
        date = "";
        status = "";
      }
    } else if (appLine[i].approved != null) {
      date = appLine[i].approved;
      date = getYmdSlash(date);
      status = "승인";
    } else if (appLine[i].rejected != null) {
      date = appLine[i].rejected;
      date = getYmdSlash(date);
      status = "반려";
    }

    if (appLine[i].comment == "null") {
      comment = "";
    } else {
      comment = appLine[i].comment;
    }

    let data = {
      appType: appTypeTitle[appLine[i].appType],
      name: storage.user[appLine[i].employee].userName,
      status: status,
      date: date,
      comment: comment,
    };

    appLineArr.push(data);
  }


  let html = "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled/>작성자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled/>열람 설정 없음</label></div></div>" +
    "<div class='readDiv selectedFile'><div>첨부파일</div><div><div class='selectedFileDiv'></div><div><input class='inputFile' multiple='' name='attached[]' type='file' onchange='setSelectedFiles()' style='display: none;'></div></div></div>";
  let detail =
    "<div class='lineDiv'><div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
  let lineDetailHtml = "";

  for (let i = 0; i < appLineArr.length; i++) {
    lineDetailHtml +=
      "<div class='tapLine examineLine'><div>" +
      appLineArr[i].appType +
      "</div><div>" +
      appLineArr[i].name +
      "</div><div>" +
      appLineArr[i].status +
      "</div><div>" +
      appLineArr[i].date +
      "</div><div>" +
      appLineArr[i].comment +
      "</div></div>";
  }

  lineDetailHtml += "</div>";
  detail += lineDetailHtml;

  detail += html;

  $(".tabLine").children(0).css("padding", "5em");

  target.html(detail);

  // 열람 권한 체크하기
  let readable = storage.reportDetailData.readable;
  if (readable == "dept") {
    $("#deptRd").prop("checked", true);
  } else if (readable == "none") {
    $("#noneRd").prop("checked", true);
  }
}

//  변경이력 그리는 함수
function drawChangeInfo() {
  let target = $("#tabDetail2");

  let revisionData = storage.reportDetailData.revisionHistory;
  let changeData = new Array();
  if (revisionData.length > 0) {
    for (let i = 0; i < revisionData.length; i++) {
      let modCause = "";
      if (revisionData[i].content.doc == true) {
        modCause += "문서 수정 ";
      }
      if (revisionData[i].content.files == true) {
        modCause += "첨부 파일 수정 ";
      }
      if (revisionData[i].content.appLine == true) {
        modCause += "결재선 수정 ";
      }

      revisionData[i].content.date;
      revisionData[i].content.content;

      let data = {
        type: "",
        name: storage.user[revisionData[i].employee].userName,
        modifyDate: getYmdSlash(revisionData[i].date),
        modCause: modCause,
      };
      changeData.push(data);
    }
  }

  let detail =
    "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
  let changeHtml = "";

  if (changeData.length == 0) {
    changeHtml += "<div class='tapLineBCenter'>변경 이력이 없습니다</div>";
  } else {
    for (let i = 0; i < changeData.length; i++) {
      changeHtml +=
        "<div class='tapLineB changeDataLine'>" +
        "<div class='changeType'>" +
        changeData[i].type +
        "</div><div class='changeName' >" +
        changeData[i].name +
        "</div><div class='changeDate'>" +
        changeData[i].modifyDate +
        "</div><div class='changeCause'>" +
        changeData[i].modCause +
        "</div>" +
        "</div>";
    }
  }

  detail += changeHtml;
  target.html(detail);
}

function getFileArr() {
  let target = $(".selectedFileDiv");
  let html = "";
  let originFileList = [];
  let no = storage.reportDetailData.no;
  let fileList = storage.reportDetailData.fileList;
  if (storage.newFileData == undefined) {
    for (let i = 0; i < fileList.length; i++) {
      html +=
        "<div><a href='/api/attached/docapp/" +
        no +
        "/" +
        encodeURI(fileList[i].fileName) +
        "'>" +
        fileList[i].fileName +
        "</a></div>";
    }
    target.html(html);
  } else {
    for (let i = 0; i < storage.newFileData.length; i++) {
      for (let j = 0; j < fileList.length; j++) {
        originFileList.push(fileList[j].fileName);
      }
      if (originFileList.includes(storage.newFileData[i])) {
        html +=
          "<div><a href='/api/attached/docapp/" +
          no +
          "/" +
          encodeURI(storage.newFileData[i]) +
          "'>" +
          storage.newFileData[i] +
          "</a></div>";
      } else {
        html += "<div style='color:navy'>" + storage.newFileData[i] + "</div>";
      }
    }
    target.html(html);
  }
}

function showAppModal() {
  // 결재하기 누르면 결재정보 창으로 세팅되어서 추가하는 것
  // $("#lineInfo").css("background-color", "#332E85");
  // $("#lineInfo").css("color", "white");
  // $("#lineInfo").css("border", "none");

  // $("#changeInfo").css("background-color", "white");
  // $("#changeInfo").css("color", "#332E85");
  // $("#changeInfo").css("border-bottom", "2px solid #332E85");
  // $("#tabDetail").show();
  // $("#tabDetail2").hide();

  let setAppModalHtml =
    "<div class='setApprovalModal'>" +
    "<div class='modal-title'>결재하기</div>" +
    "<div class='modal-body'><div class='labelContainer'>" +
    "<label><input type='radio' name='type'  value='approve' checked>승인</label>" +
    "<label><input type='radio' name='type' value='reject'>반려</label></div>" +
    "<label>의견 <textarea class='approvalComment'></textarea></label></div>" +
    "<div class='close-wrap'>" +
    "<button id='quit' onclick='closeModal(this)'>취소</button>" +
    "<button id='set' onclick='approveBtnEvent()'>결재</button></div></div>";
  $(".modal-wrap").html(setAppModalHtml);
  $(".modal-wrap").show();

  // $(".setApprovalModal").show();
  // $(".setModifyModal").hide();
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
    if (storage.customer[storage.customer[x].no].name == customerVal) {
      cusResult = storage.customer[x].no;
    }
  }

  // if (storage.reportDetailData.sopp == soppResult) {
  //   soppResult = "";
  // }
  // if (storage.reportDetailData.customer == cusResult) {
  //   cusResult = "";
  // }

  if (formId != "doc_Form_leave" && formId != "doc_Form_extension") {
    if (
      ((storage.reportDetailData.sopp == null && soppResult == "") ||
        storage.reportDetailData.sopp == soppResult) &&
      ((storage.reportDetailData.customer == null && cusResult == "") ||
        storage.reportDetailData.customer == cusResult) &&
      storage.oriCbContainer ==
      $("input[name='" + formId + "_RD']:checked").attr("id") &&
      storage.oriInsertedContent == $(".insertedContent").html() &&
      storage.oriInsertedDataList == $(".insertedDataList").html()
    ) {
      storage.newDoc = null;
    } else {
      storage.newDoc = $(".seletedForm").html();
    }
  } else {
    if (
      storage.oriInsertedContent == $(".insertedContent").html() &&
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

  let data = {
    doc: null,
    comment: comment,
    files: null,
    appLine: null,
    appDoc: null,
    sopp: soppResult + "",
    customer: cusResult + "",
    title: null,
  };

  console.log(data);
  data = JSON.stringify(data);
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
        location.href = "/gw/myreceive";
      } else {
        alert("결재 실패");
      }
    },
  });
}
let related = {
  fnc: "hr",
  type: "leave", // "overtime", "holidayWork"
  start: 169999999,
  end: 169999999,
  parent: null, // contract:1999999
  prev: null, // schedule:199999
  next: [],
  children: [],
};

// 모달별 버튼
function closeModal(obj) {
  $(".modal-wrap").hide();
  $("input:radio[name='type']").prop("checked", false);
}

function setAppLineData() {
  let appLine = storage.reportDetailData.appLine;
  let formId = storage.reportDetailData.formId;
  let appLineContainer = new Array();
  appLineContainer = [[], [], [], [], []];

  if (appLine[0].approved != null) {
    $("." + formId + "_writer_status").val("승인");
    $("." + formId + "_writer_approved").val(
      getYmdShortSlash(appLine[0].approved)
    );
  } else if (appLine[0].rejected != null) {
    $("." + formId + "_writer_status").val("회수");
    $("." + formId + "_writer_approved").val(
      getYmdShortSlash(appLine[0].rejected)
    );
  }

  for (let i = 1; i < appLine.length; i++) {
    for (let j = 0; j < appLineContainer.length; j++) {
      if (appLine[i].appType == j) {
        appLineContainer[j].push(appLine[i]);
      }
    }
  }

  let appTypeTitles = ["_examine", "_agree", "_approval", "_conduct", "_refer"];

  for (let i = 0; i < appLineContainer.length; i++) {
    for (let j = 0; j < appLineContainer[i].length; j++) {
      if (appLineContainer[i][j].approved != null) {
        $("." + formId + appTypeTitles[i] + "_status")[j].value = "승인";
        $("." + formId + appTypeTitles[i] + "_approved")[j].value =
          getYmdShortSlash(appLineContainer[i][j].approved);
      } else if (appLineContainer[i][j].rejected != null) {
        $("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
        $("." + formId + appTypeTitles[i] + "_approved")[j].value =
          getYmdShortSlash(appLineContainer[i][j].rejected);
      }
    }
  }
}
function getYmdSlash(date) {
  let d = new Date(date);
  return (
    (d.getFullYear() % 100) +
    "/" +
    (d.getMonth() + 1 > 9
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1)) +
    "/" +
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) +
    "&nbsp" +
    (d.getHours() > 9
      ? d.getHours().toString()
      : "0" + d.getHours().toString()) +
    ":" +
    (d.getMinutes() > 9
      ? d.getMinutes().toString()
      : "0" + d.getMinutes().toString()) +
    ":" +
    (d.getSeconds() > 9
      ? d.getSeconds().toString()
      : "0" + d.getSeconds().toString())
  );
}

function getYmdShortSlash(date) {
  let d = new Date(date);
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
