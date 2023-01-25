class Contracts {
    constructor(_server, cnt) {
        this.list = [];
        this.container = cnt;
        fetch(_server + "/api/contract")
            .catch((error) => console.log("error:", error))
            .then(response => response.json())
            .then(response => {
                let data, arr, x;
                if (response.result !== "ok") console.log(response.msg);
                else {
                    data = cipher.decAes(response.data);
                    arr = JSON.parse(data);
                    for (x = 0; x < arr.length; x++)	R.contracts.addContract(new Contract(arr[x]));
                }
                storage.currentPage = 1;
                R.contracts.draw();
            });

    }
    addContract(ctrt) { this.list.push(ctrt); }

    draw() {
        let el, cnt;
        cnt = this.container;
        cnt.innerHTML = "";

        el = document.createElement("div");
        cnt.appendChild(el);
        el = document.createElement("div");
        cnt.children[0].appendChild(el);
        el.innerText = "등록일";
        el = document.createElement("div");
        cnt.children[0].appendChild(el);
        el.innerText = "계약명";
        el = document.createElement("div");
        cnt.children[0].appendChild(el);
        el.innerText = "거래처";
        el = document.createElement("div");
        cnt.children[0].appendChild(el);
        el.innerText = "담당자";
        el = document.createElement("div");
        cnt.children[0].appendChild(el);
        el.innerText = "계약금액";
        if (storage.articlePerPage == undefined) {
            storage.articlePerPage = (calWindowLength() - 2);
        }

        let page = storage.currentPage * storage.articlePerPage;

        let x, ctrt, svg;
        svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
        for (x = (storage.currentPage - 1) * storage.articlePerPage; x < page; x++) {
            ctrt = this.list[x];
            el = document.createElement("div");
            this.container.appendChild(el);
            ctrt.draw(el);
        }

        let result = paging(this.list.length, storage.currentPage, storage.articlePerPage);
        let pageContainer = $(".pageContainer");
        let pageNation = createPaging(
            pageContainer[0],
            result[3],
            "pageMove",
            "drawContractList",
            result[0]
        );
        pageContainer[0].innerHTML = pageNation;
    }
}



class Contract {
    constructor(each) {
        if (each != undefined) {
            this.no = each.no;
            this.coWorker = each.coWorker == undefined ? undefined : JSON.parse(each.coWorker);
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
            this.supplied = each.supplied;
            this.approved = each.approved;
            this.saleDate = each.saleDate;
            this.appLine = each.appLine;
            this.docNo = each.docNo;
            this.container = null;
        } else {
            this.title = "";
            this.employee = null;
            this.amount = "";
            this.customer = null;
            this.container = null;
        }
    }

    drawNone() {
        let target = document.getElementsByClassName("sopp-contract")[0];
        let origin = document.getElementsByClassName("detail-wrap")[0];

        if (origin != undefined) origin.remove();

        let cnt, el, el2;
        // el = document.createElement("div");
        // el.className = "detail-wrap";
        // target.appendChild(el);
        //cnt = document.getElementsByClassName("detail-wrap")[0];
        cnt = target;

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
        el.setAttribute("style", "justify-content: center;background-color:white; text-align:center;grid-column :span 2;");
        el.innerText = "진행 사항이 없습니다";

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);

        // //거래처 
        // el = document.createElement("div");
        // cnt.appendChild(el);

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);
        // el.innerText = "매출처";

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);


        // // 담당자
        // el = document.createElement("div");
        // cnt.appendChild(el);

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);
        // el.innerText = "담당자";

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);


        // // 계약금액 
        // el = document.createElement("div");
        // cnt.appendChild(el);

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);
        // el.innerText = "계약 금액";

        // el = document.createElement("div");
        // cnt.children[cnt.children.length - 1].appendChild(el);

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

    drawDetail(obj) {

        let target = document.getElementsByClassName("sopp-contract")[0];
        let origin = document.getElementsByClassName("detail-wrap")[0];

        if (origin != undefined) { origin.remove(); }

        let cnt, el, el2;

        if (obj.className == "sopp-contract") {
            cnt = document.getElementsByClassName("sopp-contract")[0];
            this.container = cnt;
        } else {
            el = document.createElement("div");
            el.className = "detail-wrap";
            obj.after(el);
            cnt = document.getElementsByClassName("detail-wrap")[0];
            this.container = cnt;
        }

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
        if (el2.previousElementSibling.className == "contract-done") {
            if (this.attached.length != 0) {
                el2.className = "contract-done";
            } else {
                el2.className = "contract-doing";

            }
        }

        el2.innerText = "계약";


        // 계약 진척도 - 납품 
        el2 = document.createElement("div");
        el.append(el2);

        if (el2.previousElementSibling.className == "contract-done") {
            if (this.supplied != undefined || this.suppliedAttached.length > 0) {
                el2.className = "contract-done";
            } else {
                el2.className = "contract-doing";
            }
        }

        el2.innerText = "납품";


        // 계약 진척도 - 검수
        el2 = document.createElement("div");
        el.append(el2);
        if (el2.previousElementSibling.className == "contract-done") {
            if (this.approved != undefined || this.approvedAttached.length > 0) {
                el2.className = "contract-done";
            } else {
                el2.className = "contract-doing";
            }
        }
        el2.innerText = "검수";



        if (obj.className != "sopp-contract") {
            el = document.createElement("div");
            ctrtTop.appendChild(el);
            el.className = "crudBtns";
            el.innerHTML = "<Button data-detail='" + this.no + "'onclick='this.parentElement.parentElement.parentElement.remove()'><i class='fa-solid fa-xmark'></i></Button>";
        }

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



        let appLine = this.appLine;

        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "수주 판매 보고";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        if (this.docNo != undefined) {
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
            el = document.createElement("button");
            cnt.children[cnt.children.length - 1].children[1].appendChild(el);
            el.innerText = "결재 문서 조회";
            el.addEventListener("click", () => {
                window.open("/business/contract/popup/" + storage.reportDetailData.docNo, "미리보기", "width :210mm");
            })

            el.setAttribute("style", "background-color: #eef1fb;color:blue;cursor:pointer;margin: 0 0.5rem;");

        } else {
            el.innerText = "-";
        }

        el = document.createElement("div");
        cnt.appendChild(el);

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "유지 보수";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.setAttribute("style", "display:grid");

        if (this.maintenance.length > 0) {
            let mtnc = this.maintenance;

            for (let i = 0; i <= mtnc.length - 1; i++) {
                let mtncList = "";
                // if (i > 0) {
                //     mtncList += "<div>,</div>"
                // }
                el2 = document.createElement("div");
                el.appendChild(el2);
                let product, title, customer, startDate, endDate, engineer, amount, related;
                if (mtnc[i].product != 0) {
                    for (let x in storage.product) {
                        if (mtnc[i].product == storage.product[x].no) {
                            product = storage.product[x].name;
                        }
                    }
                } else {
                    product = "-";

                }
                title = mtnc[i].title;
                customer = mtnc[i].customer != undefined ? storage.customer[mtnc[i].customer].name : "";
                related = mtnc[i].related;
                startDate = (mtnc[i].startDate != null && mtnc[i].startDate != "" && mtnc[i].startDate != undefined) ? getYmdSlashShort(mtnc[i].startDate) : "검수일";
                if (startDate == "검수일") {
                    endDate = startDate + "\u00A0" + related;
                } else {

                    endDate = (mtnc[i].endDate != null && mtnc[i].endDate != "" && mtnc[i].endDate != undefined) ? getYmdSlashShort(mtnc[i].endDate) : "";

                }

                engineer = mtnc[i].engineer != undefined ? storage.user[mtnc[i].engineer].userName : "";
                amount = (mtnc[i].amount != undefined && mtnc[i].amount != 0) ? mtnc[i].amount.toLocaleString() + "원" : " 무상";
                mtncList +=
                    "<div>" + title + "\u00A0" + "(</div>" +
                    "<div>" + "\u00A0" + product + "\u00A0" + "/</div>" +
                    // "<div>" + "\u00A0" + customer + "\u00A0" + "/</div>" +
                    "<div>" + "\u00A0" + startDate + "\u00A0" + "</div>" +
                    "<div>" + "\u00A0" + "\u00A0" + "~" + "\u00A0" + "</div>" +
                    "<div>" + "\u00A0" + endDate + "\u00A0" + "/</div>" +
                    "<div>" + "\u00A0" + engineer + "\u00A0" + ")" + "\u00A0" + "</div>" +
                    "<div>" + amount + "\u00A0" + "</div>";
                // "<input type='checkbox' data-id='" + mtnc[i].no + "'>";
                // mtncList += "(90일 이전 자동 생성)"

                el2.innerHTML = mtncList;

            }

            // el2.innerHTML = mtncList;

        } else {
            el.innerText = "-";
        }



        el = document.createElement("div");
        cnt.appendChild(el);
        let disabledDiv = el;


        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        el.innerText = "계약서";

        el = document.createElement("div");
        cnt.children[cnt.children.length - 1].appendChild(el);
        // el.setAttribute("style", "flex-direction : column");


        let inputHtml = "<div class='filePreview'></div><label>파일첨부<input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedcontract' id='attached' onchange='R.contract.fileChange(this)' style='display:none'></input></label>";

        cnt.children[cnt.children.length - 1].children[1].innerHTML = inputHtml;
        if ($(".contract-progress").children()[0].className != "contract-done") {
            disabledDiv.setAttribute("style", "color : grey");
            let input = document.getElementsByClassName("dropZone")[0];
            input.setAttribute("disabled", true);
            input.parentElement.setAttribute("style", "color:grey");
        } else {
            let input = document.getElementsByClassName("dropZone")[0];
            input.parentElement.setAttribute("style", "color:blue;background-color:#eef1fb;cursor:pointer;margin: 0 0.5rem;");
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



        this.drawSuppliedData(obj);

        this.drawApprovedData(obj);



        for (let i = 1; i < 5; i++) {
            let parent = document.getElementsByClassName("sopp-contract")[0];
            if (parent != undefined) {
                parent.children[i].setAttribute("style", "display:none");
            }

        }

    }


    // 납품 관련 데이터 그리는 함수 
    drawSuppliedData(obj) {
        let el, el2, cnt;

        if (obj.className == "sopp-contract") {
            cnt = document.getElementsByClassName("sopp-contract")[0];
        } else {
            cnt = document.getElementsByClassName("detail-wrap")[0];
        }

        el = document.createElement("div");
        cnt.appendChild(el);

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "납품일자";

        el = document.createElement("div");
        cnt.appendChild(el);

        el2 = document.createElement("input");
        el2.setAttribute("type", "date");
        el2.setAttribute("class", "suppliedDate");
        el2.setAttribute("disabled", "disabled");

        el.appendChild(el2);

        el2 = document.createElement("button");
        el2.innerHTML = "일자 선택";
        el2.addEventListener("click", () => {
            R.sche = new Schedule();
            R.sche.popupModalForEdit(new Date(), true);
            document.getElementById("schedule-type2h").setAttribute("checked", "checked");
            document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].value = this.title + "\u00A0" + "납품";
            modal.confirm[0].onclick = () => {
                R.sche.clickedScheduleModalConfirm();
                insertDate();
            }

        })

        el.appendChild(el2);



        if (obj.className == "sopp-contract") {
            cnt = document.getElementsByClassName("sopp-contract")[0];
        } else {
            cnt = document.getElementsByClassName("detail-wrap")[0];
        }

        el = document.createElement("div");
        cnt.appendChild(el);

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "납품 관련 문서";
        el.setAttribute("style", "font-weight: 500;");

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<div class='filePreview'></div>" +
            "<div><label>파일첨부<input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedsupplied' id='attached' onchange='R.contract.fileChange(this)' style='display:none;'></input></div>";

        if ($(".contract-progress").children()[1].className != "contract-done") {
            cnt.setAttribute("style", "color : grey");
            let input = document.getElementsByClassName("dropZone")[1];
            input.setAttribute("disabled", true);
            let date = document.getElementsByClassName("suppliedDate")[0];
            date.setAttribute("disabled", true);
            date.setAttribute("style", "color:grey");
            date.parentElement.parentElement.setAttribute("style", "color:grey")
        } else {
            let input = document.getElementsByClassName("dropZone")[1];
            input.parentElement.setAttribute("style", "color:blue;background-color:#eef1fb;cursor:pointer;margin: 0 0.5rem;");

        }

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

        }

        if (this.supplied != undefined) {
            document.getElementsByClassName("suppliedDate")[0].value = getYmdHypen(this.supplied);
        }

    }

    // 검수 관련 데이터 그리는 함수 
    drawApprovedData(obj) {
        let el, el2, cnt;
        if (obj.className == "sopp-contract") {
            cnt = document.getElementsByClassName("sopp-contract")[0];
        } else {
            cnt = document.getElementsByClassName("detail-wrap")[0];
        }

        el = document.createElement("div");
        cnt.appendChild(el);

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "검수일자";


        el = document.createElement("div");
        cnt.appendChild(el);
        el2 = document.createElement("input");
        el2.setAttribute("type", "date");
        el2.setAttribute("class", "approvedDate");
        el2.setAttribute("disabled", "disabled");
        el.appendChild(el2);


        el2 = document.createElement("button");
        el2.innerHTML = "일자 선택";
        el2.addEventListener("click", () => {
            R.sche = new Schedule();
            R.sche.popupModalForEdit(new Date(), true);
            document.getElementById("schedule-type2i").setAttribute("checked", "checked");
            document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].value = this.title + "\u00A0" + "검수";
            modal.confirm[0].onclick = () => {
                R.sche.clickedScheduleModalConfirm();
                insertDate();
            }

        })

        el.appendChild(el2);

        if (obj.className == "sopp-contract") {
            cnt = document.getElementsByClassName("sopp-contract")[0];
        } else {
            cnt = document.getElementsByClassName("detail-wrap")[0];
        }

        el = document.createElement("div");
        cnt.appendChild(el);

        cnt = el;

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerText = "검수 관련 문서";
        el.setAttribute("style", "font-weight: 500;");

        el = document.createElement("div");
        cnt.appendChild(el);
        el.innerHTML = "<div class='filePreview'></div>" +
            "<div><label '>파일첨부<input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attachedapproved' id='attached' onchange='R.contract.fileChange(this)' style='display:none;'></input></label></div>";

        if ($(".contract-progress").children()[2].className != "contract-done") {
            cnt.setAttribute("style", "color : grey");
            let input = document.getElementsByClassName("dropZone")[2];
            input.setAttribute("disabled", true);
            let date = document.getElementsByClassName("approvedDate")[0];
            date.setAttribute("disabled", true);
            date.setAttribute("style", "color:grey");
            date.parentElement.parentElement.setAttribute("style", "color:grey")
        } else {
            let input = document.getElementsByClassName("dropZone")[2];
            input.parentElement.setAttribute("style", "color:blue;background-color:#eef1fb;cursor:pointer;margin: 0 0.5rem;");
        }



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

        if (this.approved != undefined) {
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
        } else {
            storage.reportDetailData = "";
            this.drawDetail(obj);
        }


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

        let method, data, type, attached, name, cnt;
        attached = obj.files;
        name = obj.name.split("attached")[1];
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
                    console.log(fData);
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
                        submitFile,
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
            $(".contract-progress").children()[1].className = "contract-done";
            $(".contract-progress").children()[2].className = "contract-doing";
            cnt = obj.parentElement.parentElement.parentElement.nextElementSibling;
            cnt.setAttribute("style", "color : black");
            let input = document.getElementsByClassName("dropZone")[1];
            input.disabled = false;
            input.parentElement.setAttribute("style", "color:blue;background-color:#eef1fb;cursor:pointer;margin: 0 0.5rem;");
            input.parentElement.parentElement.parentElement.parentElement.setAttribute("style", "color:black");
            let date = document.getElementsByClassName("suppliedDate")[0];
            date.disabled = false;
            date.setAttribute("style", "color:black");
            date.parentElement.parentElement.parentElement.setAttribute("style", "color:black")

        } else if (name == "supplied") {
            $(".contract-progress").children()[2].className = "contract-done";
            $(".contract-progress").children()[3].className = "contract-doing";
            cnt = obj.parentElement.parentElement.parentElement.parentElement.nextElementSibling;

            cnt.setAttribute("style", "color : black");
            let input = document.getElementsByClassName("dropZone")[2];
            input.disabled = false;
            input.parentElement.setAttribute("style", "color:blue;background-color:#eef1fb;cursor:pointer;margin: 0 0.5rem;");
            input.parentElement.parentElement.parentElement.parentElement.setAttribute("style", "color:black");
            let date = document.getElementsByClassName("approvedDate")[0];
            date.disabled = false;
            date.setAttribute("style", "color:black");
            date.parentElement.parentElement.parentElement.setAttribute("style", "color:black");

        } else if (name == "approved") {
            $(".contract-progress").children()[3].className = "contract-done";

        }


    }


    update() {
        let cont = Object.assign({}, this), data;
        delete cont.approvedAttached;
        delete cont.suppliedAttached;
        delete cont.attached;
        delete cont.bills;
        delete cont.docNo;
        delete cont.maintenance;
        delete cont.trades;
        delete cont.schedules;
        delete cont.appLine;
        delete cont.container;

        data = JSON.stringify(cont);
        console.log(this);
        data = cipher.encAes(data);
        console.log(this);
        fetch(apiServer + "/api/contract/contractPost", {
            method: "POST",
            header: { "Content-Type": "text/plain" },
            body: data
        }).catch((error) => console.log("error:", error))
            .then(response => response.json())
            .then(response => {
                if (response.result !== "ok") console.log(response);
                else {
                    this.container.innerHTML = "";
                    R.contract.getReportDetail(this.container);
                    window.contractData = R.contract;
                }
            });
        console.log("UPDATE!!");
        console.log(cont);
    }

}


function savedLineSet() {
    // let formId = "doc_Form_leave"; 
    let formId = "doc_Form_extension";
    let appLineNum = document.getElementsByClassName("schedule-app-line")[0].value * 1;
    $.ajax({
        url: "/api/gw/app/savedLine/" + storage.my,
        method: "get",
        dataType: "json",
        cache: false,
        success: (result) => {
            let savedLine;
            if (result.result == "ok") {
                savedLine = cipher.decAes(result.data);
                savedLine = JSON.parse(savedLine);
                storage.estsavedLine = savedLine;
                createLine2(formId, appLineNum);
            } else {
                alert("자주쓰는 결재선을 가져오는데 실패함 ");
            }
        },
    });
}

// 전자결재 자동생성 함수 

function createSchedule(formId, lineData, appLine) {

    let title, content, from, to;

    title = document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].value;
    content = CKEDITOR.instances["schedule-detail-content"] != undefined ? CKEDITOR.instances["schedule-detail-content"].getData() : "";

    from = document.getElementsByClassName("schedule-detail")[0].children[1].children[0].getElementsByTagName("date")[0].innerText.replaceAll(".", "-").replaceAll("'", "").replaceAll(" ", "") + "\u00A0" +
        document.getElementsByClassName("schedule-detail")[0].children[1].children[0].getElementsByTagName("time")[0].innerText;

    to = document.getElementsByClassName("schedule-detail")[0].children[1].children[0].getElementsByTagName("date")[1].innerText.replaceAll(".", "-").replaceAll("'", "").replaceAll(" ", "") + "\u00A0" +
        document.getElementsByClassName("schedule-detail")[0].children[1].children[0].getElementsByTagName("time")[1].innerText;

    let related = {
        "next": "",
        "parent": "",
        "previous": "",

    };


    if (appLine.length == 1) {
        appLine[0][0] = 2;
    } else {
        for (let i = 0; i < appLine.length; i++) {
            if (appLine[i][0] != 0) {
                appLine[i][0] = (i + 1);
            }
        }

    }

    let data = {
        "sopp": R.sopp.no + "",
        "customer": R.sopp.customer + "",
        "formId": formId,
        "title": title,
        "content": content,
        "from": from,
        "to": to,
        "lineData": lineData,
        "appLine": appLine,
        "dept": storage.user[storage.my].deptId[0],
        "readable": "dept",
        "related": JSON.stringify(related),
        "writer": storage.user[storage.my].userName,
        "created": getYmdSlash2(),
    }


    data = JSON.stringify(data);
    data = cipher.encAes(data);



    $.ajax({
        url: "/api/gw/autoScheduleReport",
        method: "post",
        data: data,
        dataType: "json",
        contentType: "text/plain",
        success: (result) => {
            if (result.result === "ok") {
                console.log("결재문서 자동 생성 성공");
            } else {
                console.log("결재문서 자동 생성 실패");
            }
        }
    });

}




function createLine2(formId, appLineNum) {


    let savedLineData = storage.estsavedLine;

    if (storage.estsavedLine != undefined) {
        let appLine;
        let toUseAppLine;
        for (let i = 0; i < savedLineData.length; i++) {
            if (savedLineData[i].no == appLineNum) {
                appLine = savedLineData[i].appLine;
            }
        }


        let typeLine = [[], [], [], [], []];

        for (let i = 0; i < typeLine.length; i++) {
            for (let j = 0; j < appLine.length; j++) {
                if (i == appLine[j][0]) {
                    typeLine[i].push(appLine[j][1]);
                }
            }
        }

        let writer = storage.my;

        // line grid container 안 닫음 
        let lineData = "<div class='lineGridContainer'><div class='lineGrid'><div class='lineTitle'>작 성</div>" +
            "<div class='lineSet'>" +
            "<div class='twoBorder'><input disabled class='inputsAuto' style='text-align:center' value ='" +
            storage.userRank[storage.user[storage.my].rank][0] +
            "'></div>" +
            "<div class='twoBorder'><input class='inputsAuto " +
            formId +
            "_writer' style='text-align:center' disabled type='text'  data-detail='" +
            storage.user[writer].userName +
            "' value='" +
            storage.user[writer].userName +
            "'></div>" +
            "<div class='twoBorder'><input disabled class='inputsAuto " +
            formId +
            "_writer_status' style='text-align:center'  data-detail='' type='text' ></div>" +
            "<div class='dateBorder'><input disabled class='inputsAuto " +
            formId +
            "_writer_approved'  data-detail='' type='text' value=''></div></div></div>";
        let titleArr = ["검 토", "결 재", "수 신", "참 조"];
        let titleId = ["examine", "approval", "conduct", "refer"];
        let testHtml2 = "<div class='lineGridContainer'>";

        for (let i = 0; i < typeLine.length; i++) {
            if (typeLine[i].length != 0 && i < 2) {
                lineData +=
                    "<div class='lineGrid'><div class='lineTitle'>" +
                    titleArr[i] +
                    "</div>";
            } else if (typeLine[i].length != 0 && i == 2) {
                testHtml2 +=
                    "<div class='lineGrid'><div class='lineTitle'>" +
                    titleArr[i] +
                    "</div>";
            }

            for (let j = 0; j < typeLine[i].length; j++) {
                // 수신인 경우 
                if (i == 2) {
                    testHtml2 +=
                        "<div class='lineSet'><div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_position" +
                        "' value='" +
                        storage.userRank[storage.user[typeLine[i][j]].rank][0] +
                        "' data-detail='" +
                        storage.user[typeLine[i][j]].rank +
                        "'/></div>" +
                        "<div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "' value='" +
                        storage.user[typeLine[i][j]].userName +
                        "' data-detail='" +
                        storage.user[typeLine[i][j]].userNo +
                        "'/></div>" +
                        "<div class='twoBorder'><input type='text'  disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_status' value='' data-detail=''/></div>" +
                        "<div class='dateBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_approved" +
                        "' value='' data-detail=''/></div></div>";
                } else if (i != 2 && i != 3) {
                    lineData +=
                        "<div class='lineSet'><div class='twoBorder'><input type='text' disabled  style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_position" +
                        "' value='" +
                        storage.userRank[storage.user[typeLine[i][j]].rank][0] +
                        "' data-detail='" +
                        storage.user[typeLine[i][j]].rank +
                        "'/></div>" +
                        "<div class='twoBorder'><input type='text' disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "' value='" +
                        storage.user[typeLine[i][j]].userName +
                        "' data-detail='" +
                        storage.user[typeLine[i][j]].userNo +
                        "'/></div>" +
                        "<div class='twoBorder'><input type='text'disabled style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_status' value='' data-detail=''/></div>" +
                        "<div class='dateBorder'><input type='text' disabled  style='text-align:center' class='inputsAuto " +
                        formId +
                        "_" +
                        titleId[i] +
                        "_approved" +
                        "' value='' data-detail=''/></div></div>";
                }
            }

            if (typeLine[i].length != 0 && i < 2) {
                lineData += "</div>";
            } else if (typeLine[i].length != 0 && i == 2) {
                testHtml2 += "</div>";
            }
        }

        lineData += "</div>";
        testHtml2 += "</div>";

        lineData += testHtml2;

        createSchedule(formId, lineData, appLine);
    }
}


function getYmdSlash2() {
    let d = new Date();
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

function getYmdSlashFull(date) {
    let d = new Date(date);
    return (
        (d.getFullYear()) +
        "-" +
        (d.getMonth() + 1 > 9
            ? (d.getMonth() + 1).toString()
            : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
    );
}


function setPrevModal(no) {

    modal.show();
    $(".modal").prop("style", "min-width:80%");

    $("#confirm").attr("onclick", "openSaleReport(" + no + ")");
    $("#close").attr("onclick", "modal.hide();$('.modal').prop('style', 'min-width:40%');");
    let el, el2, cnt;
    let html = "";

    cnt = document.getElementsByClassName("modalBody")[0];

    el = document.createElement("div");
    el.setAttribute("class", "report-modal");
    cnt.appendChild(el);

    el = document.createElement("div");
    el.setAttribute("class", "sopp-modalData");
    cnt.children[0].appendChild(el);

    el = document.createElement("div");
    el.setAttribute("class", "ctrt-modalData");
    cnt.children[0].appendChild(el);

    // sopp Data 채움 
    cnt = document.getElementsByClassName("sopp-modalData")[0];
    el = document.createElement("div");
    cnt.append(el);

    el = document.createElement("input");
    el.setAttribute("value", R.sopp.title + "수주판매보고");
    cnt.children[0].appendChild(el);


    el = document.createElement("div");
    el.setAttribute("class", "sub-title");
    el.innerHTML = "<circle></circle><div>기본 정보</div><line></line>";
    cnt.append(el);

    el = document.createElement("div");
    cnt.append(el);
    // 조달여부  
    let type = ["procure", "normal", "customer", "partner", "place", "amount"];
    let name = ["조달", "일반", "고객사", "협력사", "설치장소", "대금"];
    for (let i = 0; i < 2; i++) {
        if (i == 1) {
            html += "<input style='display:none' type='radio' name='procureRd' value='" + type[i] + "' id='" + type[i] + "' disabled></input><label for='" + type[i] + "'>" + name[i] + "</label>";
        } else {
            html += "<input style='display:none' type='radio' name='procureRd' value='" + type[i] + "' id='" + type[i] + "' disabled></input><label for='" + type[i] + "'>" + name[i] + "</label>";
        }
    }
    el.innerHTML = html;

    if (R.sopp.related.previous != undefined) {
        document.getElementById("procure").setAttribute("checked", "checked");
    } else {
        document.getElementById("normal").setAttribute("checked", "checked");
    }


    for (let i = 2; i < type.length; i++) {
        let data = "";
        html = "";
        el = document.createElement("div");
        el.setAttribute("class", "sub-title");
        el.innerHTML = "<circle></circle><div>" + name[i] + "</div>";
        cnt.append(el);

        if ((type[i] == "customer" || type[i] == "place") && R.sopp.customer != undefined) {
            data = storage.customer[R.sopp.customer].name;
        } else if ((type[i] == "partner" || type[i] == "amount") && R.sopp.partner != undefined) {
            data = storage.customer[R.sopp.partner].name;
        }
        el = document.createElement("div");
        el.innerHTML = "<input type='text' class='info-" + type[i] + "' value='" + data + "' disabled></input>";
        cnt.appendChild(el);

    }

    cnt = document.getElementsByClassName("ctrt-modalData")[0];

    el = document.createElement("div");
    el.setAttribute("class", "sub-title");
    el.innerHTML = "<circle></circle><div>1. 제품 정보</div><line></line>";
    cnt.append(el);

    let items = storage.estimateList[storage.estimateList.length - 1].related.estimate.items;

    let prdtTableTitle = [
        ["항목", "item"],
        ["고객사", "supplier"],
        ["단가", "price"],
        ["수량", "quantity"],
        ["부가세", "vat"],
        ["공급가", "amount"],
    ];

    el = document.createElement("div");
    el.setAttribute("class", "product-listTitle");
    for (let i = 0; i < prdtTableTitle.length; i++) {
        el2 = document.createElement("div");
        el2.innerHTML = prdtTableTitle[i][0];
        el.appendChild(el2);
    }

    cnt.appendChild(el);

    el = document.createElement("div");
    el.setAttribute("class", "product-list");
    cnt.appendChild(el);


    for (let i = 0; i <= items.length - 1; i++) {
        el = document.createElement("div");
        el.setAttribute("class", "product-item");
        for (let j = 0; j < prdtTableTitle.length; j++) {
            el2 = document.createElement("div");
            if (j == 5) {
                el2.innerHTML = (items[i][prdtTableTitle[2][1]] * items[i][prdtTableTitle[3][1]]).toLocaleString();

            } else if (j == 0) {
                let name;
                for (x in storage.product) {
                    if (storage.product[x].no == items[i][prdtTableTitle[j][1]]) {
                        name = storage.product[x].name;
                        el2.setAttribute("data-detail", items[i][prdtTableTitle[j][1]]);
                    }
                }
                el2.innerHTML = name;
            } else if (j == 1) {
                el2.innerHTML = storage.customer[items[i][prdtTableTitle[j][1]]].name;
                el2.setAttribute("data-detail", items[i][prdtTableTitle[j][1]]);
            } else if (j == 2) {
                el2.innerHTML = (items[i][prdtTableTitle[j][1]] * 1).toLocaleString();
            } else if (j == 3) {
                el2.innerHTML = (items[i][prdtTableTitle[j][1]] * 1).toLocaleString();
            } else if (j == 4) {
                if (items[i][prdtTableTitle[j][1]] == "true") {
                    (el2.innerHTML = (items[i][prdtTableTitle[2][1]] * items[i][prdtTableTitle[3][1]]) * 0.1).toLocaleString();
                }
            }
            el.appendChild(el2); // 기본 데이터 넣음 


        }


        document.getElementsByClassName("product-list")[0].appendChild(el);

        el2 = document.createElement("div");
        el2.setAttribute("class", "product-option");
        let html = "";
        html += "<div>";
        html += "<div><circle></circle><div>개시일</div><input style='display:none' type='radio' name='dateRd" + i + "' id='examineCb" + i + "' onclick='examineCheck(this)' checked></input><label for='examineCb" + i + "'>검수일</label><input style='display:none' type='radio' name='dateRd" + i + "'  id='selectCb" + i + "' onclick='insertDateRd(this)'></input><label for='selectCb" + i + "'>선택</label><input type='date' onchange='dateChange(this)' disabled></input></div>";
        // html += "<div><circle></circle><div>개시일</div><input type='date' onchange='dateChange(this)'></input><input type='checkbox' class='examineCb" + i + "' onclick='examineCheck(this)' checked>검수일</input></div>";
        html += "<div><circle></circle><div>무상 유지보수</div><input style='display:none' type='radio' name='mtncRd" + i + "' value='mtncY" + i + "' id='mtncY" + i + "' checked onclick='drawDefaultMaintenance(this)'></input><label for='mtncY" + i + "'>Y</label>"
        html += "<input type='radio' style='display:none' name='mtncRd" + i + "' value='mtncN" + i + "' id='mtncN" + i + "' checked onclick='drawDefaultMaintenance(this)'></input><label for='mtncN" + i + "'>N</label>";
        html += "</div>";
        html += "</div><div><circle></circle><div>기간</div><input type='text' onkeyup='lengthChange(this)'></input><span>년</span><input type='text' onkeyup='lengthChange(this)' ></input><span>개월</span></div>";
        el2.innerHTML = html;

        document.getElementsByClassName("product-list")[0].appendChild(el2);

    }

    cnt = document.getElementsByClassName("ctrt-modalData")[0];

    el = document.createElement("div");
    el.setAttribute("class", "sub-title");
    el.innerHTML = "<circle></circle><div>2. 유지보수</div><line></line>";
    cnt.append(el);

    el = document.createElement("div");
    cnt.append(el);


    el2 = document.createElement("button");
    el2.setAttribute("class", "mtncForm");
    el2.innerHTML = "추가";
    el.setAttribute("onclick", "createMtnc()");
    el.appendChild(el2);

    el = document.createElement("div");
    el.setAttribute("class", "mtnc-list");
    cnt.append(el);

    el = document.createElement("div");
    el.setAttribute("class", "mtnc-listTitle");
    cnt.append(el);


    let mtncTitle = [["유지보수명", "title"], ["항목", "product"], ["고객사", "customer"], ["시작일", "startDate"], ["종료일", "endDate"], ["엔지니어", "engineer"], ["금액", "mtncAmount"]];

    for (let i = 0; i < mtncTitle.length; i++) {
        el2 = document.createElement("div");
        el2.innerHTML = mtncTitle[i][0];
        el.appendChild(el2);
    }

    el = document.createElement("div");
    el.setAttribute("class", "mtnc-data");
    cnt.appendChild(el);

}


function drawDefaultMaintenance(obj) {
    let mtncTitle = [["유지보수명", "title"], ["항목", "product"], ["고객사", "customer"], ["시작일", "startDate"], ["종료일", "endDate"], ["엔지니어", "engineer"], ["금액", "mtncAmount"]];
    let rdVal = $(obj).val().substring(4, 5);
    let productNum;
    let product, productName, customer, startDate, endDate, engineer, mtncAmount;
    let year, month;
    let dateRd;

    if (rdVal == "Y") {
        productNum = $(obj).val().substring(5, 6);
        if (document.getElementsByClassName("mtnc-detail" + productNum).length < 1) {
            product = $(".product-item")[productNum].children[0].dataset.detail;
            customer = $(".product-item")[productNum].children[1].dataset.detail;
            year = $(".product-option")[productNum].children[1].children[2].value == "" ? 0 : $(".product-option")[productNum].children[1].children[2].value;
            month = $(".product-option")[productNum].children[1].children[4].value == "" ? 0 : $(".product-option")[productNum].children[1].children[4].value;
            mtncAmount = "0";
            if ($("input[name='dateRd" + productNum + "']:checked").attr("id") == ("examineCb" + productNum)) {
                startDate = "검수일";
                endDate = "+ " + year + "년 " + month + "개월";
            } else {
                startDate = $(".product-option")[productNum].children[0].children[0].children[6].value;
                endDate = new Date(startDate);
                endDate = new Date(endDate.setFullYear(endDate.getFullYear() + year * 1));
                endDate = new Date(endDate.setMonth(endDate.getMonth() + month * 1));
                endDate = getYmdSlashFull(endDate);
            }

            let el, cnt, html = "";
            cnt = document.getElementsByClassName("mtnc-data")[0];
            el = document.createElement("div");
            el.setAttribute("class", "mtnc-detail" + productNum);
            cnt.appendChild(el);

            for (x in storage.product) {
                if (storage.product[x].no == product) {
                    productName = storage.product[x].name;
                }
            }
            html += "<div style='background-color:#f6f7f9;'><input data-detail='' style='width:95%;border:none;' value='" + productName + "유지보수'></input></div>";

            html += "<div style='background-color:#f6f7f9;' data-detail='" + product + "'>" + productName + "</div>";

            html += "<div style='background-color:#f6f7f9;' data-detail='" + customer + "'>" + storage.customer[customer].name + "</div>";

            html += "<div style='background-color:#f6f7f9;'>" + startDate + "</div>";

            html += "<div style='background-color:#f6f7f9;'>" + endDate + "</div>";

            html += "<div style='background-color:#f6f7f9;'><select style='width:100%'>";

            for (let i = 0; i <= R.sopp.coWorker.length - 1; i++) {
                html += "<option value='" + R.sopp.coWorker[i] + "'>" + storage.user[R.sopp.coWorker[i]].userName + "</option>";
            }

            html += "</select></div>";

            html += "<div style='background-color:#f6f7f9;'>" + mtncAmount + "</div>"
            el.innerHTML = html;
        }
    } else {
        productNum = $(obj).val().substring(5, 6); $(obj).val().substring(5, 6);
        document.getElementsByClassName("mtnc-detail" + productNum)[0].remove();
    }

}


function examineCheck(obj) {
    // let productNum = obj.className;

    let productNum = obj.id;
    let cnt, year, month;
    console.log(productNum);
    if (productNum.includes("examine")) {
        productNum = productNum.split("examineCb")[1];
        obj.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.disabled = true;
        obj.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value = "";
    }
    cnt = document.getElementsByClassName("mtnc-detail" + productNum)[0];
    year = document.getElementsByClassName("product-option")[productNum].children[1].children[2].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[2].value;
    month = document.getElementsByClassName("product-option")[productNum].children[1].children[4].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[4].value;

    if (document.getElementsByClassName("mtnc-detail" + productNum).length > 0) {

        cnt.children[3].innerHTML = "검수일";
        cnt.children[4].innerHTML = "+" + year + "년 " + month + "개월";
    }
}


function insertDateRd(obj) {
    let startDate, endDate;
    let productNum;
    productNum = obj.id.split("selectCb")[1];
    startDate = obj.nextElementSibling.nextElementSibling;
    if (startDate.disabled = true) {
        startDate.disabled = false;
        startDate.value = "20" + (getYmdSlash2().replaceAll("/", "-"));
    }

    if (document.getElementsByClassName("mtnc-detail" + productNum).length > 0) {
        cnt = document.getElementsByClassName("mtnc-detail" + productNum)[0];
        year = document.getElementsByClassName("product-option")[productNum].children[1].children[2].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[2].value;
        month = document.getElementsByClassName("product-option")[productNum].children[1].children[4].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[4].value;
        cnt.children[3].innerHTML = startDate.value;
        endDate = new Date(startDate.value);
        endDate = new Date(endDate.setFullYear(endDate.getFullYear() + year * 1));
        endDate = new Date(endDate.setMonth(endDate.getMonth() + month * 1));
        endDate = getYmdSlashFull(endDate);
        cnt.children[4].innerHTML = endDate;
    }

}


function dateChange(obj) {
    let year, month, endDate;
    let productNum = obj.nextElementSibling.className;
    productNum = productNum.split("examineCb")[1];
    if (document.getElementsByClassName("mtnc-detail" + productNum).length > 0) {
        cnt = document.getElementsByClassName("mtnc-detail" + productNum)[0];
        cnt.children[3].innerHTML = obj.value;
    }
    $(obj).next().prop("checked", false);

    year = document.getElementsByClassName("product-option")[productNum].children[1].children[2].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[2].value;
    month = document.getElementsByClassName("product-option")[productNum].children[1].children[4].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[4].value;
    endDate = new Date(obj.value);
    endDate = new Date(endDate.setFullYear(endDate.getFullYear() + year * 1));
    endDate = new Date(endDate.setMonth(endDate.getMonth() + month * 1));
    endDate = getYmdSlashFull(endDate);
    cnt.children[4].innerHTML = endDate;

}

function lengthChange(obj) {

    obj.value = obj.value.replace(/[^0-9.]/g, "");

    let productNum, year, month, cnt, startDate, endDate;
    let parents = document.getElementsByClassName("product-option");
    for (let i = 0; i < parents.length; i++) {
        if (obj.parentElement.parentElement == parents[i]) {
            productNum = i;
        }
    }
    year = document.getElementsByClassName("product-option")[productNum].children[1].children[2].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[2].value;
    month = document.getElementsByClassName("product-option")[productNum].children[1].children[4].value == "" ? 0 : document.getElementsByClassName("product-option")[productNum].children[1].children[4].value;
    startDate = document.getElementsByClassName("product-option")[0].children[0].children[0].children[6].value;
    endDate = new Date(startDate);
    endDate = new Date(endDate.setFullYear(endDate.getFullYear() + year * 1));
    endDate = new Date(endDate.setMonth(endDate.getMonth() + month * 1));
    endDate = getYmdSlashFull(endDate);

    cnt = document.getElementsByClassName("mtnc-detail" + productNum)[0];
    if (document.getElementById("examineCb" + productNum).checked) {
        cnt.children[4].innerHTML = "+" + year + "년 " + month + "개월";
    } else {
        cnt.children[3].innerHTML = startDate;
        cnt.children[4].innerHTML = endDate;
    }

}


function createMtnc() {
    let el, cnt, length, itemLength, html;

    let custListHtml = "<datalist id='mtnc-customerList'>";
    for (x in storage.customer) {
        custListHtml +=
            "<option data-value='" +
            x +
            "' value='" +
            storage.customer[x].name +
            "'></option> ";
    }
    custListHtml += "</datalist>";

    let productListhtml = "<datalist id='mtnc-productList'>";
    for (let y = 0; y < storage.product.length; y++) {
        productListhtml +=
            "<option data-value='" +
            storage.product[y].no +
            "' value='" +
            storage.product[y].name +
            "'></option> ";
    }
    productListhtml += "</datalist>";

    itemLength = document.getElementsByClassName("product-item").length;
    cnt = document.getElementsByClassName("mtnc-data")[0];
    length = cnt.children.length;
    el = document.createElement("div");
    el.setAttribute("class", "mtnc-detail");
    html = "";
    html += "<div data-detail=''><input type='text'  style='width:95%'></input></div>";
    html += "<div data-detail=''><input type='text' list='mtnc-productList' style='width:95%'>" + productListhtml + "</input></div>";

    html += "<div data-detail=''><input type='text' list='mtnc-customerList' style='width:95%'>" + custListHtml + "</input></div>";

    html += "<div><input type='date' onchange='setSdate(this);' style='width:95%'></input></div>";

    html += "<div><input type='date' onchange='setEdate(this);' style='width:95%'></input></div>";

    html += "<div><select style='width:100%'  data-detail='' >";

    for (let i = 0; i <= R.sopp.coWorker.length - 1; i++) {
        html += "<option value='" + R.sopp.coWorker[i] + "'>" + storage.user[R.sopp.coWorker[i]].userName + "</option>";
    }

    html += "</select></div>";

    html += "<div><input type='text' style='width:100%; text-align:center;' data-detail='' onkeyup='this.dataset.detail=this.value;setNum(this);' ></input></div>";

    html += "<div><button onclick='this.parentElement.parentElement.remove()'>삭제</button></div>"
    el.innerHTML = html;
    cnt.appendChild(el);

}





function openSaleReport(no) {
    let data = setMtncDate();

    if (data.length > 0) {
        modal.hide();
        $(".modal").prop("style", "min-width:40%");
        R.popup = window.open("/gw/estimate/" + no, "soppStageUp", "width=1000,height=800,left=100,top=100");
        window.setTimeout(R.popup.mtncData = data, 3000);
    }

}



function setMtncDate() {

    // 무상 유지보수 데이터 
    let productLength = storage.estimateList[storage.estimateList.length - 1].related.estimate.items.length;
    let data = [];
    let detail;
    let title, product, customer, startDate, endDate, engineer, amount;
    for (let i = 0; i <= productLength - 1; i++) {
        let cnt = document.getElementsByClassName("mtnc-detail" + i)[0];
        if (cnt != undefined) {

            title = cnt.children[0].children[0].value;
            product = cnt.children[1].dataset.detail;
            customer = cnt.children[2].dataset.detail;
            startDate = cnt.children[3].innerHTML;
            endDate = cnt.children[4].innerHTML;
            engineer = cnt.children[5].children[0].value;
            amount = cnt.children[6].innerHTML;

            if (title == "") {
                alert("유지보수명을 입력하세요");
                data = [];
                break;
            } else if (startDate == endDate || endDate == "+ 0년 0개월") {
                alert("유지보수 기간을 선택하세요");
                data = [];
                break;
            } else {
                detail = {
                    title: cnt.children[0].children[0].value,
                    product: cnt.children[1].dataset.detail * 1,
                    customer: cnt.children[2].dataset.detail * 1,
                    startDate: cnt.children[3].innerHTML,
                    endDate: cnt.children[4].innerHTML,
                    engineer: cnt.children[5].children[0].value * 1,
                    amount: cnt.children[6].innerHTML * 1
                }

                data.push(detail);
            }

        }
    }

    // 임의로 추가한 유지보수 데이터 

    let mtncDetail = document.getElementsByClassName("mtnc-detail");
    for (let i = 0; i <= mtncDetail.length - 1; i++) {
        let cnt = mtncDetail[i];
        let title, product, customer, startDate, endDate, engineer, amount;
        title = cnt.children[0].children[0].value;
        startDate = cnt.children[3].children[0].value
        endDate = cnt.children[4].children[0].value
        engineer = cnt.children[5].children[0].value;
        amount = cnt.children[6].children[0].value;

        let x;
        for (x in storage.product) {
            if (storage.product[x].name == cnt.children[1].children[0].value) {
                product = storage.product[x].no;
            }
        }

        for (x in storage.customer) {
            if (cnt.children[2].children[0].value == storage.customer[x].name && cnt.children[2].children[0].value != "") {
                customer = storage.customer[x].no;

            }
        }


        if (title == "") {
            alert("유지보수명을 입력하세요");
            data = [];
            break;
        } else if (customer == undefined) {
            alert("거래처를 입력하세요");
            data = [];
            break;
        } else if (product == undefined) {
            alert("항목을 입력하세요");
            data = [];
            break;
        } else if (startDate == "" || endDate == "") {
            alert("유지보수 기간을 선택하세요");
            data = [];
            break;
        } else if (amount == "") {
            alert("유상 유지보수 금액을 입력하세요");
            data = [];
            break;
        }

        detail = {
            title: title,
            product: product,
            customer: customer,
            startDate: startDate,
            endDate: endDate,
            engineer: engineer,
            amount: amount,
        }

        data.push(detail);
    }

    //  R.popup.mtncData = data;
    return data;

}

function setNum(obj) {
    let value = obj.value;
    value = value.replace(/[^0-9.]/g, "");
    value = (value * 1).toLocaleString();
    obj.value = value;
}


function setSdate(obj) {
    let startDate = obj.value;
    let endDate = obj.parentElement.nextElementSibling.children[0].value;
    if ((endDate != "" && startDate > endDate) || endDate == "") {
        endDate = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1));
        obj.parentElement.nextElementSibling.children[0].value = getYmdHypen(endDate);
    }
}

function setEdate(obj) {
    let endDate = obj.value;
    let startDate = obj.parentElement.previousElementSibling.children[0].value;
    if ((startDate != "" && startDate > endDate) || startDate == "") {
        startDate = new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - 1));
        obj.parentElement.previousElementSibling.children[0].value = getYmdHypen(startDate);
    }
}


function submitFile() {

    let soppNo = R.contract.related;
    soppNo = JSON.parse(soppNo);
    soppNo = soppNo.parent.split(":")[1];

    fetch(location.origin + "/api/contract/parent/sopp:" + soppNo)
        .catch((error) => console.log("error:", error))
        .then(response => response.json())
        .then(response => {
            console.log(response);
            let data, cnt = document.getElementsByClassName("sopp-contract")[0];
            if (response.result === "ok") {
                data = response.data;
                data = cipher.decAes(data);
                data = JSON.parse(data);
                R.contract = new Contract(data);
                window.contractData = R.contract;
            } else {
                console.log("파일 첨부 오류");

            }
        });


    return false

}


function insertDate() {
    let date = document.getElementsByClassName("modalBody")[0].children[0].children[1].children[0].children[1].innerHTML;
    date = date.substring(1);
    date = date.replaceAll(".", "-");
    date = "20" + date;
    date = new Date(date);
    date = date.getTime();


    if (document.getElementById("schedule-type2h").getAttribute("checked") === "checked") {
        R.contract.supplied = date;
    } else if (document.getElementById("schedule-type2i").getAttribute("checked") === "checked") {
        R.contract.approved = date;
    }

    R.contract.update();
}



function setSopp(no) {
    if (no === null) console.log("SOPP no is null!!!");
    else fetch(apiServer + "/api/project/sopp/" + no)
        .catch((error) => console.log("error:", error))
        .then(response => response.json())
        .then(response => {
            let data, sopp, projectOwner;
            if (response.result === "ok") {
                data = response.data;
                data = cipher.decAes(data);
                data = JSON.parse(data);
                R.projectOwner = data.projectOwner;
                R.chat = data.chat;
                R.sopp = new Sopp2(data.sopp);
                console.log("sopp 확인");
            } else {
                console.log(response.msg);
            }
        });
} 