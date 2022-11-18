$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  drawGwDiv();
  // window.onresize = function () { $(".waitCard").css("font-size", ((window.innerWidth - 320) / 100) + "px") }
  window.onresize = function () {
    // $(".waitCard").css("font-size", ((window.innerWidth - 320) / 100) + "px") 


    if ($(".card").css("width").split("p")[0] < 762) {
      console.log("확인1");
      $(".card").css("grid-template-columns", "repeat(3, 1fr)");
    } else if ($(".card").css("width").split("p")[0] < 1016) {
      console.log("확인2");
      $(".card").css("grid-template-columns", "repeat(4, 1fr)");
    } else if ($(".card").css("width").split("p")[0] < 1270) {
      console.log("확인3");
      $(".card").css("grid-template-columns", "repeat(5, 1fr)");
    } else if ($(".card").css("width").split("p")[0] > 1270) {
      console.log("확인4");
      $(".card").css("grid-template-columns", "repeat(6, 1fr)");
    } else if ($(".card").css("width").split("p")[0] > 1440) {
      console.log("확인4");
      $(".card").css("grid-template-columns", "repeat(7, 1fr)");
    }

    // if ($(".waitDiv").css("width").split("p")[0] < 762) {
    //   $(".waitDiv").css("grid-template-columns", "repeat(3, 1fr)");
    // } else if ($(".waitDiv").css("width").split("p")[0] < 1016) {
    //   $(".waitDiv").css("grid-template-columns", "repeat(4, 1fr)");
    // } else if ($(".waitDiv").css("width").split("p")[0] < 1270) {
    //   $(".waitDiv").css("grid-template-columns", "repeat(5, 1fr)");
    // } else if ($(".waitDiv").css("width").split("p")[0] > 1270) {
    //   $(".waitDiv").css("grid-template-columns", "repeat(6, 1fr)");
    // }

  }

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
        storage.container = 0;
        storage.cardStart = 0;
        drawWaitCard();
        drawMyDraft();
        getWaitListCount();
        // $(".pageContainer").hide();
      } else {
        alert("양식 정보를 불러오지 못했습니다");
      }
    },
  });
}


function getWaitListCount() {
  let tab = $(".tabItem");
  $(tab[0]).html("결재 대기 문서 (" + storage.waitList.wait.length + ")");
  $(tab[1]).html("결재 예정 문서 (" + storage.waitList.due.length + ")")
  $(tab[2]).html("결재 수신 문서 (" + storage.waitList.receive.length + ")")
  $(tab[3]).html("참조/열람 대기 문서 (" + storage.waitList.refer.length + ")")
}

function drawWaitCard() {
  let typeList = storage.waitList;
  let html = "";
  let types = ["wait", "due", "receive", "refer"];

  for (let j = 0; j < types.length; j++) {
    let cardLength = typeList[types[j]].length;
    if (cardLength > 0) {
      for (let i = 0; i < cardLength; i++) {
        console.log("확인0");
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

    } else {
      console.log("확인1");
      html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"

    }
    let target = $(".card")[j];
    $(target).html(html);
    html = "";
  }

}



function cardClick(obj) {
  let val = obj.dataset.detail;
  let middle = val.split("!!!")[0];
  let docNo = val.split("!!!")[1];
  $(".waitCard").click((location.href = "/gw/" + middle + "/" + docNo));
}

function detailView(obj) {
  let type = ["wait", "due", "receive", "refer"];
  let docNo = obj.dataset.id;
  let middle = type[storage.container];
  location.href = "/gw/" + middle + "/" + docNo;
}

function showList(num) {
  let targetList = $(".detailList")[num];
  let targetCard = $(".card")[num];
  let targetPage = $(".pageContainer")[num];
  $(targetCard).hide();
  $(targetList).show();
  $(targetPage).show();
}

function showCard(num) {
  let targetList = $(".detailList")[num];
  let targetCard = $(".card")[num];
  let targetPage = $(".pageContainer")[num];
  $(targetCard).show();
  $(targetList).hide();
  $(targetPage).hide();
}

function drawMyDraft() {
  let typeList = storage.waitList;
  let html = "";
  let types = ["wait", "due", "receive", "refer"];
  console.log("확인1")

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
  for (let x = 0; x < 4; x++) {
    if (storage.waitList[types[x]] === undefined || storage.waitList[types[x]].length == 0) {
      let target = $(".detailList")[x];
      console.log("확인2")

      container = $(target);

      header = [

        {
          title: "작성일",
          align: "center",
        },
        {
          title: "결재 타입",
          align: "left",
        },
        {
          title: "문서 양식",
          align: "center",
        },
        {
          title: "제목",
          align: "center",
        },
        {
          title: "작성자",
          align: "center",
        },

      ];
      createGrid(container, header, data, ids, job, fnc);

      container.append("<div class='noListDefault'>대기 문서가 없습니다.</div>")



      console.log("확인3" + container);


    } else {
      // jsonData = storage.waitList[types[0]]
      let tt = [];
      for (let i = storage.waitList[types[x]].length - 1; i >= 0; i--) { tt.push(storage.waitList[types[x]][i]) };
      jsonData = tt;

      result = paging(jsonData.length, storage.currentPage, 18);

      let pageContainer = document.getElementsByClassName("pageContainer");
      let target = $(".detailList")[x];
      container = $(target);
      console.log("확인" + container);
      header = [
        {
          title: "작성일",
          align: "center",
        },
        {
          title: "결재 타입",
          align: "center",
        },
        {
          title: "문서 양식",
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
        let appType;
        if (jsonData[i].appType == 0) {
          appType = "검토";
        } else if (jsonData[i].appType == 1) {
          appType = "합의";
        } else if (jsonData[i].appType == 2) {
          appType = "결재";
        } else if (jsonData[i].appType == 3) {
          appType = "수신";
        } else if (jsonData[i].appType == 4) {
          appType = "참조";
        }

        str = [
          // {
          //   "setData": jsonData[i].docNo,
          //   "align": "center"
          // },
          {
            "setData": setDate,
            "align": "center"
          },
          {
            "setData": appType,
            "align": "center"
          },
          {
            "setData": jsonData[i].form,
            "align": "center"
          },

          {
            "setData": jsonData[i].title,
            "align": "left"
          },
          {
            "setData": storage.user[jsonData[i].writer].userName,
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
      pageContainer[x].innerHTML = pageNation;
      createGrid(container, header, data, ids, job, fnc);
      data = [];
    }
  }


  $(".detailList").hide();
  $(".pageContainer").hide();

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
