$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);
    defaultMyDraft();
});



function defaultMyDraft() {

    $.ajax({
        "url": apiServer + "/api/gw/form",
        "method": "get",
        "dataType": "json",
        "cache": false,
        success: (data) => {
            let list;
            if (data.result === "ok") {
                list = cipher.decAes(data.data);
                list = JSON.parse(list);
                storage.formList = list;
                console.log("[getForms] Success getting employee information.");
            } else {
                // msg.set("양식 정보를 가져오지 못했습니다.");
            }
        }
    })

    let url, method, data, type;
    url = "/api/gw/app/mydraft";
    method = "get"
    data = "";
    type = "list";
    crud.defaultAjax(url, method, data, type, successList, errorList);

}


function successList(result) {
    storage.myDraftList = result;
    window.setTimeout(drawMyDraft, 200);
}

function errorList() {
    alert("에러");
}


function drawMyDraft() {
    let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

    if (storage.myDraftList === undefined) {
        msg.set("등록된 공지사항이 없습니다");
    }
    else {
        jsonData = storage.myDraftList;
    }

    result = paging(jsonData.length, storage.currentPage, 10);

    pageContainer = document.getElementsByClassName("pageContainer");
    container = $(".listDiv");

    header = [

        {
            "title": "번호",
            "align": "center",
        },
        {
            "title": "문서양식",
            "align": "center",
        },
        {
            "title": "제목",
            "align": "center",
        },
        {
            "title": "현재 결재 순서 타입",
            "align": "center",
        },
        {
            "title": "현재 결재권자",
            "align": "center",
        },
        {
            "title": "결재권자 조회",
            "align": "center",
        },

    ];

    for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
        disDate = dateDis(jsonData[i].created, jsonData[i].modified);
        setDate = dateFnc(disDate);
        let read = jsonData[i].read;

        if (read == null) {
            read = "N";
        } else {
            read = setDate
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

        let authority = storage.user[jsonData[i].authority].userName;
        str = [

            {
                "setData": jsonData[i].no,
            },
            {
                "setData": jsonData[i].form,
            },
            {
                "setData": jsonData[i].title,
            },
            {
                "setData": appType,
            },
            {
                "setData": authority,
            },
            {
                "setData": read,
            },

        ]

        fnc = "detailView(this)";
        ids.push(jsonData[i].no);
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