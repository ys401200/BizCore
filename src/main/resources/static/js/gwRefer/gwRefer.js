$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  drawList();
});

// 참조 문서는 상세 조회가 가능하고 열람은 결재가 끝난 후에 참조/열람 문서함에서 열람 가능함
function drawList() {
  $(".modal-wrap").hide();
  let containerTitle = $("#containerTitle");
  containerTitle.html("참조 대기 문서");

  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

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

    $(".listPageDiv").show();
  }
}

function successList(result) {
  storage.referList = result;
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
    storage.referList.refer === undefined ||
    storage.referList.refer.length == 0
  ) {
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
      "<div class='noListDefault'>참조 대기 문서가 없습니다</div>"
    );
  } else {

    let tt = [];
    for (let i = storage.referList.refer.length - 1; i >= 0; i--) { tt.push(storage.referList.refer[i]) };
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
  $(".pageContainer").hide();
  $(".listRange").hide();
  $(".batchBtn").hide();

  let no = obj.dataset.id;

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
  $(".pageContainer").hide();
  $(".listRange").hide();
  let formId = storage.reportDetailData.formId;
  let testForm = storage.reportDetailData.doc;
  console.log(testForm);

  let detailHtml =
    "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button></div>" +
    "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div><div class='comment'></div></div></div>";

  $(".listDiv").html(detailHtml);


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
        $("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdSlash(
          appLineContainer[i][j].approved
        );
      } else if (appLineContainer[i][j].rejected != null) {
        $("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
        $("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdSlash(
          appLineContainer[i][j].rejected
        );
      }
    }
  }
}

function showList() {
  location.href = "/gw/refer";
}

function openPrintTab() {
  window.open("/gw/print/" + storage.reportDetailData.docNo, "인쇄하기", "width :210mm");
}

// 탭 누를때마다의 이벤트 주기
function changeTab(obj) {
  $(obj).css("background-color", "#62a6ad");
  $(obj).css("color", "#fff");
  $(obj).css("border-top-left", "14px");
  //$(obj).css("border-bottom", "2px solid #5298d5");

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
