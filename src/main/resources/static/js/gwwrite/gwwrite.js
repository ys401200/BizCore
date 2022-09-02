$(document).ready(() => {
  init();

  setTimeout(() => {
    $("#loadingDiv").hide();
    $("#loadingDiv").loading("toggle");
  }, 300);

  getformList();
});

function getformList() {


  $(".ContentDiv").html("<div class='gwWriteBtns'></div><div class='selector'>d</div><div class='selector'>d</div><div class='selector'>d</div>");

  $(".gwWriteBtns").html("<button type='button'>기안 하기</button> <button type='button' >임시 저장</button> <button type='button'>인쇄 미리보기</button>");

  // 기본설정


  $(".selector:first").html("<div>기본 설정</div><div class='formDetail'><div>결재양식</div><div class='formListDiv'></div><button type='button' class='formSelectbtn' onclick='selectForm()'>선택</button><input type='hidden' class='formNumHidden'/></div>"
    + "<div class='formDetail'><div>열람권한</div><div><label><input type='radio' name='authority' value='dept' />기안자 소속 부서 포함</label><label><input type='radio' name='authority' value='none' checked />권한 설정 없음</label></div></div>");

  $(".selector:first").next().html("<div>결재선 <button class='createLineBtn' onclick='showModal()'>결재선생성</button></div><div class='modal-wrap'><div class='gwModal'></div></div>");


  let lastHtml = "<div>상세 입력</div><div class='insertedDetail'><div class='reportInsertForm'></div><div class='referContainer'><div>참조</div></div><div class='fileDetail'>";


  lastHtml += "<div>파일첨부</div><div class='filebtnContainer'><input type='file' class='gwFileInput' onchange='drawSelectedFileList(this)' /><div class='insertedFileList'></div></div></div></div>"


  $(".selector:first").next().next().html(lastHtml);


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
  console.log(data);

  targetHtml += "<select class='formSelector'>";
  for (let i = 0; i < titles.length; i++) {
    targetHtml += "<option value='" + nums[i] + "'>" + titles[i] + "</option>"

  }

  targetHtml += "</select>"

  target.html(targetHtml);

}

// 결재양식 선택에서 양식 선택 버튼 눌렀을 때 함수 
function selectForm() {
  let data = storage.formList;
  let selectedFormNo = $(".formSelector").val();
  selectedFormTitle = data[selectedFormNo].title;

  $(".lineDetail").show();
  $(".createLineBtn").show();
  $(".reportInsertForm").html(data[selectedFormNo].form);
  $(".insertedDetail").show();





  //작성자 작성일 자동 입력
  let my = storage.my;
  let writer = storage.user[my].userName;
  let formId = data[selectedFormNo].id;
  $("#" + formId + "_writer").val(writer);

  let date = getYmdHyphen();
  $("#" + formId + "_created").val(date);
  $(".testClass").prop('checked', false);
  $(".typeContainer").html("")


}




// 결재선 생성 버튼 눌렀을 때 모달 띄움 
function showModal() {


  let setGwModalHtml = "<div class='gwModal'>" +
    "<div class='modal-title'>결재선 생성</div>" +
    "<div class='lineDetail'>" +
    "<div class='lineTop'>" +
    "<div class='innerDetail' id='lineLeft'></div>" +
    "<div class='innerDetail' id='lineCenter'>" +
    "<button onclick='check(this.value)' value='examine'>검토 ></button>" +
    "<button onclick='check(this.value)' value='agree'>합의 ></button>" +
    "<button onclick='check(this.value)' value='approval'>결재 ></button>" +
    " <button onclick='check(this.value)' value='conduct'>수신 ></button>" +
    "<button onclick='check(this.value)' value='refer'>참조 ></button></div>" +
    "<div class='innerDetail' id='lineRight'>" +
    " <label for='examine'> 검토" +
    "<div class='typeContainer' id='examine'></div>" +
    "</label>" +
    "<label for='agree'> 합의" +
    "<div class='typeContainer' id='agree'></div></label>" +
    "<label for='approval'> 결재" +
    "<div class='typeContainer' id='approval'></div></label>" +
    "<label for='conduct'> 수신" +
    "<div class='typeContainer' id='conduct'></div></label>" +
    "<label for='refer'> 참조" +
    "<div class='typeContainer' id='refer'></div></label>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='close-wrap'>" +
    " <button id='close' onclick='closeGwModal(this)'>취소</button>" +
    " <button id='create' onclick='closeGwModal(this)'>생성</button>" +
    "</div>" +
    "</div>" +
    "</div>";
  $(".modal-wrap").html(setGwModalHtml);



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


// 결재선 그리기 + 작성자 추가 
function createLine() {

  let selectedFormNo = $(".formSelector").val();
  let formId = storage.formList[selectedFormNo].id;
  let lineTarget = $(".infoline")[0].children[1];
  lineTarget = $("#" + lineTarget.id);
  lineTarget.html("");
  lineTarget.css("display", "block");
  let my = storage.my;
  let today = getYmdSlash();
  let testHtml = "<div class='lineGridContainer'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorderLast'>직급</div><div class='twoBorderLast'>" + storage.user[my].userName + "</div><div class='twoBorderLast'>서명</div><div class='dateBorderLast'>" + today + "</div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
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
        testHtml += "<div class='lineSet'><div class='twoBorder " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i < 2 && j == target[i].children.length - 1) {
        testHtml += "<div class='lineSet'><div class='twoBorderLast " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorderLast " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorderLast  " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 2) {
        testHtml += "<div class='lineSet'><div class='twoBorder " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 3) {
        testHtml2 += "<div class='lineSet'><div class='twoBorder " + formId + "_" + titleId[i] + "_position" + "'>직급</div><div class='twoBorder " + formId + "_" + titleId[i] + "'>" + storage.user[data[id]].userName + "</div><div class='twoBorder " + formId + "_" + titleId[i] + "_status'>서명</div><div class='dateBorder " + formId + "_" + titleId[i] + "_approved'>/</div></div>"
      } else if (i == 4) {
        referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "'>직급 " + storage.user[data[id]].userName + "</div>";
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

  $(".referContainer").html(referHtml);

} // End of createLine(); 



// 날짜 변환 함수 
function getYmdHyphen() {
  let d = new Date();
  return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}

function getYmdSlash() {
  let d = new Date();
  return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}




let fileNamesArr = new Array();


function drawSelectedFileList(obj) {

  let fileName = obj.value.split("\\");
  let fileListHtml = "";


  fileName = fileName[fileName.length - 1];
  fileNamesArr.push(fileName);

  for (let i = 0; i < fileNamesArr.length; i++) {
    fileListHtml += "<div >" + fileNamesArr[i] + "<button type='button' value='" + i + "' onclick='deleteFile(this)'>x</button></div></div>"
  }


  $(".insertedFileList").html(fileListHtml);
  $(".gwFileInput").val(""); // 선택된 파일 초기화 
}


//arr splice 
function deleteFile(obj) {

  let fileNo = obj.value;
  fileNamesArr.splice(fileNo, 1);
  let fileListHtml = "";
  for (let i = 0; i < fileNamesArr.length; i++) {
    fileListHtml += "<div value='" + i + "'>" + fileNamesArr[i] + "<button type='button' onclick='deleteFile(this)'>x</button></div></div>"
  }

  $(".insertedFileList").html(fileListHtml);
  $(".gwFileInput").val("");
}



//for(let i = 0 ; i < 3; i ++) {arr.push($(".doc_Form_Consult_date")[i].dataset.detail)}
// let formId = "doc_Form_Consult_date"
// $("."+formId)[0].dataset.detail; 

