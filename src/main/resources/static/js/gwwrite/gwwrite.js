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
    let targetArr = [1, 2, 3, 4];
    for (let i = 1; i < targetArr.length + 1; i++) {
      if (i == num) {
        $(".forSelect_" + i + "").css("color", "#332E85");
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
      }
    }
  }
  
  function setSelectedFormName(num) {
    let data = storage.formList;
    let title = data[num].title;
    let target = $(".formPreview");
    target.html(title);
  }
  
  function selectForm() {
    let target = $(".formPreview");
    let selectedForm = target.html();
    let target2 = $(".forSelect_1");
    let html = target2.html();
    let arr = html.split("\n");
    html = arr[0];
    html += "\n" + " > " + selectedForm;
    target2.html(html);
    $(".lineDetail").show();
    $(".formDetail").hide();
  
    console.log(storage.formList[0].form);
    $(".reportInsertForm").html(storage.formList[0].form);
  }
  