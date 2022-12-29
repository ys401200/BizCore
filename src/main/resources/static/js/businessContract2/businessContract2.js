let R = {};

$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.contracts = new Contracts(location.origin, document.getElementsByClassName("contract-list")[0]);

});


// ================================= C L A S S _ D E C L A R A T I O N =================================

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

		el.addEventListener("click", function () {
			let no = this.parentElement.dataset.no;
			fetch(location.origin + "/api/contract/" + no)
				.catch((error) => console.log("error:", error))
				.then(response => response.json())
				.then(response => {
					
					let data;
					if (response.result === "ok") {
						data = response.data;
						data = cipher.decAes(data);
						data = JSON.parse(data);
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





	drawDetail(parent) {

		//let target = document.getElementsByClassName("sopp-contract")[0];
		let origin = document.getElementsByClassName("detail-wrap")[0];

		if (origin != undefined) origin.remove();

		let cnt, el, el2;
		el = document.createElement("div");
		el.className = "detail-wrap";
		//target.appendChild(el);
		parent.after(el);
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
			el.addEventListener("click", () => {
				window.open("/business/contract/popup/" + storage.reportDetailData.docNo, "미리보기", "width :210mm");
			})
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
		if ($(".contract-progress").children()[1].className == "contract-done" || $(".contract-progress").children()[1].className == "contract-doing") {
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
		$(".contract-progress").children()[0].className = "contract-done";
		$(".contract-progress").children()[1].className = "contract-done";
		$(".contract-progress").children()[2].className = "contract-doing";
		let el, el2, cnt;
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

		el2 = document.createElement("input");
		el2.setAttribute("type", "date");
		el2.setAttribute("class", "suppliedDate");
		el2.addEventListener("click", () => {
			R.sche = new Schedule();
			R.sche.drawForRequestDetail(new Date());
			document.getElementById("schedule-type-radio8").setAttribute("checked", "checked");
			document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].value = this.title + "\u00A0" + "납품";
		})
		el.appendChild(el2);

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


		let el, el2, cnt;
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
		el2 = document.createElement("input");
		el2.setAttribute("type", "date");
		el2.setAttribute("class", "approvedDate");
		el2.addEventListener("click", () => {
			R.sche = new Schedule();
			R.sche.drawForRequestDetail(new Date());
			document.getElementById("schedule-type-radio9").setAttribute("checked", "checked");
			document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].value = this.title + "\u00A0" + "검수";

		})
		el.appendChild(el2);


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

} // 클래스 정의 끝 ==============================================================================================================


function drawContractList() {
	$(".contract-list").html("");
	R.contracts.draw();
}

function drawDetail(obj) {
	let no = obj.parentElement.dataset.no;
	fetch(location.origin + "/api/contract/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.contract = new Contract(data);
				R.contract.getReportDetail(obj);

			} else {
				console.log(response.msg);
			}
		});

}


// 날짜 관련 함수 
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


function getYmdHypen(date) {
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


function drawList() {
	R.contracts.draw();
}
