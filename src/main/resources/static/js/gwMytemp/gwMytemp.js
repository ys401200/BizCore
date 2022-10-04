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
  let url, method, data, type;
  url = "/api/gw/app/temp";
  method = "get";
  data = "";
  type = "list";
  crud.defaultAjax(url, method, data, type, successList, errorList);
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
    alert("임시 저장 문서가 없습니다");
  } else {
    jsonData = storage.myTempList;
  }

  result = paging(jsonData.length, storage.currentPage, 10);

  pageContainer = document.getElementsByClassName("pageContainer");
  container = $(".listDiv");

  header = [
    {
      title: "번호",
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
      title: "임시 저장 일자",
      align: "center",
    },
  ];

  for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
    disDate = dateDis(jsonData[i].created, jsonData[i].modified);
    setDate = getYmdSlash(disDate);

    str = [
      {
        setData: jsonData[i].docNo,
      },
      {
        setData: jsonData[i].form,
      },
      {
        setData: jsonData[i].title,
      },
      {
        setData: setDate,
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

  // 전체선택 전체 해제
  $(".thisAllcheck").click(function () {
    if ($(".thisAllcheck").prop("checked")) {
      $(":checkbox").prop("checked", true);
    } else {
      $(":checkbox").prop("checked", false);
    }
  });
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
    "<div class='mainBtnDiv'><button type='button' onclick='showList()'>목록보기</button><button type='button' onclick='reWriteTemp()'>이어서 작성</button><button type='button' onclick='deleteTemp()'>삭제하기</button></div>" +
    "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='referDiv'><label>참조</label><div class='selectedRefer'></div></div><div class='selectedFile'></div></div></div>";

  $(".listPageDiv").html(detailHtml);

  let selectedFileView =
    "<label>첨부파일</label><div><div><input class='inputFile' multiple name='attached[]'type='file' onchange='setSelectedFiles()'/></div><div class='selectedFileDiv'></div></div>";

  $(".seletedForm").html(testForm);
  $(".selectedFile").html(selectedFileView);
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
