let R = {}, prepareSopp, scrolledSopp, moveToTarget, drawChat, inputtedComment, deleteChat, cancleEdit, editSopp, changeSopp, editSoppSearch, soppStageUp, clickedDateInCalendar, newScheduleSelectTime;

$(document).ready(() => {
	let href, no
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	href = location.href.split("/sopp2/");
	no = href.length > 1 ? href[href.length - 1] : null;
	no = no !== null && no.substring(no.length - 1) === "#" ? no.substring(0, no.length - 1) : no;
	no = no !== null ? no * 1 : null;
	prepareSopp(no);
});

// 일정 신규 등록에서 시간을 클릭할 때 실행되는 함수
newScheduleSelectTime = (el) => {
	let cnt, dts, dte, start, end, x, y, z;
	cnt = el.parentElement;
	dts = cnt.dataset.s;
	dte = cnt.dataset.e;

	if(dte === "x"){ // 두번째 선택일 때
		start = dts *1;
		end = (el.dataset.h*100) + (el.dataset.m*1);
		end = (end % 100 === 30) ? end + 70 : end + 30;
		cnt.dataset.e = end;
		for(x = 1 ; x < cnt.children.length - 1 ; x++){
			z = (cnt.children[x].dataset.h*100) + (cnt.children[x].dataset.m*1)
			if(z >= start && z < end){
				cnt.children[x].className = "new-schedule-time-select";
			}
		}
	}else{ // 첫번째 선택일 때
		start = (el.dataset.h*100) + (el.dataset.m*1);
		cnt.dataset.s = start;
		cnt.dataset.e = "x";
		for(x = 1 ; x < cnt.children.length - 1 ; x++)	cnt.children[x].className = "new-schedule-time-empty";
		el.className = "new-schedule-time-select";
	}
	
} // End of newScheduleSelectTime()

// 달력의 날짜 클릭 이벤트 핸들러
clickedDateInCalendar = (el) => {
	let dt, sch;

	sch = new Schedule();
	dt = new Date(el.dataset.v * 1);
	sch.requestDetail(dt);
} // End of clickedDateInCalendar()

soppStageUp = () => {
	href = location.href.split("/sopp2/");
	no = href.length > 1 ? href[href.length - 1] : null;
	no = no !== null ? no * 1 : null;

	if (true) {
		window.open("/gw/estimate/"+no+"", '', 'width:60%');
		// gw/extimate/soppNo 넣으면 됨 

	}
} // End of soppStageUp()

prepareSopp = (no) => {
	if (no === null) {
		console.log("SOPP no is null!!!");
		return;
	}
	fetch(apiServer + "/api/project/sopp/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data, sopp, projectOwner;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				console.log(data);
				R.projectOwner = data.projectOwner;
				R.chat = data.chat;
				R.sopp = new Sopp2(data.sopp);
				R.sopp.draw();
				drawChat();

				setTimeout(() => {
					EstimateSet = new EstimateSet();
					EstimateSet.soppEstimateNo(R.sopp.no);
					drawDetail(R.sopp.no);
				}, 1000);


			} else {
				console.log(response.msg);
			}
		});

} // End of prepareSopp()

// 편집 취소 함수
cancleEdit = (el) => {
	el.parentElement.parentElement.parentElement.className = "sopp-history";
	el.parentElement.parentElement.nextElementSibling.innerHTML = "";
	el.parentElement.previousSibling.innerHTML = "";
} // End of cancleEdit()

editSopp = (n) => {
	let x, y, dept, arr, el1, el2, cnt = document.getElementsByClassName("container")[0].children[1];
	if (n === undefined || typeof n !== "string") return;
	cnt.className = "sopp-search";
	document.getElementsByClassName("container")[0].children[1].children[5].children[0].dataset.n = n;

	switch (n) {
		case "owner":
			cnt.children[4].style.padding = "0.7rem";
			cnt.children[4].innerHTML = storage.dept.tree.getTreeHtml();
			y = cnt.children[4].getElementsByTagName("label");
			cnt.children[3].children[0].innerHTML = "관리자 변경";
			cnt.children[3].children[1].children[1].style.display = "none";
			arr = [];
			for (x = 0; x < y.length; x++) {
				if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:" && R.sopp.owner !== y[x].getAttribute("for").substring(4) * 1) {
					y[x].setAttribute("onclick", "changeSopp('owner'," + y[x].getAttribute("for").substring(4) + ")");
				}
			}
			break;

		case "coWorker":
			cnt.children[4].style.padding = "0.7rem";
			cnt.children[4].innerHTML = storage.dept.tree.getTreeHtml();
			y = cnt.children[4].getElementsByTagName("label");
			cnt.children[3].children[0].innerHTML = "담당자 변경";
			cnt.children[3].children[1].children[1].style.display = "";
			cnt.children[3].children[1].children[1].setAttribute("onclick", "changeSopp('coWorker')");
			arr = [];
			for (x = 0; x < y.length; x++) {
				if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:") {
					y[x].setAttribute("onclick", "if(this.dataset.s === undefined){this.dataset.s=1;this.children[0].style.backgroundColor='#ffe6e6'}else{delete this.dataset.s;this.children[0].style.backgroundColor=''}");
				}
			}
			break;

		case "partner":
		case "customer":
			cnt.children[3].children[0].innerText = (n === "customer" ? "고객사" : "협력사") + " 변경";
			cnt.children[3].children[1].children[1].style.display = "none";
			cnt = cnt.children[4];
			cnt.style.padding = "0.7rem";
			if (n === "partner") {
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp('" + n + "', " + -1 + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = "<없음>";
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el1.appendChild(el2);
			}
			for (x in storage.customer) {
				if (x === undefined) continue;
				y = "...";
				y = storage.customer[x] !== undefined ? storage.customer[x].name : y;
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp('" + n + "', " + x + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = y;
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el2.innerText = x;
				el1.appendChild(el2);
			}
			cnt.nextElementSibling.children[0].focus();
			break;
	}
} // End of editSopp()

changeSopp = (n, v) => {
	let x, y, arr, cnt = document.getElementsByClassName("container")[0].children[1];

	switch (n) {
		case "coWorker":
			y = cnt.children[4].getElementsByTagName("label");
			arr = [];
			for (x = 0; x < y.length; x++)	if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:" && y[x].dataset.s === "1") arr.push(y[x].getAttribute("for").substring(4) * 1);
			cnt.children[3].children[1].children[1].removeAttribute("onclick");
			R.sopp.coWorker = arr;
			//R.sopp.update(n);
			break;

		case "owner":
		case "partner":
		case "customer":
			R.sopp[n] = v === -1 ? undefined : v;
			//R.sopp.update(n);
			break;
	}

	document.getElementsByClassName("container")[0].children[1].className = "sopp-history";
	document.getElementsByClassName("container")[0].children[1].children[4].innerHTML = "";
} // End of changeSopp()

editSoppSearch = (el) => {
	let x, y, cnt, els, el1, el2, v;
	v = el.value;
	cnt = el.parentElement.previousElementSibling;
	if (el.dataset.n === "owner" || el.dataset.n === "coWorker") {
		els = cnt.getElementsByTagName("label");
		for (x = 0; x < els.length; x++) {
			if (els[x].getAttribute("for") !== null && els[x].getAttribute("for").substring(0, 4) === "emp:") {
				if (v === "" || els[x].innerText.includes(v)) els[x].style.display = "";
				else els[x].style.display = "none";
			}
		}
	} else if (el.dataset.n === "customer" || el.dataset.n === "partner") {
		cnt.innerHTML = "";
		if (el.dataset.n === "partner") {
			el1 = document.createElement("div");
			el1.setAttribute("onclick", "changeSopp(" + el.dataset.n + ", " + -1 + ")");
			el1.style.cursor = "pointer";
			cnt.appendChild(el1);
			el2 = document.createElement("span");
			el2.style.fontSize = "0.8rem";
			el2.innerText = "<없음>";
			el1.appendChild(el2);
			el2 = document.createElement("span");
			el2.style.fontSize = "0.8rem";
			el2.style.color = "gray";
			el1.appendChild(el2);
		}
		for (x in storage.customer) {
			if (x === undefined) continue;
			y = "...";
			y = storage.customer[x] !== undefined ? storage.customer[x].name : y;
			if (v === "" || (y !== "..." && (x.includes(v) || y.includes(v)))) {
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp(" + el.dataset.n + ", " + x + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = y;
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el2.innerText = x;
				el1.appendChild(el2);
			}
		}
	}
} // End of editSoppSearch()

drawChat = () => {
	let x, y, chat, html, name, dt, cnt;

	cnt = document.getElementsByClassName("sopp-history")[0].children[1];
	html = "";
	for (x = 0; x < R.chat.length; x++) {
		chat = R.chat[x];
		dt = chat.created;
		if (dt !== undefined) {
			y = new Date(dt);
			dt = (y.getFullYear() % 100) + ".";
			dt += (y.getMonth() + 1) + ".";
			dt += y.getDate() + " ";
			dt += y.getHours() + ":";
			dt += y.getMinutes();
		} else dt = "";
		chat.message = chat.message.replaceAll("<", "&lt;");
		chat.message = chat.message.replaceAll(">", "&gt;");
		name = "...";
		if (storage.user[chat.writer] !== undefined && storage.user[chat.writer].userName !== undefined) name = storage.user[chat.writer].userName;
		html += "<div>";
		html += ("<img src=\"" + (chat.isNotice > 0 ? "/images/sopp2/info_circle.png" : "/api/user/image/" + chat.writer) + "\" class=\"profile-small\" />");
		html += ("<div class=\"history-employee\">" + name + "</div>");
		html += ("<div class=\"history-date\">" + dt + "</div>");
		if (chat.isNotice === 0 && chat.writer === storage.my) html += ("<img src=\"/images/sopp2/circle_close.png\" class=\"history-delete\" onclick=\"deleteChat(" + x + ")\" />");
		html += ("<div class=\"history-comment\">" + chat.message + "</div>");
		html += "</div>";
	}
	cnt.innerHTML = html;
} // End of drawChat()

// chat 삭제 처리 함수
deleteChat = (no) => {
	let idx;
	if (no === undefined || R.chat[no] === undefined) return;
	idx = R.chat[no].idx;

	fetch(apiServer + "/api/project/sopp/chat/" + idx, {
		method: "DELETE",
		header: { "Content-Type": "text/plain" },
	}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			if (response.result === "ok") {
				R.chat.splice(no, 1);
				drawChat();
			} else {
				console.log("error on deleteChat(" + no + ")");
			}
		});

} // End of deleteChat()

// chat 입력 처리 함수
inputtedComment = (el, event) => {
	let message, stage, sopp;
	if (!(el.tagName === "BUTTON" || event.key === "Enter")) return;
	if (el.tagName === "BUTTON") el = el.previousElementSibling;
	message = el.value;
	if (message === undefined || message === "") return;
	stage = R.sopp.stage;
	sopp = R.sopp.no;

	fetch(apiServer + "/api/project/sopp/chat/" + sopp + "/" + stage, {
		method: "POST",
		header: { "Content-Type": "text/plain" },
		body: cipher.encAes(message)
	}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let v = {};
			if (response.result === "ok") {
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].value = "";
				v.idx = response.data;
				v.isNotice = 0;
				v.writer = storage.my;
				v.stage = R.sopp.stage;
				v.message = message;
				v.created = (new Date()).getTime();
				R.chat.push(v);
				drawChat();
			} else {
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].focus();
			}
		});
} // End of inputtedComment()

scrolledSopp = (el) => {
	let x, y, z, v, els, position = [], vr = 60;

	v = el.scrollTop + vr;
	els = document.getElementsByClassName("sopp-sub-title");
	for (x = 0; x < els.length; x++)	position.push(els[x].offsetTop);

	for (x = 0; x < position.length; x++)   if (v < position[x]) break;

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
	let target, name, vr = 83;
	name = el.dataset.target;
	target = document.getElementsByClassName(name)[0];
	target.parentElement.scrollTo({
		top: target.offsetTop - vr,
		left: 0,
		behavior: 'smooth'
	});
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
		this.closed = each.closed == undefined ? null : new Date(each.closed);
		this.created = each.created == undefined ? null : new Date(each.created);
		this.modified = each.modified == undefined ? null : new Date(each.modified);
		this.calendar = [];
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
		let cnt, x, y, j, name, html, month = [], dt, el, cal;

		// 제목 설정
		cnt = document.getElementsByClassName("content-title")[0].children[0];
		cnt.innerText = "영업기회 : " + this.title;

		// 관리자
		cnt = document.getElementsByClassName("sopp-info")[0].children[0].children[1].children[0];
		name = "...";
		html = "<img src=\"/api/user/image/" + R.sopp.owner + "\" class=\"profile-small\" />";
		if (storage.user[R.sopp.owner] !== undefined && storage.user[R.sopp.owner].userName !== undefined) name = storage.user[R.sopp.owner].userName;
		html += name;
		cnt.innerHTML = html;

		// 담당자
		cnt = cnt = document.getElementsByClassName("sopp-info")[0].children[1].children[1].children[0];
		html = "";
		if (R.sopp.coWorker !== undefined && R.sopp.coWorker.constructor.name === "Array") for (x = 0; x < R.sopp.coWorker.length; x++) {
			name = "...";
			html += ("<img src=\"/api/user/image/" + R.sopp.coWorker[x] + "\" class=\"profile-small\" />");
			if (storage.user[R.sopp.coWorker[x]] !== undefined && storage.user[R.sopp.coWorker[x]].userName !== undefined) name = storage.user[R.sopp.coWorker[x]].userName;
			html += (name + " ");
		}
		cnt.innerHTML = html;

		// 고객사
		cnt = document.getElementsByClassName("sopp-info")[0].children[2].children[1].children[0];
		name = "...";
		html = "";
		if (storage.customer[R.sopp.customer] !== undefined && storage.customer[R.sopp.customer].name !== undefined) name = storage.customer[R.sopp.customer].name;
		html += name;
		cnt.innerHTML = html;

		// 협력사
		cnt = document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[0];
		html = "";
		name = "...";
		if (R.sopp.partner === undefined) name = "&lt;없음&gt;";
		else if (R.sopp.partner != undefined && typeof R.sopp.partner === "number") if (storage.customer[R.sopp.partner] !== undefined && storage.customer[R.sopp.partner].name !== undefined) name = storage.customer[R.sopp.partner].name;
		html += name;
		cnt.innerHTML = html;

		// ============= 예상매출
		// 예상매출액
		cnt = document.getElementsByClassName("sopp-expected")[0].children[0].children[1];
		x = 0;
		if (R.sopp.expactetSales !== undefined && R.sopp.expactetSales !== null && typeof R.sopp.expactetSales === "number") x = R.sopp.expactetSales.toLocaleString();
		cnt.innerText = x;
		// 시작일
		cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[0];
		x = R.sopp.created;
		y = "'" + (x.getFullYear() % 100) + ".";
		y += ((x.getMonth() + 1) + ".");
		y += x.getDate();
		cnt.innerText = y;
		// 예상매출일
		x = R.sopp.expactedDate;
		if (x !== undefined && x !== null && typeof x === "object" && x.constructor.name === "Date") {
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[2];
			y = "'" + (x.getFullYear() % 100) + ".";
			y += ((x.getMonth() + 1) + ".");
			y += x.getDate();
			cnt.innerText = y;
			// 날짜 진행바
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[1].children;
			x = R.sopp.expactedDate.getTime() - R.sopp.created.getTime();
			y = (new Date()).getTime() - R.sopp.created.getTime();
			x = Math.floor(y * 1000 / x) / 10;
			x = x < 0 ? 0 : x > 100 ? 100 : x;
			cnt[0].style.width = x + "%";
			cnt[1].style.left = "calc(" + x + "% - 0.3rem)";
		}

		// 스테이지바
		html = "";
		y = ["<T>개</T><T>설</T>", "<T>접</T><T>촉<T>", "<T>제</T><T>안</T>", "<T>견</T><T>적</T>", "<T>협</T><T>상</T>", "<T>계</T><T>약</T>", "<T>종</T><T>료</T>"];

		cnt = document.getElementsByClassName("sopp-progress")[0];
		for (x = 0; x < y.length; x++) {
			html += ("<div " + (x < R.sopp.stage ? " class=\"sopp-done\"" : (x === R.sopp.stage ? " class=\"sopp-doing\"" : (x === R.sopp.stage + 1 ? " onclick=\"soppStageUp(" + R.sopp.stage + ")\" style=\"cursor:pointer;\"" : ""))) + ">" + y[x] + "</div>");
		}
		cnt.innerHTML = html;

		// 달력
		x = 0;
		y = new Date();
		y = new Date(y.getFullYear(), y.getMonth() + 1, 1);
		cnt = document.getElementsByClassName("sopp-calendar")[0];
		dt = new Date(this.created.getFullYear(), this.created.getMonth(), 1);
		month.push(dt);
		while (dt.getTime() < y.getTime()) {
			x++;
			dt = new Date(dt.getFullYear(), dt.getMonth() + 1, 1);
			month.push(dt);
			console.log(month);
			if (dt.getTime() > (new Date()).getTime()) break;
			if (x > 100) break;
		}
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 1, 1));
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 2, 1));
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 3, 1));

		for (x = 0; x < month.length; x++) {
			el = document.createElement("div");
			if (x < month.length - 1) el.style.display = "none";
			cnt.appendChild(el);
			dt = month[x];
			cal = new BizCalendar(dt.getFullYear(), dt.getMonth() + 1, el);
			this.calendar.push(cal);
			cal.drawForSopp();
		}
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
		for (x = 0; x < lb.length; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + ">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()

	update() {
		let json = Object.assign({}, this), data;

		delete json.calendar;
		json.created = (json.created === undefined || json.created === null) ? null : json.created.getTime();
		json.closed = (json.closed === undefined || json.closed === null) ? null : json.closed.getTime();
		json.modified = (json.modified === undefined || json.modified === null) ? null : json.modified.getTime();
		json.expactedDate = (json.expactedDate === undefined || json.expactedDate === null) ? null : json.expactedDate.getTime();
		json.coWorker = (json.coWorker === undefined || json.coWorker === null) ? null : JSON.stringify(json.coWorker);
		json.related = (json.related === undefined || json.related === null) ? null : JSON.stringify(json.related);
		data = JSON.stringify(json);
		data = cipher.encAes(data);
		fetch(apiServer + "/api/project/sopp", {
			method: "POST",
			header: { "Content-Type": "text/plain" },
			body: data
		}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let sopp, prjNo, x;
				console.log(response);
				if (response.result === "ok") {
					x = response.data;
					x = cipher.decAes(x)
					x = JSON.parse(x);
					sopp = new Sopp2(x);
					console.log(sopp);
					prjNo = sopp.related.parent;
					if (prjNo !== undefined) prjNo = prjNo.split(":")[1];
					if (prjNo !== undefined && R !== undefined && R.project !== undefined && R.project.list !== undefined) {
						prjNo = prjNo * 1;
						for (x = 0; x < R.project.list.length; x++) {
							if (R.project.list[x].no === prjNo) {
								R.project.list[x].addSopp(sopp);
								R.project.list[x].draw();
								break;
							}
						}
					}

				} else {
					console.log(response.msg);
				}
			});
		console.log("UPDATE SOPP!!");
	}
} // End of Class _ Sopp2

class BizCalendar {
	constructor(year, month, container) {
		let startDate, endDate, dt = new Date();
		if (year === undefined || isNaN(year)) year = dt.getFullYear();
		if (month === undefined || isNaN(month)) month = dt.getMonth() + 1;
		startDate = new Date(year, month - 1, 1);
		endDate = new Date(new Date(year, month, 1).getTime() - 86400000);
		this.year = year;
		this.month = month;
		this.container = container === undefined ? null : container;
		this.startDate = new Date(startDate.getTime() - startDate.getDay() * 86400000); // 달력 시작하는 날짜 잡기
		this.endDate = new Date(endDate.getTime() + (6 - endDate.getDay()) * 86400000); // 달력 끝나는 날 찾기
	}
	drawForSopp() {
		let headCnt, bodyCnt, x, y, z, w, dt, weeks, html, bColor;
		if (this.container === null) return;
		bColor = ["#fbe4e8", "#cbf6ce", "#e4e3f1", "#ffd890", "#c8edff", "#F5DB02", "#ecc8ff", "#e3e3e3", "#ffdcf3", "#e4f3ca"];
		headCnt = document.createElement("div");
		headCnt.className = "calendar-head";
		bodyCnt = document.createElement("div");
		bodyCnt.className = "calendar-body";
		this.container.appendChild(headCnt);
		this.container.appendChild(bodyCnt);

		// 헤드부분 생성
		html = "<div><img src=\"/images/sopp2/triangle_left.png\" onclick=\"if(this.parentElement.parentElement.parentElement.previousElementSibling !== null){this.parentElement.parentElement.parentElement.previousElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>";
		html += ("<div>" + (this.year + " / " + (this.month)) + "</div>");
		html += ("<div><img src=\"/images/sopp2/triangle_right.png\" onclick=\"if(this.parentElement.parentElement.parentElement.nextElementSibling !== null){this.parentElement.parentElement.parentElement.nextElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>");
		html += ("<div></div>"); // 담당자별 일정 요약
		headCnt.innerHTML = html;

		// 바디부분 생성
		weeks = (this.endDate / 86400000 - this.startDate / 86400000 + 1) / 7;
		bodyCnt.className += (" calendar-week-" + weeks);
		html = "";
		for (x = 0; x < weeks; x++) {
			w = "<div>";
			for (y = 0; y < 7; y++) {
				dt = new Date(this.startDate.getTime() + (x * 7 + y) * 86400000);
				w += ("<div class=\"" + (dt.getMonth() + 1 !== this.month ? "other" : "this") + "-month\" data-v=\"" + dt.getTime() + "\" onclick=\"clickedDateInCalendar(this)\" ><div>" + dt.getDate() + "</div>");
				// w += ("<div><img src=\"/api/user/image/10044\" class=\"profile-small\">이장희</div>");
				w += ("</div>");
			}
			w += "</div>";
			html += w;
		}
		bodyCnt.innerHTML = html;
	} // End of drawForSopp()
} // End of Class _ BizCalendar

class Schedule{
	constructor(){
		this.no;
		this.writer;
		this.title;
		this.content;
		this.report;
		this.type;
		this.from;
		this.to;
		this.related;
		this.created;
		this.modified;
	}
	requestDetail(dt){
		let html, x, start, end, cnt, el, child;
		modal.show();
		modal.headTitle[0].innerText = "일정 신규 등록";

		// 날짜 및 시간 초기화 / 입력된 날짜의 오전 9시부터 오후 6시 까지를 기본값으로 함
		if(dt !== undefined)	this.from = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 9, 0, 0);
		if(dt !== undefined)	this.to = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 18, 0, 0);
		this.writer = storage.my;
		if(this.title === undefined)	this.title = "재목";

		console.log(this.from);
		console.log(this.to);


		// 시간 옵션
		start = 7;
		end = 21;

		// 모달 내 컨테이너 생성 및 부착
		cnt = document.createElement("div");
		cnt.className = "new-schedule";
		modal.body[0].appendChild(cnt);

		// 본문 및 제목 엘리먼트 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);
		html = "<input /><textarea></textarea><div></div>";
		el.innerHTML = html;

		// 날짜/시간 및 상세정보 컨테이너 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);

		// 날짜정보 엘리먼트 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);
		child.innerHTML = this.dateToStr();



		return;


		// ==========================================================

		// 본문
		html = "<div class=\"new-schedule\">";
		html += "<div><input placeholder=\"제목\" /><textarea></textarea><div></div></div>"; // 좌측 제목, 본문

		html += "<div><div><date>2022.12.31</date><time>07:30 ~ 15:30</time></div>"; // 일정설정

		html += ("<div style=\"grid-template-columns:1px repeat(" + (end - start) + ",4fr) 1px;\"><div></div>")
		for(x = start ; x < end ; x++)	html += ("<div>" + x + "</div>");
		html += "<div></div></div>";

		html += ("<div style=\"grid-template-columns:1px repeat(" + ((end - start) * 2) + ",2fr) 1px;\" data-s=\"x\" data-e=\"0\"><div></div>");
		for(x = start ; x < end ; x++)	html += ("<div class=\"new-schedule-time-empty\" data-h=\"" + x + "\" data-m=\"0\" onclick=\"newScheduleSelectTime(this)\"></div><div class=\"new-schedule-time-empty\" data-h=\"" + x + "\" data-m=\"30\" onclick=\"newScheduleSelectTime(this)\"></div>");
		html += "<div></div></div></div>";
		html += "<div></div>"; // 세부 정보
		html += "</div>";

		modal.body[0].innerHTML = html; // <-- 내부 채우기
		//modal.confirm[0].onclick = confirmNewSopp; // <-- 컨펌 버튼
		//modal.close[0].onclick = modal.hide; // <-- 취소버튼
	}
	dateToStr(){ // 시작 및 종료에 대한 문자열을 만들어주는 함수
		let str, s1, s2, e1, e2;
		s1 = "'" + (this.from.getFullYear() % 100) + "." + (this.from.getMonth() + 1) + "." + this.from.getDate();
		e1 = "'" + (this.to.getFullYear() % 100) + "." + (this.to.getMonth() + 1) + "." + this.to.getDate();
		s2 = (this.from.getHours() < 10 ? "0" + this.from.getHours() : this.from.getHours()) + ":" + (this.from.getMinutes() < 10 ? "0" + this.from.getMinutes() : this.from.getMinutes());
		e2 = (this.to.getHours() < 10 ? "0" + this.to.getHours() : this.to.getHours()) + ":" + (this.to.getMinutes() < 10 ? "0" + this.to.getMinutes() : this.to.getMinutes());
		str = "<date>" + s1 + " </date><time>" + s2 + "</time>";
		if(s1 === e1){
			str += ("<span> ~ </span><time>" + e2 + "</time>");
		}else{
			str = "<span> ~ </span><date>" + e1 + " </date><time>" + e2 + "</time>";
		}
		return str;
	}

} // End of Class _ Schedule

function drawDetail(soppNo) {
	let contNo;
	for (let i = 0; i < storage.contract.length; i++) {
		let contSopp = JSON.parse(storage.contract[i].related).parent.split(":");
		if (contSopp[1] == soppNo) {
			contNo = storage.contract[i].no;
		}
	}

	let cnt = document.getElementsByClassName("sopp-contract")[0];
	fetch(location.origin + "/api/contract/" + contNo)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			console.log(response);
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.contract = new Contract(data);
				R.contract.getReportDetail(cnt);

			} else {
				let none;
				R.contract = new Contract(none);
				R.contract.drawNone();
				console.log(response.msg);
			}
		});

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
