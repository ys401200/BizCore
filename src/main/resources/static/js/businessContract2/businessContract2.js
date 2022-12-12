
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
					console.log(response.data);
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
		el.innerText = "담당자";
		el = document.createElement("div");
		cnt.children[0].appendChild(el);
		el.innerText = "계약금액";


		let page = storage.currentPage * 13;
		console.log(this.list.length + "함수 실행 확인");
		let x, ctrt, svg;
		svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
		for (x = (storage.currentPage - 1) * 13; x < page; x++) {
			ctrt = this.list[x];
			el = document.createElement("div");
			this.container.appendChild(el);
			ctrt.draw(el);
		}

		let result = paging(this.list.length, storage.currentPage, 13);
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
		this.cipOfendUser = each.cipOfendUser;
		this.endUser = each.endUser;
		this.related = each.related;
		this.cipOfSupplier = each.cipOfSupplier;
		this.supplier = each.supplier;
		this.schedules = each.schedules;
		this.attached = each.attached;
		this.modified = each.modified;
		this.contractAmount = each.contractAmount;
		this.taxInclude = each.taxInclude;
		this.bills = each.bills;
		this.profit = each.profit;
		this.maintenance = each.maintenance == undefined ? [] : JSON.parse(each.maintenance);
		this.customer = each.customer;
		this.cipOfCustomer = each.cipOfCustomer;
		this.supplied = each.supplied == undefined ? 0 : each.supplied;
		this.delivered = each.delivered == undefined ? 0 : each.delivered;
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
		el.setAttribute("onclick", "drawDetail(this)");

		child = document.createElement("div");
		el.appendChild(child);
		child.innerText = getYmdSlashShort(this.created);

		child = document.createElement("name");
		el.appendChild(child);
		child.innerText = this.title;

		child = document.createElement("div");
		el.appendChild(child);
		child.innerText = storage.user[this.employee].userName;

		child = document.createElement("div");
		el.appendChild(child);
		child.innerText = this.contractAmount.toLocaleString() + "원";

	}

	drawDetail(parent) {
		let origin = document.getElementsByClassName("detail-wrap")[0];

		if (origin != undefined) origin.remove();

		let cnt, el, el2;
		el = document.createElement("div");
		el.className = "detail-wrap";
		parent.after(el);
		cnt = document.getElementsByClassName("detail-wrap")[0];


		el = document.createElement("top");
		el.className = "contract-top";
		cnt.appendChild(el);

		let ctrtTop = document.getElementsByClassName("contract-top")[0];

		el = document.createElement("div");
		ctrtTop.appendChild(el);

		// contract-progress Div 
		el = document.createElement("bar");
		el.className = "contract-progress"
		ctrtTop.appendChild(el);

		el2 = document.createElement("div");
		el.append(el2);
		if (storage.reportDetailData.status == "proceed") {
			el2.className = "contract-doing";
		} else if (storage.reportDetailData.status == "rejected") {
			el2.className = "contract-fail";
		} else if (storage.reportDetailData.status == "read") {
			el2.className = "contract-done";
		}

		el2.innerText = "판매보고";

		el2 = document.createElement("div");
		el.append(el2);

		if (this.attached.length != 0) {
			el2.className = "contract-done";
		} else {
			if (storage.reportDetailData != undefined) {
				el2.className = "contract-doing";
			}
		}

		el2.innerText = "계약서";


		// 납품 
		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied == 0 && this.attached.length > 0) {
			el2.className = "contract-doing";
		} else if (this.attached.length > 0 && this.supplied != 0) {
			el2.className = "contract-done";
		}
		el2.innerText = "납품";


		//검수
		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied != 0 && this.delivered == 0) {
			el2.className = "contract-doing";
		} else if (this.supplied != 0 && this.delivered != 0) {
			el2.className = "contract-done";
		}
		el2.innerText = "검수";

		el = document.createElement("div");
		ctrtTop.appendChild(el);
		el.className = "crudBtns";
		el.innerHTML = "<Button data-detail='" + this.no + "'onclick='this.parentElement.parentElement.parentElement.remove()'><i class='fa-solid fa-xmark'></i></Button>";

		// 계약명
		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "계약명";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.title;

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
		el.innerText = this.contractAmount.toLocaleString() + "원";


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
					"<div><input type='checkbox' data-id='" + mtnc[i].no + "'><div>" + getYmdSlashShort(mtnc[i].startDate) + "</div>" +
					"<div> ~ </div>" +
					"<div>" + getYmdSlashShort(mtnc[i].endDate) + "</div>";

			} mtncList += "<button>갱신</button></div>"
			cnt.children[cnt.children.length - 1].children[1].innerHTML = mtncList;

		}


		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "판매보고";
		el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2;");



		//판매보고
		if (storage.reportDetailData != undefined && storage.reportDetailData != "") {
			cnt = document.getElementsByClassName("detail-wrap")[0];
			let appLine = storage.reportDetailData.appLine;

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
			el.innerText = "(" + storage.reportDetailData.docNo + ")";
			el.setAttribute("onclick", "openPreviewTab()");
			el.style.color = "blue";
			el.style.cursor = "pointer";

		}




		// 계약서 타이틀 
		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "계약서";
		el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2;");





		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "계약서";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);


		el = document.createElement("input")
		el.setAttribute("type", "file");
		cnt.children[cnt.children.length - 1].children[1].appendChild(el);
        


		// 계약서 (첨부파일)
		if (this.attached.length > 0) {
			let files = "";
			for (let i = 0; i < this.attached.length; i++) {
				files +=
					"<div><div><a href='/api/attached/contract/" +
					this.no +
					"/" +
					encodeURI(this.attached[i].fileName) +
					"'>" +
					this.attached[i].fileName +
					"</a></div><div><button>x</button></div></div>";
			}

			cnt.children[cnt.children.length - 1].children[1].innerHTML = files;

		}
		// 	// 첨부된 파일이 없는 경우 
		// } else {
		// 	el = document.createElement("div");
		// 	cnt.appendChild(el);

		// 	el = document.createElement("div");
		// 	cnt.children[cnt.children.length - 1].appendChild(el);
		// 	el.innerText = "계약서";

		// 	el = document.createElement("div");
		// 	cnt.children[cnt.children.length - 1].appendChild(el);
		// 	el.innerHTML = "<div></div><div><input type='file'/></div>";
		// }




		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "납품";
		el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2;");


		if ($(".contract-progress").children()[2].className == "contract-doing") {


			// 납품일
			if (this.supplied != 0) {

				el = document.createElement("div");
				cnt.appendChild(el);

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = "납품일";

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = getYmdSlashShort(this.supplied);

			} else {
				el = document.createElement("div");
				cnt.appendChild(el);

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = "납품일";

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerHTML = "<div><input type='date'/></div><div class='suppliedFile'></div><div><input type='file'/></div>";

			}

		}


		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "검수";
		el.setAttribute("style", "display:flex;justify-content:center;grid-column:span 2;");



		if ($(".contract-progress").children()[3].className == "contract-doing") {

			// 검수일 
			if (this.delivered != 0) {

				el = document.createElement("div");
				cnt.appendChild(el);

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = "검수일";

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = getYmdSlashShort(this.delivered);

			} else {
				el = document.createElement("div");
				cnt.appendChild(el);

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerText = "검수일";

				el = document.createElement("div");
				cnt.children[cnt.children.length - 1].appendChild(el);
				el.innerHTML = "<div><input type='date'/></div><div class='deliveredFile'></div><div><input type='file'/></div>";
			}

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

	getReportDetail(docNo, obj) {

		fetch(apiServer + "/api/gw/app/doc/" + docNo)
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
			console.log(response);
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				console.log(data);
				R.contract = new Contract(data);
				R.contract.getReportNo(obj);

			} else {
				console.log(response.msg);
			}
		});

}

function removeContract() {
	R.contract.remove();
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


function openPreviewTab() {

	window.open("/business/contract/popup/" + storage.reportDetailData.docNo, "미리보기", "width :210mm");

}


// 계약 등록 모달창 띄움 
function contractInsertForm() {
	let html, dataArray;

	dataArray = [

		{
			"title": "영업기회(*)",
			"elementId": "sopp",
			"complete": "sopp",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"disabled": false,
		},
		{
			"title": "담당자(*)",
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"elementId": "employee",
		},
		{
			"title": "(부)담당자",
			"elementId": "employee2",
			"disabled": false,
			"complete": "user",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "판매방식(*)",
			"selectValue": [
				{
					"key": "10173",
					"value": "조달직판",
				},
				{
					"key": "10174",
					"value": "조달간판",
				},
				{
					"key": "10175",
					"value": "조달대행",
				},
				{
					"key": "10176",
					"value": "직접판매",
				}
			],
			"elementId": "salesType",
			"type": "select",
			"disabled": false,
		},
		{
			"title": "매출처(*)",
			"elementId": "customer",
			"disabled": false,
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "매출처 담당자",
			"elementId": "cipOfCustomer",
			"disabled": false,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저(*)",
			"elementId": "endUser",
			"disabled": false,
			"complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "엔드유저 담당자",
			"elementId": "cipOfendUser",
			"disabled": false,
			"complete": "cip",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
		},
		{
			"title": "발주일자",
			"elementId": "saleDate",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "검수일자",
			"elementId": "delivered",
			"disabled": false,
			"type": "date",
		},
		{
			"title": "계약금액",
			"elementId": "contractAmount",
			"disabled": false,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "VAT 포함여부",
			"selectValue": [
				{
					"key": true,
					"value": "포함",
				},
				{
					"key": false,
					"value": "미포함",
				},
			],
			"type": "select",
			"elementId": "taxInclude",
			"disabled": false,
		},
		{
			"title": "매출이익",
			"elementId": "profit",
			"disabled": false,
			"keyup": "inputNumberFormat(this);",
		},
		{
			"title": "",
		},
		{
			"title": "계약명(*)",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용",
			"type": "textarea",
			"elementId": "detail",
			"disabled": false,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray, "modal");
	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text("계약등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "contractInsert();");
	modal.close.attr("onclick", "modal.hide();");

	storage.formList = {
		"contractType": "",
		"sopp": 0,
		"employee": storage.my,
		"salesType": "",
		"customer": 0,
		"cipOfCustomer": 0,
		"endUser": 0,
		"cipOfendUser": 0,
		"saleDate": "",
		"delivered": "",
		"employee2": 0,
		"startOfFreeMaintenance": "",
		"endOfFreeMaintenance": "",
		"startOfPaidMaintenance": "",
		"endOfPaidMaintenance": "",
		"contractAmount": 0,
		"taxInclude": "",
		"profit": 0,
		"title": "",
		"detail": ""
	};

	setTimeout(() => {
		let my = storage.my, nowDate;
		nowDate = new Date().toISOString().substring(0, 10);
		$("[name='contractType']").eq(0).prop("checked", true);
		$("#startOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#endOfPaidMaintenance").parents(".defaultFormLine").hide();
		$("#employee").val(storage.user[my].userName);
		$("#employee").attr("data-change", true);
		$("#saleDate, #delivered, #startOfFreeMaintenance, #endOfFreeMaintenance, #startOfPaidMaintenance, #endOfPaidMaintenance").val(nowDate);
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);





}
