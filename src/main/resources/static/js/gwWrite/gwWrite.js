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

  $(".gwWriteBtns").html("<button type='button' onclick='reportInsert()'>기안 하기</button> <button type='button' >임시 저장</button> <button type='button'>인쇄 미리보기</button>");

  // 기본설정

  $(".selector:first").html("<div>기본 설정</div><div class='formDetail'><div>결재양식</div><div class='formListDiv'></div><button type='button' class='formSelectbtn' onclick='selectForm()'>선택</button><input type='hidden' class='formNumHidden'/></div>"
    + "<div class='formDetail'><div>열람권한</div><div><label><input type='radio' name='authority' value='dept' checked  />기안자 소속 부서 포함</label><label><input type='radio' name='authority' value='none' />권한 설정 없음</label></div></div>");

  $(".selector:first").next().html("<div>결재선 <div class='guide'> 결재 양식을 선택하면 결재선 생성을 할 수 있습니다.</div> <button class='createLineBtn' onclick='showModal()'>결재선생성</button></div><div class='modal-wrap'><div class='gwModal'></div></div>");


  let lastHtml = "<div>상세 입력 <div class='guide'> 결재 양식을 선택하면 상세 입력을 할 수 있습니다.</div></div><div class='insertedDetail'><div class='reportInsertForm'></div><div class='referContainer'><div>참조</div></div><div class='fileDetail'>";


  // lastHtml += "<div>파일첨부</div><div class='filebtnContainer'><input type='file' class='gwFileInput' onchange='drawSelectedFileList(this)' /><div class='insertedFileList'></div></div></div></div>"
  lastHtml += "<div>파일첨부</div><div class='filebtnContainer'><input type='file' multiple id='attached' name='attached[]' onchange='docFileChange()' /><div class='filePreview'></div></div></div></div>"

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

  $(".guide").remove();
  $(".lineDetail").show();
  $(".createLineBtn").show();
  $(".reportInsertForm").html(data[selectedFormNo].form);
  $(".insertedDetail").show();

  //작성자 작성일 자동 입력
  let my = storage.my;
  let writer = storage.user[my].userName;
  let formId = data[selectedFormNo].id;
  $("#" + formId + "_writer").val(writer);
  $("#" + formId + "_writer").attr("data-detail", writer);


  let date = getYmdHyphen();
  $("#" + formId + "_created").val(date);
  $("#" + formId + "_created").attr("data-detail", date);
  $(".testClass").prop('checked', false);
  $(".typeContainer").html("")
  $(".inputsAuto").prop("disabled", "true");
  $(".inputsAuto").css("text-align", "center")
  $(".inputsAuto").eq(0).css("text-align", "left");
  $(".inputsAuto").eq(1).css("text-align", "left");
  $(".inputsAuto").eq(2).css("text-align", "left");



  //영업기회 데이터 리스트 만들기  



  $.ajax({
    url: "/api/sopp",
    type: "get",
    dataType: "json",
    success: (result) => {
      if (result.result == "ok") {
        let jsondata;
        jsondata = cipher.decAes(result.data);
        jsondata = JSON.parse(jsondata);
        storage.soppList = jsondata;
        setSoppList(formId);
      } else {
        alert("에러");
      }
    },
  });


  // 거래처 데이터 리스트 

  let html = $(".infoContentlast")[0].innerHTML;
  let x;
  let dataListHtml = "";


  // 거래처 데이터 리스트 만들기 
  dataListHtml = "<datalist id='_infoCustomer'>"
  for (x in storage.customer) {
    dataListHtml += "<option data-value='" + x + "' value='" + storage.customer[x].name + "'></option> "
  }
  dataListHtml += "</datalist>"
  html += dataListHtml;
  $(".infoContentlast")[0].innerHTML = html;
  $("#" + formId + "_infoCustomer").attr("list", "_infoCustomer");


}


// 영업기회 데이터 리스트 가져오는 함수  
function setSoppList(formId) {
  let soppTarget = $(".infoContent")[3];
  let soppHtml = soppTarget.innerHTML;
  let soppListHtml = "";


  soppListHtml = "<datalist id='_infoSopp'>"

  for (let i = 0; i < storage.soppList.length; i++) {
    soppListHtml += "<option data-value='" + storage.soppList[i].no + "' value='" + storage.soppList[i].title + "'></option> "
  }

  soppListHtml += "</datalist>"
  soppHtml += soppListHtml;
  soppTarget.innerHTML = soppHtml;
  $("#" + formId + "_sopp").attr("list", "_infoSopp");

}










// 결재선 생성 버튼 눌렀을 때 모달 띄움 
function showModal() {

  let setGwModalHtml = "<div class='gwModal'>" +
    "<div class='modal-title'>결재선 생성</div>" +
    "<div class='lineDetail'>" +
    "<div class='lineTop'>" +
    "<div class='innerDetail' id='lineLeft'></div>" +
    "<div class='innerDetail' id='lineCenter'>" +
    "<button onclick='check(this.value)' value='examine'>검토 &gt;</button>" +
    "<button onclick='check(this.value)' value='agree'>합의 &gt;</button>" +
    "<button onclick='check(this.value)' value='approval'>결재 &gt;</button>" +
    " <button onclick='check(this.value)' value='conduct'>수신 &gt;</button>" +
    "<button onclick='check(this.value)' value='refer'>참조 &gt;</button></div>" +
    "<div class='innerDetail' id='lineRight'>" +
    "<div><select onchange='setSavedLine(this)'><option value=''>자주 쓰는 결재선</option><option value='basic'>대표</option><option value='middle'>구민주 과장-대표</option><</select></div>" +
    "<div><div>검토</div>" +
    "<div class='typeContainer' id='examine'></div>" +
    "</div>" +
    "<div><div>합의</div>" +
    "<div class='typeContainer' id='agree'></div></div>" +
    "<div><div>결재</div>" +
    "<div class='typeContainer' id='approval'></div></div>" +
    "<div><div>수신</div>" +
    "<div class='typeContainer' id='conduct'></div></div>" +
    "<div><div>참조</div>" +
    "<div class='typeContainer' id='refer'></div></div>" +
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
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함 
  for (x in storage.user) {
    if (x != my) {
      userData.push(x);
    }
  }

  let innerHtml = "";
  for (let i = 0; i < userData.length; i++) {
    innerHtml += "<div><input class='testClass' type ='checkbox' id='cb" + userData[i] + "' name='userNames' value='" + userData[i] + "'><label for='cb" + userData[i] + "'>" + storage.user[userData[i]].userName + "</label></div>"
  }
  orgChartTarget.html(innerHtml);
  $(".modal-wrap").show();

}

// 결재선 모달 취소 생성 
function closeGwModal(obj) {
  if (obj.id == 'close') {
    $(".modal-wrap").hide();
  } else {
    if ($("#approval").html() == '') {
      alert("결재자를 설정하세요");
    } else {
      createLine();
      $(".inputsAuto").prop("disabled", "true");
      $(".inputsAuto").css("text-align", "center")
      $(".inputsAuto").eq(0).css("text-align", "left");
      $(".inputsAuto").eq(1).css("text-align", "left");
      $(".inputsAuto").eq(2).css("text-align", "left");
      $(".modal-wrap").hide();
    }

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
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함 
  for (x in storage.user) {
    if (x != my) {
      data.push(x);
    }
  }




  for (let i = 0; i < inputLength.length; i++) {
    if ($("#cb" + data[i]).prop('checked')) {
      if (document.getElementById("linedata" + data[i]) == null)
        selectHtml += "<div class='lineDataContainer' id='lineContainer_" + data[i] + "'><label id='linedata_" + data[i] + "'>" + storage.user[data[i]].userName + "</label><button value='" + data[i] + "' onclick='upClick(this)'>▲</button><button  value='" + data[i] + "' onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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

  /// 사번 배열을 만든다 

  for (let i = 0; i < numArr.length; i++) {
    if (obj.value == numArr[i] && i != 0) {
      let temp = numArr[i];
      numArr[i] = numArr[i - 1];
      numArr[i - 1] = temp;
    }
  }

  // 순서 바꾸는 것 

  let data = new Array();
  let x;
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함 
  for (x in storage.user) {
    if (x != my) {
      data.push(x);
    }
  }

  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[numArr[i]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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
  let my = storage.my;
  //나는 결재선에 노출 안 되게 함 
  for (x in storage.user) {
    if (x != my) {
      data.push(x);
    }
  }

  let selectHtml = "";
  for (let i = 0; i < numArr.length; i++) {
    selectHtml += "<div class='lineDataContainer' id='lineContainer_" + numArr[i] + "'><label id='linedata" + numArr[i] + "'>" + storage.user[numArr[i]].userName + "</label><button value='" + numArr[i] + "' onclick='upClick(this)'>▲</button><button  value='" + numArr[i] + "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>"
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
  let testHtml = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작성</div><div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto' value='" + storage.userRank[storage.user[my].rank][0] + "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' value='" + storage.user[my].userName + "'></div>" +
    "<div class='twoBorder'><input type='text' class='inputsAuto' value='승인'></div>" +
    "<div class='dateBorder'><input type='text' class='inputsAuto'value='" + getYmdSlash() + "'></div></div></div>";
  let testHtml2 = "<div class='lineGridContainer'>";
  let referHtml = "<div>참조</div>";
  let target = $(".typeContainer"); // 결재선 생성 모달에서 결재 타입 각각의 container 
  let titleArr = ["검토", "합의", "결재", "수신", "열람", "참조"];
  let titleId = ["examine", "agree", "approval", "conduct", "refer"]


  let data = new Array();
  let x;
  //나는 결재선에 노출 안 되게 함 
  for (x in storage.user) {
    if (x != my) {
      data.push(x);
    }
  }

  for (let i = 0; i < target.length; i++) {
    if (target[i].children.length != 0 && i < 3) { // 해당 결재 타입에 설정된 사람이 없지 않으면서 결재 타입이 검토 합의 결재인 경우 
      testHtml += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    } else if (target[i].children.length != 0 && i == 3) { // 결재타입이 수신인 경우 
      testHtml2 += "<div class='lineGrid'><div class='lineTitle'>" + titleArr[i] + "</div>"
    }



    for (let j = 0; j < target[i].children.length; j++) {
      let id = target[i].children[j].id;
      id = id.split('_');
      id = id[1];


      // 수신 
      if (i == 3) {
        testHtml2 += "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='" + storage.userRank[storage.user[id].rank][0] + "' data-detail='" + storage.user[id].rank + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[id].userName + "' data-detail='" + storage.user[id].userNo + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
      }

      // 참조 
      else if (i == 4) {
        referHtml += "<div class='appendName " + formId + "_" + titleId[i] + "' data-detail='" + storage.user[id].userNo + "'>" + storage.userRank[storage.user[id].rank][0] + "&nbsp" + storage.user[id].userName + "</div>";
      }

      // 검토 합의 결재 
      else {
        testHtml += "<div class='lineSet'><div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_position" + "' value='" + storage.userRank[storage.user[id].rank][0] + "' data-detail='" + storage.user[id].rank + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "' value='" + storage.user[id].userName + "' data-detail='" + storage.user[id].userNo + "'/></div>" +
          "<div class='twoBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_status' value='' data-detail=''/></div>" +
          "<div class='dateBorder'><input type='text' class='inputsAuto " + formId + "_" + titleId[i] + "_approved" + "' value='' data-detail=''/></div></div>"
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


//for(let i = 0 ; i < 3; i ++) {arr.push($(".doc_Form_Consult_date")[i].dataset.detail)}
// let formId = "doc_Form_Consult_date"
// $("."+formId)[0].dataset.detail; 


// 자주쓰는 결재선 선택시 설정 
function setSavedLine(obj) {
  let val = obj.value;
  if (val == 'middle') { // 구민주 검토 이승우 결재
    $("#examine").html("<div class='lineDataContainer' id='lineContainer_10017'><label id='linedata_10017'>구민주</label><button value='10017' onclick='upClick(this)'>▲</button><button  value='10017'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#approval").html("<div class='lineDataContainer' id='lineContainer_10002'><label id='linedata_10002'>이승우</label><button value='10002' onclick='upClick(this)'>▲</button><button  value='10002'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#agree").html("");
    $("#conduct").html("");
    $("#refer").html("");
  } else if (val == 'basic') { // 이승우 결재 
    $("#approval").html("<div class='lineDataContainer' id='lineContainer_10002'><label id='linedata0'>이승우</label><button value='10002' onclick='upClick(this)'>▲</button><button  value='10002'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>");
    $("#agree").html("");
    $("#examine").html("");
    $("#conduct").html("");
    $("#refer").html("");
  }

}



function reportInsert() {



  let title, content, readable, formId, appDoc, dept;
  let appLine = [];
  let selectedFormNo = $(".formSelector").val();
  formId = storage.formList[selectedFormNo].id;
  let detailType = $("input[name='" + formId + "_RD']:checked").attr("id");

  // sopp = $("#" + formId + '_sopp').val();
  // infoCustomer = $("#" + formId + '_infoCustomer').val();


  let slistid = "infoSopp";
  let soppVal = $("#" + formId + "_sopp").val();
  let soppResult = dataListFormat(slistid, soppVal);



  let clistid = "infoCustomer";
  let customerVal = $("#" + formId + "_infoCustomer").val();
  let customerResult = dataListFormat(clistid, customerVal);



  // $("#_infoSopp").remove();
  // $("#_infoCustomer").remove();

  title = $("#" + formId + '_title').val();
  content = $("#" + formId + "_content").val();
  readable = $('input[name=authority]:checked').val();
  appDoc = $(".reportInsertForm").html();
  appDoc = appDoc.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\"", "\\\"");
  let my = storage.my;
  dept = storage.user[my].deptId[0];
  // 결재가 1번 

  for (let i = 0; i < $("." + formId + "_examine").length; i++) {
    appLine.push([0, $("." + formId + "_examine")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_agree").length; i++) {
    appLine.push([1, $("." + formId + "_agree")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_approval").length; i++) {
    appLine.push([2, $("." + formId + "_approval")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_conduct").length; i++) {
    appLine.push([3, $("." + formId + "_conduct")[i].dataset.detail]);
  }
  for (let i = 0; i < $("." + formId + "_refer").length; i++) {
    appLine.push([4, $("." + formId + "_refer")[i].dataset.detail]);
  }


  let data = {
    "title": title,
    "sopp": soppResult + "",
    "dept": dept,
    "customer": customerResult + "",
    "attached": storage.attachedList === undefined ? [] : storage.attachedList,
    "content": content,
    "appLine": appLine,
    "appDoc": appDoc,
    "formId": formId,
    "readable": readable
  }
  console.log(data);
  data = JSON.stringify(data)
  data = cipher.encAes(data);



  if ($(".createLineBtn").css("display") == "none") {
    alert("결재 문서 양식을 선택하세요");
  } else if (formId != "doc_Form_Pur" && detailType == undefined && formId != "doc_Form_Dip" && detailType == undefined) {
    alert("결재문서 상세 타입을 선택하세요")
  } else if (title == '') {
    alert("제목을 입력하세요");
  } else if ($("#" + formId + "_line").html() == '결재선') {
    alert("결재선을 생성하세요");
  } else {

    $.ajax({
      url: "/api/gw/app/doc",
      method: "post",
      data: data,
      dataType: "json",
      contentType: "text/plain",
      success: (result) => {
        if (result.result === "ok") {
          alert("기안 완료");
          location.href = "/gw/mydraft";
        } else {
          alert(result.msg);
        }
      }
    })
  }

}


// 파일 첨부 버튼 누를 때 마다 반영 
function docFileChange() {
  let method, data, type, attached;
  attached = $(document).find("[name='attached[]']")[0].files;

  if (storage.attachedList === undefined || storage.attachedList <= 0) {
    storage.attachedList = [];
  }


  let fileDataArray = storage.attachedList;
  for (let i = 0; i < attached.length; i++) {
    let reader = new FileReader();
    let fileName;

    fileName = attached[i].name;
    // 파일 중복 등록 제거 
    if (!fileDataArray.includes(fileName)) {
      storage.attachedList.push(fileName);

      reader.onload = (e) => {
        let binary, x, fData = e.target.result;
        const bytes = new Uint8Array(fData);
        binary = "";
        for (x = 0; x < bytes.byteLength; x++) binary += String.fromCharCode(bytes[x]);
        let fileData = cipher.encAes(btoa(binary));
        let fullData = (fileName + "\r\n" + fileData);

        let url = "/api/attached/docapp"
        url = url;
        method = "post";
        data = fullData;
        type = "insert";

        crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
      }

      reader.readAsArrayBuffer(attached[i]);
    }
  }


  let html = "";

  for (let i = 0; i < fileDataArray.length; i++) {

    html += "<div data-detail='" + fileDataArray[i] + "'>" + fileDataArray[i] + "<button type='button' onclick='deleteFile(this)'>x</button></div></div>"
    $(".filePreview").html(html);
  }

  // 파일목록 수정의 경우 추가해야함 


}

function deleteFile(obj) {
  let value = obj.parentElement.dataset.detail;
  storage.attachedList = storage.attachedList.filter((element) => element != value);
  obj.parentElement.remove();
}




// 입력된 총 합계 구하는 함수 
function getTotalCount() {
  let totalCount = Number(0);
  for (let i = 0; i < $(".doc_Form_Consult_total").length; i++) {
    totalCount += (Number($(".doc_Form_Consult_total")[i].dataset.detail.replace(",", "")));
  }
  return totalCount;
}


// 기안 시 금액이 입력되지 않은 공백 칸 제거해서 폼 올리기 
function deleteGap() {
  for (let i = ($(".doc_Form_Consult_total").length - 1); i >= 0; i--) {

    if ($(".doc_Form_Consult_total")[i].dataset.detail == "" || $(".doc_Form_Consult_total")[i].dataset.detail == undefined || $(".doc_Form_Consult_total")[i].dataset.detail == "null") {
      $(".doc_Form_Consult_total")[i].parentElement.parentElement.remove();
    }
  }

}


