
class Contract {
    constructor(each) {
        if (each != undefined) {
            this.no = each.no;
            this.coWorker = each.coWorker == undefined ? [] : JSON.parse(each.coWorker);
            this.created = each.created;
            this.trades = each.trades == undefined ? null : each.trades;
            this.title = each.title;
            this.employee = each.employee;
            this.related = each.related;
            this.schedules = each.schedules;
            this.attached = each.attached == undefined ? [] : each.attached;
            this.approvedAttached = each.approvedattached == undefined ? [] : each.approvedattached;
            this.suppliedAttached = each.suppliedattached == undefined ? [] : each.suppliedattached;
            this.modified = each.modified;
            this.amount = each.amount;
            this.taxInclude = each.taxInclude;
            this.bills = each.bills;
            this.profit = each.profit;
            this.maintenance = each.maintenance == undefined ? [] : JSON.parse(each.maintenance);
            this.customer = each.customer;
            this.supplied = each.supplied == undefined ? 0 : each.supplied;
            this.approved = each.approved == undefined ? 0 : each.approved;
            this.saleDate = each.saleDate == undefined ? 0 : each.saleDate;
            this.appLine = each.appLine;
            this.docNo = each.docNo;
        }
        else {
            this.title = "";
            this.employee = 0;
            this.amount = "";
            this.customer = 0;
        }
    }

    drawNone() {

        let target = document.getElementsByClassName("sopp-contract")[0];
        let origin = document.getElementsByClassName("detail-wrap")[0];

        if (origin != undefined) origin.remove();

        let cnt, el, el2;
        el = document.createElement("div");
        el.className = "detail-wrap";
        target.appendChild(el);
        cnt = document.getElementsByClassName("detail-wrap")[0];


        el = document.createElement("top");
        el.className = "contract-top";
        cnt.appendChild(el);

        let ctrtTop = document.getElementsByClassName("contract-top")[0];
        el = document.createElement("div");
        ctrtTop.appendChild(el);

        // 계약 진척도 - 판매보고
        el = document.createElement("bar");
        el.className = "contract-progress"
        ctrtTop.appendChild(el);

        el2 = document.createElement("div");
        el.append(el2);
        el2.innerText = "판매보고";


        // 계약 진척도 - 계약서 
        el2 = document.createElement("div");
        el.append(el2);
        el2.innerText = "계약";


        // 계약 진척도 - 납품 
        el2 = document.createElement("div");
        el.append(el2);
        el2.innerText = "납품";

        // 계약 진척도 - 검수
        el2 = document.createElement("div");
        el.append(el2);
        el2.innerText = "검수";



        // 진척도 아래 상세 detail Start --------------------------------------------------------------------------------------------------------------------------------------
        // 계약명
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "계약명";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);

        //거래처 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "매출처";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);


        // 담당자
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "담당자";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);


        // 계약금액 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "계약 금액";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);

    }

    draw(cnt) {
        let el, child;

        if (cnt === undefined && this.cnt !== undefined) cnt = this.cnt;
        else if (cnt !== undefined && this.cnt === undefined) this.cnt = cnt;
        else if (cnt === undefined && this.cnt === undefined) return;

        // 프로젝트 래퍼 클래스명 지정 및 데이터 타입 데이터 번호 세팅
        cnt.className = "contract-wrap";
        cnt.dataset.data = "contract";
        cnt.dataset.no = this.no;
        cnt.innerHTML = "";

        // 프로젝트 컨테이너 앞에 히든 라디오 삽입
        if (cnt.previousElementSibling === null || cnt.previousElementSibling.className !== "_hidden") {
            el = document.createElement("input");
            el.type = "radio";
            el.className = "_hidden";
            el.name = "contract";
            el.id = "contract" + this.no;
            cnt.parentElement.insertBefore(el, cnt);
        }

        // 등록일 / 계약명 / 담당자 / 계약금액 / 계약상태 (판매보고 / 계약서 / 납품 / 검수 ) / 유지보수 기간 
        // 레이블 엘리먼트 생성
        el = document.createElement("label");
        cnt.appendChild(el);
        el.className = "contract-box";
        el.setAttribute("for", "contract" + this.no);
        //el.setAttribute("onclick", "drawDetail(this)");
        el.addEventListener("click", function () {
            let no = this.parentElement.dataset.no;
            fetch(location.origin + "/api/contract/" + no)
                .catch((error) => console.log("error:", error))
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    let data;
                    if (response.result === "ok") {
                        data = response.data;
                        data = cipher.decAes(data);
                        data = JSON.parse(data);
                        console.log(data);
                        R.contract = new Contract(data);
                        R.contract.getReportDetail(this);

                    } else {
                        console.log(response.msg);
                    }
                });
        });

        // el.addEventListener("click", function () {
        // 	let contractno = this.getAttribute("for").substring(8);
        // 	// let contracts = R.contracts.list;
        // 	// for (let i = 0; i < contracts.length; i++) {
        // 	// 	if (contracts[i].no == contractno) {
        // 	// 		R.contract = contracts[i];
        // 	// 		R.contract.getReportDetail(this);
        // 	// 	}
        // 	// }
        // });

        child = document.createElement("div");
        el.appendChild(child);
        child.innerText = getYmdSlashShort(this.created);

        child = document.createElement("name");
        el.appendChild(child);
        child.innerText = this.title;

        child = document.createElement("div");
        el.appendChild(child);
        child.innerText = storage.customer[this.customer].name;

        child = document.createElement("div");
        el.appendChild(child);
        child.innerText = storage.user[this.employee].userName;

        child = document.createElement("div");
        el.appendChild(child);
        child.innerText = this.amount.toLocaleString() + "원";

    }


    //다른 곳에 가서 그리는 경우 
    // setCntNum(soppNo) {
    //     let contNo;
    //     for (let i = 0; i < storage.contract.length; i++) {
    //         let contSopp = JSON.parse(storage.contract[0].related).parent.split(":");
    //         if (contSopp[1] == soppNo) {
    //             contNo = storage.contract[i].no;
    //         }
    //     }

    //     let cnt = document.getElementsByClassName("sopp-contract")[0];
    //     fetch(location.origin + "/api/contract/" + no)
    //         .catch((error) => console.log("error:", error))
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response);
    //             let data;
    //             if (response.result === "ok") {
    //                 data = response.data;
    //                 data = cipher.decAes(data);
    //                 data = JSON.parse(data);
    //                 console.log(data);
    //                 R.contract = new Contract(data);
    //                 R.contract.getReportDetail(cnt);

    //             } else {
    //                 console.log(response.msg);
    //             }
    //         });
    // }


    drawDetail() {

        let target = document.getElementsByClassName("sopp-contract")[0];
        let origin = document.getElementsByClassName("detail-wrap")[0];

        if (origin != undefined) origin.remove();

        let cnt, el, el2;
        el = document.createElement("div");
        el.className = "detail-wrap";
        target.appendChild(el);
        cnt = document.getElementsByClassName("detail-wrap")[0];


        el = document.createElement("top");
        el.className = "contract-top";
        cnt.appendChild(el);

        let ctrtTop = document.getElementsByClassName("contract-top")[0];

        el = document.createElement("div");
        ctrtTop.appendChild(el);

        // 계약 진척도 - 판매보고
		el = document.createElement("bar");
		el.className = "contract-progress"
		ctrtTop.appendChild(el);

		el2 = document.createElement("div");
		el.append(el2);

		if (this.appLine.length > 0 && this.appLine[this.appLine.length - 1].rejected != null) {
			el2.className = "contract-fail";
		} else if (this.appLine.length > 0 && this.appLine[this.appLine.length - 1].approved != null) {
			el2.className = "contract-done";
		} else {
			el2.className = "contract-doing";
		}


		el2.innerText = "판매보고";


		// 계약 진척도 - 계약서 
		el2 = document.createElement("div");
		el.append(el2);

		if (this.attached.length != 0) {
			el2.className = "contract-done";
		} else {
			if ($(".contract-progress").children()[0].className == "contract-done") {
				el2.className = "contract-doing";
			}
		}
		el2.innerText = "계약";


		// 계약 진척도 - 납품 
		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied == 0 && this.attached.length > 0) {
			el2.className = "contract-doing";
		} else if (this.attached.length > 0 && this.supplied != 0) {
			el2.className = "contract-done";
		}
		el2.innerText = "납품";


		// 계약 진척도 - 검수
		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied != 0 && this.approved == 0) {
			el2.className = "contract-doing";
		} else if (this.supplied != 0 && this.approved != 0) {
			el2.className = "contract-done";
		}
		el2.innerText = "검수";

		el = document.createElement("div");
		ctrtTop.appendChild(el);
		el.className = "crudBtns";
		el.innerHTML = "<Button data-detail='" + this.no + "'onclick='this.parentElement.parentElement.parentElement.remove()'><i class='fa-solid fa-xmark'></i></Button>";



        // el = document.createElement("div");
        // ctrtTop.appendChild(el);
        // el.className = "crudBtns";
        // el.innerHTML = "<Button data-detail='" + this.no + "'onclick='this.parentElement.parentElement.parentElement.remove()'><i class='fa-solid fa-xmark'></i></Button>";



        // 진척도 아래 상세 detail Start --------------------------------------------------------------------------------------------------------------------------------------
        // 계약명
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "계약명";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = this.title;
        //거래처 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "매출처";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = storage.customer[this.customer].name;

        // 담당자
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "담당자";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = storage.user[this.employee].userName;



        // 계약금액 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "계약 금액";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = this.amount.toLocaleString() + "원";

        // 유지보수 
        if (this.maintenance.length > 0) {
            el = document.createElement("div");
            cnt.appendChild(el);

            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);
            el.innerText = "유지 보수";

            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);

            let mtnc = this.maintenance;
            let mtncList = "";
            for (let i = 0; i < mtnc.length; i++) {
                if (i > 0) {
                    mtncList += ","
                }
                mtncList +=
                    "<div><div>" + getYmdSlashShort(mtnc[i].startDate) + "</div>" +
                    "<div>" + "\u00A0" + "~" + "\u00A0" + "</div>" +
                    "<div>" + getYmdSlashShort(mtnc[i].endDate) + "</div><input type='checkbox' data-id='" + mtnc[i].no + "'>";

            } mtncList += "(90일 이전 자동 생성)</div>"
            cnt.children[cnt.children.length - 1].children[1].innerHTML = mtncList;

        }

        // 판매보고 분류 타이틀 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.className = "salesReportTitle";
        el.innerText = "판매보고";
        el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2; padding : 0;background-color : rgb(128,140,255);color:white");



        if (this.docNo != undefined) {

            cnt = document.getElementsByClassName("detail-wrap")[0];
            let appLine = this.appLine;

            el = document.createElement("div");
            cnt.appendChild(el);

            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);
            el.innerText = "수주 판매 보고";

            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);

            for (let i = 0; i < appLine.length; i++) {
                el = document.createElement("div");
                cnt.children[cnt.children.length - 1].children[1].appendChild(el);
                if (i == 0) {
                    el.innerText = "[작성]" + storage.user[appLine[i].employee].userName;
                } else {
                    let appType = appLine[i].appType;
                    if (appType == 0) {
                        appType = "검토";
                    } else if (appType == 2) {
                        appType = "결재";
                    } else if (appType == 3) {
                        appType = "수신";
                    } else if (appType == 4) {
                        appType = "참조";
                    }
                    el.innerText = "\u00A0" + "▶" + "\u00A0" + "[" + appType + "]" + storage.user[appLine[i].employee].userName;
                }

            }
            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].children[1].appendChild(el);
            el.innerText = "(" + this.docNo + ")";
            el.setAttribute("onclick", "openPreviewTab()");
            el.style.color = "blue";
            el.style.cursor = "pointer";

        }


        // 계약서 분류 타이틀 
        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.className = "contractTitle";
        el.innerText = "계약서";
        el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2; padding : 0;background-color : rgb(128,140,255);color:white");


        el = document.createElement("div");
        cnt.appendChild(el);

        // 계약서 상세 
        if ($(".contract-progress").children()[1].className == "contract-done") {
            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);
            el.innerText = "계약서";

            el = document.createElement("div");
            cnt.children[cnt.children.length - 1].appendChild(el);
            // el.setAttribute("style", "flex-direction : column");



            let inputHtml = "<div class='filePreview'></div><input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedcontract' id='attached' onchange='R.contract.fileChange(this)'>";

            cnt.children[cnt.children.length - 1].children[1].innerHTML = inputHtml;


            // 계약서 (첨부파일)
            if (this.attached.length > 0) {
                let files = "";
                el = document.getElementsByClassName("filePreview")[0];
                for (let i = 0; i < this.attached.length; i++) {
                    files +=
                        "<div><a href='/api/attached/contract/" +
                        this.no +
                        "/" +
                        encodeURI(this.attached[i].fileName) +
                        "'>" +
                        this.attached[i].fileName +
                        "</a></div>";
                }


                el.innerHTML = files;

            }
        }


        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.className = "suppliedTitle";
        el.innerText = "납품";
        el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2; padding : 0;background-color : rgb(128,140,255);color:white");


        el = document.createElement("div");
        cnt.appendChild(el);
        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.className = "approvedTitle";
        el.innerText = "검수";
        el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2; padding : 0;background-color : rgb(128,140,255);color:white");

        if (this.attached.length > 0 || this.supplied != 0) { this.drawSuppliedData(); }

        if (this.suppliedAttached.length > 0 || this.supplied != 0) { this.drawApprovedData(); }


    }



    drawSuppliedData() {
        $(".contract-progress").children()[1].className = "contract-done";
        $(".contract-progress").children()[2].className = "contract-doing";
        let el, cnt;
        cnt = document.getElementsByClassName("suppliedTitle")[0];

        el = document.createElement("div");
        cnt.parentElement.after(el);
        el.className = "suppliedDetail";
        el.setAttribute("style", "display :grid;grid-template-columns: 20% 10% 20% 50% ");

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "납품일자";


        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<input class='suppliedDate'type='date'/>";

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "납품 관련 문서";
        el.setAttribute("style", "background-color: #eef1fb;font-weight: 500;");

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<div class='filePreview'></div>" +
            "<div><input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedsupplied' id='attached' onchange='R.contract.fileChange(this)' ></div>";


        if (this.suppliedAttached.length != 0) {
            let target = document.getElementsByClassName("filePreview")[1];
            let files = "";
            for (let i = 0; i < this.suppliedAttached.length; i++) {
                files +=
                    "<div><a href='/api/attached/supplied/" +
                    this.no +
                    "/" +
                    encodeURI(this.suppliedAttached[i].fileName) +
                    "'>" +
                    this.suppliedAttached[i].fileName +
                    "</a></div>";

            }
            target.innerHTML = files;

            if (document.getElementsByClassName("approvedDetail") == undefined) {

                this.drawApprovedData();
            }


        }
        console.log(this.supplied);
        if (this.supplied != 0) {
            document.getElementsByClassName("suppliedDate")[0].value = getYmdHypen(this.supplied);
        }

    }


    drawApprovedData() {

        $(".contract-progress").children()[2].className = "contract-done";

        if (this.approvedAttached.length == 0) {
            $(".contract-progress").children()[3].className = "contract-doing";
        } else {
            $(".contract-progress").children()[3].className = "contract-done";
        }


        let el, cnt;
        cnt = document.getElementsByClassName("approvedTitle")[0];

        el = document.createElement("div");
        cnt.parentElement.after(el);
        el.className = "approvedDetail";
        el.setAttribute("style", "display :grid;grid-template-columns: 20% 10% 20% 50% ");

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "검수일자";


        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<input class='approvedDate'type='date'/>";

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "검수 관련 문서";
        el.setAttribute("style", "background-color: #eef1fb;font-weight: 500;");

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<div class='filePreview'></div>" +
            "<div><input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedapproved' id='attached' onchange='R.contract.fileChange(this)' ></div>";



        if (this.approvedAttached.length != 0) {
            let target = document.getElementsByClassName("filePreview")[2];
            let files = "";
            for (let i = 0; i < this.approvedAttached.length; i++) {
                files +=
                    "<div><a href='/api/attached/approved/" +
                    this.no +
                    "/" +
                    encodeURI(this.approvedAttached[i].fileName) +
                    "'>" +
                    this.approvedAttached[i].fileName +
                    "</a></div>";

            }
            target.innerHTML = files;

            $(".contract-progress").children()[2].className = "contract-done";

        }

        if (this.approved != 0) {
            document.getElementsByClassName("approvedDate")[0].value = getYmdHypen(this.approved);

        }


    }

    getReportNo(obj) {

        let sopp = JSON.parse(this.related);
        sopp = sopp.parent.split(":")[1];
        let docNo;
        fetch(apiServer + "/api/gw/salesReport/" + sopp)
            .catch((error) => console.log("error:", error))
            .then(response => response.json())
            .then(response => {

                if (response.result === "ok") {
                    docNo = response.docNo;
                    docNo = cipher.decAes(docNo);
                    this.getReportDetail(docNo, obj);

                } else {
                    storage.reportDetailData = "";
                    this.drawDetail(obj);
                    console.log(response.msg);
                }
            });

    }

    getReportDetail(obj) {

        if (this.docNo != undefined) {
            fetch(apiServer + "/api/gw/app/doc/" + this.docNo)
                .catch((error) => console.log("error:", error))
                .then(response => response.json())
                .then(response => {
                    let data;
                    if (response.result === "ok") {
                        data = response.data;
                        data = cipher.decAes(data);
                        data = JSON.parse(data);
                        storage.reportDetailData = data;
                        this.drawDetail(obj);
                    } else {
                        storage.reportDetailData = "";
                        this.drawDetail(obj);
                        console.log(response.msg);
                    }
                });
        }
        storage.reportDetailData = "";
        this.drawDetail(obj);

    }

    remove() {

        let contractNo = this.no;
        if (confirm("삭제하시겠습니까?")) {
            fetch(apiServer + "/api/contract/" + contractNo, { method: "DELETE" })
                .catch((error) => console.log("error:", error))
                .then(response => response.json())
                .then(response => {
                    let radio, ctrtWrap;
                    if (response.result === "ok") {
                        alert("삭제되었습니다");
                        radio = document.getElementById("contract" + contractNo);
                        radio.remove();
                        ctrtWrap = document.getElementsByClassName("contract-wrap");
                        for (let i = 0; i < ctrtWrap.length; i++) {
                            if (ctrtWrap[i].dataset.no == contractNo) {
                                ctrtWrap[i].remove();
                            }
                        }
                    } else {
                        alert("삭제 실패")
                    }
                });
        }


    }


    fileChange(obj) {

        let method, data, type, attached, name;
        attached = obj.files;
        name = obj.name.split("attached")[1];
        console.log(name);
        if (storage.attachedList === undefined || storage.attachedList <= 0) {
            storage.attachedList = [];
        }
        let fileName = "";
        let idx;
        if (name == "contract") {
            idx = 0;
        } else if (name == "supplied") {
            idx = 1;
        } else if (name == "approved") {
            idx = 2;
        }

        if (name == "contract") {
            fileName = document.getElementsByClassName("filePreview")[0].children[0] == undefined ? "" : document.getElementsByClassName("filePreview")[0].children[0].children[0].innerHTML;
        } else if (name == "supplied") {
            fileName = document.getElementsByClassName("filePreview")[1].children[0] == undefined ? "" : document.getElementsByClassName("filePreview")[1].children[0].children[0].innerHTML;
        } else if (name == "approved") {
            fileName = document.getElementsByClassName("filePreview")[2].children[0] == undefined ? "" : document.getElementsByClassName("filePreview")[2].children[0].children[0].innerHTML;
        }

        let fileDataArray = storage.attachedList;

        if (fileName != "") {
            fetch(apiServer + "/api/attached/" + name + "/" + this.no + "/" + fileName, { method: "DELETE" })
                .catch((error) => console.log("error:", error))
                .then(response => response.json())
                .then(response => {
                    if (response.result === "ok") {

                    } else console.log(response.msg);
                });
        }

        document.getElementsByClassName("filePreview")[idx].innerHTML = "";
        for (let i = 0; i < attached.length; i++) {


            let reader = new FileReader();
            let fileName;

            fileName = attached[i].name;
            // 파일 중복 등록 제거
            if (!fileDataArray.includes(fileName)) {
                storage.attachedList.push(fileName);

                reader.onload = (e) => {
                    let binary,
                        x,
                        fData = e.target.result;
                    const bytes = new Uint8Array(fData);
                    binary = "";
                    for (x = 0; x < bytes.byteLength; x++)
                        binary += String.fromCharCode(bytes[x]);
                    let fileData = cipher.encAes(btoa(binary));
                    let fullData = fileName + "\r\n" + fileData;

                    let url = "/api/attached/" + name + "/" + this.no;
                    url = url;
                    method = "post";
                    data = fullData;
                    type = "insert";

                    crud.defaultAjax(
                        url,
                        method,
                        data,
                        type,
                        submitFileSuccess,
                        submitFileError
                    );
                };

                reader.readAsArrayBuffer(attached[i]);
            }

        }

        let files = "";
        for (let i = 0; i < attached.length; i++) {
            let el = document.createElement("div");
            document.getElementsByClassName("filePreview")[idx].appendChild(el);
            files = "<a href='/api/attached/contract/" + this.no + "/" +
                encodeURI(attached[i].name) +
                "'>" +
                attached[i].name +
                "</a>";
            el.innerHTML = files;

        }

        if (name == "contract") {
            if (document.getElementsByClassName("suppliedDetail").length == 0) {
                this.drawSuppliedData();
            }

        } else if (name == "supplied") {
            if (document.getElementsByClassName("approvedDetail").length == 0) {
                this.drawApprovedData();
            }
        } else if (name == "approved") {

            $(".contract-progress").children()[3].className = "contract-done";

        }

    }

} 
