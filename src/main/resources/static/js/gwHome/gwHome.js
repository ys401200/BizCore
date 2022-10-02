$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  drawGwDiv();
});

function drawGwDiv() {
  $(".noteContainer").hide();
  $.ajax({
    url: "/api/gw/app/wait",
    method: "get",
    dataType: "json",
    cache: false,
    success: (data) => {
      let list;
      if (data.result === "ok") {
        list = cipher.decAes(data.data);
        list = JSON.parse(list);
        storage.waitList = list;
        let typeList = storage.waitList;
        drawWaitCard(typeList);
      } else {
        alert("양식 정보를 불러오지 못했습니다");
      }
    },
  });
}

function drawWaitCard(typeList) {
  let html = "";
  let types = ["wait", "due", "receive", "refer"];
  let targets = [".waitDiv", ".dueDiv", ".receiveDiv", ".referDiv"];
  for (let j = 0; j < types.length; j++) {
    for (let i = 0; i < typeList[types[j]].length; i++) {
      html +=
        "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
        types[j] +
        "!!!" +
        typeList[types[j]][i].docNo +
        "'><div>" +
        typeList[types[j]][i].title +
        "</div>" +
        "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
        typeList[types[j]][i].form +
        "</div></div>" +
        "<div class='writer'><div>기안자</div><div>" +
        storage.user[typeList[types[j]][i].writer].userName +
        "</div></div>" +
        "<div class='created'><div>작성일</div><div>" +
        getYmdSlash(typeList[types[j]][i].created) +
        "</div></div></div></div>";
    }

    $(targets[j]).html(html);
    html = "";
  }
}

function cardClick(obj) {
  let val = obj.dataset.detail;
  let middle = val.split("!!!")[0];
  let docNo = val.split("!!!")[1];
  $(".waitCard").click((location.href = "/gw/" + middle + "/" + docNo));
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
    (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
  );
}
