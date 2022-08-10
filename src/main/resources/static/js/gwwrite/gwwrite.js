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
        drawOrganizationChart();
      } else {
        alert("에러");
      }
    },
  });

  $(".lineDetail").hide();


  let previewWidth = document.getElementsByClassName("reportInsertForm")[0];
  previewWidth = previewWidth.clientWidth;
  let target = $(".reportInsertForm");
  target.css("height", Math.ceil(previewWidth / 210 * 297));





}

function drawFormList() {
  let data = storage.formList;
  let titles = new Array();
  let nums = new Array();
  let target = $(".formListDiv");
  let targetHtml = "";

  for (let i = 0; i < data.length; i++) {
    titles.push(data[i].title);
    nums.push(data[i].no);
  }

  for (let i = 0; i < titles.length; i++) {
    targetHtml +=
      "<button  onclick='setSelectedFormName(" +
      i +
      ")' type='button' class='formtypebtn' id='doc_form_" +
      nums[i] +
      "'>" +
      titles[i] +
      "</button>";
  }

  target.html(targetHtml);
}

function selectChangeEvent(num) {

  let target2 = $(".forSelect_1");
  let html = target2.html();
  let arr = html.split("\n");


  // 양식이 선택 되었을 때 
  if (arr.length > 1) {
    let targetArr = [1, 2, 3, 4];
    for (let i = 1; i < targetArr.length + 1; i++) {
      if (i == num) {
        $(".forSelect_" + i + "").css("color", "#332E85");
        $(".forSelect_" + i + "").css("font-size", "1.5rem");
        if (i == 1) {
          $(".formDetail").show();
          $(".lineDetail").hide();

        } else if (i == 2) {
          $(".lineDetail").show();
          $(".formDetail").hide();

        } else if (i == 3) {

          $(".lineDetail").hide();
          $(".formDetail").hide();
        }
      } else {
        $(".forSelect_" + i + "").css("color", "gray");
        $(".forSelect_" + i + "").css("font-size", "1rem");
      }
    }
  }




}

function setSelectedFormName(num) {
  let data = storage.formList;
  let title = data[num].title;
  let hidden = $(".formNumHidden");
  let target = $(".formPreview");
  hidden.val(num);
  target.html(title);
}


// 결재양식 선택에서 양식 선택 버튼 눌렀을 때 이벤트 함수 
function selectForm() {
  let preview = $(".formPreview").html();
  let forSelect1 = $(".forSelect_1");
  let forSelect2 = $(".forSelect_2");
  let html = forSelect1.html();

  if (preview != '미리보기') {
    let arr = html.split("\n");
    let hidden = $(".formNumHidden");
    html = arr[0];
    html += "\n" + " > " + preview;
    forSelect1.html(html);
    forSelect1.css("color", "gray");
    forSelect1.css("font-size", "1rem");
    forSelect2.css("color", "#332E85");
    forSelect2.css("font-size", "1.5rem");
    $(".lineDetail").show();
    $(".formDetail").hide();
    $(".reportInsertForm").html(storage.formList[hidden.val()].form);
    $(".testClass").prop('checked', false);
    $(".typeContainer").html("");

  }
}


function drawOrganizationChart() {
  let orgChartTarget = $("#lineLeft");
  let data = new Array();

  let x;
  for (x in storage.user) data.push(x);

  let innerHtml = "";

  for (let i = 0; i < data.length; i++) {
    innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + i + "' name='userNames' value='" + data[i] + "'><label for='cb'>" + storage.user[data[i]].userName + "</label></div>"
    orgChartTarget.html(innerHtml);
  }



}

// 조직도에서 이름 선택하고 결재타입 선택한 경우 
function check(name) {
  let inputLength = $(".testClass");
  let target = $("#" + name);
  let html = target.html();
  let selectHtml = "";


  //사번 데이터만 가져옴 
  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);

  for (let i = 0; i < inputLength.length; i++) {
    if ($("#cb" + i).prop('checked')) {
      // 중복 입력 불가
      if (document.getElementById("linedata" + i) == null)
        selectHtml += "<div class='lineDataContainer' id='lineContainer_" + i + "'><label id='linedata" + i + "'>" + storage.user[data[i]].userName + "</label><button value='" + i + "' onclick='upClick(this)'>▲</button><button  value='" + i + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
    }

  }
  html += selectHtml;
  target.html(html)
  // 결재타입 선택 후 체크 박스 모두 해제 
  $(".testClass").prop('checked', false);
}








// function upDown(obj, el) {
//   let parent;
//   parent = obj.parentElement;
//   parent = parent.parentElement;
//   let target = $("#" + parent.id);
//   let list = parent.children;

//   for (let i = 0; i < list.length; i++)   if (list[i] === el) break;
//   target = list[i + ];
//   if (target === undefined) target = null;
//   if (n > 0) parent.insertBefore(target, el);
//   else if (i > 0 && n < 0) parent.insertBefore(target, el);

//   console.log(list);


//   // let data = new Array();
//   // let x;
//   // for (x in storage.user) data.push(x);
//   // let selectHtml = "";
//   // for (let i = 0; i < numArr.length; i++) {
//   //   selectHtml += "<div class='lineDataContainer' id='lineContainer_" + list[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[data[numArr[i]]].userName + "</label><button value='" + numArr[i] + "' onclick='upDown(this, -1)'>▲</button><button  value='" + numArr[i] + "'onclick='upDown(this, 1)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
//   // }

//   // target.html(selectHtml);
// }

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
  let testHtml = "";
  let target = $(".typeContainer");
  let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];

  let data = new Array();
  let x;
  for (x in storage.user) data.push(x);


  for (let i = 0; i < target.length; i++) {

    if (target[i].children.length != 0) {
      testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"

      for (let j = 0; j < target[i].children.length; j++) {
        let id = target[i].children[j].id;
        id = id.split('_');
        id = id[1];
        testHtml += "<div class='lineSet'><div class='lineUserName'>" + storage.user[data[id]].userName + "</div><div class='gap'>서명</div><div class='linedate'>/</div></div>"
      }
      testHtml += "</div>"
    }
  }

  lineTarget.html(testHtml);

}













