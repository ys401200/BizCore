init();
prepareForm();


function prepareForm() {
  let aesKey, aesIv;
  aesKey = localStorage.getItem("aesKey");
  aesIv = localStorage.getItem("aesIv");
  if (aesKey !== undefined && aesKey !== null) cipher.aes.key = aesKey;
  if (aesIv !== undefined && aesIv !== null) cipher.aes.iv = aesIv;
  getSelectedReportData();

} // End of prepare()


function getSelectedReportData() {

  let checkHref = location.href;
  checkHref = checkHref.split("//");
  checkHref = checkHref[1];
  let splitArr = checkHref.split("/");

  if (splitArr.length > 3) {
    $.ajax({
      url: apiServer + "/api/gw/app/doc/" + splitArr[4],
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
          setSelectedData();

        } else {
          alert("문서 정보를 가져오는 데 실패했습니다");
        }
      },
    });
  }
}


function setSelectedData() {
  let docHtml = storage.reportDetailData.doc;
  $("body").html(docHtml);
  $("body").css("margin", "20mm");
  $("html").css("font-size", "12px");

  toReadMode();

  let target = $(".mainDiv")[0];
  let inputsArr = target.getElementsByTagName("input");

  for (let i = 0; i < inputsArr.length; i++) {
    if (inputsArr[i].dataset.detail !== undefined) {
      inputsArr[i].value = inputsArr[i].dataset.detail;
      let tt = inputsArr[i];
      $(tt).css("font-size", "1em");
      $(tt).css("background-color", "trasparent");
    }
  }

  let textAreaArr = target.getElementsByTagName("textarea")[0];
  textAreaArr.value = textAreaArr.dataset.detail;
  $(textAreaArr).css("font-size", "1em");
  if (target.getElementsByTagName("select").length > 0) {

    let selectArr = target.getElementsByTagName("select");
    for (let i = 0; i < selectArr.length; i++) {
      selectArr[i].value = selectArr[i].dataset.detail;
      let tt = selectArr[i];
      $(tt).css("font-size", "1em");
      $(tt).css("border", "none");
      $(tt).css("color", "black");
    }

    $(".inputsTime").css("border", "none");

  }

  for (let i = 0; i < $(".twoBorder").length; i++) {
    let tt = $(".twoBorder")[i].children;
    $(tt).css("text-align", "center");
    $(tt).css("font-size", "1em");
  }
  for (let i = 0; i < $(".dateBorder").length; i++) {
    let tt = $(".dateBorder")[i].children;
    $(tt).css("text-align", "center");
    $(tt).css("font-size", "1em");
  }

  $("input[name='" + storage.reportDetailData.formId + "_RD']").attr("disabled", "disabled");

  let infoLength = target.getElementsByClassName("info")[0];
  infoLength = infoLength.clientWidth;
  let lgcTotal = 0;
  let lineGrid = target.getElementsByClassName("lineGrid");

  if (lineGrid.length > 3) {
    for (let i = 0; i < lineGrid.length; i++) {
      lgcTotal += lineGrid[i].clientWidth;
    }
  }

  if (lgcTotal > infoLength) {
    for (let i = 0; i < lineGrid.length; i++) {
      let tt = lineGrid[i];
      let kk = lineGrid[0];
      kk = $(kk).css("margin-right");
      kk = kk.split("p")[0];
      $(tt).css(
        "width",
        lineGrid[i].clientWidth * (infoLength / (lgcTotal))
      );
    }
  }
  let formId = storage.reportDetailData.formId;
  let detailTarget = $(".detailcontentDiv");
  for (let i = 0; i < detailTarget.length; i++) {
    for (let j = 0; j < detailTarget[i].children.length; j++) {
      let inputText = detailTarget[i].children[j];
      let titleFontSize = $("#" + formId + "_title").css("font-size");
      $(inputText).css("font-size", titleFontSize);
    }
  }


  if ($(".list_comment")[0].dataset.detail != "old") {
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
  }
  $(".btnDiv").hide();
  if (storage.reportDetailData.confirmNo != 'null') {
    $("#" + formId + "_no").val(storage.reportDetailData.confirmNo);
    $("#" + formId + "_no").attr("data-detail", storage.reportDetailData.confirmNo);
    $("#" + formId + "_no").css("text-align", "left");
  }

  setAppLineData();

}


// 결재선 데이터에 맞게 세팅해줘야함 

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
