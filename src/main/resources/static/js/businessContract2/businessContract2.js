
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
		let page = storage.currentPage * 13;
		console.log(this.list.length + "함수 실행 확인");
		let x, ctrt, el, svg;
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

	drawDetail() {
		let el;
		let cnt = document.getElementsByClassName("detail-wrap")[0];
		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "관리자";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = storage.user[this.employee].userName;

		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "담당자";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.coWorker == null ? "" : this.coWorker;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "매출처";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = storage.customer[this.customer].name;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "매출처 담당자";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.cipOfCustomer == 0 ? "" : storage.cip[this.cipOfCustomer].name;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "엔드유저";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.endUser == 0 ? "" : storage.customer[this.endUser].name;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "엔드유저 담당자";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.cipOfendUser == 0 ? "" : storage.cip[this.cipOfendUser].name;;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "발주일자";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.delivered;

		el = document.createElement("div");
		cnt.appendChild(el);
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "검수일자";
		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.supplied;

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
		child.innerText = "등록일 : " + this.created;

		child = document.createElement("name");
		el.appendChild(child);
		child.innerText = this.title;

		child = document.createElement("div");
		el.appendChild(child);
		child.innerText = "담당자 : " + storage.user[this.employee].userName;

		child = document.createElement("div");
		el.appendChild(child);
		child.innerText = "계약금액 : " + this.contractAmount.toLocaleString() + "원";



	}

	drawDetail(parent) {
		let origin = document.getElementsByClassName("detail-wrap")[0];

		if (origin != undefined) origin.remove();

		let cnt, el, el2;
		el = document.createElement("div");
		el.className = "detail-wrap";
		parent.after(el);
		cnt = document.getElementsByClassName("detail-wrap")[0];

		// contract-progress Div 
		el = document.createElement("bar");
		el.className = "contract-progress"
		cnt.appendChild(el);

		el2 = document.createElement("div");
		el.append(el2);
		el2.className = "contract-done";
		el2.innerText = "판매보고";

		el2 = document.createElement("div");
		el.append(el2);

		el2.className = "contract-done";
		el2.innerText = "계약서";

		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied == 0) {
			el2.className = "contract-doing";
		} else {
			el2.className = "contract-done";
		}
		el2.innerText = "납품";

		el2 = document.createElement("div");
		el.append(el2);
		if (this.supplied != 0 && this.delivered == 0) {
			el2.className = "contract-doing";
		} else if (this.supplied != 0 && this.delivered != 0) {
			el2.className = "contract-done";
		}
		el2.innerText = "검수";

		// 계약금액 
		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "● 계약 금액 : ";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.contractAmount.toLocaleString() + "원";

		// 판매보고

		// fetch(apiServer + "/api//" + no)
		// .catch((error) => console.log("error:", error))
		// .then(response => response.json())
		// .then(response => {
		// 	let data;
		// 	if (response.result === "ok") {
		// 		data = response.data;
		// 		data = cipher.decAes(data);
		// 		data = JSON.parse(data);
		// 		console.log(data);
		// 		R.contract = new Contract(data);
		// 		R.contract.drawDetail(obj);

		// 	} else {
		// 		console.log(response.msg);
		// 	}
		// });









		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "● 판매 보고 : ";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = this.contractAmount.toLocaleString() + "원";

		// 계약서 (첨부파일)
		if (this.attached.length > 0) {

			el = document.createElement("div");
			cnt.appendChild(el);

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = "● 계약서 : ";

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);

			let filesList = "";
			for (let i = 0; i < this.attached.length; i++) {

				filesList += "<div><a href='/api/attached/contract/" +
					this.no +
					"/" +
					encodeURI(this.attached.fileName) +
					"'>" +
					this.attached.fileName +
					"</a></div>";
			}

			cnt.children[cnt.children.length - 1].children[1].innerHTML = filesList;

		}

		// 유지보수 
		if (this.maintenance.length > 0) {
			el = document.createElement("div");
			cnt.appendChild(el);

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = "● 유지 보수 : ";

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);

			let mtnc = this.maintenance;
			let mtncList = "";
			for (let i = 0; i < mtnc.length; i++) {
				mtncList += "<div>" +
					"<div>" + getYmdSlashShort(mtnc[i].startDate) + "</div>" +
					"&nbsp" + "~" + "&nbsp" +
					"<div>" + getYmdSlashShort(mtnc[i].endDate) + "</div>" +
					"</div>";

			}
			cnt.children[cnt.children.length - 1].children[1].innerHTML = mtncList;

		}

		// 납품일
		if (this.supplied != 0) {

			el = document.createElement("div");
			cnt.appendChild(el);

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = "● 납품일 : ";

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = getYmdSlashShort(this.supplied);

		}

		// 검수일 
		if (this.supplied != 0) {

			el = document.createElement("div");
			cnt.appendChild(el);

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = "● 검수일 : ";

			el = document.createElement("div");
			cnt.children[cnt.children.length - 1].appendChild(el);
			el.innerText = getYmdSlashShort(this.delivered);

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
				R.contract.drawDetail(obj);

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
