$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  getformList();
});

function getformList() {
  let url = "/api/gw/form";

  $.ajax({
    url: url,
    type: "get",
    dataType: "json",
    success: (result) => {
      if (result.result == "ok") {
        let jsondata;
        jsondata = cipher.decAes(result.data);
        jsondata = JSON.parse(jsondata);
        storage.formList = jsondata;
        drawFormList();
      } else {
        alert("에러");
      }
    },
  });

  $(".lineDetail").hide();
  $(".insertedDetail").hide();

  // let previewWidth = document.getElementsByClassName("reportInsertForm")[0];
  // previewWidth = previewWidth.clientWidth;
  // let target = $(".reportInsertForm");
  // target.css("height", Math.ceil(previewWidth / 210 * 297));

}

function drawFormList() {
  let data = storage.formList;
  let titles = new Array();
  let nums = new Array();
  let ids = new Array();

  let target = $(".formListDiv");
  let targetHtml = "";

  for (let i = 0; i < data.length; i++) {
    titles.push(data[i].title);
    ids.push(data[i].id);
    nums.push(data[i].no);
  }


  targetHtml += "<label for='selectForm'>결재 양식</label><select class='formSelector'>";
  for (let i = 0; i < titles.length; i++) {
    targetHtml += "<option value='" + nums[i] + "'>" + titles[i] + "</option>"

  }

  targetHtml += "</select>"

  target.html(targetHtml);

  let orgChartTarget = $("#lineLeft");
  let userData = new Array();

  let x;
  for (x in storage.user) userData.push(x);

  let innerHtml = "";

  for (let i = 0; i < userData.length; i++) {
    innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + i + "' name='userNames' value='" + data[i] + "'><label for='cb'>" + storage.user[userData[i]].userName + "</label></div>"
    orgChartTarget.html(innerHtml);
  }

}

// function selectChangeEvent(num) {

//   let target2 = $(".forSelect_1");
//   let html = target2.html();
//   let arr = html.split("\n");

//   if (arr.length > 1) {
//     let targetArr = [1, 2, 3, 4];
//     for (let i = 1; i < targetArr.length + 1; i++) {
//       if (i == num) {
//         if (i == 1) {
//           $(".inputs").attr("readonly", true);
//           $(".inputs").css("border", "none");
//           $(".formDetail").show();
//           $(".lineDetail").hide();
//           $(".insertedDetail").hide();
//         } else if (i == 2) {
//           $(".inputs").attr("readonly", true);
//           $(".inputs").css("border", "none");
//           $(".lineDetail").show();
//           $(".insertedDetail").hide();
//           $(".formDetail").hide();
//         } else if (i == 3) {
//           $(".inputs").attr("readonly", false);
//           $(".insertedDetail").show();
//           $(".lineDetail").hide();
//           $(".formDetail").hide();
//         }
//       }
//     }
//   }




// }

function setSelectedFormName(num) {
  let hidden = $(".formNumHidden");
  hidden.val(num);
}


// 결재양식 선택에서 양식 선택 버튼 눌렀을 때 함수 
function selectForm() {
  let data = storage.formList;
  let selectedForm = $(".formSelector").val();
  let hidden = $(".formNumHidden");
  hidden.val(selectedForm - 1);
  selectedForm = data[selectedForm - 1].title;
  let forSelect1 = $(".forSelect_1");
  let html = forSelect1.html();

  let arr = html.split("\n");

  html = arr[0];
  html += "\n" + " > " + selectedForm;
  forSelect1.html(html);

  $(".lineDetail").show();

  $(".reportInsertForm").html(storage.formList[hidden.val()].form);
  $(".insertedDetail").show();
  //작성자 작성일 자동 입력
  let my = storage.my;
  let writer = storage.user[my].userName;
  let formId = storage.formList[hidden.val()].id;
  $("#" + formId + "_writer").val(writer);
  let date = getYmdHyphen();
  $("#" + formId + "_created").val(date);
  $(".testClass").prop('checked', false);
  $(".typeContainer").html("")


}


function getYmdHyphen() {
  let d = new Date();
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}





// 조직도에서 이름 선택하고 결재타입 선택한 경우 
function check(name) {
  let inputLength = $(".testClass");
  let target = $("#" + name);
  let html = target.html();
  let selectHtml = "";

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);

  for (let i = 0; i < inputLength.length; i++) {
    if ($("#cb" + i).prop('checked')) {
      if (document.getElementById("linedata" + i) == null)
        selectHtml += "<div class='lineDataContainer' id='lineContainer_" + i + "'><label id='linedata" + i + "'>" + storage.user[data[i]].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + i + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    }

  }
  html += selectHtml;
  target.html(html)

  $(".testClass").prop('checked', false);
}



function upClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent = parent.parentElement;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();// 원래 입력된 순서 배열에 넣음 
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = 0; i < numArr.length; i++) { //순서 바꾸기 
    if (obj.value == numArr[i] && i != 0) {
      let temp = numArr[i];
      numArr[i] = numArr[i - 1];
      numArr[i - 1] = temp;
    }
  }

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);
  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
  }

  target.html(selectHtml);
}


function downClick(obj) {
  let parent;
  parent = obj.parentNode;
  parent = parent.parentNode;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();// 원래 입력된 순서 배열에 넣음 
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = numArr.length - 1; i >= 0; i--) { //순서 바꾸기 
    if (obj.value == numArr[i] && i != numArr.length - 1) {
      let temp = numArr[i];
      numArr[i] = numArr[i + 1];
      numArr[i + 1] = temp;
    }
  }

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);
  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
  }

  target.html(selectHtml);
}


function deleteClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent.remove();
}



function createLine() {

  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");


  let testHtml = "<div class='lineGridContainer'>";
  let testHtml2 = "<div class='lineGridContainer'>";
  let readHtml = "";
  let referHtml = "";
  let target = $(".typeContainer");
  let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);


  for (let i = 0; i < target.length; i++) {
    if (target[i].children.length != 0 && i < 3) {
      testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    } else if (target[i].children.length != 0 && i == 3) {
      testHtml2 += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    }

    for (let j = 0; j < target[i].children.length; j++) {
      let id = target[i].children[j].id;
      id = id.split('_');
      id = id[1];
      if (i < 2 && j < target[i].children.length - 1) {
        testHtml += "<div class='lineSet'><div class='lineUserName'>" + storage.user[data[id]].userName + "</div><div class='gap'>서명</div><div class='linedate'>/</div></div>"
      } else if (i < 2 && j == target[i].children.length - 1) {
        testHtml += "<div class='lineSet'><div class='lineUserNameLast'>" + storage.user[data[id]].userName + "</div><div class='gapLast'>서명</div><div class='linedateLast'>/</div></div>"
      } else if (i == 2) {
        testHtml += "<div class='lineSet'><div class='lineUserName'>" + storage.user[data[id]].userName + "</div><div class='gap'>서명</div><div class='linedate'>/</div></div>"
      } else if (i == 3) {
        testHtml2 += "<div class='lineSet'><div class='lineUserName'>" + storage.user[data[id]].userName + "</div><div class='gap'>서명</div><div class='linedate'>/</div></div>"
      } else if (i == 4) {
        readHtml += "<div class='appendName'>" + storage.user[data[id]].userName + "</div>";
      } else if (i == 5) {
        referHtml += "<div class='appendName'>" + storage.user[data[id]].userName + "</div>";
      }

    }

    if (target[i].children.length != 0 && i < 3) {
      testHtml += "</div>";
    } else if (target[i].children.length != 0 && i == 3) {
      testHtml2 += "</div>";
    }


  }

  testHtml += "</div>";
  testHtml2 += "</div>";


  testHtml += testHtml2;
  lineTarget.html(testHtml);


  let readTarget = $(".readContainer").html();
  readHtml = readTarget += readHtml;
  $(".readContainer").html(readHtml);
  let referTarget = $(".referContainer").html();
  referHtml = referTarget += referHtml;
  $(".referContainer").html(referHtml);



}




