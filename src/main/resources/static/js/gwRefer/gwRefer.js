$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);

    referDefault();

});
ㄴ

// 참조 문서는 상세 조회가 가능하고 열람은 결재가 끝난 후에 참조/열람 문서함에서 열람 가능함 
function referDefault() {
    $(".modal-wrap").hide();
    $("#gwSubTabTitle").html("참조/열람 대기 문서");




    let url, method, data, type;
    url = "/api/gw/app/wait";
    method = "get"
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, successList, errorList);


    $(".searchContainer").show();
    $(".listPageDiv").show();
}



function successList(result) {
    storage.referList = result;
    window.setTimeout(drawApproval, 200);
}

function errorList() {
    alert("에러");
}


function drawApproval() {
    let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

    if (storage.referList === undefined) {
        alert("참조/열람 대기 문서가 없습니다");
    }
    else {
        jsonData = storage.referList.refer;
    }

    result = paging(jsonData.length, storage.currentPage, 5);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");
    header = [

        {
            "title": "번호",
            "align": "center",
        },
        {
            "title": "결재 타입",
            "align": "center",
        },
        {
            "title": "문서 종류",
            "align": "center",
        },
        {
            "title": "제목",
            "align": "left",
        },
        {
            "title": "작성자",
            "align": "center",
        },
        {
            "title": "작성일",
            "align": "center",
        },


    ];
    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
        disDate = dateDis(jsonData[i].created, jsonData[i].modified);
        setDate = dateFnc(disDate);
        let userName = storage.user[jsonData[i].writer].userName;
        let appType = jsonData[i].appType;
        if (appType == '0') {
            appType = "검토";

        } else if (appType == '1') {
            appType = "합의";

        } else if (appType == '2') {
            appType = "결재";
        } else if (appType == '3') {
            appType = "수신";
        } else {
            appType = "참조";

        }
        str = [

            {
                "setData":jsonData[i].docNo,
            }, {
                "setData": appType,
            },
            {
                "setData": jsonData[i].form,
            },
            {
                "setData": jsonData[i].title,
            },
            {
                "setData": userName,
            },
            {
                "setData": setDate,
            },

            // {
            // 	"setData": "<input type='checkbox' class='thisCheck' data-id='" + jsonData[i].no + "'>",
            // }
        ]

        fnc = "detailView(this)";
        ids.push(jsonData[i].docNo);
        data.push(str);
    }

    let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawApproval", result[0]);
    pageContainer[0].innerHTML = pageNation;
    createGrid(container, header, data, ids, job, fnc);



}// End of drawNoticeApproval()






function detailView(obj) {// 선택한 그리드의 글 번호 받아오기 

 
    let no = obj.dataset.id;

    $.ajax({
        "url": apiServer + "/api/gw/app/doc/" + no,
        "method": "get",
        "dataType": "json",
        "cache": false,
        success: (data) => {
            let detailData;
            if (data.result === "ok") {
                detailData = cipher.decAes(data.data);
                detailData = JSON.parse(detailData);
                detailData.doc = cipher.decAes(detailData.doc);
                detailData.doc = detailData.doc.replaceAll("\\\"", "\"");
                storage.reportDetailData = detailData;
                getDetailView();
            } else {
                alert("문서 정보를 가져오는 데 실패했습니다");
            }
        }
    })

} // End of noticeDetailView(); 



///글 제목 눌렀을때 상세 조회하는 페이지 그리기 
function getDetailView() {

    let testForm = storage.reportDetailData.doc;
    console.log(testForm);

    let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showPreAppModal()'>결재하기</button></div>" +
        "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div><div class='comment'></div></div>"


    $(".listPageDiv").html(detailHtml);



    let selectedFileView = "<div class='selectedFileField'><label>첨부파일</label><div><div class='selectedFileDiv'><input class='inputFile' type='file' onchange='setSelectedFiles()'/></div></div></div>"


    $(".seletedForm").html(testForm);
    $(".selectedFile").html(selectedFileView);
    $(":file").css("display", "none");// 첨부파일 버튼 숨기기 



    let tabHtml = "<div class='reportInfoTab'>" +
        "<label id='lineInfo' onclick='changeTab(this)'>문서정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
        "<div id='tabDetail'></div><div id='tabDetail2'></div>"
    $(".comment").html(tabHtml);


    toReadMode();
    drawCommentLine();


    let target = $(".seletedForm")[0];
    let inputsArr = target.getElementsByTagName("input");

    for (let i = 0; i < inputsArr.length; i++) {
        if (inputsArr[i].dataset.detail !== undefined) {
            inputsArr[i].value = inputsArr[i].dataset.detail;
        }
    }

    let textAreaArr = target.getElementsByTagName("textarea")[0];
    textAreaArr.value = textAreaArr.dataset.detail;

    let formId = storage.reportDetailData.formId;

    // 상세타입 체크하게 하기
    let rd = $("input[name='" + formId + "_RD']");
    for (let i = 0; i < rd.length; i++) {
        if (rd[i].dataset.detail == "on") {
            $("#" + rd[i].id).prop("checked", true);
        }
    }
    $("input[name='" + formId + "_RD']").prop("disabled", true);



    // 이름 , 직급 한글로 설정하기 
    let subTitlesArr = ["_examine", "_approval", "_agree", "_conduct"];
    for (let i = 0; i < subTitlesArr.length; i++) {
        if ($("." + formId + subTitlesArr[i]).val() != undefined) {
            for (let j = 0; j < $("." + formId + subTitlesArr[i]).length; j++) {
                $("." + formId + subTitlesArr[i])[j].value = storage.user[$("." + formId + subTitlesArr[i])[j].value].userName;
                $("." + formId + subTitlesArr[i] + "_position")[j].value = storage.userRank[$("." + formId + subTitlesArr[i] + "_position")[j].value][0];

            }
        }
    }

}

// 탭 누를때마다의 이벤트 주기 
function changeTab(obj) {

    $(obj).css("background-color", "#332E85");
    $(obj).css("color", "white");
    $(obj).css("border", "none");

    if (obj.id == 'lineInfo') {

        $("#changeInfo").css("background-color", "white");
        $("#changeInfo").css("color", "#332E85");
        $("#changeInfo").css("border-bottom", "2px solid #332E85");
        $("#tabDetail2").hide();
        $("#tabDetail").show();
        drawCommentLine();

    } else if (obj.id = 'changeInfo') {
        $("#lineInfo").css("background-color", "white");
        $("#lineInfo").css("color", "#332E85");
        $("#lineInfo").css("border-bottom", "2px solid #332E85");
        $("#tabDetail").hide();
        $("#tabDetail2").show();
        drawChangeInfo();

    }
}


// 문서 정보 그리는 함수 
function drawCommentLine() {

    let target = $("#tabDetail");

    let appLine = storage.reportDetailData.appLine;
    let appLineArr = new Array();
    let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"]
    for (let i = 1; i < appLine.length; i++) {
        let date, status, comment;

        if (appLine[i].approved == null && appLine[i].rejected == null) {
            if (appLine[i].read != null) {
                date = appLine[i].read;
                date = getYmdSlash(date);
                status = "조회";
            } else if (appLine[i].read == null) {
                date = "";
                status = "";
            }

        } else if (appLine[i].approved != null) {
            date = appLine[i].approved;
            date = getYmdSlash(date);
            status = "승인";
        } else if (appLine[i].rejected != null) {
            date = appLine[i].rejected;
            date = getYmdSlash(date);
            status = "반려";
        }

        if (appLine[i].comment == "null") {
            comment = "";
        } else {
            comment = appLine[i].comment;
        }


        let data = {
            "appType": appTypeTitle[appLine[i].appType],
            "name": storage.user[appLine[i].employee].userName,
            "status": status,
            "date": date,
            "comment": comment,
        }

        appLineArr.push(data);

    }



    let html = "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled/>작성자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled/>열람 설정 없음</label></div></div>"
    let detail = "<div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
    let lineDetailHtml = "";


    for (let i = 0; i < appLineArr.length; i++) {
        lineDetailHtml += "<div class='tapLine examineLine'><div>" + appLineArr[i].appType + "</div><div>" + appLineArr[i].name + "</div><div>" + appLineArr[i].status + "</div><div>" + appLineArr[i].date + "</div><div>" + appLineArr[i].comment + "</div></div>";
    }

    detail += lineDetailHtml;

    html += detail;

    $(".tabLine").children(0).css("padding", "5em");

    target.html(html);


    // 열람 권한 체크하기 
    let readable = storage.reportDetailData.readable;
    if (readable == "dept") {
        $("#deptRd").prop("checked", true);
    } else if (readable == "none") {
        $("#noneRd").prop("checked", true);
    }


}



//  변경이력 그리는 함수 
function drawChangeInfo() {
    let target = $("#tabDetail2");
    // 임시 데이터 ----------------------------------------------------


    let changeData = [{
        "type": "검토",
        "name": "구민주",
        "modifyDate": "22-08-18 10:34:46",
        "modCause": " 거래처 수정 "
    },
    {
        "type": "검토",
        "name": "이송현",
        "modifyDate": "22-08-19 10:34:46",
        "modCause": "수정 완 "
    }]

    // 임시 데이터 ---------------------------------------------------- 

    let detail = "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
    let changeHtml = "";


    for (let i = 0; i < changeData.length; i++) {
        changeHtml += "<div class='tapLineB changeDataLine'>" +
            "<div class='changeType'>" + changeData[i].type + "</div><div class='changeName' >" + changeData[i].name + "</div><div class='changeDate'>" + changeData[i].modifyDate + "</div><div class='changeCause'>" + changeData[i].modCause + "</div>" +
            "</div>"
    }

    detail += changeHtml;
    target.html(detail);

}








function getYmdSlash() {
    let d = new Date();
    return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}