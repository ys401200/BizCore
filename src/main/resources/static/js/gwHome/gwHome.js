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
    if ($(".waitDiv").css("width").split("p")[0] < 762) {
      $(".waitDiv").css("grid-template-columns", "repeat(3, 1fr)");
    } else if ($(".waitDiv").css("width").split("p")[0] < 1016) {
      $(".waitDiv").css("grid-template-columns", "repeat(4, 1fr)");
    } else if ($(".waitDiv").css("width").split("p")[0] < 1270) {
      $(".waitDiv").css("grid-template-columns", "repeat(5, 1fr)");
    } else if ($(".waitDiv").css("width").split("p")[0] > 1270) {
      $(".waitDiv").css("grid-template-columns", "repeat(6, 1fr)");
    }

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
        // getWaitListCount();
        // $(".pageContainer").hide();
      } else {
        alert("양식 정보를 불러오지 못했습니다");
      }
    },
  });
}


// function getWaitListCount() {
//   let btns = [".waitBtn", ".dueBtn", ".receiveBtn", ".referBtn"];
//   $(btns[0]).html("결재 대기 문서 (" + storage.waitList.wait.length + ")");
//   $(btns[1]).html("결재 예정 문서 (" + storage.waitList.due.length + ")")
//   $(btns[2]).html("결재 수신 문서 (" + storage.waitList.receive.length + ")")
//   $(btns[3]).html("참조/열람 대기 문서 (" + storage.waitList.refer.length + ")")
// }

function drawWaitCard() {
  // storage.container = container;
  // $(".waitDiv").show();
  // $(".listDiv").hide();
  // $(".waitPage").hide();


  // let btns = [".waitBtn", ".dueBtn", ".receiveBtn", ".referBtn"];
  // $(btns[container]).css("background-color", "white");
  // $(btns[container]).parent().css("border-bottom", "none");
  // $(btns[container]).parent().css("background-color", "white");
  // for (let i = 0; i < btns.length; i++) {
  //   if (i != container) {
  //     $(btns[i]).css("background-color", "#eaeff3");
  //     $(btns[i]).parent().css("border-bottom", "1px solid #406c92");
  //     $(btns[i]).parent().css("background-color", "#eaeff3");
  //   }
  // }

  let typeList = storage.waitList;
  let html = "";
  let types = ["wait", "due", "receive", "refer"];




  // if (container < 4) {
  //   types = types.slice(container, container + 1);
  //   btns = btns.slice(container, container + 1);
  //   $(listTarget[0]).hide();
  //   $(targets[0]).parent().show();
  // }



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


// function drawWaitCardBtn() {
//   let container = storage.container;

//   let btns = [".waitBtn", ".dueBtn", ".receiveBtn", ".referBtn"];
//   $(btns[container]).css("background-color", "white");
//   $(btns[container]).parent().css("border-bottom", "none");

//   for (let i = 0; i < btns.length; i++) {
//     if (i != container) {
//       $(btns[i]).css("background-color", "#eaeff3");
//       $(btns[i]).parent().css("border-bottom", "1px solid #406c92");

//     }
//   }

//   let typeList = storage.waitList;
//   let html = "";
//   let types = ["wait", "due", "receive", "refer"];
//   let targets = [".waitDiv"]
//   let listTarget = [".waitList"]


//   if (container < 4) {
//     types = types.slice(container, container + 1);
//     btns = btns.slice(container, container + 1);
//     $(listTarget[0]).hide();
//     $(".waitPage").hide();
//     $(targets[0]).show();
//   }


//   let start = storage.cardStart;
//   for (let j = 0; j < types.length; j++) {
//     let cardLength = typeList[types[j]].length;
//     if (cardLength > 0) {

//       for (let i = start; i < cardLength; i++) {
//         html +=
//           "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
//           types[j] +
//           "!!!" +
//           typeList[types[j]][i].docNo +
//           "'><div>" +
//           typeList[types[j]][i].title +
//           "</div>" +
//           "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
//           typeList[types[j]][i].form +
//           "</div></div>" +
//           "<div class='writer'><div>기안자</div><div>" +
//           storage.user[typeList[types[j]][i].writer].userName +
//           "</div></div>" +
//           "<div class='created'><div>작성일</div><div>" +
//           getYmdSlash(typeList[types[j]][i].created) +
//           "</div></div></div></div>";

//       }

//     } else {
//       html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
//       $(".waitPage").hide();
//     }

//     $(targets[j]).html(html);
//     html = "";
//   }

// }

// function prevPage(obj) {
//   let target = $(obj).next().attr("class");
//   if (storage.cardStart != 0) {
//     storage.cardStart = storage.cardStart - 5;
//   }

//   let type = (target + "").split("D")[0];
//   let html = "";
//   let start = storage.cardStart;

//   for (let j = 0; j < storage.waitList[type].length; j++) {
//     let cardLength = storage.waitList[type].length;
//     let end = start + 5;
//     if (start != 0 && end < cardLength) {
//       end = cardLength;
//     }

//     if (cardLength > 0) {
//       if (cardLength < 6) {
//         $("." + target).prev().hide();
//         $("." + target).next().hide();
//       }
//       for (let i = start; i < end; i++) {
//         html +=
//           "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
//           type +
//           "!!!" +
//           storage.waitList[type][i].docNo +
//           "'><div>" +
//           storage.waitList[type][i].title +
//           "</div>" +
//           "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
//           storage.waitList[type][i].form +
//           "</div></div>" +
//           "<div class='writer'><div>기안자</div><div>" +
//           storage.user[storage.waitList[type][i].writer].userName +
//           "</div></div>" +
//           "<div class='created'><div>작성일</div><div>" +
//           getYmdSlash(storage.waitList[type][i].created) +
//           "</div></div></div></div>";

//       }

//     } else {
//       html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
//       $("." + target).prev().hide();
//       $("." + target).next().hide();
//     }

//     $("." + target).html(html);
//     html = "";
//   }
// }

// function nextPage(obj) {
//   let target = $(obj).prev().attr("class");
//   let type = (target + "").split("D")[0];
//   let cardLength = storage.waitList[type].length;
//   let count = 0;
//   if (storage.strat != 0) {
//     count = (storage.cardStart / 5);
//   }
//   if (cardLength > (count + 1) * 5) {
//     storage.cardStart = storage.cardStart + 5;
//   }

//   let html = "";
//   let start = storage.cardStart;
//   for (let j = 0; j < storage.waitList[type].length; j++) {

//     let end = start + 5;
//     end = end > cardLength ? cardLength : end;
//     if (cardLength > 0) {
//       if (cardLength < 6) {
//         $("." + target).prev().hide();
//         $("." + target).next().hide();
//       }
//       console.log(start + "스타드" + end)
//       for (let i = start; i < end; i++) {
//         html +=
//           "<div class='waitCard' onClick='cardClick(this)' data-detail='" +
//           type +
//           "!!!" +
//           storage.waitList[type][i].docNo +
//           "'><div>" +
//           storage.waitList[type][i].title +
//           "</div>" +
//           "<div class='subWaitCard'><div class='type'><div>결재타입</div><div>" +
//           storage.waitList[type][i].form +
//           "</div></div>" +
//           "<div class='writer'><div>기안자</div><div>" +
//           storage.user[storage.waitList[type][i].writer].userName +
//           "</div></div>" +
//           "<div class='created'><div>작성일</div><div>" +
//           getYmdSlash(storage.waitList[type][i].created) +
//           "</div></div></div></div>";

//       }



//     } else {
//       html += "<div class='defaultWaitCard'>대기 문서가 없습니다.</div>"
//       $("." + target).prev().hide();
//       $("." + target).next().hide();
//     }

//     $("." + target).html(html);
//     html = "";
//   }



// }
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

    }
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
