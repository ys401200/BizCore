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
  containerTitle.html("결재 수신 문서");

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




function showList() {
  location.href = "/gw/receive";
}


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
    if (storage.customer[storage.customer[x].no].name == customerVal) {
      cusResult = storage.customer[x].no;
    }
  }

 

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
        location.href = "/gw/receive";
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