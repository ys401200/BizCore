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
    }

  }

  for (let i = 0; i < $(".twoBorder").length; i++) {
    let tt = $(".twoBorder")[i].children;
    $(tt).css("text-align", "center");
  }
  for (let i = 0; i < $(".dateBorder").length; i++) {
    let tt = $(".dateBorder")[i].children;
    $(tt).css("text-align", "center");
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
  window.print();
}


