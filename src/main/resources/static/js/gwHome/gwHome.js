$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  drawGwDiv();
});

function drawGwDiv() {

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
        storage.waitList;
        let container = 4;
        storage.cardStart = 0;
        drawWaitCard(container);
        $(".pageContainer").hide();
      } else {
        alert("양식 정보를 불러오지 못했습니다");
      }
    },
  });
}

function drawWaitCard(container) {
  let typeList = storage.waitList;
  let html = "";
  let types = ["wait", "due", "receive", "refer"];
  let targets = [".waitDiv", ".dueDiv", ".receiveDiv", ".referDiv"];
  let listTarget = [".waitList", ".dueList", ".receiveList", ".referList"];
  let pageTarget = [".waitPage", ".duePage", ".receivePage", "referPage"];
  if (container < 4) {
    types = types.slice(container, container + 1);
    targets = targets.slice(container, container + 1);
    listTarget = listTarget.slice(container, container + 1);
    pageTarget = pageTarget.slice(container, container + 1);
    $(listTarget[0]).hide();
    $(targets[0]).show();
  }


  let start = storage.cardStart;
  for (let j = 0; j < types.length; j++) {
    let cardLength = typeList[types[j]].length;
    if (cardLength > 0) {
      if (cardLength > 5) {
        html = "<button onclick='prevPage(this)'> < </button>"
      }
      for (let i = start; i < start + 6; i++) {
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
      if (cardLength > 5) {
        html += "<button onclick='nextPage(this)'> > </button>"
      }

    } else {
      html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
    }

    $(targets[j]).html(html);
    html = "";
  }
  $(pageTarget[0]).hide();

}


function prevPage(obj) {
  let target = obj.parentElement.className;
  storage.cardStart = storage.cardStart - 6;
  let type = (target + "").split("D")[0];
  let html = "";
  let start = storage.cardStart;
  console.log(start + "start 확인 ! ")
  for (let j = 0; j < storage.waitList[type].length; j++) {
    let cardLength = storage.waitList[type].length;
    let end = start + 6;
    if (start != 0 && end < cardLength) {
      end = cardLength;
    }
    console.log(end + "end 확인 ! ")
    if (cardLength > 0) {
      if (cardLength > 5) {
        html = "<button onclick='prevPage(this)'> < </button>"
      }
      for (let i = start; i < end; i++) {
        html +=
          "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
          type +
          "!!!" +
          storage.waitList[type][i].docNo +
          "'><div>" +
          storage.waitList[type][i].title +
          "</div>" +
          "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
          storage.waitList[type][i].form +
          "</div></div>" +
          "<div class='writer'><div>기안자</div><div>" +
          storage.user[storage.waitList[type][i].writer].userName +
          "</div></div>" +
          "<div class='created'><div>작성일</div><div>" +
          getYmdSlash(storage.waitList[type][i].created) +
          "</div></div></div></div>";

      }
      if (cardLength > 5) {
        html += "<button onclick='nextPage(this)'> > </button>"
      }

    } else {
      html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
    }

    $("." + target).html(html);
    html = "";
  }
}

function nextPage(obj) {
  storage.cardStart = storage.cardStart + 6;
  let target = obj.parentElement.className;
  let type = (target + "").split("D")[0];
  let html = "";
  let start = storage.cardStart;
  for (let j = 0; j < storage.waitList[type].length; j++) {
    let cardLength = storage.waitList[type].length;
    let end = start + 6;
    end = end > cardLength ? cardLength : end;
    if (cardLength > 0) {
      if (cardLength > 5) {
        html = "<button onclick='prevPage(this)'> < </button>"
      }
      for (let i = start; i < end; i++) {
        html +=
          "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
          type +
          "!!!" +
          storage.waitList[type][i].docNo +
          "'><div>" +
          storage.waitList[type][i].title +
          "</div>" +
          "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
          storage.waitList[type][i].form +
          "</div></div>" +
          "<div class='writer'><div>기안자</div><div>" +
          storage.user[storage.waitList[type][i].writer].userName +
          "</div></div>" +
          "<div class='created'><div>작성일</div><div>" +
          getYmdSlash(storage.waitList[type][i].created) +
          "</div></div></div></div>";

      }
      if (cardLength > 5) {
        html += "<button onclick='nextPage(this)'> > </button>"
      }

    } else {
      html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
    }

    $("." + target).html(html);
    html = "";
  }



}
function cardClick(obj) {
  let val = obj.dataset.detail;
  let middle = val.split("!!!")[0];
  let docNo = val.split("!!!")[1];
  $(".waitCard").click((location.href = "/gw/" + middle + "/" + docNo));
}



function drawWaitList(container) {
  let types = ["wait", "due", "receive", "refer"];
  let targets = [".waitDiv", ".dueDiv", ".receiveDiv", ".referDiv"];
  let listTarget = [".waitList", ".dueList", ".receiveList", ".referList"];
  types = types.slice(container, container + 1);
  targets = targets.slice(container, container + 1);
  listTarget = listTarget.slice(container, container + 1);
  console.log(listTarget);
  drawMyDraft(types, targets, listTarget);

}



function drawMyDraft(types, targets, listTarget) {
  $(targets[0]).hide();
  $(listTarget[0]).show();
  let pageContainer = $(".pageContainer");
  $(pageContainer[0]).show();
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

  if (storage.waitList[types[0]] === undefined || storage.waitList[types[0]].length == 0) {
    container = $(listTarget[0]);

    header = [
      {
        title: "번호",
        align: "center",
      },
      {
        title: "문서 양식",
        align: "center",
      },
      {
        title: "결재 타입",
        align: "left",
      },
      {
        title: "제목",
        align: "center",
      },
      {
        title: "작성자",
        align: "center",
      },
      {
        title: "작성일",
        align: "center",
      },
    ];
    createGrid(container, header, data, ids, job, fnc);

    container.append("<div class='noListDefault'>대기 문서가 없습니다.</div>")





  } else {
    jsonData = storage.waitList[types[0]]


    result = paging(jsonData.length, storage.currentPage, 10);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(listTarget[0]);

    header = [
      {
        title: "번호",
        align: "center",
      },
      {
        title: "문서 양식",
        align: "center",
      },
      {
        title: "결재 타입",
        align: "left",
      },
      {
        title: "제목",
        align: "center",
      },
      {
        title: "작성자",
        align: "center",
      },
      {
        title: "작성일",
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
          setData: jsonData[i].appType,
        },
        {
          setData: jsonData[i].title,
        },
        {
          setData: storage.user[jsonData[i].writer].userName,
        },
        {
          setData: setDate
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
