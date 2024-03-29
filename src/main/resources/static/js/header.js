let cipher,
  msg,
  apiServer,
  modal,
  storage,
  prepare,
  fileDataArray = [],
  removeDataArray = [],
  updateDataArray = [],
  editor,
  resolveFlag = true;
const CommonDatas = new Common();
storage = {};

let promiseInit = function init() {
  return new Promise((resolve, reject) => {
    let nextStep;

    cipher.aes.iv = localStorage.getItem("aesIv");
    cipher.aes.key = localStorage.getItem("aesKey");
    cipher.rsa.public.modulus = localStorage.getItem("rsaModulus");
    cipher.rsa.public.exponent = localStorage.getItem("rsaExponent");

    // setTimeout(() => {
    // 	$("#loadingDiv").loading({
    // 		onStart: function (loading) {
    // 			loading.overlay.fadeIn(1000);
    // 		},
    // 		onStop: function (loading) {
    // 			loading.overlay.fadeOut(1000);
    // 		}
    // 	});
    // }, 70);

    msg.cnt = document.getElementsByClassName("msg_cnt")[0];

    $(document).click((e) => {
      if (modal.wrap == e.target) {
        modal.hide();
      } else if (modal.noteWrap == e.target) {
        modal.noteHide();
      }
    });

    window.onpageshow = function (event) {
      if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        if (localStorage.getItem("loadSetPage") != null) {
          location.href = localStorage.getItem("loadSetPage");
          localStorage.removeItem("loadSetPage");
        }
      }
    };

    // if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined) {
    // 	window.setTimeout(addNoteContainer, 1500);
    // } else {
    // 	window.setTimeout(addNoteContainer, 200);
    // }

    nextStep = function () {
      if (isInit()) prepare();
      else window.setTimeout(nextStep, 50);
    };

    if (prepare !== undefined) window.setTimeout(nextStep, 50);

    // getCustomer();
    getCommonCode();
    getUserMap();
    getDeptMap();
    setDeptTree();
    // getBasicInfo();
    getUserRank();
    getStorageList();
    getPersonalize();
    noteLiveUpdate();
    CommonDatas.setTopPathActive();

    setTimeout(() => {
      CommonDatas.setSidePanalScript();
      CommonDatas.setSidePathActive();
      CommonDatas.pageAuthSet();
      CommonDatas.sideMenuAuthSet();
      resolve();
    }, 300);
  });
}; // End of init();

apiServer = "";

cipher = {
  // 암호화 모듈
  encRsa: (message) => {
    let result, rsa;
    if (message === undefined || message === null) return message;
    rsa = new RSAKey();
    rsa.setPublic(cipher.rsa.public.modulus, cipher.rsa.public.exponent);
    return btoa(rsa.encrypt(message));
  },
  encAes: (message) => {
    let cp, result;
    cp = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
      iv: CryptoJS.enc.Utf8.parse(cipher.aes.iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    result = cp.toString();
    return result;
  },
  decAes: (message) => {
    let cp, result;
    cp = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
      iv: CryptoJS.enc.Utf8.parse(cipher.aes.iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    result = cp.toString(CryptoJS.enc.Utf8);
    return result;
  },
  rsa: {
    public: {
      modulus: undefined,
      exponent: undefined,
    },
    private: undefined,
    getKey: () => {
      let url = apiServer + "/api/user/rsa";
      $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        cache: false,
        success: (data) => {
          let publicKeyExponent,
            publicKeyModulus,
            aesKey,
            aesIv,
            url = apiServer + "/api/user/aes";
          if (data.result === "ok") {
            aesKey = [cipher.genKey(8), cipher.genKey(8), cipher.genKey(8), cipher.genKey(8)];
            aesIv = [cipher.genKey(8), cipher.genKey(8)];
            cipher.aes.key = aesKey[0] + aesKey[1] + aesKey[2] + aesKey[3];
            cipher.aes.iv = aesIv[0] + aesIv[1];
            publicKeyExponent = data.data.publicKeyExponent;
            publicKeyModulus = data.data.publicKeyModulus;
            cipher.rsa.public.modulus = publicKeyModulus;
            cipher.rsa.public.exponent = publicKeyExponent;
            sessionStorage.setItem("rsaModulus", publicKeyModulus);
            sessionStorage.setItem("rsaExponent", publicKeyExponent);
            sessionStorage.setItem("aesKey", cipher.aes.key);
            sessionStorage.setItem("aesIv", cipher.aes.iv);
            $.ajax({
              url: url,
              method: "post",
              data:
                cipher.encRsa(aesKey[0]) +
                "\n" +
                cipher.encRsa(aesKey[1]) +
                "\n" +
                cipher.encRsa(aesKey[2]) +
                "\n" +
                cipher.encRsa(aesKey[3]) +
                "\n" +
                cipher.encRsa(aesIv[0]) +
                "\n" +
                cipher.encRsa(aesIv[1]),
              contentType: "text/plain",
              cache: false,
              success: (data) => {},
            });
          } else {
            msg.set(data.msg);
          }
        },
      });
    },
  },
  aes: {
    iv: undefined,
    key: undefined,
  },
  genKey: (length) => {
    let x,
      t,
      result = "",
      src = [];
    if (isNaN(length) || length < 8) length = 32;
    for (x = 0; x < 69; x++) {
      if (x < 10) src[x] = x + 48;
      else if (x < 36) src[x] = x + 55;
      else if (x < 62) src[x] = x + 61;
      else if (x == 63) src[x] = 33;
      else if (x == 64) src[x] = 43;
      else if (x == 65) src[x] = 126;
      else src[x] = x - 31;
    }
    for (x = 0; x < length; x++) {
      t = Math.floor(Math.random() * src.length);
      result += String.fromCharCode(src[t]);
    }
    return result;
  }, // End of getKey()
};

msg = {
  // 메시징 유닛
  cnt: undefined,
  handler: undefined,
  time: 10,
  fadeout: 300,
  set: (message, time) => {
    let handler, html;
    const el = document.createElement("div");
    if (msg.cnt === undefined || msg.cnt === null) return;
    if (message === undefined) return;
    if (time === undefined) time = msg.time;
    handler = window.setTimeout(() => {
      $(el).fadeOut(msg.fadeout);
    }, time * 1000);
    html =
      '<div class="each_msg"><div data-handler="' +
      handler +
      '" onclick="msg.clr(this)" class="cls_btn">&#x2715;</div><div class="msg_content">' +
      message +
      "</div></div>";
    el.innerHTML = html;
    msg.cnt.appendChild(el);
  },
  clr: (el) => {
    let handler;
    handler = el.dataset.handler * 1;
    window.clearTimeout(handler);
    $(el.parentElement).fadeOut(msg.fadeout);
  },
};

//모달
modal = {
  container: document.getElementsByClassName("modalContainer")[0],
  content: document.getElementsByClassName("modalContainer")[0].getElementsByClassName("modal")[0],
  wrap: document.getElementsByClassName("modalContainer")[0].getElementsByClassName("modalWrap")[0],
  head: document.getElementsByClassName("modalContainer")[0].querySelector(".modalWrap .modalHead"),
  headTitle: document
    .getElementsByClassName("modalContainer")[0]
    .querySelector(".modalWrap .modalHead .modalHeadTitle"),
  body: document.getElementsByClassName("modalContainer")[0].querySelector(".modalWrap .modalBody"),
  foot: document.getElementsByClassName("modalContainer")[0].querySelector(".modalWrap .modalFoot"),
  footBtns: document
    .getElementsByClassName("modalContainer")[0]
    .querySelector(".modalWrap .modalFoot .modalBtns"),
  confirm: document
    .getElementsByClassName("modalContainer")[0]
    .querySelector(".modalWrap .modalFoot .confirm"),
  close: document
    .getElementsByClassName("modalContainer")[0]
    .querySelector(".modalWrap .modalFoot .close"),
  noteContainer: document.getElementsByClassName("noteContainer")[0],
  noteContent: document
    .getElementsByClassName("noteContainer")[0]
    .getElementsByClassName("note")[0],
  noteWrap: document
    .getElementsByClassName("noteContainer")[0]
    .getElementsByClassName("noteWrap")[0],
  noteHead: document
    .getElementsByClassName("noteContainer")[0]
    .querySelector(".noteWrap .noteHead"),
  noteHeadTitle: document
    .getElementsByClassName("noteContainer")[0]
    .getElementsByClassName("noteWrap")[0]
    .querySelector(".noteHead .noteHeadTitle"),
  noteBody: document
    .getElementsByClassName("noteContainer")[0]
    .querySelector(".noteWrap .noteBody"),
  xClose: () => {
    modal.hide();
  },
  alert: (title, content) => {
    modal.show();
    modal.content.style.width = "40vw";
    modal.headTitle.innerText = title;
    modal.body.innerHTML = content;
    modal.confirm.style.display = "none";
    modal.close.innerText = "확인";
    modal.close.style.width = "100vw";
  },
  show: () => {
    modal.clear();
    modal.wrap.style.display = "flex";
  },
  hide: () => {
    modal.wrap.style.display = "none";
    window.setTimeout(modal.clear, 500);
    // if (document.querySelector(".updateBtn").dataset.hideflag) {
    // 	ckeditor.config.readOnly = false;
    // } else {
    // 	ckeditor.config.readOnly = true;
    // }
  },
  clear: () => {
    modal.headTitle.innerText = "";
    modal.body.innerHTML = "";
    modal.confirm.style.display = "";
    modal.close.style.display = "";
    modal.confirm.innerText = "확인";
    modal.close.innerText = "닫기";
  },

  noteXClose: () => {
    modal.noteHide();
  },
  noteShow: () => {
    modal.noteClear();
    modal.noteWrap.style.display = "flex";
  },
  noteHide: () => {
    modal.noteWrap.style.display = "none";
    window.setTimeout(modal.noteClear, 500);
  },
  noteClear: () => {
    modal.noteHeadTitle.innerText = "";
    modal.noteBody.innerHTML = "";
  },
};

(dragAndDrop = {
  fileDragEnter: (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleClass("dragenter");
  },

  fileDragLeave: (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleClass("dragleave");
  },

  fileDragOver: (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleClass("dragover");
  },

  fileDrop: (e) => {
    e.preventDefault();
    let files = e.dataTransfer && e.dataTransfer.files;

    toggleClass("drop");
    showFile(files);
    selectFile(files);
  },
}),
  (crud = {
    defaultAjax: (url, method, data, type, successFnc, errorFnc) => {
      $.ajax({
        url: url,
        method: method,
        data: data,
        dataType: "json",
        contentType: "text/plain",
        success: (result) => {
          if (result.result === "ok") {
            if (result.data !== "null") {
              if (successFnc !== undefined) {
                let jsonData;

                if (type === "list") {
                  jsonData = cipher.decAes(result.data);
                  jsonData = JSON.parse(jsonData);
                  successFnc(jsonData);
                } else if (type === "detail") {
                  jsonData = cipher.decAes(result.data);
                  jsonData = JSON.parse(jsonData);
                  successFnc(jsonData);
                } else {
                  successFnc();
                }
              }
            } else {
              successFnc("");
            }
          }
        },
        error: () => {
          if (errorFnc !== undefined) {
            errorFnc();
          }
        },
      });
    },
  }),
  (ckeditor = {
    config: {
      height: "30vh",
      readOnly: true,
      language: "ko",
      enterMode: CKEDITOR.ENTER_BR,
      toolbarGroups: [
        { name: "document", groups: ["mode", "document", "doctools"] },
        { name: "clipboard", groups: ["clipboard", "undo"] },
        { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
        { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
        { name: "styles", groups: ["styles"] },
        { name: "colors", groups: ["colors"] },
        { name: "paragraph", groups: ["list", "align", "indent", "blocks", "bidi", "paragraph"] },
        { name: "insert", groups: ["insert"] },
        { name: "forms", groups: ["forms"] },
        "/",
        { name: "links", groups: ["links"] },
        "/",
        { name: "tools", groups: ["tools"] },
        { name: "others", groups: ["others"] },
        { name: "about", groups: ["about"] },
      ],
      removeButtons:
        "Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form",
      extraPlugins: "pastebase64, base64image",
    },
  });

// 위젯 관련 세팅 및 기본설정
storage.widget = {};
storage.widget.chart = [
  {
    size: [2, 2],
    title: "연간 계획대비 실적",
    info: false,
  },
  {
    size: [1, 2],
    title: "월간 유지보수 실적",
    info: false,
  },
  {
    size: [1, 2],
    title: "월간 계획대비 실적",
    info: true,
  },
  {
    size: [1, 2],
    title: "누적 계획대비 실적",
    info: true,
  },
  {
    size: [1, 2],
    title: "누적 카테고리 실적",
    info: false,
  },
];
storage.widget.schedule = [
  {
    size: [3, 2],
    title: "일정",
  },
  {
    size: [4, 1],
    type: "calendar/weekly",
  },
  {
    size: [4, 2],
    type: "calendar/monthly",
  },
  {
    size: [2, 1],
    type: "calendar/yearly",
  },
  {
    size: [2, 1],
    type: "calendar/daily",
  },
];
storage.widget.docApp = [
  {
    size: [4, 1],
    type: "tile",
    content: "wait",
  },
  {
    size: [2, 1],
    type: "list",
    content: "wait",
  },
  {
    size: [4, 1],
    type: "tile",
    content: "mydraft",
  },
  {
    size: [2, 1],
    type: "list",
    content: "due",
  },
];
storage.widget.notice = [
  {
    size: [3, 2],
    title: "공지사항",
  },
];
storage.widget.sopp = [
  {
    size: [6, 2],
    title: "영업기회",
  },
];

storage.widget.contract = [
  {
    size: [6, 2],
    title: "계약",
  },
];
storage.widget.set = [
  "chart/0",
  "chart/1",
  "chart/2",
  "chart/3",
  "chart/4",
  "notice/0",
  "schedule/0",
  "sopp/0",
  "contract/0",
];
storage.personalize = {};

// 개인화 설정 저장 함수
function setPersonalize() {
  let str, url;

  str = JSON.stringify(storage.personalize);
  sessionStorage.setItem("personalizeTime", new Date().getTime());
  sessionStorage.setItem("personalizeData", str);
  url = apiServer + "/api/user/personalize";

  $.ajax({
    url: url,
    method: "post",
    data: str,
    contentType: "text/plain",
    cache: false,
    success: (data) => {
      console.log("serPersonalize : " + data.result);
    },
  });
} // End of setPersonalize()

// 개인화 설정 가져오기 함수
function getPersonalize() {
  let str, t, c, url;

  t = sessionStorage.getItem("personalizeTime");
  t = t !== null ? t * 1 : null;
  c = new Date().getTime() - 180000;
  url = apiServer + "/api/user/personalize";
  if (t === null || t < c) {
    // 서버에서 가져오기
    $.ajax({
      url: url,
      method: "get",
      contentType: "text/plain",
      cache: false,
      success: (data) => {
        let str;
        if (data.result === "ok") {
          str = data.data;
          storage.personalize = JSON.parse(str);
          sessionStorage.setItem("personalizeTime", new Date().getTime());
          sessionStorage.setItem("personalizeData", str);
        }
      },
    });
  } else {
    // 재활용하기
    str = sessionStorage.getItem("personalizeData");
    storage.personalize = JSON.parse(str);
  }
} // End of getPersonalize()

// 기초 데이터가 세팅되어 있는지 확인하는 함수
function isInit() {
  if (cipher.aes.key === undefined) return false;
  if (cipher.aes.iv === undefined) return false;
  if (storage.code === undefined) return false;
  if (storage.company === undefined) return false;
  if (storage.customer === undefined) return false;
  if (storage.sopp === undefined) return false;
  if (storage.cont === undefined) return false;
  if (storage.product === undefined) return false;
  if (storage.cip === undefined) return false;
  if (storage.dept === undefined) return false;
  if (storage.user === undefined) return false;
  if (storage.userRank === undefined) return false;
  if (storage.my === undefined) return false;
  if (storage.personalize === undefined) return false;
  return true;
} // End of isInit()()

//기본 그리드
function createGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc, idName) {
  let gridHtml = "",
    gridContents,
    idStr;
  ids = ids === undefined ? 0 : ids;
  fnc = fnc === undefined ? "" : fnc;
  job = job === undefined ? "" : job;

  if (idName === undefined) {
    idStr = "gridContent";
  } else {
    idStr = idName;
  }

  gridHtml = "<div class='gridHeader grid_default_header_item'>";

  for (let i = 0; i < headerDataArray.length; i++) {
    if (headerDataArray[i].align === "center") {
      gridHtml +=
        "<div class='gridHeaderItem grid_default_text_align_center'>" +
        headerDataArray[i].title +
        "</div>";
    } else if (headerDataArray[i].align === "left") {
      gridHtml +=
        "<div class='gridHeaderItem grid_default_text_align_left'>" +
        headerDataArray[i].title +
        "</div>";
    } else {
      gridHtml +=
        "<div class='gridHeaderItem grid_default_text_align_right'>" +
        headerDataArray[i].title +
        "</div>";
    }
  }

  gridHtml += "</div>";

  for (let i = 0; i < dataArray.length; i++) {
    gridHtml +=
      "<div id='" +
      idStr +
      "_grid_" +
      i +
      "' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='" +
      ids[i] +
      "' data-job='" +
      job[i] +
      "' onclick='" +
      fnc +
      "'>";
    for (let t = 0; t <= dataArray[i].length; t++) {
      if (dataArray[i][t] !== undefined) {
        if (dataArray[i][t].setData === undefined) {
          gridHtml +=
            "<div class='gridContentItem' style=\"grid-column: span " +
            dataArray[i][t].col +
            '; text-align: center;">데이터가 없습니다.</div>';
        } else {
          gridHtml +=
            "<div class='gridContentItem' onclick=\"" +
            dataArray[i][t].onclick +
            '"><span class="textNumberFormat">' +
            dataArray[i][t].setData +
            "</span></div>";
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
        $(gridContents[t])
          .find(".gridContentItem")
          .eq(i)
          .attr("class", "gridContentItem grid_default_text_align_center");
      } else if (tempArray[i].align === "left") {
        $(gridContents[t])
          .find(".gridContentItem")
          .eq(i)
          .attr("class", "gridContentItem grid_default_text_align_left");
      } else {
        $(gridContents[t])
          .find(".gridContentItem")
          .eq(i)
          .attr("class", "gridContentItem grid_default_text_align_right");
      }
    }
  }
}

//날짜 포맷
function dateFnc(dateTimeStr, type) {
  let result, year, month, day, hh, mm, ss, date, nowDate, calTime, calTimeHour, calTimeDay;
  nowDate = new Date();
  date = new Date(dateTimeStr * 1);
  calTime = Math.floor((nowDate.getTime() - date.getTime()) / 1000 / 60);
  calTimeHour = Math.floor(calTime / 60);
  calTimeDay = Math.floor(calTime / 60 / 24);
  year = date.getFullYear();
  month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  if (dateTimeStr === undefined || dateTimeStr === null) {
    return "";
  }

  if (type === undefined) {
    type = "yyyy-mm-dd";
  }

  if (type === "yyyy-mm-dd") {
    result = year + "-" + month + "-" + day;
  } else if (type === "yy-mm-dd") {
    result = year.toString().substring(2, 4) + "-" + month + "-" + day;
  } else if (type === "yyyy-mm") {
    result = year + "-" + month;
  } else if (type === "mm-dd") {
    result = month + "-" + day;
  } else if (type === "yyyy-mm-dd HH:mm:ss") {
    result = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
  } else if (type === "HH:mm:ss") {
    result = hh + ":" + mm + ":" + ss;
  } else if (type === "HH:mm") {
    result = hh + ":" + mm;
  } else if (type === "mm:ss") {
    result = mm + ":" + ss;
  } else if (type === "yyyy.mm.dd") {
    result = year + "." + month + "." + day;
  } else if (type === "yy.mm.dd") {
    result = year.toString().substring(2, 4) + "." + month + "." + day;
  } else if (type === "yyyy-mm-dd T HH:mm") {
    result = year + "-" + month + "-" + day + "T" + hh + ":" + mm;
  }

  return result;
}

function dateDis(created, modified) {
  let result;

  if (created === undefined) {
    created = null;
  } else if (modified === undefined) {
    modified = null;
  }

  if (created !== null && modified !== null) {
    result = modified;
  } else if (created === null && modified !== null) {
    result = modified;
  } else if (created !== null && modified === null) {
    result = created;
  }

  return result;
}

// 페이징 만드는 함수
function createPaging(container, max, eventListener, fncStr, current, nextCount, forwardStep) {
  let x = 0,
    page,
    html = ["", "", "", ""];
  if (container == undefined) {
    console.log("[createPaging] Paging container is Empty.");
    return false;
  } else if (!classType(container).includes("Element")) {
    console.log("[createPaging] Container is Not Html Element.");
    return false;
  } else if (isNaN(max) || max === "" || max < 1) {
    console.log("[createPaging] max value is abnormal.");
    return false;
  } else if (eventListener === undefined) {
    console.log("[createPaging] Click event listener unavailable.");
    return false;
  }

  if (current === undefined) current = 1;
  if (nextCount === undefined) nextCount = 3;
  if (forwardStep === undefined) forwardStep = 10;

  html[1] = '<div class="paging_cell paging_cell_current">' + current + "</div>";

  for (page = current - 1; page >= current - nextCount && page > 0; page--) {
    html[1] =
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(" +
      page +
      ", " +
      fncStr +
      ')">' +
      page +
      "</div>" +
      html[1];
  }

  if (page === 1) {
    html[0] =
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(" +
      page +
      ", " +
      fncStr +
      ')">' +
      page +
      "</div>";
  } else if (page > 1) {
    if (current - forwardStep > 1) {
      html[0] =
        '<div class="paging_cell" onclick="' +
        eventListener +
        "(" +
        (current - forwardStep) +
        ", " +
        fncStr +
        ')">&laquo;</div>';
    }
    html[0] =
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(1, " +
      fncStr +
      ')">1</div>' +
      html[0];
  } else {
    html[0] = undefined;
  }

  for (page = current + 1; page <= current + nextCount && page <= max; page++) {
    html[1] =
      html[1] +
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(" +
      page +
      ", " +
      fncStr +
      ')">' +
      page +
      "</div>";
  }

  if (page === max) {
    html[2] =
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(" +
      page +
      ", " +
      fncStr +
      ')">' +
      page +
      "</div>";
  } else if (page < max) {
    if (current + forwardStep < max) {
      html[2] =
        '<div class="paging_cell" onclick="' +
        eventListener +
        "(" +
        (current + forwardStep) +
        ", " +
        fncStr +
        ')">&raquo;</div>';
    }
    html[2] =
      html[2] +
      '<div class="paging_cell" onclick="' +
      eventListener +
      "(" +
      max +
      ", " +
      fncStr +
      ')">' +
      max +
      "</div>";
  } else html[2] = undefined;

  html[3] = html[1];
  if (html[0] !== undefined)
    html[3] = html[0] + '<div class="paging_cell_empty">...</div>' + html[1];
  if (html[2] != undefined)
    html[3] = html[3] + '<div class="paging_cell_empty">...</div>' + html[2];

  return html[3];
} // End of createPaging

function pageMove(page, drawFnc) {
  let selectedPage = parseInt(page);
  storage.currentPage = selectedPage;
  drawFnc();
}

// 데이터 타입 확인 하수
function classType(obj) {
  return obj == undefined ? obj : Object.prototype.toString.call(obj).slice(8, -1);
} // End of classType()

// API 서버에서 직원 정보를 가져오는 함수
// function getUserMap() {
// 	let url, userMapTime, userMapData, arr, adminMode = false;

// 	arr = location.href.split("/");
// 	adminMode = arr[arr.length - 2] === "business" && arr[arr.length - 1] === "employee";
// 	if (adminMode) {
// 		url = apiServer + "/api/user/map/admin";
// 		$.ajax({
// 			"url": url,
// 			"method": "get",
// 			"dataType": "json",
// 			"cache": false,
// 			success: (data) => {
// 				let list;
// 				if (data.result === "ok") {
// 					list = cipher.decAes(data.data);
// 					list = JSON.parse(list);
// 					storage.user = list;
// 					storage.userMapTime = new Date().getTime();
// 				} else {
// 					msg.set("직원 정보를 가져오지 못했습니다.");
// 				}
// 			}
// 		});
// 	} else {
// 		url = apiServer + "/api/user/map";
// 		userMapTime = sessionStorage.getItem("userMapTime");
// 		userMapTime = userMapTime == null ? 0 : userMapTime * 1;

// 		if ((new Date()).getTime() < userMapTime + 600000) {
// 			userMapData = sessionStorage.getItem("userMapData");
// 			userMapData = JSON.parse(userMapData);
// 			storage.user = userMapData;
// 			console.log("[getUserMap] set user data from sessionStorage.");
// 		} else {
// 			$.ajax({
// 				"url": url,
// 				"method": "get",
// 				"dataType": "json",
// 				"cache": false,
// 				success: (data) => {
// 					let list;

// 					if (data.result === "ok") {
// 						list = cipher.decAes(data.data);
// 						sessionStorage.setItem("userMapData", list);
// 						sessionStorage.setItem("userMapTime", (new Date()).getTime() + "");
// 						list = JSON.parse(list);
// 						storage.user = list;
// 						console.log("[getUserMap] Success getting employee information.");
// 					} else {
// 						msg.set("직원 정보를 가져오지 못했습니다.");
// 					}
// 				}
// 			});
// 		}
// 	}
// } // End of getUserMap()

function getUserMap() {
  axios.get("/api/user").then((res) => {
    if (res.data.result === "ok") {
      let obj = {};
      let result = cipher.decAes(res.data.data);
      result = JSON.parse(result);

      for (let i = 0; i < result.length; i++) {
        obj[result[i].userNo] = result[i];
      }

      storage.user = obj;
      storage.my = sessionStorage.getItem("getUserNo");
    }
  });
}

// API 서버에서 직원 정보를 가져오는 함수
function getDeptMap(cache = false) {
  let url, deptMapData, deptMapTime;
  if (cache !== true) cache = false;

  url = apiServer + "/api/dept/map" + (cache ? "" : "/nocache");
  deptMapTime = sessionStorage.getItem("deptMapTime");
  deptMapTime = deptMapTime == null ? 0 : deptMapTime * 1;
  if (new Date().getTime() < deptMapTime + 600000) {
    deptMapData = sessionStorage.getItem("deptMapData");
    deptMapData = JSON.parse(deptMapData);
    storage.dept = deptMapData;
    console.log("[getUserMap] set dept data from sessionStorage.");
  } else {
    $.ajax({
      url: url,
      method: "get",
      dataType: "json",
      cache: false,
      success: (data) => {
        let list;
        if (data.result === "ok") {
          list = cipher.decAes(data.data);
          sessionStorage.setItem("deptMapData", list);
          sessionStorage.setItem("deptMapTime", new Date().getTime() + "");
          list = JSON.parse(list);
          storage.dept = list;
          console.log("[getDeptMap] Success getting department information.");
        } else {
          msg.set("부서 정보를 가져오지 못했습니다.");
        }
      },
    });
  }
} // End of getDeptMap()

// API 서버에서 고객사 정보를 가져오는 함수
function getCustomer() {
  // let url, customerTime, customerData;

  // url = apiServer + "/api/system/customer";
  // customerTime = sessionStorage.getItem("customerTime");
  // customerTime = customerTime == null ? 0 : customerTime * 1;
  // if ((new Date()).getTime() < customerTime + 600000) {
  // 	customerData = sessionStorage.getItem("customerData");
  // 	customerData = JSON.parse(customerData);
  // 	storage.customer = customerData;
  // 	console.log("[getUserMap] set customer data from sessionStorage.");
  // } else {
  // 	$.ajax({
  // 		"url": url,
  // 		"method": "get",
  // 		"dataType": "json",
  // 		"cache": false,
  // 		success: (data) => {
  // 			let list;
  // 			if (data.result === "ok") {
  // 				list = cipher.decAes(data.data);
  // 				sessionStorage.setItem("customerData", list);
  // 				sessionStorage.setItem("customerTime", (new Date()).getTime() + "");
  // 				list = JSON.parse(list);
  // 				console.log(list);
  // 				storage.customer = list;
  // 				console.log("[getCustomer] Success getting customer information.");
  // 			} else {
  // 				msg.set("고객 정보를 가져오지 못했습니다.");
  // 			}
  // 		}
  // 	})
  // }

  if (storage.customer === undefined) {
    $.ajax({
      url: "/api/cust",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          let formatDatas = {};

          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);

          for (let i = 0; i < resultJson.length; i++) {
            formatDatas[resultJson[i].custNo] = resultJson[i];
          }

          storage.customer = formatDatas;
          console.log("[getCust] Success getting cust list.");
        }
      },
      error: () => {
        msg.set("cust 에러");
      },
    });
  }
} // End of getCustomer()

// API 서버에서 회사 및 사용자 사번을 정보를 가져오는 함수
function getBasicInfo() {
  let url, basicInfoTime, basicInfoData;

  url = apiServer + "/api/system/basic";
  basicInfoTime = sessionStorage.getItem("basicInfoTime");
  basicInfoTime = basicInfoTime == null ? 0 : basicInfoTime * 1;
  if (new Date().getTime() < basicInfoTime + 600000) {
    basicInfoData = sessionStorage.getItem("basicInfoData");
    basicInfoData = JSON.parse(basicInfoData);
    storage.company = basicInfoData.company;
    storage.bizcore = storage.bizcore === undefined ? {} : storage.bizcore;
    storage.bizcore.version = basicInfoData.version;
    storage.permission = basicInfoData.permission;
    storage.my = basicInfoData.my;
    // storage.widget.set = basicInfoData.widget;
    document.title = document.title + " " + storage.bizcore.version;
    console.log("[getUserMap] set basic info from sessionStorage.");
  } else {
    $.ajax({
      url: url,
      method: "get",
      dataType: "json",
      cache: false,
      success: (data) => {
        let list;
        if (data.result === "ok") {
          list = cipher.decAes(data.data);
          sessionStorage.setItem("basicInfoData", list);
          sessionStorage.setItem("basicInfoTime", new Date().getTime() + "");
          list = JSON.parse(list);
          storage.company = list.company;
          storage.bizcore = storage.bizcore === undefined ? {} : storage.bizcore;
          storage.bizcore.version = list.version;
          storage.permission = list.permission;
          // storage.widget.set = list.widget;
          storage.my = list.my;
          document.title = document.title + " " + storage.bizcore.version;
          console.log("[getBasicInfo] Success getting basic information.");
          // 회계 관리 권한 적용
          if (!storage.permission._manager && !storage.permission._accounting)
            document.getElementsByClassName("mainTopMenu")[0].children[0].children[2].remove();
          // 인사관리 권한 적용
          if (!storage.permission._manager && !storage.permission._hr)
            document
              .getElementsByClassName("sideMenu")[0]
              .children[0].children[8].children[1].children[3].remove();
        } else {
          msg.set("기본 정보를 가져오지 못했습니다.");
        }
      },
    });
  }
} // End of getBasicInfo()

// API 서버에서 회사 및 사용자 사번을 정보를 가져오는 함수
function getUserRank() {
  let url, userRankTime, userRankData;

  url = apiServer + "/api/user/rank";
  userRankTime = sessionStorage.getItem("userRankTime");
  userRankTime = userRankTime == null ? 0 : userRankTime * 1;
  if (new Date().getTime() < userRankTime + 600000) {
    userRankData = sessionStorage.getItem("userRankData");
    userRankData = JSON.parse(userRankData);
    storage.userRank = userRankData;
    console.log("[getUserMap] set rank info from sessionStorage.");
  } else {
    $.ajax({
      url: url,
      method: "get",
      dataType: "json",
      cache: false,
      success: (data) => {
        let list;
        if (data.result === "ok") {
          list = cipher.decAes(data.data);
          sessionStorage.setItem("userRankData", list);
          sessionStorage.setItem("userRankTime", new Date().getTime() + "");
          list = JSON.parse(list);
          storage.userRank = list;
          console.log("[getBasicInfo] Success getting rank information.");
        } else {
          msg.set("직급 정보를 가져오지 못했습니다.");
        }
      },
    });
  }
} // End of getUserRank()

// API 서버에서 코드 정보를 가져오는 함수
function getCommonCode() {
  let url, commonCodeTime, commonCodeData;

  url = apiServer + "/api/system/code";
  commonCodeTime = sessionStorage.getItem("commonCodeTime");
  commonCodeTime = commonCodeTime == null ? 0 : commonCodeTime * 1;
  if (new Date().getTime() < commonCodeTime + 600000) {
    commonCodeData = sessionStorage.getItem("commonCodeData");
    if (commonCodeData !== "") {
      commonCodeData = JSON.parse(commonCodeData);
    }
    storage.code = commonCodeData;
    console.log("[getUserMap] set common code from sessionStorage.");
  } else {
    $.ajax({
      url: url,
      method: "get",
      dataType: "json",
      cache: false,
      success: (data) => {
        let list;
        if (data.result === "ok") {
          list = cipher.decAes(data.data);
          sessionStorage.setItem("commonCodeData", list);
          sessionStorage.setItem("commonCodeTime", new Date().getTime() + "");
          list = JSON.parse(list);
          storage.code = list;
          console.log("[getCommonCode] Success getting Common code list.");
        } else {
          msg.set("코드 정보를 가져오지 못했습니다.");
        }
      },
    });
  }
} // End of getDeptMap()

//파일 dropzone class 변경
function toggleClass(className) {
  let list = ["dragenter", "dragleave", "dragover", "drop"];
  let dropZone = $(".dropZone");

  for (let i = 0; i < list.length; i++) {
    if (className === list[i]) {
      dropZone.addClass("dropZone_" + list[i]);
    } else {
      dropZone.removeClass("dropZone_" + list[i]);
    }
  }
}

//파일 drag show 샘플
function showFile(files) {
  let dropZone = $(".dropZone");
  dropZone.innerHTML = "";

  for (let i = 0; i < files.length; i++) {
    dropZone.html("<p>" + files[i].name + "</p>");
  }
}

function selectFile(files) {
  let file;
  file = document.getElementById("attached");

  file.files = files;
  showFile(file.files);
  fileChange();
}

//drag 최상위 부모 클래스 전달
function enableDragSort(listClass) {
  let sortableLists = document.getElementsByClassName(listClass);
  Array.prototype.map.call(sortableLists, (list) => {
    enableDragList(list);
  });
}

//drag 자식 클래스 전달
function enableDragList(list) {
  Array.prototype.map.call(list.children, (item) => {
    enableDragItem(item);
  });
}

//자식 클래스 draggable, ondrag, ondragend 기능 적용
function enableDragItem(item) {
  item.setAttribute("draggable", true);
  item.ondrag = handleDrag;
  item.ondragend = handleDrop;
}

//drag 기능
function handleDrag(item) {
  let selectedItem, tempEl, currentEl, x, t;

  currentEl = item.target;
  tempEl = currentEl;
  while (true) {
    if (tempEl === document.body) break;
    if (tempEl.dataset.drag === "true") {
      selectedItem = tempEl;
      break;
    } else tempEl = tempEl.parentElement;
  }

  if (selectedItem === undefined) return;

  list = selectedItem.parentNode;
  x = item.clientX;
  y = item.clientY + Math.floor(selectedItem.clientHeight) / 2;

  selectedItem.classList.add("dragActive");
  let swapItem =
    document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

  tempEl = swapItem;

  while (true) {
    if (tempEl === document.body) break;
    if (tempEl.dataset.drag === "true") {
      swapItem = tempEl;
      break;
    } else tempEl = tempEl.parentElement;
  }

  list.insertBefore(selectedItem, swapItem);
}

//drop 기능
function handleDrop(item) {
  item.target.classList.remove("dragActive");
}

//페이지네이션에 필요한 계산 공통함수
function paging(total, currentPage, articlePerPage) {
  let getArticle = calWindowLength();
  let lastPage,
    result = [],
    max;

  if (currentPage === undefined) {
    storage.currentPage = 1;
    currentPage = storage.currentPage;
  }

  if (articlePerPage === undefined) {
    if (isNaN(getArticle)) {
      storage.articlePerPage = 10;
    } else {
      storage.articlePerPage = getArticle;
    }
    articlePerPage = storage.articlePerPage;
  }

  max = Math.ceil(total / articlePerPage);

  lastPage = currentPage * articlePerPage;

  if (currentPage == max && total % articlePerPage !== 0) {
    lastPage = (max - 1) * articlePerPage + (total % articlePerPage);
  }

  result.push(currentPage, articlePerPage, lastPage, max);

  return result;
}

//숫자 포맷
function numberFormat(num) {
  if (num !== undefined) {
    let setNumber;
    setNumber = parseInt(num).toLocaleString("en-US");
    return setNumber;
  } else {
    return 0;
  }
}

//input text keyup 숫자포맷
function inputNumberFormat(e) {
  let value;
  value = $(e).val().replaceAll(",", "");

  if (value > 0 && !isNaN(value)) {
    $(e).val(
      $(e)
        .val()
        .replace(/[^0-9]/g, "")
    );
    $(e).val(parseInt(value).toLocaleString("en-US"));
  } else {
    $(e).val("");
  }
}

//상세 폼
function detailViewFormHtml(data) {
  let html = "";
  html = "<div class='defaultFormContainer'>";

  for (let i = 0; i < data.length; i++) {
    let dataTitle = data[i].title === undefined ? "" : data[i].title;
    let col = data[i].col === undefined ? 1 : data[i].col;

    html += "<div class='defaultFormLine' style=\"grid-column: span " + col + ';">';

    if (dataTitle !== "") {
      html += "<div class='defaultFormSpanDiv'>";
      html += "<span class='defaultFormSpan'>" + dataTitle + "</span>";
      html += "</div>";
    }

    html += "<div class='defaultFormContent'>";

    html += inputSet(data[i]);

    html += "</div>";
    html += "</div>";
  }

  html += "</div>";
  return html;
}

// 상세보기 type별 폼 전달
function detailViewForm(data, type) {
  let html = "",
    pageContainer,
    detailBtns,
    listChangeBtn,
    scheduleRange;

  if (type === undefined) {
    pageContainer = $(".pageContainer");
    listChangeBtn = $(".listChangeBtn");
    scheduleRange = $("#scheduleRange");
    detailBtns = $(".detailBtns");

    if (listChangeBtn !== undefined) {
      listChangeBtn.hide();
    }

    if (scheduleRange !== undefined) {
      scheduleRange.hide();
    }

    pageContainer.children().hide();
    detailBtns.hide();

    html = detailViewFormHtml(data);
  } else if (type === "board") {
    html = detailBoardForm(data);
  } else if (type === "modal") {
    html = detailViewFormHtml(data);
  }

  return html;
}

function detailBoardForm(data) {
  let html = "";

  html = "<div class='detailBoard'>";
  html += "<div class='detailBtns'></div>";
  html += "<div class='detailContents'>";
  html += detailViewFormHtml(data);
  html += "</div>";
  html += "</div>";

  return html;
}

function inputSet(data) {
  let html = "";
  let dataValue = data.value === undefined ? "" : data.value;
  let dataDisabled = data.disabled === undefined ? true : data.disabled;
  let dataType = data.type === undefined ? "text" : data.type;
  let dataKeyup = data.dataKeyup === undefined ? "" : data.dataKeyup;
  let dataKeyupEvent = data.keyup === undefined ? "" : data.keyup;
  let elementId = data.elementId === undefined ? "" : data.elementId;
  let elementName = data.elementName === undefined ? "" : data.elementName;
  let dataChangeEvent = data.onChange === undefined ? "" : data.onChange;
  let dataClickEvent = data.onClick === undefined ? "" : data.onClick;
  let dataComplete = data.complete === undefined ? "" : data.complete;
  let autoComplete = data.autoComplete === undefined ? "off" : data.autoComplete;
  let placeHolder = data.placeHolder === undefined ? "" : data.placeHolder;

  if (dataType === "text") {
    if (dataDisabled == true) {
      html +=
        "<input type='text' id='" +
        elementId +
        "' name='" +
        elementName +
        "' autocomplete=\"" +
        autoComplete +
        "\" value='" +
        dataValue +
        "' data-complete='" +
        dataComplete +
        "' data-keyup='" +
        dataKeyup +
        "' onchange='" +
        dataChangeEvent +
        "' onclick='" +
        dataClickEvent +
        "' onkeyup='" +
        dataKeyupEvent +
        "' placeholder=\"" +
        placeHolder +
        '" readonly>';
    } else {
      html +=
        "<input type='text' id='" +
        elementId +
        "' name='" +
        elementName +
        "' autocomplete=\"" +
        autoComplete +
        "\" value='" +
        dataValue +
        "' data-complete='" +
        dataComplete +
        "' data-keyup='" +
        dataKeyup +
        "' onchange='" +
        dataChangeEvent +
        "' onclick='" +
        dataClickEvent +
        "' onkeyup='" +
        dataKeyupEvent +
        "' placeholder=\"" +
        placeHolder +
        '">';
    }
  } else if (dataType === "textarea") {
    if (dataDisabled == true) {
      html += '<textarea id="' + elementId + '" readonly>' + dataValue + "</textarea>";
    } else {
      html += '<textarea id="' + elementId + '">' + dataValue + "</textarea>";
    }
  } else if (dataType === "radio") {
    for (let t = 0; t < data.radioValue.length; t++) {
      if (data.radioType !== "tab") {
        data.radioType = "default";
      }

      html += '<div class="detailRadioBox" data-type="' + data.radioType + '">';

      if (dataDisabled == true) {
        if (t == 0) {
          html +=
            "<input type='radio' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.radioValue[t].key +
            "' disabled='" +
            dataDisabled +
            "' data-type=\"" +
            data.radioType +
            "\" onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '" checked><label data-type="' +
            data.radioType +
            '" for="' +
            elementId[t] +
            '">' +
            data.radioValue[t].value +
            "</label>" +
            " ";
        } else {
          html +=
            "<input type='radio' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.radioValue[t].key +
            "' disabled='" +
            dataDisabled +
            "' data-type=\"" +
            data.radioType +
            "\" onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label data-type="' +
            data.radioType +
            '" for="' +
            elementId[t] +
            '">' +
            data.radioValue[t].value +
            "</label>" +
            " ";
        }
      } else {
        if (t == 0) {
          html +=
            "<input type='radio' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.radioValue[t].key +
            "' data-type=\"" +
            data.radioType +
            "\" onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '" checked><label data-type="' +
            data.radioType +
            '" for="' +
            elementId[t] +
            '">' +
            data.radioValue[t].value +
            "</label>" +
            " ";
        } else {
          html +=
            "<input type='radio' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.radioValue[t].key +
            "' data-type=\"" +
            data.radioType +
            "\" onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label data-type="' +
            data.radioType +
            '" for="' +
            elementId[t] +
            '">' +
            data.radioValue[t].value +
            "</label>" +
            " ";
        }
      }

      html += "</div>";
    }
  } else if (dataType === "checkbox") {
    for (let t = 0; t < data.checkValue.length; t++) {
      if (dataDisabled == true) {
        if (t == 0) {
          html +=
            "<input type='checkbox' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.checkValue[t].value +
            "' disabled='" +
            dataDisabled +
            "' onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label for="' +
            elementId[t] +
            '">' +
            data.checkValue[t].key +
            "</label>" +
            " ";
        } else {
          html +=
            "<input type='checkbox' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.checkValue[t].value +
            "' disabled='" +
            dataDisabled +
            "' onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label for="' +
            elementId[t] +
            '">' +
            data.checkValue[t].key +
            "</label>" +
            " ";
        }
      } else {
        if (t == 0) {
          html +=
            "<input type='checkbox' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.checkValue[t].value +
            "' onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label for="' +
            elementId[t] +
            '">' +
            data.checkValue[t].key +
            "</label>" +
            " ";
        } else {
          html +=
            "<input type='checkbox' id='" +
            elementId[t] +
            "' name='" +
            elementName +
            "' value='" +
            data.checkValue[t].value +
            "' onclick='" +
            dataClickEvent +
            "' onChange=\"" +
            dataChangeEvent +
            '"><label for="' +
            elementId[t] +
            '">' +
            data.checkValue[t].key +
            "</label>" +
            " ";
        }
      }
    }
  } else if (dataType === "date") {
    if (dataDisabled == true) {
      html +=
        "<input type='date' max='9999-12-31' id='" +
        elementId +
        "' name='" +
        elementName +
        "' value='" +
        dataValue +
        "' disabled='" +
        dataDisabled +
        "'>";
    } else {
      html +=
        "<input type='date' max='9999-12-31' id='" +
        elementId +
        "' name='" +
        elementName +
        "' value='" +
        dataValue +
        "'>";
    }
  } else if (dataType === "datetime") {
    if (dataDisabled == true) {
      html +=
        "<input type='datetime-local' max='9999-12-31T23:59:59' id='" +
        elementId +
        "' name='" +
        elementName +
        "' value='" +
        dataValue +
        "' disabled='" +
        dataDisabled +
        "'>";
    } else {
      html +=
        "<input type='datetime-local' max='9999-12-31T23:59:59' id='" +
        elementId +
        "' name='" +
        elementName +
        "' value='" +
        dataValue +
        "'>";
    }
  } else if (dataType === "select") {
    if (dataDisabled == true) {
      html +=
        "<select id='" +
        elementId +
        "' name='" +
        elementName +
        "' disabled='" +
        dataDisabled +
        "'>";
    } else {
      html += "<select id='" + elementId + "' name='" + elementName + "'>";
    }
    for (let t = 0; t < data.selectValue.length; t++) {
      html +=
        "<option value='" +
        data.selectValue[t].key +
        "'>" +
        data.selectValue[t].value +
        "</option>";
    }

    html += "</select>";
  } else if (dataType === "file") {
    html +=
      "<input type='file' id='" +
      elementId +
      "' name='" +
      elementName +
      "' onchange='fileChange();' multiple>";
  } else if (dataType === "") {
    html += "";
  }

  return html;
}

function detailTabHide(notId) {
  let radio;
  radio = $(".tabs input:radio");

  for (let i = 0; i < radio.length; i++) {
    if (notId === undefined) {
      $("#" + $(radio[i]).data("content-id")).hide();
    } else {
      $("#" + $(radio[i]).data("content-id"))
        .not("#" + notId)
        .hide();
    }
  }
}

//tinyMCE
// function setTiny(){
// 	tinymce.remove();
// 	tinymce.init(tiny.options);
// }

//ckeditor
function setEditor(container) {
  if (typeof CKEDITOR !== undefined) {
    if ($(CKEDITOR.instances).length) {
      for (var key in CKEDITOR.instances) {
        CKEDITOR.instances[key].destroy();
      }
    }
  }

  if (container === undefined) {
    let textarea = document.querySelectorAll("textarea");
    for (let i = 0; i < textarea.length; i++) {
      CKEDITOR.replace(document.querySelector("#" + textarea[i].getAttribute("id")));
    }
  } else {
    let textarea = container.querySelectorAll("textarea");
    for (let i = 0; i < textarea.length; i++) {
      CKEDITOR.replace(container.querySelector("#" + textarea[i].getAttribute("id")));
    }
  }
}

// datalist
function dataListFormat(id, value) {
  let result;

  result = $("datalist#_" + id + " option[value='" + value + "']").data("value");

  if (result === undefined) {
    return "";
  } else {
    return result;
  }
}

// crud tab 클릭 함수
function tabItemClick(e) {
  $(".tabs input:radio").each((index, item) => {
    $("#" + $(item).data("content-id")).hide();
  });

  $("#" + $(e).data("content-id")).show();
}

//매입매출내역 리스트
function createTabTradeList(result) {
  let html = "";

  html =
    '<div class="tradeInputBtns"><button type="button" onclick="tradeInsert();">매입매출 추가</button></div>';
  html += '<div class="tradeInput">';
  html += '<div class="tradeInputAdd">';
  html +=
    '<div class="tradeInputTitle1"><div>구분</div><div>거래일자</div><div>고객사</div><div>항목</div><div style="grid-column: span 2;">적요</div></div>';
  html +=
    '<div class="tradeInputBody1"><div><select id="type"><option value="purchase">매입</option><option value="sale">매출</option></select></div><div><input type="date" id="dt"></div><div><input type="text" autocomplete="off" id="customer" data-complete="customer" onclick="addAutoComplete(this);" onkeyup="addAutoComplete(this);"></div><div><input type="text" autocomplete="off" id="title" data-complete="product" onclick="addAutoComplete(this);" onkeyup="addAutoComplete(this);"></div><div style="grid-column: span 2;"><input type="text" id="remark"></div></div>';
  html +=
    '<div class="tradeInputTitle2"><div>단가</div><div>수량</div><div>공급가</div><div>부가세</div><div>합계금액</div><div>승인번호</div></div>';
  html +=
    '<div class="tradeInputBody2"><div data-format="netPrice"><input type="text" class="netPrice" onkeyup="inputNetFormat(this, \'tradeInputAdd\');" value="0"></div><div data-format="quantity"><input type="text" id="qty" onkeyup="inputQuanFormat(this, \'tradeInputAdd\');" value="1"></div><div data-format="amount"><input type="text" id="price" onkeyup="inputVatFormat(this);" value="0" readonly></div><div data-format="vat"><input type="text" id="vat" onkeyup="inputVatFormat(this, \'tradeInputAdd\');" value="0"></div><div data-format="total"><input type="text" class="total" onkeyup="inputTotalFormat(this, \'tradeInputAdd\');" value="0"></div><div><input type="text" id="taxbill"></div></div>';
  html += "</div>";
  html += "</div>";
  html += '<div class="tradeMainContents">';
  html += '<div class="tradeThirdFormTitle">';
  html += '<div class="tradeThirdTitleItem">구분(등록/수정일)</div>';
  html += '<div class="tradeThirdTitleItem">거래처(매입/매출처)</div>';
  html += '<div class="tradeThirdTitleItem">항목</div>';
  html += '<div class="tradeThirdTitleItem">단가</div>';
  html += '<div class="tradeThirdTitleItem">수량</div>';
  html += '<div class="tradeThirdTitleItem">부가세액</div>';
  html += '<div class="tradeThirdTitleItem">공급가액</div>';
  html += '<div class="tradeThirdTitleItem">금액</div>';
  html += '<div class="tradeThirdTitleItem">비고</div>';
  html += '<div class="tradeThirdTitleItem">승인번호</div>';
  html += '<div class="tradeThirdTitleItem">삭제</div>';
  html += "</div>";

  html += '<div class="tradePurchaseContent">';

  if (result.length > 0) {
    let disDate, setDate;
    let purchaseArr = [];
    let saleArr = [];
    let purchaseTotal = 0;
    let saleTotal = 0;

    for (let i = 0; i < result.length; i++) {
      let item = result[i];
      let total = 0;
      total = item.price * item.qty + item.vat;

      if (result[i].type === "purchase") {
        purchaseArr.push(item);
        purchaseTotal += total;
      } else {
        saleArr.push(item);
        saleTotal += total;
      }
    }

    if (purchaseArr.length > 0) {
      for (let i = 0; i < purchaseArr.length; i++) {
        let item = purchaseArr[i];
        disDate = dateDis(item.created);
        setDate = dateFnc(disDate);

        html += '<div class="tradePurchaseItem">' + setDate + "</div>";
        html += '<div class="tradePurchaseItem">' + storage.customer[item.customer].name + "</div>";
        html += '<div class="tradePurchaseItem">' + item.title + "</div>";
        html +=
          '<div class="tradePurchaseItem">' +
          CommonDatas.numberFormat(item.price / item.qty) +
          "</div>";
        html += '<div class="tradePurchaseItem">' + item.qty + "</div>";
        html += '<div class="tradePurchaseItem">' + CommonDatas.numberFormat(item.vat) + "</div>";
        html +=
          '<div class="tradePurchaseItem">' +
          CommonDatas.numberFormat(item.price * item.qty) +
          "</div>";
        html +=
          '<div class="tradePurchaseItem" data-type="purchase">' +
          CommonDatas.numberFormat(item.price * item.qty + item.vat) +
          "</div>";
        html += '<div class="tradePurchaseItem">' + item.remark + "</div>";
        html += '<div class="tradePurchaseItem">' + item.taxbill + "</div>";
        html +=
          '<div class="tradePurchaseItem tradeItemRemoveBtn"><button type="button" data-type="' +
          item.type +
          '" data-no="' +
          item.no +
          '" onclick="tradeItemRemove(this);">삭제</button></div>';
      }
    } else {
      html += '<div class="tradePurchaseItem">데이터가 없습니다.</div>';
    }

    html += "</div>";
    html +=
      '<div class="tradePurchaseTotal"><span>매입합계</span><span>' +
      CommonDatas.numberFormat(purchaseTotal) +
      "</span></div>";
    html += '<div class="tradeSaleContent">';

    if (saleArr.length > 0) {
      for (let i = 0; i < saleArr.length; i++) {
        let item = saleArr[i];
        disDate = dateDis(item.created);
        setDate = dateFnc(disDate);

        html += '<div class="tradeSaleItem">' + setDate + "</div>";
        html += '<div class="tradeSaleItem">' + storage.customer[item.customer].name + "</div>";
        html += '<div class="tradeSaleItem">' + item.title + "</div>";
        html +=
          '<div class="tradeSaleItem">' +
          CommonDatas.numberFormat(item.price / item.qty) +
          "</div>";
        html += '<div class="tradeSaleItem">' + item.qty + "</div>";
        html += '<div class="tradeSaleItem">' + CommonDatas.numberFormat(item.vat) + "</div>";
        html +=
          '<div class="tradeSaleItem">' +
          CommonDatas.numberFormat(item.price * item.qty) +
          "</div>";
        html +=
          '<div class="tradeSaleItem" data-type="sale">' +
          CommonDatas.numberFormat(item.price * item.qty + item.vat) +
          "</div>";
        html += '<div class="tradeSaleItem">' + item.remark + "</div>";
        html += '<div class="tradeSaleItem">' + item.taxbill + "</div>";
        html +=
          '<div class="tradeSaleItem tradeItemRemoveBtn"><button type="button" data-type="' +
          item.type +
          '" data-no="' +
          item.no +
          '" onclick="tradeItemRemove(this);">삭제</button></div>';
      }
    } else {
      html += '<div class="tradeSaleItem">데이터가 없습니다.</div>';
    }

    html += "</div>";
    html +=
      '<div class="tradeSaleTotal"><span>매출합계</span><span>' +
      CommonDatas.numberFormat(saleTotal) +
      "</span></div>";
  } else {
    html +=
      '<div class="tradeThirdContentItem" style="grid-column: span 12; text-align:center;">데이터가 없습니다.</div>';
  }

  html += "</div>";
  html += "</div>";
  html += '<div class="tradeTotalInfo">';
  html += "<div>매입합계</div>";
  html += '<div style="justify-content: right;">0</div>';
  html += "<div>매출합계</div>";
  html += '<div style="justify-content: right;">0</div>';
  html += "<div>이익합계</div>";
  html += '<div style="justify-content: right;">0</div>';
  html += "<div>이익률</div>";
  html += '<div style="justify-content: right;">0%</div>';
  html += "</div>";
  html += "</div>";

  let tabLists = document.getElementsByClassName("tabLists")[0];
  let createDiv = document.createElement("div");
  createDiv.className = "tabTradeList";
  createDiv.id = "tabTradeList";
  createDiv.innerHTML = html;
  tabLists.append(createDiv);
  let tabs = document.getElementsByClassName("tabs")[0];
  if (result.length > 0) {
    tabs.querySelector('label[for="tabTrade"]').innerText = "매입매출내역(" + result.length + ")";
  } else {
    tabs.querySelector('label[for="tabTrade"]').innerText = "매입매출내역(0)";
  }

  if (result.length > 0) {
    tradeTotalSet();
  }

  storage.tradeFormList = {
    dt: 0,
    belongTo: "sopp:" + storage.soppDetailNo,
    writer: storage.my,
    type: "",
    product: 0,
    customer: 0,
    taxbill: "",
    title: "",
    qty: 0,
    price: 0,
    vat: 0,
    remark: "",
  };

  setTimeout(() => {
    let nowDate = new Date().toISOString().substring(0, 10);
    document.getElementById("dt").value = nowDate;
  }, 100);
}

function tradeTotalSet() {
  let calSale = 0,
    calPur = 0,
    calSaleVat = 0,
    calPurVat = 0,
    saleTotal,
    purTotal,
    tradeTotalInfo,
    calMinus = 0,
    calPercent = 0;
  purTotal = document
    .getElementsByClassName("tradePurchaseContent")[0]
    .querySelectorAll('.tradePurchaseItem[data-type="purchase"]');
  saleTotal = document
    .getElementsByClassName("tradeSaleContent")[0]
    .querySelectorAll('.tradeSaleItem[data-type="sale"]');
  tradeTotalInfo = document.getElementsByClassName("tradeTotalInfo")[0].querySelectorAll("div");

  for (let i = 0; i < purTotal.length; i++) {
    calPur += parseInt(purTotal[i].innerText.replace(/,/g, ""));
    calPurVat += parseInt(
      purTotal[i].previousElementSibling.previousElementSibling.innerText.replace(/,/g, "")
    );
  }

  for (let i = 0; i < saleTotal.length; i++) {
    calSale += parseInt(saleTotal[i].innerText.replace(/,/g, ""));
    calSaleVat += parseInt(
      saleTotal[i].previousElementSibling.previousElementSibling.innerText.replace(/,/g, "")
    );
  }

  calPur = calPur - calPurVat;
  calSale = calSale - calSaleVat;
  calMinus = calSale - calPur;
  calPercent = (calMinus / calSale) * 100;

  if (isNaN(calPercent)) {
    calPercent = 0;
  } else if (calPercent == "-Infinity") {
    calPercent = 0;
  } else if (calPercent == "Infinity") {
    calPercent = 0;
  } else if (calPercent >= 0) {
    calPercent = "+" + calPercent.toString().substring(0, 4);
  } else if (calPercent < 0) {
    calPercent = calPercent.toString().substring(0, 4);
  }

  tradeTotalInfo[1].innerText = numberFormat(calPur);
  tradeTotalInfo[3].innerText = numberFormat(calSale);
  tradeTotalInfo[5].innerText = numberFormat(calMinus);
  tradeTotalInfo[7].innerText = calPercent + "%";
}

function inputNetFormat(e, parentClass) {
  let thisEle, quantity, amount, vat, total;
  thisEle = $(e);
  quantity = thisEle
    .parents("." + parentClass)
    .find('div[data-format="quantity"]')
    .children();
  amount = thisEle
    .parents("." + parentClass)
    .find('div[data-format="amount"]')
    .children();
  vat = thisEle
    .parents("." + parentClass)
    .find('div[data-format="vat"]')
    .children();
  total = thisEle
    .parents("." + parentClass)
    .find('div[data-format="total"]')
    .children();
  cal = Math.round(quantity.val() * thisEle.val().replace(/,/g, ""));
  calVat = Math.round(cal * 0.1);
  calTotal = Math.round(cal + calVat);

  inputNumberFormat(e);
  amount.val(cal.toLocaleString("en-US"));
  vat.val(calVat.toLocaleString("en-US"));
  total.val(calTotal.toLocaleString("en-US"));
}

function inputQuanFormat(e, parentClass) {
  let thisEle, netPrice, amount, vat, total;
  thisEle = $(e);
  netPrice = thisEle
    .parents("." + parentClass)
    .find('div[data-format="netPrice"]')
    .children();
  amount = thisEle
    .parents("." + parentClass)
    .find('div[data-format="amount"]')
    .children();
  vat = thisEle
    .parents("." + parentClass)
    .find('div[data-format="vat"]')
    .children();
  total = thisEle
    .parents("." + parentClass)
    .find('div[data-format="total"]')
    .children();
  cal = Math.round(netPrice.val().replace(/,/g, "") * thisEle.val());
  calVat = Math.round(cal * 0.1);
  calTotal = Math.round(cal + calVat);

  amount.val(cal.toLocaleString("en-US"));
  vat.val(calVat.toLocaleString("en-US"));
  total.val(calTotal.toLocaleString("en-US"));
}

function inputVatFormat(e, parentClass) {
  let thisEle, amount, total;
  thisEle = $(e);
  amount = thisEle
    .parents("." + parentClass)
    .find('div[data-format="amount"]')
    .children();
  total = thisEle
    .parents("." + parentClass)
    .find('div[data-format="total"]')
    .children();
  cal = Math.round(
    parseInt(thisEle.val().replace(/,/g, "")) + parseInt(amount.val().replace(/,/g, ""))
  );

  inputNumberFormat(e);
  total.val(cal.toLocaleString("en-US"));
}

function inputTotalFormat(e, parentClass) {
  let thisEle, netPrice, quantity, amount, vat;
  thisEle = $(e);
  netPrice = thisEle
    .parents("." + parentClass)
    .find('div[data-format="netPrice"]')
    .children();
  quantity = thisEle
    .parents("." + parentClass)
    .find('div[data-format="quantity"]')
    .children();
  amount = thisEle
    .parents("." + parentClass)
    .find('div[data-format="amount"]')
    .children();
  vat = thisEle
    .parents("." + parentClass)
    .find('div[data-format="vat"]')
    .children();
  calNet = Math.round(((thisEle.val().replace(/,/g, "") / 11) * 10) / quantity.val());
  calAmount = Math.round((thisEle.val().replace(/,/g, "") / 11) * 10);
  calVat = Math.round(thisEle.val().replace(/,/g, "") / 11);

  inputNumberFormat(e);
  netPrice.val(calNet.toLocaleString("en-US"));
  amount.val(calAmount.toLocaleString("en-US"));
  vat.val(calVat.toLocaleString("en-US"));
}

function tradeInsert() {
  let data,
    formArr = storage.tradeFormList;
  for (let key in formArr) {
    if (key !== "belongTo" && key !== "writer" && key !== "product" && key !== "related") {
      if (typeof formArr[key] === "number") {
        if (key === "customer") {
          formArr[key] = $(".tradeInput")
            .find("#" + key)
            .data("value");
        } else if (key === "dt") {
          let date = new Date(
            $(".tradeInput")
              .find("#" + key)
              .val()
          ).getTime();
          formArr[key] = date;
        } else {
          let number = $(".tradeInput")
            .find("#" + key)
            .val()
            .replace(/,/g, "");
          formArr[key] =
            $(".tradeInput")
              .find("#" + key)
              .val() === ""
              ? 0
              : parseInt(number);
        }
      } else {
        formArr[key] = $(".tradeInput")
          .find("#" + key)
          .val();
      }
    }
  }

  data = JSON.stringify(formArr);
  data = cipher.encAes(data);

  $.ajax({
    url: "/api/trade",
    method: "post",
    data: data,
    dataType: "json",
    contentType: "text/plain",
    success: () => {
      let tradeThirdFormContentTotal, tradeInputAdd;
      tradeThirdFormContentTotal = $(".tradeThirdFormContentTotal");
      tradeInputAdd = $(".tradeInputAdd");

      if (formArr.type === "sale") {
        tradeThirdFormContentTotal
          .eq(1)
          .before(
            '<div class="tradeThirdFormContentDiv"><div class="tradeThirdContentItem">' +
              new Date(formArr.dt).toISOString().substring(0, 10) +
              '</div><div class="tradeThirdContentItem">' +
              storage.customer[formArr.customer].name +
              '</div><div class="tradeThirdContentItem">' +
              formArr.title +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.price).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              formArr.qty +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.vat).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.price).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem" data-type="sale">' +
              parseInt(formArr.price + formArr.vat).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              formArr.remark +
              '</div><div class="tradeThirdContentItem">' +
              formArr.taxbill +
              '</div><div class="tradeThirdContentItem tradeItemRemoveBtn"><button type="button" data-type="sale" onclick="tradeItemRemove(this);">삭제</button></div></div>'
          );
      } else {
        tradeThirdFormContentTotal
          .eq(0)
          .before(
            '<div class="tradeThirdFormContentDiv"><div class="tradeThirdContentItem">' +
              new Date(formArr.dt).toISOString().substring(0, 10) +
              '</div><div class="tradeThirdContentItem">' +
              storage.customer[formArr.customer].name +
              '</div><div class="tradeThirdContentItem">' +
              formArr.title +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.price).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              formArr.qty +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.vat).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              parseInt(formArr.price).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem" data-type="purchase">' +
              parseInt(formArr.price + formArr.vat).toLocaleString("en-US") +
              '</div><div class="tradeThirdContentItem">' +
              formArr.remark +
              '</div><div class="tradeThirdContentItem">' +
              formArr.taxbill +
              '</div><div class="tradeThirdContentItem tradeItemRemoveBtn"><button type="button" data-type="purchase" onclick="tradeItemRemove(this);">삭제</button></div></div>'
          );
      }

      msg.set("등록되었습니다.");
      tradeTotalSet();
      getSoppNo(storage.soppDetailNo);
      $('.tabItem[for="tabTrade"]').text(
        "매입매출내역(" + $(".tradeThirdFormContent .tradeThirdFormContentDiv").length + ")"
      );

      setTimeout(() => {
        let tradePurBtns = $(".tradeThirdFormContentDiv").find(
          '.tradeItemRemoveBtn button[data-type="purchase"]'
        );
        let tradeSaleBtns = $(".tradeThirdFormContentDiv").find(
          '.tradeItemRemoveBtn button[data-type="sale"]'
        );

        for (let i = 0; i < storage.purchaseList.length; i++) {
          let item = tradePurBtns;
          item.attr("data-no", storage.purchaseList[i]);
        }

        for (let i = 0; i < storage.purchaseList.length; i++) {
          let item = tradeSaleBtns;
          item.attr("data-no", storage.saleList[i]);
        }
      }, 300);
    },
    error: () => {
      msg.set("등록에 실패하였습니다.\n확인 후 다시 시도해주세요.");
    },
  });
}

function getSoppNo(no) {
  $.ajax({
    url: "/api/sopp/" + no,
    method: "get",
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      result = cipher.decAes(result.data);
      result = JSON.parse(result);
      storage.purchaseList = [];
      storage.saleList = [];
      storage.tradeLength = result.trades.length;

      for (let i = 0; i < result.trades.length; i++) {
        if (result.trades[i].type === "purchase") {
          storage.purchaseList.push(result.trades[i].no);
        } else {
          storage.saleList.push(result.trades[i].no);
        }
      }
    },
  });
}

function tradeItemRemove(e) {
  if (confirm("삭제하시겠습니까??")) {
    let thisEle;
    thisEle = $(e);

    $.ajax({
      url: "/api/trade/" + thisEle.data("no"),
      method: "delete",
      dataType: "json",
      contentType: "text/plain",
      success: () => {
        msg.set("삭제되었습니다.");
        thisEle.parents(".tradeThirdFormContentDiv").remove();
        tradeTotalSet();
      },
    });
  } else {
    return false;
  }
}

function createTabFileList() {
  let html = "",
    tabs,
    container,
    header = [],
    data = [],
    str,
    ids,
    job,
    fnc,
    url;
  html =
    "<input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attached[]' id='attached' onchange='fileChange();' multiple>";
  html += "<div class='fileList'></div>";

  header = [
    {
      title: "파일명",
      align: "center",
    },
    {
      title: "삭제",
      align: "center",
    },
  ];

  let createDiv = document.createElement("div");
  createDiv.className = "tabFileList";
  createDiv.id = "tabFileList";
  createDiv.innerHTML = html;
  let tabLists = document.getElementsByClassName("tabLists")[0];
  tabLists.append(createDiv);
  container = document
    .getElementsByClassName("tabFileList")[0]
    .getElementsByClassName("fileList")[0];
  tabs = document.getElementsByClassName("tabs")[0];

  if (storage.attachedList.length > 0) {
    tabs.querySelector('label[for="tabFile"]').innerText =
      "파일첨부(" + storage.attachedList.length + ")";
  } else {
    tabs.querySelector('label[for="tabFile"]').innerText = "파일첨부(0)";
  }

  if (storage.attachedList.length > 0) {
    for (let i = 0; i < storage.attachedList.length; i++) {
      url =
        "/api/attached/" +
        storage.attachedType +
        "/" +
        storage.attachedNo +
        "/" +
        storage.attachedList[i].fileName;
      if (storage.attachedList[i].removed) {
        str = [
          {
            setData:
              "<div style='text-decoration: line-through;'>" +
              storage.attachedList[i].fileName +
              "</div>",
          },
          {
            setData: "<button type='button' disabled>삭제</button>",
          },
        ];
      } else {
        str = [
          {
            setData:
              "<a href='/api/attached/" +
              storage.attachedType +
              "/" +
              storage.attachedNo +
              "/" +
              encodeURI(storage.attachedList[i].fileName) +
              "'>" +
              storage.attachedList[i].fileName +
              "</a>",
          },
          {
            setData:
              "<button type='button' onclick='tabFileDelete(" +
              storage.attachedNo +
              ', "' +
              storage.attachedType +
              '", "' +
              storage.attachedList[i].fileName +
              '", ' +
              i +
              ");'>삭제</button>",
          },
        ];
      }
      data.push(str);
    }
  } else {
    str = [
      {
        setData: "<div>데이터가 없습니다.</div>",
        align: "center",
      },
      {
        setData: "<button type='button' disabled>삭제</button>",
        align: "center",
      },
    ];
    data.push(str);
  }

  CommonDatas.createGrid(container, header, data, ids, job, fnc);
}

function fileChange() {
  let method,
    data,
    type,
    attached,
    fileDatas = [],
    html = "",
    flag;
  attached = $("[name='attached[]']")[0].files;

  if (storage.attachedList === undefined || storage.attachedList <= 0) {
    storage.attachedList = [];
  }

  flag = storage.attachedFlag;

  for (let i = 0; i < attached.length; i++) {
    let reader = new FileReader();
    let temp,
      fileName,
      indexFlag = false;

    fileName = attached[i].name;

    reader.onload = (e) => {
      let binary,
        x,
        fData = e.target.result;
      const bytes = new Uint8Array(fData);
      binary = "";
      for (x = 0; x < bytes.byteLength; x++) binary += String.fromCharCode(bytes[x]);
      let fileData = cipher.encAes(btoa(binary));
      let fullData = fileName + "\r\n" + fileData;

      let url =
        flag == false
          ? "/api/board/filebox/attached"
          : "/api/attached/" + storage.attachedType + "/" + storage.attachedNo;

      url = url;
      method = "post";
      data = fullData;
      type = "insert";

      crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
    };

    reader.readAsArrayBuffer(attached[i]);

    temp = attached[i].name;
    fileDatas.push(temp);
    updateDataArray.push(temp);

    for (let t = 0; t < storage.attachedList.length; t++) {
      if (storage.attachedList[t].fileName == temp) {
        indexFlag = true;
      }
    }

    if (!indexFlag) {
      temp = {
        fileName: attached[i].name,
        removed: attached[i].removed,
      };

      storage.attachedList.push(temp);
    }
  }

  if (flag) {
    tabFileItemListUpdate();
  } else {
    $(".filePreview").html(html);

    for (let i = 0; i < fileDatas.length; i++) {
      fileDataArray.push(fileDatas[i]);
    }

    if (fileDataArray.length > 0) {
      for (let i = 0; i < fileDataArray.length; i++) {
        html +=
          "<div><span>" +
          fileDataArray[i] +
          "</span><button type='button' id='fileDataDelete' data-index='" +
          i +
          "' onclick='fileViewDelete(this);'>삭제</button></div>";
        $(".filePreview").html(html);
      }
    }
  }

  // divHeight = $(".filePreview").innerHeight();
  // $("#attached").parent().parent().next().css("padding-top", divHeight);
}

function tabFileDownload(no, fileType, fileName) {
  $.ajax({
    url: "/api/attached/" + fileType + "/" + no + "/" + fileName,
    method: "get",
    dataType: "json",
  });
}

function fileViewDelete(e) {
  fileDataArray.splice($(e).data("index"), 1);

  for (let i = 0; i < updateDataArray.length; i++) {
    if (updateDataArray[i] === $(e).prev().text()) {
      updateDataArray.splice(i, 1);
    }
  }

  removeDataArray.push($(e).prev().text());
  $(e).parent().remove();

  $(".filePreview div button").each((index, item) => {
    $(item).attr("data-index", index);
  });
}

function submitFileSuccess() {
  return false;
}

function submitFileError() {
  msg.set("파일을 올리는 도중 에러가 생겼습니다.\n다시 시도해주세요.");
}

function tabFileInsert(url) {
  let writer, data, method, type;

  writer = $("#writer");
  writer = dataListFormat(writer.attr("id"), writer.val());

  url = url;
  method = "post";
  data = {
    writer: writer,
    files: fileDataArray,
  };
  type = "insert";

  data = JSON.stringify(data);
  data = cipher.encAes(data);

  crud.defaultAjax(url, method, data, type, tabFileSuccessInsert, tabFileErrorInsert);
}

function tabFileSuccessInsert() {
  msg.set("등록완료");
  location.reload();
}

function tabFileErrorInsert() {
  msg.set("등록에러");
}

function tabFileDelete(no, fileType, fileName) {
  let method, data, type;

  if (confirm("정말로 삭제하시겠습니까??")) {
    url = "/api/attached/" + fileType + "/" + no + "/" + fileName;
    method = "delete";
    type = "detail";

    crud.defaultAjax(url, method, data, type, tabFileSuccessDelete, tabFileErrorDelete);
  } else {
    return false;
  }
}

function tabFileSuccessDelete(result) {
  storage.attachedList = result;
  tabFileItemListUpdate();
}

function tabFileErrorDelete() {
  msg.set("삭제에러");
}

function tabFileItemListUpdate() {
  let header,
    data = [],
    ids,
    job,
    fnc,
    content,
    html = "";

  header = [
    {
      title: "파일명",
      align: "center",
    },
    {
      title: "삭제",
      align: "center",
    },
  ];

  container = $(".detailSecondTabs .tabFileList .fileList");

  if (storage.attachedList.length > 0) {
    for (let i = 0; i < storage.attachedList.length; i++) {
      url =
        "/api/attached/" +
        storage.attachedType +
        "/" +
        storage.attachedNo +
        "/" +
        storage.attachedList[i].fileName;
      if (storage.attachedList[i].removed) {
        str = [
          {
            setData:
              "<div style='text-decoration: line-through;'>" +
              storage.attachedList[i].fileName +
              "</div>",
          },
          {
            setData: "<button type='button' disabled>삭제</button>",
          },
        ];
      } else {
        str = [
          {
            setData:
              "<a href='/api/attached/" +
              storage.attachedType +
              "/" +
              storage.attachedNo +
              "/" +
              encodeURI(storage.attachedList[i].fileName) +
              "'>" +
              storage.attachedList[i].fileName +
              "</a>",
          },
          {
            setData:
              "<button type='button' onclick='tabFileDelete(" +
              storage.attachedNo +
              ', "' +
              storage.attachedType +
              '", "' +
              storage.attachedList[i].fileName +
              '", ' +
              i +
              ");'>삭제</button>",
          },
        ];
      }
      data.push(str);
    }
  } else {
    str = [
      {
        setData: "<div>데이터가 없습니다.</div>",
      },
      {
        setData: "<button type='button' disabled>삭제</button>",
      },
    ];
    data.push(str);
  }

  setTimeout(() => {
    CommonDatas.createGrid(container, header, data, ids, job, fnc);
  }, 100);

  content = $(".tabFileList .fileList .gridContent");
  content.html("");

  for (let i = 0; i < storage.attachedList.length; i++) {
    html +=
      "<div class='gridContentItem grid_default_text_align_center'>" +
      storage.attachedList[i].fileName +
      "</div>";
    html +=
      "<div class='gridContentItem grid_default_text_align_center' data-name='" +
      storage.attachedList[i].fileName +
      "'><button type='button' onclick='tabFileDelete('/api/attached/'" +
      storage.attchedType +
      "/" +
      storage.attchedNo +
      "/" +
      storage.attachedList[i].fileName +
      "');>삭제</button></div>";
  }

  content.html(html);
}

//견적내역 리스트
function createTabEstList(result) {
  let html = "",
    lengthIndex,
    tabs,
    container,
    header,
    data = [],
    str,
    ids,
    job,
    fnc,
    disDate,
    idName;
  let tabEstListAll = document.getElementsByClassName("tabEstList");
  if (tabEstListAll.length > 0) {
    for (let i = 0; i < tabEstListAll.length; i++) {
      let item = tabEstListAll[i];
      item.remove();
    }
  }

  let tabLists = document.getElementsByClassName("tabLists")[0];
  let createDiv = document.createElement("div");
  createDiv.className = "tabEstList";
  createDiv.id = "tabEstList";
  lengthIndex = 0;
  idName = "tabEstList";

  header = [
    {
      title: "견적일자",
      align: "center",
    },
    {
      title: "버전",
      align: "center",
    },
    {
      title: "견적명",
      align: "center",
    },
    {
      title: "담당자",
      align: "center",
    },
    {
      title: "금액",
      align: "center",
    },
    {
      title: "비고",
      align: "center",
    },
  ];

  tabLists.append(createDiv);
  container = tabLists.getElementsByClassName("tabEstList")[0];
  tabs = document.getElementsByClassName("tabs")[0];

  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      let itemTotal = 0,
        itemPrice = 0,
        itemVat = 0;

      for (let t = 0; t < result[i].related.estimate.items.length; t++) {
        let item = result[i].related.estimate.items[t];
        itemPrice += item.price;
        itemVat += item.price * 0.1;
      }

      itemTotal = itemPrice + itemVat;
      disDate = dateDis(result[i].date);
      disDate = dateFnc(disDate);

      str = [
        {
          setData: disDate,
          align: "center",
        },
        {
          setData: result[i].version,
          align: "center",
        },
        {
          setData: result[i].title,
          align: "left",
        },
        {
          setData: storage.user[result[i].writer].userName,
          align: "center",
        },
        {
          setData: numberFormat(itemTotal),
          align: "right",
        },
        {
          setData: result[i].related.estimate.remarks
            .replace(/<br \/>/g, "")
            .replace(/<p>/g, "")
            .replace(/<\/p>/g, ""),
          align: "left",
        },
      ];

      data.push(str);
      lengthIndex++;
    }
  } else {
    str = [
      {
        setData: undefined,
        col: 6,
        align: "center",
      },
    ];
    data.push(str);
  }

  if (lengthIndex > 0) {
    tabs.querySelector('label[for="tabEst"]').innerText = "견적내역(" + lengthIndex + ")";
  } else {
    tabs.querySelector('label[for="tabEst"]').innerText = "견적내역(0)";
  }

  setTimeout(() => {
    CommonDatas.createGrid(container, header, data, ids, job, fnc, idName);
    // container.prepend("<div class=\"estAddBtn\"><button type=\"button\" data-href=\"/business/popupEstForm\" onclick=\"popup(this, 880, 800);\">등록</button></div>");
  }, 100);
}

//기술지원내역 리스트
function createTabTechList(result) {
  let html = "",
    lengthIndex,
    tabs,
    container,
    header,
    data = [],
    str,
    ids,
    job,
    fnc,
    disDate,
    idName;
  let tabLists = document.getElementsByClassName("tabLists")[0];
  let createDiv = document.createElement("div");
  createDiv.className = "tabTechList";
  createDiv.id = "tabTechList";
  lengthIndex = 0;
  idName = "tabTechList";

  header = [
    {
      title: "일자",
      align: "center",
    },
    {
      title: "지원형태",
      align: "center",
    },
    {
      title: "장소",
      align: "center",
    },
    {
      title: "담당자",
      align: "center",
    },
    {
      title: "비고",
      align: "center",
    },
  ];

  tabLists.append(createDiv);
  container = tabLists.getElementsByClassName("tabTechList")[0];
  tabs = document.getElementsByClassName("tabs")[0];

  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].job === "tech") {
        result[i].created = new Date(result[i].created).getTime();
        disDate = dateDis(result[i].created);
        disDate = dateFnc(disDate);

        str = [
          {
            setData: disDate,
            align: "center",
          },
          {
            setData: storage.code.etc[result[i].type],
            align: "center",
          },
          {
            setData: result[i].place,
            align: "center",
          },
          {
            setData: storage.user[result[i].writer].userName,
            align: "center",
          },
          {
            setData: result[i].content,
            align: "left",
          },
        ];

        data.push(str);
        lengthIndex++;
      }
    }
  } else {
    str = [
      {
        setData: undefined,
        col: 5,
        align: "center",
      },
    ];
    data.push(str);
  }

  if (lengthIndex > 0) {
    tabs.querySelector('label[for="tabTech"]').innerText = "기술지원내역(" + lengthIndex + ")";
  } else {
    tabs.querySelector('label[for="tabTech"]').innerText = "기술지원내역(0)";
  }

  setTimeout(() => {
    CommonDatas.createGrid(container, header, data, ids, job, fnc, idName);
  }, 100);
}

//영업활동내역 리스트
function createTabSalesList(result) {
  let html = "",
    lengthIndex,
    tabs,
    container,
    header,
    data = [],
    str,
    ids,
    job,
    fnc,
    disDate,
    idName;
  let tabLists = document.getElementsByClassName("tabLists")[0];
  let createDiv = document.createElement("div");
  createDiv.className = "tabSalesList";
  createDiv.id = "tabSalesList";
  lengthIndex = 0;
  idName = "tabSalesList";

  header = [
    {
      title: "일자",
      align: "center",
    },
    {
      title: "활동종류",
      align: "center",
    },
    {
      title: "제목",
      align: "center",
    },
    {
      title: "비고",
      align: "center",
    },
    {
      title: "담당자",
      align: "center",
    },
    {
      title: "장소",
      align: "center",
    },
  ];

  tabLists.append(createDiv);
  container = tabLists.getElementsByClassName("tabSalesList")[0];
  tabs = document.getElementsByClassName("tabs")[0];

  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].job === "sales") {
        disDate = dateDis(result[i].created, result[i].modified);
        disDate = dateFnc(disDate);

        str = [
          {
            setData: disDate,
            align: "center",
          },
          {
            setData: storage.code.etc[result[i].type],
            align: "center",
          },
          {
            setData: result[i].title,
            align: "left",
          },
          {
            setData: result[i].content,
            align: "left",
          },
          {
            setData: storage.user[result[i].writer].userName,
            align: "center",
          },
          {
            setData: result[i].place,
            align: "center",
          },
        ];

        data.push(str);
        lengthIndex++;
      }
    }
  } else {
    str = [
      {
        setData: undefined,
        col: 6,
        align: "center",
      },
    ];
    data.push(str);
  }

  if (lengthIndex > 0) {
    tabs.querySelector('label[for="tabSales"]').innerText = "영업활동내역(" + lengthIndex + ")";
  } else {
    tabs.querySelector('label[for="tabSales"]').innerText = "영업활동내역(0)";
  }

  setTimeout(() => {
    CommonDatas.createGrid(container, header, data, ids, job, fnc, idName);
  }, 100);
}

function detailBoardContainerHide() {
  $(".detailBoard").each((index, item) => {
    $(item).remove();
  });
}

function sizeToStr(s) {
  let result, t, r;
  r = 1024;
  if (s === undefined || s === null || isNaN(s) || s === "") return s;
  if (s < r) return s + "b";
  s = Math.floor(s / 102.4) / 10;
  if (s < r) return s + "kb";
  s = Math.floor(s / 102.4) / 10;
  if (s < r) return s + "mb";
  s = Math.floor(s / 102.4) / 10;
  return s + "gb";
}

function calWeekDay(date) {
  let disDate, week;

  disDate = dateDis(date);
  date = dateFnc(disDate);

  week = new Date(date).getDay();

  if (week == 0) {
    week = "일";
  } else if (week == 1) {
    week = "월";
  } else if (week == 2) {
    week = "화";
  } else if (week == 3) {
    week = "수";
  } else if (week == 4) {
    week = "목";
  } else if (week == 5) {
    week = "금";
  } else {
    week = "토";
  }

  return week;
}

function calDays(date, type) {
  let getDate, year, month, day, resultDate;

  getDate = new Date(date);

  year = getDate.getFullYear();
  month = getDate.getMonth();
  day = getDate.getDate();

  if (type === "last") {
    day = day - 6;
    resultDate = new Date(year, month, day).toISOString().substring(0, 10).replaceAll("-", "");
  } else {
    day = day + 8;
    resultDate = new Date(year, month, day).toISOString().substring(0, 10).replaceAll("-", "");
  }

  return resultDate;
}

function contentTopBtn(content) {
  $("#" + content).animate(
    {
      scrollTop: 0,
    },
    100
  );
}

function enableDisabled(e, clickStr, notIdArray) {
  let thisEle, box;
  thisEle = $(e);
  box = $("input, select, textarea");

  for (let i = 0; i < box.length; i++) {
    if ($(box[i]).attr("type") === "radio") {
      $(box[i]).removeAttr("readonly");
      $(box[i]).removeAttr("disabled");
    } else {
      if (notIdArray.indexOf($(box[i]).attr("id")) == -1) {
        $(box[i]).removeAttr("readonly");
        $(box[i]).removeAttr("disabled");
      }
    }
  }

  thisEle.attr("onclick", clickStr);
  thisEle.attr("data-hide-flag", true);
  thisEle.html("수정완료");
  ckeditor.config.readOnly = false;
  window.setTimeout(setEditor, 100);

  if (modal.wrap.css("display") !== "none") {
    setTimeout(() => {
      document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
    }, 300);
  }
}

function calWindowLength() {
  let bodyContent, containerTitle, searchContainer, searchCal, titleCal, totalCal;

  bodyContent = $("#bodyContent");
  searchContainer = $(".searchContainer");
  containerTitle = $("#containerTitle");
  searchCal =
    searchContainer.innerHeight() === undefined
      ? parseInt(bodyContent.innerHeight())
      : parseInt(bodyContent.innerHeight()) - searchContainer.innerHeight();
  titleCal = parseInt(containerTitle.innerHeight() + 70);
  totalCal = (parseInt(searchCal - titleCal) - parseInt(36)) / parseInt(38);

  return parseInt(totalCal);
}

function daumPostCode(zipCode, address, detailAddress) {
  let popupWidth, popupHeight;
  popupWidth = 500;
  popupHeight = 500;

  new daum.Postcode({
    theme: {
      searchBgColor: "#0B65C8",
      queryTextColor: "#FFFFFF",
    },
    animation: true,
    pleaseReadGuide: true,
    width: popupWidth,
    height: popupHeight,
    oncomplete: function (data) {
      $("#" + zipCode).val(data.zonecode);
      $("#" + address).val(data.address + " " + data.buildingName);
      $("#" + detailAddress).focus();
    },
  }).open({
    left: Math.ceil(document.body.offsetWidth / 2 - popupWidth / 2 + window.screenLeft),
    top: Math.ceil(document.body.offsetHeight / 2 - popupHeight / 2),
  });
}

function searchContainerSet() {
  let searchMultiContent, jsonData;
  searchMultiContent = $(".searchMultiContent");
  searchMultiContent.find("div input").each((index, item) => {
    if ($(item).data("type") !== undefined) {
      $(item).attr("list", "_" + $(item).attr("id"));
      $(item).after('<datalist id="_' + $(item).attr("id") + '"></datalist>');

      if ($(item).data("type") === "user") {
        jsonData = storage.user;
        for (let key in jsonData) {
          $(item)
            .next()
            .append('<option data-value="' + key + '" value="' + jsonData[key].userName + '">');
        }
      } else if ($(item).data("type") === "customer") {
        jsonData = storage.customer;
        for (let key in jsonData) {
          $(item)
            .next()
            .append('<option data-value="' + key + '" value="' + jsonData[key].name + '">');
        }
      } else if ($(item).data("type") === "sopp") {
        $.ajax({
          url: "/api/sopp",
          method: "get",
          dataType: "json",
          success: (result) => {
            jsonData = cipher.decAes(result.data);
            jsonData = JSON.parse(jsonData);

            for (let i = 0; i < jsonData.length; i++) {
              $(item)
                .next()
                .append(
                  "<option data-value='" +
                    jsonData[i].no +
                    "' value='" +
                    jsonData[i].title +
                    "'></option>"
                );
            }
          },
        });
      } else if ($(item).data("type") === "contract") {
        $.ajax({
          url: "/api/contract",
          method: "get",
          dataType: "json",
          success: (result) => {
            jsonData = cipher.decAes(result.data);
            jsonData = JSON.parse(jsonData);

            for (let i = 0; i < jsonData.length; i++) {
              $(item)
                .next()
                .append(
                  "<option data-value='" +
                    jsonData[i].no +
                    "' value='" +
                    jsonData[i].title +
                    "'></option>"
                );
            }
          },
        });
      }
    }
  });
}

function searchAco(e) {
  let thisBtn, multiSearchResetBtn, multiSearchBtn, searchMultiContent;
  thisBtn = $(e);
  multiSearchResetBtn = $("#multiSearchResetBtn");
  multiSearchBtn = $("#multiSearchBtn");
  searchMultiContent = $(".searchMultiContent");

  if (thisBtn.data("set")) {
    thisBtn.html('<i class="fa-solid fa-plus fa-xl"></i>');
    thisBtn.data("set", false);
    multiSearchBtn.hide();
    searchMultiContent.hide();
    multiSearchResetBtn.hide();
  } else {
    thisBtn.html('<i class="fa-solid fa-minus fa-xl"></i>');
    thisBtn.data("set", true);
    multiSearchBtn.show();
    searchMultiContent.show();
    multiSearchResetBtn.show();
  }
}

function searchChange(e) {
  let thisBtn, multiSearchResetBtn, multiSearchBtn, searchInputContent, searchMultiContent;
  thisBtn = $(e);
  multiSearchResetBtn = $("#multiSearchResetBtn");
  multiSearchBtn = $("#multiSearchBtn");
  searchInputContent = $(".searchInputContent");
  searchMultiContent = $(".searchMultiContent");

  if (!thisBtn.data("set")) {
    thisBtn.html('<i class="fa-solid fa-keyboard fa-xl"></i>');
    thisBtn.data("set", true);
    multiSearchResetBtn.show();
    multiSearchBtn.show();
    searchInputContent.hide();
    searchMultiContent.show();
  } else {
    thisBtn.html('<i class="fa-solid fa-list fa-xl"></i>');
    thisBtn.data("set", false);
    multiSearchResetBtn.hide();
    multiSearchBtn.hide();
    searchInputContent.show();
    searchMultiContent.hide();
  }
}

function searchReset() {
  let searchMultiContent = $(".searchMultiContent");

  searchMultiContent.find("div input, select").each((index, item) => {
    $(item).val("");
  });
}

function searchDataFilter(arrayList, searchDatas, type) {
  let dataArray = [];

  if (type === "input") {
    for (let key in storage.searchList) {
      if (storage.searchList[key].indexOf(searchDatas) > -1) {
        dataArray.push(arrayList[key]);
      }
    }
  } else {
    if (searchDatas.indexOf("#created") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#created");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#created")[1]) {
          if (storage.searchList[key].split("#created")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#date") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#date");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#date")[1]) {
          if (storage.searchList[key].split("#date")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#from") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#from");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#from")[1]) {
          if (storage.searchList[key].split("#from")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#startOfFreeMaintenance") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#startOfFreeMaintenance");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#startOfFreeMaintenance")[1]) {
          if (storage.searchList[key].split("#startOfFreeMaintenance")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#startOfPaidMaintenance") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#startOfPaidMaintenance");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#startOfPaidMaintenance")[1]) {
          if (storage.searchList[key].split("#startOfPaidMaintenance")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#saleDate") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#saleDate");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#saleDate")[1]) {
          if (storage.searchList[key].split("#saleDate")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#issueDate") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#issueDate");

      for (let key in storage.searchList) {
        if (splitStr[0] <= storage.searchList[key].split("#issueDate")[1]) {
          if (storage.searchList[key].split("#issueDate")[1] <= splitStr[1]) {
            dataArray.push(key);
          }
        }
      }
    } else if (searchDatas.indexOf("#price") > -1) {
      let splitStr;
      splitStr = searchDatas.split("#price");

      for (let key in storage.searchList) {
        if (parseInt(splitStr[0]) <= parseInt(storage.searchList[key].split("#price")[1])) {
          if (parseInt(storage.searchList[key].split("#price")[1]) <= parseInt(splitStr[1])) {
            dataArray.push(key);
          }
        }
      }
    } else {
      for (let key in storage.searchList) {
        if (storage.searchList[key].indexOf(searchDatas) > -1) {
          dataArray.push(key);
        }
      }
    }
  }

  return dataArray;
}

function searchMultiFilter(index, dataArray, arrayList) {
  let arr = [],
    tempResultArray = [],
    resultArray = [];

  if (index > 1) {
    for (let i = 0; i < dataArray.length; i++) {
      if (arr[dataArray[i]]) {
        arr[dataArray[i]]++;
      } else {
        arr[dataArray[i]] = 1;
      }
    }

    for (let key in arr) {
      if (index == arr[key]) {
        tempResultArray.push(key);
      }
    }

    for (let i = 0; i < tempResultArray.length; i++) {
      resultArray.push(arrayList[tempResultArray[i]]);
    }
  } else {
    for (let i = 0; i < dataArray.length; i++) {
      resultArray.push(arrayList[dataArray[i]]);
    }
  }

  return resultArray;
}

function searchDateDefaultSet(e) {
  let thisDateInput = $(e),
    matchDateInput,
    thisDate,
    year,
    month,
    day;

  if (thisDateInput.data("date-type") === "from") {
    matchDateInput = thisDateInput.next().next();
    let splitDate = thisDateInput.val().split("-");
    thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
    splitDate = matchDateInput.val().split("-");
    let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);

    if (matchDateInput.val() === "") {
      thisDate.setDate(thisDate.getDate() + 1);
    } else if (thisDate.getTime() > matchDate.getTime()) {
      msg.set("시작일이 종료일보다 클 수 없습니다.");
      thisDate.setDate(thisDate.getDate() + 1);
    } else {
      return null;
    }
  } else {
    matchDateInput = thisDateInput.prev().prev();
    let splitDate = thisDateInput.val().split("-");
    thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
    splitDate = matchDateInput.val().split("-");
    let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);

    if (matchDateInput.val() === "") {
      thisDate.setDate(thisDate.getDate() - 1);
    } else if (thisDate.getTime() < matchDate.getTime()) {
      msg.set("종료일이 시작일보다 작을 수 없습니다.");
      thisDate.setDate(thisDate.getDate() - 1);
    } else {
      return null;
    }
  }

  year = thisDate.getFullYear();
  month = thisDate.getMonth() + 1;
  day = thisDate.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  matchDateInput.val(year + "-" + month + "-" + day);
}

// 부서트리를 만드는 함수
function setDeptTree() {
  let x,
    y,
    dept,
    arr = [],
    prv,
    count = 0;
  if (storage.dept === undefined) return;

  // 최상위 부서를 찾고 이를 이를 인스턴스화 하고 map에 세팅함
  dept = storage.dept.root === undefined ? null : storage.dept.root;
  dept = storage.dept.dept[dept] === undefined ? null : storage.dept.dept[dept];
  if (dept === null) return;

  // storage.dept에 최상위 부서 세팅
  storage.dept.tree = new Department(dept);
  storage.dept.tree.root = true;

  // 하위부서 추가 전 준비
  for (x in storage.dept.dept) {
    if (x !== undefined && x !== storage.dept.root) arr.push(x);
  }

  // 하위부서 추가
  x = 0;
  while (arr.length > 0) {
    x += 1;
    x = x < arr.length ? x : 0;
    dept = arr[x];
    if (prv === dept) {
      console.log("처리안됨 : " + prv);
      break; // 무한루프 방지
    }
    prv = dept;
    dept = new Department(storage.dept.dept[arr[x]]);
    if (storage.dept.tree.addDept(dept)) arr.splice(x, 1);
  }
  // 부서원 추가
  axios.get("/api/user").then((res) => {
    if (res.data.result === "ok") {
      let obj = {};
      let result = cipher.decAes(res.data.data);
      result = JSON.parse(result);

      for (let i = 0; i < result.length; i++) {
        obj[result[i].userNo] = result[i];
      }
      storage.user = obj;
      for (x in obj) {
        if (x === undefined || obj[x] === undefined) continue;
        dept = obj[x].deptId;
        console.log("user", obj[x].deptId);
        for (y in dept) if (storage.dept.tree.addEmployee(dept[y], x)) break;
      }
    }
  });
  // storage 내의 요소들에 접근 불가
  // console.log("cardStart",storage.cardStart);
  // console.log("categories",storage.categories);
  // console.log("cip",storage.cip);
  // console.log("code",storage.code);
  // console.log("contract",storage.contract);
  // console.log("customer",storage.customer);
  // console.log("dept",storage.dept);
  // console.log("formList",storage.formList);
  // console.log("personalize",storage.personalize);
  // console.log("product",storage.product);
  // console.log("productCust",storage.productCust);
  // console.log("sopp",storage.sopp);
  // console.log("user",storage.user);
  // console.log("userRank",storage.userRank);
  // console.log("widget",storage.widget);
} // End of setDeptTree()

class Department {
  constructor(e) {
    this.no = e.id === undefined || e.id === null ? null : e.id;
    this.name = e.deptName === undefined || e.deptName === null ? null : e.deptName;
    this.id = e.deptId === undefined || e.deptId === null ? null : e.deptId;
    this.parent = e.id === undefined || e.id === null ? null : e.parent;
    this.color = e.colorCode === undefined || e.colorCode === null ? null : e.colorCode;
    this.employee = [];
    this.head = null;
    this.docManager = null;
    this.children = [];
    this.root = false;
  }

  // 하위부서 추가
  addDept(e) {
    let x;
    if (!(e instanceof Department)) return false;
    if (this.id === e.parent) {
      this.children.push(e);
      return true;
    } else for (x = 0; x < this.children.length; x++) if (this.children[x].addDept(e)) return true;
    return false;
  } // End of addDept()

  // 부서아이디를 통한 부서 찾기
  getDept(id) {
    let child = null,
      x;
    if (this.children.length === undefined || this.children.length === 0) return null;
    else
      for (x = 0; x < this.children.length; x++) {
        child = this.children[x].getDept(id);
        if (child !== null) return child;
      }
    return null;
  } // End of getDept()

  // 하위 부서 아이디를 전무 찾는 메서드
  getChildrenId(arr) {
    let x;
    if (arr === undefined) arr = [];
    else arr.push(this.id);
    for (x = 0; x < this.children.length; x++) this.children[x].getChildrenId(arr);
    return arr;
  } // End of getChildrenId()

  // 소속 부서를 찾아서 직원을 추가하는 함수
  addEmployee(id, no) {
    let x;
    if (id === undefined || no === undefined) return;
    //console.log("input / id : " + id + ", no : " + no + " / dept + " + this.id);
    if (this.id === id) {
      this.employee.push(no);
      return true;
    }
    for (x = 0; x < this.children.length; x++)
      if (this.children[x].addEmployee(id, no)) return true;
    return false;
  } // End of getChildrenId()

  // 조직 설정에서 조직도 그리기 태그문자열 생성/전달
  getTreeHtml(empSelectable, deptSelectable) {
    let x, y, html, padding;
    empSelectable = empSelectable === undefined || empSelectable !== true ? false : empSelectable;
    deptSelectable =
      deptSelectable === undefined || deptSelectable !== true ? false : deptSelectable;
    padding = "1rem";

    html =
      '<input type="radio" class="dept-tree-select" name="deptTreeSelectEmp" style="display:none" id="dept-tree-' +
      this.id +
      '" />';
    html +=
      '<label for="dept-tree-' +
      this.id +
      '" class="deptName"><div><img src="/images/common/corporate.png" style="width:20px;height:20px;vertical-align:middle;">' +
      this.name +
      "</div></label>";
    html += '<div class="dept-tree-cnt">';

    for (x = 0; x < this.employee.length; x++) {
      y = this.employee[x];
      if (y === undefined) continue;
      if (storage.user[y] === undefined || storage.user[y].resign) continue;
      html +=
        '<input style="display:none;" type="radio" name="deptTreeSelectEmp" class="dept-tree-select" data-select="emp:' +
        y +
        '" id="emp:' +
        y +
        '" />';
      html +=
        '<label for="emp:' +
        y +
        '" ><div><img src="/api/user/image/' +
        y +
        '" style="width:20px;height:20px;vertical-align:middle;margin-left:1.2rem;" /> ' +
        storage.user[y].userName +
        " " +
        storage.userRank[storage.user[y].rank][0] +
        "</div></label>";
    }

    for (x = 0; x < this.children.length; x++) {
      y = this.children[x];
      html += y.getTreeHtml(empSelectable, deptSelectable);
    }

    html += "</div>";
    return html;
  } // End of getTreeHtml()

  getGwHtml(empSelectable, deptSelectable) {
    let x, y, html, padding;
    empSelectable = empSelectable === undefined || empSelectable !== true ? false : empSelectable;
    deptSelectable =
      deptSelectable === undefined || deptSelectable !== true ? false : deptSelectable;
    padding = "1rem";

    html =
      '<input type="checkbox" class="dept-tree-select" name="deptTreeSelectEmp" style="display:none" id="dept-tree-' +
      this.id +
      '" />';
    html +=
      '<label for="dept-tree-' +
      this.id +
      '" class="deptName"><div><img src="/images/common/corporate.png" style="width:20px;height:20px;vertical-align:middle;">' +
      this.name +
      "</div></label>";
    html += '<div class="dept-tree-cnt">';
    for (x = 0; x < this.employee.length; x++) {
      y = this.employee[x];
      if (y === undefined) continue;
      if (storage.user[y] === undefined || storage.user[y].resign) continue;
      html +=
        '<label for="emp:' +
        y +
        '" ><input type="checkbox" name="deptTreeSelectEmp" class="dept-tree-select" data-select="emp:' +
        y +
        '" id="emp:' +
        y +
        '" />';
      html +=
        '<label for="cb' +
        y +
        "\" ><div style='margin-right:1rem'><img src=\"/api/user/image/" +
        y +
        '" style="width:20px;height:20px;vertical-align:middle;margin-left:1.2rem;" /> ' +
        storage.user[y].userName +
        " " +
        storage.userRank[storage.user[y].rank][0] +
        "</div>";
      html +=
        '<div><img src="/api/user/image/' +
        y +
        '" style="width:20px;height:20px;vertical-align:middle;margin-left:1.2rem;" /> ' +
        storage.user[y].userName +
        " " +
        storage.userRank[storage.user[y].rank][0] +
        "</div></label>";
      html +=
        '<input type="checkbox" name="userNames" class="testClass"  id="cb' +
        y +
        "\" value='" +
        y +
        "' /></label>";
    }
    for (x = 0; x < this.children.length; x++) {
      y = this.children[x];
      html += y.getGwHtml(empSelectable, deptSelectable);
    }
    html += "</div>";
    return html;
  } // End of getTreeHtml()

  // 쪽지 조직도 - 세로 선형 리스트
  getHtml(empSelectable, deptSelectable) {
    let x, y, html, padding;
    empSelectable = empSelectable === undefined || empSelectable !== true ? false : empSelectable;
    deptSelectable =
      deptSelectable === undefined || deptSelectable !== true ? false : deptSelectable;
    padding = "0";

    html = '<ul class="noteUserUl">';
    html +=
      '<li class="noteUserLi" data-active="false" onclick="changeAccIcon(this);"><h4 class="noteUserLiTitle">' +
      this.name +
      '<span class="accIcon">+</span></h4></li>';
    html += '<div id="noteUserContent" name="noteUserContent">';

    for (x = 0; x < this.employee.length; x++) {
      y = this.employee[x];
      if (y === undefined) continue;
      if (storage.user[y] === undefined || storage.user[y].resign) continue;
      if (storage.my != y) {
        html +=
          '<div class="noteUserContentItem" data-no="' +
          y +
          '" onclick="noteUserItemClick(this);"><img src="/api/user/image/' +
          y +
          '"> ' +
          storage.user[y].userName +
          " " +
          storage.userRank[storage.user[y].rank][0];
        html += "</div>";
      }
    }

    for (x = 0; x < this.children.length; x++) {
      y = this.children[x];
      html += y.getHtml(empSelectable, deptSelectable);
    }

    html += "</div>";
    return html;
  } // End of getHtml()
} // End of class === Department

// function addNoteContainer() {
// 	let noteHtml = "";
// 	setDeptTree();

// 	noteHtml += "<div class=\"noteUserContainer\">";
// 	noteHtml += "<div class=\"noteUserAccoordion\">";
// 	noteHtml += "<div class=\"noteUserLi\" data-no=\"0\" onclick=\"noteUserItemClick(this);\"><h4 class=\"noteUserLiTitle\">시스템알림</h4></div>";
// 	noteHtml += storage.dept.tree.getHtml();
// 	noteHtml += "</div>";
// 	noteHtml += "</div>";
// 	noteHtml += "<div class=\"noteMainContainer\"></div>";

// 	modal.noteBody.innerHTML = noteHtml;
// 	modal.noteHeadTitle.innerText = "쪽지";
// }

// function noteContentShow() {
// 	modal.noteShow();
// 	addNoteContainer();
// 	noteListBadge();
// }

function noteSubmit() {
  let noteSubmitText, data, noteMainContent, html;
  noteMainContent = $(".noteMainContent");
  noteSubmitText = $("#noteSubmitText");

  data = {
    msg: noteSubmitText.val().replaceAll("\n", "<br />"),
    related: null,
  };

  data = JSON.stringify(data);
  data = cipher.encAes(data);

  $.ajax({
    url: "/api/note/" + storage.noteContentNo,
    method: "post",
    data: data,
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.result === "ok") {
        let nowDate = new Date().getTime();
        nowDate = dateDis(nowDate);
        nowDate = dateFnc(nowDate, "HH:mm:ss");
        msg.set("전송되었습니다.");
        html = '<div class="chatMe">' + noteSubmitText.val().replaceAll("\n", "<br />") + "</div>";
        html += '<div class="chatMeDate">' + nowDate + "</div>";
        noteMainContent.append(html);
        noteSubmitText.val("");
        noteMainContent.scrollTop(noteMainContent[0].scrollHeight);
      } else {
        msg.set("전송되지 못했습니다\n다시 시도해주세요.");
      }
    },
  });
}

function changeAccIcon(e) {
  let thisLi, thisContent, thisAccIcon, noteUserContent, noteUserLi, accIcon;
  thisLi = $(e);
  thisAccIcon = thisLi.find(".accIcon");
  thisContent = thisLi.next();
  noteUserContent = $('[name="noteUserContent"]');
  noteUserLi = $(".noteUserLi");
  accIcon = $(".noteUserLi .accIcon");

  if (thisLi.data("active")) {
    thisLi.data("active", false);
    thisAccIcon.text("+");
    thisContent.removeClass("active");
  } else {
    thisLi.data("active", true);
    thisAccIcon.text("-");
    thisContent.attr("class", "active");
  }
}

function noteUserItemClick(e) {
  let thisItem,
    nowLongDate,
    noteContainer,
    noteMainContainer,
    noteMainContent,
    html = "";
  thisItem = $(e);
  nowLongDate = new Date().getTime();
  storage.noteContentNo = thisItem.data("no");
  noteContainer = $(".noteContainer");
  noteUserContainer = $(".noteUserContainer");
  noteMainContainer = $(".noteMainContainer");

  $.ajax({
    url: "/api/note/" + storage.noteContentNo + "/" + nowLongDate,
    method: "get",
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.data !== null) {
        result = cipher.decAes(result.data);
        result = JSON.parse(result);
        noteUserContainer.hide();
        noteContainer.find(".noteHeadTitle").text(thisItem.text());

        html = '<div class="noteMainContent">';
        html +=
          '<div class="noteMainBtn"><button type="button" onclick="noteUserPage();"><<쪽지함</button></div><br /><br />';

        for (let i = result.length - 1; i >= 0; i--) {
          let disDate, setDate, nowDate, sentDate;
          nowDate = new Date();
          sentDate = new Date(result[i].sent);
          nowDate = nowDate.getFullYear() + nowDate.getMonth() + nowDate.getDate();
          sentDate = sentDate.getFullYear() + sentDate.getMonth() + sentDate.getDate();

          if (nowDate > sentDate) {
            disDate = dateDis(result[i].sent);
            setDate = dateFnc(disDate);
          } else {
            disDate = dateDis(result[i].sent);
            setDate = dateFnc(disDate, "HH:mm:ss");
          }

          if (result[i].writer > 0) {
            if (result[i].writer == storage.noteContentNo) {
              html +=
                '<div class="chatYouInfo"><img src="/api/user/image/' +
                storage.noteContentNo +
                '"><span>' +
                storage.user[storage.noteContentNo].userName +
                " " +
                storage.userRank[storage.user[storage.noteContentNo].rank][0] +
                "</span></div>";
              html += '<div class="chatYou">' + result[i].msg + "</div>";
              html += '<div class="chatYouDate">' + setDate + "</div>";
            } else {
              html += '<div class="chatMe">' + result[i].msg + "</div>";
              html += '<div class="chatMeDate">' + setDate + "</div>";
            }
          } else {
            html +=
              '<div class="chatYouInfo"><img src="/api/my/image"><span>시스템알림</span></div>';
            html += '<div class="chatYou">' + result[i].msg + "</div>";
            html += '<div class="chatYouDate">' + setDate + "</div>";
          }
        }

        html += "</div>";
        html += '<div class="noteMainText">';
        html += '<textarea id="noteSubmitText" onkeydown="textAreaKeyDown(this)"></textarea>';
        html += '<button type="button" onclick="noteSubmit();">전송</button>';
        html += "</div>";
      } else {
        noteUserContainer.hide();
        noteContainer.find(".noteHeadTitle").text(thisItem.text());

        html = '<div class="noteMainContent">';
        html +=
          '<div class="noteMainBtn"><button type="button" onclick="noteUserPage();"><<쪽지함</button></div><br /><br />';
        html += "</div>";
        html += '<div class="noteMainText">';
        html += '<textarea id="noteSubmitText" onkeydown="textAreaKeyDown(this)"></textarea>';
        html += '<button type="button" onclick="noteSubmit();">전송</button>';
        html += "</div>";
      }

      noteMainContainer.html(html);
      noteMainContainer.show();
      let noteMainBtn = $(".noteMainBtn");
      noteMainContent = $(".noteMainContent");
      noteMainBtn.css("width", Math.ceil(noteMainContent.width()));
      noteMainContent.scrollTop(noteMainContent[0].scrollHeight);
      noteListBadge();
    },
  });
}

function noteUserPage() {
  let noteUserContainer, noteMainContainer;

  noteUserContainer = $(".noteUserContainer");
  noteMainContainer = $(".noteMainContainer");
  noteUserContainer.show();
  noteMainContainer.hide();
  modal.noteHeadTitle.text("쪽지");
  storage.noteContentNo = "";
  noteListBadge();
}

function noteLiveUpdate() {
  let noteMainContainer,
    noteMainContent,
    html = "";
  noteMainContainer = $(".noteMainContainer");
  noteMainContent = $(".noteMainContent");

  if (noteMainContainer.css("display") === "block") {
    $.ajax({
      url: "/api/note/" + storage.noteContentNo,
      method: "get",
      dataType: "json",
      contentType: "text/plain",
      success: (resultData) => {
        if (resultData.result === "ok" && resultData.data !== null) {
          resultData = cipher.decAes(resultData.data);
          resultData = JSON.parse(resultData);

          for (let i = 0; i < resultData.length; i++) {
            let disDate = dateDis(resultData[i].sent);
            let setDate = dateFnc(disDate, "HH:mm:ss");

            if (resultData[i].writer == storage.noteContentNo) {
              html +=
                '<div class="chatYouInfo"><img src="/api/user/image/' +
                storage.noteContentNo +
                '"><span>' +
                storage.user[storage.noteContentNo].userName +
                " " +
                storage.userRank[storage.user[storage.noteContentNo].rank][0] +
                "</span></div>";
              html += '<div class="chatYou">' + resultData[i].msg + "</div>";
              html += '<div class="chatYouDate">' + setDate + "</div>";
            } else {
              html += '<div class="chatMe">' + resultData[i].msg + "</div>";
              html += '<div class="chatMeDate">' + setDate + "</div>";
            }
          }
          noteMainContent.append(html);
        }
      },
    });
  }

  timer = setTimeout("noteLiveUpdate()", 2000);
}

function textAreaKeyDown(e) {
  let key = event.key || event.keyCode;

  if (key === "Enter" && !event.ctrlKey && !event.shiftKey) {
    event.preventDefault();
    noteSubmit();
  } else if (key === "Enter" && event.shiftKey) {
    return true;
  } else if (key === "Enter" && event.ctrlKey) {
    $(e).val($(e).val() + "\n");
  }
}

function spanBadgeLocation(prevElement, badge) {
  let prevElementX, prevElementY;
  prevElementX = prevElement.position().left + 18;
  prevElementY = prevElement.position().top + 12;
  badge.css("left", prevElementX);
  badge.css("bottom", prevElementY);
}

function noteLiveBadge() {
  $.ajax({
    url: "/api/note",
    method: "get",
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      let infoMessageImg, badgeSpan;
      infoMessageImg = $(".infoMessageImg");

      if (result.data != null) {
        result = cipher.decAes(result.data);
        result = JSON.parse(result);

        $("#badgeSpan").remove();

        if (result.all > 0) {
          infoMessageImg
            .find("img")
            .after('<span class="badgeSpan" id="badgeSpan">' + result.all + "</span>");

          setTimeout(() => {
            badgeSpan = $("#badgeSpan");
            spanBadgeLocation($("#myInfoMessageImg"), badgeSpan);
            badgeSpan.css("display", "flex");
          }, 300);
        }
      }
    },
  });

  badgeTimer = setTimeout("noteLiveBadge()", 60000);
}

function noteListBadge() {
  $.ajax({
    url: "/api/note",
    method: "get",
    dataType: "json",
    contentType: "text/plain",
    success: (result) => {
      if (result.data != null) {
        let badgeSpan = $("#badgeSpan");
        result = cipher.decAes(result.data);
        result = JSON.parse(result);
        $(".noteItemBadge").remove();

        for (let key in result) {
          $('.noteUserLi[data-no="' + key + '"]').css("display", "flex");
          $('.noteUserLi[data-no="' + key + '"]').css("align-items", "center");
          $('.noteUserLi[data-no="' + key + '"]').append(
            '<span class="noteItemBadge">' + result[key] + "</span>"
          );
          $('.noteUserContentItem[data-no="' + key + '"]').append(
            '<span class="noteItemBadge">' + result[key] + "</span>"
          );
        }

        if (result.all > 0) {
          badgeSpan.text(result.all);
        } else {
          badgeSpan.remove();
        }
      }
      wd;
    },
  });
}

function stringNumberFormat(str) {
  let resultStr;

  if (str.length >= 10) {
    resultStr = str.substring(0, 10) + "...";
  } else {
    resultStr = str;
  }

  return resultStr;
}

function listRangeChange(e, drawList) {
  let thisEle;
  thisEle = $(e);
  thisEle.next().html(thisEle.val());
  if (thisEle.val() > 0) {
    storage.articlePerPage = thisEle.val();
  } else {
    storage.articlePerPage = undefined;
  }
  drawList();
}

function phoneFormat(e, type) {
  let thisEle,
    thisValue,
    formatNum = "";
  thisEle = $(e);
  thisValue = $(e).val().replaceAll("-", "");
  thisEle.attr("maxLength", 13);
  if (thisValue.length == 11) {
    if (type == 0) {
      formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3");
    } else {
      formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  } else if (thisValue.length == 8) {
    formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{4})(\d{4})/, "$1-$2");
  } else {
    if (thisValue.indexOf("02") == 0) {
      if (type == 0) {
        formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{4})(\d{4})/, "$1-****-$3");
      } else {
        formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
      }
    } else {
      if (type == 0) {
        formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-***-$3");
      } else {
        formatNum = thisValue.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      }
    }
  }

  thisEle.val(formatNum);
}

function validateEmail(email) {
  let filter, result;
  filter =
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  if (filter.test(email)) {
    result = true;
  } else {
    result = false;
  }

  return result;
}

function formDataSet(storageArr) {
  if (storageArr === undefined) {
    storageArr = storage.formList;
  }

  for (let key in storageArr) {
    let element = "";
    if ($("#" + key).length > 0) {
      element = $("#" + key);
    } else if ($('[name="' + key + '"]').length > 0) {
      if ($('[name="' + key + '"]:checked').length > 0) {
        element = $('[name="' + key + '"]:checked');
      } else {
        element = $('[name="' + key + '"]');
      }
    }

    if (element !== undefined && element !== "") {
      if (element.prop("tagName") === "TEXTAREA") {
        storageArr[key] = CKEDITOR.instances[key].getData().replaceAll("\n", "");
      } else {
        if (!element.data("change")) {
          if (typeof storageArr[key] === "number") {
            if (element.attr("type") === "date" || element.attr("type") === "datetime-local") {
              let dateTime = new Date(element.val()).getTime();
              storageArr[key] = dateTime;
            } else {
              if (element.val() === "") {
                storageArr[key] = 0;
              } else {
                storageArr[key] = parseInt(element.val().replaceAll(",", ""));
              }
            }
          } else {
            if (element.attr("type") === "date" || element.attr("type") === "datetime-local") {
              let dateTime = new Date(element.val()).getTime();
              storageArr[key] = dateTime;
            } else {
              storageArr[key] = element.val();
            }
          }
        }
      }
    }
  }
}

function addAutoComplete(e) {
  let thisEle, autoComplete;
  thisEle = e;

  if (!thisEle.readOnly) {
    if (document.getElementsByClassName("autoComplete")[0] !== undefined) {
      document.getElementsByClassName("autoComplete")[0].remove();
      thisEle.removeAttribute("data-value");
    }

    let createDiv = document.createElement("div");
    createDiv.className = "autoComplete";
    thisEle.after(createDiv);
    autoComplete = document.getElementsByClassName("autoComplete")[0];
    autoComplete.style.top = thisEle.offsetTop + 30 + "px";
    autoComplete.style.left = thisEle.offsetLeft + "px";
    autoComplete.style.width = thisEle.clientWidth + "px";

    if (thisEle.value === "") {
      for (let key in storage[thisEle.dataset.complete]) {
        let listDiv = document.createElement("div");
        listDiv.setAttribute("onclick", "autoCompleteClick(this);");

        if (
          thisEle.dataset.complete === "customer" ||
          thisEle.dataset.complete === "cip" ||
          thisEle.dataset.complete === "product"
        ) {
          if (thisEle.dataset.complete === "product") {
            listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
            listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
          } else {
            listDiv.dataset.value = key;
            listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
          }
        } else if (thisEle.dataset.complete === "user") {
          listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
          listDiv.innerHTML = storage[thisEle.dataset.complete][key].userName;
        } else if (thisEle.dataset.complete === "sopp" || thisEle.dataset.complete === "contract") {
          listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
          listDiv.innerHTML = storage[thisEle.dataset.complete][key].title;
        }

        autoComplete.append(listDiv);
      }
    } else {
      for (let key in storage[thisEle.dataset.complete]) {
        let listDiv = document.createElement("div");
        listDiv.setAttribute("onclick", "autoCompleteClick(this);");

        if (
          thisEle.dataset.complete === "customer" ||
          thisEle.dataset.complete === "cip" ||
          thisEle.dataset.complete === "product"
        ) {
          if (storage[thisEle.dataset.complete][key].name.indexOf(thisEle.value) > -1) {
            if (thisEle.dataset.complete === "product") {
              listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
              listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
            } else {
              listDiv.dataset.value = key;
              listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
            }
          }
        } else if (thisEle.dataset.complete === "user") {
          if (storage[thisEle.dataset.complete][key].userName.indexOf(thisEle.value) > -1) {
            listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
            listDiv.innerHTML = storage[thisEle.dataset.complete][key].userName;
          }
        } else if (thisEle.dataset.complete === "sopp" || thisEle.dataset.complete === "contract") {
          if (storage[thisEle.dataset.complete][key].title.indexOf(thisEle.value) > -1) {
            listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
            listDiv.innerHTML = storage[thisEle.dataset.complete][key].title;
          }
        }

        autoComplete.append(listDiv);
      }
    }
  }
}

function autoCompleteClick(e) {
  let thisEle, input, autoComplete;
  thisEle = e;
  input = thisEle.parentElement.previousSibling;
  autoComplete = document.getElementsByClassName("autoComplete")[0];
  input.value = thisEle.innerText;
  input.setAttribute("data-change", true);

  if (storage.formList !== undefined) {
    if (storage.formList[input.getAttribute("id")] !== undefined) {
      storage.formList[input.getAttribute("id")] = thisEle.dataset.value;
    }
  }

  input.setAttribute("data-value", thisEle.dataset.value);
  autoComplete.remove();
}

function validateAutoComplete(value, type) {
  let result = false;

  for (let key in storage[type]) {
    if (type === "customer" || type === "cip" || type === "product") {
      if (storage[type][key].name === value) {
        result = true;
      }
    } else if (type === "user") {
      if (storage[type][key].userName === value) {
        result = true;
      }
    } else if (type === "sopp" || type === "contract") {
      if (storage[type][key].title === value) {
        result = true;
      }
    }
  }

  return result;
}

function getStorageList() {
  if (storage.sopp === undefined) {
    $.ajax({
      url: "/api/sopp",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);
          storage.sopp = resultJson;
          console.log("[getSopp] Success getting sopp list.");
        }
      },
      error: () => {
        msg.set("sopp 에러");
      },
    });
  }

  if (storage.contract === undefined) {
    $.ajax({
      url: "/api/contract",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);
          storage.contract = resultJson;
          console.log("[getCont] Success getting cont list.");
        }
      },
      error: () => {
        msg.set("contract 에러");
      },
    });
  }

  if (storage.categories === undefined) {
    $.ajax({
      url: "/api/category",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);
          storage.categories = resultJson;
          console.log("[getCategory] Success getting category list.");
        }
      },
      error: () => {
        msg.set("category 에러");
      },
    });
  }

  if (storage.user === undefined) {
    $.ajax({
      url: "/api/user",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          let formatDatas = {};

          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);

          for (let i = 0; i < resultJson.length; i++) {
            formatDatas[resultJson[i].userNo] = resultJson[i];
          }

          storage.user = formatDatas;
          storage.my = sessionStorage.getItem("getUserNo");
          storage.myUserKey = storage.user[storage.my].userKey;
          storage.myUserRole = storage.user[storage.my].userRole;
          console.log("[getUser] Success getting user list.");
        }
      },
      error: () => {
        msg.set("user 에러");
      },
    });
  }

  if (storage.customer === undefined) {
    $.ajax({
      url: "/api/cust/custAllList",
      method: "get",
      dataType: "json",
      async: false,
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          let formatDatas = {};

          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);

          for (let i = 0; i < resultJson.length; i++) {
            formatDatas[resultJson[i].custNo] = resultJson[i];
          }

          storage.customer = formatDatas;
          console.log("[getCust] Success getting cust list.");
        }
      },
      error: () => {
        msg.set("cust 에러");
      },
    });
  }

  if (storage.cip === undefined) {
    $.ajax({
      url: "/api/system/cip",
      method: "get",
      dataType: "json",
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);
          storage.cip = resultJson;
          console.log("[getCip] Success getting cip list.");
        }
      },
      error: () => {
        msg.set("cip 에러");
      },
    });
  }

  if (storage.product === undefined) {
    $.ajax({
      url: "/api/product",
      method: "get",
      dataType: "json",
      async: false,
      cache: false,
      success: (result) => {
        if (result.result === "ok") {
          let resultJson;
          storage.productCust = [];
          resultJson = cipher.decAes(result.data);
          resultJson = JSON.parse(resultJson);
          storage.product = resultJson;

          for (let i = 0; i < resultJson.length; i++) {
            let item = resultJson[i];
            let datas = {};

            for (let key in item) {
              datas[key] = item[key];
            }

            datas.productName = item.productName + " : " + storage.customer[item.custNo].custName;
            storage.productCust.push(datas);
          }

          console.log("[getProduct] Success getting product list.");
        }
      },
      error: () => {
        msg.set("product 에러");
      },
    });
  }
}

function detailSetFormList(result) {
  storage.formList = {};
  for (let key in result) {
    if (key !== "attached" && key !== "schedules" && key !== "trades" && key !== "bills") {
      storage.formList[key] = result[key];
    }
  }
}

function detailTrueDatas(datas) {
  for (let i = 0; i < datas.length; i++) {
    if ($("#" + datas[i]).length > 0) {
      $("#" + datas[i]).attr("data-change", true);
    } else if ($('[name="' + datas[i] + '"]').length > 0) {
      $('[name="' + datas[i] + '"]').attr("data-change", true);
    }
  }
}

function radioTrueChange(e) {
  let thisEle, splitStr, thisEleName, thisEleId;
  thisEle = $(e);
  splitStr = thisEle.attr("id").split("_");
  thisEleName = splitStr[0];
  thisEleId = splitStr[1];

  for (let key in storage.formList[thisEleName]) {
    storage.formList[thisEleName][key] = false;
  }

  storage.formList[thisEleName][thisEleId] = true;
}

function checkTrueChange(e) {
  let thisEle, splitStr, thisEleName, thisEleId;
  thisEle = $(e);
  splitStr = thisEle.attr("id").split("_");
  thisEleName = splitStr[0];
  thisEleId = splitStr[1];

  if (thisEle.is(":checked")) {
    storage.formList[thisEleName][thisEleId] = true;
  } else {
    storage.formList[thisEleName][thisEleId] = false;
  }
}

function detailCheckedTrueView() {
  for (let key in storage.formList) {
    if (typeof storage.formList[key] === "object") {
      for (let key2 in storage.formList[key]) {
        if (storage.formList[key][key2]) {
          if ($("#" + key2) !== undefined) {
            $("#" + key2).attr("checked", "checked");
          } else if ($("#" + key + "_" + key2) !== undefined) {
            $("#" + key + "_" + key2).attr("checked", "checked");
          }
        }
      }
    }
  }
}

function setTabsLayOutMenu() {
  let tabs, tabItem, tabItemLength, width, temp;
  tabs = $(".tabs");
  tabItem = $(".tabItem");
  tabItemLength = tabItem.length;
  temp = tabItemLength * 2;

  for (let i = 0; i < tabItemLength; i++) {
    $(tabItem[i]).css("z-index", temp);
    temp -= 2;
    if (i > 0) {
      $(tabItem[i]).css("width", width + "%");
      $(tabItem[i]).css("padding-left", width * i + "%");
    } else {
      width = 100 / tabItemLength;
      $(tabItem[i]).css("width", width + "%");
    }
  }
}

function popup(e, nWidth, nHeight) {
  let winObj;
  let curX = window.screenLeft;
  let curY = window.screenTop;
  let curWidth = document.body.clientWidth;
  let curHeight = document.body.clientHeight;
  let nLeft = curX + curWidth / 2 - nWidth / 2;
  let nTop = curY + curHeight / 2 - nHeight / 2;
  let strOption = "";
  strOption += "left=" + nLeft + "px,";
  strOption += "top=" + nTop + "px,";
  strOption += "width=" + nWidth + "px,";
  strOption += "height=" + nHeight + "px,";
  strOption += "toolbar=no,menubar=no,location=no,";
  strOption += "resizable=yes,status=yes";

  if ($(e).attr("href") === undefined) {
    winObj = window.open($(e).data("href"), "", strOption);
  } else {
    winObj = window.open($(e).attr("href"), "", strOption);
  }

  if (winObj == null) {
    alert("팝업 차단을 해제해주세요.");
    return false;
  }
}

function inputDateFormat(e) {
  let thisEle = $(e);
  thisEle.val(thisEle.val().replace(/(\d\d\d\d)(\d\d)(\d\d)/g, "$1-$2-$3"));
}

function gridSetRowSpan(className, parentClassName) {
  let ele = $("." + className);

  if (parentClassName === undefined) {
    for (let i = 0; i < ele.length; i++) {
      let rows = $("." + className + ':contains("' + $(ele[i]).html() + '")');
      if (rows.length > 1) {
        rows.eq(0).css("grid-row", "span " + rows.length);
        rows.not(":eq(0)").remove();
      }
    }
  } else {
    for (let i = 0; i < parentClassName.length; i++) {
      for (let t = 0; t < ele.length; t++) {
        let rows = $("." + parentClassName[i]).find(
          "." + className + ':contains("' + $(ele[t]).html() + '")'
        );
        if (rows.length > 1) {
          rows.eq(0).css("grid-row", "span " + rows.length);
          rows.not(":eq(0)").remove();
        }
      }
    }
  }
}

function setViewContents(hideArr, showArr) {
  for (let i = 0; i < hideArr.length; i++) {
    let item = $("." + hideArr[i]);
    item.hide();
  }

  for (let i = 0; i < showArr.length; i++) {
    let item = $("." + showArr[i]);
    item.show();
  }
}

function setViewContentsCopy(hideArr, showArr) {
  for (let i = 0; i < hideArr.length; i++) {
    let item = document.getElementsByClassName(hideArr[i])[0];
    if (item !== undefined) {
      item.style.display = "none";
    }
  }

  for (let i = 0; i < showArr.length; i++) {
    let item = document.getElementsByClassName(showArr[i].element)[0];
    if (item !== undefined) {
      item.style.display = showArr[i].display;
    }
  }
}

function hideDetailView(func) {
  let defaultFormContainer, crudUpdateBtn, tabs;
  defaultFormContainer = document.getElementsByClassName("defaultFormContainer")[0];
  crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
  tabs = document.getElementsByClassName("tabs")[0];
  defaultFormContainer.remove();
  crudUpdateBtn.innerText = "수정";

  if (tabs !== undefined) {
    tabs.remove();
  }

  document.querySelector("input").value = "";

  if (func !== undefined) {
    func();
  }
}

function getJsonData(url, method, data) {
  if (url !== undefined && method !== undefined) {
    $.ajax({
      url: url,
      method: method,
      data: data,
      dataType: "json",
      contentType: "text/plain",
      success: (result) => {
        result = cipher.decAes(result.data);
        result = JSON.parse(result);
        createTabEstList(result.estimate[0].children);
      },
    });
  }
}

function textReset(content) {
  let inputType = content.querySelectorAll("input");
  let textareaType = content.querySelectorAll("textarea");

  for (let i = 0; i < inputType.length; i++) {
    let item = inputType[i];
    item.value = "";
  }

  for (let i = 0; i < textareaType.length; i++) {
    let item = textareaType[i];
    item.value = "";
  }
}

// 거래처 데이터리스트 set하는 함수 setCusDataList() Start =====================================================================================================================
function setCusDataList() {
  let id;
  if ($(".formNumHidden").val() == "") {
    id = storage.reportDetailData.formId;
  } else {
    id = storage.formList[$(".formNumHidden").val()].id;
  }

  let target = $("." + id + "_customer");
  for (let i = 0; i < target.length; i++) {
    let html = $("." + id + "_customer")[i].innerHTML;
    let x;
    let dataListHtml = "";

    // 거래처 데이터 리스트 만들기
    dataListHtml = "<datalist id='_customer'>";
    for (x in storage.customer) {
      dataListHtml +=
        "<option data-value='" + x + "' value='" + storage.customer[x].name + "'></option> ";
    }
    dataListHtml += "</datalist>";
    html += dataListHtml;
    $("." + id + "_customer")[i].innerHTML = html;
    $("." + id + "_customer").attr("list", "_customer");
  }
}
