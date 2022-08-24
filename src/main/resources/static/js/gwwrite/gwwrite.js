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

  $(".modal-wrap").hide()
  $(".insertedDetail").hide();
  $(".createLineBtn").hide();

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


  targetHtml += "<select class='formSelector'>";
  for (let i = 0; i < titles.length; i++) {
    targetHtml += "<option value='" + nums[i] + "'>" + titles[i] + "</option>"

  }

  targetHtml += "</select>"

  target.html(targetHtml);

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
  $(".createLineBtn").show();
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


// 결재선 생성 버튼 눌렀을 때 모달 띄움 
function showModal() {
  let orgChartTarget = $("#lineLeft");
  let userData = new Array();

  let x;
  for (x in storage.user) userData.push(x);

  let innerHtml = "";
  for (let i = 0; i < userData.length; i++) {
    innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + i + "' name='userNames' value='" + userData[i] + "'><label for='cb'>" + storage.user[userData[i]].userName + "</label></div>"
    orgChartTarget.html(innerHtml);
  }

  $(".modal-wrap").show();

}



// 결재선 모달 취소 생성 
function closeGwModal(obj) {
  if (obj.id == 'close') {
    $(".modal-wrap").hide();
  } else {
    createLine();
    $(".modal-wrap").hide();
  }
}






////조직도에서 결재 타입 선택 함수 
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
} //End of check(name) 







//// 조직도 결재 순서 
function upClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent = parent.parentElement;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = 0; i < numArr.length; i++) {
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
}// End of upClick(obj); 


function downClick(obj) {
  let parent;
  parent = obj.parentNode;
  parent = parent.parentNode;
  let target = $("#" + parent.id);
  let list = parent.children;

  let numArr = new Array();
  for (let i = 0; i < list.length; i++) {
    let id = list[i].id;
    let idArr = id.split("_");
    numArr.push(idArr[1]);
  }

  for (let i = numArr.length - 1; i >= 0; i--) {
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
} // End of downClick(obj) 


function deleteClick(obj) {
  let parent;
  parent = obj.parentElement;
  parent.remove();
} // End of deleteClign(obj); 






// 결재선 그리기 
function createLine() {

  let formTypeName = $(".formNumHidden").val();
  let formId = storage.formList[formTypeName].id;


  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");


  let testHtml = "<div class='lineGridContainer'>";
  let testHtml2 = "<div class='lineGridContainer'>";
  let readHtml = "<div>열람</div>";
  let referHtml = "<div>참조</div>";
  let target = $(".typeContainer");
  let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];
  let titleId = ["examine", "agree", "approval", "conduct", " read", "refer"]


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


      /// class 이름 , css 수정 

      if (i < 2 && j < target[i].children.length - 1) {
        testHtml += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i < 2 && j == target[i].children.length - 1) {
        testHtml += "<div class='lineSet'><div class='twoBorderLast'>직급</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorderLast  " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 2) {
        testHtml += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 3) {
        testHtml2 += "<div class='lineSet'><div class='twoBorder'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 4) {
        readHtml += "<div class='appendName " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div>";
      } else if (i == 5) {
        referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div>";
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


  $(".readContainer").html(readHtml);
  $(".referContainer").html(referHtml);


} // End of createLine(); 



// 날짜 변환 함수 
function getYmdHyphen() {
  let d = new Date();
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}
