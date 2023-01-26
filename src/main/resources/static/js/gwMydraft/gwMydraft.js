$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);
  drawList();
});

function drawList() {
  let url, method, data, type;
  url = "/api/gw/app/mydraft";
  method = "get";
  data = "";
  type = "list";
  crud.defaultAjax(url, method, data, type, successList, errorList);
}

function successList(result) {
  storage.myDraftList = result;
  window.setTimeout(drawMyDraft, 200);
}

function errorList() {
  msg.set("에러");
}

function drawMyDraft() {
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

  if (storage.myDraftList === undefined || storage.myDraftList.length == 0) {
    container = $(".listDiv");

    header = [

      {
        title: "기안일",
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
        title: "결재 타입",
        align: "center",
      },
      {
        title: "결재권자",
        align: "center",
      },
      {
        title: "조회",
        align: "center",
      },
      {
        title: "상태",
        align: "center",
      },
    ];
    createGrid(container, header, data, ids, job, fnc);

    container.append(
      "<div style='border:1px solid #e0e4e9;padding:8px;justify-content: center;background-color:white; text-align:center;grid-column :span 6'>기안 문서가 없습니다</div>"
    );

  } else {

    let tt = [];
    for (let i = storage.myDraftList.length - 1; i >= 0; i--) { tt.push(storage.myDraftList[i]) };
    jsonData = tt;
    result = paging(jsonData.length, storage.currentPage, 18);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");
    header = [

      {
        title: "기안일",
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
        title: "결재 타입",
        align: "center",
      },
      {
        title: "결재권자",
        align: "center",
      },
      {
        title: "조회",
        align: "center",
      },
      {
        title: "상태",
        align: "center",
      },
    ];

    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
      if (jsonData[i].status != -1) {
        disDate = dateDis(jsonData[i].created, jsonData[i].modified);
        setDate = dateFnc(disDate);
        let read = jsonData[i].read;
        let status;
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
        } else {
          appType = "참조";
        }

        if (jsonData[i].status == 1) {
          status = "진행 중";
        } else if (jsonData[i].status == 2) {
          status = "수신 대기 ";
        } else if (jsonData[i].status == 3) {
          status = "승인 완료";
        } else if (jsonData[i].status == -3) {
          status = "반려";
        } else if (jsonData[i].status == -1) {
          status = "회수";
        }

        let authority = storage.user[jsonData[i].authority].userName;
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
            "setData": appType,
            "align": "center"
          },
          {
            "setData": authority,
            "align": "center"
          },
          {
            "setData": read,
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

    }

    let pageNation = createPaging(
      pageContainer[0],
      result[3],
      "pageMove",
      "drawMyDraft",
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
        console.log(detailData);
        detailData = JSON.parse(detailData);
        detailData.doc = cipher.decAes(detailData.doc);
        detailData.doc = detailData.doc.replaceAll('\\"', '"');
        storage.reportDetailData = detailData;
        getDetailView();
      } else {
        msg.set("알림", "문서 정보를 가져오는데 실패했습니다");
      }
    },
  });
} // End of noticeDetailView();


// 목록보기
function showList() {
  location.href = "/gw/mydraft";
}

function returnReport() {
  if (
    storage.reportDetailData.appLine[1].approved == null &&
    storage.reportDetailData.appLine[1].rejected == null
  ) {
    let docNo = storage.reportDetailData.docNo;
    $.ajax({
      url: "/api/gw/app/doc/" + docNo,
      type: "delete",
      dataType: "json",
      success: (result) => {
        if (result.result == "ok") {
          alert("회수 성공");
          location.href = "/gw/mydraft";
        } else {
          console.log(result.msg);
  
        }
      },
    });
  } else {
    alert("결재된 문서는 회수할 수 없습니다");
  }
}



function moveCntForm() {
  let docNo = storage.reportDetailData.docNo;
  location.href = "/business/contract/" + docNo;

}