$(document).ready(() => {
    init();

    setTimeout(() => {
        $("#loadingDiv").hide();
        $("#loadingDiv").loading("toggle");
    }, 300);

    receiveDefault()

});
   


function receiveDefault() {
    $(".modal-wrap").hide();
    $(".batchBtn").hide();
    $("#gwSubTabTitle").html("결재 수신 문서");

let url, method, data, type;
url = "/api/notice";
method = "get"
data = "";
type = "list";
crud.defaultAjax(url, method, data, type, successList, errorList);
let url2 = "/api/gw/form";

$.ajax({
    url: url2,
    type: "get",
    dataType: "json",
    success: (result) => {
        if (result.result == "ok") {
            let jsondata;
            jsondata = cipher.decAes(result.data);
            jsondata = JSON.parse(jsondata);
            storage.formList = jsondata;

        } else {
            alert("에러");
        }
    },
});

$(".searchContainer").show();
$(".listPageDiv").show();

}



function successList(result) {
storage.noticeList = result;
window.setTimeout(drawApproval, 200);
}

function errorList() {
alert("에러");
}

function detailView(event) {// 선택한 그리드의 글 번호 받아오기 

$(".searchContainer").hide();
let target = $(".container");
let no = event.dataset.id;

// 전자결재 문서 번호를 가지고 상세 조회 그림  

target.html();
getDetailView(no);

} // End of noticeDetailView(); 



///글 제목 눌렀을때 상세 조회하는 페이지 그리기 
function getDetailView(no) {

let testForm = storage.formList[0].form;
let detailHtml = "<div class='mainBtnDiv'></div>" +
    "<div class='detailReport'><div class='selectedReportview'></div><div class='comment'></div></div>"


$(".listPageDiv").html(detailHtml);



let selectedFileView = "<div class='selectedFileField'><label>첨부파일<input type='file'/></label><div></div></div>"
testForm += selectedFileView;


$(".selectedReportview").html(testForm);
$(":file").css("display", "none");// 첨부파일 버튼 숨기기 

let tabHtml = "<div class='reportInfoTab'>" +
    "<label id='lineInfo' onclick='changeTab(this)'>결재정보</label><label id='changeInfo' onclick='changeTab(this)'>변경이력</label></div>" +
    "<div class='tabDetail'></div>"
$(".comment").html(tabHtml);
toReadMode();
drawCommentLine();

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
    drawCommentLine();

} else if (obj.id = 'changeInfo') {
    $("#lineInfo").css("background-color", "white");
    $("#lineInfo").css("color", "#332E85");
    $("#lineInfo").css("border-bottom", "2px solid #332E85");
    drawChangeInfo();

}
}



// 결재정보 그리는 함수 
function drawCommentLine() {

let target = $(".tabDetail");

// 임시 데이터 ----------------------------------------------------
let examine = [{
    "name": "구민주",
    "status": "",
    "approved": "",
    "comment": ""
}, {
    "name": "이송현",
    "status": "",
    "approved": "",
    "comment": ""
}
]

let approval = [{
    "name": "이승우",
    "status": "",
    "approved": "",
    "comment": ""
}]

// 임시 데이터 ---------------------------------------------------- 


let detail = "<div class='tapLine'><div>타입</div><div>이름</div><div>상태</div><div>일자</div><div>의견</div></div>";
let lineDetailHtml = "";
let approvalDetailHtml = "";


for (let i = 0; i < examine.length; i++) {
    lineDetailHtml += "<div class='tapLine examineLine'><div>검토</div><div class='examine_name'>" + examine[i].name + "</div><div class='examine_status>" + examine[i].status + "</div><div class='examine_approved'>" + examine[i].approved + "</div><div class='examine_comment'>" + examine[i].comment + "</div></div>";
}
for (let i = 0; i < approval.length; i++) {
    approvalDetailHtml += "<div class='tapLine approvalLine'><div>결재</div><div class='approval_name'>" + approval[i].name + "</div><div class='approval_status'>" + approval[i].status + "</div><div class='approval_approved'>" + approval[i].approved + "</div><div class='approval_comment'>" + approval[i].comment + "</div></div>";
}

lineDetailHtml += approvalDetailHtml;
detail += lineDetailHtml;
target.html(detail);

}


//  변경이력 그리는 함수 
function drawChangeInfo() {
let target = $(".tabDetail");
// 임시 데이터 ----------------------------------------------------


let changeData = [{
    "type": "검토",
    "name": "구민주",
    "modifyDate": "22-08-18",
    "modCause": " 거래처 수정 "
},
{
    "type": "검토",
    "name": "이송현",
    "modifyDate": "22-08-19",
    "modCause": "수량 수정 했습니다 테스트로 수정 했습니다  "
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


function drawApproval() {
	let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc;

if (storage.noticeList === undefined) {
    msg.set("등록된 공지사항이 없습니다");
}
else {
    jsonData = storage.noticeList;
}

result = paging(jsonData.length, storage.currentPage, 5);

pageContainer = document.getElementsByClassName("pageContainer");
container = $(".listDiv");

header = [

    {
        "title": "문서번호",
        "align": "center",
    },
    {
        "title": "문서종류",
        "align": "center",
    },
    {
        "title": "거래처",
        "align": "center",
    },
    {
        "title": "제목",
        "align": "center",
    },
    {
        "title": "금액",
        "align": "center",
    },
    {
        "title": "기안자",
        "align": "center",
    },
    {
        "title": "진행상태",
        "align": "center",
    },

];

for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
    disDate = dateDis(jsonData[i].created, jsonData[i].modified);
    setDate = dateFnc(disDate);
    let userName = storage.user[jsonData[i].writer].userName;

    str = [

        {
            "setData": jsonData[i].title,
        },
        {
            "setData": userName,
        },
        {
            "setData": setDate,
        },
        {
            "setData": setDate,
        },
        {
            "setData": setDate,
        },
        {
            "setData": setDate,
        },
        {
            "setData": setDate,
        },

    ]

    fnc = "detailView(this)";
    ids.push(jsonData[i].no);
    data.push(str);
}

let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawApproval", result[0]);
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
}// End of drawNoticeApproval()




function createConfirmBtn(obj) {
let div = document.getElementsByClassName("mainBtnDiv")
if (div[0].childElementCount < 4) {
    $(".mainBtnDiv").append("<button type='button'name='modConfirm' onclick='showModifyModal()' >수정완료 </button>");
}

}



function showPreAppModal() {
let setPreAppModalHtml = "<div class='setPreApprovalModal'>" +
    "<div class='modal-title'>선결재하기</div>" +
    "<div class='modal-body'><div class='labelContainer'>" +
    "<label><input type='radio' name='type' value ='approve'/>승인</label>" +
    "<label><input type='radio' name='type' value='reject'/>반려</label>" +
    "<label><input type='radio' name='type' value='consult'/>협의요청</label>" +
    "<label><input type='radio' name='type' value='defer'/>보류</label>" +
    "<label><input type='radio' name='type' value='pre'/>선결</label>" +
    "<label><input type='radio' name='type'value='next' />후결</label></div>" +
    "<label class>의견 <input class='preAppComment' type='text'/></label></div>" +
    "<div class='close-wrap'>" +
    "<button id='quit' onclick='closeModal(this)'>취소</button>" +
    "<button id='set' onclick='closeModal(this)'>결재</button></div></div>";
$(".modal-wrap").html(setPreAppModalHtml);
$("input:radio[name='type']").prop("checked", false);
$(".modal-wrap").show();

}


function closeModal(obj) {

let examine = [{
    "name": "구민주",
    "status": "",
    "approved": "",
    "comment": ""
}, {
    "name": "이송현",
    "status": "",
    "approved": "",
    "comment": ""
}
]

let approval = [{
    "name": "이승우",
    "status": "",
    "approved": "",
    "comment": ""
}]

if (obj.id == 'quit') {
    $(".modal-wrap").hide();
    // 체크된 것 초기화 
    $("input:radio[name='type']").prop("checked", false);
} else if (obj.id == 'set') {
    // let my = storage.my;
    // let name = storage.user[my].userName;
    // console.log(examine[0].name == name);
    // for (let i = 0; i < examine.length; i++) {
    //     if (examine[i].name == name) {
    //         $(".examine_status:eq(" + i + ")").html($("input:radio[name='type']").val());
    //         $(".examine_approved:eq(" + i + ")").html(getYmdSlash())
    //         $(".examine_comment:eq(" + i + ")").html($(".preAppComment").val());
    //     }
    // }

    $(".modal-wrap").hide();
    //if (storage.user[my].userName)
}
}





function getYmdSlash() {
let d = new Date();
return (d.getFullYear() % 100) + "/" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "/" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}