function getDetailView() {
    $(".pageContainer").hide();
    $(".listRange").hide();
    $(".batchBtn").hide();

    let checkHref = location.href;
    checkHref = checkHref.split("//");
    checkHref = checkHref[1];
    let splitArr = checkHref.split("/");

    let formId = storage.reportDetailData.formId;
    let testForm = storage.reportDetailData.doc;
    let detailHtml = "";

    if (splitArr[2] == "wait") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button>";
        detailHtml += "<button type='button' name='approvalBtn' onclick='showAppModal()'>결재하기</button>";
        detailHtml += "<button type='button' onclick='showGwModal()'>결재선 수정</button>";
        detailHtml += "<button type='button' onclick='toWriteMode();createConfirmBtn(this)'>문서 수정</button></div>";
    } else if (splitArr[2] == "receive") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button>";
        detailHtml += "<button type='button' name='approvalBtn' onclick='showAppModal()'>결재하기</button></div>";
    } else if (splitArr[2] == "myapp") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button>";
        detailHtml += "<button onclick='cancelApproval()'>결재취소</button></div>"
    } else if (splitArr[2] == "mydraft") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button>";
        detailHtml += "<button type='button' onclick='returnReport()'>회수</button></div>";
    } else if (splitArr[2] == "myreturn") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button>";
        detailHtml += "<button type='button' name='repostBtn' onclick='repostReport()'>기안하기</button></div>";
    } else if (splitArr[2] == "mytemp") {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button type='button' onclick='showList()'>목록보기</button><button type='button' onclick='reWriteTemp()'>이어서 작성</button><button type='button' onclick='deleteTemp()'>삭제하기</button></div>";
    }
    else {
        detailHtml += "<div class='listPageDiv'><div class='mainBtnDiv crudBtns'><button onclick='showList()'>목록보기</button><button class='printBtn' onclick='openPrintTab();' >인쇄하기</button></div>";
    }

    if (splitArr[2] == "mytemp") {
        detailHtml += "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div></div></div>";
    } else {
        detailHtml += "<div class='detailReport'><div class='selectedReportview'><div class='seletedForm'></div><div class='selectedFile'></div></div><div class='comment'></div></div></div>";
    }


    $(".listDiv").html(detailHtml); 
    $(".seletedForm").html(testForm);

    if ( splitArr[2] == "wait" && formId == 'doc_Form_SalesReport') { $($(".mainBtnDiv").children()[3]).hide(); $($(".mainBtnDiv").children()[4]).hide(); }
    if ( splitArr[2] == "mydraft" && formId == 'doc_Form_SalesReport') { $($(".mainBtnDiv").children()[2]).hide(); }
    if ( splitArr[2] == "myapp" && storage.reportDetailData.confirmNo != "null") { $($(".mainBtnDiv").children()[2]).hide(); }

    $(":file").css("display", "none"); // 첨부파일 버튼 숨기기
    let width = ($(window).width() - $(".gw").width() - 30);
    $(".detailReport").css("width", width);
    let tabHtml =
        "<div class='reportInfoTab tabs'>" +
        "<input type='radio' id='tablineInfo' name='tabItem' data-content-id='tabDetail' onclick='tabItemClick(this)' checked>" +
        "<label  class='tabItem' for='tablineInfo'  style='z-index:5; width:50% ; padding-left : 0%;'>문서정보</label>" +
        "<input type='radio' id='tabChangeInfo' name='tabItem' data-content-id='tabDetail2' onclick='tabItemClick(this)' >" +
        "<label  class='tabItem' for='tabChangeInfo' style='z-index:0; width:50% ; padding-left : 50%;' >변경이력</label></div>" +
        "<div class='tabDetail'id='tabDetail'></div><div class='tabDetail2' id='tabDetail2'></div>";
    $(".comment").html(tabHtml);

    let target = $(".seletedForm")[0];
    let inputsArr = target.getElementsByTagName("input");

    for (let i = 0; i < inputsArr.length; i++) {
        if (inputsArr[i].dataset.detail !== undefined) {
            inputsArr[i].value = inputsArr[i].dataset.detail;
        }
    }

    let textAreaArr = target.getElementsByTagName("textarea")[0];
    textAreaArr.value = textAreaArr.dataset.detail;
    if (target.getElementsByTagName("select").length > 0) {
        let selectArr = target.getElementsByTagName("select")[0];
        selectArr.value = selectArr.dataset.detail;
    }



    if (formId == "doc_Form_Consult" && $(".list_comment").attr("data-detail") == "old" || formId == "doc_Form_Resolution" && $(".list_comment").attr("data-detail") == "old") {
        let targetRd;
        let length = formId == "doc_Form_Consult" ? 2 : 4;
        for (let i = 0; i < length; i++) {
            targetRd = $("input[name=" + formId + "_RD]")[i].id;
            if ($("#" + targetRd).attr("checked") == "checked") {
                $("#" + targetRd).attr("data-detail", "on");
                $("#" + targetRd).val("on");
            } else {
                $("#" + targetRd).attr("data-detail", "off");
                $("#" + targetRd).val("off");
            }
        }


    }

    // 상세타입 체크하게 하기
    let rd = $("input[name='" + formId + "_RD']");
    for (let i = 0; i < rd.length; i++) {
        if (rd[i].dataset.detail == "on") {
            $("#" + rd[i].id).prop("checked", true);
        }
    }
    $("input[name='" + formId + "_RD']").prop("disabled", true);

    // 기존 전자 결재 문서 가져온 경우
    if ($(".list_comment")[0].dataset.detail == "old") {
        let rd = $("input[name='" + formId + "_RD']");
        for (let i = 0; i < rd.length; i++) {
            if (rd[i].checked == true) {
                $("#" + rd[i].id).prop("checked", true);
            }
        }

        for (let i = 0; i < 3; i++) { let tt = $(".inputsAuto")[i]; $(tt).css("text-align", "left"); }


    } else {
        // 새문서 작성한 것 가져온 경우 구분
        let rd2 = $("input[name='" + formId + "_RD']");
        for (let i = 0; i < rd2.length; i++) {
            if (rd2[i].dataset.detail == "on") {
                $("#" + rd2[i].id).prop("checked", true);
            }
        }
        for (let i = 0; i < 3; i++) {
            let tt = $(".inputsAuto")[i]; $(tt).css("text-align", "left");
        }




        // 이름 , 직급 한글로 설정하기
        let subTitlesArr = ["_examine", "_approval", "_agree", "_conduct"];
        for (let i = 0; i < subTitlesArr.length; i++) {
            if ($("." + formId + subTitlesArr[i]).val() != undefined) {
                for (let j = 0; j < $("." + formId + subTitlesArr[i]).length; j++) {
                    $("." + formId + subTitlesArr[i])[j].value =
                        storage.user[$("." + formId + subTitlesArr[i])[j].value].userName;
                    $("." + formId + subTitlesArr[i] + "_position")[j].value =
                        storage.userRank[
                        $("." + formId + subTitlesArr[i] + "_position")[j].value
                        ][0];
                }
            }
        }

    }


    toReadMode();
    // 문서 변경내역 확인 하기 위한 storage 
    storage.oriCbContainer = $("input[name='" + formId + "_RD']:checked").attr(
        "id"
    );
    storage.oriTitle = $("#" + formId + "_title").val();
    storage.oriContent = $("#" + formId + "_content").attr("data-detail");
    // storage.oriInsertedContent = $(".insertedContent").html();
    storage.oriInsertedDataList = $(".insertedDataList").html();
    storage.oriInfoData = $(".info").html();
    if ($(".insertedData") != undefined) {
        storage.oriInsertedData = $(".insertedData").html();
    }

    $.ajax({
        url: "/api/project/sopp",
        type: "get",
        dataType: "json",
        success: (result) => {
            if (result.result == "ok") {
                let jsondata;
                jsondata = cipher.decAes(result.data);
                jsondata = JSON.parse(jsondata);
                storage.soppList = jsondata;
            } else {
                alert("에러");
            }
        },
    });


    setAppLineData();

    if (splitArr[2] == "wait") {
        $(".insertbtn").click(setCusDataList);
        $(".insertbtn").click(setProductData);

    }

    $(".cke_editable").remove();
    $("." + formId + "_content").html($("#" + formId + "_content").attr("data-detail"));
    $("#" + formId + "_content").hide();
    $("." + formId + "_content").css("font-size", $("#" + formId + "_content").css("font-size"));
    $("." + formId + "_content").css("padding", "0.3em");

    if (storage.reportDetailData.confirmNo != 'null') {
        $("#" + formId + "_no").val(storage.reportDetailData.confirmNo);
        $("#" + formId + "_no").attr("data-detail", storage.reportDetailData.confirmNo);
        $("#" + formId + "_no").css("text-align", "left");
    }
    let btnDiv = $(".listPageDiv").children()[0];
    $(btnDiv).css("display", "flex");


    if (splitArr[2] != "mytemp") {
        drawCommentLine();
        drawChangeInfo();
        getFileArr();
        $(".tabDetail2").hide();
    }

}



// 문서 정보 그리는 함수 

function drawCommentLine() {
    let idx;
    if (location.href.split("/")[4] == "myreturn") {
        idx = 0;
    } else {
        idx = 1;
    }
    let target = $("#tabDetail");
    let appLine = storage.reportDetailData.appLine;
    let appLineArr = new Array();
    let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"];
    for (let i = idx; i < appLine.length; i++) {
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
            appType: appTypeTitle[appLine[i].appType],
            name: storage.user[appLine[i].employee].userName,
            status: status,
            date: date,
            comment: comment,
        };

        appLineArr.push(data);
    }

    let html = "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled style='display : inline;'/>기안자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled style='display:inline;'/>열람 설정 없음</label></div></div>" +
        "<div><input class='inputFile' multiple='' name='attached[]' type='file' onchange='setSelectedFiles()' style='display: none;'></div></div><div class='readDiv selectedFile'><div>첨부파일</div><div><div class='selectedFileDiv'></div></div></div>";
    let detail =
        "<div class='lineDiv'><div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
    let lineDetailHtml = "";
    for (let i = 0; i < appLineArr.length; i++) {
        lineDetailHtml +=
            "<div class='tapLine examineLine'><div>" +
            appLineArr[i].appType +
            "</div><div>" +
            appLineArr[i].name +
            "</div><div>" +
            appLineArr[i].status +
            "</div><div>" +
            appLineArr[i].date +
            "</div><div>" +
            appLineArr[i].comment +
            "</div></div>";
    }

    lineDetailHtml += "</div>";

    detail += lineDetailHtml;

    detail += html;

    $(".tabLine").children(0).css("padding", "5em");

    target.html(detail);

    // 열람 권한 체크하기
    let readable = storage.reportDetailData.readable;
    if (readable == "dept") {
        $("#deptRd").prop("checked", true);
    } else if (readable == "none") {
        $("#noneRd").prop("checked", true);
    }
}


// 파일 목록 가져오는 함수 
function getFileArr() {
    let target = $(".selectedFileDiv");
    let html = "";
    let originFileList = [];
    let no = storage.reportDetailData.no;
    let fileList = storage.reportDetailData.fileList;
    if (storage.newFileData == undefined) {
        for (let i = 0; i < fileList.length; i++) {
            html +=
                "<div><a href='/api/attached/docapp/" +
                no +
                "/" +
                encodeURI(fileList[i].fileName) +
                "'>" +
                fileList[i].fileName +
                "</a></div>";
        }
        target.html(html);
    } else {
        for (let i = 0; i < storage.newFileData.length; i++) {
            for (let j = 0; j < fileList.length; j++) {
                originFileList.push(fileList[j].fileName);
            }
            if (originFileList.includes(storage.newFileData[i])) {
                html +=
                    "<div><a href='/api/attached/docapp/" +
                    no +
                    "/" +
                    encodeURI(storage.newFileData[i]) +
                    "'>" +
                    storage.newFileData[i] +
                    "</a></div>";
            } else {
                html += "<div style='color:navy'>" + storage.newFileData[i] + "</div>";
            }
        }
        target.html(html);
    }


}


function drawChangeInfo() {
    let target = $("#tabDetail2");

    let revisionData = storage.reportDetailData.revisionHistory;
    let type;
    let appLine = storage.reportDetailData.appLine;
    let changeData = new Array();
    if (revisionData.length > 0) {
        for (let i = 0; i < revisionData.length; i++) {
            let modCause = "";
            if (revisionData[i].content.doc == true) {
                modCause += "문서 수정 ";
            }
            if (revisionData[i].content.files == true) {
                modCause += "첨부 파일 수정 ";
            }
            if (revisionData[i].content.appLine == true) {
                modCause += "결재선 수정 ";
            }

            revisionData[i].content.date;
            revisionData[i].content.content;



            for (let j = 0; j < appLine.length; j++) {
                if (appLine[j].employee == revisionData[i].employee) {
                    type = appLine[j].type;
                }
            }

            if (type == 0) {
                type = "검토"
            } else if (type = 2) {
                type = "결재"
            }
            let data = {
                type: type,
                name: storage.user[revisionData[i].employee].userName,
                modifyDate: getYmdSlash(revisionData[i].date),
                modCause: modCause,
            };
            changeData.push(data);
        }
    }

    let detail =
        "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
    let changeHtml = "";

    if (changeData.length == 0) {
        changeHtml += "<div class='tapLineBCenter'>변경 이력이 없습니다</div>";
    } else {
        for (let i = 0; i < changeData.length; i++) {
            changeHtml +=
                "<div class='tapLineB changeDataLine'>" +
                "<div class='changeType'>" +
                changeData[i].type +
                "</div><div class='changeName' >" +
                changeData[i].name +
                "</div><div class='changeDate'>" +
                changeData[i].modifyDate +
                "</div><div class='changeCause'>" +
                changeData[i].modCause +
                "</div>" +
                "</div>";
        }
    }

    detail += changeHtml;
    target.html(detail);
}


function openPrintTab() {
    window.open("/gw/print/" + storage.reportDetailData.docNo, "인쇄하기", "width=1000,height=800,left=30,top=50");
}




function upClick(obj) {
    let appLine = storage.reportDetailData.appLine;
    let orgEmployee = [];
    let my = storage.my
    for (let i = 0; i < appLine.length; i++) {
        orgEmployee.push(appLine[i].employee);
        if (appLine[i].employee == my) {
            break;
        }
    }

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

    console.log(numArr);

    for (let i = 0; i < numArr.length; i++) {
        if (obj.value == numArr[i] && i != 0) {
            if (orgEmployee.includes(numArr[i - 1] * 1) == false) {
                let temp = numArr[i];
                numArr[i] = numArr[i - 1];
                numArr[i - 1] = temp;
            }

        }
    }



    let selectHtml = "";
    for (let i = 0; i < numArr.length; i++) {
        if (orgEmployee.includes(numArr[i] * 1)) {
            selectHtml +=
                "<div class='lineDataContainer' id='lineContainer_" +
                numArr[i] +
                "'><label id='linedata" +
                numArr[i] +
                "'>" +
                storage.user[numArr[i]].userName +
                "</label></div>";
        } else {
            selectHtml +=
                "<div class='lineDataContainer' id='lineContainer_" +
                numArr[i] +
                "'><label id='linedata" +
                numArr[i] +
                "'>" +
                storage.user[numArr[i]].userName +
                "</label><button value='" +
                numArr[i] +
                "' onclick='upClick(this)'>▲</button><button  value='" +
                numArr[i] +
                "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
        }

    }

    target.html(selectHtml);
} // End of upClick(obj);

function downClick(obj) {
    let appLine = storage.reportDetailData.appLine;
    let orgEmployee = [];
    let my = storage.my
    for (let i = 0; i < appLine.length; i++) {
        orgEmployee.push(appLine[i].employee);
        if (appLine[i].employee == my) {
            break;
        }
    }
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

    let selectHtml = "";
    for (let i = 0; i < numArr.length; i++) {
        if (orgEmployee.includes(numArr[i] * 1)) {
            selectHtml +=
                "<div class='lineDataContainer' id='lineContainer_" +
                numArr[i] +
                "'><label id='linedata" +
                numArr[i] +
                "'>" +
                storage.user[numArr[i]].userName +
                "</label></div>";

        } else {
            selectHtml +=
                "<div class='lineDataContainer' id='lineContainer_" +
                numArr[i] +
                "'><label id='linedata" +
                numArr[i] +
                "'>" +
                storage.user[numArr[i]].userName +
                "</label><button value='" +
                numArr[i] +
                "' onclick='upClick(this)'>▲</button><button  value='" +
                numArr[i] +
                "'onclick='downClick(this)'>▼</button><button onclick='deleteClick(this)'>✕</button></div>";
        }

    }

    target.html(selectHtml);
} // End of downClick(obj)

function deleteClick(obj) {
    let parent;
    parent = obj.parentElement;
    parent.remove();
} // End of deleteClign(obj);


function setAppLineData() {
    let appLine = storage.reportDetailData.appLine;
    let formId = storage.reportDetailData.formId;
    let appLineContainer = new Array();
    appLineContainer = [[], [], [], [], []];

    if (appLine[0].approved != null) {
        $("." + formId + "_writer_status").val("승인");
        $("." + formId + "_writer_approved").val(
            getYmdShortSlash(appLine[0].approved)
        );
    } else if (appLine[0].rejected != null) {
        $("." + formId + "_writer_status").val("회수");
        $("." + formId + "_writer_approved").val(
            getYmdShortSlash(appLine[0].rejected)
        );
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
                $("." + formId + appTypeTitles[i] + "_approved")[j].value =
                    getYmdShortSlash(appLineContainer[i][j].approved);
            } else if (appLineContainer[i][j].rejected != null) {
                $("." + formId + appTypeTitles[i] + "_status")[j].value = "반려";
                $("." + formId + appTypeTitles[i] + "_approved")[j].value =
                    getYmdShortSlash(appLineContainer[i][j].rejected);
            }
        }
    }
}





function createCheckGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc, idName) {
    let gridHtml = "", gridContents, idStr;
    ids = (ids === undefined) ? 0 : ids;
    fnc = (fnc === undefined) ? "" : fnc;
    job = (job === undefined) ? "" : job;

    if (idName === undefined) {
        idStr = "gridContent";
    } else {
        idStr = idName;
    }

    gridHtml = "<div class='gridHeader grid_default_header_item'>";

    for (let i = 0; i < headerDataArray.length; i++) {
        if (headerDataArray[i].align === "center") {
            gridHtml += "<div class='gridHeaderItem grid_default_text_align_center'>" + headerDataArray[i].title + "</div>";
        } else if (headerDataArray[i].align === "left") {
            gridHtml += "<div class='gridHeaderItem grid_default_text_align_left'>" + headerDataArray[i].title + "</div>";
        } else {
            gridHtml += "<div class='gridHeaderItem grid_default_text_align_right'>" + headerDataArray[i].title + "</div>";
        }
    }

    gridHtml += "</div>";

    for (let i = 0; i < dataArray.length; i++) {
        gridHtml += "<div id='" + idStr + "_grid_" + i + "' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='" + ids[i] + "' data-job='" + job[i] + "' >";
        for (let t = 0; t <= dataArray[i].length; t++) {
            if (dataArray[i][t] !== undefined) {
                if (dataArray[i][t].setData === undefined) {
                    gridHtml += "<div class='gridContentItem' onclick='" + fnc + "' style=\"grid-column: span " + dataArray[i][t].col + "; text-align: center;\">데이터가 없습니다.</div>";
                } else if (dataArray[i][t].setData.includes("checkbox")) {
                    gridHtml += "<div class='gridContentItem'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
                } else {
                    gridHtml += "<div class='gridContentItem' onclick='" + fnc + "'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
                }
            }
        }
        gridHtml += "</div>";
    }

    gridContainer.html(gridHtml);

    if (idName === undefined) {
        gridContents = $(".gridContent");
    } else {
        gridContents = $("#" + idName + " .gridContent");
    }

    let tempArray = [];

    for (let i = 0; i < dataArray.length; i++) {
        for (let key in dataArray[i]) {
            tempArray.push(dataArray[i][key]);
        }
    }

    for (let i = 0; i < tempArray.length; i++) {
        for (let t = 0; t < gridContents.length; t++) {
            if (tempArray[i].align === "center") {
                $(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_center");
            } else if (tempArray[i].align === "left") {
                $(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_left");
            } else {
                $(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_right");
            }
        }
    }

}

function drawNewCommentLine() {
    let appTypeTitle = ["검토", "합의", "결재", "수신", "참조"];
    let appLine = storage.reportDetailData.appLine;
    let my = storage.my;
    let originAppLine = [];
    let appLineArr = [];
    let newAppLine = storage.newAppLine;
    let newCombine = [[], [], [], [], []];
    for (let i = 0; i < newAppLine.length; i++) {
        for (let j = 0; j < newCombine.length; j++) {
            if (i > 0 && newAppLine[i][0] == j) {
                newCombine[j].push(newAppLine[i][1]);
            }
        }
    }
    if (newCombine[2].length > 1 && newCombine[2].includes(storage.my + "")) {
        newCombine[2] = newCombine[2].slice(1);
        newCombine[0].push(storage.my + "");
    }
    for (let i = 0; i < appLine.length; i++) {
        if (appLine[i].employee == my) {
            originAppLine = appLine.slice(0, i + 1);
            myIndex = i;
        }
    }
    for (let i = 1; i < originAppLine.length; i++) {
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
        let data;
        if (
            i == myIndex &&
            appLine[i].appType == 2 &&
            newCombine[2][0] != appLine[i].employee
        ) {
            data = {
                appType: appTypeTitle[0],
                name: storage.user[appLine[i].employee].userName,
                status: status,
                date: date,
                comment: comment,
            };
        } else {
            data = {
                appType: appTypeTitle[appLine[i].appType],
                name: storage.user[appLine[i].employee].userName,
                status: status,
                date: date,
                comment: comment,
            };
        }
        appLineArr.push(data);
    }
    let newData = storage.newAppLine;
    for (let i = originAppLine.length; i < newData.length; i++) {
        let data = {
            appType: appTypeTitle[newData[i][0]],
            name: storage.user[newData[i][1]].userName,
            status: "",
            date: "",
            comment: "",
        };
        appLineArr.push(data);
    }
    /// 첨부파일 변경된 내용 그대로 가져와서 html 넣어햐함 
    let files = $(".readDiv")[1].innerHTML;
    files = "<div class='readDiv selectedFile'>" + files + "</div>"
    let html =
        "<div class='readDiv'><div>열람</div><div><label for='deptRd'><input type='radio' id='deptRd' name='rd' value='dept' disabled/>작성자 소속 부서</label><label for='noneRd'><input type='radio' id='noneRd' name='rd' value='none' disabled/>열람 설정 없음</label></div></div>";
    let detail =
        "<div class='lineDiv'><div class='tapLine tapLineTitle'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
    let lineDetailHtml = "";
    for (let i = 0; i < appLineArr.length; i++) {
        lineDetailHtml +=
            "<div class='tapLine examineLine'><div>" +
            appLineArr[i].appType +
            "</div><div>" +
            appLineArr[i].name +
            "</div><div>" +
            appLineArr[i].status +
            "</div><div>" +
            appLineArr[i].date +
            "</div><div>" +
            appLineArr[i].comment +
            "</div></div>";
    }
    lineDetailHtml += "</div>";
    detail += lineDetailHtml;
    html += files;
    // 열람 권한 체크하기
    detail += html
    $("#tabDetail").html(detail);
    let readable = storage.reportDetailData.readable;
    if (readable == "dept") {
        $("#deptRd").prop("checked", true);
    } else if (readable == "none") {
        $("#noneRd").prop("checked", true);
    }
    for (let i = 0; i < $(".dateBorder").length; i++) {
        let tt = $(".dateBorder")[i].children;
        $(tt).css("background-color", "transparent");
    }
}
//  변경이력 그리는 함수 ajax로 변경 이력 받아옴
function drawChangeInfo() {
    let target = $("#tabDetail2");
    let revisionData = storage.reportDetailData.revisionHistory;
    let type;
    let appLine = storage.reportDetailData.appLine;
    let changeData = new Array();
    if (revisionData.length > 0) {
        for (let i = 0; i < revisionData.length; i++) {
            let modCause = "";
            if (revisionData[i].content.doc == true) {
                modCause += "문서 수정 ";
            }
            if (revisionData[i].content.files == true) {
                modCause += "첨부 파일 수정 ";
            }
            if (revisionData[i].content.appLine == true) {
                modCause += "결재선 수정 ";
            }
            revisionData[i].content.date;
            revisionData[i].content.content;
            for (let j = 0; j < appLine.length; j++) {
                if (appLine[j].employee == revisionData[i].employee) {
                    type = appLine[j].type;
                }
            }
            if (type == 0) {
                type = "검토"
            } else if (type = 2) {
                type = "결재"
            }
            let data = {
                type: type,
                name: storage.user[revisionData[i].employee].userName,
                modifyDate: getYmdSlash(revisionData[i].date),
                modCause: modCause,
            };
            changeData.push(data);
        }
    }
    let detail =
        "<div class='tapLineB'><div>타입</div><div>이름</div><div>변경일자</div><div>변경내용</div></div>";
    let changeHtml = "";
    if (changeData.length == 0) {
        changeHtml += "<div class='tapLineBCenter'>변경 이력이 없습니다</div>";
    } else {
        for (let i = 0; i < changeData.length; i++) {
            changeHtml +=
                "<div class='tapLineB changeDataLine'>" +
                "<div class='changeType'>" +
                changeData[i].type +
                "</div><div class='changeName' >" +
                changeData[i].name +
                "</div><div class='changeDate'>" +
                changeData[i].modifyDate +
                "</div><div class='changeCause'>" +
                changeData[i].modCause +
                "</div>" +
                "</div>";
        }
    }
    detail += changeHtml;
    target.html(detail);
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
        (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString()) +
        "&nbsp" +
        (d.getHours() > 9
            ? d.getHours().toString()
            : "0" + d.getHours().toString()) +
        ":" +
        (d.getMinutes() > 9
            ? d.getMinutes().toString()
            : "0" + d.getMinutes().toString()) +
        ":" +
        (d.getSeconds() > 9
            ? d.getSeconds().toString()
            : "0" + d.getSeconds().toString())
    );
}

function getYmdSlashShort(date) {
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



function getYmdShortSlash(date) {
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



function toReadMode() {
    $(".list_comment").attr("data-tag", "readTag");
    $(".detailDiv").removeClass("detailDivHide");
    $(".detailcontentDiv").addClass("detailcontentHide");
    $(".datailTitlebox").hide();
    $(".detailcontentbox").hide();
    $(".inputs").attr("readonly", true);
    $(".inputsAuto").attr("readonly", true);
    $(".datailTitlebox").hide();
    $(".insertbtn").hide();
    $(".deletebtn").hide();
    if (storage.reportDetailData.formId == "doc_Form_Consult") {
        $("#TRS").prop("disabled", true);
        $("#BUY").prop("disabled", true);

    }

}

function toWriteMode() {
    $(".list_comment").attr("data-tag", "writeTag");
    $(".detailDiv").addClass("detailDivHide");
    $(".detailcontentDiv").removeClass("detailcontentHide");
    $(".datailTitlebox").show();
    $(".detailcontentbox").show();
    $(".inputs").attr("readonly", false);
    $(".insertbtn").show();
    $(".deletebtn").show();

    if (storage.reportDetailData.formId == "doc_Form_Consult") {
        $("#TRS").prop("disabled", false);
        $("#BUY").prop("disabled", false);
    }

}

function insertData(reportForm) { // let reportForm = "Consult"; 
    let target = $(".insertedDataList");
    let dataNoneForm = "<div class='detailcontentDiv'>";
    let title = [
        "date",
        "customer",
        "product",
        "price",
        "quantity",
        "amount",
        "tax",
        "total",
        "remark",
    ];

    for (let i = 0; i < title.length; i++) {
        if (i < title.length - 1) {
            if (i == 0) {
                dataNoneForm +=
                    "<input onchange='this.dataset.detail=this.value;' type='date' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
                    reportForm +
                    "_" +
                    title[i] +
                    "'/>";
            } else if (i == 3 || i == 4 || i == 5 || i == 6 || i == 7) {
                dataNoneForm +=
                    "<input type='text' oninput='setNum(this)'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
                    reportForm +
                    "_" +
                    title[i] +
                    "'/>";
            } else {
                dataNoneForm +=
                    "<input type='text' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
                    reportForm +
                    "_" +
                    title[i] +
                    "'/>";
            }
        } else
            dataNoneForm +=
                "<input type='text' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs  doc_Form_" +
                reportForm +
                "_" +
                title[i] +
                "'/>";
    }


    dataNoneForm +=
        "<div  class ='detailcontentbox'><input type='checkbox' class='detailBox'/></div></div>";
    target.append(dataNoneForm);


}


window.onresize = function () {
    let width = $(window).width() - $(".gw").width() - 30;
        $(".detailReport").css("width", width);
}



