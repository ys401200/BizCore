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
  $(".reportInsertForm").hide();

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
          $(".reportInsertForm").hide();
        } else if (i == 2) {
          $(".lineDetail").show();
          $(".formDetail").hide();
          $(".reportInsertForm").hide();
        } else if (i == 3) {
          $(".reportInsertForm").show();
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
  }
}
