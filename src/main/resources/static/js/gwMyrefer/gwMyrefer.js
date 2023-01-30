$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);
  locationBlock = false;
  history.pushState(null, null, null);
  drawList();
});

function drawList() {
  let containerTitle = $("#containerTitle");
  containerTitle.html("참조/열람 문서함");
  let url, method, data, type;
  url = "/api/gw/app/references";
  method = "get";
  data = "";
  type = "list";
  crud.defaultAjax(url, method, data, type, successList, errorList);
}

function successList(result) {
  storage.myReferList = result;
  window.setTimeout(drawMyRefer, 200);
}

function errorList() {
  alert("에러");
}

function drawMyRefer() {
  let container,
    result,
    jsonData,
    job,
    data = [],
    ids = [],
    disDate,
    setDate,
    str,
    fnc;

  let header = [
    // {
    //   title: "번호",
    //   align: "center",
    // },
    {
      title: "기안일",
      align: "center",
    }, {
      title: "조회 구분",
      align: "center",
    },

    {
      title: "문서양식",
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
      title: "상태",
      align: "center",
    },
  ];
  if (storage.myReferList === undefined || storage.myReferList.length == 0) {
    container = $(".listDiv");

    createGrid(container, header, data, ids, job, fnc);

    container.append(
      "<div style='border:1px solid #e0e4e9;padding:8px;justify-content: center;background-color:white; text-align:center;grid-column :span 6'>참조/열람 문서가 없습니다</div>"
    );

  } else {
    jsonData = storage.myReferList;
    let exceptMy = [];
    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].writer != storage.my) {
        exceptMy.push(jsonData[i]);
      }
    }
    jsonData = exceptMy;

    result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");

    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
      disDate = dateDis(jsonData[i].created, jsonData[i].modified);
      setDate = dateFnc(disDate);
      let read = jsonData[i].read;
      let status;
      let readType = "열람";

      if (read == null) {
        read = "N";
      } else {
        read = getYmdSlash(read);
      }

      let appType = jsonData[i].appType;
      if (appType == "0") {
        appType = "검토";
      } else if (appType == "1") {
        appType = "합의";
      } else if (appType == "2") {
        appType = "결재";
      } else if (appType == "3") {
        appType = "수신";
      } else if (appType == "4") {
        appType = "참조";
      } else {
        appType = "열람";
      }

      if (jsonData[i].status == 1) {
        status = "진행 중";
      } else if (jsonData[i].status == 2) {
        status = "수신 대기 ";
      } else if (jsonData[i].status == 3) {
        status = "승인 완료";
      } else if (jsonData[i].status == -3) {
        status = "반려";
      }

      str = [

        {
          "setData": setDate,
          "align": "center"
        }, {
          "setData": readType,
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
          "setData": storage.user[jsonData[i].writer].userName,
          "align": "center"
        },
        {
          "setData": status,
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
      "drawMyRefer",
      result[0]
    );
    pageContainer[0].innerHTML = pageNation;
    createGrid(container, header, data, ids, job, fnc);
  }
}

function detailView(obj) {
  // 선택한 그리드의 글 번호 받아오기

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

function showList() {
  location.href = "/gw/myrefer";
}

// 탭 누를때마다의 이벤트 주기
function changeTab(obj) {
  $(obj).css("background-color", "#62a6ad");
  $(obj).css("color", "#fff");
  $(obj).css("border-top-left", "14px");
  if (obj.id == "lineInfo") {
    $("#changeInfo").css("background-color", "#dddddd");
    $("#changeInfo").css("color", "#5c5c5c");
    $("#changeInfo").css("border-bottom-left-radius", "20px");
    $("#tabDetail2").hide();
    $("#tabDetail").show();
    drawCommentLine();
  } else if ((obj.id = "changeInfo")) {
    $("#lineInfo").css("background-color", "#dddddd");
    $("#lineInfo").css("color", "#5c5c5c");
    $("#lineInfo").css("border-bottom-right-radius", "20px");
    $("#tabDetail").hide();
    $("#tabDetail2").show();
    drawChangeInfo();
  }
}





