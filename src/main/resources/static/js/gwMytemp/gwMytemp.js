$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);
  drawList();
});

function drawList() {

  let containerTitle = $("#containerTitle");
  containerTitle.html("임시 저장함");
  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  // 전자결재 홈 화면에서 들어오는 경우 , 상세조회
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
          getDetailView();
        } else {
          alert("문서 정보를 가져오는 데 실패했습니다");
        }
      },
    });



  } else {


    let url, method, data, type;
    url = "/api/gw/app/temp";
    method = "get";
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, successList, errorList);
  }
}

function successList(result) {
  storage.myTempList = result;
  window.setTimeout(drawMyDraft, 200);
}

function errorList() {
  alert("에러");
}

function drawMyDraft() {
  $(".listRange").show();
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

  if (storage.myTempList === undefined || storage.myTempList.length == 0) {
    container = $(".listDiv");

    header = [
      {
        title: "임시 저장 일자",
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

    ];
    createGrid(container, header, data, ids, job, fnc);

    container.append("<div class='noListDefault'>임시 저장 문서가 없습니다.</div>")





  } else {
    // jsonData = storage.myTempList;

    let tt = [];
    for (let i = storage.myTempList.length - 1; i >= 0; i--) { tt.push(storage.myTempList[i]) };
    jsonData = tt;
    result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");

    header = [

      {
        title: "임시 저장 일자",
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

    ];

    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
      disDate = dateDis(jsonData[i].created, jsonData[i].modified);

      setDate = getYmdSlash(disDate);
      //  let userName = storage.user[jsonData[i].writer].userName;
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
          "setData": storage.user[storage.my].userName,
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
    url: apiServer + "/api/gw/app/temp/" + no,
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


// 탭 누를때마다의 이벤트 주기

function showList() {
  location.href = "/gw/mytemp";
}

function deleteTemp() {
  let docNo = storage.reportDetailData.docNo;

  $.ajax({
    url: "/api/gw/app/temp/" + docNo,
    type: "delete",
    dataType: "json",
    success: (result) => {
      if (result.result == "ok") {
        alert("삭제 성공");
        location.href = "/gw/mytemp";
      } else {
        alert("에러");
      }
    },
  });
}

function reWriteTemp() {
  let docNo = storage.reportDetailData.docNo;

  location.href = "/gw/write/" + docNo;
}
