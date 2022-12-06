
let R = {}, prepareSopp, scrolledSopp, moveToTarget;

$(document).ready(() => {
	let href, no
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	href = location.href.split("/contract2/");
	no = href.length > 1 ? href[href.length - 1] : null;
	console.log(no);
	no = no !== null ? no * 1 : null;
	prepareContract(no);
});

prepareContract = (no) => {
	if (no === null) {
		console.log("contract no is null!!!");
		return;
	}
	fetch(apiServer + "/api/contract/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data, sopp;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				console.log(data);
				R.contract = new Contract(data);
				R.contract.drawProgress();
				R.contract.drawDetail();

			} else {
				console.log(response.msg);
			}
		});

} // End of prepareSopp()

scrolledSopp = (el) => {
	let x, y, z, v, els, position = [], vr = 100;

	v = el.scrollTop + vr;
	els = document.getElementsByClassName("sopp-sub-title");
	for (x = 0; x < els.length; x++)	position.push(els[x].offsetTop);

	for (x = 0; x < position.length; x++)   if (v < position[x]) break;

	console.log(position);
	console.log("v : " + v + " / x : " + x);
	els = document.getElementsByClassName("sopp-tab-cnt")[0].children;
	z = el.scrollHeight - el.offsetHeight + vr - 2;
	if (v > z) {
		for (y = 0; y < els.length; y++) {
			if (y < els.length - 1) els[y].className = "sopp-tab";
			else els[y].className = "sopp-tab-select";
		}
	} else {
		for (y = 0; y < els.length; y++) {
			if (y === x) els[y].className = "sopp-tab-select";
			else els[y].className = "sopp-tab";
		}
	}
} // End of scrolledSopp()

moveToTarget = (el) => {
	let target, name;
	name = el.dataset.target;
	target = document.getElementsByClassName(name)[0];
	target.scrollIntoView({ "behavior": "smooth" });
} // End of moveToTarget()




// ================================= C L A S S _ D E C L A R A T I O N =================================

class Sopp2 {
	constructor(each) {
		this.no = each.no;
		this.stage = each.stage;
		this.title = each.title;
		this.desc = each.desc;
		this.owner = each.owner;
		this.coWorker = each.coWorker == undefined ? null : JSON.parse(each.coWorker);
		this.customer = each.customer;
		this.picOfCustomer = each.picOfCustomer;
		this.partner = each.partner;
		this.picOfPartner = each.picOfPartner;
		this.expactetSales = each.expactetSales;
		this.expactedDate = each.expactedDate === undefined ? null : new Date(each.expactedDate);
		this.related = each.related == undefined ? {} : JSON.parse(each.related);
		this.closed = each.closed === undefined ? null : new Date(each.closed);
		this.created = each.created === undefined ? null : new Date(each.created);
		this.modified = each.modified === undefined ? null : new Date(each.modified);
	}
	isClosed() { return this.closed !== null; }

	getEmployee(arr) {
		let x;
		if (arr === undefined || arr === null || arr.constructor.name !== "Array") arr = new Array();
		if (this.owner !== undefined && this.owner !== null && !arr.includes(this.owner)) arr.push(this.owner);
		if (this.coWorker != null) for (x = 0; x < this.coWorker.length; x++)	if (this.coWorker[x] !== undefined && this.coWorker[x] !== null && !arr.includes(this.coWorker[x])) arr.push(this.coWorker[x]);
		return arr;
	} // End of getEmployee()

	ownerName() {
		let owner, name = "...", html, x;
		owner = storage.user[this.owner];
		if (owner !== undefined && owner !== null) {
			owner = owner.userName;
			if (owner !== undefined && owner !== null) name = owner;
		}
		html = ("<img src=\"/api/user/image/" + this.owner + "\" class=\"employee_image\" /><span>" + name + "</span>")

		if (this.coWorker != null) for (x = 0; x < this.coWorker.length; x++) {
			name = "...";
			owner = storage.user[this.coWorker[x]];
			if (owner !== undefined && owner !== null) {
				owner = owner = owner.userName;
				if (owner !== undefined && owner !== null) name = owner;
			}
			html += ("<img src=\"/api/user/image/" + this.coWorker[x] + "\" class=\"employee_image\" /><span>" + name + "</span>")
		}

		return html;
	} // End of ownerName()

	draw() {
		let cnt;

		cnt = document.getElementsByClassName("content-title")[0];
		cnt.innerText = cnt.innerText + " : " + this.title;
	} // End of draw()

	drawList(cnt) {
		let el, x, z, lb = ["개설", "접촉", "제안", "견적", "협상", "계약", "종료"], html;

		if (this.stage < 6) cnt.className = cnt.className + " sopp-doing";
		else if (this.stage === 6) cnt.className = cnt.className + " sopp-done";
		else cnt.className = cnt.className + " sopp-fail";

		cnt.setAttribute("onclick", "location.href='/business/sopp2/" + this.no + "'");

		el = document.createElement("name");
		cnt.appendChild(el);
		el.innerText = this.title;

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "예상매출액 : ₩ " + this.expactetSales.toLocaleString();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerHTML = this.ownerName();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = this.created.toISOString().substring(0, 10) + " » " + (this.expactedDate == null ? "미정" : this.expactedDate.toISOString().substring(0, 10));

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "견적 : 0건";

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "⋮";
		el.setAttribute("onclick", "showProjectMenu(this,2)");

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "예상마진 : 99%";

		el = document.createElement("div");
		cnt.appendChild(el);
		el.className = "progress";
		html = "";
		z = 100;
		for (x = 0; x < lb.length; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + " style=\"z-index:" + (z--) + ";\">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()
} // End of Class _ Sopp2




class Contract {
	constructor(each) {
		this.title = each.title == undefined ? null : each.title;
		this.employeee = each.employee == undefined ? null : each.employee;
		this.coWorker = each.coWorker == undefined ? null : each.coWorker;
		this.customer = each.customer == undefined ? null : each.customer;
		this.cipOfCustomer = each.cipOfCustomer == undefined ? null : each.cipOfCustomer;
		this.detail = each.detail == undefined ? null : each.detail;
		this.endUser = each.endUser == undefined ? null : each.endUser;
		this.cipOfendUser = each.cipOfendUser == undefined ? null : each.cipOfendUser;
		this.supplier = each.supplier == undefined ? null : each.supplier;
		this.cipOfSupplier = each.cipOfSupplier == undefined ? null : each.cipOfSupplie;
		this.supplied = each.supplied == undefined ? null : each.supplied;
		this.delivered = each.delivered == undefined ? null : each.delivered;
		this.taxInclude = each.taxInclude == undefined ? null : each.taxInclude;
		this.profit = each.profit == undefined ? null : each.profit;
	}

	drawProgress() {
		let el;

		let cnt;
		cnt = document.getElementsByClassName("content-title")[0];
		cnt.innerText = cnt.innerText + " : " + this.title;

		let progressCnt;
		progressCnt = document.getElementsByClassName("sopp-progress")[0];

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-done";
		el.innerText = "개 설";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-done";
		el.innerText = "접 촉";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-done";
		el.innerText = "제 안";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-done";
		el.innerText = "견 적";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-done";
		el.innerText = "협 상";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.className = "sopp-doing";
		el.innerText = "계 약";

		el = document.createElement("div");
		progressCnt.appendChild(el);
		el.innerText = "종 료";


	}


	drawDetail() {
		let el;
		let cnt = document.getElementsByClassName("sopp-info")[0];
		el = document.createElement("div");
		cnt.appendChild(el);

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el);
		el.innerText = "관리자";

		el = document.createElement("div");
		cnt.children[cnt.children.length - 1].appendChild(el)
		el.innerText = storage.user[this.employeee].userName;

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

} // End of Class Contract 

