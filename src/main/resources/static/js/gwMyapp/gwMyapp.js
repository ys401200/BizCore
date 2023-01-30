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
  containerTitle.html("결재 문서함");

  // 리스트 보기
  let url, method, data, type;
  url = "/api/gw/app/approved";
  method = "get";
  data = "";
  type = "list";
  crud.defaultAjax(url, method, data, type, waitSuccessList, waitErrorList);

  $(".listPageDiv").show();
}

function waitSuccessList(result) {
  storage.approvedList = result;
  window.setTimeout(drawNoticeApproval, 200);
}

function waitErrorList() {
  alert("에러");
}

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

  if (storage.approvedList === undefined || storage.approvedList.length == 0) {
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
        title: "상태",
        align: "center",
      },
    ];
    createGrid(container, header, data, ids, job, fnc);

     container.append(
      "<div style='border:1px solid #e0e4e9;padding:8px;justify-content: center;background-color:white; text-align:center;grid-column :span 6'>결재 문서가 없습니다</div>"
    );

  } else {
    // jsonData = storage.approvedList;
    let tt = [];
    for (let i = storage.approvedList.length - 1; i >= 0; i--) { tt.push(storage.approvedList[i]) };
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
        title: "상태",
        align: "center",
      },
    ];
    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
      disDate = dateDis(jsonData[i].created, jsonData[i].modified);
      setDate = dateFnc(disDate);
      let userName = storage.user[jsonData[i].writer].userName;
      let status;
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
          "setData": status,
          "align": "center"
        },
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
    createGrid(container, header, data, ids, job, fnc);
  }
} // End of drawNoticeApproval()

function waitDetailView(obj) {
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

/* 상세 화면 그리기 */

function showList() {
  location.href = "/gw/myapp";
}



function cancelApproval() {
  let appLine = storage.reportDetailData.appLine;
  let myIndex, ordered;


  for (let i = 0; i < appLine.length; i++) {
    if (appLine[i].employee == storage.my) {
      myIndex = i;
      ordered = appLine[i].ordered;
    }
  }

  if ((myIndex != appLine.length - 1) && (appLine[myIndex + 1].approved != null || appLine[myIndex + 1].rejected != null)) {
    alert("다음 결재자가 결재한 경우 결재 취소할 수 없습니다.")
  } else {

    $.ajax({

      url: "/api/gw/app/cancle/" + storage.reportDetailData.docNo + "/" + ordered,
      type: "get",
      dataType: "json",
      success: (result) => {
        if (result.result == "ok") {
          alert("확인");
          location.href = "/gw/myapp";
        } else {
          alert("에러");
        }
      },

    });
  }


}
