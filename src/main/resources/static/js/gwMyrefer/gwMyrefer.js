$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);
    defaultMyDraft();
});



function defaultMyDraft() {
    $("#gwSubTabTitle").html("참조/열람 문서함");
    let url, method, data, type;
    url = "/api/gw/app/references";
    method = "get"
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, successList, errorList);

}


function successList(result) {
    storage.myReferList = result;
    window.setTimeout(drawMyRefer, 200);
}

function errorList() {
    alert("에러");
}


function drawMyRefer() {
    let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

    if (storage.myReferList === undefined || storage.myReferList.length == 0) {
        alert("참조/열람 문서가 없습니다");
    }
    else {
        jsonData = storage.myReferList;
    }

    result = paging(jsonData.length, storage.currentPage, 10);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");

    header = [

        {
            "title": "번호",
            "align": "center",
        }, {
            "title": "기안일",
            "align": "center",
        },
        {
            "title": "문서양식",
            "align": "center",
        },
        {
            "title": "제목",
            "align": "left",
        }, {
            "title": "작성자",
            "align": "center",
        },

        {
            "title": "결재 타입",
            "align": "center",
        },
        {
            "title": "조회",
            "align": "center",
        },
        {
            "title": "상태",
            "align": "center",
        },

    ];

    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
        disDate = dateDis(jsonData[i].created, jsonData[i].modified);
        setDate = dateFnc(disDate);
        let read = jsonData[i].read;
        let status;
        if (read == null) {
            read = "N";
        } else {
            read = getYmdSlash(read);
        }

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

        if (jsonData[i].status == 1) {
            status = "진행 중";
        } else if (jsonData[i].status == 2) {
            status = "수신 대기 ";
        } else if (jsonData[i].status == 3) {
            status = "승인 완료";
        } else if (jsonData[i].status == -3) {
            status = "반려";
        }

        str = [

            {
                "setData": jsonData[i].docNo,
            }, {
                "setData": setDate,
            },
            {
                "setData": jsonData[i].form,
            },
            {
                "setData": jsonData[i].title,
            },
            {
                "setData": jsonData[i].writer,
            },

            {
                "setData": appType,
            },
            {
                "setData": read,
            }, {
                "setData": status
            }

        ]

        fnc = "detailView(this)";
        ids.push(jsonData[i].docNo);
        data.push(str);
    }

    let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawMyDraft", result[0]);
    pageContainer[0].innerHTML = pageNation;
    createGrid(container, header, data, ids, job, fnc);


    // 전체선택 전체 해제  
    $(".thisAllcheck").click(function () {
        if ($(".thisAllcheck").prop("checked")) {
            $(":checkbox").prop("checked", true);
        } else {
            $(":checkbox").prop("checked", false);
        }

    });
}

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
    let formId = storage.reportDetailData.formId;
    let testForm = storage.reportDetailData.doc;
    console.log(testForm);

    let detailHtml = "<div class='mainBtnDiv'><button type='button' onclick='showList()'>목록보기</button></div>" +
        "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='referDiv'><label>참조</label><div class='selectedRefer'></div></div><div class='selectedFile'></div></div><div class='comment'></div></div>"



    $(".listPageDiv").html(detailHtml);



    let selectedFileView = "<label>첨부파일</label><div><div><input class='inputFile' multiple name='attached[]'type='file' onchange='setSelectedFiles()'/></div><div class='selectedFileDiv'></div></div>"


    $(".seletedForm").html(testForm);
    $(".selectedFile").html(selectedFileView);
    $(":file").css("display", "none");// 첨부파일 버튼 숨기기 



    let tabHtml = "<div class='reportInfoTab'>" +
        "<label id='lineInfo' onclick='changeTab(this)'>문서정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
        "<div id='tabDetail'></div><div id='tabDetail2'></div>"
    $(".comment").html(tabHtml);


    toReadMode();
    drawCommentLine();
    getFileArr();



    let referArr = new Array();

    for (let i = 0; i < storage.reportDetailData.appLine.length; i++) {
        if (storage.reportDetailData.appLine[i].appType == '4') {
            referArr.push(storage.reportDetailData.appLine[i]);
        }
    }



    let referTarget = $(".selectedRefer");
    let referHtml = "";
    for (let i = 0; i < referArr.length; i++) {
        let id = referArr[i].employee;
        referHtml += "<div class='appendName " + formId + "_refer' data-detail='" + storage.user[id].userNo + "'>" + storage.userRank[storage.user[id].rank][0] + "&nbsp" + storage.user[id].userName + "</div>";

    }

    referTarget.html(referHtml);




    let target = $(".seletedForm")[0];
    let inputsArr = target.getElementsByTagName("input");

    for (let i = 0; i < inputsArr.length; i++) {
        if (inputsArr[i].dataset.detail !== undefined) {
            inputsArr[i].value = inputsArr[i].dataset.detail;
        }
    }

    let textAreaArr = target.getElementsByTagName("textarea")[0];
    textAreaArr.value = textAreaArr.dataset.detail;



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


    storage.oriCbContainer = $("input[name='" + formId + "_RD']:checked").attr("id");
    storage.oriInsertedContent = $(".insertedContent").html();
    storage.oriInsertedDataList = $(".insertedDataList").html();
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
                //setSoppList(formId);
            } else {
                alert("에러");
            }
        },
    });

    setAppLineData();

}



function showList() {
    location.href = "/gw/myrefer";
}

// 탭 누를때마다의 이벤트 주기 
function changeTab(obj) {


    $(obj).css("background-color", "#62a6ad");
    $(obj).css("color", "#fff");
    $(obj).css("border-top-left", "14px");
    if (obj.id == 'lineInfo') {
        $("#changeInfo").css("background-color", "#dddddd");
        $("#changeInfo").css("color", "#5c5c5c");
        $("#changeInfo").css("border-bottom-left-radius", "20px");
        $("#tabDetail2").hide();
        $("#tabDetail").show();
        drawCommentLine();

    } else if (obj.id = 'changeInfo') {
        $("#lineInfo").css("background-color", "#dddddd");
        $("#lineInfo").css("color", "#5c5c5c");
        $("#lineInfo").css("border-bottom-right-radius", "20px");
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



    let revisionData = storage.reportDetailData.revisionHistory;
    let changeData = new Array();

    for (let i = 0; i < revisionData.length; i++) {
        let data = {
            "type": revisionData[i].employee,
            "name": revisionData[i].employee,
            "modifyDate": revisionData[i].date,
            "modCause": revisionData[i].content
        }
        changeData.push(data);
    }


    let detail = "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
    let changeHtml = "";

    if (changeData.length == 0) {
        changeHtml += "<div>변경 이력이 없습니다</div>";
    } else {
        for (let i = 0; i < changeData.length; i++) {
            changeHtml += "<div class='tapLineB changeDataLine'>" +
                "<div class='changeType'>" + changeData[i].type + "</div><div class='changeName' >" + changeData[i].name + "</div><div class='changeDate'>" + changeData[i].modifyDate + "</div><div class='changeCause'>" + changeData[i].modCause + "</div>" +
                "</div>"
        }
    }

    detail += changeHtml;
    target.html(detail);

}



function getFileArr() {
    let target = $(".selectedFileDiv");
    let html = "";
    let originFileList = [];
    let no = storage.reportDetailData.no;
    let fileList = storage.reportDetailData.fileList;
    if (storage.newFileData == undefined) {

        for (let i = 0; i < fileList.length; i++) {
            html += "<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(fileList[i].fileName) + "'>" + fileList[i].fileName + "</a></div>";
        }
        target.html(html);
    } else {
        for (let i = 0; i < storage.newFileData.length; i++) {
            for (let j = 0; j < fileList.length; j++) {
                originFileList.push(fileList[j].fileName);
            }
            if (originFileList.includes(storage.newFileData[i])) {
                html += "<div><a href='/api/attached/docapp/" + no + "/" + encodeURI(storage.newFileData[i]) + "'>" + storage.newFileData[i] + "</a></div>";
            } else {
                html += "<div style='color:navy'>" + storage.newFileData[i] + "</div>";
            }

        }
        target.html(html);
    }


}


function setAppLineData() {
    let appLine = storage.reportDetailData.appLine;
    let formId = storage.reportDetailData.formId;
    let appLineContainer = new Array();
    appLineContainer = [[], [], [], [], []];


    if (appLine[0].approved != null) {
        $("." + formId + "_writer_status").val("승인");
        $("." + formId + "_writer_approved").val(getYmdShortSlash(appLine[0].approved));
    } else if (appLine[0].rejected != null) {
        $("." + formId + "_writer_status").val("회수");
        $("." + formId + "_writer_approved").val(getYmdShortSlash(appLine[0].rejected));

    }

    for (let i = 1; i < appLine.length; i++) {
        for (let j = 0; j < appLineContainer.length; j++) {
            if (appLine[i].appType == j) {
                appLineContainer[j].push(appLine[i]);
            }
        }
    }

    let appTypeTitles = ["_examine", "_agree", "_approval", "_conduct", "_refer"];

    for (let i = 0; i < appLineContainer.length; i++) {
        for (let j = 0; j < appLineContainer[i].length; j++) {
            if (appLineContainer[i][j].approved != null) {
                $("." + formId + appTypeTitles[i] + "_status")[j].value = "승인";
                $("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdShortSlash(appLineContainer[i][j].approved);
            } else if (appLineContainer[i][j].rejected != null) {
                $("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
                $("." + formId + appTypeTitles[i] + "_approved")[j].value = getYmdShortSlash(appLineContainer[i][j].rejected);
            }
        }
    }

}
function getYmdShortSlash(date) {
    let d = new Date(date);
    return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}

function getYmdSlash(date) {
    let d = new Date(date);
    return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) + "&nbsp" + (d.getHours() > 9 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + (d.getMinutes() > 9 ? d.getMinutes().toString() : "0" + d.getMinutes().toString()) + ":" + (d.getSeconds() > 9 ? d.getSeconds().toString() : "0" + d.getSeconds().toString());
}

