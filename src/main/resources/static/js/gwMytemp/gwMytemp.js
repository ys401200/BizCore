$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);
  defaultMyDraft();
});

function defaultMyDraft() {

  $("#gwSubTabTitle").html("임시 저장함");
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
    result = paging(jsonData.length, storage.currentPage, 10);

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
function getDetailView() {
  let formId = storage.reportDetailData.formId;
  let testForm = storage.reportDetailData.doc;
  console.log(testForm);

  let detailHtml =
    "<div class='mainBtnDiv crudBtns'><button type='button' onclick='showList()'>목록보기</button><button type='button' onclick='reWriteTemp()'>이어서 작성</button><button type='button' onclick='deleteTemp()'>삭제하기</button></div>" +
    "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div></div>";

  $(".listPageDiv").html(detailHtml);


  $(".seletedForm").html(testForm);

  $(":file").css("display", "none"); // 첨부파일 버튼 숨기기

  toReadMode();

  let referArr = new Array();
  if (storage.reportDetailData.appLine != null) {
    for (let i = 0; i < storage.reportDetailData.appLine.length; i++) {
      if (storage.reportDetailData.appLine[i].appType == "4") {
        referArr.push(storage.reportDetailData.appLine[i]);
      }
    }

    let referTarget = $(".selectedRefer");
    let referHtml = "";
    for (let i = 0; i < referArr.length; i++) {
      let id = referArr[i].employee;
      referHtml +=
        "<div class='appendName " +
        formId +
        "_refer' data-detail='" +
        storage.user[id].userNo +
        "'>" +
        storage.userRank[storage.user[id].rank][0] +
        "&nbsp" +
        storage.user[id].userName +
        "</div>";
    }

    referTarget.html(referHtml);
  }

  let target = $(".seletedForm")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].value = inputsArr[i].dataset.detail;
    }
  }

  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.value = textAreaArr.dataset.detail;

  if (target.getElementsByTagName("select").length > 0) {
    let selectArr = target.getElementsByTagName("select")[0];
    selectArr.value = selectArr.dataset.detail;
  }
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

  // 상세타입 체크하게 하기
  let rd = $("input[name='" + formId + "_RD']");
  for (let i = 0; i < rd.length; i++) {
    if (rd[i].dataset.detail == "on") {
      $("#" + rd[i].id).prop("checked", true);
    }
  }
  $("input[name='" + formId + "_RD']").prop("disabled", true);

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
      } else {
        alert("에러");
      }
    },
  });

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
